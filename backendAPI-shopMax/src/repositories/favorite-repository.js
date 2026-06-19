import { getPool } from "../../connection.js";

export async function listFavoritesByCustomerId(customerId) {
  const [rows] = await getPool().query(
    `
      SELECT
        favoritos.*,
        produtos.nome AS produto_nome,
        produtos.slug AS produto_slug,
        produtos.sku AS produto_sku,
        produtos.preco,
        produtos.preco_promocional,
        produto_imagens.url AS main_image_url
      FROM favoritos
      INNER JOIN produtos ON produtos.id = favoritos.produto_id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      WHERE favoritos.cliente_id = ?
      ORDER BY favoritos.created_at DESC
    `,
    [customerId]
  );

  return rows;
}

export async function addFavorite(customerId, productId) {
  await getPool().query(
    `
      INSERT IGNORE INTO favoritos (cliente_id, produto_id)
      VALUES (?, ?)
    `,
    [customerId, productId]
  );
}

export async function deleteFavorite(customerId, productId) {
  await getPool().query("DELETE FROM favoritos WHERE cliente_id = ? AND produto_id = ?", [
    customerId,
    productId
  ]);
}

export async function findFavorite(customerId, productId) {
  const [rows] = await getPool().query(
    "SELECT * FROM favoritos WHERE cliente_id = ? AND produto_id = ? LIMIT 1",
    [customerId, productId]
  );

  return rows[0] ?? null;
}
