import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.resolve(__dirname, "../backend/seedData.js");
let s = fs.readFileSync(p, "utf8");
s = s.replace(/\r\n/g, "\n");
s = s.replace(/\n[ \t]*image:\n[ \t]*"[^"]+",/g, "");
fs.writeFileSync(p, s);
console.log("OK:", p);
