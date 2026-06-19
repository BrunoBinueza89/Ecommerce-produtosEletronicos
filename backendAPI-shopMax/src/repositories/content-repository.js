import { getPool } from "../../connection.js";

export async function listActiveBanners(position = null) {
  const values = [];
  const clauses = ["status = 'ativo'", "deleted_at IS NULL"];

  if (position) {
    clauses.push("posicao = ?");
    values.push(position);
  }

  const [rows] = await getPool().query(
    `
      SELECT *
      FROM banners
      WHERE ${clauses.join(" AND ")}
      ORDER BY ordem ASC, created_at DESC
    `,
    values
  );

  return rows;
}

export async function listBannersAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT *
      FROM banners
      WHERE deleted_at IS NULL
      ORDER BY ordem ASC, created_at DESC
    `
  );

  return rows;
}

export async function createBanner(payload) {
  const [result] = await getPool().query(
    `
      INSERT INTO banners (titulo, posicao, imagem_url, link_url, status, ordem)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      payload.title,
      payload.position,
      payload.imageUrl,
      payload.linkUrl ?? null,
      payload.status ?? "ativo",
      payload.order ?? 0
    ]
  );

  const [rows] = await getPool().query("SELECT * FROM banners WHERE id = ?", [result.insertId]);
  return rows[0];
}

export async function listActivePromotions() {
  const [rows] = await getPool().query(
    `
      SELECT promocoes.*, promocao_itens.produto_id, promocao_itens.categoria_id
      FROM promocoes
      LEFT JOIN promocao_itens ON promocao_itens.promocao_id = promocoes.id
      WHERE promocoes.status = 'ativa'
        AND promocoes.deleted_at IS NULL
        AND (promocoes.inicio IS NULL OR promocoes.inicio <= NOW())
        AND (promocoes.fim IS NULL OR promocoes.fim >= NOW())
      ORDER BY promocoes.created_at DESC
    `
  );

  return rows;
}

export async function listPromotionsAdmin() {
  const [rows] = await getPool().query(
    `
      SELECT promocoes.*, promocao_itens.produto_id, promocao_itens.categoria_id
      FROM promocoes
      LEFT JOIN promocao_itens ON promocao_itens.promocao_id = promocoes.id
      WHERE promocoes.deleted_at IS NULL
      ORDER BY promocoes.created_at DESC
    `
  );

  return rows;
}

export async function createPromotion(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
        INSERT INTO promocoes (nome, slug, tipo, valor, percentual, inicio, fim, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.name,
        payload.slug,
        payload.type,
        payload.value ?? null,
        payload.percentage ?? null,
        payload.startsAt ?? null,
        payload.endsAt ?? null,
        payload.status ?? "ativa"
      ]
    );

    await connection.query(
      `
        INSERT INTO promocao_itens (promocao_id, produto_id, categoria_id)
        VALUES (?, ?, ?)
      `,
      [result.insertId, payload.productId ?? null, payload.categoryId ?? null]
    );

    await connection.commit();

    const [rows] = await connection.query(
      `
        SELECT promocoes.*, promocao_itens.produto_id, promocao_itens.categoria_id
        FROM promocoes
        LEFT JOIN promocao_itens ON promocao_itens.promocao_id = promocoes.id
        WHERE promocoes.id = ?
        LIMIT 1
      `,
      [result.insertId]
    );

    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listApplicablePromotions(productIds = [], categoryIds = []) {
  if (!productIds.length && !categoryIds.length) {
    return [];
  }

  const productPlaceholders = productIds.length ? productIds.map(() => "?").join(",") : "NULL";
  const categoryPlaceholders = categoryIds.length ? categoryIds.map(() => "?").join(",") : "NULL";
  const values = [...productIds, ...categoryIds];

  const [rows] = await getPool().query(
    `
      SELECT promocoes.*, promocao_itens.produto_id, promocao_itens.categoria_id
      FROM promocoes
      INNER JOIN promocao_itens ON promocao_itens.promocao_id = promocoes.id
      WHERE promocoes.status = 'ativa'
        AND promocoes.deleted_at IS NULL
        AND (promocoes.inicio IS NULL OR promocoes.inicio <= NOW())
        AND (promocoes.fim IS NULL OR promocoes.fim >= NOW())
        AND (
          promocao_itens.produto_id IN (${productPlaceholders})
          OR promocao_itens.categoria_id IN (${categoryPlaceholders})
        )
    `,
    values
  );

  return rows;
}
