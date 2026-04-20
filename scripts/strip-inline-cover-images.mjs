import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/lib/loveableData.ts");
let s = fs.readFileSync(p, "utf8");
s = s.replace(/, imageUrl: eventCoverImage\("[^"]+"\)/g, "");
s = s.replace(/, imageUrl: newsCoverImage\("[^"]+"\)/g, "");
fs.writeFileSync(p, s);
console.log("OK");
