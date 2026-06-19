import mysql from "mysql2/promise";
import { env } from "./src/config/env.js";

let pool;

function createConfig(includeDatabase = true) {
  return {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: includeDatabase ? env.DB_NAME : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  };
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(createConfig(true));
  }

  return pool;
}

export function createAdminConnection() {
  return mysql.createConnection(createConfig(false));
}

export function createDatabaseConnection() {
  return mysql.createConnection(createConfig(true));
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
