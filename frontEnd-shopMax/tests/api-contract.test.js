import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("shop frontend references real backend API contract", async () => {
  const source = await readFile(new URL("../src/services/api.js", import.meta.url), "utf8");

  assert.equal(source.includes("/api"), true);
  assert.equal(source.includes("/cart/items"), true);
  assert.equal(source.includes("/products"), true);
  assert.equal(source.includes("resolveShopAssetUrl"), true);
});
