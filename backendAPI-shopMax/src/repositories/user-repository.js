import { getPool } from "../../connection.js";

export async function findUserByEmail(email) {
  const [rows] = await getPool().query(
    `
      SELECT
        usuarios.*,
        perfis.slug AS profile_slug,
        perfis.nome AS profile_name
      FROM usuarios
      LEFT JOIN perfis ON perfis.id = usuarios.perfil_id
      WHERE usuarios.email = ? AND usuarios.deleted_at IS NULL
      LIMIT 1
    `,
    [email]
  );

  return rows[0] ?? null;
}

export async function findUserById(id) {
  const [rows] = await getPool().query(
    `
      SELECT
        usuarios.*,
        perfis.slug AS profile_slug,
        perfis.nome AS profile_name
      FROM usuarios
      LEFT JOIN perfis ON perfis.id = usuarios.perfil_id
      WHERE usuarios.id = ? AND usuarios.deleted_at IS NULL
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function listUserPermissions(userId) {
  const [rows] = await getPool().query(
    `
      SELECT permissoes.chave
      FROM usuarios
      INNER JOIN perfis ON perfis.id = usuarios.perfil_id
      INNER JOIN perfil_permissoes ON perfil_permissoes.perfil_id = perfis.id
      INNER JOIN permissoes ON permissoes.id = perfil_permissoes.permissao_id
      WHERE usuarios.id = ?
    `,
    [userId]
  );

  return rows.map((row) => row.chave);
}

export async function updateLastLogin(id) {
  await getPool().query(
    "UPDATE usuarios SET ultimo_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );
}

export async function createCustomerAccount(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `
        INSERT INTO usuarios (perfil_id, tipo, nome, email, senha_hash, ativo)
        VALUES (NULL, 'cliente', ?, ?, ?, 1)
      `,
      [payload.name, payload.email, payload.passwordHash]
    );

    const [customerResult] = await connection.query(
      `
        INSERT INTO clientes (usuario_id, nome, cpf, telefone, ativo)
        VALUES (?, ?, ?, ?, 1)
      `,
      [userResult.insertId, payload.name, payload.cpf, payload.phone]
    );

    await connection.commit();

    return {
      userId: userResult.insertId,
      customerId: customerResult.insertId
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
