# Brainstorm — E-commerce de Tecnologia e Games

## 1. Visão geral

O projeto será um e-commerce moderno para venda de produtos de tecnologia, informática, hardware, periféricos, games, consoles, acessórios e eletrônicos.

O sistema será dividido em:

1. Loja virtual para o cliente final.
2. Painel administrativo para gestão interna.

O objetivo é permitir que o cliente encontre produtos rapidamente, compare opções, compre com segurança e acompanhe seus pedidos. Já o admin deve conseguir cadastrar produtos, gerenciar estoque, acompanhar vendas, controlar pedidos e analisar métricas do negócio.

---

# 2. Perfis de usuários

## Cliente visitante

Usuário que ainda não fez login.

Pode:

* Navegar pela loja.
* Buscar produtos.
* Ver categorias.
* Ver página de produto.
* Adicionar ao carrinho.
* Criar conta.
* Fazer login.

## Cliente cadastrado

Usuário com conta ativa.

Pode:

* Comprar produtos.
* Salvar favoritos.
* Gerenciar endereços.
* Ver histórico de pedidos.
* Acompanhar entrega.
* Avaliar produtos.
* Usar cupons.
* Receber recomendações.

## Admin

Usuário interno responsável pela gestão do e-commerce.

Pode:

* Gerenciar produtos.
* Gerenciar categorias.
* Gerenciar marcas.
* Gerenciar estoque.
* Gerenciar pedidos.
* Consultar vendas.
* Atualizar status de envio.
* Gerenciar clientes.
* Criar cupons.
* Ver relatórios.
* Gerenciar usuários administrativos.

---

# 3. Jornada do cliente

## Fluxo principal de compra

1. Cliente acessa a Home.
2. Pesquisa ou navega por categorias.
3. Entra na página de produto.
4. Escolhe variação, quantidade e forma de entrega.
5. Adiciona ao carrinho.
6. Vai para o checkout.
7. Escolhe endereço.
8. Escolhe frete.
9. Escolhe pagamento.
10. Revisa pedido.
11. Finaliza compra.
12. Recebe confirmação.
13. Acompanha status do pedido.
14. Recebe produto.
15. Avalia a compra.

---

# 4. Jornada administrativa

## Fluxo do admin

1. Primeiro admin é criado manualmente.
2. Admin faz login.
3. Acessa o dashboard.
4. Cadastra categorias, marcas e atributos.
5. Cadastra produtos com imagens, preço, estoque e descrição.
6. Publica produtos na loja.
7. Acompanha pedidos recebidos.
8. Atualiza status dos pedidos.
9. Consulta vendas e faturamento.
10. Analisa produtos mais vendidos.
11. Gerencia estoque.
12. Cria promoções e cupons.
13. Consulta relatórios.

---

# 5. Módulos do e-commerce

## Home

Objetivo: apresentar a loja e conduzir o usuário para produtos e ofertas.

Funcionalidades:

* Header com logo.
* Busca inteligente.
* Endereço de entrega.
* Login/minha conta.
* Carrinho.
* Menu de categorias.
* Banner principal.
* Banners secundários.
* Produtos em destaque.
* Mais vendidos.
* Ofertas relâmpago.
* Lançamentos.
* Recomendados.
* Benefícios da loja.
* Footer.

Dados necessários:

* Categorias.
* Produtos em destaque.
* Ofertas.
* Banners.
* Dados do usuário.
* Quantidade no carrinho.

---

## Login

Objetivo: permitir acesso à conta.

Funcionalidades:

* Login por e-mail e senha.
* Recuperar senha.
* Criar conta.
* Validação de campos.
* Mensagens de erro.

---

## Registro

Objetivo: criar conta de cliente.

Campos:

* Nome.
* E-mail.
* CPF.
* Telefone.
* Senha.
* Confirmação de senha.

---

## Página de categoria

Objetivo: listar produtos por categoria.

Funcionalidades:

* Filtros.
* Ordenação.
* Paginação.
* Cards de produtos.
* Banners da categoria.
* Filtro por preço, marca, avaliação, estoque e frete.

---

## Página de busca

Objetivo: exibir resultados da pesquisa.

Funcionalidades:

* Busca por nome.
* Busca por SKU.
* Busca por categoria.
* Sugestões.
* Correção de digitação.
* Filtros.
* Ordenação.

---

## Página de produto

