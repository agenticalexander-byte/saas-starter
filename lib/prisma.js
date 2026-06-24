// Why this file exists:
// Next.js in development reloads your code on every save, which would normally
// re-run "new PrismaClient()" each time too - and each one opens its own pool of
// database connections. Do that enough times and you exhaust Postgres's connection
// limit and everything breaks with a confusing error.
//
// The fix: stash the client on the global object so hot-reloads reuse the same
// instance instead of creating a new one. In production this file just creates
// one client and that's it - the caching only matters in dev.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // remove "query" once you're tired of seeing every SQL statement in your terminal
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
