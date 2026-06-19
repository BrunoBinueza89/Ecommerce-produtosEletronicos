import { getPool } from "../../connection.js";

export async function listCategories() {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM categorias
      WHERE deleted_at IS NULL AND status = 'ativo'
      ORDER BY ordem_exibicao ASC, nome ASC
    `
  );

  return rows;
}

export async function createCategory(payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO categorias (
        categoria_pai_id, nome, slug, descricao, imagem_url, banner_url, ordem_exibicao, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.parentCategoryId ?? null,
      payload.name,
      payload.slug,
      payload.description ?? null,
      payload.imageUrl ?? null,
      payload.bannerUrl ?? null,
      payload.displayOrder ?? 0,
      payload.status ?? "ativo"
    ]
  );

  const [rows] = await getPool().query("SELECT * FROM categorias WHERE id = ?", [result.insertId]);
  return rows[0];
}
