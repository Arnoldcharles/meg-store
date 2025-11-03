import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function readStore<T = any>(name: string, fallback: T) {
  try {
    ensureDir();
    const file = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback as T;
    }
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback as T;
  }
}

export function writeStore(name: string, data: any) {
  try {
    ensureDir();
    const file = path.join(dataDir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error("writeStore error", e);
    return false;
  }
}

export function generateId(prefix = "") {
  const id = `${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffff).toString(16)}`;
  return prefix ? `${prefix}_${id}` : id;
}
