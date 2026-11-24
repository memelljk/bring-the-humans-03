// Entry program for the bring-the-humans-03 TikTok ad.
//
// The creative work of this entry is the video itself; this program has
// exactly one job at grading time: take the VIDEO.json that sits next to
// it in the bot directory and place an identical copy into the output
// directory, so the grader can read which TikTok video belongs to us.
//
// Both locations arrive through the environment:
//   MAKEFUN_BOT_DIR    - folder that holds this program and VIDEO.json
//   MAKEFUN_OUTPUT_DIR - folder the copy has to land in
// Only Node's standard library is used, so there is nothing to install.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR;

if (!outputDir) {
  console.error(
    "MAKEFUN_OUTPUT_DIR is not set; cannot deliver VIDEO.json without an output directory"
  );
  process.exit(1);
}

// The output folder may not exist yet on a fresh grading run.
mkdirSync(outputDir, { recursive: true });

const from = join(botDir, "VIDEO.json");
const to = join(outputDir, "VIDEO.json");

// Validate VIDEO.json before delivering it. The bounty only accepts a
// full TikTok video address, so a missing file, broken JSON, a missing
// or non-string "url", or a short link (vt.tiktok.com and friends) must
// fail loudly here instead of delivering a pointer nobody can grade.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(from, "utf8"));
} catch (err) {
  console.error(
    `VIDEO.json is missing or is not valid JSON: ${(err as Error).message}`
  );
  process.exit(1);
}

const url =
  parsed !== null && typeof parsed === "object"
    ? (parsed as { url?: unknown }).url
    : undefined;

const fullVideoPattern = /^https:\/\/www\.tiktok\.com\/@[\w.]+\/video\/\d+$/;
if (typeof url !== "string" || !fullVideoPattern.test(url)) {
  console.error(
    "VIDEO.json must hold a full TikTok video address " +
      "(https://www.tiktok.com/@<handle>/video/<digits>); " +
      `got: ${JSON.stringify(url ?? null)}`
  );
  process.exit(1);
}

copyFileSync(from, to);

// Read the delivered copy back so the log proves exactly what landed:
// which TikTok video the pointer names, and how many bytes were written.
const deliveredBytes = readFileSync(to).length;
const videoId = url.match(/\/video\/(\d+)$/)?.[1] ?? "unknown";

console.log(`Delivered ${from} -> ${to}`);
console.log(`Video id ${videoId}; delivered VIDEO.json is ${deliveredBytes} bytes`);