Objetivo: apresentar detalhes completos do produto.

Funcionalidades:

* Galeria de imagens.
* Vídeo.
* Zoom.
* Nome.
* Marca.
* SKU.
* Avaliações.
* Preço.
* Preço promocional.
* Parcelamento.
* PIX.
* Cálculo de frete.
* Variações.
* Estoque.
* Comprar agora.
* Adicionar ao carrinho.
* Favoritar.
* Comparar.
* Descrição.
* Ficha técnica.
* Perguntas e respostas.
* Avaliações.
* Produtos relacionados.

---

## Carrinho

Objetivo: revisar produtos antes da compra.

Funcionalidades:

* Listagem de itens.
* Alterar quantidade.
* Remover produto.
* Salvar para depois.
* Aplicar cupom.
* Calcular frete.
* Resumo do pedido.
* Subtotal.
* Desconto.
* Frete.
* Total.
* Continuar para checkout.

---

## Checkout

Etapas:

1. Carrinho.
2. Endereço.
3. Frete.
4. Pagamento.
5. Revisão.
6. Confirmação.

Funcionalidades:

* Selecionar endereço.
* Adicionar novo endereço.
* Escolher frete.
* Escolher pagamento.
* Aplicar cupom.
* Revisar pedido.
* Finalizar compra.

---

## Perfil do cliente

Objetivo: área pessoal do usuário.

Módulos:

* Dados pessoais.
* Meus pedidos.
* Endereços.
* Favoritos.
* Cupons.
* Cartões.
* Segurança.
* Notificações.

---

## Pedidos

Objetivo: permitir acompanhamento de compras.

Funcionalidades:

* Lista de pedidos.
* Detalhes do pedido.
* Status.
* Código de rastreio.
* Nota fiscal.
* Solicitar cancelamento.
* Solicitar troca.
* Avaliar produto.

---

## Favoritos

Objetivo: salvar produtos para compra futura.

Funcionalidades:

* Lista de produtos favoritos.
* Remover favorito.
* Adicionar ao carrinho.
* Aviso de queda de preço.

---

## Central de ajuda

Objetivo: suporte ao cliente.

Funcionalidades:

* Perguntas frequentes.
* Chat.
* Acompanhar pedido.
* Trocas e devoluções.
* Política de garantia.
* Contato.

---

# 6. Módulos do Admin Panel

## Dashboard

Objetivo: visão geral do negócio.

Indicadores:

* Faturamento do mês.
* Total de pedidos.
* Pedidos pendentes.
* Pedidos enviados.
* Pedidos entregues.
* Ticket médio.
* Produtos mais vendidos.
* Produtos sem estoque.
* Clientes novos.
* Taxa de conversão.

Gráficos:

* Vendas por dia.
* Vendas por categoria.
* Produtos mais vendidos.
* Pedidos por status.
* Receita mensal.

---

## Produtos

Objetivo: CRUD completo de produtos.

Funcionalidades:

* Cadastrar produto.
* Editar produto.
* Visualizar produto.
* Excluir produto.
* Ativar/inativar produto.
* Upload de imagens.
* Upload de vídeos.
* Gerenciar SKU.
* Gerenciar estoque.
* Gerenciar preço.
* Gerenciar preço promocional.
* Gerenciar descrição.
* Gerenciar ficha técnica.
* Gerenciar variações.
* Prévia do produto.

Campos:

* Nome.
* Categoria.
* Marca.
* SKU.
* Preço.
* Preço promocional.
* Estoque.
* Descrição curta.
* Descrição completa.
* Imagens.
* Vídeo.
* Status.
* Peso.
* Altura.
* Largura.
* Comprimento.
* Garantia.

Status:

* Ativo.
* Inativo.
* Sem estoque.
* Estoque baixo.
* Rascunho.

---

## Categorias

Objetivo: organizar produtos.

Funcionalidades:

* Criar categoria.
* Editar categoria.
* Excluir categoria.
* Definir categoria pai.
* Imagem da categoria.
* Banner da categoria.
* Ordem de exibição.
* Status ativo/inativo.

Exemplos:

* Smartphones.
* Informática.
* Games.
* Hardware.
* Periféricos.
* Monitores.
* Notebooks.
* Consoles.
* Acessórios.

---

## Marcas

Objetivo: gerenciar marcas dos produtos.

Funcionalidades:

