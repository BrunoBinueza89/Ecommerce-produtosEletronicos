import { getPool } from "../../connection.js";

export async function findCustomerByUserId(userId) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM clientes
      WHERE usuario_id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] ?? null;
}

export async function listAddressesByCustomerId(customerId) {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM enderecos
      WHERE cliente_id = ? AND deleted_at IS NULL
      ORDER BY principal_entrega DESC, created_at ASC
    `,
    [customerId]
  );

  return rows;
}

export async function createAddress(customerId, payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO enderecos (
        cliente_id, apelido, destinatario, cep, logradouro, numero, complemento,
        bairro, cidade, estado, referencia, principal_entrega, principal_cobranca
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      customerId,
      payload.alias ?? null,
      payload.recipient,
      payload.zipCode,
      payload.street,
      payload.number,
      payload.complement ?? null,
      payload.district,
      payload.city,
      payload.state,
      payload.reference ?? null,
      payload.mainDelivery ? 1 : 0,
      payload.mainBilling ? 1 : 0
    ]
  );

  const [rows] = await getPool().query("SELECT * FROM enderecos WHERE id = ?", [result.insertId]);
  return rows[0];
}
