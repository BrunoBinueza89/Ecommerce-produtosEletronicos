import { closePool } from "../../connection.js";
import { seedFakeDatabase } from "./database-tasks.js";
import { runDatabaseTask } from "./database-error-handler.js";

await runDatabaseTask(seedFakeDatabase, "Seed fake aplicado com sucesso.");
await closePool();
