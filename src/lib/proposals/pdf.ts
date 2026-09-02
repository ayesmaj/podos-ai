import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import puppeteer from "puppeteer-core";

/**
 * pdf.ts — the ONE PDF pipeline: headless Chrome prints the semantic print
 * route. Same HTML/CSS as the on-screen viewer, so preview === PDF. No
 * second renderer exists (founder: the document design is universal).
 *
 * Vercel: @sparticuz/chromium (brotli-packed binary, extracted to /tmp).
 * Local: system Chrome (CHROME_PATH or the default install location).
 */

if (typeof window !== "undefined") throw new Error("src/lib/proposals/pdf.ts is server-only");

const LOCAL_CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
];

async function launch() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ["--font-render-hinting=none"] });
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: true });
  }
  const local = LOCAL_CHROME.find((p) => existsSync(p));
  if (!local) throw new Error("No Chrome found — set CHROME_PATH");
  return puppeteer.launch({ executablePath: local, headless: true, args: ["--font-render-hinting=none"] });
}

export interface PrintCookie { name: string; value: string }
export interface PdfResult { pdf: Buffer; sha256: string; bytes: number }

/** Print `url` (a /print route on our own origin) to A4 PDF, forwarding the caller's session cookie. */
export async function printUrlToPdf(url: string, cookies: PrintCookie[]): Promise<PdfResult> {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    const { hostname } = new URL(url);
    if (cookies.length) await page.setCookie(...cookies.map((c) => ({ ...c, domain: hostname, path: "/", httpOnly: true })));
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });
    const res = await page.goto(url, { waitUntil: "networkidle0", timeout: 90_000 });
    if (!res || !res.ok()) throw new Error(`print route returned ${res?.status() ?? "no response"}`);
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready);
    await page.emulateMediaType("print");
    // Letter portrait; margins and the page-number footer come from the sheet's @page rules
    const pdf = Buffer.from(await page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false }));
    return { pdf, sha256: createHash("sha256").update(pdf).digest("hex"), bytes: pdf.length };
  } finally {
    await browser.close();
  }
}

/** Short, stable fingerprint of the data a document was rendered from (printed in the footer). */
export function documentHash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
}
