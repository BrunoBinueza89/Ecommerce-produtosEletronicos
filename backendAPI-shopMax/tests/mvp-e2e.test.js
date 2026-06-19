import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jSxkAAAAASUVORK5CYII=",
  "base64"
);

let adminToken = "";

async function loginAdmin(app) {
  const response = await request(app).post("/api/auth/login").send({
    email: env.DEFAULT_ADMIN_EMAIL,
    password: env.DEFAULT_ADMIN_PASSWORD
  });

  assert.equal(response.status, 200);
  return response.body.token;
}

async function registerAndLoginCustomer(app, email, cpf) {
  const registerResponse = await request(app).post("/api/auth/register/customer").send({
    name: "Cliente E2E MVP",
    email,
    cpf,
    phone: "11966667777",
    password: "Cliente@123",
    confirmPassword: "Cliente@123"
  });

  assert.equal(registerResponse.status, 201);

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password: "Cliente@123"
  });

  assert.equal(loginResponse.status, 200);
  return loginResponse.body.token;
}

test.before(async () => {
  await resetDatabase();
  await seedFakeDatabase();

  const app = createApp();
  adminToken = await loginAdmin(app);
});

test.after(async () => {
  await closePool();
});

test("MVP E2E local validates admin, shop, checkout, stock and audit flows", async () => {
  const app = createApp();

  const unauthenticatedAuditLogsResponse = await request(app).get("/api/admin/audit-logs");
  assert.equal(unauthenticatedAuditLogsResponse.status, 401);

  const categoriesBeforeResponse = await request(app).get("/api/categories");
  const brandsBeforeResponse = await request(app).get("/api/brands");

  assert.equal(categoriesBeforeResponse.status, 200);
  assert.equal(brandsBeforeResponse.status, 200);

  const categoryCreateResponse = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Monitores Gamer E2E",
      description: "Categoria criada na homologacao interna do MVP."
    });

  assert.equal(categoryCreateResponse.status, 201);

  const brandCreateResponse = await request(app)
    .post("/api/brands")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "ViewFast",
      logoUrl: "https://cdn.shopmax.local/brands/viewfast.png",
      status: "ativo"
    });

  assert.equal(brandCreateResponse.status, 201);

  const productCreateResponse = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("categoryId", String(categoryCreateResponse.body.data.id))
    .field("brandId", String(brandCreateResponse.body.data.id))
    .field("name", "Monitor UltraWide E2E")
    .field("sku", "MON-E2E-001")
    .field("price", "2299.90")
    .field("promotionalPrice", "2099.90")
    .field("stockInitial", "8")
    .field("stockMinimum", "2")
    .field("status", "ativo")
    .field("shortDescription", "Monitor criado na sprint de homologacao interna.")
    .field("description", "Produto usado para validar catalogo, carrinho, checkout e operacao admin.")
    .attach("mainImage", tinyPngBuffer, {
      filename: "monitor-e2e.png",
      contentType: "image/png"
    })
    .attach("galleryImages", tinyPngBuffer, {
      filename: "monitor-e2e-galeria.png",
      contentType: "image/png"
    });

  assert.equal(productCreateResponse.status, 201);
  const createdProduct = productCreateResponse.body.data;
  assert.equal(createdProduct.images.length, 2);
  assert.equal(createdProduct.images.some((image) => image.isMain), true);

  const secondaryImage = createdProduct.images.find((image) => !image.isMain);
  assert.ok(secondaryImage);

  const setMainImageResponse = await request(app)
    .patch(`/api/products/${createdProduct.id}/images/${secondaryImage.id}/main`)
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(setMainImageResponse.status, 200);
  assert.equal(
    setMainImageResponse.body.data.images.find((image) => image.id === secondaryImage.id)?.isMain,
    true
  );

  const stockBeforeAdjustmentResponse = await request(app)
    .get("/api/admin/stock")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(stockBeforeAdjustmentResponse.status, 200);
  const createdProductStock = stockBeforeAdjustmentResponse.body.data.find(
    (item) => item.produto_id === createdProduct.id
  );
  assert.ok(createdProductStock);
  assert.equal(Number(createdProductStock.saldo), 8);

  const stockAdjustResponse = await request(app)
    .patch(`/api/admin/stock/${createdProductStock.id}/adjust`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      quantityDelta: 4,
      stockMinimum: 3,
      reason: "Ajuste operacional da homologacao interna"
    });

  assert.equal(stockAdjustResponse.status, 200);

  const publicProductsResponse = await request(app).get(`/api/products?category=${createdProduct.categorySlug}`);
  assert.equal(publicProductsResponse.status, 200);
  assert.equal(
    publicProductsResponse.body.data.some((product) => product.slug === createdProduct.slug),
    true
  );

  const productPageResponse = await request(app).get(`/api/products/${createdProduct.slug}`);
  assert.equal(productPageResponse.status, 200);
  assert.equal(productPageResponse.body.data.mainImageUrl.startsWith("/uploads/products/images/"), true);
  assert.equal(productPageResponse.body.data.images.length >= 2, true);

  const customerToken = await registerAndLoginCustomer(
    app,
    "cliente.e2e.mvp@shopmax.local",
    "66777888990"
  );

  const forbiddenDashboardResponse = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(forbiddenDashboardResponse.status, 403);

  const favoriteResponse = await request(app)
    .post("/api/favorites")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ productId: createdProduct.id });

  assert.equal(favoriteResponse.status, 201);

  const cartSessionResponse = await request(app).post("/api/cart/session");
  assert.equal(cartSessionResponse.status, 201);
  const sessionToken = cartSessionResponse.body.data.sessionToken;

  const addToCartResponse = await request(app).post("/api/cart/items").send({
    sessionToken,
    productId: createdProduct.id,
    quantity: 2
  });

  assert.equal(addToCartResponse.status, 200);
  assert.equal(addToCartResponse.body.data.itemsCount, 2);

  const checkoutPreviewResponse = await request(app)
    .get(`/api/checkout/preview?sessionToken=${sessionToken}`)
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(checkoutPreviewResponse.status, 200);
  assert.equal(checkoutPreviewResponse.body.data.cart.itemsCount, 2);

  const checkoutFinalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      sessionToken,
      address: {
        alias: "Casa",
        recipient: "Cliente E2E MVP",
        zipCode: "01001000",
        street: "Rua Homologacao",
        number: "1400",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  assert.equal(checkoutFinalizeResponse.status, 201);
  assert.equal(checkoutFinalizeResponse.body.data.status, "pagamento_aprovado");
  assert.equal(checkoutFinalizeResponse.body.data.payment.status, "aprovado");
  assert.equal(checkoutFinalizeResponse.body.data.shipment.status, "pendente");
  const orderId = checkoutFinalizeResponse.body.data.id;

  const customerOrdersResponse = await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(customerOrdersResponse.status, 200);
  assert.equal(customerOrdersResponse.body.data.some((order) => order.id === orderId), true);

  const adminOrdersResponse = await request(app)
    .get("/api/admin/orders")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(adminOrdersResponse.status, 200);
  assert.equal(adminOrdersResponse.body.data.some((order) => order.id === orderId), true);

  const orderStatusResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "em_separacao"
    });

  assert.equal(orderStatusResponse.status, 200);

  const shippedStatusResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "enviado",
      trackingCode: "BRMVP140001"
    });

  assert.equal(shippedStatusResponse.status, 200);

  const customersResponse = await request(app)
    .get("/api/admin/customers")
    .set("Authorization", `Bearer ${adminToken}`);
  const dashboardResponse = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${adminToken}`);
  const reportsResponse = await request(app)
    .get("/api/admin/reports")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(customersResponse.status, 200);
  assert.equal(customersResponse.body.data.some((customer) => customer.email === "cliente.e2e.mvp@shopmax.local"), true);
  assert.equal(dashboardResponse.status, 200);
  assert.equal(reportsResponse.status, 200);

  const stockAfterCheckoutResponse = await request(app)
    .get("/api/admin/stock")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(stockAfterCheckoutResponse.status, 200);
  const updatedStock = stockAfterCheckoutResponse.body.data.find((item) => item.produto_id === createdProduct.id);
  assert.ok(updatedStock);
  assert.equal(Number(updatedStock.saldo), 10);

  const auditLogsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(auditLogsResponse.status, 200);
  const actions = auditLogsResponse.body.data.map((item) => item.acao);
  assert.equal(actions.includes("create"), true);
  assert.equal(actions.includes("media_set_main"), true);
  assert.equal(actions.includes("adjust"), true);
  assert.equal(actions.includes("update-status"), true);
});
