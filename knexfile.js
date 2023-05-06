// @ts-check

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = {
  directory: path.join(__dirname, "server", "migrations"),
};

export const development = {
  client: "better-sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
  migrations,
};

export const test = {
  client: "better-sqlite3",
  connection: ":memory:",
  useNullAsDefault: true,
  // debug: true,
  migrations,
};

export const production = {
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  useNullAsDefault: true,
  migrations,
};
