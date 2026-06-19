import crypto from "node:crypto";
import { getPool } from "../../connection.js";

function createOrderCode() {
  return `SMX-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function normalizeCouponCode(code) {
  return String(code ?? "").trim().toUpperCase();
}

async function getActiveCart(connection, sessionToken) {
  const [cartRows] = await connection.query(
    `
      SELECT *
      FROM carrinhos
      WHERE session_token = ? AND status = 'ativo'
      LIMIT 1
      FOR UPDATE
    `,
    [sessionToken]
  );

  return cartRows[0] ?? null;
}

async function getCartItemsForCheckout(connection, cartId) {
  const [itemRows] = await connection.query(
    `
      SELECT
        itens_carrinho.*,
        produtos.nome,
        produtos.sku,
        produtos.status AS produto_status,
        produtos.categoria_id,
        estoques.id AS estoque_id,
        estoques.saldo,
        estoques.reservado
      FROM itens_carrinho
      INNER JOIN produtos ON produtos.id = itens_carrinho.produto_id
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
      WHERE itens_carrinho.carrinho_id = ?
      FOR UPDATE
    `,
    [cartId]
  );

  return itemRows;
}

async function resolveCoupon(connection, payload) {
  const couponCode = normalizeCouponCode(payload.couponCode);

  if (!couponCode) {
    return {
      appliedCoupon: null,
      couponDiscount: 0
    };
  }

  const [couponRows] = await connection.query(
    `
      SELECT *
      FROM cupons
      WHERE UPPER(codigo) = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [couponCode]
  );

  const coupon = couponRows[0];

  if (!coupon || !coupon.ativo) {
    throw Object.assign(new Error("Cupom invalido ou inativo."), {
      code: "INVALID_COUPON",
      statusCode: 422
    });
  }

  const now = new Date();

  if (coupon.validade_inicio && new Date(coupon.validade_inicio) > now) {
    throw Object.assign(new Error("Cupom ainda nao esta vigente."), {
      code: "COUPON_NOT_STARTED",
      statusCode: 422
    });
  }

  if (coupon.validade_fim && new Date(coupon.validade_fim) < now) {
    throw Object.assign(new Error("Cupom expirado."), {
      code: "COUPON_EXPIRED",
      statusCode: 422
    });
  }

  const eligibleItems = coupon.categoria_id
    ? payload.items.filter((item) => Number(item.categoria_id) === Number(coupon.categoria_id))
    : payload.items;

  if (!eligibleItems.length) {
    throw Object.assign(new Error("Cupom nao elegivel para os itens do carrinho."), {
      code: "COUPON_NOT_ELIGIBLE",
      statusCode: 422
    });
  }

  const eligibleSubtotal = eligibleItems.reduce(
    (sum, item) => sum + Number(item.preco_unitario) * Number(item.quantidade),
    0
  );

  if (eligibleSubtotal < Number(coupon.valor_minimo ?? 0)) {
    throw Object.assign(new Error("Cupom exige valor minimo maior para aplicacao."), {
      code: "COUPON_MINIMUM_NOT_REACHED",
      statusCode: 422
    });
  }

  const [[usageSummary]] = await connection.query(
    `
      SELECT COUNT(*) AS total_usage
      FROM cupom_usos
      WHERE cupom_id = ?
    `,
    [coupon.id]
  );

  if (coupon.limite_total_uso && Number(usageSummary.total_usage) >= Number(coupon.limite_total_uso)) {
    throw Object.assign(new Error("Cupom atingiu o limite total de uso."), {
      code: "COUPON_USAGE_LIMIT_REACHED",
      statusCode: 422
    });
  }

  const [[customerUsage]] = await connection.query(
    `
      SELECT COUNT(*) AS customer_usage
      FROM cupom_usos
      WHERE cupom_id = ? AND cliente_id = ?
    `,
    [coupon.id, payload.customerId]
  );

  if (
    coupon.limite_por_cliente &&
    Number(customerUsage.customer_usage) >= Number(coupon.limite_por_cliente)
  ) {
    throw Object.assign(new Error("Cupom ja utilizado no limite permitido para este cliente."), {
      code: "COUPON_CUSTOMER_LIMIT_REACHED",
      statusCode: 422
    });
  }

  const couponDiscount =
    coupon.tipo === "percentual"
      ? Math.min((eligibleSubtotal * Number(coupon.percentual ?? 0)) / 100, eligibleSubtotal)
      : Math.min(Number(coupon.valor ?? 0), eligibleSubtotal);

  return {
    appliedCoupon: {
      id: coupon.id,
      code: coupon.codigo,
      type: coupon.tipo
    },
    couponDiscount
  };
}

