import { env } from "../src/config/env.js";
import { hashPassword } from "../src/services/password-service.js";

export async function up(connection) {
  await connection.query(`
    INSERT INTO perfis (nome, slug, descricao, ativo)
    VALUES
      ('Super Admin', 'super-admin', 'Acesso total ao sistema', 1),
      ('Admin', 'admin', 'Acesso operacional ao painel', 1)
    ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao), ativo = VALUES(ativo);

    INSERT INTO permissoes (modulo, acao, chave, descricao)
    VALUES
      ('users', 'read', 'users.read', 'Visualizar usuarios'),
      ('users', 'manage', 'users.manage', 'Gerenciar usuarios'),
      ('categories', 'read', 'categories.read', 'Visualizar categorias'),
      ('categories', 'write', 'categories.write', 'Gerenciar categorias'),
      ('brands', 'read', 'brands.read', 'Visualizar marcas'),
      ('brands', 'write', 'brands.write', 'Gerenciar marcas'),
      ('products', 'read', 'products.read', 'Visualizar produtos'),
      ('products', 'write', 'products.write', 'Gerenciar produtos'),
      ('stock', 'read', 'stock.read', 'Visualizar estoque'),
      ('stock', 'write', 'stock.write', 'Gerenciar estoque'),
      ('orders', 'read', 'orders.read', 'Visualizar pedidos'),
      ('orders', 'write', 'orders.write', 'Gerenciar pedidos'),
      ('customers', 'read', 'customers.read', 'Visualizar clientes'),
      ('coupons', 'read', 'coupons.read', 'Visualizar cupons'),
      ('coupons', 'write', 'coupons.write', 'Gerenciar cupons'),
      ('notifications', 'manage', 'notifications.manage', 'Gerenciar notificacoes'),
      ('reports', 'read', 'reports.read', 'Visualizar relatorios'),
      ('audit-logs', 'read', 'audit-logs.read', 'Visualizar logs de auditoria')
    ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);
  `);

  await connection.query(`
    INSERT IGNORE INTO perfil_permissoes (perfil_id, permissao_id)
    SELECT perfis.id, permissoes.id
    FROM perfis
    CROSS JOIN permissoes
    WHERE perfis.slug = 'super-admin';
  `);

  await connection.query(`
    INSERT IGNORE INTO perfil_permissoes (perfil_id, permissao_id)
    SELECT perfis.id, permissoes.id
    FROM perfis
    INNER JOIN permissoes ON permissoes.chave IN (
      'categories.read',
      'categories.write',
      'brands.read',
      'brands.write',
      'products.read',
      'products.write',
      'users.read',
      'stock.read',
      'stock.write',
      'orders.read',
      'orders.write',
      'customers.read',
      'coupons.read',
      'coupons.write',
      'notifications.manage',
      'reports.read',
      'audit-logs.read'
    )
    WHERE perfis.slug = 'admin';
  `);

  const [profiles] = await connection.query(
    "SELECT id FROM perfis WHERE slug = 'super-admin' LIMIT 1"
  );
  const profileId = profiles[0].id;
  const passwordHash = await hashPassword(env.DEFAULT_ADMIN_PASSWORD);

  await connection.query(
    `
      INSERT INTO usuarios (perfil_id, tipo, nome, email, senha_hash, ativo)
      VALUES (?, 'admin', ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        perfil_id = VALUES(perfil_id),
        nome = VALUES(nome),
        senha_hash = VALUES(senha_hash),
        ativo = VALUES(ativo)
    `,
    [profileId, env.DEFAULT_ADMIN_NAME, env.DEFAULT_ADMIN_EMAIL, passwordHash]
  );

  await connection.query(`
    INSERT INTO categorias (nome, slug, descricao, ordem_exibicao, status)
    VALUES
      ('Smartphones', 'smartphones', 'Linha de smartphones e dispositivos moveis', 1, 'ativo'),
      ('Perifericos', 'perifericos', 'Acessorios e perifericos para setup gamer e profissional', 2, 'ativo')
    ON DUPLICATE KEY UPDATE descricao = VALUES(descricao), ordem_exibicao = VALUES(ordem_exibicao), status = VALUES(status);

    INSERT INTO marcas (nome, slug, logo_url, status)
    VALUES
      ('HyperX', 'hyperx', 'https://cdn.shopmax.local/marcas/hyperx.png', 'ativo'),
      ('Samsung', 'samsung', 'https://cdn.shopmax.local/marcas/samsung.png', 'ativo')
    ON DUPLICATE KEY UPDATE logo_url = VALUES(logo_url), status = VALUES(status);
  `);

  const [[smartphonesCategory]] = await connection.query(
    "SELECT id FROM categorias WHERE slug = 'smartphones' LIMIT 1"
  );
  const [[hyperxBrand]] = await connection.query(
    "SELECT id FROM marcas WHERE slug = 'hyperx' LIMIT 1"
  );

  await connection.query(
    `
      INSERT INTO produtos (
        categoria_id, marca_id, nome, slug, sku, preco, preco_promocional,
        descricao_curta, descricao_completa, ficha_tecnica, status,
        peso, altura, largura, comprimento, garantia_meses
      )
      VALUES (?, ?, 'Headset Gamer Cloud Orbit S', 'headset-gamer-cloud-orbit-s', 'HYP-CLOUD-ORBIT-S',
        1299.90, 1199.90, 'Headset gamer premium com audio espacial.',
        'Headset gamer premium com drivers planares, audio imersivo e acabamento robusto.',
        JSON_OBJECT('conexao', 'USB-C', 'plataforma', 'PC/Console'),
        'ativo', 0.45, 21.0, 19.5, 11.0, 12)
      ON DUPLICATE KEY UPDATE
        categoria_id = VALUES(categoria_id),
        marca_id = VALUES(marca_id),
        preco = VALUES(preco),
        preco_promocional = VALUES(preco_promocional),
        descricao_curta = VALUES(descricao_curta),
        descricao_completa = VALUES(descricao_completa),
        ficha_tecnica = VALUES(ficha_tecnica),
        status = VALUES(status)
    `,
    [smartphonesCategory.id, hyperxBrand.id]
  );

  const [[product]] = await connection.query(
    "SELECT id FROM produtos WHERE sku = 'HYP-CLOUD-ORBIT-S' LIMIT 1"
  );

  await connection.query(
    `
      INSERT INTO produto_imagens (produto_id, url, alt_text, principal, ordem)
      VALUES (?, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoMkkYD5Z2K81EvQIrZrl3cESs5ZFTuN9cOA&s', 'Headset Gamer Cloud Orbit S', 1, 1)
      ON DUPLICATE KEY UPDATE url = VALUES(url), alt_text = VALUES(alt_text), principal = VALUES(principal), ordem = VALUES(ordem)
    `,
    [product.id]
  );

  await connection.query(
    `
      INSERT INTO estoques (produto_id, saldo, reservado, estoque_minimo)
      VALUES (?, 24, 0, 5)
      ON DUPLICATE KEY UPDATE saldo = VALUES(saldo), reservado = VALUES(reservado), estoque_minimo = VALUES(estoque_minimo)
    `,
    [product.id]
  );

  await connection.query(
    `
      INSERT INTO banners (titulo, posicao, imagem_url, link_url, status, ordem)
      SELECT
        'Semana Gamer ShopMax',
        'home-hero',
        'https://cdn.shopmax.local/banners/semana-gamer.png',
        '#/busca?q=gamer',
        'ativo',
        1
      WHERE NOT EXISTS (
        SELECT 1 FROM banners WHERE titulo = 'Semana Gamer ShopMax' AND posicao = 'home-hero'
      )
    `
  );

  await connection.query(
    `
      INSERT INTO promocoes (nome, slug, tipo, percentual, inicio, fim, status)
      VALUES (
        'Promo Headset de Entrada',
        'promo-headset-de-entrada',
        'produto',
        10,
        NOW() - INTERVAL 1 DAY,
        NOW() + INTERVAL 30 DAY,
        'ativa'
      )
      ON DUPLICATE KEY UPDATE
        percentual = VALUES(percentual),
        inicio = VALUES(inicio),
        fim = VALUES(fim),
        status = VALUES(status)
    `
  );

  const [[promotion]] = await connection.query(
    "SELECT id FROM promocoes WHERE slug = 'promo-headset-de-entrada' LIMIT 1"
  );

  await connection.query(
    `
      INSERT IGNORE INTO promocao_itens (promocao_id, produto_id, categoria_id)
      VALUES (?, ?, NULL)
    `,
    [promotion.id, product.id]
  );
}
