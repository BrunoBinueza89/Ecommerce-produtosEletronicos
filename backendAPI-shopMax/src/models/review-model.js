export function serializeReview(row) {
  return {
    id: row.id,
    customerId: row.cliente_id,
    productId: row.produto_id,
    orderId: row.pedido_id,
    rating: Number(row.nota),
    title: row.titulo,
    comment: row.comentario,
    status: row.status,
    customerName: row.cliente_nome ?? null,
    createdAt: row.created_at
  };
}
