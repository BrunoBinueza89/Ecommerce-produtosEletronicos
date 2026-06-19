export function serializeBanner(row) {
  return {
    id: row.id,
    title: row.titulo,
    position: row.posicao,
    imageUrl: row.imagem_url,
    linkUrl: row.link_url,
    status: row.status,
    order: row.ordem
  };
}
