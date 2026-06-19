import { getPool } from "../../connection.js";

export async function listCustomersAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT
        clientes.id,
        clientes.nome,
        clientes.cpf,
        clientes.telefone,
        clientes.ativo,
        usuarios.email,
        COUNT(DISTINCT pedidos.id) AS total_pedidos,
        COALESCE(SUM(pedidos.total), 0) AS total_gasto,
        MAX(pedidos.created_at) AS ultima_compra
      FROM clientes
      INNER JOIN usuarios ON usuarios.id = clientes.usuario_id
      LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id
      WHERE clientes.deleted_at IS NULL
      GROUP BY clientes.id, usuarios.email
      ORDER BY clientes.created_at DESC
    `
  );

  return rows;
}

export async function listOrdersAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT
        pedidos.*,
        clientes.nome AS cliente_nome,
        usuarios.email AS cliente_email,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code
      FROM pedidos
      INNER JOIN clientes ON clientes.id = pedidos.cliente_id
      INNER JOIN usuarios ON usuarios.id = clientes.usuario_id
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      ORDER BY pedidos.created_at DESC
    `
  );

  return rows;
}

export async function findOrderAdmin(orderId) {
  const [rows] = await getPool().query(
    `
      SELECT
        pedidos.*,
        clientes.nome AS cliente_nome,
        usuarios.email AS cliente_email,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        pagamentos.valor AS payment_value,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code
      FROM pedidos
      INNER JOIN clientes ON clientes.id = pedidos.cliente_id
      INNER JOIN usuarios ON usuarios.id = clientes.usuario_id
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      WHERE pedidos.id = ?
      LIMIT 1
    `,
    [orderId]
  );

  return rows[0] ?? null;
}

export async function listOrdersEligibleForTrackingSync(limit = 20) {
  const [rows] = await getPool().query(
    `
      SELECT
        pedidos.*,
        clientes.nome AS cliente_nome,
        usuarios.email AS cliente_email,
        pagamentos.status AS payment_status,
        pagamentos.metodo AS payment_method,
        pagamentos.valor AS payment_value,
        entregas.status AS delivery_status,
        entregas.codigo_rastreio AS delivery_tracking_code
      FROM pedidos
      INNER JOIN clientes ON clientes.id = pedidos.cliente_id
      INNER JOIN usuarios ON usuarios.id = clientes.usuario_id
      LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      WHERE entregas.codigo_rastreio IS NOT NULL
        AND pedidos.status IN ('em_separacao', 'enviado')
      ORDER BY pedidos.updated_at DESC, pedidos.id DESC
      LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export async function updateOrderStatus(orderId, status, trackingCode = null) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      `
        SELECT pedidos.*, pagamentos.status AS payment_status
        FROM pedidos
        LEFT JOIN pagamentos ON pagamentos.pedido_id = pedidos.id
        WHERE pedidos.id = ?
        LIMIT 1
        FOR UPDATE
      `,
      [orderId]
    );

    const order = orderRows[0];

    if (!order) {
      await connection.rollback();
      return;
    }

    const currentStatus = order.status;
    const sameStatus = currentStatus === status;

    if (!sameStatus) {
      const transitionMap = {
        aguardando_pagamento: ["pagamento_aprovado", "cancelado"],
        pagamento_aprovado: ["em_separacao", "cancelado", "reembolsado"],
        em_separacao: ["enviado", "cancelado", "reembolsado"],
        enviado: ["entregue", "reembolsado"],
        entregue: ["reembolsado"],
        cancelado: [],
        reembolsado: []
      };

      if (!transitionMap[currentStatus]?.includes(status)) {
        throw Object.assign(new Error("Transicao de status do pedido nao permitida."), {
          code: "INVALID_ORDER_STATUS_TRANSITION",
          statusCode: 422
        });
      }
    }

    await connection.query("UPDATE pedidos SET status = ? WHERE id = ?", [status, orderId]);

    if (["cancelado", "reembolsado"].includes(status) && !["cancelado", "reembolsado"].includes(currentStatus)) {
      const [items] = await connection.query(
        `
          SELECT *
          FROM itens_pedido
          WHERE pedido_id = ?
          ORDER BY id ASC
        `,
        [orderId]
      );

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
            status === "cancelado"
              ? "Estorno administrativo por cancelamento do pedido"
              : "Estorno administrativo por reembolso do pedido"
          ]
        );
      }

      await connection.query(
        "UPDATE pagamentos SET status = CASE WHEN status = 'aprovado' THEN 'reembolsado' ELSE status END WHERE pedido_id = ?",
        [orderId]
      );
    }

    if (trackingCode !== null || status === "enviado" || status === "entregue") {
      const deliveryStatusMap = {
        aguardando_pagamento: "pendente",
        pagamento_aprovado: "pendente",
        em_separacao: "separando",
        enviado: "enviado",
        entregue: "entregue",
        cancelado: "devolvido",
        reembolsado: "devolvido"
      };

      await connection.query(
        `
          UPDATE entregas
          SET status = ?, codigo_rastreio = COALESCE(?, codigo_rastreio)
          WHERE pedido_id = ?
        `,
        [deliveryStatusMap[status] ?? "pendente", trackingCode, orderId]
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

export async function listStockAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT
        estoques.*,
        produtos.nome AS produto_nome,
        produtos.sku AS produto_sku,
        produtos.status AS produto_status
      FROM estoques
      LEFT JOIN produtos ON produtos.id = estoques.produto_id
      ORDER BY produtos.nome ASC
    `
  );

  return rows;
}

