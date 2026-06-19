import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./src/styles.css";
import { api, resolveShopAssetUrl } from "./src/services/api.js";
import {
  ensureCartSession,
  getCartSessionToken,
  clearCartSessionToken
} from "./src/store/cart-session.js";
import { clearAuthSession, getAuthSession, setAuthSession } from "./src/store/auth-session.js";

const app = document.querySelector("#app");

const state = {
  categories: [],
  brands: [],
  banners: [],
  promotions: [],
  products: [],
  cart: null,
  auth: getAuthSession(),
  profile: null,
  orders: [],
  favorites: []
};

function routeHash() {
  const hash = window.location.hash.slice(1) || "/";
  const [path, queryString = ""] = hash.split("?");
  return {
    path,
    searchParams: new URLSearchParams(queryString)
  };
}

function navigate(path) {
  window.location.hash = path;
}

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value));
}

async function loadCategories() {
  state.categories = await api.listCategories();
}

async function loadBrands() {
  state.brands = await api.listBrands();
}

async function loadBanners() {
  state.banners = await api.listBanners();
}

async function loadPromotions() {
  state.promotions = await api.listPromotions();
}

async function loadProducts(filters = {}) {
  state.products = await api.listProducts(filters);
}

async function loadCart() {
  const sessionToken = await ensureCartSession(api);
  state.cart = await api.getCart(sessionToken);
}

async function loadProfile() {
  if (!state.auth?.token) {
    state.profile = null;
    return;
  }

  state.profile = await api.getCustomerProfile(state.auth.token);
}

async function loadOrders() {
  if (!state.auth?.token) {
    state.orders = [];
    return;
  }

  state.orders = await api.listOrders(state.auth.token);
}

async function loadFavorites() {
  if (!state.auth?.token) {
    state.favorites = [];
    return;
  }

  state.favorites = await api.listFavorites(state.auth.token);
}

function categoryMenu() {
  return state.categories
    .map(
      (category) =>
        `<a class="nav-link px-0" href="#/categoria/${category.slug}">${category.name}</a>`
    )
    .join("");
}

function fallbackProductImage(label = "ShopMax") {
  return `https://placehold.co/900x700?text=${encodeURIComponent(label)}`;
}

function productMainImage(product) {
  return resolveShopAssetUrl(product.mainImageUrl) || fallbackProductImage("Sem imagem");
}

function productCard(product) {
  return `
    <article class="product-card card border-0 shadow-sm h-100">
      <img class="card-img-top product-card__image" src="${productMainImage(product)}" alt="${product.name}">
      <div class="card-body d-flex flex-column">
        <span class="badge text-bg-light border align-self-start mb-2">${product.sku}</span>
        <h3 class="h5">${product.name}</h3>
        <p class="text-secondary small flex-grow-1">${product.shortDescription ?? "Produto pronto para detalhe completo na pagina individual."}</p>
        <div class="d-flex justify-content-between align-items-center">
          <strong>${formatPrice(product.promotionalPrice ?? product.price)}</strong>
          <a class="btn btn-sm btn-outline-primary" href="#/produto/${product.slug}">Ver produto</a>
        </div>
      </div>
    </article>
  `;
}

function authNav() {
  if (state.auth?.user) {
    return `
      <a class="btn btn-outline-dark" href="#/favorites">Favoritos</a>
      <a class="btn btn-outline-dark" href="#/profile">Perfil</a>
      <button class="btn btn-dark" id="logout-button" type="button">Sair</button>
    `;
  }

  return `
    <a class="btn btn-outline-dark" href="#/login">Login</a>
    <a class="btn btn-dark" href="#/register">Criar conta</a>
  `;
}

function shell(content, pageTitle = "ShopMax") {
  const cartCount = state.cart?.itemsCount ?? 0;

  app.innerHTML = `
    <div class="shop-layout">
      <header class="topbar shadow-sm">
        <div class="container py-3">
          <div class="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between">
            <a class="brand text-decoration-none" href="#/">
              <span class="brand__mark">S</span>
              <span class="brand__text">ShopMax</span>
            </a>
            <form id="search-form" class="searchbar d-flex gap-2" role="search">
              <input id="search-input" class="form-control form-control-lg" type="search" placeholder="Busque por nome ou SKU" aria-label="Buscar">
              <button class="btn btn-primary btn-lg" type="submit">Buscar</button>
            </form>
            <nav class="d-flex gap-2 flex-wrap">
              <a class="btn btn-outline-dark" href="#/busca">Busca</a>
              <a class="btn btn-outline-dark" href="#/cart">Carrinho <span class="badge text-bg-dark ms-1">${cartCount}</span></a>
              ${authNav()}
            </nav>
          </div>
          <div class="category-strip mt-3">${categoryMenu()}</div>
        </div>
      </header>
      <main class="container py-4">
        ${content}
      </main>
    </div>
  `;

  document.title = pageTitle;

  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");
  searchInput.value = routeHash().searchParams.get("q") ?? "";

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    navigate(`/busca?q=${encodeURIComponent(query)}`);
  });

  const logoutButton = document.querySelector("#logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearAuthSession();
      state.auth = null;
      state.profile = null;
      navigate("/");
      render();
    });
  }
}

