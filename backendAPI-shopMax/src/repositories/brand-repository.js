import { getPool } from "../../connection.js";

export async function listBrands() {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM marcas
      WHERE deleted_at IS NULL AND status = 'ativo'
      ORDER BY nome ASC
    `
  );

  return rows;
}

export async function createBrand(payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO marcas (nome, slug, logo_url, status)
      VALUES (?, ?, ?, ?)
    `,
    [payload.name, payload.slug, payload.logoUrl ?? null, payload.status ?? "ativo"]
  );

  const [rows] = await getPool().query("SELECT * FROM marcas WHERE id = ?", [result.insertId]);
  return rows[0];
}
