export function sanitizeUser(row) {
  return {
    id: row.id,
    profileId: row.perfil_id,
    type: row.tipo,
    name: row.nome,
    email: row.email,
    active: Boolean(row.ativo),
    profileSlug: row.profile_slug ?? null,
    profileName: row.profile_name ?? null
  };
}
