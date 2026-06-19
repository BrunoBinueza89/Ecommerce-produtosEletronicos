export function serializeFavorite(row) {
  return {
    id: row.id,
    productId: row.produto_id,
    createdAt: row.created_at,
    product: {
      id: row.produto_id,
      name: row.produto_nome,
      slug: row.produto_slug,
      sku: row.produto_sku,
      imageUrl: row.main_image_url ?? null,
      price: Number(row.preco),
      promotionalPrice: row.preco_promocional === null ? null : Number(row.preco_promocional)
    }
  };
}
