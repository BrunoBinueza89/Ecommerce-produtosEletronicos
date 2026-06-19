export function serializeOrder(row) {
  return {
    id: row.id,
    customerId: row.cliente_id,
    code: row.codigo,
    status: row.status,
    subtotal: Number(row.subtotal),
    discount: Number(row.desconto),
    shipping: Number(row.frete),
    total: Number(row.total),
    createdAt: row.created_at,
    payment: row.payment_status
      ? {
          method: row.payment_method,
          status: row.payment_status,
          installments: row.payment_installments,
          value: Number(row.payment_value)
        }
      : null,
    shipment: row.delivery_status
      ? {
          status: row.delivery_status,
          trackingCode: row.delivery_tracking_code,
          shippingMethod: row.delivery_method
        }
      : null
  };
}

export function serializeOrderItem(row) {
  return {
    id: row.id,
    productId: row.produto_id,
    productVariationId: row.produto_variacao_id,
    sku: row.sku,
    productName: row.nome_produto,
    quantity: row.quantidade,
    unitPrice: Number(row.preco_unitario),
    subtotal: Number(row.subtotal)
  };
}
