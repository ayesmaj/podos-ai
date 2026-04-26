#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * ENVATO MARKET VIDEO HELPER
 * ==========================
 *
 * Accelerates the `/public/videos/` asset pipeline by doing the painful
 * manual part — browsing VideoHive to find clips that match each
 * VIDEO_ASSETS variant — programmatically via Envato Market API.
 *
 * Two commands:
 *   search   — given a variant key, print the top 5 matching clips as a
 *              ranked shortlist with item IDs, preview URLs, duration,
 *              resolution, and price. Run with no arg to do all variants.
 *
 *   download — given an item ID + variant key, download the full clip
 *              (requires the item to be in your Market purchases), then
 *              transcode with ffmpeg into catalog-correct format + size
 *              and extract a poster frame. Writes to /public/videos/.
 *
 * Why this layout:
 *   - Elements subscription has no download API. Market API does — but
 *     only for items you've purchased. So `search` is the real value
 *     for Elements subscribers: it shortcuts discovery so you can find
 *     the same clip (or a close match) on Elements and download manually.
 *   - If you later buy an item on VideoHive, `download` becomes a
 *     one-command pipeline: fetch → compress → poster → catalog file
 *     naming. No manual ffmpeg invocation.
 *
 * Run with:
 *   npm run videos:search
 *   npm run videos:search -- data-center
 *   npm run videos:download -- 47821094 data-center
 *
 * Env: ENVATO_API_TOKEN — loaded by --env-file=.env.local in npm script.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const VIDEOS_DIR = resolve(REPO_ROOT, "public/videos");
const QUERIES_FILE = resolve(__dirname, "video-queries.json");

const TOKEN = process.env.ENVATO_API_TOKEN;
if (!TOKEN) {
  console.error(
    "✗ ENVATO_API_TOKEN not set. Either:\n" +
      "  - Add it to .env.local and run via `npm run videos:search` (passes --env-file)\n" +
      "  - Or: ENVATO_API_TOKEN=xxx node scripts/envato-fetch.mjs search"
  );
  process.exit(1);
}

/* ------------------------------------------------------------------
   Thin Envato API client — just the four endpoints this script needs.
   ------------------------------------------------------------------ */
const BASE = "https://api.envato.com";

async function envato(path, params = {}) {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "User-Agent": "podos-ai-video-fetch/1.0",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Envato ${path} — HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

// Envato Market is partitioned across sites — each site is a category of
// asset type. The `site` param filters /discovery search to just that
// marketplace. Key sites relevant to a product website:
//   videohive.net   → stock video footage + AE/PR templates
//   photodune.net   → stock photography
//   audiojungle.net → music, loops, sound effects
//   graphicriver.net→ graphics, icons, print/web templates
//   3docean.net     → 3D models + HDRIs
const DEFAULT_SITE = "videohive.net";

async function searchClips(query, opts = {}) {
  const { minDuration = 0, site = DEFAULT_SITE, category } = opts;
  const data = await envato("/v1/discovery/search/search/item", {
    term: query,
    site,
    category,               // optional — most sites ignore if unknown
    sort_by: "relevance",
    page_size: 20,
  });
  const matches = (data?.matches ?? [])
    .filter((it) => {
      if (!minDuration) return true;
      // Video-only: filter by advertised clip length.
      const durAttr = (it.attributes ?? []).find(
        (a) => (a.name ?? "").toLowerCase().includes("length") ||
               (a.name ?? "").toLowerCase().includes("duration")
      );
      const seconds = parseDuration(durAttr?.value);
      if (seconds && seconds < minDuration) return false;
      return true;
    })
    .slice(0, 5);
  return matches;
}

/** Envato surfaces durations as "0:12", "0:08", etc. Parse to seconds. */
function parseDuration(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d+):(\d+)/);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

/** Pluck the first preview URL from an item — normalized across sites.
 *  Videos: watermarked MP4 preview. Photos/graphics: large JPEG.
 *  Audio: streaming MP3 sample. 3D: rendered thumbnail.                 */
function previewUrl(item) {
  const p = item.previews ?? {};
  const urls = [
    // Video (VideoHive)
    p.live_site?.url,
    p.landscape_preview?.landscape_url,
    p.video_preview?.url,
    // Photo / graphic (PhotoDune / GraphicRiver)
    p.landscape_preview?.url,
    p.icon_with_landscape_preview?.landscape_url,
    p.icon_with_square_preview?.preview_url,
    // Audio (AudioJungle) — MP3 stream
    p.icon_with_audio_preview?.mp3_url,
    p.audio_preview?.mp3_url,
    // 3D / generic
    p.icon_preview?.icon_url,
  ].filter(Boolean);
  return urls[0] ?? null;
}

/** Site → human-readable name for console output. */
function siteLabel(site) {
  return {
    "videohive.net": "VideoHive",
    "photodune.net": "PhotoDune",
    "audiojungle.net": "AudioJungle",
    "graphicriver.net": "GraphicRiver",
    "3docean.net": "3DOcean",
    "themeforest.net": "ThemeForest",
    "codecanyon.net": "CodeCanyon",
  }[site] ?? site;
}

/* ------------------------------------------------------------------
   SEARCH command
   ------------------------------------------------------------------ */
