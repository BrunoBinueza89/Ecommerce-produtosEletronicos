export function serializeProduct(row) {
  return {
    id: row.id,
    categoryId: row.categoria_id,
    categorySlug: row.category_slug ?? null,
    categoryName: row.category_name ?? null,
    brandId: row.marca_id,
    brandSlug: row.brand_slug ?? null,
    brandName: row.brand_name ?? null,
    name: row.nome,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.preco),
    promotionalPrice:
      row.preco_promocional_efetivo === null || row.preco_promocional_efetivo === undefined
        ? row.preco_promocional === null
          ? null
          : Number(row.preco_promocional)
        : Number(row.preco_promocional_efetivo),
    shortDescription: row.descricao_curta,
    description: row.descricao_completa,
    technicalSheet: row.ficha_tecnica,
    status: row.status,
    mainImageUrl: row.main_image_url ?? null,
    images: Array.isArray(row.images)
      ? row.images.map((image) => ({
          id: image.id,
          productId: image.productId ?? image.produto_id ?? row.id,
          url: image.url,
          altText: image.altText ?? image.alt_text ?? null,
          isMain: Boolean(image.isMain ?? image.principal),
          sortOrder: image.sortOrder ?? image.ordem ?? null
        }))
      : [],
    videos: Array.isArray(row.videos)
      ? row.videos.map((video) => ({
          id: video.id,
          productId: video.productId ?? video.produto_id ?? row.id,
          url: video.url,
          title: video.title ?? video.titulo ?? null,
          sortOrder: video.sortOrder ?? video.ordem ?? null
        }))
      : [],
    promotionName: row.promocao_nome ?? null,
    stockBalance: row.stock_balance === null || row.stock_balance === undefined ? null : Number(row.stock_balance)
  };
}
