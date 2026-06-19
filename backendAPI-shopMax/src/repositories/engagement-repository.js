import { getPool } from "../../connection.js";

export async function listAbandonedCarts({ thresholdHours = 24, limit = 50 }) {
  const [rows] = await getPool().query(
    `
      SELECT
        carrinhos.id,
        carrinhos.cliente_id,
        carrinhos.session_token,
        carrinhos.updated_at,
        clientes.nome AS cliente_nome,
        usuarios.email AS cliente_email,
        COUNT(itens_carrinho.id) AS items_count,
        COALESCE(SUM(itens_carrinho.quantidade * itens_carrinho.preco_unitario), 0) AS subtotal
      FROM carrinhos
      INNER JOIN clientes ON clientes.id = carrinhos.cliente_id
      INNER JOIN usuarios ON usuarios.id = clientes.usuario_id
      INNER JOIN itens_carrinho ON itens_carrinho.carrinho_id = carrinhos.id
      WHERE carrinhos.status = 'ativo'
        AND carrinhos.updated_at <= DATE_SUB(NOW(), INTERVAL ? HOUR)
      GROUP BY carrinhos.id, clientes.nome, usuarios.email
      ORDER BY carrinhos.updated_at ASC
      LIMIT ?
    `,
    [thresholdHours, limit]
  );

  return rows;
}

export async function getAdvancedReportsSummary({ thresholdHours = 24 }) {
  const [revenueByDay] = await getPool().query(
    `
      SELECT
        DATE(pedidos.created_at) AS reference_day,
        COUNT(*) AS total_orders,
        COALESCE(SUM(pedidos.total), 0) AS total_revenue
      FROM pedidos
      WHERE pedidos.status <> 'cancelado'
        AND pedidos.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(pedidos.created_at)
      ORDER BY reference_day DESC
    `
  );

  const [topCategories] = await getPool().query(
    `
      SELECT
        categorias.nome AS category_name,
        SUM(itens_pedido.quantidade) AS total_quantity,
        COALESCE(SUM(itens_pedido.subtotal), 0) AS total_revenue
      FROM itens_pedido
      INNER JOIN produtos ON produtos.id = itens_pedido.produto_id
      INNER JOIN categorias ON categorias.id = produtos.categoria_id
      GROUP BY categorias.id, categorias.nome
      ORDER BY total_revenue DESC
      LIMIT 5
    `
  );

  const [couponPerformance] = await getPool().query(
    `
      SELECT
        cupons.codigo,
        COUNT(cupom_usos.id) AS total_usage,
        COALESCE(SUM(pedidos.desconto), 0) AS total_discount
      FROM cupons
      LEFT JOIN cupom_usos ON cupom_usos.cupom_id = cupons.id
      LEFT JOIN pedidos ON pedidos.id = cupom_usos.pedido_id
      WHERE cupons.deleted_at IS NULL
      GROUP BY cupons.id, cupons.codigo
      ORDER BY total_usage DESC, total_discount DESC
      LIMIT 10
    `
  );

  const [reviewAverages] = await getPool().query(
    `
      SELECT
        produtos.nome AS product_name,
        AVG(avaliacoes.nota) AS average_rating,
        COUNT(avaliacoes.id) AS reviews_count
      FROM avaliacoes
      INNER JOIN produtos ON produtos.id = avaliacoes.produto_id
      WHERE avaliacoes.status = 'publicada'
      GROUP BY produtos.id, produtos.nome
      ORDER BY average_rating DESC, reviews_count DESC
      LIMIT 5
    `
  );

  const abandonedCarts = await listAbandonedCarts({ thresholdHours, limit: 20 });

  return {
    revenueByDay,
    topCategories,
    couponPerformance,
    reviewAverages,
    abandonedCarts
  };
}