async function requireAuthRedirect() {
  if (!state.auth?.token) {
    navigate("/login");
    await render();
    return false;
  }

  return true;
}

async function renderHome() {
  await Promise.all([loadCategories(), loadBanners(), loadPromotions(), loadProducts(), loadCart()]);

  const heroBanner = state.banners[0];

  shell(
    `
      <section class="hero-banner mb-5">
        <div class="hero-banner__copy">
          <span class="badge text-bg-warning mb-3">Sprint 6</span>
          <h1>${heroBanner?.title ?? "Catalogo, promocoes e experiencia comercial em evolucao."}</h1>
          <p>${heroBanner?.linkUrl ? `Banner ativo apontando para ${heroBanner.linkUrl}.` : "Agora a home tambem exibe banners e campanhas comerciais ativas."}</p>
          <div class="d-flex gap-3 flex-wrap">
            <a class="btn btn-primary btn-lg" href="#/busca">Explorar produtos</a>
            <a class="btn btn-outline-light btn-lg" href="#/checkout">Ir para checkout</a>
          </div>
        </div>
      </section>
      ${
        state.promotions.length
          ? `<section class="section-block mb-5">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h3 mb-0">Promocoes ativas</h2>
                <span class="text-secondary">${state.promotions.length} campanha(s)</span>
              </div>
              <div class="row g-3">
                ${state.promotions
                  .slice(0, 3)
                  .map(
                    (promotion) => `
                      <div class="col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                          <div class="card-body">
                            <span class="badge text-bg-danger mb-2">${promotion.type}</span>
                            <h3 class="h5">${promotion.name}</h3>
                            <p class="mb-0 text-secondary">${
                              promotion.percentage ? `${promotion.percentage}% OFF` : `${formatPrice(promotion.value)} OFF`
                            }</p>
                          </div>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h3 mb-0">Produtos em destaque</h2>
          <a href="#/busca" class="link-primary text-decoration-none">Ver todos</a>
        </div>
        <div class="row g-4">
          ${state.products.slice(0, 6).map((product) => `<div class="col-md-6 col-xl-4">${productCard(product)}</div>`).join("")}
        </div>
      </section>
    `,
    "ShopMax | Home"
  );
}

async function renderSearch() {
  await Promise.all([loadCategories(), loadBrands(), loadCart()]);
  const { searchParams } = routeHash();
  const query = searchParams.get("q") ?? "";
  const filters = {
    q: query,
    brand: searchParams.get("brand") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    inStock: searchParams.get("inStock") === "true",
    sort: searchParams.get("sort") ?? "newest"
  };
  await loadProducts(filters);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Busca de produtos</h1>
          <span class="text-secondary">${state.products.length} resultado(s)</span>
        </div>
        <p class="text-secondary">Termo pesquisado: <strong>${query || "todos os produtos"}</strong></p>
        <form id="advanced-filter-form" class="row g-3 mb-4">
          <div class="col-md-3">
            <select class="form-select" name="brand">
              <option value="">Todas as marcas</option>
              ${state.brands
                .map(
                  (brand) =>
                    `<option value="${brand.slug}" ${filters.brand === brand.slug ? "selected" : ""}>${brand.name}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="col-md-2"><input class="form-control" name="minPrice" type="number" step="0.01" placeholder="Preco min" value="${filters.minPrice}"></div>
          <div class="col-md-2"><input class="form-control" name="maxPrice" type="number" step="0.01" placeholder="Preco max" value="${filters.maxPrice}"></div>
          <div class="col-md-2">
            <select class="form-select" name="sort">
              <option value="newest" ${filters.sort === "newest" ? "selected" : ""}>Mais recentes</option>
              <option value="price_asc" ${filters.sort === "price_asc" ? "selected" : ""}>Menor preco</option>
              <option value="price_desc" ${filters.sort === "price_desc" ? "selected" : ""}>Maior preco</option>
              <option value="name_asc" ${filters.sort === "name_asc" ? "selected" : ""}>Nome A-Z</option>
            </select>
          </div>
          <div class="col-md-2 form-check d-flex align-items-center gap-2">
            <input class="form-check-input ms-0" id="in-stock-filter" name="inStock" type="checkbox" ${filters.inStock ? "checked" : ""}>
            <label class="form-check-label" for="in-stock-filter">Em estoque</label>
          </div>
          <div class="col-md-1">
            <button class="btn btn-outline-primary w-100" type="submit">Filtrar</button>
          </div>
        </form>
        <div class="row g-4">
          ${state.products.map((product) => `<div class="col-md-6 col-xl-4">${productCard(product)}</div>`).join("") || `<p>Nenhum produto encontrado.</p>`}
        </div>
      </section>
    `,
    "ShopMax | Busca"
  );

  document.querySelector("#advanced-filter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    if (formData.get("brand")) params.set("brand", formData.get("brand"));
    if (formData.get("minPrice")) params.set("minPrice", formData.get("minPrice"));
    if (formData.get("maxPrice")) params.set("maxPrice", formData.get("maxPrice"));
    if (formData.get("sort")) params.set("sort", formData.get("sort"));
    if (formData.get("inStock")) params.set("inStock", "true");

    navigate(`/busca?${params.toString()}`);
  });
}

async function renderCategory(slug) {
  await Promise.all([loadCategories(), loadCart(), loadProducts({ category: slug })]);
  const currentCategory = state.categories.find((category) => category.slug === slug);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">${currentCategory?.name ?? "Categoria"}</h1>
          <span class="text-secondary">${state.products.length} produto(s)</span>
        </div>
        <p class="text-secondary">${currentCategory?.description ?? "Catalogo filtrado por categoria."}</p>
        <div class="row g-4">
          ${state.products.map((product) => `<div class="col-md-6 col-xl-4">${productCard(product)}</div>`).join("") || `<p>Nenhum produto disponivel nesta categoria.</p>`}
        </div>
      </section>
    `,
    `ShopMax | ${currentCategory?.name ?? "Categoria"}`
  );
}

async function renderProduct(slug) {
  await Promise.all([loadCategories(), loadCart(), loadFavorites()]);
  const [product, reviews] = await Promise.all([api.getProduct(slug), api.listReviews(slug)]);
  const isFavorite = state.favorites.some((favorite) => favorite.productId === product.id);

  shell(
    `
      <section class="product-page card border-0 shadow-sm">
        <div class="row g-0">
          <div class="col-lg-6">
            <img class="product-page__image" src="${productMainImage(product)}" alt="${product.name}">
            <div class="row g-2 p-3 pt-0">
              ${
                product.images?.length
                  ? product.images
                      .map(
                        (image) => `
                          <div class="col-4 col-md-3">
                            <img class="img-fluid rounded border h-100 w-100" style="object-fit:cover;min-height:90px;" src="${resolveShopAssetUrl(image.url)}" alt="${image.altText ?? product.name}">
                          </div>
                        `
                      )
                      .join("")
                  : `<div class="col-12"><div class="border rounded p-3 text-center text-secondary">Produto sem galeria. Exibindo imagem padrao.</div></div>`
              }
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card-body p-4 p-xl-5">
              <span class="badge text-bg-light border mb-3">${product.sku}</span>
              <h1 class="display-6 fw-bold">${product.name}</h1>
              <p class="lead text-secondary">${product.shortDescription ?? "Detalhes completos do produto."}</p>
              <div class="price-stack mb-4">
                <strong class="display-6">${formatPrice(product.promotionalPrice ?? product.price)}</strong>
                ${product.promotionalPrice ? `<span class="text-decoration-line-through text-secondary">${formatPrice(product.price)}</span>` : ""}
              </div>
              <p class="mb-4">${product.description ?? ""}</p>
              <div class="d-flex gap-3 flex-wrap">
                <button class="btn btn-primary btn-lg" id="add-to-cart-button">Adicionar ao carrinho</button>
                ${
                  state.auth?.token
                    ? `<button class="btn btn-outline-danger btn-lg" id="favorite-button" type="button">${
                        isFavorite ? "Remover favorito" : "Salvar favorito"
                      }</button>`
                    : ""
                }
                <a class="btn btn-outline-dark btn-lg" href="#/categoria/${product.categorySlug ?? ""}">Ver categoria</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${
        product.videos?.length
          ? `
            <section class="section-block mt-4">
              <h2 class="h4 mb-3">Videos do produto</h2>
              <div class="row g-3">
                ${product.videos
                  .map(
                    (video) => `
                      <div class="col-lg-6">
                        <video class="w-100 rounded border" controls preload="metadata">
                          <source src="${resolveShopAssetUrl(video.url)}">
                          Seu navegador nao suporta reproducao de video.
                        </video>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </section>
          `
          : ""
      }
      <section class="section-block mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4 mb-0">Avaliacoes</h2>
          <span class="text-secondary">${reviews.length} publicada(s)</span>
        </div>
        <div class="d-grid gap-3 mb-4">
          ${
            reviews.length
              ? reviews
                  .map(
                    (review) => `
                      <article class="card border-0 shadow-sm">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong>${review.title ?? "Avaliacao do cliente"}</strong>
                            <span class="badge text-bg-warning">${review.rating}/5</span>
                          </div>
                          <p class="mb-1">${review.comment ?? ""}</p>
                          <small class="text-secondary">${review.customerName ?? "Cliente"} - ${new Date(review.createdAt).toLocaleDateString("pt-BR")}</small>
                        </div>
                      </article>
                    `
                  )
                  .join("")
              : `<div class="card border-0 shadow-sm"><div class="card-body">Ainda nao ha avaliacoes publicadas para este produto.</div></div>`
          }
        </div>
        ${
          state.auth?.token
            ? `<form id="review-form" class="card border-0 shadow-sm">
                <div class="card-body">
                  <h3 class="h5 mb-3">Escrever avaliacao</h3>
                  <div class="row g-3">
                    <div class="col-md-2">
                      <input class="form-control" name="rating" type="number" min="1" max="5" placeholder="Nota" required>
                    </div>
                    <div class="col-md-10">
                      <input class="form-control" name="title" placeholder="Titulo da avaliacao">
                    </div>
                    <div class="col-12">
                      <textarea class="form-control" name="comment" rows="3" placeholder="Conte como foi sua experiencia"></textarea>
                    </div>
                  </div>
                  <button class="btn btn-outline-primary mt-3" type="submit">Publicar avaliacao</button>
                </div>
              </form>`
            : ""
        }
      </section>
    `,
    `ShopMax | ${product.name}`
  );

  document.querySelector("#add-to-cart-button").addEventListener("click", async () => {
    const sessionToken = await ensureCartSession(api);
    await api.addCartItem({
      sessionToken,
      productId: product.id,
      quantity: 1
    });
    navigate("/cart");
  });

  document.querySelector("#favorite-button")?.addEventListener("click", async () => {
    if (isFavorite) {
      await api.removeFavorite(product.id, state.auth.token);
    } else {
      await api.addFavorite(product.id, state.auth.token);
    }

    await renderProduct(slug);
  });

  document.querySelector("#review-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await api.createReview(
      {
        productId: product.id,
        rating: Number(formData.get("rating")),
        title: formData.get("title"),
        comment: formData.get("comment")
      },
      state.auth.token
    );
    await renderProduct(slug);
  });
}

