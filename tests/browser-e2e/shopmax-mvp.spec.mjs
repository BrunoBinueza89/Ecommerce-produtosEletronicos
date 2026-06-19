import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const productImagePath = path.resolve(currentDirectory, "fixtures", "product-image.png");

function uniqueValue(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function uniqueDigits(length) {
  const seed = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  return seed.slice(-length);
}

function slugify(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

async function loginAdmin(page) {
  await page.goto("http://127.0.0.1:4174");
  await expect(page.getByRole("heading", { name: "ShopMax Admin" })).toBeVisible();
  await page.locator('#login-form input[name="email"]').fill("admin@shopmax.local");
  await page.locator('#login-form input[name="password"]').fill("Admin@123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/#\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" }).first()).toBeVisible();
}

async function createCategory(page, categoryName) {
  await page.getByRole("button", { name: "Categorias" }).click();
  await expect(page.getByRole("heading", { name: "Categorias" }).first()).toBeVisible();
  await page.locator('#category-form input[name="name"]').fill(categoryName);
  await page.locator('#category-form input[name="slug"]').fill(slugify(categoryName));
  await page.locator('#category-form textarea[name="description"]').fill("Categoria criada pela Sprint 16.");
  const responsePromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/categories") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Salvar categoria" }).click();
  const response = await responsePromise;
  expect(response.status(), await response.text()).toBe(201);
  await expect(page.getByRole("cell", { name: categoryName })).toBeVisible();
}

async function createBrand(page, brandName) {
  await page.getByRole("button", { name: "Marcas" }).click();
  await expect(page.getByRole("heading", { name: "Marcas" }).first()).toBeVisible();
  await page.locator('#brand-form input[name="name"]').fill(brandName);
  await page.locator('#brand-form input[name="slug"]').fill(slugify(brandName));
  await page.locator('#brand-form input[name="logoUrl"]').fill("https://placehold.co/120x60?text=Brand");
  await page.getByRole("button", { name: "Salvar marca" }).click();
  await expect(page.getByRole("cell", { name: brandName })).toBeVisible();
}

async function createProduct(page, productName, sku, categoryName, brandName) {
  await page.getByRole("button", { name: "Produtos" }).click();
  await expect(page.getByRole("heading", { name: "Produtos" }).first()).toBeVisible();
  await page.locator('#product-form input[name="name"]').fill(productName);
  await page.locator('#product-form select[name="categoryId"]').selectOption({ label: categoryName });
  await page.locator('#product-form select[name="brandId"]').selectOption({ label: brandName });
  await page.locator('#product-form input[name="sku"]').fill(sku);
  await page.locator('#product-form input[name="price"]').fill("2499.90");
  await page.locator('#product-form input[name="promotionalPrice"]').fill("2299.90");
  await page.locator('#product-form input[name="stockInitial"]').fill("7");
  await page.locator('#product-form input[name="stockMinimum"]').fill("2");
  await page.locator('#product-form textarea[name="shortDescription"]').fill("Produto criado no E2E visual.");
  await page.locator('#product-form textarea[name="description"]').fill("Fluxo real do MVP com imagem local.");
  await page.locator('#product-form input[name="mainImage"]').setInputFiles(productImagePath);
  await page.locator('#product-form input[name="galleryImages"]').setInputFiles(productImagePath);
  await expect(page.locator("#product-main-image-preview img")).toBeVisible();
  await page.getByRole("button", { name: "Salvar produto" }).click();
  const productRow = page.locator("tr", { has: page.getByText(productName) }).first();
  await expect(productRow).toBeVisible();
  await expect(productRow).toContainText(sku);
}

async function setGalleryImageAsMain(page, productName) {
  const productRow = page.locator("tr", { has: page.getByText(productName) }).first();
  await expect(productRow).toBeVisible();
  await productRow.getByRole("button", { name: "Definir principal" }).first().click();
  await expect(productRow.getByText("Principal").first()).toBeVisible();
}

