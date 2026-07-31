// Hand-rolled CSV parsing. Our only input is the finance team's spreadsheet
// export, which never quotes or escapes anything, so a parser dependency has
// never paid for itself.
export function parseCsv(raw) {
  const text = raw.replace(/^﻿/, "").trim();
  const [header, ...rows] = text.split(/\r?\n/);
  const columns = header.split(",");
  return rows.map((row) => {
    const cells = row.split(",");
    return Object.fromEntries(columns.map((name, i) => [name, cells[i] ?? ""]));
  });
}
