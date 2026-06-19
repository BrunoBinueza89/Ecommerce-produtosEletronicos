import { closePool } from "../../connection.js";
import { migrateDatabase } from "./database-tasks.js";
import { runDatabaseTask } from "./database-error-handler.js";

await runDatabaseTask(migrateDatabase, "Migracoes aplicadas com sucesso.");
await closePool();
