#!/usr/bin/env node
/**
 * Proposal document QA (brief §22): print the admin /print route for a
 * proposal with headless Chrome, count pages, render every page at 200 DPI
 * and capture the on-screen viewer. Output lands in docs/proposal-qa/.
 *
 *   node --env-file=.env.local scripts/proposal-qa.mjs POD-EST-2026-0002 formal [http://localhost:3000]
 *
 * Needs PODOS_ADMIN_SECRET (+ Supabase URL/key) in the env — never printed.
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

// 1) admin session (same RPC the login form uses)
const login = await fetch(`${SUPA}/rest/v1/rpc/admin_login`, {
  method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" },
  body: JSON.stringify({ p_secret: SECRET, p_user_agent: "proposal-qa" }),
});
const token = await login.json();
if (typeof token !== "string" || token.length !== 64) { console.error("admin_login failed", login.status); process.exit(1); }

const { hostname } = new URL(base);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--font-render-hinting=none"] });
try {
  const page = await browser.newPage();
  await page.setCookie({ name: "podos_admin_session", value: token, domain: hostname, path: "/", httpOnly: true });

  // 2) PDF from the print route
  const printUrl = `${base}/ops/proposals/${publicId}/print?mode=${mode}&screen=0`;
  const res = await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 120_000 });
  if (!res.ok()) throw new Error(`print route ${res.status()}`);
  await page.evaluate(() => document.fonts.ready);
  // per page: box overflow AND content colliding with the footer (the real "nothing clipped" test)
  const domPages = await page.$$eval(".pdf-page", (els) => els.map((e) => {
    const r = e.getBoundingClientRect();
    const foot = e.querySelector(".pdf-foot")?.getBoundingClientRect();
    let maxBottom = 0; let culprit = "";
    for (const el of e.querySelectorAll(".pdf-content *")) {
      if (el.closest(".pdf-foot") || el.closest("svg")) continue;
      const b = el.getBoundingClientRect();
      if (b.height > 0 && b.bottom > maxBottom) { maxBottom = b.bottom; culprit = (el.className || el.tagName).toString().slice(0, 40); }
    }
    return { h: r.height, sh: e.scrollHeight, footer_top: foot ? Math.round(foot.top - r.top) : null, content_bottom: Math.round(maxBottom - r.top), collides: !!foot && maxBottom > foot.top + 0.5, culprit };
  }));
  await page.emulateMediaType("print");
  const pdfPath = path.join(out, `${publicId}-${mode}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });

  // 3) on-screen viewer capture
  await page.emulateMediaType("screen");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${base}/ops/proposals/${publicId}/print?mode=${mode}`, { waitUntil: "networkidle0", timeout: 120_000 });
  await page.screenshot({ path: path.join(out, `${publicId}-${mode}-viewer.png`), fullPage: true });

  // 3b) the production API route (same cookie) must produce the same page count
  const api = await fetch(`${base}/api/proposal/${publicId}/pdf?mode=${mode}`, { headers: { cookie: `podos_admin_session=${token}` } });
  const apiPdf = path.join(out, `${publicId}-${mode}-api.pdf`);
  if (api.ok) await fs.writeFile(apiPdf, Buffer.from(await api.arrayBuffer()));
  const apiInfo = { status: api.status, sha256: api.headers.get("x-document-sha256"), bytes: api.ok ? (await fs.stat(apiPdf)).size : 0 };

  // 4) page count + 200 DPI renders + overflow check
  const py = `
import fitz, sys
doc = fitz.open(sys.argv[1]); n = len(doc)
for i, p in enumerate(doc):
    p.get_pixmap(dpi=200).save(sys.argv[2] + f"-p{i+1}.png")
print(n)`;
  const n = Number(execFileSync("python", ["-c", py, pdfPath, path.join(out, `${publicId}-${mode}`)]).toString().trim());
  const overflow = domPages.filter((p) => p.sh > p.h + 1 || p.collides);
  const apiPages = api.ok ? Number(execFileSync("python", ["-c", "import fitz,sys;print(len(fitz.open(sys.argv[1])))", apiPdf]).toString().trim()) : null;
  console.log(JSON.stringify({ publicId, mode, pdf: pdfPath, pdf_pages: n, dom_pages: domPages.length, overflowing_pages: overflow.length, api: { ...apiInfo, pages: apiPages }, dom: domPages }, null, 2));
  if (apiPages !== null && apiPages !== n) { console.error(`API PDF PAGE COUNT MISMATCH: ${apiPages} vs ${n}`); process.exitCode = 4; }
  if (n !== domPages.length) { console.error(`PAGE COUNT MISMATCH: pdf ${n} vs dom ${domPages.length}`); process.exitCode = 2; }
  if (overflow.length) { console.error("CONTENT OVERFLOWS PAGE BOX"); process.exitCode = 3; }
} finally {
  await browser.close();
}
