import { getPool } from "../../connection.js";

export async function listOrdersByCustomerId(customerId) {
  const [rows] = await getPool().query(
    `
      SELECT
        pedidos.*,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        pagamentos.parcelas AS payment_installments,
        pagamentos.valor AS payment_value,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code,
        entregas.metodo AS delivery_method
      FROM pedidos
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      WHERE pedidos.cliente_id = ?
      ORDER BY pedidos.created_at DESC
    `,
    [customerId]
  );

  return rows;
}

export async function findOrderByIdAndCustomerId(orderId, customerId) {
  const [rows] = await getPool().query(
    `
      SELECT
        pedidos.*,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        pagamentos.parcelas AS payment_installments,
        pagamentos.valor AS payment_value,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code,
        entregas.metodo AS delivery_method
      FROM pedidos
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      WHERE pedidos.id = ? AND pedidos.cliente_id = ?
      LIMIT 1
    `,
    [orderId, customerId]
  );

  return rows[0] ?? null;
}

export async function findOrderWithItemsByIdAndCustomerId(orderId, customerId, connection = getPool()) {
  const [rows] = await connection.query(
    `
      SELECT
        pedidos.*,
        pagamentos.id AS payment_id,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        pagamentos.parcelas AS payment_installments,
        pagamentos.valor AS payment_value,
        entregas.id AS delivery_id,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code,
        entregas.metodo AS delivery_method
      FROM pedidos
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      WHERE pedidos.id = ? AND pedidos.cliente_id = ?
      LIMIT 1
      FOR UPDATE
    `,
    [orderId, customerId]
  );

  return rows[0] ?? null;
}

export async function listOrderItems(orderId) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM itens_pedido
      WHERE pedido_id = ?
      ORDER BY id ASC
    `,
    [orderId]
  );

  return rows;
}

export async function cancelOrderByCustomer(orderId, customerId, reason = null) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const order = await findOrderWithItemsByIdAndCustomerId(orderId, customerId, connection);

    if (!order) {
      return null;
    }

    if (["enviado", "entregue", "reembolsado"].includes(order.status)) {
      throw Object.assign(new Error("Pedido nao pode ser cancelado neste status."), {
        code: "ORDER_CANNOT_CANCEL",
        statusCode: 422
      });
    }

    if (order.status === "cancelado") {
      throw Object.assign(new Error("Pedido ja esta cancelado."), {
        code: "ORDER_ALREADY_CANCELLED",
        statusCode: 422
      });
    }

    const items = await listOrderItems(orderId);

    for (const item of items) {
      const [stockRows] = await connection.query(
        `
          SELECT id, saldo
          FROM estoques
          WHERE produto_id = ? AND (? IS NULL OR produto_variacao_id <=> ?)
          LIMIT 1
          FOR UPDATE
        `,
        [item.produto_id, item.produto_variacao_id ?? null, item.produto_variacao_id ?? null]
      );

      const stock = stockRows[0];

      if (!stock) {
        continue;
      }

      const previousBalance = Number(stock.saldo);
      const nextBalance = previousBalance + Number(item.quantidade);

      await connection.query("UPDATE estoques SET saldo = ? WHERE id = ?", [nextBalance, stock.id]);
      await connection.query(
        `
          INSERT INTO movimentacoes_estoque (
            estoque_id, tipo, quantidade, saldo_anterior, saldo_posterior, origem_tipo, origem_id, observacao
          )
          VALUES (?, 'estorno', ?, ?, ?, 'pedido', ?, ?)
        `,
        [
          stock.id,
          item.quantidade,
          previousBalance,
          nextBalance,
          orderId,
          reason ?? "Estorno de estoque por cancelamento do pedido"
        ]
      );
    }

    await connection.query("UPDATE pedidos SET status = 'cancelado', observacoes = ? WHERE id = ?", [
      reason ?? order.observacoes ?? null,
      orderId
    ]);
    await connection.query(
      "UPDATE pagamentos SET status = CASE WHEN status = 'aprovado' THEN 'reembolsado' ELSE status END WHERE pedido_id = ?",
      [orderId]
    );
    await connection.query("UPDATE entregas SET status = 'devolvido' WHERE pedido_id = ?", [orderId]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
