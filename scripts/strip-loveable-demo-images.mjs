import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.resolve(__dirname, "../src/lib/loveableData.ts");
let s = fs.readFileSync(p, "utf8");
s = s.replace(/\r\n/g, "\n");
s = s.replace(/^\s*imageUrl:\s*(opportunityCoverImage|newsCoverImage|eventCoverImage)\([^)]+\),?\n/gm, "");
s = s.replace(
  /import \{ opportunityCoverImage, newsCoverImage, eventCoverImage, mentorHeadshotImage \}/,
  "import { mentorHeadshotImage }",
);
fs.writeFileSync(p, s);
console.log("OK:", p);
