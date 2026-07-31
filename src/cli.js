#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseCsv } from "./csv.js";
import { summarize } from "./stats.js";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const [file, ...columns] = args.filter((arg) => arg !== "--json");

if (!file) {
  console.error("usage: node src/cli.js <file.csv> [column...] [--json]");
  process.exit(1);
}

const rows = parseCsv(readFileSync(file, "utf8"));
const wanted = columns.length ? columns : Object.keys(rows[0] ?? {});

const results = {};
for (const column of wanted) {
  const stats = summarize(rows, column);
  if (stats) results[column] = stats;
}

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const [column, stats] of Object.entries(results)) {
    console.log(
      `${column}: n=${stats.n} mean=${stats.mean.toFixed(2)} ` +
        `median=${stats.median.toFixed(2)} p95=${stats.p95.toFixed(2)}`,
    );
  }
}
