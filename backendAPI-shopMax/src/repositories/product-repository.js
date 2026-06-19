import { getPool } from "../../connection.js";

export async function listProducts(filters = {}) {
  const clauses = ["produtos.deleted_at IS NULL", "produtos.status IN ('ativo', 'estoque_baixo', 'sem_estoque')"];
  const values = [];

  if (filters.query) {
    clauses.push("(produtos.nome LIKE ? OR produtos.sku LIKE ?)");
    values.push(`%${filters.query}%`, `%${filters.query}%`);
  }

  if (filters.categorySlug) {
    clauses.push("categorias.slug = ?");
    values.push(filters.categorySlug);
  }

  if (filters.brandSlug) {
    clauses.push("marcas.slug = ?");
    values.push(filters.brandSlug);
  }

  if (filters.inStock) {
    clauses.push("COALESCE(estoques.saldo, 0) > 0");
  }

  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    clauses.push("COALESCE(produtos.preco_promocional, produtos.preco) >= ?");
    values.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    clauses.push("COALESCE(produtos.preco_promocional, produtos.preco) <= ?");
    values.push(filters.maxPrice);
  }

  const sortMap = {
    newest: "produtos.created_at DESC",
    price_asc: "COALESCE(produtos.preco_promocional, produtos.preco) ASC",
    price_desc: "COALESCE(produtos.preco_promocional, produtos.preco) DESC",
    name_asc: "produtos.nome ASC"
  };
  const orderBy = sortMap[filters.sort] ?? "produtos.created_at DESC";

  const [rows] = await getPool().query(
    `
      SELECT
        produtos.*,
        marcas.slug AS brand_slug,
        marcas.nome AS brand_name,
        categorias.slug AS category_slug,
        produto_imagens.url AS main_image_url,
        estoques.saldo AS stock_balance
      FROM produtos
      INNER JOIN categorias ON categorias.id = produtos.categoria_id
      INNER JOIN marcas ON marcas.id = produtos.marca_id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
      WHERE ${clauses.join(" AND ")}
      ORDER BY ${orderBy}
    `,
    values
  );

  return rows;
}

export async function findProductBySlug(slug) {
  const [rows] = await getPool().query(
    `
      SELECT
        produtos.*,
        categorias.nome AS category_name,
        categorias.slug AS category_slug,
        marcas.nome AS brand_name,
        marcas.slug AS brand_slug,
        produto_imagens.url AS main_image_url,
        estoques.saldo AS stock_balance
      FROM produtos
      INNER JOIN categorias ON categorias.id = produtos.categoria_id
      INNER JOIN marcas ON marcas.id = produtos.marca_id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
      WHERE produtos.slug = ? AND produtos.deleted_at IS NULL
      LIMIT 1
    `,
    [slug]
  );

  return rows[0] ?? null;
}