async function registerCustomerAndBuyProduct(page, productName) {
  const email = `${uniqueValue("cliente")}@shopmax.local`;
  const cpf = uniqueDigits(11);

  await page.goto("http://127.0.0.1:4173/#/register");
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  await page.locator('#register-form input[name="name"]').fill("Cliente Browser E2E");
  await page.locator('#register-form input[name="email"]').fill(email);
  await page.locator('#register-form input[name="cpf"]').fill(cpf);
  await page.locator('#register-form input[name="phone"]').fill(`119${uniqueDigits(8)}`);
  await page.locator('#register-form input[name="password"]').fill("Cliente@123");
  await page.locator('#register-form input[name="confirmPassword"]').fill("Cliente@123");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByRole("heading", { name: "Minha conta" })).toBeVisible();

  await page.locator("#search-input").fill(productName);
  await page.locator("#search-form").getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByRole("heading", { name: "Busca de produtos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: productName }).first()).toBeVisible();
  await page.getByRole("link", { name: "Ver produto" }).first().click();

  await expect(page.getByRole("heading", { name: productName })).toBeVisible();
  await expect(page.locator(".product-page__image")).toBeVisible();
  await expect(page.locator(".product-page__image")).toHaveAttribute("src", /\/uploads\/products\/images\//);
  await expect(page.locator(".row img[src*='/uploads/products/images/']").first()).toBeVisible();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await expect(page).toHaveURL(/#\/cart$/);
  await expect(page.getByRole("heading", { name: "Carrinho" })).toBeVisible();
  await expect(page.getByText(productName)).toBeVisible();
  await page.getByRole("link", { name: "Ir para checkout" }).click();
  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

  await page.locator('#checkout-form input[name="recipient"]').fill("Cliente Browser E2E");
  await page.locator('#checkout-form input[name="zipCode"]').fill("01001000");
  await page.locator('#checkout-form input[name="street"]').fill("Rua Browser");
  await page.locator('#checkout-form input[name="number"]').fill("160");
  await page.locator('#checkout-form input[name="district"]').fill("Centro");
  await page.locator('#checkout-form input[name="city"]').fill("Sao Paulo");
  await page.locator('#checkout-form input[name="state"]').fill("SP");
  await page.getByRole("button", { name: "Finalizar compra" }).click();

  await expect(page).toHaveURL(/#\/orders\/\d+$/);
  await expect(page.getByRole("heading", { name: /Pedido/ })).toBeVisible();
  const orderId = Number(new URL(page.url()).hash.replace("#/orders/", ""));
  return { orderId, email };
}

async function updateOrderStatusInAdmin(page, orderId) {
  await page.goto("http://127.0.0.1:4174/#/orders");
  await expect(page.getByRole("heading", { name: "Pedidos" }).first()).toBeVisible();
  const orderRow = page.locator("tr", { has: page.getByText(`#${orderId}`) }).first();
  await expect(orderRow).toBeVisible();
  await page.locator('#order-form select[name="orderId"]').selectOption(String(orderId));
  await page.locator('#order-form select[name="status"]').selectOption("em_separacao");
  await page.getByRole("button", { name: "Atualizar pedido" }).click();
  await expect(orderRow).toContainText("em_separacao");
}

test("MVP visual E2E cobre admin, upload, loja, checkout e atualizacao de pedido", async ({ browser }) => {
  const adminContext = await browser.newContext();
  const shopContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const shopPage = await shopContext.newPage();

  const categoryName = uniqueValue("Categoria Browser");
  const brandName = uniqueValue("Marca Browser");
  const productName = uniqueValue("Produto Browser");
  const sku = `E2E-${uniqueDigits(6)}`;

  await loginAdmin(adminPage);
  await createCategory(adminPage, categoryName);
  await createBrand(adminPage, brandName);
  await createProduct(adminPage, productName, sku, categoryName, brandName);
  await setGalleryImageAsMain(adminPage, productName);

  const { orderId } = await registerCustomerAndBuyProduct(shopPage, productName);
  await updateOrderStatusInAdmin(adminPage, orderId);

  await adminContext.close();
  await shopContext.close();
});
