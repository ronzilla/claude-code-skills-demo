#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseCsv, summarize } from "./stats.js";

const [file, ...columns] = process.argv.slice(2);

if (!file) {
  console.error("usage: node src/cli.js <file.csv> [column...]");
  process.exit(1);
}

const rows = parseCsv(readFileSync(file, "utf8"));
const wanted = columns.length ? columns : Object.keys(rows[0] ?? {});

for (const column of wanted) {
  const stats = summarize(rows, column);
  if (!stats) continue;
  console.log(
    `${column}: n=${stats.n} mean=${stats.mean.toFixed(2)} ` +
      `median=${stats.median.toFixed(2)} p95=${stats.p95.toFixed(2)}`,
  );
}
