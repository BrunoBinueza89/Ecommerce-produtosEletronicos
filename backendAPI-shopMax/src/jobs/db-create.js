import { closePool } from "../../connection.js";
import { createDatabase } from "./database-tasks.js";
import { runDatabaseTask } from "./database-error-handler.js";

await runDatabaseTask(createDatabase, "Banco criado ou ja existente.");
await closePool();
