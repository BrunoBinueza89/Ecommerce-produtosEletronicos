export function serializeCategory(row) {
  return {
    id: row.id,
    parentCategoryId: row.categoria_pai_id,
    name: row.nome,
    slug: row.slug,
    description: row.descricao,
    imageUrl: row.imagem_url,
    bannerUrl: row.banner_url,
    displayOrder: row.ordem_exibicao,
    status: row.status
  };
}
