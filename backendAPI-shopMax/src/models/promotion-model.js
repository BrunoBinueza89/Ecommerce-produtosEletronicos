export function serializePromotion(row) {
  return {
    id: row.id,
    name: row.nome,
    slug: row.slug,
    type: row.tipo,
    value: row.valor === null ? null : Number(row.valor),
    percentage: row.percentual === null ? null : Number(row.percentual),
    startsAt: row.inicio,
    endsAt: row.fim,
    status: row.status,
    productId: row.produto_id ?? null,
    categoryId: row.categoria_id ?? null
  };
}
