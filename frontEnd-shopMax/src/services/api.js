const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000/api";
const API_ORIGIN = new URL(API_BASE_URL).origin;

async function request(path, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options;
  const isFormData = restOptions.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: isFormData
      ? {
          ...(optionHeaders ?? {})
        }
      : {
          "Content-Type": "application/json",
          ...(optionHeaders ?? {})
        }
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? "Erro na API");
  }

  return payload.data ?? payload;
}

export function resolveShopAssetUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url, `${API_ORIGIN}/`).toString();
}

export const api = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  registerCustomer(payload) {
    return request("/auth/register/customer", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getCurrentUser(token) {
    return request("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  listCategories() {
    return request("/categories");
  },
  listBrands() {
    return request("/brands");
  },
  listBanners(position = null) {
    const suffix = position ? `?position=${encodeURIComponent(position)}` : "";
    return request(`/banners${suffix}`);
  },
  listPromotions() {
    return request("/promotions");
  },
  listProducts(filters = {}) {
    const params = new URLSearchParams();

    if (filters.q) {
      params.set("q", filters.q);
    }

    if (filters.category) {
      params.set("category", filters.category);
    }

    if (filters.brand) {
      params.set("brand", filters.brand);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== "") {
      params.set("minPrice", filters.minPrice);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== "") {
      params.set("maxPrice", filters.maxPrice);
    }

    if (filters.inStock) {
      params.set("inStock", "true");
    }

    if (filters.sort) {
      params.set("sort", filters.sort);
    }

    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/products${suffix}`);
  },
  getProduct(slug) {
    return request(`/products/${slug}`);
  },
  async ensureCartSession() {
    const data = await request("/cart/session", { method: "POST" });
    return data.sessionToken;
  },
  getCart(sessionToken) {
    return request(`/cart?sessionToken=${encodeURIComponent(sessionToken)}`);
  },
  addCartItem(payload) {
    return request("/cart/items", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  updateCartItem(itemId, payload) {
    return request(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },
  removeCartItem(itemId, sessionToken) {
    return request(`/cart/items/${itemId}?sessionToken=${encodeURIComponent(sessionToken)}`, {
      method: "DELETE"
    });
  },
  getCheckoutPreview(sessionToken, token, couponCode = null) {
    const params = new URLSearchParams({
      sessionToken
    });

    if (couponCode) {
      params.set("couponCode", couponCode);
    }

    return request(`/checkout/preview?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  finalizeCheckout(payload, token) {
    return request("/checkout/finalize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  },
  getCustomerProfile(token) {
    return request("/customers/me/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  createCustomerAddress(payload, token) {
    return request("/customers/me/addresses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  },
  listOrders(token) {
    return request("/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getOrder(orderId, token) {
    return request(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  cancelOrder(orderId, payload, token) {
    return request(`/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  },
  listFavorites(token) {
    return request("/favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  addFavorite(productId, token) {
    return request("/favorites", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
  },
  removeFavorite(productId, token) {
    return request(`/favorites/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  listReviews(slug) {
    return request(`/products/${slug}/reviews`);
  },
  createReview(payload, token) {
    return request("/reviews", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }
};
