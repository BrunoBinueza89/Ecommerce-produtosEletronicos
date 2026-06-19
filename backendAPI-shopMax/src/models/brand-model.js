export function serializeBrand(row) {
  return {
    id: row.id,
    name: row.nome,
    slug: row.slug,
    logoUrl: row.logo_url,
    status: row.status
  };
}