async function renderCart() {
  await Promise.all([loadCategories(), loadCart()]);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Carrinho</h1>
          <span class="text-secondary">${state.cart.itemsCount} item(ns)</span>
        </div>
        <div class="cart-grid">
          <div class="cart-items">
            ${state.cart.items
              .map(
                (item) => `
                  <article class="cart-row card border-0 shadow-sm">
                    <div class="card-body d-flex flex-column flex-lg-row gap-3 align-items-lg-center">
                      <img class="cart-row__image" src="${resolveShopAssetUrl(item.product.imageUrl) || fallbackProductImage("Carrinho")}" alt="${item.product.name}">
                      <div class="flex-grow-1">
                        <h2 class="h5 mb-1">${item.product.name}</h2>
                        <p class="mb-1 text-secondary">${item.product.sku}</p>
                        <strong>${formatPrice(item.unitPrice)}</strong>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-outline-secondary" data-action="decrease" data-item-id="${item.id}">-</button>
                        <span class="cart-row__qty">${item.quantity}</span>
                        <button class="btn btn-outline-secondary" data-action="increase" data-item-id="${item.id}">+</button>
                      </div>
                      <div class="text-lg-end">
                        <strong class="d-block mb-2">${formatPrice(item.subtotal)}</strong>
                        <button class="btn btn-sm btn-outline-danger" data-action="remove" data-item-id="${item.id}">Remover</button>
                      </div>
                    </div>
                  </article>
                `
              )
              .join("") || `<div class="card border-0 shadow-sm"><div class="card-body p-4"><p class="mb-0">Seu carrinho esta vazio.</p></div></div>`}
          </div>
          <aside class="cart-summary card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Resumo</h2>
              <div class="d-flex justify-content-between mb-2"><span>Itens</span><strong>${state.cart.itemsCount}</strong></div>
              <div class="d-flex justify-content-between mb-3"><span>Subtotal</span><strong>${formatPrice(state.cart.subtotal)}</strong></div>
              <a class="btn btn-primary w-100 btn-lg" href="#/checkout">Ir para checkout</a>
            </div>
          </aside>
        </div>
      </section>
    `,
    "ShopMax | Carrinho"
  );

  const sessionToken = getCartSessionToken();

  for (const button of document.querySelectorAll("[data-action]")) {
    button.addEventListener("click", async () => {
      const itemId = Number(button.dataset.itemId);
      const action = button.dataset.action;
      const currentItem = state.cart.items.find((item) => item.id === itemId);

      if (!currentItem) {
        return;
      }

      if (action === "remove") {
        await api.removeCartItem(itemId, sessionToken);
      } else {
        const nextQuantity = action === "increase" ? currentItem.quantity + 1 : currentItem.quantity - 1;
        await api.updateCartItem(itemId, {
          sessionToken,
          quantity: nextQuantity
        });
      }

      await renderCart();
    });
  }
}

async function renderLogin() {
  await Promise.all([loadCategories(), loadCart()]);

  shell(
    `
      <section class="auth-grid">
        <div class="card border-0 shadow-sm auth-card">
          <div class="card-body p-4 p-xl-5">
            <h1 class="h3 mb-3">Entrar na conta</h1>
            <form id="login-form" class="d-grid gap-3">
              <input class="form-control form-control-lg" name="email" type="email" placeholder="E-mail" required>
              <input class="form-control form-control-lg" name="password" type="password" placeholder="Senha" required>
              <button class="btn btn-primary btn-lg" type="submit">Entrar</button>
            </form>
            <p class="mt-3 mb-0">Nao tem conta? <a href="#/register">Criar conta</a></p>
          </div>
        </div>
      </section>
    `,
    "ShopMax | Login"
  );

  document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const session = await api.login({
      email: formData.get("email"),
      password: formData.get("password")
    });

    state.auth = session;
    setAuthSession(session);
    navigate("/profile");
  });
}

async function renderRegister() {
  await Promise.all([loadCategories(), loadCart()]);

  shell(
    `
      <section class="auth-grid">
        <div class="card border-0 shadow-sm auth-card">
          <div class="card-body p-4 p-xl-5">
            <h1 class="h3 mb-3">Criar conta</h1>
            <form id="register-form" class="d-grid gap-3">
              <input class="form-control form-control-lg" name="name" type="text" placeholder="Nome completo" required>
              <input class="form-control form-control-lg" name="email" type="email" placeholder="E-mail" required>
              <input class="form-control form-control-lg" name="cpf" type="text" placeholder="CPF" required>
              <input class="form-control form-control-lg" name="phone" type="text" placeholder="Telefone" required>
              <input class="form-control form-control-lg" name="password" type="password" placeholder="Senha" required>
              <input class="form-control form-control-lg" name="confirmPassword" type="password" placeholder="Confirmar senha" required>
              <button class="btn btn-primary btn-lg" type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
      </section>
    `,
    "ShopMax | Cadastro"
  );

  document.querySelector("#register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await api.registerCustomer({
      name: formData.get("name"),
      email: formData.get("email"),
      cpf: formData.get("cpf"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword")
    });

    const session = await api.login({
      email: formData.get("email"),
      password: formData.get("password")
    });

    state.auth = session;
    setAuthSession(session);
    navigate("/profile");
  });
}

async function renderCheckout() {
  if (!(await requireAuthRedirect())) {
    return;
  }

  await Promise.all([loadCategories(), loadCart(), loadProfile()]);
  const couponCode = routeHash().searchParams.get("coupon") ?? "";
  const preview = await api.getCheckoutPreview(getCartSessionToken(), state.auth.token, couponCode);
  const defaultAddress = state.profile.addresses[0] ?? null;

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Checkout</h1>
          <span class="text-secondary">${preview.cart.itemsCount} item(ns)</span>
        </div>
        <div class="checkout-grid">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <form id="checkout-form" class="d-grid gap-4">
                <div>
                  <h2 class="h5 mb-3">Endereco</h2>
                  ${defaultAddress
                    ? `<div class="alert alert-light border">
                        <strong>${defaultAddress.recipient}</strong><br>
                        ${defaultAddress.street}, ${defaultAddress.number} - ${defaultAddress.city}/${defaultAddress.state}
                      </div>`
                    : `<div class="row g-3">
                        <div class="col-md-6"><input class="form-control" name="recipient" placeholder="Destinatario" required></div>
                        <div class="col-md-6"><input class="form-control" name="zipCode" placeholder="CEP" required></div>
                        <div class="col-md-8"><input class="form-control" name="street" placeholder="Logradouro" required></div>
                        <div class="col-md-4"><input class="form-control" name="number" placeholder="Numero" required></div>
                        <div class="col-md-6"><input class="form-control" name="district" placeholder="Bairro" required></div>
                        <div class="col-md-4"><input class="form-control" name="city" placeholder="Cidade" required></div>
                        <div class="col-md-2"><input class="form-control" name="state" placeholder="UF" required></div>
                      </div>`}
                </div>
                <div>
                  <h2 class="h5 mb-3">Entrega</h2>
                  ${preview.shippingOptions
                    .map(
                      (option, index) => `
                        <label class="checkout-option">
                          <input type="radio" name="shippingMethod" value="${option.method}" data-price="${option.price}" data-days="${option.etaDays}" ${index === 0 ? "checked" : ""}>
                          <span>${option.label} - ${formatPrice(option.price)} (${option.etaDays} dias)</span>
                        </label>
                      `
                    )
                    .join("")}
                </div>
                <div>
                  <h2 class="h5 mb-3">Pagamento</h2>
                  <label class="checkout-option">
                    <input type="radio" name="paymentMethod" value="pix" checked>
                    <span>PIX com 5% de desconto</span>
                  </label>
                  <label class="checkout-option">
                    <input type="radio" name="paymentMethod" value="cartao">
                    <span>Cartao de credito</span>
                  </label>
                  <select class="form-select mt-2" name="installments">
                    <option value="1">1x sem juros</option>
                    <option value="2">2x sem juros</option>
                    <option value="3">3x sem juros</option>
                  </select>
                </div>
                <div>
                  <h2 class="h5 mb-3">Cupom</h2>
                  <div class="row g-2 align-items-center">
                    <div class="col-md-8">
                      <input class="form-control" name="couponCode" placeholder="Digite seu cupom" value="${couponCode}">
                    </div>
                    <div class="col-md-4">
                      <button class="btn btn-outline-primary w-100" type="button" id="apply-coupon-button">Aplicar cupom</button>
                    </div>
                  </div>
                  ${
                    preview.appliedCoupon
                      ? `<div class="alert alert-success mt-3 mb-0">Cupom <strong>${preview.appliedCoupon.code}</strong> aplicado com sucesso.</div>`
                      : `<p class="text-secondary small mt-2 mb-0">O cupom e validado em tempo real no resumo do checkout.</p>`
                  }
                </div>
                <button class="btn btn-primary btn-lg" type="submit">Finalizar compra</button>
              </form>
            </div>
          </div>
          <aside class="cart-summary card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Resumo</h2>
              <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><strong>${formatPrice(preview.cart.subtotal)}</strong></div>
              <div class="d-flex justify-content-between mb-2"><span>Desconto cupom</span><strong>-${formatPrice(preview.totals?.couponDiscount ?? 0)}</strong></div>
              <div class="d-flex justify-content-between mb-2"><span>Frete padrao</span><strong>${formatPrice(preview.shippingOptions[0].price)}</strong></div>
              <div class="d-flex justify-content-between mb-3"><span>PIX</span><strong>-${formatPrice(preview.paymentOptions[0].discount)}</strong></div>
              <div class="d-flex justify-content-between"><span>Total estimado</span><strong>${formatPrice(preview.totals?.totalWithPix ?? preview.cart.subtotal + preview.shippingOptions[0].price - preview.paymentOptions[0].discount)}</strong></div>
            </div>
          </aside>
        </div>
      </section>
    `,
    "ShopMax | Checkout"
  );

  document.querySelector("#checkout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const shippingInput = [...document.querySelectorAll("input[name='shippingMethod']")].find(
      (input) => input.checked
    );

    const payload = {
      sessionToken: getCartSessionToken(),
      couponCode: formData.get("couponCode")?.toString().trim() || null,
      shippingMethod: formData.get("shippingMethod"),
      shippingPrice: Number(shippingInput.dataset.price),
      shippingEtaDays: Number(shippingInput.dataset.days),
      paymentMethod: formData.get("paymentMethod"),
      installments: formData.get("paymentMethod") === "cartao" ? Number(formData.get("installments")) : null
    };

    if (defaultAddress) {
      payload.addressId = defaultAddress.id;
    } else {
      payload.address = {
        recipient: formData.get("recipient"),
        zipCode: formData.get("zipCode"),
        street: formData.get("street"),
        number: formData.get("number"),
        district: formData.get("district"),
        city: formData.get("city"),
        state: formData.get("state")
      };
    }

    const order = await api.finalizeCheckout(payload, state.auth.token);
    clearCartSessionToken();
    navigate(`/orders/${order.id}`);
  });

  document.querySelector("#apply-coupon-button").addEventListener("click", () => {
    const couponInput = document.querySelector("input[name='couponCode']");
    const nextCoupon = couponInput.value.trim();
    navigate(nextCoupon ? `/checkout?coupon=${encodeURIComponent(nextCoupon)}` : "/checkout");
  });
}

