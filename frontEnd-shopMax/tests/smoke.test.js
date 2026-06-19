import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("shop frontend foundation files exist", () => {
  assert.equal(existsSync(new URL("../index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../main.js", import.meta.url)), true);
  assert.equal(existsSync(new URL("../src/styles.css", import.meta.url)), true);
});

test("shop frontend exposes MVP browsing and checkout flows", async () => {
  const source = await readFile(new URL("../main.js", import.meta.url), "utf8");

  assert.equal(source.includes("#/busca"), true);
  assert.equal(source.includes("#/categoria/"), true);
  assert.equal(source.includes("#/produto/"), true);
  assert.equal(source.includes("Videos do produto"), true);
  assert.equal(source.includes("Produto sem galeria"), true);
  assert.equal(source.includes("Adicionar ao carrinho"), true);
  assert.equal(source.includes("#/checkout"), true);
  assert.equal(source.includes("Ir para checkout"), true);
  assert.equal(source.includes("ShopMax | Pedidos"), true);
  assert.equal(source.includes("Favoritos"), true);
});
