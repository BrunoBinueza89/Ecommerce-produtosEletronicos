import { getPool } from "../../connection.js";

export async function listPublishedReviewsByProductSlug(slug) {
  const [rows] = await getPool().query(
    `
      SELECT
        avaliacoes.*,
        clientes.nome AS cliente_nome
      FROM avaliacoes
      INNER JOIN produtos ON produtos.id = avaliacoes.produto_id
      INNER JOIN clientes ON clientes.id = avaliacoes.cliente_id
      WHERE produtos.slug = ?
        AND avaliacoes.status = 'publicada'
      ORDER BY avaliacoes.created_at DESC
    `,
    [slug]
  );

  return rows;
}

export async function customerHasEligiblePurchase(customerId, productId) {
  const [rows] = await getPool().query(
    `
      SELECT pedidos.id
      FROM pedidos
      INNER JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
      WHERE pedidos.cliente_id = ?
        AND itens_pedido.produto_id = ?
        AND pedidos.status = 'entregue'
      LIMIT 1
    `,
    [customerId, productId]
  );

  return rows[0] ?? null;
}

export async function findReviewByCustomerAndProduct(customerId, productId) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM avaliacoes
      WHERE cliente_id = ? AND produto_id = ?
      LIMIT 1
    `,
    [customerId, productId]
  );

  return rows[0] ?? null;
}

export async function createReview(payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO avaliacoes (cliente_id, produto_id, pedido_id, nota, titulo, comentario, status)
      VALUES (?, ?, ?, ?, ?, ?, 'publicada')
    `,
    [
      payload.customerId,
      payload.productId,
      payload.orderId ?? null,
      payload.rating,
      payload.title ?? null,
      payload.comment ?? null
    ]
  );

  const [rows] = await getPool().query(
    `
      SELECT avaliacoes.*, clientes.nome AS cliente_nome
      FROM avaliacoes
      INNER JOIN clientes ON clientes.id = avaliacoes.cliente_id
      WHERE avaliacoes.id = ?
    `,
    [result.insertId]
  );

  return rows[0];
}
