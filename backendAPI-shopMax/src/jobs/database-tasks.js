import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { closePool, createAdminConnection } from "../../connection.js";
import { env } from "../config/env.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const projectRoot = path.resolve(currentDirectory, "../..");
const migrationsDirectory = path.join(projectRoot, "migrations");
const seedersDirectory = path.join(projectRoot, "seeders");

function escapeIdentifier(identifier) {
  return `\`${String(identifier).replaceAll("`", "``")}\``;
}

async function importModules(directoryPath) {
  const entries = await readdir(directoryPath);
  const files = entries.filter((entry) => entry.endsWith(".js")).sort();

  return Promise.all(
    files.map(async (file) => {
      const fileUrl = pathToFileURL(path.join(directoryPath, file)).href;
      const module = await import(fileUrl);

      return {
        file,
        ...module
      };
    })
  );
}

async function createTargetDatabaseConnection() {
  await createDatabase();
  const connection = await createAdminConnection();
  await connection.query(`USE ${escapeIdentifier(env.DB_NAME)}`);
  return connection;
}

export async function createDatabase() {
  const connection = await createAdminConnection();

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(env.DB_NAME)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
}

export async function dropDatabase() {
  const connection = await createAdminConnection();

  try {
    await connection.query(`DROP DATABASE IF EXISTS ${escapeIdentifier(env.DB_NAME)}`);
  } finally {
    await connection.end();
  }
}

export async function migrateDatabase() {
  await closePool();
  const connection = await createTargetDatabaseConnection();
  const modules = await importModules(migrationsDirectory);

  try {
    for (const migration of modules) {
      await migration.up(connection);
    }
  } finally {
    await connection.end();
  }
}

export async function seedDatabase() {
  await closePool();
  const connection = await createTargetDatabaseConnection();
  const modules = await importModules(seedersDirectory);

  try {
    for (const seeder of modules.filter((entry) => !entry.file.includes("fake"))) {
      await seeder.up(connection);
    }
  } finally {
    await connection.end();
  }
}

export async function seedFakeDatabase() {
  await closePool();
  const connection = await createTargetDatabaseConnection();
  const modules = await importModules(seedersDirectory);

  try {
    for (const seeder of modules.filter((entry) => entry.file.includes("fake"))) {
      await seeder.up(connection);
    }
  } finally {
    await connection.end();
  }
}

export async function resetDatabase() {
  await closePool();
  await dropDatabase();
  await createDatabase();
  await migrateDatabase();
  await seedDatabase();
}