* Criar marca.
* Editar marca.
* Excluir marca.
* Logo da marca.
* Status ativo/inativo.

Exemplos:

* Apple.
* Samsung.
* Sony.
* Dell.
* Lenovo.
* Logitech.
* HyperX.
* Asus.
* Acer.
* Microsoft.
* Nintendo.

---

## Estoque

Objetivo: controlar disponibilidade dos produtos.

Funcionalidades:

* Entrada de estoque.
* Saída de estoque.
* Ajuste manual.
* Estoque mínimo.
* Alerta de estoque baixo.
* Histórico de movimentações.
* Produto sem estoque.
* Reserva de estoque após compra.

---

## Pedidos

Objetivo: controlar todas as vendas feitas.

Funcionalidades:

* Ver todos os pedidos.
* Filtrar por status.
* Buscar por cliente, pedido ou CPF.
* Ver detalhes do pedido.
* Ver itens comprados.
* Atualizar status.
* Confirmar envio.
* Inserir código de rastreio.
* Cancelar pedido.
* Reembolsar pedido.
* Gerar nota fiscal.

Status do pedido:

* Aguardando pagamento.
* Pagamento aprovado.
* Em separação.
* Enviado.
* Entregue.
* Cancelado.
* Reembolsado.

---

## Clientes

Objetivo: consultar usuários compradores.

Funcionalidades:

* Lista de clientes.
* Dados cadastrais.
* Histórico de compras.
* Endereços.
* Total gasto.
* Última compra.
* Status ativo/inativo.

---

## Cupons

Objetivo: criar promoções.

Funcionalidades:

* Criar cupom.
* Editar cupom.
* Excluir cupom.
* Definir valor fixo.
* Definir percentual.
* Definir validade.
* Definir uso mínimo.
* Limitar por cliente.
* Limitar por categoria.
* Ativar/inativar.

---

## Promoções

Objetivo: criar campanhas comerciais.

Funcionalidades:

* Ofertas relâmpago.
* Black Friday.
* Semana Gamer.
* Frete grátis.
* Desconto por categoria.
* Desconto por produto.
* Contador regressivo.

---

## Relatórios

Objetivo: análise do negócio.

Relatórios:

* Vendas por período.
* Vendas por categoria.
* Produtos mais vendidos.
* Produtos menos vendidos.
* Clientes que mais compram.
* Pedidos cancelados.
* Estoque baixo.
* Receita mensal.
* Ticket médio.

---

## Usuários administrativos

Objetivo: gerenciar acessos internos.

Funcionalidades:

* Criar usuário admin.
* Editar usuário.
* Excluir usuário.
* Definir perfil.
* Definir permissões.
* Resetar senha.
* Ativar/inativar usuário.

Perfis:

* Super Admin.
* Admin.
* Estoque.
* Atendimento.
* Financeiro.
* Marketing.

---

## Logs do sistema

Objetivo: auditoria.

Registrar:

* Quem criou produto.
* Quem editou produto.
* Quem excluiu produto.
* Quem alterou pedido.
* Quem alterou estoque.
* Data e hora.
* IP.
* Ação realizada.

---

# 7. Banco de dados

Entidades principais:

* usuarios
* perfis
* permissoes
* clientes
* enderecos
* produtos
* categorias
* marcas
* imagens_produtos
* videos_produtos
* variacoes_produto
* estoque
* movimentacoes_estoque
* carrinhos
* itens_carrinho
* pedidos
* itens_pedido
* pagamentos
* entregas
* cupons
* avaliacoes
* favoritos
* banners
* logs_sistema

Relacionamentos:

* Um cliente pode ter muitos endereços.
* Um cliente pode ter muitos pedidos.
* Um pedido possui muitos itens.
* Um item de pedido pertence a um produto.
* Um produto pertence a uma categoria.
* Um produto pertence a uma marca.
* Um produto possui muitas imagens.
* Um produto pode possuir muitas variações.
* Um produto possui controle de estoque.
* Um cupom pode ser aplicado a muitos pedidos.
* Um usuário admin pertence a um perfil.
* Um perfil possui várias permissões.

---

# 8. Regras de negócio

## Produto

* Produto sem estoque não pode ser comprado.
* Produto inativo não aparece na loja.
* Produto pode ter preço promocional.
* SKU deve ser único.
* Produto precisa ter ao menos uma imagem principal.
* Produto pode ter variações.

