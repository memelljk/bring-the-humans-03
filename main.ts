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

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR;

if (!outputDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set; nowhere to deliver VIDEO.json");
  process.exit(1);
}

// The output folder may not exist yet on a fresh grading run.
mkdirSync(outputDir, { recursive: true });

const from = join(botDir, "VIDEO.json");
const to = join(outputDir, "VIDEO.json");
copyFileSync(from, to);

console.log(`Delivered ${from} -> ${to}`);
