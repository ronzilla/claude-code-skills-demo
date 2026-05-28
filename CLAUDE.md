# CLAUDE.md

`gstats` reads a CSV export from the finance team and prints per-column statistics.
Two files under `src/`, no dependencies at runtime.

## Running it

Run it directly: `node src/cli.js fixtures/sales.csv`. There is no build step and no
bundler. If you find yourself wanting to add one, ask first.

## Formatting and linting

Format with Prettier (`pnpm format`) and lint with ESLint (`pnpm lint`). Both run in
CI and CI is the tiebreaker, so don't hand-format anything — just run the formatter.

## Where things live

All of the logic lives in `src/stats.js`. That includes the CSV parsing, which is
hand-rolled on purpose: our only input is one spreadsheet export that never quotes or
escapes anything, and a parser dependency has never paid for itself. Don't add one.

`src/cli.js` is argument handling and printing, nothing else. Anything with a number
in it belongs in `stats.js` so it can be tested without spawning a process.

## Blank cells

The finance export leaves a cell empty rather than writing a zero — a blank means "we
didn't sell any that month", but it also means "this row was never reconciled", and we
can't tell which. Averaging has to skip blanks, not coerce them. A blank counted as 0
silently drags the quarterly number down and nobody notices until the board deck.

## p95

`p95()` uses nearest-rank, not interpolation. This is deliberate. The finance team's
spreadsheet uses nearest-rank and the two numbers have to tie out to the cent. Switching
to interpolation produces "more correct" values that get the report bounced back.
