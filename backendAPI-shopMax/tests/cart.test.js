import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

test.before(async () => {
  await resetDatabase();
  await seedFakeDatabase();
});

test.after(async () => {
  await closePool();
});

test("cart session can be created and receive product item", async () => {
  const app = createApp();

  const sessionResponse = await request(app).post("/api/cart/session");
  assert.equal(sessionResponse.status, 201);
  const sessionToken = sessionResponse.body.data.sessionToken;

  const productsResponse = await request(app).get("/api/products");
  assert.equal(productsResponse.status, 200);

  const addResponse = await request(app).post("/api/cart/items").send({
    sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  assert.equal(addResponse.status, 200);
  assert.equal(addResponse.body.data.items.length, 1);
  assert.equal(addResponse.body.data.itemsCount, 1);
});
