import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./src/styles.css";
import { adminApi, resolveAdminAssetUrl } from "./src/services/api.js";
import { clearAdminSession, getAdminSession, setAdminSession } from "./src/store/auth-session.js";

const app = document.querySelector("#app");
const navItems = [
  ["dashboard", "Dashboard"],
  ["products", "Produtos"],
  ["categories", "Categorias"],
  ["brands", "Marcas"],
  ["stock", "Estoque"],
  ["orders", "Pedidos"],
  ["customers", "Clientes"],
  ["coupons", "Cupons"],
  ["promotions", "Promotions"],
  ["reports", "Relatorios"],
  ["audit-logs", "Audit Logs"]
];

const orderStatuses = [
  "aguardando_pagamento",
  "pagamento_aprovado",
  "em_separacao",
  "enviado",
  "entregue",
  "cancelado",
  "reembolsado"
];

const state = {
  session: getAdminSession(),
  currentView: window.location.hash.replace("#/", "") || "dashboard",
  currentUser: null,
  loading: false,
  error: "",
  dashboard: null,
  categories: [],
  brands: [],
  products: [],
  stock: [],
  orders: [],
  customers: [],
  coupons: [],
  promotions: [],
  reports: null,
  advancedReports: null,
  abandonedCarts: [],
  recoveryResult: null,
  orderTrackingSyncResult: null,
  trackingBatchResult: null,
  integrationStatus: null,
  integrationProbeResult: null,
  integrationLiveValidationResult: null,
  auditLogs: []
};

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function describeLiveIntegrationResult(result) {
  if (!result) {
    return "";
  }

  if (result.state === "blocked") {
    return `${result.integration}: bloqueado com seguranca. ${result.reason ?? ""}`.trim();
  }

  if (result.state === "config_error") {
    return `${result.integration}: configuracao incompleta. ${result.reason ?? ""}`.trim();
  }

  if (result.state === "provider_error") {
    return `${result.integration}: falha no provedor. ${result.reason ?? "Verifique o ambiente live."}`.trim();
  }

  return `${result.integration}: homologacao live concluida com sucesso.`;
}

function productImagePreviewUrl(product) {
  return product.mainImageUrl ? resolveAdminAssetUrl(product.mainImageUrl) : "https://placehold.co/160x120?text=Sem+midia";
}

function renderProductMediaSummary(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const videos = Array.isArray(product.videos) ? product.videos : [];

  if (!images.length && !videos.length) {
    return `<span class="text-secondary small">Sem midia cadastrada.</span>`;
  }

  return [
    ...images.map(
      (image) => `
        <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
          <img src="${escapeHtml(resolveAdminAssetUrl(image.url))}" alt="${escapeHtml(image.altText ?? product.name)}" class="rounded border" style="width:48px;height:48px;object-fit:cover;">
          <span class="badge text-bg-${image.isMain ? "success" : "light"} border">${image.isMain ? "Principal" : "Galeria"}</span>
          ${
            image.isMain
              ? ""
              : `<button class="btn btn-sm btn-outline-primary" type="button" data-action="set-main-image" data-product-id="${product.id}" data-image-id="${image.id}">Definir principal</button>`
          }
          <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete-product-image" data-product-id="${product.id}" data-image-id="${image.id}">Remover</button>
        </div>
      `
    ),
    ...videos.map(
      (video) => `
        <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
          <span class="badge text-bg-dark">Video</span>
          <a class="small" href="${escapeHtml(resolveAdminAssetUrl(video.url))}" target="_blank" rel="noreferrer">Abrir arquivo</a>
          <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete-product-video" data-product-id="${product.id}" data-video-id="${video.id}">Remover</button>
        </div>
      `
    )
  ].join("");
}

function setHash(view) {
  window.location.hash = `/${view}`;
}

function setLoading(value) {
  state.loading = value;
  render();
}

function setError(message) {
  state.error = message;
  render();
}

function clearError() {
  if (state.error) {
    state.error = "";
  }
}

function requireSession() {
  if (!state.session?.token) {
    throw new Error("Sessao administrativa nao encontrada.");
  }

  return state.session.token;
}

async function bootstrapSession() {
  if (!state.session?.token) {
    render();
    return;
  }

  try {
    state.currentUser = await adminApi.getCurrentUser(state.session.token);
    await loadViewData(state.currentView, { silent: true });
  } catch (error) {
    clearAdminSession();
    state.session = null;
    state.currentUser = null;
    setError(error.message);
  }
}

