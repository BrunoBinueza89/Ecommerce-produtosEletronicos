export async function runDatabaseTask(task, successMessage) {
  try {
    await task();
    console.log(successMessage);
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "Falha de autenticacao no MySQL. Atualize DB_USER e DB_PASSWORD em backendAPI-shopMax/.env antes de rodar os scripts de banco."
      );
      process.exitCode = 1;
      return;
    }

    throw error;
  }
}
