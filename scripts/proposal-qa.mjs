#!/usr/bin/env node
/**
 * Estimate-sheet QA: print the admin /print route for a proposal with headless
 * Chrome (Letter), count pages, render every page at 150 DPI, capture the web
 * sheet at desktop + mobile widths, check for horizontal overflow, and verify
 * the production-style API route returns the same page count.
 *
 *   node --env-file=.env.local scripts/proposal-qa.mjs POD-EST-2026-0002 formal [http://localhost:3000]
 *
 * Output: docs/proposal-qa/ (git-ignored). Needs PODOS_ADMIN_SECRET in env — never printed.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const [publicId = "POD-EST-2026-0002", mode = "formal", base = "http://localhost:3000"] = process.argv.slice(2);
const SUPA = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON = process.env.PODOS_SUPABASE_ANON_KEY ?? "";
const SECRET = process.env.PODOS_ADMIN_SECRET ?? "";
if (!SECRET || !ANON) { console.error("PODOS_ADMIN_SECRET / PODOS_SUPABASE_ANON_KEY missing — run with node --env-file=.env.local"); process.exit(1); }
const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find((p) => p && existsSync(p));
if (!CHROME) { console.error("Chrome not found"); process.exit(1); }

const out = path.resolve("docs/proposal-qa");
await fs.mkdir(out, { recursive: true });
const stem = path.join(out, `${publicId}-${mode}`);

const login = await fetch(`${SUPA}/rest/v1/rpc/admin_login`, {
  method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" },
  body: JSON.stringify({ p_secret: SECRET, p_user_agent: "proposal-qa" }),
});
const token = await login.json();
if (typeof token !== "string" || token.length !== 64) { console.error("admin_login failed", login.status); process.exit(1); }

const { hostname } = new URL(base);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--font-render-hinting=none"] });
const result = { publicId, mode };
try {
  const page = await browser.newPage();
  await page.setCookie({ name: "podos_admin_session", value: token, domain: hostname, path: "/", httpOnly: true });

  // 1) PDF from the print route
  const res = await page.goto(`${base}/ops/proposals/${publicId}/print?mode=${mode}&screen=0`, { waitUntil: "networkidle0", timeout: 120_000 });
  if (!res.ok()) throw new Error(`print route ${res.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMediaType("print");
  await page.pdf({ path: `${stem}.pdf`, format: "Letter", printBackground: true, preferCSSPageSize: true });
  await page.emulateMediaType("screen");

  // 2) web sheet at desktop + mobile; horizontal overflow check
  const shots = {};
  for (const [name, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`${base}/ops/proposals/${publicId}/print?mode=${mode}`, { waitUntil: "networkidle0", timeout: 120_000 });
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, sheetHeight: document.querySelector(".es-sheet")?.getBoundingClientRect().height }));
    await page.screenshot({ path: `${stem}-${name}.png`, fullPage: true });
    shots[name] = { ...m, overflow: m.scrollWidth > m.clientWidth + 1 };
  }
  result.web = shots;

  // 3) API route with the same cookie
  const api = await fetch(`${base}/api/proposal/${publicId}/pdf?mode=${mode}`, { headers: { cookie: `podos_admin_session=${token}` } });
  if (api.ok) await fs.writeFile(`${stem}-api.pdf`, Buffer.from(await api.arrayBuffer()));
  result.api = { status: api.status, sha256: api.headers.get("x-document-sha256"), body: api.ok ? null : (await api.text()).slice(0, 300) };

  // 4) page counts + 150 DPI renders
  const py = `
import fitz, sys
doc = fitz.open(sys.argv[1]); n = len(doc)
for i, p in enumerate(doc):
    p.get_pixmap(dpi=150).save(sys.argv[2] + f"-p{i+1}.png")
print(n)`;
  result.pdf_pages = Number(execFileSync("python", ["-c", py, `${stem}.pdf`, stem]).toString().trim());
  result.api_pages = api.ok ? Number(execFileSync("python", ["-c", "import fitz,sys;print(len(fitz.open(sys.argv[1])))", `${stem}-api.pdf`]).toString().trim()) : null;
  console.log(JSON.stringify(result, null, 2));
  if (Object.values(shots).some((s) => s.overflow)) { console.error("HORIZONTAL OVERFLOW on the web sheet"); process.exitCode = 3; }
  if (result.api_pages !== null && result.api_pages !== result.pdf_pages) { console.error("API PDF PAGE COUNT MISMATCH"); process.exitCode = 4; }
} finally {
  await browser.close();
}
