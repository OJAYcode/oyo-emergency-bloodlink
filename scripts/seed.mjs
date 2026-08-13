import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
const target = join(process.cwd(), "data", "store.json");
await mkdir(dirname(target), { recursive: true });
await copyFile(join(process.cwd(), "data", "sample-store.json"), target);
console.log("Demo data seeded: data/store.json");
