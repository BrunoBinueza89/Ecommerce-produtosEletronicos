import { closePool } from "../../connection.js";
import { seedDatabase } from "./database-tasks.js";
import { runDatabaseTask } from "./database-error-handler.js";

await runDatabaseTask(seedDatabase, "Seed base aplicado com sucesso.");
await closePool();