async function renderProfile() {
  if (!(await requireAuthRedirect())) {
    return;
  }

  await Promise.all([loadCategories(), loadCart(), loadProfile(), loadOrders(), loadFavorites()]);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Minha conta</h1>
          <a class="btn btn-outline-primary" href="#/orders">Meus pedidos</a>
        </div>
        <div class="profile-grid">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h5">Dados do cliente</h2>
              <p class="mb-1"><strong>${state.profile.customer.name}</strong></p>
              <p class="mb-1">${state.auth.user.email}</p>
              <p class="mb-0">${state.profile.customer.phone}</p>
              <p class="mt-3 mb-0 text-secondary">Favoritos salvos: ${state.favorites.length}</p>
            </div>
          </div>
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h5">Enderecos</h2>
              ${state.profile.addresses
                .map(
                  (address) => `
                    <div class="address-card">
                      <strong>${address.recipient}</strong>
                      <div>${address.street}, ${address.number}</div>
                      <div>${address.city}/${address.state}</div>
                    </div>
                  `
                )
                .join("") || `<p class="mb-3">Nenhum endereco cadastrado.</p>`}
              <form id="address-form" class="d-grid gap-2 mt-3">
                <input class="form-control" name="recipient" placeholder="Destinatario" required>
                <input class="form-control" name="zipCode" placeholder="CEP" required>
                <input class="form-control" name="street" placeholder="Logradouro" required>
                <input class="form-control" name="number" placeholder="Numero" required>
                <input class="form-control" name="district" placeholder="Bairro" required>
                <input class="form-control" name="city" placeholder="Cidade" required>
                <input class="form-control" name="state" placeholder="UF" required>
                <button class="btn btn-outline-primary" type="submit">Adicionar endereco</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `,
    "ShopMax | Perfil"
  );

  document.querySelector("#address-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await api.createCustomerAddress(
      {
        recipient: formData.get("recipient"),
        zipCode: formData.get("zipCode"),
        street: formData.get("street"),
        number: formData.get("number"),
        district: formData.get("district"),
        city: formData.get("city"),
        state: formData.get("state")
      },
      state.auth.token
    );

    await renderProfile();
  });
}

async function renderFavorites() {
  if (!(await requireAuthRedirect())) {
    return;
  }

  await Promise.all([loadCategories(), loadCart(), loadFavorites()]);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Favoritos</h1>
          <a class="btn btn-outline-primary" href="#/profile">Voltar ao perfil</a>
        </div>
        <div class="row g-4">
          ${
            state.favorites.length
              ? state.favorites
                  .map(
                    (favorite) => `
                      <div class="col-md-6 col-xl-4">
                        ${productCard({
                          id: favorite.product.id,
                          name: favorite.product.name,
                          slug: favorite.product.slug,
                          sku: favorite.product.sku,
                          price: favorite.product.price,
                          promotionalPrice: favorite.product.promotionalPrice,
                          shortDescription: "Salvo em favoritos.",
                          mainImageUrl: favorite.product.imageUrl
                        })}
                      </div>
                    `
                  )
                  .join("")
              : `<div class="card border-0 shadow-sm"><div class="card-body p-4">Nenhum favorito salvo ainda.</div></div>`
          }
        </div>
      </section>
    `,
    "ShopMax | Favoritos"
  );
}

