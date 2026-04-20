import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (fs.existsSync(envPath)) {
  process.exit(0);
}

if (fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log("[EcoVerse] Created .env from .env.example — add Supabase keys when you use auth.");
} else {
  const minimal = `# Local dev: leave API URL empty to use Vite proxy → http://localhost:8787
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
`;
  fs.writeFileSync(envPath, minimal, "utf8");
  console.log("[EcoVerse] Created minimal .env — fill Supabase when needed.");
}