export async function adjustStock(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `
        SELECT estoques.*, produtos.nome AS produto_nome
        FROM estoques
        LEFT JOIN produtos ON produtos.id = estoques.produto_id
        WHERE estoques.id = ?
        LIMIT 1
        FOR UPDATE
      `,
      [payload.stockId]
    );

    const stock = rows[0];
    const previousBalance = Number(stock.saldo);
    const nextBalance = previousBalance + Number(payload.quantityDelta);

    await connection.query(
      `
        UPDATE estoques
        SET saldo = ?, estoque_minimo = COALESCE(?, estoque_minimo)
        WHERE id = ?
      `,
      [nextBalance, payload.stockMinimum ?? null, payload.stockId]
    );

    await connection.query(
      `
        INSERT INTO movimentacoes_estoque (
          estoque_id, tipo, quantidade, saldo_anterior, saldo_posterior, origem_tipo, observacao
        )
        VALUES (?, ?, ?, ?, ?, 'admin', ?)
      `,
      [
        payload.stockId,
        payload.quantityDelta >= 0 ? "ajuste" : "saida",
        Math.abs(payload.quantityDelta),
        previousBalance,
        nextBalance,
        payload.reason
      ]
    );

    await connection.commit();

    return {
      stockId: payload.stockId,
      productName: stock.produto_nome,
      previousBalance,
      nextBalance
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listCouponsAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT cupons.*, categorias.nome AS categoria_nome
      FROM cupons
      LEFT JOIN categorias ON categorias.id = cupons.categoria_id
      WHERE cupons.deleted_at IS NULL
      ORDER BY cupons.created_at DESC
    `
  );

  return rows;
}

export async function createCoupon(payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO cupons (
        codigo, tipo, valor, percentual, validade_inicio, validade_fim,
        valor_minimo, limite_total_uso, limite_por_cliente, categoria_id, ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.code,
      payload.type,
      payload.fixedValue ?? null,
      payload.percentage ?? null,
      payload.validFrom ?? null,
      payload.validUntil ?? null,
      payload.minimumValue ?? 0,
      payload.totalUsageLimit ?? null,
      payload.customerUsageLimit ?? null,
      payload.categoryId ?? null,
      payload.active ? 1 : 0
    ]
  );

  const [rows] = await getPool().query("SELECT * FROM cupons WHERE id = ?", [result.insertId]);
  return rows[0];
}

export async function getDashboardSummary() {
  const [[summary]] = await getPool().query(
    `
      SELECT
        COALESCE(SUM(CASE WHEN pedidos.status <> 'cancelado' THEN pedidos.total ELSE 0 END), 0) AS revenue_total,
        COUNT(DISTINCT pedidos.id) AS total_orders,
        COUNT(DISTINCT CASE WHEN pedidos.status = 'aguardando_pagamento' THEN pedidos.id END) AS pending_orders,
        COUNT(DISTINCT CASE WHEN entregas.status = 'entregue' THEN pedidos.id END) AS delivered_orders,
        COALESCE(AVG(CASE WHEN pedidos.status <> 'cancelado' THEN pedidos.total END), 0) AS average_ticket,
        COUNT(DISTINCT clientes.id) AS total_customers,
        COUNT(DISTINCT CASE WHEN estoques.saldo <= estoques.estoque_minimo THEN estoques.id END) AS low_stock_products
      FROM pedidos
      LEFT JOIN clientes ON clientes.id = pedidos.cliente_id
      LEFT JOIN entregas ON entregas.pedido_id = pedidos.id
      LEFT JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
      LEFT JOIN produtos ON produtos.id = itens_pedido.produto_id
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
    `
  );

  return summary;
}

export async function getReportsSummary() {
  const [salesByStatus] = await getPool().query(
    `
      SELECT status, COUNT(*) AS total
      FROM pedidos
      GROUP BY status
      ORDER BY total DESC
    `
  );

  const [topProducts] = await getPool().query(
    `
      SELECT nome_produto, SUM(quantidade) AS total_quantity, SUM(subtotal) AS total_revenue
      FROM itens_pedido
      GROUP BY nome_produto
      ORDER BY total_quantity DESC
      LIMIT 5
    `
  );

  const [lowStock] = await getPool().query(
    `
      SELECT produtos.nome, produtos.sku, estoques.saldo, estoques.estoque_minimo
      FROM estoques
      INNER JOIN produtos ON produtos.id = estoques.produto_id
      WHERE estoques.saldo <= estoques.estoque_minimo
      ORDER BY estoques.saldo ASC
      LIMIT 10
    `
  );

  return {
    salesByStatus,
    topProducts,
    lowStock
  };
}

export async function listAuditLogs() {
  const [rows] = await getPool().query(
    `
      SELECT
        logs_sistema.*,
        usuarios.nome AS usuario_nome,
        usuarios.email AS usuario_email
      FROM logs_sistema
      LEFT JOIN usuarios ON usuarios.id = logs_sistema.usuario_id
      ORDER BY logs_sistema.created_at DESC
      LIMIT 100
    `
  );

  return rows;
}

export async function createAuditLog(payload) {
  await getPool().query(
    `
      INSERT INTO logs_sistema (usuario_id, modulo, entidade, entidade_id, acao, ip, payload_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.userId ?? null,
      payload.module,
      payload.entity,
      payload.entityId ?? null,
      payload.action,
      payload.ip ?? null,
      payload.payloadJson ? JSON.stringify(payload.payloadJson) : null
    ]
  );
}
