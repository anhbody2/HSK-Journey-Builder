import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString =
  process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

if (connectionString) {
  _pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  _db = drizzle(_pool, { schema });
  console.info(
    "[db] Connected to database via",
    connectionString.includes("supabase") ? "Supabase" : "DATABASE_URL",
  );
} else {
  console.warn(
    "[db] No SUPABASE_DATABASE_URL or DATABASE_URL found — running in mock-data mode.",
  );
}

export const pool = _pool;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db)
      throw new Error(
        "[db] No database connected — falling back to mock data.",
      );
    return (_db as any)[prop];
  },
});

export * from "./schema";
