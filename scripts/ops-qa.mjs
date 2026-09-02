#!/usr/bin/env node
/**
 * /ops visual QA: sign in with the admin session, visit each ops route at
 * 1920×1080 and 1440×900 (plus 390 mobile for the shell), capture full-page
 * screenshots, and report horizontal overflow, console errors and KPI values
 * that wrap. Output: docs/ops-qa/ (git-ignored).
 *
 *   node --env-file=.env.local scripts/ops-qa.mjs [http://localhost:3000] [route ...]
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [base = "http://localhost:3000", ...only] = process.argv.slice(2);
// Git Bash turns "/ops/x" into a Windows path; accept "ops/x" or anything containing "ops"
const norm = (r) => { const m = r.replace(/\\/g, "/").match(/(ops(?:\/[^\s]*)?)$/); return "/" + (m ? m[1] : r.replace(/^\/+/, "")); };
const ROUTES = only.length ? only.map(norm) : ["/ops", "/ops/proposals", "/ops/clients", "/ops/projects", "/ops/pricing", "/ops/design", "/ops/settings"];
const SIZES = [["1920", 1920, 1080], ["1440", 1440, 900], ["1366", 1366, 768], ["390", 390, 844]];
const SUPA = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON = process.env.PODOS_SUPABASE_ANON_KEY ?? "";
const SECRET = process.env.PODOS_ADMIN_SECRET ?? "";
if (!SECRET || !ANON) { console.error("run with node --env-file=.env.local"); process.exit(1); }
const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find((p) => p && existsSync(p));
if (!CHROME) { console.error("Chrome not found"); process.exit(1); }

const out = path.resolve("docs/ops-qa");
await fs.mkdir(out, { recursive: true });
const login = await fetch(`${SUPA}/rest/v1/rpc/admin_login`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" }, body: JSON.stringify({ p_secret: SECRET, p_user_agent: "ops-qa" }) });
const token = await login.json();
if (typeof token !== "string" || token.length !== 64) { console.error("admin_login failed"); process.exit(1); }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--font-render-hinting=none"] });
const report = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  await page.setCookie({ name: "podos_admin_session", value: token, domain: new URL(base).hostname, path: "/", httpOnly: true });
  for (const route of ROUTES) {
    for (const [tag, w, h] of SIZES) {
      errors.length = 0;
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      const res = await page.goto(`${base}${route}`, { waitUntil: "networkidle0", timeout: 120_000 });
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const wraps = [...document.querySelectorAll("[data-kpi-value]")].filter((el) => el.scrollWidth > el.clientWidth + 1 || el.getClientRects().length > 1).map((el) => el.textContent?.trim());
        return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, height: document.documentElement.scrollHeight, kpiWraps: wraps };
      });
      const file = path.join(out, `${route.replace(/\//g, "_").replace(/^_/, "") || "ops"}-${tag}.png`);
      await page.screenshot({ path: file, fullPage: true });
      report.push({ route, size: tag, status: res?.status(), overflow: m.scrollWidth > m.clientWidth + 1, height: m.height, kpiWraps: m.kpiWraps, consoleErrors: [...errors] });
    }
  }
} finally { await browser.close(); }
console.log(JSON.stringify(report, null, 2));
const bad = report.filter((r) => r.overflow || r.kpiWraps.length || r.consoleErrors.length || (r.status ?? 500) >= 400);
if (bad.length) { console.error(`${bad.length} problem(s)`); process.exitCode = 2; }