## Pedido

* Pedido só é criado após finalização do checkout.
* Estoque deve ser reservado após confirmação do pedido.
* Pedido pode ser cancelado se ainda não foi enviado.
* Pedido entregue não pode voltar para status anterior sem permissão administrativa.

## Pagamento

* Pagamento PIX pode ter desconto.
* Cartão pode permitir parcelamento.
* Boleto tem vencimento.
* Pedido aguardando pagamento não deve baixar estoque definitivamente até confirmação.

## Estoque

* Toda entrada e saída deve gerar histórico.
* Venda aprovada reduz estoque.
* Cancelamento pode devolver estoque.
* Estoque baixo gera alerta.

---

# 9. Funcionalidades avançadas

* Recomendações por IA.
* Produtos relacionados.
* Quem viu também comprou.
* Comparador de produtos.
* Lista de desejos.
* Alerta de queda de preço.
* Cashback.
* Programa de fidelidade.
* Avaliações com fotos.
* Perguntas e respostas.
* Chat de atendimento.
* Rastreamento em tempo real.
* Notificações por e-mail.
* Notificações por WhatsApp.
* Recuperação de carrinho abandonado.
* Cupons personalizados.
* Ranking de produtos.
* Banners dinâmicos.
* Busca inteligente.
* Sugestão de produtos.
* Cross sell.
* Upsell.

---

# 10. UX e Design

## Identidade visual

Estilo moderno, tecnológico e confiável.

Cores sugeridas:

* Azul escuro para base institucional.
* Laranja para chamadas de ação.
* Branco para áreas principais.
* Cinza claro para fundos.
* Verde para sucesso.
* Vermelho para erro.
* Amarelo/laranja para alertas.

## Componentes reutilizáveis

* Header.
* Sidebar admin.
* Card de produto.
* Card de métrica.
* Tabela.
* Modal.
* Drawer lateral.
* Botão primário.
* Botão secundário.
* Badge de status.
* Campo de busca.
* Filtros.
* Paginação.
* Toast de feedback.
* Empty state.
* Loading skeleton.

## Padrões de navegação

Cliente:

* Header fixo.
* Busca central.
* Categorias no topo.
* Carrinho sempre acessível.

Admin:

* Sidebar lateral.
* Header com busca global.
* Cards de resumo.
* Tabelas com ações rápidas.
* Formulários em drawer lateral ou modal.

---

# 11. Roadmap

## MVP

Obrigatório para lançar:

* Home.
* Login.
* Registro.
* Categorias.
* Busca.
* Produto.
* Carrinho.
* Checkout.
* Perfil básico.
* Meus pedidos.
* Admin login.
* Admin dashboard.
* CRUD de produtos.
* CRUD de categorias.
* CRUD de marcas.
* Controle de estoque básico.
* Gestão de pedidos.
* Gestão de clientes.
* Pagamento simulado.
* Status de pedido.
* Banco de dados completo.

## V1

Melhorias comerciais:

* Cupons.
* Banners.
* Promoções.
* Produtos relacionados.
* Favoritos.
* Avaliações.
* Filtros avançados.
* Relatórios básicos.
* Logs administrativos.

## V2

Funcionalidades avançadas:

* Recomendações por IA.
* Comparador.
* Cashback.
* Programa de fidelidade.
* Rastreamento real.
* Chat.
* Notificações por e-mail.
* Carrinho abandonado.
* Relatórios avançados.

## V3

Escalabilidade e marketplace:

* Múltiplos vendedores.
* Gestão de comissões.
* Integração com transportadoras.
* Integração com gateways reais.
* Integração fiscal.
* App mobile.
* Painel BI.
* Automação de marketing.
* IA para precificação.
* IA para sugestão de estoque.

---

# 12. Resumo do produto

O projeto deve ser tratado como uma plataforma completa de e-commerce para tecnologia e games, com uma loja moderna para clientes e um painel administrativo robusto para gestão interna.

O cliente precisa conseguir comprar com poucos cliques, segurança e clareza.

O admin precisa conseguir controlar produtos, estoque, pedidos, vendas, clientes, cupons, promoções, relatórios e usuários administrativos.

O MVP deve focar em compra, cadastro de produtos, controle de estoque e gestão de pedidos. As demais funcionalidades podem entrar por versões futuras.