export async function createProduct(payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
        INSERT INTO produtos (
          categoria_id, marca_id, nome, slug, sku, preco, preco_promocional,
          descricao_curta, descricao_completa, ficha_tecnica, status,
          peso, altura, largura, comprimento, garantia_meses
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.categoryId,
        payload.brandId,
        payload.name,
        payload.slug,
        payload.sku,
        payload.price,
        payload.promotionalPrice ?? null,
        payload.shortDescription ?? null,
        payload.description ?? null,
        payload.technicalSheet ? JSON.stringify(payload.technicalSheet) : null,
        payload.status ?? "rascunho",
        payload.weight ?? null,
        payload.height ?? null,
        payload.width ?? null,
        payload.length ?? null,
        payload.warrantyMonths ?? null
      ]
    );

    await connection.query(
      `
        INSERT INTO estoques (produto_id, saldo, reservado, estoque_minimo)
        VALUES (?, ?, 0, ?)
      `,
      [result.insertId, payload.stockInitial, payload.stockMinimum ?? 0]
    );

    await connection.query(
      `
        INSERT INTO movimentacoes_estoque (
          estoque_id, tipo, quantidade, saldo_anterior, saldo_posterior, origem_tipo, observacao
        )
        SELECT id, 'entrada', ?, 0, ?, 'produto', 'Carga inicial do produto'
        FROM estoques
        WHERE produto_id = ?
      `,
      [payload.stockInitial, payload.stockInitial, result.insertId]
    );

    if (payload.images?.length) {
      for (const [index, image] of payload.images.entries()) {
        await connection.query(
          `
            INSERT INTO produto_imagens (produto_id, url, alt_text, principal, ordem)
            VALUES (?, ?, ?, ?, ?)
          `,
          [result.insertId, image.url, image.altText ?? payload.name, image.main ? 1 : 0, index + 1]
        );
      }
    }

    if (payload.videos?.length) {
      for (const [index, video] of payload.videos.entries()) {
        await connection.query(
          `
            INSERT INTO produto_videos (produto_id, url, titulo, ordem)
            VALUES (?, ?, ?, ?)
          `,
          [result.insertId, video.url, video.title ?? payload.name, index + 1]
        );
      }
    }

    await connection.commit();

    const [rows] = await connection.query(
      `
        SELECT
          produtos.*,
          marcas.nome AS brand_name,
          marcas.slug AS brand_slug,
          categorias.nome AS category_name,
          categorias.slug AS category_slug,
          produto_imagens.url AS main_image_url,
          estoques.saldo AS stock_balance
        FROM produtos
        INNER JOIN marcas ON marcas.id = produtos.marca_id
        INNER JOIN categorias ON categorias.id = produtos.categoria_id
        LEFT JOIN produto_imagens ON produto_imagens.produto_id = produtos.id AND produto_imagens.principal = 1
        LEFT JOIN estoques ON estoques.produto_id = produtos.id
        WHERE produtos.id = ?
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

export async function findProductById(productId) {
  const [rows] = await getPool().query(
    `
      SELECT
        produtos.*,
        categorias.nome AS category_name,
        categorias.slug AS category_slug,
        marcas.nome AS brand_name,
        marcas.slug AS brand_slug,
        produto_imagens.url AS main_image_url,
        estoques.saldo AS stock_balance
      FROM produtos
      INNER JOIN categorias ON categorias.id = produtos.categoria_id
      INNER JOIN marcas ON marcas.id = produtos.marca_id
      LEFT JOIN produto_imagens
        ON produto_imagens.produto_id = produtos.id
       AND produto_imagens.principal = 1
       AND produto_imagens.deleted_at IS NULL
      LEFT JOIN estoques ON estoques.produto_id = produtos.id
      WHERE produtos.id = ? AND produtos.deleted_at IS NULL
      LIMIT 1
    `,
    [productId]
  );

  return rows[0] ?? null;
}

export async function listProductImages(productId) {
  const [rows] = await getPool().query(
    `
      SELECT id, produto_id, url, alt_text, principal, ordem
      FROM produto_imagens
      WHERE produto_id = ? AND deleted_at IS NULL
      ORDER BY principal DESC, ordem ASC, id ASC
    `,
    [productId]
  );

  return rows;
}

export async function listProductVideos(productId) {
  const [rows] = await getPool().query(
    `
      SELECT id, produto_id, url, titulo, ordem
      FROM produto_videos
      WHERE produto_id = ? AND deleted_at IS NULL
      ORDER BY ordem ASC, id ASC
    `,
    [productId]
  );

  return rows;
}

export async function addProductMedia(productId, payload) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (payload.images?.length) {
      const [countRows] = await connection.query(
        "SELECT COUNT(*) AS total FROM produto_imagens WHERE produto_id = ? AND deleted_at IS NULL",
        [productId]
      );
      let nextOrder = Number(countRows[0].total);

      for (const image of payload.images) {
        nextOrder += 1;
        await connection.query(
          `
            INSERT INTO produto_imagens (produto_id, url, alt_text, principal, ordem)
            VALUES (?, ?, ?, ?, ?)
          `,
          [productId, image.url, image.altText ?? null, image.main ? 1 : 0, nextOrder]
        );
      }
    }

    if (payload.videos?.length) {
      const [countRows] = await connection.query(
        "SELECT COUNT(*) AS total FROM produto_videos WHERE produto_id = ? AND deleted_at IS NULL",
        [productId]
      );
      let nextOrder = Number(countRows[0].total);

      for (const video of payload.videos) {
        nextOrder += 1;
        await connection.query(
          `
            INSERT INTO produto_videos (produto_id, url, titulo, ordem)
            VALUES (?, ?, ?, ?)
          `,
          [productId, video.url, video.title ?? null, nextOrder]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function setMainProductImage(productId, imageId) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE produto_imagens SET principal = 0 WHERE produto_id = ? AND deleted_at IS NULL",
      [productId]
    );

    const [result] = await connection.query(
      `
        UPDATE produto_imagens
        SET principal = 1
        WHERE id = ? AND produto_id = ? AND deleted_at IS NULL
      `,
      [imageId, productId]
    );

    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findProductImage(productId, imageId) {
  const [rows] = await getPool().query(
    `
      SELECT id, produto_id, url, alt_text, principal, ordem
      FROM produto_imagens
      WHERE id = ? AND produto_id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [imageId, productId]
  );

  return rows[0] ?? null;
}

export async function findProductVideo(productId, videoId) {
  const [rows] = await getPool().query(
    `
      SELECT id, produto_id, url, titulo, ordem
      FROM produto_videos
      WHERE id = ? AND produto_id = ? AND deleted_at IS NULL
      LIMIT 1
    `,
    [videoId, productId]
  );

  return rows[0] ?? null;
}

export async function softDeleteProductImage(productId, imageId) {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [imageRows] = await connection.query(
      `
        SELECT id, principal
        FROM produto_imagens
        WHERE id = ? AND produto_id = ? AND deleted_at IS NULL
        LIMIT 1
        FOR UPDATE
      `,
      [imageId, productId]
    );

    const image = imageRows[0] ?? null;

    if (!image) {
      await connection.rollback();
      return false;
    }

    await connection.query("UPDATE produto_imagens SET deleted_at = NOW(), principal = 0 WHERE id = ?", [imageId]);

    if (image.principal) {
      const [nextRows] = await connection.query(
        `
          SELECT id
          FROM produto_imagens
          WHERE produto_id = ? AND deleted_at IS NULL
          ORDER BY ordem ASC, id ASC
          LIMIT 1
          FOR UPDATE
        `,
        [productId]
      );

      if (nextRows[0]) {
        await connection.query("UPDATE produto_imagens SET principal = 1 WHERE id = ?", [nextRows[0].id]);
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function softDeleteProductVideo(productId, videoId) {
  const [result] = await getPool().query(
    `
      UPDATE produto_videos
      SET deleted_at = NOW()
      WHERE id = ? AND produto_id = ? AND deleted_at IS NULL
    `,
    [videoId, productId]
  );

  return result.affectedRows > 0;
}