async function renderOrders() {
  if (!(await requireAuthRedirect())) {
    return;
  }

  await Promise.all([loadCategories(), loadCart(), loadOrders()]);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Meus pedidos</h1>
          <a class="btn btn-outline-primary" href="#/profile">Voltar ao perfil</a>
        </div>
        <div class="d-grid gap-3">
          ${state.orders
            .map(
              (order) => `
                <article class="card border-0 shadow-sm">
                  <div class="card-body d-flex flex-column flex-lg-row justify-content-between gap-3">
                    <div>
                      <strong>${order.code}</strong>
                      <div class="text-secondary">Status: ${order.status}</div>
                    </div>
                    <div>
                      <strong>${formatPrice(order.total)}</strong>
                    </div>
                    <div>
                      <a class="btn btn-outline-dark" href="#/orders/${order.id}">Ver detalhes</a>
                    </div>
                  </div>
                </article>
              `
            )
            .join("") || `<div class="card border-0 shadow-sm"><div class="card-body p-4">Nenhum pedido encontrado.</div></div>`}
        </div>
      </section>
    `,
    "ShopMax | Pedidos"
  );
}

async function renderOrderDetail(orderId) {
  if (!(await requireAuthRedirect())) {
    return;
  }

  await Promise.all([loadCategories(), loadCart()]);
  const order = await api.getOrder(orderId, state.auth.token);

  shell(
    `
      <section class="section-block">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h3 mb-0">Pedido ${order.code}</h1>
          <a class="btn btn-outline-primary" href="#/orders">Voltar</a>
        </div>
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h5">Itens</h2>
                ${order.items
                  .map(
                    (item) => `
                      <div class="order-item-row">
                        <div>
                          <strong>${item.productName}</strong>
                          <div class="text-secondary">${item.sku}</div>
                        </div>
                        <div>${item.quantity}x</div>
                        <div><strong>${formatPrice(item.subtotal)}</strong></div>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h5">Resumo</h2>
                <div class="d-flex justify-content-between mb-2"><span>Status</span><strong>${order.status}</strong></div>
                <div class="d-flex justify-content-between mb-2"><span>Pagamento</span><strong>${order.payment?.status ?? "-"}</strong></div>
                <div class="d-flex justify-content-between mb-2"><span>Entrega</span><strong>${order.shipment?.status ?? "-"}</strong></div>
                <div class="d-flex justify-content-between mb-2"><span>Desconto</span><strong>${formatPrice(order.discount ?? 0)}</strong></div>
                <div class="d-flex justify-content-between"><span>Total</span><strong>${formatPrice(order.total)}</strong></div>
                ${
                  ["aguardando_pagamento", "pagamento_aprovado", "em_separacao"].includes(order.status)
                    ? `<button class="btn btn-outline-danger w-100 mt-3" id="cancel-order-button" type="button">Cancelar pedido</button>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    "ShopMax | Pedido"
  );

  document.querySelector("#cancel-order-button")?.addEventListener("click", async () => {
    await api.cancelOrder(
      order.id,
      { reason: "Cancelado pelo cliente na loja" },
      state.auth.token
    );
    await renderOrderDetail(orderId);
  });
}

async function render() {
  const { path } = routeHash();

  try {
    if (path === "/" || path === "") {
      await renderHome();
      return;
    }

    if (path === "/busca") {
      await renderSearch();
      return;
    }

    if (path === "/login") {
      await renderLogin();
      return;
    }

    if (path === "/register") {
      await renderRegister();
      return;
    }

    if (path === "/checkout") {
      await renderCheckout();
      return;
    }

    if (path === "/profile") {
      await renderProfile();
      return;
    }

    if (path === "/favorites") {
      await renderFavorites();
      return;
    }

    if (path === "/orders") {
      await renderOrders();
      return;
    }

    if (path.startsWith("/orders/")) {
      await renderOrderDetail(path.replace("/orders/", ""));
      return;
    }

    if (path.startsWith("/categoria/")) {
      await renderCategory(path.replace("/categoria/", ""));
      return;
    }

    if (path.startsWith("/produto/")) {
      await renderProduct(path.replace("/produto/", ""));
      return;
    }

    if (path === "/cart") {
      await renderCart();
      return;
    }

    shell(`<div class="card border-0 shadow-sm"><div class="card-body p-5"><h1 class="h3">Pagina nao encontrada</h1></div></div>`);
  } catch (error) {
    if (String(error?.message).includes("CART_NOT_FOUND")) {
      clearCartSessionToken();
    }

    if (String(error?.message).includes("UNAUTHORIZED")) {
      clearAuthSession();
      state.auth = null;
      navigate("/login");
      return;
    }

    shell(
      `<div class="card border-0 shadow-sm"><div class="card-body p-5"><h1 class="h3">Falha ao carregar a loja</h1><p class="mb-0">${error.message ?? "Erro inesperado."}</p></div></div>`,
      "ShopMax | Erro"
    );
  }
}

window.addEventListener("hashchange", render);

render();
