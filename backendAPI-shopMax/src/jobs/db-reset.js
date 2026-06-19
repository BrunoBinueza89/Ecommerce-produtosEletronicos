import { closePool } from "../../connection.js";
import { resetDatabase } from "./database-tasks.js";
import { runDatabaseTask } from "./database-error-handler.js";

await runDatabaseTask(resetDatabase, "Banco resetado com sucesso.");
await closePool();
