import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Re-load `.env` from the project root into `process.env`.
 * `node --watch` does not restart when only `.env` changes, so the API can miss new keys until a full restart.
 * Calling this before reading OPENAI_* keeps local dev in sync after saving `.env`.
 */
export function refreshEnvFromDotenv() {
  dotenv.config({ path: path.join(projectRoot, ".env"), override: true });
}
