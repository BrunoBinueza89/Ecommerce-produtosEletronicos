export function serializeCartItem(row) {
  return {
    id: row.id,
    productId: row.produto_id,
    productVariationId: row.produto_variacao_id,
    quantity: row.quantidade,
    unitPrice: Number(row.preco_unitario),
    subtotal: Number(row.preco_unitario) * Number(row.quantidade),
    product: {
      id: row.produto_id,
      name: row.produto_nome,
      slug: row.produto_slug,
      sku: row.produto_sku,
      imageUrl: row.main_image_url ?? null
    }
  };
}

export function serializeCart(row, items) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: row.id,
    customerId: row.cliente_id,
    sessionToken: row.session_token,
    couponId: row.cupom_id,
    status: row.status,
    subtotal,
    itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items
  };
}
