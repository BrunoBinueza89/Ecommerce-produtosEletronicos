export function serializeAddress(row) {
  return {
    id: row.id,
    customerId: row.cliente_id,
    alias: row.apelido,
    recipient: row.destinatario,
    zipCode: row.cep,
    street: row.logradouro,
    number: row.numero,
    complement: row.complemento,
    district: row.bairro,
    city: row.cidade,
    state: row.estado,
    reference: row.referencia,
    mainDelivery: Boolean(row.principal_entrega),
    mainBilling: Boolean(row.principal_cobranca)
  };
}
