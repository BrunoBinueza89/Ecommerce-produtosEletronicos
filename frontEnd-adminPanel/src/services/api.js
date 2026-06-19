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

export function resolveAdminAssetUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url, `${API_ORIGIN}/`).toString();
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

export const adminApi = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getCurrentUser(token) {
    return request("/auth/me", {
      headers: authHeaders(token)
    }).then((payload) => payload.user ?? payload);
  },
  getDashboard(token) {
    return request("/admin/dashboard", {
      headers: authHeaders(token)
    });
  },
  getIntegrationStatus(token) {
    return request("/admin/integrations/status", {
      headers: authHeaders(token)
    });
  },
  testEmailIntegration(payload, token) {
    return request("/admin/integrations/email/test", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  testTrackingIntegration(payload, token) {
    return request("/admin/integrations/tracking/test", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  validateLiveIntegrations(payload, token) {
    return request("/admin/integrations/validate-live", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listCustomers(token) {
    return request("/admin/customers", {
      headers: authHeaders(token)
    });
  },
  listOrders(token) {
    return request("/admin/orders", {
      headers: authHeaders(token)
    });
  },
  updateOrderStatus(orderId, payload, token) {
    return request(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  syncOrderTracking(orderId, token) {
    return request(`/admin/orders/${orderId}/tracking/sync`, {
      method: "POST",
      headers: authHeaders(token)
    });
  },
  syncPendingTracking(payload, token) {
    return request("/admin/orders/tracking/sync-pending", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listStock(token) {
    return request("/admin/stock", {
      headers: authHeaders(token)
    });
  },
  adjustStock(stockId, payload, token) {
    return request(`/admin/stock/${stockId}/adjust`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listCoupons(token) {
    return request("/admin/coupons", {
      headers: authHeaders(token)
    });
  },
  createCoupon(payload, token) {
    return request("/admin/coupons", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listPromotions(token) {
    return request("/admin/promotions", {
      headers: authHeaders(token)
    });
  },
  createPromotion(payload, token) {
    return request("/admin/promotions", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  getReports(token) {
    return request("/admin/reports", {
      headers: authHeaders(token)
    });
  },
  getAdvancedReports(token, thresholdHours = null) {
    const suffix = thresholdHours ? `?thresholdHours=${encodeURIComponent(thresholdHours)}` : "";
    return request(`/admin/reports/advanced${suffix}`, {
      headers: authHeaders(token)
    });
  },
  listAbandonedCarts(token, thresholdHours = null) {
    const suffix = thresholdHours ? `?thresholdHours=${encodeURIComponent(thresholdHours)}` : "";
    return request(`/admin/carts/abandoned${suffix}`, {
      headers: authHeaders(token)
    });
  },
  processAbandonedCarts(payload, token) {
    return request("/admin/carts/abandoned/process", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  getAuditLogs(token) {
    return request("/admin/audit-logs", {
      headers: authHeaders(token)
    });
  },
  listCategories(token) {
    return request("/categories", {
      headers: token ? authHeaders(token) : undefined
    });
  },
  createCategory(payload, token) {
    return request("/categories", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listBrands(token) {
    return request("/brands", {
      headers: token ? authHeaders(token) : undefined
    });
  },
  createBrand(payload, token) {
    return request("/brands", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload)
    });
  },
  listProducts(filters = {}, token) {
    const params = new URLSearchParams();

    if (filters.q) {
      params.set("q", filters.q);
    }

    if (filters.category) {
      params.set("category", filters.category);
    }

    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/products${suffix}`, {
      headers: token ? authHeaders(token) : undefined
    });
  },
  createProduct(payload, token) {
    return request("/products", {
      method: "POST",
      headers: authHeaders(token),
      body: payload
    });
  },
  addProductMedia(productId, payload, token) {
    return request(`/products/${productId}/media`, {
      method: "POST",
      headers: authHeaders(token),
      body: payload
    });
  },
  setMainProductImage(productId, imageId, token) {
    return request(`/products/${productId}/images/${imageId}/main`, {
      method: "PATCH",
      headers: authHeaders(token)
    });
  },
  deleteProductImage(productId, imageId, token) {
    return request(`/products/${productId}/images/${imageId}`, {
      method: "DELETE",
      headers: authHeaders(token)
    });
  },
  deleteProductVideo(productId, videoId, token) {
    return request(`/products/${productId}/videos/${videoId}`, {
      method: "DELETE",
      headers: authHeaders(token)
    });
  }
};
