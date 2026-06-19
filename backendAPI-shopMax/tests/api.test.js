import test from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase } from "../src/jobs/database-tasks.js";

let adminToken = "";
let databaseReady = false;

const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jSxkAAAAASUVORK5CYII=",
  "base64"
);
const executableLikeBuffer = Buffer.from("4d5a90000300000004000000ffff0000b8000000", "hex");

async function ensureAdminToken(app) {
  if (adminToken) {
    return adminToken;
  }

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: env.DEFAULT_ADMIN_EMAIL,
    password: env.DEFAULT_ADMIN_PASSWORD
  });

  adminToken = loginResponse.body.token;
  return adminToken;
}

test.before(async () => {
  try {
    await resetDatabase();
    databaseReady = true;
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      databaseReady = false;
      return;
    }

    throw error;
  }
});

test.after(async () => {
  await rm(new URL("../uploads/products", import.meta.url), { recursive: true, force: true }).catch(() => {});
  await closePool();
});

test("POST /api/auth/login authenticates seeded admin", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  const response = await request(app).post("/api/auth/login").send({
    email: env.DEFAULT_ADMIN_EMAIL,
    password: env.DEFAULT_ADMIN_PASSWORD
  });

  assert.equal(response.status, 200);
  assert.equal(typeof response.body.token, "string");
  adminToken = response.body.token;
});

test("GET /api/categories returns seeded catalog", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  const response = await request(app).get("/api/categories");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length >= 1, true);
});

test("POST /api/categories creates category with admin permission", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  await ensureAdminToken(app);

  const response = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Tablets",
      description: "Nova categoria do catalogo"
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.slug, "tablets");
});

test("POST /api/products creates product with initial stock", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  await ensureAdminToken(app);

  const categoriesResponse = await request(app).get("/api/categories");
  const brandsResponse = await request(app).get("/api/brands");

  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      categoryId: categoriesResponse.body.data[0].id,
      brandId: brandsResponse.body.data[0].id,
      name: "Monitor Pro 27",
      sku: "MON-PRO-27",
      price: 1799.9,
      promotionalPrice: 1699.9,
      shortDescription: "Monitor 27 polegadas para setup gamer.",
      description: "Monitor com painel IPS e alta taxa de atualizacao.",
      mainImageUrl: "https://cdn.shopmax.local/produtos/monitor-pro-27.png",
      stockInitial: 10,
      stockMinimum: 2
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.sku, "MON-PRO-27");
  assert.equal(response.body.data.stockBalance, 10);
});

test("POST /api/products accepts valid product image upload", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  await ensureAdminToken(app);
  const categoriesResponse = await request(app).get("/api/categories");
  const brandsResponse = await request(app).get("/api/brands");

  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("categoryId", String(categoriesResponse.body.data[0].id))
    .field("brandId", String(brandsResponse.body.data[0].id))
    .field("name", "Camera Sprint 13")
    .field("sku", "CAM-SPRINT-13")
    .field("price", "2499.9")
    .field("stockInitial", "5")
    .field("stockMinimum", "1")
    .field("status", "ativo")
    .attach("mainImage", tinyPngBuffer, {
      filename: "camera-principal.png",
      contentType: "image/png"
    });

  assert.equal(response.status, 201);
  assert.equal(typeof response.body.data.mainImageUrl, "string");
  assert.equal(response.body.data.mainImageUrl.startsWith("/uploads/products/images/"), true);
  assert.equal(Array.isArray(response.body.data.images), true);
  assert.equal(response.body.data.images.length >= 1, true);
  assert.equal(response.body.data.images.some((image) => image.isMain), true);
});

test("POST /api/products blocks invalid binary disguised as image", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  await ensureAdminToken(app);
  const categoriesResponse = await request(app).get("/api/categories");
  const brandsResponse = await request(app).get("/api/brands");

  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("categoryId", String(categoriesResponse.body.data[0].id))
    .field("brandId", String(brandsResponse.body.data[0].id))
    .field("name", "Arquivo Malicioso")
    .field("sku", "MAL-001")
    .field("price", "99.9")
    .field("stockInitial", "1")
    .attach("mainImage", executableLikeBuffer, {
      filename: "malicioso.jpg",
      contentType: "image/jpeg"
    });

  assert.equal(response.status, 422);
  assert.equal(["INVALID_IMAGE_TYPE", "INVALID_MEDIA_BINARY"].includes(response.body.error), true);
});

test("POST /api/products blocks oversized product image upload", async (t) => {
  if (!databaseReady) {
    t.skip("MySQL indisponivel para os testes de integracao.");
    return;
  }

  const app = createApp();
  await ensureAdminToken(app);
  const categoriesResponse = await request(app).get("/api/categories");
  const brandsResponse = await request(app).get("/api/brands");
  const oversizedPngBuffer = Buffer.alloc(5 * 1024 * 1024 + 1024);
  tinyPngBuffer.copy(oversizedPngBuffer, 0, 0, 8);

  const response = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("categoryId", String(categoriesResponse.body.data[0].id))
    .field("brandId", String(brandsResponse.body.data[0].id))
    .field("name", "Imagem Gigante")
    .field("sku", "IMG-GIGANTE")
    .field("price", "199.9")
    .field("stockInitial", "2")
    .attach("mainImage", oversizedPngBuffer, {
      filename: "gigante.png",
      contentType: "image/png"
    });

  assert.equal(response.status, 413);
  assert.equal(response.body.error, "MEDIA_FILE_TOO_LARGE");
});
