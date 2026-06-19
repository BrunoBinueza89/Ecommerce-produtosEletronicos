export async function up(connection) {
  await connection.query(`
    INSERT INTO categorias (nome, slug, descricao, ordem_exibicao, status)
    VALUES
      ('Monitores', 'monitores', 'Monitores gamers e profissionais', 3, 'ativo'),
      ('Consoles', 'consoles', 'Videogames e acessorios', 4, 'ativo')
    ON DUPLICATE KEY UPDATE descricao = VALUES(descricao), ordem_exibicao = VALUES(ordem_exibicao), status = VALUES(status);

    INSERT INTO marcas (nome, slug, logo_url, status)
    VALUES
      ('Dell', 'dell', 'https://cdn.shopmax.local/marcas/dell.png', 'ativo'),
      ('Sony', 'sony', 'https://cdn.shopmax.local/marcas/sony.png', 'ativo')
    ON DUPLICATE KEY UPDATE logo_url = VALUES(logo_url), status = VALUES(status);
  `);
}