function validateCheckoutItems(itemRows) {
  let subtotal = 0;

  for (const item of itemRows) {
    if (item.produto_status === "inativo" || item.produto_status === "rascunho") {
      throw Object.assign(new Error("Produto indisponivel no checkout."), {
        code: "PRODUCT_UNAVAILABLE",
        statusCode: 422
      });
    }

    if (Number(item.saldo ?? 0) < item.quantidade) {
      throw Object.assign(new Error("Estoque insuficiente para concluir o checkout."), {
        code: "INSUFFICIENT_STOCK",
        statusCode: 422
      });
    }

    subtotal += Number(item.preco_unitario) * Number(item.quantidade);
  }

  return subtotal;
}

export async function previewCheckoutTotals(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cart = await getActiveCart(connection, payload.sessionToken);

    if (!cart) {
      throw Object.assign(new Error("Carrinho nao encontrado."), {
        code: "CART_NOT_FOUND",
        statusCode: 404
      });
    }

    const itemRows = await getCartItemsForCheckout(connection, cart.id);

    if (!itemRows.length) {
      throw Object.assign(new Error("Carrinho vazio."), {
        code: "EMPTY_CART",
        statusCode: 422
      });
    }

    const subtotal = validateCheckoutItems(itemRows);
    const { appliedCoupon, couponDiscount } = await resolveCoupon(connection, {
      customerId: payload.customerId,
      couponCode: payload.couponCode,
      items: itemRows
    });
    const pixDiscount =
      payload.paymentMethod === "pix" ? Math.min((subtotal - couponDiscount) * 0.05, subtotal) : 0;
    const shipping = Number(payload.shippingPrice ?? 0);
    const total = Math.max(subtotal - couponDiscount - pixDiscount + shipping, 0);

    await connection.rollback();

    return {
      subtotal,
      couponDiscount,
      pixDiscount,
      shipping,
      total,
      appliedCoupon
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function checkoutCart(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cart = await getActiveCart(connection, payload.sessionToken);

    if (!cart) {
      throw Object.assign(new Error("Carrinho nao encontrado."), {
        code: "CART_NOT_FOUND",
        statusCode: 404
      });
    }

    const itemRows = await getCartItemsForCheckout(connection, cart.id);

    if (!itemRows.length) {
      throw Object.assign(new Error("Carrinho vazio."), {
        code: "EMPTY_CART",
        statusCode: 422
      });
    }

    const subtotal = validateCheckoutItems(itemRows);

    let addressId = payload.addressId ?? null;

    if (!addressId && payload.address) {
      const [addressResult] = await connection.query(
        `
          INSERT INTO enderecos (
            cliente_id, apelido, destinatario, cep, logradouro, numero, complemento,
            bairro, cidade, estado, referencia, principal_entrega, principal_cobranca
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
        `,
        [
          payload.customerId,
          payload.address.alias ?? null,
          payload.address.recipient,
          payload.address.zipCode,
          payload.address.street,
          payload.address.number,
          payload.address.complement ?? null,
          payload.address.district,
          payload.address.city,
          payload.address.state,
          payload.address.reference ?? null
        ]
      );

      addressId = addressResult.insertId;
    }

    const { appliedCoupon, couponDiscount } = await resolveCoupon(connection, {
      customerId: payload.customerId,
      couponCode: payload.couponCode,
      items: itemRows
    });
    const pixDiscount =
      payload.paymentMethod === "pix" ? Math.min((subtotal - couponDiscount) * 0.05, subtotal) : 0;
    const discount = couponDiscount + pixDiscount;
    const shipping = Number(payload.shippingPrice ?? 0);
    const total = Math.max(subtotal - discount + shipping, 0);
    const orderCode = createOrderCode();

    const [orderResult] = await connection.query(
      `
        INSERT INTO pedidos (
          cliente_id, endereco_entrega_id, endereco_cobranca_id, cupom_id, codigo, status,
          subtotal, desconto, frete, total, observacoes
        )
        VALUES (?, ?, ?, ?, ?, 'pagamento_aprovado', ?, ?, ?, ?, ?)
      `,
      [
        payload.customerId,
        addressId,
        addressId,
        appliedCoupon?.id ?? null,
        orderCode,
        subtotal,
        discount,
        shipping,
        total,
        payload.notes ?? null
      ]
    );

    for (const item of itemRows) {
      const itemSubtotal = Number(item.preco_unitario) * Number(item.quantidade);

      await connection.query(
        `
          INSERT INTO itens_pedido (
            pedido_id, produto_id, produto_variacao_id, sku, nome_produto,
            quantidade, preco_unitario, subtotal
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderResult.insertId,
          item.produto_id,
          item.produto_variacao_id ?? null,
          item.sku,
          item.nome,
          item.quantidade,
          item.preco_unitario,
          itemSubtotal
        ]
      );

      const previousBalance = Number(item.saldo ?? 0);
      const nextBalance = previousBalance - Number(item.quantidade);

      await connection.query(
        `
          UPDATE estoques
          SET saldo = ?, reservado = GREATEST(reservado - ?, 0)
          WHERE id = ?
        `,
        [nextBalance, item.quantidade, item.estoque_id]
      );

      await connection.query(
        `
          INSERT INTO movimentacoes_estoque (
            estoque_id, tipo, quantidade, saldo_anterior, saldo_posterior, origem_tipo, origem_id, observacao
          )
          VALUES (?, 'saida', ?, ?, ?, 'pedido', ?, 'Baixa de estoque por checkout aprovado')
        `,
        [item.estoque_id, item.quantidade, previousBalance, nextBalance, orderResult.insertId]
      );
    }

    await connection.query(
      `
        INSERT INTO pagamentos (
          pedido_id, metodo, status, valor, desconto_pix, parcelas, referencia_externa
        )
        VALUES (?, ?, 'aprovado', ?, ?, ?, ?)
      `,
      [
        orderResult.insertId,
        payload.paymentMethod,
        total,
        pixDiscount,
        payload.installments ?? null,
        `SIM-${orderCode}`
      ]
    );

    await connection.query(
      `
        INSERT INTO entregas (
          pedido_id, metodo, transportadora, codigo_rastreio, status, frete, prazo_estimado_dias
        )
        VALUES (?, ?, ?, ?, 'pendente', ?, ?)
      `,
      [
        orderResult.insertId,
        payload.shippingMethod,
        payload.shippingCarrier ?? "ShopMax Express",
        null,
        shipping,
        payload.shippingEtaDays ?? 5
      ]
    );

    if (appliedCoupon?.id) {
      await connection.query(
        `
          INSERT INTO cupom_usos (cupom_id, pedido_id, cliente_id)
          VALUES (?, ?, ?)
        `,
        [appliedCoupon.id, orderResult.insertId, payload.customerId]
      );
    }

    await connection.query(
      `
        UPDATE carrinhos
        SET status = 'convertido'
        WHERE id = ?
      `,
      [cart.id]
    );

    await connection.query("DELETE FROM itens_carrinho WHERE carrinho_id = ?", [cart.id]);

    await connection.commit();

    return {
      orderId: orderResult.insertId,
      orderCode
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
