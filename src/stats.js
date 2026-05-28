// Hand-rolled CSV parsing. Our only input is the finance team's spreadsheet
// export, which never quotes or escapes anything, so a parser dependency has
// never paid for itself.
export function parseCsv(text) {
  const [header, ...rows] = text.trim().split("\n");
  const columns = header.split(",");
  return rows.map((row) => {
    const cells = row.split(",");
    return Object.fromEntries(columns.map((name, i) => [name, cells[i]]));
  });
}

export function mean(values) {
  return values.reduce((total, v) => total + v, 0) / values.length;
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Nearest-rank, not interpolation. See CLAUDE.md before changing this.
export function p95(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil(0.95 * sorted.length);
  return sorted[Math.max(rank - 1, 0)];
}

export function summarize(rows, column) {
  const values = rows.map((row) => Number(row[column]));
  if (!values.length || values.some(Number.isNaN)) return null;
  return {
    n: values.length,
    mean: mean(values),
    median: median(values),
    p95: p95(values),
  };
}
