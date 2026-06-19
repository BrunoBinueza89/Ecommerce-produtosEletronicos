export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS perfis (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      slug VARCHAR(120) NOT NULL UNIQUE,
      descricao TEXT NULL,
      ativo TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS permissoes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      modulo VARCHAR(120) NOT NULL,
      acao VARCHAR(120) NOT NULL,
      chave VARCHAR(191) NOT NULL UNIQUE,
      descricao TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS usuarios (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      perfil_id BIGINT UNSIGNED NULL,
      tipo ENUM('admin', 'cliente') NOT NULL,
      nome VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      senha_hash VARCHAR(255) NOT NULL,
      ativo TINYINT(1) NOT NULL DEFAULT 1,
      ultimo_login_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_usuarios_perfil FOREIGN KEY (perfil_id) REFERENCES perfis(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS perfil_permissoes (
      perfil_id BIGINT UNSIGNED NOT NULL,
      permissao_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (perfil_id, permissao_id),
      CONSTRAINT fk_perfil_permissoes_perfil FOREIGN KEY (perfil_id) REFERENCES perfis(id) ON DELETE CASCADE,
      CONSTRAINT fk_perfil_permissoes_permissao FOREIGN KEY (permissao_id) REFERENCES permissoes(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS clientes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NOT NULL UNIQUE,
      nome VARCHAR(191) NOT NULL,
      cpf VARCHAR(14) NOT NULL UNIQUE,
      telefone VARCHAR(32) NOT NULL,
      ativo TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_clientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS enderecos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cliente_id BIGINT UNSIGNED NOT NULL,
      apelido VARCHAR(120) NULL,
      destinatario VARCHAR(191) NOT NULL,
      cep VARCHAR(16) NOT NULL,
      logradouro VARCHAR(191) NOT NULL,
      numero VARCHAR(32) NOT NULL,
      complemento VARCHAR(191) NULL,
      bairro VARCHAR(120) NOT NULL,
      cidade VARCHAR(120) NOT NULL,
      estado VARCHAR(120) NOT NULL,
      referencia TEXT NULL,
      principal_entrega TINYINT(1) NOT NULL DEFAULT 0,
      principal_cobranca TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_enderecos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      INDEX idx_enderecos_cliente (cliente_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS categorias (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      categoria_pai_id BIGINT UNSIGNED NULL,
      nome VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      descricao TEXT NULL,
      imagem_url VARCHAR(255) NULL,
      banner_url VARCHAR(255) NULL,
      ordem_exibicao INT NOT NULL DEFAULT 0,
      status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_categorias_pai FOREIGN KEY (categoria_pai_id) REFERENCES categorias(id) ON DELETE SET NULL,
      INDEX idx_categorias_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS marcas (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      logo_url VARCHAR(255) NULL,
      status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      INDEX idx_marcas_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS produtos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      categoria_id BIGINT UNSIGNED NOT NULL,
      marca_id BIGINT UNSIGNED NOT NULL,
      nome VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      sku VARCHAR(120) NOT NULL UNIQUE,
      preco DECIMAL(12, 2) NOT NULL,
      preco_promocional DECIMAL(12, 2) NULL,
      descricao_curta TEXT NULL,
      descricao_completa LONGTEXT NULL,
      ficha_tecnica JSON NULL,
      status ENUM('ativo', 'inativo', 'sem_estoque', 'estoque_baixo', 'rascunho') NOT NULL DEFAULT 'rascunho',
      peso DECIMAL(10, 3) NULL,
      altura DECIMAL(10, 2) NULL,
      largura DECIMAL(10, 2) NULL,
      comprimento DECIMAL(10, 2) NULL,
      garantia_meses INT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
      CONSTRAINT fk_produtos_marca FOREIGN KEY (marca_id) REFERENCES marcas(id),
      INDEX idx_produtos_categoria (categoria_id),
      INDEX idx_produtos_marca (marca_id),
      INDEX idx_produtos_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS produto_imagens (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      produto_id BIGINT UNSIGNED NOT NULL,
      url VARCHAR(255) NOT NULL,
      alt_text VARCHAR(191) NULL,
      principal TINYINT(1) NOT NULL DEFAULT 0,
      ordem INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_produto_imagens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      INDEX idx_produto_imagens_produto (produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS produto_videos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      produto_id BIGINT UNSIGNED NOT NULL,
      url VARCHAR(255) NOT NULL,
      titulo VARCHAR(191) NULL,
      ordem INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_produto_videos_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      INDEX idx_produto_videos_produto (produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS produto_variacoes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      produto_id BIGINT UNSIGNED NOT NULL,
      nome VARCHAR(191) NOT NULL,
      sku VARCHAR(120) NOT NULL UNIQUE,
      atributos JSON NULL,
      preco DECIMAL(12, 2) NULL,
      preco_promocional DECIMAL(12, 2) NULL,
      status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_produto_variacoes_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      INDEX idx_produto_variacoes_produto (produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS estoques (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      produto_id BIGINT UNSIGNED NULL UNIQUE,
      produto_variacao_id BIGINT UNSIGNED NULL UNIQUE,
      saldo INT NOT NULL DEFAULT 0,
      reservado INT NOT NULL DEFAULT 0,
      estoque_minimo INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_estoques_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      CONSTRAINT fk_estoques_variacao FOREIGN KEY (produto_variacao_id) REFERENCES produto_variacoes(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      estoque_id BIGINT UNSIGNED NOT NULL,
      tipo ENUM('entrada', 'saida', 'ajuste', 'reserva', 'estorno') NOT NULL,
      quantidade INT NOT NULL,
      saldo_anterior INT NOT NULL,
      saldo_posterior INT NOT NULL,
      origem_tipo VARCHAR(120) NULL,
      origem_id BIGINT UNSIGNED NULL,
      observacao TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_movimentacoes_estoque FOREIGN KEY (estoque_id) REFERENCES estoques(id) ON DELETE CASCADE,
      INDEX idx_movimentacoes_estoque (estoque_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS cupons (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(120) NOT NULL UNIQUE,
      tipo ENUM('valor_fixo', 'percentual') NOT NULL,
      valor DECIMAL(12, 2) NULL,
      percentual DECIMAL(5, 2) NULL,
      validade_inicio DATETIME NULL,
      validade_fim DATETIME NULL,
      valor_minimo DECIMAL(12, 2) NOT NULL DEFAULT 0,
      limite_total_uso INT NULL,
      limite_por_cliente INT NULL,
      categoria_id BIGINT UNSIGNED NULL,
      ativo TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      CONSTRAINT fk_cupons_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS carrinhos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cliente_id BIGINT UNSIGNED NULL,
      session_token VARCHAR(191) NULL UNIQUE,
      cupom_id BIGINT UNSIGNED NULL,
      status ENUM('ativo', 'abandonado', 'convertido') NOT NULL DEFAULT 'ativo',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_carrinhos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      CONSTRAINT fk_carrinhos_cupom FOREIGN KEY (cupom_id) REFERENCES cupons(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS itens_carrinho (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      carrinho_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,
      produto_variacao_id BIGINT UNSIGNED NULL,
      quantidade INT NOT NULL,
      preco_unitario DECIMAL(12, 2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_itens_carrinho_carrinho FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id) ON DELETE CASCADE,
      CONSTRAINT fk_itens_carrinho_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
      CONSTRAINT fk_itens_carrinho_variacao FOREIGN KEY (produto_variacao_id) REFERENCES produto_variacoes(id) ON DELETE SET NULL,
      UNIQUE KEY uq_carrinho_item (carrinho_id, produto_id, produto_variacao_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS pedidos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cliente_id BIGINT UNSIGNED NOT NULL,
      endereco_entrega_id BIGINT UNSIGNED NULL,
      endereco_cobranca_id BIGINT UNSIGNED NULL,
      cupom_id BIGINT UNSIGNED NULL,
      codigo VARCHAR(120) NOT NULL UNIQUE,
      status ENUM('aguardando_pagamento', 'pagamento_aprovado', 'em_separacao', 'enviado', 'entregue', 'cancelado', 'reembolsado') NOT NULL DEFAULT 'aguardando_pagamento',
      subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
      desconto DECIMAL(12, 2) NOT NULL DEFAULT 0,
      frete DECIMAL(12, 2) NOT NULL DEFAULT 0,
      total DECIMAL(12, 2) NOT NULL DEFAULT 0,
      observacoes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      CONSTRAINT fk_pedidos_endereco_entrega FOREIGN KEY (endereco_entrega_id) REFERENCES enderecos(id) ON DELETE SET NULL,
      CONSTRAINT fk_pedidos_endereco_cobranca FOREIGN KEY (endereco_cobranca_id) REFERENCES enderecos(id) ON DELETE SET NULL,
      CONSTRAINT fk_pedidos_cupom FOREIGN KEY (cupom_id) REFERENCES cupons(id) ON DELETE SET NULL,
      INDEX idx_pedidos_status (status),
      INDEX idx_pedidos_cliente (cliente_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS itens_pedido (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      pedido_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,
      produto_variacao_id BIGINT UNSIGNED NULL,
      sku VARCHAR(120) NOT NULL,
      nome_produto VARCHAR(191) NOT NULL,
      quantidade INT NOT NULL,
      preco_unitario DECIMAL(12, 2) NOT NULL,
      subtotal DECIMAL(12, 2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_itens_pedido_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      CONSTRAINT fk_itens_pedido_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
      CONSTRAINT fk_itens_pedido_variacao FOREIGN KEY (produto_variacao_id) REFERENCES produto_variacoes(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS pagamentos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      pedido_id BIGINT UNSIGNED NOT NULL UNIQUE,
      metodo ENUM('pix', 'cartao', 'boleto') NOT NULL,
      status ENUM('pendente', 'aprovado', 'recusado', 'reembolsado') NOT NULL DEFAULT 'pendente',
      valor DECIMAL(12, 2) NOT NULL,
      desconto_pix DECIMAL(12, 2) NOT NULL DEFAULT 0,
      parcelas INT NULL,
      referencia_externa VARCHAR(191) NULL,
      vencimento DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_pagamentos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS entregas (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      pedido_id BIGINT UNSIGNED NOT NULL UNIQUE,
      metodo VARCHAR(120) NULL,
      transportadora VARCHAR(191) NULL,
      codigo_rastreio VARCHAR(191) NULL,
      status ENUM('pendente', 'separando', 'enviado', 'entregue', 'devolvido') NOT NULL DEFAULT 'pendente',
      frete DECIMAL(12, 2) NOT NULL DEFAULT 0,
      prazo_estimado_dias INT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_entregas_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS cupom_usos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cupom_id BIGINT UNSIGNED NOT NULL,
      pedido_id BIGINT UNSIGNED NOT NULL UNIQUE,
      cliente_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_cupom_usos_cupom FOREIGN KEY (cupom_id) REFERENCES cupons(id),
      CONSTRAINT fk_cupom_usos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      CONSTRAINT fk_cupom_usos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      UNIQUE KEY uq_cupom_uso_cliente_pedido (cupom_id, cliente_id, pedido_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS favoritos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cliente_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_favoritos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      CONSTRAINT fk_favoritos_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      UNIQUE KEY uq_favoritos_cliente_produto (cliente_id, produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS avaliacoes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cliente_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,
      pedido_id BIGINT UNSIGNED NULL,
      nota INT NOT NULL,
      titulo VARCHAR(191) NULL,
      comentario TEXT NULL,
      status ENUM('pendente', 'publicada', 'oculta') NOT NULL DEFAULT 'pendente',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_avaliacoes_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      CONSTRAINT fk_avaliacoes_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
      CONSTRAINT fk_avaliacoes_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
      UNIQUE KEY uq_avaliacao_cliente_produto (cliente_id, produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS banners (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(191) NOT NULL,
      posicao VARCHAR(120) NOT NULL,
      imagem_url VARCHAR(255) NOT NULL,
      link_url VARCHAR(255) NULL,
      status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
      ordem INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS promocoes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      tipo ENUM('produto', 'categoria', 'frete_gratis', 'campanha') NOT NULL,
      valor DECIMAL(12, 2) NULL,
      percentual DECIMAL(5, 2) NULL,
      inicio DATETIME NULL,
      fim DATETIME NULL,
      status ENUM('ativa', 'inativa') NOT NULL DEFAULT 'ativa',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS promocao_itens (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      promocao_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NULL,
      categoria_id BIGINT UNSIGNED NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_promocao_itens_promocao FOREIGN KEY (promocao_id) REFERENCES promocoes(id) ON DELETE CASCADE,
      CONSTRAINT fk_promocao_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      CONSTRAINT fk_promocao_itens_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
      UNIQUE KEY uq_promocao_item (promocao_id, produto_id, categoria_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS logs_sistema (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NULL,
      modulo VARCHAR(120) NOT NULL,
      entidade VARCHAR(120) NOT NULL,
      entidade_id BIGINT UNSIGNED NULL,
      acao VARCHAR(120) NOT NULL,
      ip VARCHAR(64) NULL,
      payload_json JSON NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_logs_sistema_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
      INDEX idx_logs_sistema_modulo (modulo, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}
