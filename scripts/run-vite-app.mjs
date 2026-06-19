import { createServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , workspaceName, portValue, apiBaseUrl] = process.argv;

if (!workspaceName || !portValue || !apiBaseUrl) {
  console.error("Usage: node scripts/run-vite-app.mjs <workspace> <port> <apiBaseUrl>");
  process.exit(1);
}

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const repositoryRoot = path.resolve(currentDirectory, "..");
const root = path.resolve(repositoryRoot, workspaceName);
const port = Number(portValue);

process.env.VITE_API_BASE_URL = apiBaseUrl;

const server = await createServer({
  root,
  envFile: false,
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(apiBaseUrl)
  },
  server: {
    host: "127.0.0.1",
    port,
    strictPort: true
  }
});

await server.listen();
console.log(`[shopmax-e2e] ${workspaceName} running on http://127.0.0.1:${port}`);

const shutdown = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