async function cmdSearch(argVariant) {
  const queries = JSON.parse(await readFile(QUERIES_FILE, "utf8"));
  const variants = argVariant
    ? [argVariant]
    : Object.keys(queries).filter((k) => !k.startsWith("_"));

  for (const variant of variants) {
    const cfg = queries[variant];
    if (!cfg) {
      console.error(`✗ No query configured for variant "${variant}".`);
      continue;
    }
    const site = cfg.site ?? DEFAULT_SITE;
    console.log(`\n━━━ ${variant.toUpperCase()}  (${siteLabel(site)}) ━━━`);
    console.log(`  query: "${cfg.query}"`);
    try {
      const results = await searchClips(cfg.query, cfg);
      if (results.length === 0) {
        console.log("  (no matches — try a broader query)");
        continue;
      }
      results.forEach((it, i) => {
        const price = it.price_cents != null
          ? `$${(it.price_cents / 100).toFixed(2)}`
          : "—";
        // Surface whichever attributes are meaningful for this asset type.
        const attrVal = (re) =>
          (it.attributes ?? []).find((a) => re.test(a.name ?? ""))?.value;
        const meta = [
          price,
          attrVal(/length|duration/i),     // video/audio
          attrVal(/resolution|dimensions|size/i), // photo/graphic/video
          attrVal(/file type|format/i),    // graphic/audio
        ].filter(Boolean).join(" · ");
        console.log(`  ${i + 1}. [#${it.id}] "${truncate(it.name, 60)}"`);
        if (meta) console.log(`       ${meta}`);
        const prev = previewUrl(it);
        if (prev) console.log(`       preview: ${prev}`);
        console.log(`       url:     ${it.url}`);
      });
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }
  console.log(
    "\nNext: open preview URLs, pick one, then search for a close match on\n" +
      "elements.envato.com and download under your subscription. File-naming\n" +
      "contract is in /public/videos/ASSETS.md (video) — or /public/assets/\n" +
      "SHOPPING-LIST.md for the full multi-asset plan."
  );
}

function truncate(s, n) {
  return !s ? "" : s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/* ------------------------------------------------------------------
   DOWNLOAD command (requires item to be in purchases)
   ------------------------------------------------------------------ */
async function cmdDownload(itemId, variant) {
  if (!itemId || !variant) {
    console.error("usage: npm run videos:download -- <item-id> <variant>");
    process.exit(1);
  }

  // Endpoint returns a signed, short-lived download URL — not the file itself.
  const res = await envato("/v3/market/buyer/download", {
    item_id: itemId,
    shorten_url: true,
  });
  const fileUrl = res?.mp4 ?? res?.download_url ?? res?.wordpress_plugin ?? null;
  if (!fileUrl) {
    console.error(
      `✗ No downloadable file URL returned. This usually means the item\n` +
        `  isn't in your Market purchases. Response: ${JSON.stringify(res).slice(0, 300)}`
    );
    process.exit(1);
  }

  await mkdir(VIDEOS_DIR, { recursive: true });
  const rawPath = resolve(VIDEOS_DIR, `_raw-${variant}.mp4`);
  console.log(`→ Downloading to ${rawPath}…`);
  const dl = await fetch(fileUrl);
  if (!dl.ok) throw new Error(`Download failed HTTP ${dl.status}`);
  await pipeline(Readable.fromWeb(dl.body), createWriteStream(rawPath));
  console.log("✓ Download complete.");

  const outMp4 = resolve(VIDEOS_DIR, `${variant}.mp4`);
  const outJpg = resolve(VIDEOS_DIR, `${variant}.jpg`);
  console.log(`→ Transcoding to catalog format (${outMp4})…`);
  await runFfmpeg([
    "-y", "-i", rawPath,
    "-c:v", "libx264", "-crf", "28", "-preset", "slow",
    "-vf", "scale=1920:-2",
    "-an",
    "-movflags", "+faststart",
    outMp4,
  ]);
  console.log(`→ Extracting poster frame (${outJpg})…`);
  await runFfmpeg(["-y", "-i", outMp4, "-ss", "00:00:02", "-vframes", "1", "-q:v", "3", outJpg]);
  console.log(`\n✓ ${variant}: catalog files written.`);
  console.log(`  You can now delete ${rawPath} if you like.`);
}

function runFfmpeg(args) {
  return new Promise((ok, bad) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });
    p.on("exit", (code) => (code === 0 ? ok() : bad(new Error(`ffmpeg exit ${code}`))));
    p.on("error", bad);
  });
}

/* ------------------------------------------------------------------
   CLI dispatcher
   ------------------------------------------------------------------ */
const [cmd, ...rest] = process.argv.slice(2);
try {
  switch (cmd) {
    case "search":
      await cmdSearch(rest[0]);
      break;
    case "download":
      await cmdDownload(rest[0], rest[1]);
      break;
    default:
      console.log(
        "Usage:\n" +
          "  npm run videos:search                 — all variants\n" +
          "  npm run videos:search -- <variant>    — one variant\n" +
          "  npm run videos:download -- <item-id> <variant>\n\n" +
          "Variants: data-center, modular-infra, data-flow, fusion, solar-grid"
      );
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(1);
}

// Silence unused-import warning in the rare case we only call cmdSearch.
void writeFile;
