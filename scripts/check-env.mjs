import { readFile } from "node:fs/promises";

const text = await readFile(".env.local", "utf8");
for (const name of ["POSTGRES_URL", "DATABASE_URL", "POSTGRES_URL_NON_POOLING"]) {
  const line = text.split(/\r?\n/).find((item) => item.startsWith(`${name}=`));
  if (!line) continue;
  const value = line.slice(name.length + 1).trim().replace(/^['"]|['"]$/g, "");
  console.log(`${name}: protocol=${value.split(":")[0] || "missing"}, length=${value.length}, whitespace=${/\s/.test(value)}`);
}