async function loadViewData(view, options = {}) {
  if (!state.session?.token) {
    return;
  }

  const token = requireSession();
  const silent = options.silent ?? false;

  if (!silent) {
    setLoading(true);
    clearError();
  }

  try {
    if (view === "dashboard") {
      state.dashboard = await adminApi.getDashboard(token);
    }

    if (view === "products") {
      const [products, categories, brands] = await Promise.all([
        adminApi.listProducts({}, token),
        adminApi.listCategories(token),
        adminApi.listBrands(token)
      ]);
      state.products = products;
      state.categories = categories;
      state.brands = brands;
    }

    if (view === "categories") {
      state.categories = await adminApi.listCategories(token);
    }

    if (view === "brands") {
      state.brands = await adminApi.listBrands(token);
    }

    if (view === "stock") {
      state.stock = await adminApi.listStock(token);
    }

    if (view === "orders") {
      const [orders, integrationStatus] = await Promise.all([
        adminApi.listOrders(token),
        adminApi.getIntegrationStatus(token)
      ]);
      state.orders = orders;
      state.integrationStatus = integrationStatus;
    }

    if (view === "customers") {
      state.customers = await adminApi.listCustomers(token);
    }

    if (view === "coupons") {
      const [coupons, categories] = await Promise.all([
        adminApi.listCoupons(token),
        adminApi.listCategories(token)
      ]);
      state.coupons = coupons;
      state.categories = categories;
    }

    if (view === "reports") {
      const [reports, advancedReports, abandonedCarts] = await Promise.all([
        adminApi.getReports(token),
        adminApi.getAdvancedReports(token),
        adminApi.listAbandonedCarts(token)
      ]);
      state.reports = reports;
      state.advancedReports = advancedReports;
      state.abandonedCarts = abandonedCarts;
    }

    if (view === "promotions") {
      const [promotions, categories, products] = await Promise.all([
        adminApi.listPromotions(token),
        adminApi.listCategories(token),
        adminApi.listProducts({}, token)
      ]);
      state.promotions = promotions;
      state.categories = categories;
      state.products = products;
    }

    if (view === "audit-logs") {
      state.auditLogs = await adminApi.getAuditLogs(token);
    }
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function createMetricCard(title, value, helper) {
  return `
    <div class="col-md-4 col-xl-3">
      <article class="metric-card shadow-sm h-100">
        <span class="metric-label">${escapeHtml(title)}</span>
        <strong class="metric-value">${escapeHtml(value)}</strong>
        <small class="metric-helper">${escapeHtml(helper)}</small>
      </article>
    </div>
  `;
}

function renderTable(headers, rows, emptyMessage = "Nenhum dado encontrado.") {
  if (!rows.length) {
    return `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-dark table-striped align-middle mb-0">
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

function renderLogin() {
  app.innerHTML = `
    <main class="admin-login-shell">
      <section class="card admin-login-card border-0 shadow-lg">
        <div class="card-body p-4 p-lg-5">
          <span class="badge text-bg-success mb-3">Sprint 4</span>
          <h1 class="h3 fw-bold mb-2">ShopMax Admin</h1>
          <p class="text-secondary mb-4">
            Entre com um usuario administrativo para operar catalogo, estoque, pedidos e relatorios.
          </p>
          ${state.error ? `<div class="alert alert-danger">${escapeHtml(state.error)}</div>` : ""}
          <form id="login-form" class="vstack gap-3">
            <div>
              <label class="form-label">Email</label>
              <input class="form-control form-control-lg" name="email" type="email" required />
            </div>
            <div>
              <label class="form-label">Senha</label>
              <input class="form-control form-control-lg" name="password" type="password" required />
            </div>
            <button class="btn btn-success btn-lg" type="submit" ${state.loading ? "disabled" : ""}>
              ${state.loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p class="demo-hint mt-4 mb-0">
            Dica: use o admin semeado do ambiente para validar o MVP.
          </p>
        </div>
      </section>
    </main>
  `;

  document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    clearError();
    setLoading(true);

    try {
      const session = await adminApi.login({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? "")
      });
      state.session = session;
      setAdminSession(session);
      state.currentUser = await adminApi.getCurrentUser(session.token);
      state.currentView = "dashboard";
      setHash("dashboard");
      await loadViewData("dashboard");
    } catch (error) {
      setError(error.message);
      state.loading = false;
    }
  });
}

function dashboardView() {
  const data = state.dashboard ?? {};

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumo operacional do MVP com foco em pedidos, clientes e estoque.</p>
        </div>
      </div>
      <div class="row g-3">
        ${createMetricCard("Faturamento", formatCurrency(data.revenue_total), "Pedidos nao cancelados")}
        ${createMetricCard("Pedidos", String(data.total_orders ?? 0), "Total de pedidos cadastrados")}
        ${createMetricCard("Pendentes", String(data.pending_orders ?? 0), "Aguardando pagamento")}
        ${createMetricCard("Entregues", String(data.delivered_orders ?? 0), "Fluxo finalizado")}
        ${createMetricCard("Ticket medio", formatCurrency(data.average_ticket), "Media por pedido")}
        ${createMetricCard("Clientes", String(data.total_customers ?? 0), "Base atendida")}
        ${createMetricCard("Estoque baixo", String(data.low_stock_products ?? 0), "Produtos com alerta")}
      </div>
    </section>
  `;
}

function productsView() {
  const categoryOptions = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  const brandOptions = state.brands
    .map((brand) => `<option value="${brand.id}">${escapeHtml(brand.name)}</option>`)
    .join("");

  const rows = state.products.map(
    (product) => `
      <tr>
        <td><img src="${escapeHtml(productImagePreviewUrl(product))}" alt="${escapeHtml(product.name)}" class="rounded border" style="width:72px;height:72px;object-fit:cover;"></td>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.categoryName ?? "-")}</td>
        <td>${escapeHtml(product.brandName ?? "-")}</td>
        <td>${escapeHtml(product.sku)}</td>
        <td>${formatCurrency(product.promotionalPrice ?? product.price)}</td>
        <td><span class="badge text-bg-${product.status === "ativo" ? "success" : "secondary"}">${escapeHtml(product.status)}</span></td>
        <td>${renderProductMediaSummary(product)}</td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Produtos</h2>
          <p>Cadastro de produtos operando na API real do catalogo.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-5">
          <form id="product-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Novo produto</h3>
              <div class="row g-3">
                <div class="col-12">
                  <input class="form-control" name="name" placeholder="Nome" required />
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="categoryId" required>
                    <option value="">Categoria</option>
                    ${categoryOptions}
                  </select>
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="brandId" required>
                    <option value="">Marca</option>
                    ${brandOptions}
                  </select>
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="sku" placeholder="SKU" required />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="price" type="number" min="0" step="0.01" placeholder="Preco" required />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="promotionalPrice" type="number" min="0" step="0.01" placeholder="Preco promocional" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="stockInitial" type="number" min="0" step="1" placeholder="Estoque inicial" required />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="stockMinimum" type="number" min="0" step="1" placeholder="Estoque minimo" />
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="status">
                    <option value="ativo">Ativo</option>
                    <option value="rascunho">Rascunho</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label mb-1">Imagem principal</label>
                  <input class="form-control" name="mainImage" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" />
                  <div class="form-text">Tipos aceitos: jpg, jpeg, png e webp. Maximo de 5MB.</div>
                </div>
                <div class="col-12">
                  <div id="product-main-image-preview" class="border rounded p-2 text-center text-secondary small">Nenhuma imagem selecionada.</div>
                </div>
                <div class="col-12">
                  <label class="form-label mb-1">Galeria adicional</label>
                  <input class="form-control" name="galleryImages" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple />
                </div>
                <div class="col-12">
                  <label class="form-label mb-1">Videos do produto</label>
                  <input class="form-control" name="videoFiles" type="file" accept=".mp4,.webm,video/mp4,video/webm" multiple />
                  <div class="form-text">Tipos aceitos: mp4 e webm. Maximo de 20MB por arquivo.</div>
                </div>
                <div class="col-12">
                  <input class="form-control" name="mainImageUrl" placeholder="URL externa opcional da imagem principal" />
                </div>
                <div class="col-12">
                  <textarea class="form-control" name="shortDescription" rows="2" placeholder="Descricao curta"></textarea>
                </div>
                <div class="col-12">
                  <textarea class="form-control" name="description" rows="3" placeholder="Descricao completa"></textarea>
                </div>
              </div>
              <button class="btn btn-success mt-3" type="submit">Salvar produto</button>
            </div>
          </form>
        </div>
        <div class="col-xl-7">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Catalogo atual</h3>
              ${renderTable(["Imagem", "Produto", "Categoria", "Marca", "SKU", "Preco", "Status", "Midias"], rows)}
            </div>
          </div>
          <div class="card panel-card shadow-sm border-0 mt-4">
            <div class="card-body">
              <h3 class="h5 mb-3">Adicionar midias em produto existente</h3>
              <form id="product-media-form" class="row g-3">
                <div class="col-md-4">
                  <select class="form-select" name="productId" required>
                    <option value="">Selecione o produto</option>
                    ${state.products.map((product) => `<option value="${product.id}">${escapeHtml(product.name)}</option>`).join("")}
                  </select>
                </div>
                <div class="col-md-4">
                  <input class="form-control" name="mainImage" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" />
                </div>
                <div class="col-md-4">
                  <input class="form-control" name="galleryImages" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple />
                </div>
                <div class="col-12">
                  <input class="form-control" name="videoFiles" type="file" accept=".mp4,.webm,video/mp4,video/webm" multiple />
                </div>
                <div class="col-12">
                  <button class="btn btn-outline-primary" type="submit">Enviar novas midias</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function categoriesView() {
  const rows = state.categories.map(
    (category) => `
      <tr>
        <td>${escapeHtml(category.name)}</td>
        <td>${escapeHtml(category.slug)}</td>
        <td>${escapeHtml(category.status ?? "-")}</td>
      </tr>
    `
  );

  const parentOptions = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Categorias</h2>
          <p>Estruturacao do catalogo com cadastro direto na API.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-lg-4">
          <form id="category-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Nova categoria</h3>
              <div class="vstack gap-3">
                <input class="form-control" name="name" placeholder="Nome" required />
                <input class="form-control" name="slug" placeholder="Slug opcional" />
                <textarea class="form-control" name="description" rows="3" placeholder="Descricao"></textarea>
                <input class="form-control" name="imageUrl" placeholder="URL da imagem" />
                <input class="form-control" name="bannerUrl" placeholder="URL do banner" />
                <input class="form-control" name="displayOrder" type="number" min="0" step="1" placeholder="Ordem de exibicao" />
                <select class="form-select" name="parentCategoryId">
                  <option value="">Categoria pai</option>
                  ${parentOptions}
                </select>
                <select class="form-select" name="status">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <button class="btn btn-success" type="submit">Salvar categoria</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-lg-8">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Categorias cadastradas</h3>
              ${renderTable(["Nome", "Slug", "Status"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function brandsView() {
  const rows = state.brands.map(
    (brand) => `
      <tr>
        <td>${escapeHtml(brand.name)}</td>
        <td>${escapeHtml(brand.slug)}</td>
        <td>${escapeHtml(brand.status ?? "-")}</td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Marcas</h2>
          <p>Cadastro de marcas reutilizavel para produtos e relatorios.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-lg-4">
          <form id="brand-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Nova marca</h3>
              <div class="vstack gap-3">
                <input class="form-control" name="name" placeholder="Nome" required />
                <input class="form-control" name="slug" placeholder="Slug opcional" />
                <input class="form-control" name="logoUrl" placeholder="URL do logo" />
                <select class="form-select" name="status">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <button class="btn btn-success" type="submit">Salvar marca</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-lg-8">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Marcas cadastradas</h3>
              ${renderTable(["Nome", "Slug", "Status"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function stockView() {
  const rows = state.stock.map(
    (stock) => `
      <tr>
        <td>${escapeHtml(stock.produto_nome ?? "-")}</td>
        <td>${escapeHtml(stock.produto_sku ?? "-")}</td>
        <td>${escapeHtml(stock.saldo)}</td>
        <td>${escapeHtml(stock.estoque_minimo)}</td>
        <td>${escapeHtml(stock.produto_status ?? "-")}</td>
      </tr>
    `
  );

  const stockOptions = state.stock
    .map((stock) => `<option value="${stock.id}">${escapeHtml(stock.produto_nome)} (#${stock.id})</option>`)
    .join("");

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Estoque</h2>
          <p>Ajustes administrativos com rastreabilidade de saldo e motivo.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-4">
          <form id="stock-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Ajustar estoque</h3>
              <div class="vstack gap-3">
                <select class="form-select" name="stockId" required>
                  <option value="">Selecione o estoque</option>
                  ${stockOptions}
                </select>
                <input class="form-control" name="quantityDelta" type="number" step="1" placeholder="Delta (+/-)" required />
                <input class="form-control" name="stockMinimum" type="number" min="0" step="1" placeholder="Novo estoque minimo" />
                <textarea class="form-control" name="reason" rows="3" placeholder="Motivo do ajuste" required></textarea>
                <button class="btn btn-success" type="submit">Aplicar ajuste</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-xl-8">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Posicao atual</h3>
              ${renderTable(["Produto", "SKU", "Saldo", "Minimo", "Status"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function ordersView() {
  const emailStatus = state.integrationStatus?.email;
  const trackingStatus = state.integrationStatus?.tracking;
  const rows = state.orders.map(
    (order) => `
      <tr>
        <td>#${order.id}</td>
        <td>${escapeHtml(order.cliente_nome)}</td>
        <td>${formatCurrency(order.total)}</td>
        <td>${escapeHtml(order.status)}</td>
        <td>${escapeHtml(order.payment_status ?? "-")}</td>
        <td>${escapeHtml(order.delivery_status ?? "-")}</td>
        <td>${escapeHtml(order.delivery_tracking_code ?? "-")}</td>
        <td>${formatDate(order.created_at)}</td>
        <td>
          <button
            class="btn btn-outline-info btn-sm"
            data-action="sync-tracking"
            data-order-id="${order.id}"
            ${order.delivery_tracking_code ? "" : "disabled"}
          >
            Sincronizar
          </button>
        </td>
      </tr>
    `
  );

  const orderOptions = state.orders
    .map((order) => `<option value="${order.id}">#${order.id} - ${escapeHtml(order.cliente_nome)}</option>`)
    .join("");
  const statusOptions = orderStatuses
    .map((status) => `<option value="${status}">${escapeHtml(status)}</option>`)
    .join("");

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Pedidos</h2>
          <p>Consulta operacional e atualizacao de status com rastreio.</p>
          ${
            state.orderTrackingSyncResult
              ? `<div class="alert alert-info mt-3 mb-0">
                  Sincronizacao concluida para pedido #${escapeHtml(
                    state.orderTrackingSyncResult.orderId
                  )} via ${escapeHtml(state.orderTrackingSyncResult.tracking.provider)}.
                </div>`
              : ""
          }
          ${
            state.trackingBatchResult
              ? `<div class="alert alert-secondary mt-3 mb-0">
                  Sincronizacao em lote processou ${escapeHtml(state.trackingBatchResult.processed.length)} pedido(s)
                  com ${escapeHtml(state.trackingBatchResult.failed.length)} falha(s).
                </div>`
              : ""
          }
          ${
            state.integrationProbeResult
              ? `<div class="alert alert-warning mt-3 mb-0">
                  Ultimo teste: ${escapeHtml(state.integrationProbeResult.kind)} via ${escapeHtml(
                    state.integrationProbeResult.provider
                  )} com status ${escapeHtml(state.integrationProbeResult.status)}.
                </div>`
              : ""
          }
          ${
            state.integrationLiveValidationResult
              ? `<div class="alert alert-${state.integrationLiveValidationResult.allOk ? "success" : "dark"} mt-3 mb-0">
                  <strong>Validacao live:</strong> email ${escapeHtml(
                    state.integrationLiveValidationResult.email.state ?? "desconhecido"
                  )} / rastreio ${escapeHtml(
                    state.integrationLiveValidationResult.tracking.state ?? "desconhecido"
                  )}.
                  <div class="small mt-2">${escapeHtml(
                    describeLiveIntegrationResult(state.integrationLiveValidationResult.email)
                  )}</div>
                  <div class="small">${escapeHtml(
                    describeLiveIntegrationResult(state.integrationLiveValidationResult.tracking)
                  )}</div>
                </div>`
              : ""
          }
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-4">
          <form id="order-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Atualizar status</h3>
              <div class="vstack gap-3">
                <select class="form-select" name="orderId" required>
                  <option value="">Selecione o pedido</option>
                  ${orderOptions}
                </select>
                <select class="form-select" name="status" required>
                  ${statusOptions}
                </select>
                <input class="form-control" name="trackingCode" placeholder="Codigo de rastreio (opcional)" />
                <button class="btn btn-success" type="submit">Atualizar pedido</button>
              </div>
            </div>
          </form>
          <div class="card panel-card shadow-sm border-0 mt-4">
            <div class="card-body">
              <h3 class="h5 mb-3">Integracoes</h3>
              <div class="vstack gap-3">
                <div class="border rounded p-3">
                  <strong>E-mail:</strong> ${escapeHtml(emailStatus?.mode ?? "-")} ·
                  ${emailStatus?.ready ? "Pronto" : "Fallback ativo"}
                </div>
                <div class="border rounded p-3">
                  <strong>Rastreio:</strong> ${escapeHtml(trackingStatus?.provider ?? "-")} ·
                  ${trackingStatus?.ready ? "Pronto" : "Configuracao pendente"}
                </div>
                <button class="btn btn-outline-success" id="test-email-integration-button" type="button">
                  Testar e-mail
                </button>
                <button class="btn btn-outline-primary" id="test-tracking-integration-button" type="button">
                  Testar rastreio
                </button>
                <button class="btn btn-outline-warning" id="validate-live-integrations-button" type="button">
                  Validar live
                </button>
                <button class="btn btn-outline-light" id="sync-pending-tracking-button" type="button">
                  Sincronizar pendentes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Fila de pedidos</h3>
              ${renderTable(["Pedido", "Cliente", "Total", "Status", "Pagamento", "Entrega", "Rastreio", "Criado em", "Acoes"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function customersView() {
  const rows = state.customers.map(
    (customer) => `
      <tr>
        <td>${escapeHtml(customer.nome)}</td>
        <td>${escapeHtml(customer.email)}</td>
        <td>${escapeHtml(customer.cpf)}</td>
        <td>${escapeHtml(customer.telefone ?? "-")}</td>
        <td>${escapeHtml(customer.total_pedidos)}</td>
        <td>${formatCurrency(customer.total_gasto)}</td>
        <td>${formatDate(customer.ultima_compra)}</td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Clientes</h2>
          <p>Base de clientes com consolidado de pedidos e gasto total.</p>
        </div>
      </div>
      <div class="card panel-card shadow-sm border-0">
        <div class="card-body">
          ${renderTable(["Cliente", "Email", "CPF", "Telefone", "Pedidos", "Gasto total", "Ultima compra"], rows)}
        </div>
      </div>
    </section>
  `;
}

function couponsView() {
  const categoryOptions = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  const rows = state.coupons.map(
    (coupon) => `
      <tr>
        <td>${escapeHtml(coupon.codigo)}</td>
        <td>${escapeHtml(coupon.tipo)}</td>
        <td>${formatCurrency(coupon.valor)}</td>
        <td>${coupon.percentual ? `${escapeHtml(coupon.percentual)}%` : "-"}</td>
        <td>${formatDate(coupon.validade_fim)}</td>
        <td>${escapeHtml(coupon.categoria_nome ?? "Todas")}</td>
        <td>${coupon.ativo ? "Ativo" : "Inativo"}</td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Cupons</h2>
          <p>Cupons percentuais ou de valor fixo com validade e elegibilidade.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-5">
          <form id="coupon-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Novo cupom</h3>
              <div class="row g-3">
                <div class="col-12">
                  <input class="form-control" name="code" placeholder="Codigo" required />
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="type">
                    <option value="valor_fixo">Valor fixo</option>
                    <option value="percentual">Percentual</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="active">
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="fixedValue" type="number" min="0" step="0.01" placeholder="Valor fixo" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="percentage" type="number" min="0" max="100" step="0.01" placeholder="Percentual" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="minimumValue" type="number" min="0" step="0.01" placeholder="Valor minimo" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="totalUsageLimit" type="number" min="1" step="1" placeholder="Limite total" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="customerUsageLimit" type="number" min="1" step="1" placeholder="Limite por cliente" />
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="categoryId">
                    <option value="">Categoria opcional</option>
                    ${categoryOptions}
                  </select>
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="validFrom" type="datetime-local" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" name="validUntil" type="datetime-local" />
                </div>
              </div>
              <button class="btn btn-success mt-3" type="submit">Salvar cupom</button>
            </div>
          </form>
        </div>
        <div class="col-xl-7">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Cupons cadastrados</h3>
              ${renderTable(["Codigo", "Tipo", "Valor", "Percentual", "Validade", "Categoria", "Status"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function promotionsView() {
  const productOptions = state.products
    .map((product) => `<option value="${product.id}">${escapeHtml(product.name)}</option>`)
    .join("");
  const categoryOptions = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  const rows = state.promotions.map(
    (promotion) => `
      <tr>
        <td>${escapeHtml(promotion.name)}</td>
        <td>${escapeHtml(promotion.type)}</td>
        <td>${promotion.percentage ? `${escapeHtml(promotion.percentage)}%` : formatCurrency(promotion.value)}</td>
        <td>${promotion.productId ? `Produto #${promotion.productId}` : promotion.categoryId ? `Categoria #${promotion.categoryId}` : "-"}</td>
        <td>${escapeHtml(promotion.status)}</td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Promotions</h2>
          <p>Campanhas de produto ou categoria refletidas no catalogo e no carrinho.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-5">
          <form id="promotion-form" class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Nova promocao</h3>
              <div class="row g-3">
                <div class="col-12"><input class="form-control" name="name" placeholder="Nome da campanha" required /></div>
                <div class="col-md-6">
                  <select class="form-select" name="type">
                    <option value="produto">Produto</option>
                    <option value="categoria">Categoria</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="status">
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </select>
                </div>
                <div class="col-md-6"><input class="form-control" name="percentage" type="number" min="0" max="100" step="0.01" placeholder="% desconto" /></div>
                <div class="col-md-6"><input class="form-control" name="value" type="number" min="0" step="0.01" placeholder="Valor desconto" /></div>
                <div class="col-md-6">
                  <select class="form-select" name="productId">
                    <option value="">Produto alvo</option>
                    ${productOptions}
                  </select>
                </div>
                <div class="col-md-6">
                  <select class="form-select" name="categoryId">
                    <option value="">Categoria alvo</option>
                    ${categoryOptions}
                  </select>
                </div>
              </div>
              <button class="btn btn-success mt-3" type="submit">Salvar promocao</button>
            </div>
          </form>
        </div>
        <div class="col-xl-7">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Promocoes cadastradas</h3>
              ${renderTable(["Nome", "Tipo", "Desconto", "Alvo", "Status"], rows)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function reportsView() {
  const reports = state.reports ?? { salesByStatus: [], topProducts: [], lowStock: [] };
  const advanced = state.advancedReports ?? {
    revenueByDay: [],
    topCategories: [],
    couponPerformance: [],
    reviewAverages: [],
    abandonedCarts: []
  };
  const salesRows = reports.salesByStatus.map(
    (item) => `<tr><td>${escapeHtml(item.status)}</td><td>${escapeHtml(item.total)}</td></tr>`
  );
  const productRows = reports.topProducts.map(
    (item) =>
      `<tr><td>${escapeHtml(item.nome_produto)}</td><td>${escapeHtml(item.total_quantity)}</td><td>${formatCurrency(item.total_revenue)}</td></tr>`
  );
  const stockRows = reports.lowStock.map(
    (item) =>
      `<tr><td>${escapeHtml(item.nome)}</td><td>${escapeHtml(item.sku)}</td><td>${escapeHtml(item.saldo)}</td><td>${escapeHtml(item.estoque_minimo)}</td></tr>`
  );
  const dailyRows = advanced.revenueByDay.map(
    (item) =>
      `<tr><td>${escapeHtml(item.reference_day)}</td><td>${escapeHtml(item.total_orders)}</td><td>${formatCurrency(item.total_revenue)}</td></tr>`
  );
  const categoryRows = advanced.topCategories.map(
    (item) =>
      `<tr><td>${escapeHtml(item.category_name)}</td><td>${escapeHtml(item.total_quantity)}</td><td>${formatCurrency(item.total_revenue)}</td></tr>`
  );
  const couponRows = advanced.couponPerformance.map(
    (item) =>
      `<tr><td>${escapeHtml(item.codigo)}</td><td>${escapeHtml(item.total_usage)}</td><td>${formatCurrency(item.total_discount)}</td></tr>`
  );
  const reviewRows = advanced.reviewAverages.map(
    (item) =>
      `<tr><td>${escapeHtml(item.product_name)}</td><td>${Number(item.average_rating ?? 0).toFixed(2)}</td><td>${escapeHtml(item.reviews_count)}</td></tr>`
  );
  const abandonedRows = state.abandonedCarts.map(
    (item) =>
      `<tr><td>#${item.id}</td><td>${escapeHtml(item.cliente_nome)}</td><td>${escapeHtml(item.cliente_email)}</td><td>${escapeHtml(item.items_count)}</td><td>${formatCurrency(item.subtotal)}</td><td>${formatDate(item.updated_at)}</td></tr>`
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Relatorios</h2>
          <p>Indicadores MVP para vendas por status, top produtos e estoque critico.</p>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-xl-4">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Vendas por status</h3>
              ${renderTable(["Status", "Total"], salesRows)}
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Top produtos</h3>
              ${renderTable(["Produto", "Qtd", "Receita"], productRows)}
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-3">Estoque critico</h3>
              ${renderTable(["Produto", "SKU", "Saldo", "Minimo"], stockRows)}
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="card panel-card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 class="h5 mb-1">Relatorios avancados e carrinho abandonado</h3>
                  <p class="mb-0 text-secondary">Base do V2 para retencao, notificacoes e leitura operacional.</p>
                </div>
                <button class="btn btn-outline-warning" id="process-abandoned-carts-button" type="button">Processar recuperacao</button>
              </div>
              ${state.recoveryResult ? `<div class="alert alert-success">Processados ${state.recoveryResult.processed.length} carrinho(s).</div>` : ""}
              <div class="row g-4">
                <div class="col-xl-6">
                  <h4 class="h6 mb-3">Receita por dia</h4>
                  ${renderTable(["Dia", "Pedidos", "Receita"], dailyRows)}
                </div>
                <div class="col-xl-6">
                  <h4 class="h6 mb-3">Top categorias</h4>
                  ${renderTable(["Categoria", "Qtd", "Receita"], categoryRows)}
                </div>
                <div class="col-xl-6">
                  <h4 class="h6 mb-3">Performance de cupons</h4>
                  ${renderTable(["Cupom", "Usos", "Desconto"], couponRows)}
                </div>
                <div class="col-xl-6">
                  <h4 class="h6 mb-3">Media de reviews</h4>
                  ${renderTable(["Produto", "Media", "Reviews"], reviewRows)}
                </div>
                <div class="col-12">
                  <h4 class="h6 mb-3">Carrinhos abandonados</h4>
                  ${renderTable(["Carrinho", "Cliente", "Email", "Itens", "Subtotal", "Ultima atividade"], abandonedRows, "Nenhum carrinho abandonado no corte atual.")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function auditLogsView() {
  const rows = state.auditLogs.map(
    (item) => `
      <tr>
        <td>${formatDate(item.created_at)}</td>
        <td>${escapeHtml(item.usuario_email ?? item.usuario_nome ?? "-")}</td>
        <td>${escapeHtml(item.modulo)}</td>
        <td>${escapeHtml(item.acao)}</td>
        <td>${escapeHtml(item.entidade)}</td>
        <td><code>${escapeHtml(item.entidade_id ?? "-")}</code></td>
      </tr>
    `
  );

  return `
    <section class="panel-section">
      <div class="section-header">
        <div>
          <h2>Audit Logs</h2>
          <p>Ultimas acoes administrativas sensiveis persistidas no backend.</p>
        </div>
      </div>
      <div class="card panel-card shadow-sm border-0">
        <div class="card-body">
          ${renderTable(["Quando", "Usuario", "Modulo", "Acao", "Entidade", "ID"], rows)}
        </div>
      </div>
    </section>
  `;
}

function resolveView() {
  switch (state.currentView) {
    case "products":
      return productsView();
    case "categories":
      return categoriesView();
    case "brands":
      return brandsView();
    case "stock":
      return stockView();
    case "orders":
      return ordersView();
    case "customers":
      return customersView();
    case "coupons":
      return couponsView();
    case "reports":
      return reportsView();
    case "promotions":
      return promotionsView();
    case "audit-logs":
      return auditLogsView();
    case "dashboard":
    default:
      return dashboardView();
  }
}

function renderShell() {
  const currentUserName = state.currentUser?.name ?? state.currentUser?.email ?? "Admin";

  app.innerHTML = `
    <main class="admin-app-shell">
      <aside class="admin-sidebar">
        <div>
          <span class="sidebar-badge">ShopMax</span>
          <h1>Painel Admin</h1>
          <p>Operacao centralizada do MVP com APIs reais.</p>
        </div>
        <nav class="nav flex-column gap-2 mt-4">
          ${navItems
            .map(
              ([key, label]) => `
                <button class="nav-link admin-nav-link ${state.currentView === key ? "active" : ""}" data-view="${key}">
                  ${escapeHtml(label)}
                </button>
              `
            )
            .join("")}
        </nav>
        <div class="sidebar-footer">
          <small>Conectado como</small>
          <strong>${escapeHtml(currentUserName)}</strong>
          <button id="logout-button" class="btn btn-outline-light btn-sm mt-3">Sair</button>
        </div>
      </aside>
      <section class="admin-content">
        <header class="admin-topbar">
          <div>
            <h2 class="mb-1">${escapeHtml(navItems.find(([key]) => key === state.currentView)?.[1] ?? "Dashboard")}</h2>
            <p class="mb-0 text-secondary">Sprint 7 - Operacao admin com V2 fundacional</p>
          </div>
          ${state.loading ? '<span class="badge text-bg-warning">Carregando...</span>' : '<span class="badge text-bg-dark">Online</span>'}
        </header>
        ${state.error ? `<div class="alert alert-danger mb-4">${escapeHtml(state.error)}</div>` : ""}
        ${resolveView()}
      </section>
    </main>
  `;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      const view = button.getAttribute("data-view");
      if (!view || view === state.currentView) {
        return;
      }
      state.currentView = view;
      setHash(view);
      await loadViewData(view);
    });
  });

  document.querySelector("#logout-button")?.addEventListener("click", () => {
    clearAdminSession();
    state.session = null;
    state.currentUser = null;
    state.error = "";
    render();
  });

  attachViewHandlers();
}

function toNullableNumber(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? Number(normalized) : null;
}

function toNullableString(value) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function toNullableDateTime(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? new Date(normalized).toISOString() : null;
}

function omitNullishEntries(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== null && value !== undefined)
  );
}

function attachViewHandlers() {
  const productMainImageInput = document.querySelector('#product-form input[name="mainImage"]');
  const productMainImagePreview = document.querySelector("#product-main-image-preview");

  productMainImageInput?.addEventListener("change", () => {
    const [file] = productMainImageInput.files ?? [];

    if (!productMainImagePreview) {
      return;
    }

    if (!file) {
      productMainImagePreview.innerHTML = "Nenhuma imagem selecionada.";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    productMainImagePreview.innerHTML = `<img src="${previewUrl}" alt="Preview da imagem principal" class="img-fluid rounded" style="max-height:180px;object-fit:contain;">`;
  });

  document.querySelector("#category-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      await adminApi.createCategory(
        omitNullishEntries({
          name: String(form.get("name") ?? "").trim(),
          slug: toNullableString(form.get("slug")),
          description: toNullableString(form.get("description")),
          imageUrl: toNullableString(form.get("imageUrl")),
          bannerUrl: toNullableString(form.get("bannerUrl")),
          displayOrder: toNullableNumber(form.get("displayOrder")),
          parentCategoryId: toNullableNumber(form.get("parentCategoryId")),
          status: String(form.get("status") ?? "ativo")
        }),
        requireSession()
      );
      formElement.reset();
      await loadViewData("categories", { silent: true });
    });
  });

  document.querySelector("#brand-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      await adminApi.createBrand(
        omitNullishEntries({
          name: String(form.get("name") ?? "").trim(),
          slug: toNullableString(form.get("slug")),
          logoUrl: toNullableString(form.get("logoUrl")),
          status: String(form.get("status") ?? "ativo")
        }),
        requireSession()
      );
      formElement.reset();
      await loadViewData("brands", { silent: true });
    });
  });

  document.querySelector("#product-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      const payload = new FormData();
      payload.set("name", String(form.get("name") ?? "").trim());
      payload.set("categoryId", String(Number(form.get("categoryId"))));
      payload.set("brandId", String(Number(form.get("brandId"))));
      payload.set("sku", String(form.get("sku") ?? "").trim());
      payload.set("price", String(Number(form.get("price"))));
      payload.set("stockInitial", String(Number(form.get("stockInitial"))));
      payload.set("status", String(form.get("status") ?? "ativo"));

      const promotionalPrice = toNullableNumber(form.get("promotionalPrice"));
      if (promotionalPrice !== null) {
        payload.set("promotionalPrice", String(promotionalPrice));
      }

      const shortDescription = toNullableString(form.get("shortDescription"));
      if (shortDescription) {
        payload.set("shortDescription", shortDescription);
      }

      const description = toNullableString(form.get("description"));
      if (description) {
        payload.set("description", description);
      }

      const mainImageUrl = toNullableString(form.get("mainImageUrl"));
      if (mainImageUrl) {
        payload.set("mainImageUrl", mainImageUrl);
      }

      const stockMinimum = toNullableNumber(form.get("stockMinimum"));
      if (stockMinimum !== null) {
        payload.set("stockMinimum", String(stockMinimum));
      }

      const mainImage = formElement.querySelector('input[name="mainImage"]')?.files?.[0];
      if (mainImage) {
        payload.append("mainImage", mainImage);
      }

      for (const image of formElement.querySelector('input[name="galleryImages"]')?.files ?? []) {
        payload.append("galleryImages", image);
      }

      for (const video of formElement.querySelector('input[name="videoFiles"]')?.files ?? []) {
        payload.append("videoFiles", video);
      }

      await adminApi.createProduct(payload, requireSession());
      formElement.reset();
      if (productMainImagePreview) {
        productMainImagePreview.innerHTML = "Nenhuma imagem selecionada.";
      }
      await loadViewData("products", { silent: true });
    });
  });

  document.querySelector("#product-media-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      const productId = Number(form.get("productId"));
      const payload = new FormData();
      const mainImage = formElement.querySelector('input[name="mainImage"]')?.files?.[0];

      if (mainImage) {
        payload.append("mainImage", mainImage);
      }

      for (const image of formElement.querySelector('input[name="galleryImages"]')?.files ?? []) {
        payload.append("galleryImages", image);
      }

      for (const video of formElement.querySelector('input[name="videoFiles"]')?.files ?? []) {
        payload.append("videoFiles", video);
      }

      await adminApi.addProductMedia(productId, payload, requireSession());
      formElement.reset();
      await loadViewData("products", { silent: true });
    });
  });

  document.querySelectorAll('[data-action="set-main-image"]').forEach((button) => {
    button.addEventListener("click", async () => {
      await executeAction(async () => {
        await adminApi.setMainProductImage(
          Number(button.dataset.productId),
          Number(button.dataset.imageId),
          requireSession()
        );
        await loadViewData("products", { silent: true });
      });
    });
  });

  document.querySelectorAll('[data-action="delete-product-image"]').forEach((button) => {
    button.addEventListener("click", async () => {
      await executeAction(async () => {
        await adminApi.deleteProductImage(
          Number(button.dataset.productId),
          Number(button.dataset.imageId),
          requireSession()
        );
        await loadViewData("products", { silent: true });
      });
    });
  });

  document.querySelectorAll('[data-action="delete-product-video"]').forEach((button) => {
    button.addEventListener("click", async () => {
      await executeAction(async () => {
        await adminApi.deleteProductVideo(
          Number(button.dataset.productId),
          Number(button.dataset.videoId),
          requireSession()
        );
        await loadViewData("products", { silent: true });
      });
    });
  });

  document.querySelector("#stock-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await executeAction(async () => {
      await adminApi.adjustStock(
        Number(form.get("stockId")),
        {
          quantityDelta: Number(form.get("quantityDelta")),
          stockMinimum: toNullableNumber(form.get("stockMinimum")),
          reason: String(form.get("reason") ?? "").trim()
        },
        requireSession()
      );
      event.currentTarget.reset();
      await loadViewData("stock", { silent: true });
    });
  });

  document.querySelector("#order-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await executeAction(async () => {
      await adminApi.updateOrderStatus(
        Number(form.get("orderId")),
        {
          status: String(form.get("status") ?? ""),
          trackingCode: toNullableString(form.get("trackingCode"))
        },
        requireSession()
      );
      await loadViewData("orders", { silent: true });
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelectorAll('[data-action="sync-tracking"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = Number(button.dataset.orderId);
      await executeAction(async () => {
        state.orderTrackingSyncResult = await adminApi.syncOrderTracking(orderId, requireSession());
        await loadViewData("orders", { silent: true });
        await loadViewData("audit-logs", { silent: true });
      });
    });
  });

  document.querySelector("#sync-pending-tracking-button")?.addEventListener("click", async () => {
    await executeAction(async () => {
      state.trackingBatchResult = await adminApi.syncPendingTracking({ limit: 20 }, requireSession());
      await loadViewData("orders", { silent: true });
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#test-email-integration-button")?.addEventListener("click", async () => {
    await executeAction(async () => {
      const result = await adminApi.testEmailIntegration(
        {
          recipientEmail: state.currentUser?.email ?? "admin@shopmax.local"
        },
        requireSession()
      );
      state.integrationProbeResult = {
        kind: "email",
        provider: result.provider ?? "simulated",
        status: result.status ?? "unknown"
      };
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#test-tracking-integration-button")?.addEventListener("click", async () => {
    await executeAction(async () => {
      const result = await adminApi.testTrackingIntegration(
        {
          trackingCode: "BRHOMOLOG123",
          orderCode: "TESTE-SHOPMAX"
        },
        requireSession()
      );
      state.integrationProbeResult = {
        kind: "tracking",
        provider: result.provider ?? "mock",
        status: result.normalizedStatus ?? "unknown"
      };
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#validate-live-integrations-button")?.addEventListener("click", async () => {
    await executeAction(async () => {
      state.integrationLiveValidationResult = await adminApi.validateLiveIntegrations(
        {
          recipientEmail: state.currentUser?.email ?? "admin@shopmax.local",
          trackingCode: "BRLIVE123456",
          orderCode: "TESTE-LIVE-SHOPMAX"
        },
        requireSession()
      );
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#coupon-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      await adminApi.createCoupon(
        {
          code: String(form.get("code") ?? "").trim(),
          type: String(form.get("type") ?? "valor_fixo"),
          fixedValue: toNullableNumber(form.get("fixedValue")),
          percentage: toNullableNumber(form.get("percentage")),
          validFrom: toNullableDateTime(form.get("validFrom")),
          validUntil: toNullableDateTime(form.get("validUntil")),
          minimumValue: toNullableNumber(form.get("minimumValue")) ?? 0,
          totalUsageLimit: toNullableNumber(form.get("totalUsageLimit")),
          customerUsageLimit: toNullableNumber(form.get("customerUsageLimit")),
          categoryId: toNullableNumber(form.get("categoryId")),
          active: String(form.get("active")) === "true"
        },
        requireSession()
      );
      formElement.reset();
      await loadViewData("coupons", { silent: true });
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#promotion-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await executeAction(async () => {
      await adminApi.createPromotion(
        {
          name: String(form.get("name") ?? "").trim(),
          type: String(form.get("type") ?? "produto"),
          percentage: toNullableNumber(form.get("percentage")),
          value: toNullableNumber(form.get("value")),
          productId: toNullableNumber(form.get("productId")),
          categoryId: toNullableNumber(form.get("categoryId")),
          status: String(form.get("status") ?? "ativa")
        },
        requireSession()
      );
      formElement.reset();
      await loadViewData("promotions", { silent: true });
      await loadViewData("audit-logs", { silent: true });
    });
  });

  document.querySelector("#process-abandoned-carts-button")?.addEventListener("click", async () => {
    await executeAction(async () => {
      state.recoveryResult = await adminApi.processAbandonedCarts(
        {
          thresholdHours: 24,
          limit: 20,
          dryRun: false
        },
        requireSession()
      );
      await loadViewData("reports", { silent: true });
      await loadViewData("audit-logs", { silent: true });
    });
  });
}

async function executeAction(action) {
  clearError();
  setLoading(true);
  try {
    await action();
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  if (!state.session?.token) {
    renderLogin();
    return;
  }

  renderShell();
}

window.addEventListener("hashchange", async () => {
  const nextView = window.location.hash.replace("#/", "") || "dashboard";
  if (nextView === state.currentView) {
    return;
  }

  state.currentView = nextView;
  await loadViewData(nextView);
});

render();
await bootstrapSession();
