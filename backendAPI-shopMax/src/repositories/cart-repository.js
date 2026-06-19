import crypto from "node:crypto";
import { getPool } from "../../connection.js";

function generateSessionToken() {
  return crypto.randomUUID();
}

export async function findCartBySessionToken(sessionToken) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM carrinhos
      WHERE session_token = ? AND status = 'ativo'
      LIMIT 1
    `,
    [sessionToken]
  );

  return rows[0] ?? null;
}

export async function createCartSession() {
  const sessionToken = generateSessionToken();
  const [result] = await getPool().query(
    `
      INSERT INTO carrinhos (session_token, status)
      VALUES (?, 'ativo')
    `,
    [sessionToken]
  );

  const [rows] = await getPool().query("SELECT * FROM carrinhos WHERE id = ?", [result.insertId]);
  return rows[0];
}

export async function attachCustomerToCart(sessionToken, customerId) {
  await getPool().query(
    `
      UPDATE carrinhos
      SET cliente_id = COALESCE(cliente_id, ?)
      WHERE session_token = ? AND status = 'ativo'
    `,
    [customerId, sessionToken]
  );
}

export async function findCartItems(cartId) {
  const [rows] = await getPool().query(
    `
      SELECT
        itens_carrinho.*,
        produtos.nome AS produto_nome,
        produtos.slug AS produto_slug,
        produtos.sku AS produto_sku,
        produto_imagens.url AS main_image_url
      FROM itens_carrinho
      INNER JOIN produtos ON produtos.id = itens_carrinho.produto_id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      WHERE itens_carrinho.carrinho_id = ?
      ORDER BY itens_carrinho.created_at ASC
    `,
    [cartId]
  );

  return rows;
}

export async function findProductForCart(productId) {
  const [rows] = await getPool().query(
    `
      SELECT
        produtos.*,
        produtos.categoria_id,
        estoques.saldo,
        produto_imagens.url AS main_image_url
      FROM produtos
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      WHERE produtos.id = ? AND produtos.deleted_at IS NULL
      LIMIT 1
    `,
    [productId]
  );

  return rows[0] ?? null;
}

export async function addCartItem(cartId, payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      `
        SELECT *
        FROM itens_carrinho
        WHERE carrinho_id = ? AND produto_id = ? AND produto_variacao_id <=> ?
        LIMIT 1
      `,
      [cartId, payload.productId, payload.productVariationId ?? null]
    );

    if (existingRows[0]) {
      await connection.query(
        `
          UPDATE itens_carrinho
          SET quantidade = quantidade + ?, preco_unitario = ?
          WHERE id = ?
        `,
        [payload.quantity, payload.unitPrice, existingRows[0].id]
      );
    } else {
      await connection.query(
        `
          INSERT INTO itens_carrinho (
            carrinho_id, produto_id, produto_variacao_id, quantidade, preco_unitario
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [cartId, payload.productId, payload.productVariationId ?? null, payload.quantity, payload.unitPrice]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findCartItemById(cartId, itemId) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM itens_carrinho
      WHERE id = ? AND carrinho_id = ?
      LIMIT 1
    `,
    [itemId, cartId]
  );

  return rows[0] ?? null;
}

export async function updateCartItemQuantity(itemId, quantity) {
  await getPool().query(
    `
      UPDATE itens_carrinho
      SET quantidade = ?
      WHERE id = ?
    `,
    [quantity, itemId]
  );
}

export async function deleteCartItem(itemId) {
  await getPool().query("DELETE FROM itens_carrinho WHERE id = ?", [itemId]);
}
