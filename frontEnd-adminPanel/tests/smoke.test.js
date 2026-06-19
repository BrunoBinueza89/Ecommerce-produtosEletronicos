import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("admin frontend foundation files exist", () => {
  assert.equal(existsSync(new URL("../index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../main.js", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/styles.css", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/services/api.js", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/store/auth-session.js", import.meta.url)), true);
});

test("admin frontend references real integration endpoints", async () => {
  const source = await readFile(new URL("../src/services/api.js", import.meta.url), "utf8");

  assert.equal(source.includes("/api"), true);
  assert.equal(source.includes("/admin/integrations/status"), true);
  assert.equal(source.includes("/admin/integrations/email/test"), true);
  assert.equal(source.includes("/admin/integrations/tracking/test"), true);
  assert.equal(source.includes("/admin/integrations/validate-live"), true);
  assert.equal(source.includes("/admin/orders/tracking/sync-pending"), true);
  assert.equal(source.includes("/products/"), true);
  assert.equal(source.includes("/images/"), true);
  assert.equal(source.includes("/videos/"), true);
});

test("admin frontend exposes MVP operational flows", async () => {
  const source = await readFile(new URL("../main.js", import.meta.url), "utf8");

  assert.equal(source.includes("Dashboard"), true);
  assert.equal(source.includes("product-form"), true);
  assert.equal(source.includes("product-media-form"), true);
  assert.equal(source.includes("set-main-image"), true);
  assert.equal(source.includes("delete-product-image"), true);
  assert.equal(source.includes("Pedidos"), true);
  assert.equal(source.includes("Clientes"), true);
  assert.equal(source.includes("Relatorios"), true);
  assert.equal(source.includes("Audit Logs"), true);
  assert.equal(source.includes("configuracao incompleta"), true);
  assert.equal(source.includes("bloqueado com seguranca"), true);
  assert.equal(source.includes("falha no provedor"), true);
});
