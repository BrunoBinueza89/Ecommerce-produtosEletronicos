# <Projeto E-commerce ShopMax>

Este ExecPlan e um documento vivo. Ele concentra somente informacoes operacionais, tecnicas e acionaveis para execucao do projeto. O `Brainstorm.md` permanece como fonte funcional e estrategica principal.

## Purpose / Big Picture
Construir uma plataforma de e-commerce focada em tecnologia, informatica, hardware, perifericos, games, consoles, acessorios e eletronicos, dividida em dois produtos principais:

1. Loja virtual para o cliente final.
2. Painel administrativo para operacao interna.

Objetivos de negocio:
- Permitir descoberta rapida de produtos, comparacao, compra segura e acompanhamento de pedidos.
- Permitir operacao administrativa de catalogo, estoque, pedidos, clientes, cupons, promocoes e relatorios.
- Criar uma base tecnica evolutiva para crescer de MVP ate recursos avancados sem reescrever dominios centrais.

Estrutura alvo do repositorio:
```text
frontEnd-adminPanel/
frontEnd-shopMax/
backendAPI-shopMax/
```

## Progress
- [x] Documento funcional inicial criado em `Brainstorm.md`
- [x] Estrutura inicial do `PLANS.md` criada
- [x] Auditoria inicial entre `Brainstorm.md` e `PLANS.md` concluida
- [x] Roadmap funcional macro definido no brainstorm
- [x] Criar estrutura fisica de pastas dos tres projetos
- [x] Definir stack final por aplicacao
- [x] Inicializar backend
- [x] Inicializar frontend da loja
- [x] Inicializar frontend admin
- [x] Executar Sprint 0 - Fundacao do workspace
- [x] Implementar infraestrutura de banco, migrations e seeders da Sprint 1
- [x] Implementar modulos iniciais de auth, users, categories, brands e products
- [x] Modelar banco de dados inicial
- [x] Implementar autenticacao e autorizacao
- [x] Implementar catalogo
- [x] Executar Sprint 1 - Banco e backend core
- [x] Executar Sprint 2 - Loja MVP inicial
- [x] Implementar carrinho e checkout
- [x] Executar Sprint 3 - Checkout, pedidos e perfil
- [x] Implementar pedidos, estoque e painel admin
- [x] Implementar dashboard administrativo com APIs reais
- [x] Implementar operacao administrativa de catalogo, estoque, pedidos e clientes
- [x] Implementar cupons, relatorios basicos e logs administrativos no painel
- [x] Executar Sprint 4 - Admin operacional MVP
- [x] Implementar regras de cupom no checkout
- [x] Implementar cancelamento elegivel com recomposicao de estoque
- [x] Validar transicoes de status do pedido no admin
- [x] Escrever testes de consolidacao do MVP
- [x] Executar Sprint 5 - Consolidacao do MVP
- [x] Implementar banners e promocoes comerciais
- [x] Implementar favoritos e avaliacoes elegiveis
- [x] Implementar filtros avancados no catalogo
- [x] Implementar promocoes operacionais no admin
- [x] Executar Sprint 6 - V1 comercial
- [x] Implementar relatorios avancados do V2
- [x] Implementar deteccao de carrinho abandonado
- [x] Implementar contrato de notificacao por e-mail com monitoramento em logs
- [x] Integrar painel admin com recuperacao de carrinho abandonado
- [x] Executar Sprint 7 - Fundacao V2 de retencao e observabilidade
- [x] Validar Sprint 1 com credenciais reais do MySQL do ambiente
- [x] Implementar provider configuravel de notificacao por e-mail
- [x] Implementar sincronizacao de rastreio no backend e no painel admin
- [x] Executar Sprint 8 - Integracoes V2 operacionais
- [x] Implementar health e retentativa das integracoes do V2
- [x] Implementar sincronizacao de rastreio em lote no admin
- [x] Executar Sprint 9 - Hardening das integracoes V2
- [x] Implementar probes operacionais de homologacao externa
- [x] Integrar painel admin ao modo seguro de homologacao
- [x] Executar Sprint 10 - Homologacao externa segura
- [x] Auditar retomada do projeto apos interrupcao
- [x] Implementar lint padronizado no workspace
- [x] Reforcar teste do frontend admin para contratos de integracao
- [x] Executar Sprint 11 - Qualidade e Definition of Done
- [x] Implementar validacao live assistida para integracoes externas
- [x] Expor gate operacional de homologacao real no admin e CLI
- [x] Executar Sprint 12 - Homologacao externa real assistida
- [x] Implementar upload local seguro de imagens e videos de produtos
- [x] Integrar painel admin ao upload e gerenciamento basico de midia
- [x] Expor galeria basica e fallback visual de produto na loja
- [x] Executar Sprint 13 - Upload de midia de produtos
- [x] Implementar comando E2E local do MVP
- [x] Homologar o MVP ponta a ponta em ambiente local
- [x] Executar Sprint 14 - Homologacao interna E2E do MVP
- [x] Endurecer gate seguro para homologacao externa real
- [x] Documentar variaveis live sem expor credenciais
- [x] Executar Sprint 15 - Preparacao assistida para homologacao externa real
- [x] Configurar Playwright para E2E visual em browser
- [x] Validar fluxo principal do MVP em navegador real local
- [x] Executar Sprint 16 - E2E visual em browser
- [x] Auditar estado final do MVP para release local
- [x] Consolidar checklist operacional e de release local
- [x] Executar Sprint 17 - Hardening final do MVP e checklist de release local

## Surprises & Discoveries
- O `PLANS.md` original trazia apenas visao resumida, paginas e stack base, sem detalhamento operacional suficiente para execucao continua.
- O `Brainstorm.md` contem a maior parte das regras de negocio, entidades, modulos, jornadas e roadmap que nao estavam refletidos no plano operacional.
- Ha duplicacao de contexto funcional entre os dois arquivos; o `PLANS.md` deve consolidar somente o que precisa orientar implementacao e validacao.
- O projeto ainda nao possui entidades definidas em codigo, contratos de API, convencoes de scripts, estrategia de migracoes ou criterios de aceite objetivos.
- O repositorio ainda nao possui estrutura fisica dos tres apps, `package.json` raiz, scripts reais, nem convencoes de workspace implementadas.
- O `PLANS.md` possui boa cobertura funcional, mas ainda nao indicava qual era a proxima entrega tecnica executavel em pequenas iteracoes.
- A `Sprint 0` confirmou que o recorte minimo correto e fundacao + bootstrap, sem antecipar banco ou dominio de negocio.
- O `npm install` concluiu com 1 vulnerabilidade baixa em dependencia transitiva, sem bloquear a fundacao do workspace nesta sprint.
- O MySQL local responde na porta `3306`, mas o acesso com `root` sem senha foi negado, bloqueando a validacao real das migrations e seeders nesta sprint.
- Os testes de integracao do backend passaram a marcar `skip` automaticamente quando a credencial do MySQL nao esta configurada, preservando a honestidade da validacao.
- A falha inicial de `db:reset` apos receber a senha veio do uso paralelo de comandos destrutivos de banco, nao de problema no schema.
- A suite do backend precisava ser serializada porque varios arquivos de teste compartilham o mesmo banco MySQL e corriam em paralelo.
- O checkout exigiu consolidar perfil, enderecos, pedidos, pagamentos simulados e entrega basica na mesma sprint para preservar a jornada fim a fim.
- A loja continua simples em arquitetura, mas ja cobre login, cadastro, checkout, perfil e pedidos sem mockar dados.
- O painel admin precisou concentrar dashboard, CRUDs operacionais, cupons, relatorios e auditoria na mesma sprint para evitar uma operacao partida entre modulos sem visibilidade.
- O contrato de `GET /api/auth/me` retorna `{ user }`, enquanto o login retorna `user` na raiz; o frontend admin precisou normalizar esse formato para manter a sessao consistente.
- Os logs administrativos passaram a ser parte obrigatoria dos fluxos de criacao e ajuste no admin para preservar rastreabilidade minima do MVP.
- A consolidacao do MVP exigiu transformar regras ja previstas no `PLANS.md` em garantias executaveis no backend, especialmente para cupom, cancelamento e maquina de estados do pedido.
- Os testes de integracao continuam compartilhando o mesmo MySQL da suite; para evitar falso negativo, a nova cobertura passou a validar restauracao de estoque por delta real em vez de valor absoluto.
- A `V1` exigiu separar conteudo comercial de dominio transacional: banners e promocoes passaram a existir como modulos proprios sem duplicar regra de preco entre vitrine, carrinho e checkout.
- O fluxo de avaliacao ficou naturalmente dependente da esteira operacional de pedidos, exigindo entrega concluida antes da publicacao da review.
- A fundacao do `V2` mostrou que notificacao e retencao podem nascer antes da integracao externa real, desde que o contrato fique explicito e o monitoramento seja persistido em logs.
- Carrinho abandonado so faz sentido para clientes identificados; por isso o carrinho passou a ser associado ao cliente autenticado no fluxo de checkout.
- A evolucao da notificacao para provider configuravel ficou mais segura com fallback automatico para modo simulado, evitando bloquear operacao por indisponibilidade externa.
- O sync de rastreio entrega mais valor quando respeita a maquina de estados ja existente do pedido; por isso a sincronizacao atualiza status apenas quando a transicao e valida.
- A suite da Sprint 8 revelou dependencia implicita do volume de seed; os testes agora usam produto garantido para evitar falso negativo por variacao de massa inicial.
- O hardening do V2 ficou mais previsivel quando o painel passou a enxergar a prontidao das integracoes, em vez de depender apenas de erro operacional em tempo de uso.
- Retentativa curta com timeout controlado trouxe resiliencia sem mascarar falhas; o fallback continua auditado e visivel para operacao.
- A homologacao externa precisou ser desenhada em modo seguro porque o repositorio nao carrega credenciais reais; probes operacionais e sandbox habilitado reduziram esse bloqueio sem fingir integracao homologada.
- A retomada confirmou que as features da Sprint 10 estavam implementadas e testadas, mas o workspace ainda nao tinha lint padronizado apesar do DoD exigir essa validacao.
- A falha inicial do `db:reset` durante a auditoria veio de execucao paralela com outros comandos de banco/teste; em execucao sequencial os scripts funcionam como esperado.
- A Sprint 12 confirmou que o gate de homologacao real precisa falhar explicitamente em sandbox; isso evita falso positivo operacional enquanto SMTP e tracking real nao estiverem configurados.
- O modelo de banco ja possuia `produto_imagens` e `produto_videos`; a Sprint 13 nao exigiu novas migrations, apenas reutilizacao correta das tabelas existentes.
- O uso de `process.cwd()` para uploads criaria risco de gravar arquivos fora de `backendAPI-shopMax/uploads/products` quando o workspace fosse iniciado pela raiz; o caminho precisou ser fixado no pacote do backend.
- A regra antiga "produto precisa de ao menos uma imagem principal" conflitou com o fallback visual aprovado para a loja; a regra operacional foi ajustada para permitir produto sem imagem e exigir principal apenas quando houver midia cadastrada.
- A Sprint 14 confirmou que os scripts de banco precisavam carregar `backendAPI-shopMax/.env` por caminho absoluto do pacote, e nao pelo diretório corrente do workspace.
- A validacao de banco precisou ser executada em sequencia; rodar `db:create`, `db:migrate`, `db:seed`, `db:seed:fake` e `db:reset` em paralelo gera falso negativo operacional.
- O MVP ja estava funcionalmente completo, mas faltava um comando explicito de homologacao E2E local para transformar a validacao ponta a ponta em artefato repetivel.
- A Sprint 15 confirmou que o gate live precisa priorizar `INTEGRATIONS_LIVE_ENABLED=false` antes de qualquer tentativa de provedor, evitando homologacao acidental mesmo com credenciais parcialmente configuradas.
- Alias de variaveis (`SMTP_FROM`, `SMTP_PASS`, `TRACKING_API_TOKEN`) reduziram ambiguidade operacional sem quebrar compatibilidade com nomes antigos.
- O `.gitignore` precisava proteger `.env` explicitamente em todo o workspace; antes apenas `.env.local` estava coberto.
- O primeiro E2E visual revelou um bug real no helper `fetch` dos frontends: `Authorization` sobrescrevia `Content-Type` e deixava `req.body` indefinido em chamadas JSON autenticadas.
- O painel admin tambem dependia de `event.currentTarget` apos `await`; em browser real isso gerou falha de `reset` e exigiu capturar a referencia do formulario antes da operacao assincrona.
- O Playwright agregou valor imediato porque validou o MVP por interface real sem depender de SMTP ou tracking externos, mantendo o escopo dentro do ambiente local seguro.
- A auditoria final da Sprint 17 nao encontrou bloqueadores criticos no MVP local; os riscos remanescentes ficaram concentrados em credenciais externas, expansao de cobertura e endurecimentos opcionais de operacao.
- O hardening final mostrou que a maior parte dos requisitos de seguranca basica ja estava no backend; a lacuna principal era documentacao operacional explicita para install, banco, uploads, checkout e checklist de release.

## Decision Log

### 2026-06-15 - Projeto iniciado
- [x] Projeto considerado iniciado sem implementacao de software existente.
- [x] `Brainstorm.md` definido como documento funcional.
- [x] `PLANS.md` definido como documento operacional vivo.

### 2026-06-17 - Estrategia documental
- [x] Manter `Brainstorm.md` como fonte funcional, estrategica e de produto.
- [x] Manter `PLANS.md` como fonte operacional, tecnica e acionavel.
- [x] Evitar duplicar descricoes longas de UX e negocio quando bastar referenciar o dominio e os criterios de execucao.

### 2026-06-17 - Arquitetura macro
- [x] Separar a solucao em tres aplicacoes: loja, admin e backend.
- [x] Centralizar regras de negocio no backend para evitar divergencia entre loja e admin.
- [x] Tratar autenticacao, autorizacao, estoque, pedidos, pagamentos e logs como dominios centrais desde o inicio.

### 2026-06-17 - Banco e operacao
- [x] Adotar banco relacional MySQL como fonte principal de dados transacionais.
- [x] Exigir comandos padronizados para criar banco, migrar, popular e resetar ambiente.
- [x] Registrar historico de movimentacoes de estoque e logs administrativos desde o MVP tecnico.

### 2026-06-17 - Roadmap tecnico
- [x] Dividir evolucao em `MVP`, `V1`, `V2` e `V3`.
- [x] Colocar criterios claros de aceite por fase para reduzir ambiguidade.
- [x] Tratar integracoes reais de pagamento, entrega e fiscal como fases posteriores, exceto simulacao no MVP.

### 2026-06-17 - Execucao inicial
- [x] Definir que a primeira sprint executavel sera a `Sprint 0 - Fundacao do workspace`.
- [x] Definir `npm workspaces` na raiz para orquestrar backend, loja e admin sem duplicar comandos operacionais.
- [x] Definir backend em Node.js + Express + MySQL e frontends em Vite + JavaScript + Bootstrap, preservando a diretriz de HTML, CSS e JavaScript do plano.
- [x] Restringir a primeira implementacao a fundacao, bootstrap tecnico e validacoes minimas, sem antecipar modulos de negocio de sprints futuras.

### 2026-06-17 - Sprint 0 executada
- [x] Criar `package.json` raiz com workspaces e scripts operacionais.
- [x] Inicializar `backendAPI-shopMax` com `app.js`, `server.js`, `connection.js`, `src/config`, `src/routes`, `src/middlewares` e testes basicos.
- [x] Inicializar `frontEnd-shopMax` e `frontEnd-adminPanel` com Vite, Bootstrap, estrutura alvo e smoke tests.
- [x] Criar scripts placeholder de banco para proteger a sequencia correta e empurrar migrations reais para a `Sprint 1`.
- [x] Validar API de healthcheck, testes do workspace e builds dos dois frontends.

### 2026-06-17 - Sprint 1 implementada com bloqueio de ambiente
- [x] Implementar schema inicial completo do banco com todas as entidades listadas no `PLANS.md`.
- [x] Implementar scripts reais `db:create`, `db:migrate`, `db:seed`, `db:seed:fake` e `db:reset`.
- [x] Implementar modulos HTTP iniciais de `auth`, `users`, `categories`, `brands` e `products`.
- [x] Implementar validacoes de entrada, hash de senha, JWT e autorizacao por permissao.
- [x] Concluir validacao real de banco no ambiente atual apos configurar `DB_USER` e `DB_PASSWORD`.

### 2026-06-17 - Sprint 2 executada
- [x] Expor catalogo publico com filtros de busca por termo e categoria.
- [x] Expor detalhe de produto por `slug`.
- [x] Implementar carrinho persistido no banco com sessao, inclusao, atualizacao e remocao de itens.
- [x] Implementar loja com Home, Busca, Categoria, Produto e Carrinho consumindo APIs reais do backend.
- [x] Validar build da loja e testes automatizados de backend e frontend.

### 2026-06-17 - Sprint 3 executada
- [x] Implementar `checkout` autenticado com endereco, entrega e pagamento simulado.
- [x] Implementar criacao de pedido, itens de pedido, pagamento aprovado e entrega pendente em transacao.
- [x] Implementar baixa de estoque e movimentacao de estoque no fechamento do pedido.
- [x] Implementar perfil do cliente com enderecos e historico de pedidos.
- [x] Implementar loja com login, registro, checkout, perfil e detalhes de pedidos consumindo APIs reais.

### 2026-06-17 - Sprint 4 executada
- [x] Implementar endpoints administrativos para dashboard, clientes, pedidos, estoque, cupons, relatorios e logs.
- [x] Reutilizar os modulos existentes de categorias, marcas e produtos para operacao do painel admin, evitando duplicacao de dominio.
- [x] Registrar logs administrativos nas operacoes sensiveis de categorias, marcas, produtos, cupons, estoque e pedidos.
- [x] Implementar painel admin em JavaScript + Bootstrap consumindo exclusivamente APIs reais do backend.
- [x] Antecipar cupons, relatorios basicos e auditoria no painel para manter a operacao do MVP coerente, mesmo sendo itens previstos originalmente para `V1`.

### 2026-06-17 - Sprint 5 executada
- [x] Implementar aplicacao real de cupons no checkout com validacao de vigencia, limite, categoria e valor minimo.
- [x] Implementar cancelamento elegivel de pedido pelo cliente com recomposicao de estoque e ajuste de pagamento.
- [x] Restringir transicoes invalidas de status no admin para impedir regressao operacional do pedido.
- [x] Expor a jornada consolidada na loja com campo de cupom e cancelamento de pedido.
- [x] Cobrir consolidacao do MVP com testes automatizados de cupom, cancelamento e transicao invalida.

### 2026-06-17 - Sprint 6 executada
- [x] Implementar modulos reais de banners, promocoes, favoritos e avaliacoes no backend.
- [x] Aplicar promocoes ativas ao catalogo e ao carrinho sem duplicar regra de preco no frontend.
- [x] Expor filtros avancados por marca, faixa de preco, estoque e ordenacao no catalogo.
- [x] Implementar pagina de favoritos, reviews publicas e formulario de avaliacao elegivel na loja.
- [x] Implementar operacao administrativa de promocoes e cobrir V1 com testes automatizados.

### 2026-06-17 - Sprint 7 arquitetura
- [x] Implementar notificacao por e-mail inicialmente como contrato simulado persistido em `logs_sistema`, evitando bloquear o V2 pela ausencia de provedor externo.
- [x] Tratar carrinho abandonado como capacidade administrativa baseada em inatividade e cliente identificado, sem inventar nova entidade de banco.
- [x] Centralizar relatorios avancados e recuperacao de carrinho no backend com consumo exclusivo pelo painel admin.

### 2026-06-17 - Sprint 7 executada
- [x] Implementar relatorios avancados com receita diaria, top categorias, performance de cupons e medias de reviews.
- [x] Implementar deteccao administrativa de carrinhos abandonados com base em inatividade configuravel.
- [x] Implementar processamento de recuperacao de carrinho abandonado com contrato de e-mail simulado e rastreio em `logs_sistema`.
- [x] Integrar o painel admin com leitura e disparo operacional de recuperacao.
- [x] Cobrir a fundacao do V2 com testes automatizados de relatorio avancado e notificacao de recuperacao.

### 2026-06-17 - Sprint 8 arquitetura
- [x] Evoluir notificacoes para provider configuravel por ambiente, com `smtp` opcional e fallback automatico para simulacao auditavel.
- [x] Implementar sincronizacao de rastreio como integracao operacional do modulo de pedidos, sem criar novas entidades fora do dominio ja aprovado.
- [x] Preservar a maquina de estados do pedido como fonte de verdade, usando o rastreio apenas para sincronizar transicoes permitidas.

### 2026-06-17 - Sprint 8 executada
- [x] Adicionar configuracoes de ambiente para `EMAIL_PROVIDER`, SMTP e provider de rastreio.
- [x] Implementar `notification-service` com envio SMTP opcional, fallback simulado e auditoria de notificacao.
- [x] Implementar `tracking-service` com provider `mock` e contrato preparado para integracao HTTP futura.
- [x] Expor endpoint administrativo de sincronizacao de rastreio por pedido.
- [x] Integrar o painel admin com acao operacional de sincronizar rastreio.
- [x] Cobrir Sprint 8 com teste automatizado de relatorios avancados, recuperacao de carrinho e sync de rastreio.

### 2026-06-17 - Sprint 9 arquitetura
- [x] Expor health operacional das integracoes para o painel admin, com foco em prontidao de e-mail e rastreio.
- [x] Adicionar timeout e retentativa curta nas integracoes externas do V2 para reduzir falhas transitorias.
- [x] Permitir sincronizacao de rastreio em lote apenas para pedidos elegiveis, preservando o dominio de pedidos ja aprovado.

### 2026-06-17 - Sprint 9 executada
- [x] Adicionar configuracoes de timeout e retentativa para e-mail e rastreio.
- [x] Implementar consulta administrativa de status das integracoes.
- [x] Implementar sincronizacao em lote de rastreio para pedidos pendentes.
- [x] Integrar o painel admin com visibilidade operacional e acao em lote.
- [x] Cobrir Sprint 9 com teste automatizado do health das integracoes e sync batch de rastreio.

### 2026-06-17 - Sprint 10 arquitetura
- [x] Homologar integracoes externas por meio de probes administrativos explicitos antes de depender de credenciais reais em ambiente.
- [x] Manter sandbox habilitavel por ambiente para validar contrato operacional de e-mail e rastreio sem mascarar indisponibilidade de provedor real.
- [x] Centralizar os testes de homologacao no backend e expor acionamento seguro no painel admin.

### 2026-06-17 - Sprint 10 executada
- [x] Adicionar configuracao de `INTEGRATION_SANDBOX_ENABLED` ao backend.
- [x] Implementar teste administrativo de e-mail com auditoria e reutilizacao do provider configurado.
- [x] Implementar teste administrativo de rastreio com resposta operacional do provider ativo.
- [x] Integrar o painel admin com botoes de teste e visibilidade do ultimo probe executado.
- [x] Cobrir Sprint 10 com teste automatizado de probes administrativos de e-mail e rastreio.

### 2026-06-17 - Auditoria de retomada
- [x] Validar estado real do repositorio contra `PLANS.md` antes de assumir a sprint atual como concluida.
- [x] Confirmar builds e testes automatizados reais do backend, loja e admin.
- [x] Identificar lacuna objetiva de DoD: ausencia de lint padronizado no workspace.

### 2026-06-17 - Sprint 11 arquitetura
- [x] Priorizar fechamento do DoD antes de homologacao externa real.
- [x] Adotar lint compartilhado na raiz com execucao por workspace para evitar drift de qualidade entre backend, loja e admin.
- [x] Reforcar cobertura leve do admin para validar os endpoints de integracao ja expostos.

### 2026-06-17 - Sprint 11 executada
- [x] Adicionar `eslint` e configuracao compartilhada do workspace.
- [x] Adicionar scripts `lint` nos tres projetos e `lint:all` na raiz.
- [x] Reforcar o teste do frontend admin com contrato real dos endpoints de integracao.
- [x] Validar lint, testes e builds apos a auditoria de retomada.

### 2026-06-17 - Sprint 12 arquitetura
- [x] Diferenciar claramente teste operacional simulado de validacao live real.
- [x] Bloquear homologacao real quando `INTEGRATION_SANDBOX_ENABLED` estiver ativo ou quando os providers reais nao estiverem configurados.
- [x] Expor a mesma validacao assistida tanto via painel admin quanto via comando CLI do backend.

### 2026-06-17 - Sprint 12 executada
- [x] Implementar validacao live assistida para SMTP e tracking real.
- [x] Expor endpoint `admin/integrations/validate-live` com auditoria administrativa.
- [x] Adicionar comando `npm run integrations:validate-live --workspace backendAPI-shopMax`.
- [x] Integrar o painel admin com botao de validacao live.
- [x] Cobrir Sprint 12 com teste automatizado do bloqueio seguro em sandbox.

### 2026-06-17 - Sprint 13 arquitetura
- [x] Reutilizar `produto_imagens` e `produto_videos`, sem criar novas entidades de banco ou depender de servico externo de storage.
- [x] Fixar armazenamento local de midia em `backendAPI-shopMax/uploads/products` com exposicao publica somente via `/uploads/products`.
- [x] Validar upload por extensao permitida, assinatura binaria real e limite de tamanho, sem confiar apenas no nome do arquivo.
- [x] Permitir produto sem imagem e aplicar fallback visual na loja; quando existir imagem cadastrada, exatamente uma deve ser principal.

### 2026-06-17 - Sprint 13 executada
- [x] Implementar middleware de upload local com `multer` em memoria, validacao binaria via `file-type` e nomes normalizados com `UUID`.
- [x] Expor criacao de produto com upload, inclusao de midia adicional, definicao de imagem principal e remocao de imagem/video.
- [x] Integrar o painel admin com cadastro de produto usando arquivos reais, preview local, thumbnails e gestao basica de midias.
- [x] Expor galeria basica, videos e fallback visual na loja consumindo URLs reais do backend.
- [x] Cobrir Sprint 13 com testes automatizados de upload valido, bloqueio de binario invalido, bloqueio por tamanho e regressao geral.

### 2026-06-17 - Sprint 14 arquitetura
- [x] Validar o MVP completo por APIs reais locais, sem introduzir dependencias externas de SMTP real ou tracking real.
- [x] Adicionar comando dedicado de homologacao E2E local para tornar a verificacao ponta a ponta repetivel.
- [x] Tratar scripts de banco como fluxo sequencial de operacao; validacao concorrente nao e criterio aceito.

### 2026-06-17 - Sprint 14 executada
- [x] Corrigir resolucao de `.env` do backend para garantir que comandos CLI usem as credenciais reais do pacote.
- [x] Corrigir a camada de tarefas de banco para validacao confiavel via conexao administrativa e `USE` explicito.
- [x] Adicionar `npm run test:e2e --workspace backendAPI-shopMax` cobrindo admin, loja, checkout, pedidos, estoque e auditoria.
- [x] Reforcar smoke tests de admin e loja para refletir os fluxos reais do MVP homologado.
- [x] Validar localmente banco, lint, testes, builds e homologacao E2E sem usar servicos externos reais.

### 2026-06-17 - Sprint 15 arquitetura
- [x] Exigir `INTEGRATIONS_LIVE_ENABLED=true` como gate adicional para qualquer homologacao externa real.
- [x] Preservar `INTEGRATION_SANDBOX_ENABLED=true` como fallback seguro, mesmo com variaveis live preenchidas.
- [x] Sanitizar mensagens de erro de integracao para impedir vazamento de host, usuario, senha, token ou URL privada.

### 2026-06-17 - Sprint 15 executada
- [x] Adicionar aliases seguros de ambiente para `SMTP_FROM`, `SMTP_PASS` e `TRACKING_API_TOKEN`, mantendo compatibilidade com nomes legados.
- [x] Endurecer `integrations:validate-live` para bloquear live desabilitado, configuracao incompleta e erros reais de provedor com mensagens seguras.
- [x] Melhorar o painel admin para distinguir sucesso, bloqueio seguro, erro de configuracao e erro real do provedor.
- [x] Reforcar `.gitignore` e `.env.example` para documentar variaveis sem expor credenciais.
- [x] Cobrir Sprint 15 com testes automatizados de bloqueio, configuracao incompleta, sucesso contratual e sanitizacao de mensagens.

### 2026-06-17 - Sprint 16 arquitetura
- [x] Adotar `Playwright` como ferramenta de E2E visual em browser para o MVP local.
- [x] Subir backend, loja e admin com portas fixas e `VITE_API_BASE_URL` controlada por script dedicado para tornar a execucao do browser E2E reproduzivel.
- [x] Manter a homologacao visual restrita ao ambiente local, sem SMTP real, sem tracking real e sem expor segredos.

### 2026-06-17 - Sprint 16 executada
- [x] Adicionar comando raiz `npm run test:e2e:browser` para a homologacao visual do MVP.
- [x] Criar suite Playwright cobrindo login admin, cadastro de categoria, marca e produto, upload de imagem, busca na loja, pagina de produto, carrinho, checkout, pedido e atualizacao administrativa do status.
- [x] Corrigir o helper `request` de loja e admin para preservar `Content-Type` junto com `Authorization` em chamadas JSON autenticadas.
- [x] Corrigir handlers do painel admin para nao depender de `event.currentTarget` apos `await` em formularios criticos.
- [x] Validar `db:reset`, `test:e2e`, `test:e2e:browser`, lint, testes e builds obrigatorios sem quebrar a esteira existente.

### 2026-06-17 - Sprint 17 arquitetura
- [x] Encerrar o MVP local com foco em estabilidade, repetibilidade e checklist operacional, sem integrar SMTP real ou tracking real.
- [x] Tratar a auditoria final como validacao tecnica do estado atual, corrigindo apenas gaps de documentacao ou endurecimentos pequenos que nao alterem a arquitetura.
- [x] Registrar explicitamente no `PLANS.md` como instalar, configurar, subir, validar upload, validar checkout e executar a release local do MVP.

### 2026-06-17 - Sprint 17 executada
- [x] Auditar backend, admin, loja, banco, migrations, seeders, uploads, carrinho, checkout, pedidos, estoque, logs, testes, builds, scripts, `.env.example`, `.gitignore` e `PLANS.md`.
- [x] Confirmar seguranca basica do MVP: `.env` ignorado, uploads protegidos, erros sem secrets, rotas administrativas protegidas, payloads validados, senhas com hash e JWT ativo.
- [x] Consolidar documentacao operacional de install, `.env`, banco, backend, admin, loja, testes, E2E browser, upload e checkout.
- [x] Adicionar checklist de release local do MVP com versao template e snapshot validado da sprint.
- [x] Reexecutar toda a esteira obrigatoria sem quebrar testes, builds ou a arquitetura existente.

## Outcomes & Retrospective
Estado atual esperado apos esta revisao:
- `PLANS.md` passa a concentrar escopo executavel, arquitetura, backlog tecnico, validacao e comandos.
- O historico inicial do projeto e preservado sem apagar contexto.
- O plano deixa de depender de memoria implicita para orientar implementacao futura.

### Auditoria Tecnica 2026-06-17

#### Informacoes ausentes
- O plano nao definia sprints nem recorte de entrega incremental para iniciar a execucao.
- Faltava stack final por aplicacao, apesar da stack base estar indicada por camada.
- Faltavam arquivos reais esperados para bootstrap do workspace, como `package.json` raiz e manifestos por app.
- Faltavam convencoes de validacao objetiva para a fase de fundacao.

#### Informacoes conflitantes ou ambiguas
- `Frontend: HTML, CSS, JavaScript, Bootstrap` nao entrava em conflito direto, mas deixava em aberto a ferramenta de desenvolvimento do frontend.
- `Commands` exigia scripts padronizados, mas nenhum script ainda existia no repositorio.
- `Plan of Work` e `Concrete Steps` apontavam backend antes de migracoes, enquanto `Progress` ainda nao distinguia fundacao do workspace e fundacao do backend.

#### Dependencias esquecidas
- Ferramenta de dev server e build para os frontends.
- Ferramenta de restart em desenvolvimento para o backend.
- Biblioteca de testes HTTP do backend.
- Scripts raiz para instalar e orquestrar os tres aplicativos.

#### Gargalos tecnicos
- Sem estrutura de workspace, cada app teria setup isolado e mais propenso a drift operacional.
- Sem bootstrap do backend, nao existe base para APIs reais da loja e do admin.
- Sem decisao de stack de frontend, a construcao da loja e do admin ficaria bloqueada.

#### Riscos futuros
- Iniciar loja ou admin antes da API aumentaria retrabalho e risco de mock indevido.
- Criar banco sem infraestrutura de migracoes e seeders tornaria o ambiente nao reprodutivel.
- Adiar convencoes de scripts dificultaria CI, onboarding e retestes.

#### Tarefas duplicadas ou sobrepostas
- `Criar estrutura fisica dos tres projetos`, `Inicializar backend`, `Inicializar frontend da loja` e `Inicializar frontend admin` precisam ser separadas por sprint para evitar marcar blocos grandes cedo demais.
- `Modelar banco de dados inicial` depende da fundacao do backend e nao deve concorrer com o bootstrap do workspace.

#### Sequencia recomendada
- Fundacao do workspace.
- Bootstrap do backend.
- Infra de banco, migracoes e seeders.
- Auth e autorizacao.
- Catalogo administrativo e leitura publica.
- Carrinho, checkout e pedidos.
- Loja e admin consumindo APIs reais.

## Context and Orientation

### Contexto em Geral
- 2026-06-15: projeto iniciado sem codigo implementado.
- 2026-06-17: `PLANS.md` enriquecido para orientar execucao tecnica continua.
- Escopo atual: documentacao, arquitetura inicial, roadmap tecnico e base de modelagem de dados.

### Perfis de Usuario do Sistema

#### Cliente visitante
Pode:
- Navegar pela loja
- Buscar produtos
- Ver categorias
- Ver pagina de produto
- Adicionar ao carrinho
- Criar conta
- Fazer login

#### Cliente cadastrado
Pode:
- Comprar produtos
- Salvar favoritos
- Gerenciar enderecos
- Ver historico de pedidos
- Acompanhar entrega
- Avaliar produtos
- Usar cupons
- Receber recomendacoes

#### Admin
Pode:
- Gerenciar produtos
- Gerenciar categorias
- Gerenciar marcas
- Gerenciar estoque
- Gerenciar pedidos
- Consultar vendas
- Atualizar status de envio
- Gerenciar clientes
- Criar cupons
- Ver relatorios
- Gerenciar usuarios administrativos

### Jornadas Principais

#### Jornada do cliente
1. Acessa a home.
2. Busca ou navega por categoria.
3. Entra na pagina de produto.
4. Escolhe variacao, quantidade e frete.
5. Adiciona ao carrinho.
6. Avanca para checkout.
7. Seleciona endereco.
8. Seleciona frete.
9. Seleciona pagamento.
10. Revisa pedido.
11. Finaliza compra.
12. Acompanha status.
13. Recebe o produto.
14. Avalia a compra.

#### Jornada administrativa
1. Primeiro admin criado manualmente.
2. Admin autentica.
3. Configura categorias, marcas e atributos.
4. Cadastra e publica produtos.
5. Monitora estoque.
6. Acompanha pedidos e pagamentos.
7. Atualiza status, entrega e rastreio.
8. Opera cupons, promocoes e relatorios.

### Paginas do Sistema ShopMax
- Home
- Categoria
- Busca
- Produto
- Login
- Register
- Cart
- Checkout
- Profile
- Orders
- Favorites
- Help Center

### Paginas do Admin Panel
- Login
- Dashboard
- Products
- Categories
- Brands
- Stock
- Orders
- Customers
- Coupons
- Promotions
- Reports
- Admin Users
- Audit Logs

### Backend Entities
- Auth
- Usuarios
- Perfis
- Permissoes
- Clientes
- Enderecos
- Produtos
- Categorias
- Marcas
- Midias de produto
- Variacoes de produto
- Estoque
- Movimentacoes de estoque
- Carrinhos
- Itens de carrinho
- Pedidos
- Itens de pedido
- Pagamentos
- Entregas
- Cupons
- Favoritos
- Avaliacoes
- Banners
- Promocoes
- Logs do sistema

### Database Entities
- `usuarios`
- `perfis`
- `permissoes`
- `perfil_permissoes`
- `clientes`
- `enderecos`
- `categorias`
- `marcas`
- `produtos`
- `produto_imagens`
- `produto_videos`
- `produto_variacoes`
- `estoques`
- `movimentacoes_estoque`
- `carrinhos`
- `itens_carrinho`
- `pedidos`
- `itens_pedido`
- `pagamentos`
- `entregas`
- `cupons`
- `cupom_usos`
- `favoritos`
- `avaliacoes`
- `banners`
- `promocoes`
- `promocao_itens`
- `logs_sistema`

### API Modules
- `auth`
- `users`
- `customers`
- `addresses`
- `catalog`
- `categories`
- `brands`
- `products`
- `product-media`
- `product-variations`
- `stock`
- `cart`
- `checkout`
- `orders`
- `payments`
- `shipments`
- `coupons`
- `favorites`
- `reviews`
- `banners`
- `promotions`
- `reports`
- `admin-users`
- `audit-logs`

### Frontend Modules
- App shell
- Layout publico
- Home
- Busca
- Categoria
- Produto
- Carrinho
- Checkout
- Autenticacao
- Perfil do cliente
- Pedidos
- Favoritos
- Central de ajuda
- Componentes compartilhados
- Servicos HTTP
- Gerenciamento de sessao

### Admin Modules
- App shell administrativo
- Dashboard
- CRUD de produtos
- CRUD de categorias
- CRUD de marcas
- Gestao de estoque
- Gestao de pedidos
- Gestao de clientes
- Gestao de cupons
- Gestao de promocoes
- Relatorios
- Gestao de usuarios admin
- Logs e auditoria

### Customer Modules
- Descoberta de produtos
- Busca e filtros
- Produto e recomendacoes
- Carrinho
- Checkout
- Conta e autenticacao
- Enderecos
- Pedidos
- Favoritos
- Avaliacoes
- Suporte e ajuda

## Plan of Work

### Fase 0 - Fundacao
- [x] Criar estrutura fisica dos tres projetos
- [x] Definir padrao de scripts `npm`
- [x] Configurar variaveis de ambiente
- [x] Definir convencoes de pastas, naming e versionamento

### Fase 1 - Backend Core
- [x] Inicializar API com Node.js, Express e MySQL
- [x] Configurar conexao, migracoes, seeders e reset
- [x] Implementar autenticacao e autorizacao por perfil/permissao
- [x] Implementar entidades centrais de catalogo, clientes, pedidos e estoque

### Fase 2 - Loja
- [x] Inicializar frontend da loja
- [x] Implementar navegacao, home, busca, categoria e produto
- [x] Implementar carrinho, checkout e perfil
- [x] Integrar com APIs reais do backend

### Fase 3 - Admin
- [x] Inicializar frontend administrativo
- [x] Implementar dashboard e autenticacao admin
- [x] Implementar CRUDs operacionais
- [x] Implementar consultas de pedidos, estoque e clientes

### Fase 4 - Consolidacao
- [x] Implementar logs administrativos
- [x] Implementar validacoes de negocio faltantes
- [x] Escrever testes prioritarios
- [x] Validar criterios de aceite do MVP

### Fase 5 - V1 Comercial
- [x] Implementar banners e promocoes
- [x] Implementar favoritos e avaliacoes
- [x] Implementar filtros avancados
- [x] Integrar loja e admin com os novos modulos

### Fase 6 - V2 Fundacional
- [x] Implementar relatorios avancados
- [x] Implementar deteccao de carrinho abandonado
- [x] Implementar contrato inicial de notificacoes
- [x] Integrar painel admin com monitoramento e recuperacao

### Plano de Execucao por Sprint

#### Sprint 0 - Fundacao do workspace
Objetivo:
- Criar a estrutura fisica dos tres apps, definir a stack final e estabelecer scripts operacionais minimos.

Arquivos afetados:
- `package.json`
- `.gitignore`
- `backendAPI-shopMax/*`
- `frontEnd-shopMax/*`
- `frontEnd-adminPanel/*`
- `PLANS.md`

Dependencias:
- Node.js
- npm

Criterio de aceite:
- Workspace instalado.
- Scripts raiz funcionando.
- Backend sobe com healthcheck basico.
- Loja e admin iniciam com build local valido.

Como validar:
- `npm run install:all`
- `npm run test:all`
- `npm run dev:api`
- `npm run build --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`

#### Sprint 1 - Banco e backend core
Objetivo:
- Implementar infraestrutura de banco, migracoes, seeders e modulos iniciais de auth, users, categories, brands e products.

Arquivos afetados:
- `backendAPI-shopMax/connection.js`
- `backendAPI-shopMax/app.js`
- `backendAPI-shopMax/server.js`
- `backendAPI-shopMax/src/**`
- `backendAPI-shopMax/migrations/**`
- `backendAPI-shopMax/seeders/**`
- `PLANS.md`

Dependencias:
- Sprint 0 concluida
- MySQL disponivel

Criterio de aceite:
- Banco criado via script.
- Migracoes aplicadas sem erro.
- Seed base funcional.
- Auth e catalogo base respondendo pela API.

Como validar:
- `npm run db:create --workspace backendAPI-shopMax`
- `npm run db:migrate --workspace backendAPI-shopMax`
- `npm run db:seed --workspace backendAPI-shopMax`
- `npm run test --workspace backendAPI-shopMax`

Status atual:
- Implementacao concluida.
- Validacao concluida com `db:create`, `db:reset`, `db:seed:fake` e testes do backend aprovados.
- Sprint 1 aprovada.

#### Sprint 2 - Loja MVP inicial
Objetivo:
- Implementar home, busca, categoria, produto e carrinho consumindo APIs reais.

Arquivos afetados:
- `frontEnd-shopMax/index.html`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/**`
- `backendAPI-shopMax/src/**`
- `PLANS.md`

Dependencias:
- Sprint 1 concluida

Criterio de aceite:
- Usuario visitante navega pelo catalogo e manipula carrinho com dados reais.

Como validar:
- `npm run dev:api`
- `npm run dev:shop`
- `npm run test --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida.
- Home, Busca, Categoria, Produto e Carrinho ligados a API real.
- Sprint 2 aprovada para o escopo previsto.

#### Sprint 3 - Checkout, pedidos e perfil
Objetivo:
- Implementar checkout, pedidos e perfil com estoque, cupom e pagamento simulado.

Arquivos afetados:
- `backendAPI-shopMax/src/**`
- `frontEnd-shopMax/src/**`
- `PLANS.md`

Dependencias:
- Sprint 2 concluida

Criterio de aceite:
- Cliente conclui pedido fim a fim com dados persistidos e status inicial consistente.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para checkout, pedidos, perfil, autenticacao do cliente e pagamento simulado.
- Regras de estoque aplicadas na conclusao do pedido.
- Sprint 3 aprovada para o escopo previsto.

#### Sprint 4 - Admin operacional MVP
Objetivo:
- Implementar dashboard, produtos, categorias, marcas, estoque, pedidos, clientes, cupons, relatorios e logs.

Arquivos afetados:
- `frontEnd-adminPanel/index.html`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/**`
- `backendAPI-shopMax/src/**`
- `PLANS.md`

Dependencias:
- Sprint 3 concluida

Criterio de aceite:
- Admin opera catalogo, estoque e pedidos por UI real com logs administrativos.

Como validar:
- `npm run dev:admin`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace backendAPI-shopMax`

Status atual:
- Implementacao concluida com dashboard, autenticacao admin, produtos, categorias, marcas, estoque, pedidos, clientes, cupons, relatorios e audit logs.
- Backend administrativo validado por testes automatizados e painel validado por teste e build.
- Sprint 4 aprovada para o escopo previsto.

#### Sprint 5 - Consolidacao do MVP
Objetivo:
- Consolidar regras criticas de cupom, cancelamento, transicao de pedido e criterios de aceite do MVP.

Arquivos afetados:
- `backendAPI-shopMax/src/**`
- `backendAPI-shopMax/tests/**`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 4 concluida

Criterio de aceite:
- Checkout valida cupom real.
- Pedido elegivel pode ser cancelado com estoque recomposto.
- Admin nao consegue aplicar regressao invalida de status.
- Suite automatizada cobre os fluxos consolidados do MVP.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`

Status atual:
- Implementacao concluida para cupom no checkout, cancelamento elegivel, estorno de estoque e endurecimento da maquina de estados do pedido.
- Loja atualizada para consumir as novas regras via API real.
- Sprint 5 aprovada para o escopo previsto.

#### Sprint 6 - V1 comercial
Objetivo:
- Entregar banners, promocoes, favoritos, avaliacoes e filtros avancados com operacao real no backend, loja e admin.

Arquivos afetados:
- `backendAPI-shopMax/src/**`
- `backendAPI-shopMax/tests/**`
- `backendAPI-shopMax/seeders/**`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 5 concluida

Criterio de aceite:
- Home consome banners reais.
- Catalogo aceita filtros avancados e reflete promocoes ativas.
- Cliente consegue salvar favorito e publicar review elegivel.
- Admin consegue cadastrar promocoes reais.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`

Status atual:
- Implementacao concluida para banners, promocoes, favoritos, avaliacoes e filtros avancados.
- Loja e admin integrados com APIs reais dos novos modulos.
- Sprint 6 aprovada para o escopo previsto.

#### Sprint 7 - Fundacao V2 de retencao e observabilidade
Objetivo:
- Entregar a base operacional de relatorios avancados, carrinho abandonado e notificacoes monitoradas para abrir o V2 sem quebrar o dominio central.

Arquivos afetados:
- `backendAPI-shopMax/src/**`
- `backendAPI-shopMax/tests/**`
- `backendAPI-shopMax/seeders/**`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 6 concluida

Criterio de aceite:
- Admin consulta relatorios avancados reais.
- Admin visualiza carrinhos abandonados por corte de inatividade.
- Admin dispara recuperacao com contrato de notificacao rastreado em log.
- Suite automatizada cobre o fluxo de retencao.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para relatorios avancados, carrinhos abandonados e notificacao simulada monitorada.
- Painel admin atualizado para operar a nova camada do V2.
- Sprint 7 aprovada para o escopo previsto.

#### Sprint 8 - Integracoes V2 operacionais
Objetivo:
- Evoluir a fundacao do V2 para integracoes operacionais configuraveis, com notificacao por e-mail via provider opcional e sincronizacao administrativa de rastreio.

Arquivos afetados:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/tests/v2-foundation.test.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 7 concluida

Criterio de aceite:
- Backend aceita configuracao de provider de e-mail sem quebrar o fallback simulado.
- Admin consegue sincronizar rastreio de um pedido com codigo de rastreio existente.
- Sync de rastreio respeita a maquina de estados atual do pedido.
- Suite automatizada cobre notificacao, retencao e sincronizacao de rastreio.

Como validar:
- `npm install --workspace backendAPI-shopMax`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para provider configuravel de e-mail com fallback seguro.
- Painel admin atualizado com acao operacional de sincronizar rastreio por pedido.
- Sprint 8 aprovada para o escopo previsto.

#### Sprint 9 - Hardening das integracoes V2
Objetivo:
- Endurecer as integracoes do V2 com health operacional, timeout, retentativa controlada e sincronizacao em lote para reduzir atrito da operacao administrativa.

Arquivos afetados:
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/repositories/admin-repository.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/tests/admin.test.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 8 concluida

Criterio de aceite:
- Admin consegue consultar o estado operacional das integracoes de e-mail e rastreio.
- Integracoes usam timeout e retentativa controlada sem eliminar fallback seguro.
- Admin consegue sincronizar rastreio em lote dos pedidos elegiveis.
- Suite automatizada cobre health das integracoes e sync batch.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para health operacional, retentativa e sync batch de rastreio.
- Painel admin atualizado com visibilidade de integracoes e acao em lote.
- Sprint 9 aprovada para o escopo previsto.

#### Sprint 10 - Homologacao externa segura
Objetivo:
- Preparar a homologacao externa real sem comprometer o ambiente local, usando probes administrativos, sandbox controlado e validacao operacional explicita.

Arquivos afetados:
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/tests/admin.test.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 9 concluida

Criterio de aceite:
- Admin consegue disparar teste operacional de e-mail usando o provider configurado.
- Admin consegue disparar teste operacional de rastreio sem depender de pedido real.
- Todos os testes de homologacao geram auditoria.
- Suite automatizada cobre os probes administrativos.

Como validar:
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para probes administrativos e sandbox seguro de homologacao.
- Painel admin atualizado com testes manuais rapidos de e-mail e rastreio.
- Sprint 10 aprovada para o escopo previsto.

#### Sprint 11 - Qualidade e Definition of Done
Objetivo:
- Fechar a lacuna de qualidade identificada na auditoria de retomada, padronizando lint, reforcando o DoD e validando novamente backend, loja e admin.

Arquivos afetados:
- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `backendAPI-shopMax/package.json`
- `frontEnd-shopMax/package.json`
- `frontEnd-adminPanel/package.json`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `PLANS.md`

Dependencias:
- Auditoria de retomada concluida
- Sprint 10 implementada funcionalmente

Criterio de aceite:
- Workspace possui lint padronizado e executavel.
- Backend, loja e admin passam em lint, testes e build.
- DoD fica coerente com os gates realmente existentes no projeto.

Como validar:
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`

Status atual:
- Implementacao concluida para lint padronizado no workspace.
- Auditoria de retomada fechada com revalidacao real do projeto.
- Sprint 11 aprovada para o escopo previsto.

#### Sprint 12 - Homologacao externa real assistida
Objetivo:
- Preparar a homologacao externa real de forma assistida, com gate explicito para impedir falso positivo enquanto o ambiente ainda estiver em sandbox ou sem provider real configurado.

Arquivos afetados:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/src/jobs/integrations-validate-live.js`
- `backendAPI-shopMax/tests/admin.test.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `PLANS.md`

Dependencias:
- Sprint 11 concluida

Criterio de aceite:
- Existe validacao live assistida para SMTP e tracking.
- Em sandbox, a validacao live falha de forma explicita e auditavel.
- Com providers reais configurados fora do sandbox, a mesma validacao pode ser reutilizada sem alterar codigo.
- Backend, admin, lint e builds permanecem verdes.

Como validar:
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- `npm run integrations:validate-live --workspace backendAPI-shopMax`

Status atual:
- Implementacao concluida para gate live assistido no backend e no painel admin.
- Ambiente atual permanece corretamente bloqueado para homologacao real por estar em sandbox.
- Sprint 12 aprovada para o escopo previsto.

#### Sprint 13 - Upload de midia de produtos
Objetivo:
- Implementar upload local seguro de imagens e videos de produtos no backend, no painel admin e na loja, sem depender de servicos externos reais.

Arquivos afetados:
- `package-lock.json`
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/app.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/middlewares/error-handler.js`
- `backendAPI-shopMax/src/middlewares/upload-product-media.js`
- `backendAPI-shopMax/src/models/product-model.js`
- `backendAPI-shopMax/src/repositories/product-repository.js`
- `backendAPI-shopMax/src/routes/products-routes.js`
- `backendAPI-shopMax/src/services/product-media-storage-service.js`
- `backendAPI-shopMax/src/services/product-service.js`
- `backendAPI-shopMax/src/validators/product-validator.js`
- `backendAPI-shopMax/tests/api.test.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-shopMax/tests/api-contract.test.js`
- `PLANS.md`

Dependencias:
- Sprint 12 concluida
- Tabelas `produto_imagens` e `produto_videos` ja existentes e reutilizaveis

Criterio de aceite:
- Backend grava midia em `backendAPI-shopMax/uploads/products` com validacao de extensao, assinatura binaria e tamanho.
- Produto pode ser criado com upload local, URL externa opcional ou sem imagem; quando existir imagem cadastrada, uma deve ser principal.
- Painel admin permite cadastrar produto com arquivo real, visualizar preview, listar thumbnail e gerir imagem principal/remocoes basicas.
- Loja exibe imagem principal, galeria basica, videos e fallback visual quando nao houver imagem.
- Lint, testes e builds obrigatorios permanecem verdes.

Como validar:
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Implementacao concluida para upload local seguro, gerenciamento basico de midia e consumo real no admin e na loja.
- Nenhuma migration nova foi necessaria; as tabelas de midia existentes foram reaproveitadas.
- Sprint 13 aprovada para o escopo previsto.

#### Sprint 14 - Homologacao interna E2E do MVP
Objetivo:
- Validar o MVP completo ponta a ponta em ambiente local, sem depender de SMTP real, tracking real ou features de V2/V3.

Arquivos afetados:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/connection.js`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/jobs/database-tasks.js`
- `backendAPI-shopMax/tests/mvp-e2e.test.js`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `frontEnd-shopMax/tests/smoke.test.js`
- `PLANS.md`

Dependencias:
- Sprint 13 concluida
- Upload local de midia operacional
- Banco MySQL local configurado

Criterio de aceite:
- Scripts `db:create`, `db:migrate`, `db:seed`, `db:seed:fake` e `db:reset` executam com sucesso em sequencia.
- Existe comando E2E local repetivel cobrindo criacao de produto com imagem, navegacao da loja, carrinho, checkout, pedido no admin, alteracao de status, estoque e logs.
- Testes existentes continuam verdes.
- Lint e builds do admin e da loja permanecem verdes.

Como validar:
- `npm run db:create --workspace backendAPI-shopMax`
- `npm run db:migrate --workspace backendAPI-shopMax`
- `npm run db:seed --workspace backendAPI-shopMax`
- `npm run db:seed:fake --workspace backendAPI-shopMax`
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Status atual:
- Homologacao interna do MVP concluida com sucesso por APIs reais locais e banco validado.
- Nenhuma dependencia externa real foi ativada; SMTP e tracking permanecem fora do escopo desta sprint.
- Sprint 14 aprovada para o escopo previsto.

#### Sprint 15 - Preparacao assistida para homologacao externa real
Objetivo:
- Preparar o projeto para executar homologacao externa real com SMTP e tracking reais sem expor credenciais sensiveis no codigo, no Git ou no `PLANS.md`.

Arquivos afetados:
- `.gitignore`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/jobs/integrations-validate-live.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/services/integration-security-service.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/tests/admin.test.js`
- `backendAPI-shopMax/tests/live-validation.test.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `PLANS.md`

Dependencias:
- Sprint 14 concluida
- Comando `integrations:validate-live` existente no backend
- Ambiente local com fallback seguro preservado

Criterio de aceite:
- `npm run integrations:validate-live --workspace backendAPI-shopMax` falha com seguranca quando live nao esta habilitado ou quando faltam variaveis obrigatorias.
- Mensagens de erro nao vazam host, usuario, senha, token ou segredo.
- Painel admin diferencia sucesso, bloqueio seguro, erro de configuracao e erro real do provedor.
- `.gitignore` protege `.env` e `.env.example` documenta apenas nomes de variaveis.
- Lint, testes e builds obrigatorios permanecem verdes.

Como validar:
- `npm run integrations:validate-live --workspace backendAPI-shopMax`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Variaveis necessarias para homologacao externa real:
- `INTEGRATIONS_LIVE_ENABLED=true`
- `INTEGRATION_SANDBOX_ENABLED=false`
- `EMAIL_PROVIDER=smtp`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `TRACKING_PROVIDER` diferente de `mock`
- `TRACKING_BASE_URL`
- `TRACKING_API_TOKEN`

Checklist seguro de homologacao externa real:
- Confirmar que `.env` permanece ignorado pelo Git.
- Preencher credenciais apenas no ambiente local ou secreto da esteira.
- Validar `INTEGRATIONS_LIVE_ENABLED=true` apenas quando SMTP e tracking reais estiverem prontos.
- Desabilitar `INTEGRATION_SANDBOX_ENABLED` somente no momento da homologacao real.
- Executar `npm run integrations:validate-live --workspace backendAPI-shopMax` e confirmar `allOk=true`.
- Registrar apenas status e pendencias no `PLANS.md`, nunca valores de segredo.

Status atual:
- Gate live reforcado e validado com bloqueio seguro no ambiente atual.
- O comando live retorna `exit code 1` de forma intencional quando `INTEGRATIONS_LIVE_ENABLED=false`.
- Sprint 15 aprovada para o escopo previsto.

#### Sprint 16 - E2E visual em browser
Objetivo:
- Criar e validar testes E2E reais em navegador para o fluxo principal do MVP usando ambiente local, banco resetavel e APIs reais do backend.

Arquivos afetados:
- `.gitignore`
- `package.json`
- `package-lock.json`
- `playwright.config.mjs`
- `scripts/run-vite-app.mjs`
- `tests/browser-e2e/fixtures/product-image.png`
- `tests/browser-e2e/shopmax-mvp.spec.mjs`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-shopMax/src/services/api.js`
- `PLANS.md`

Dependencias:
- Sprint 15 concluida
- `db:reset` e `test:e2e` do backend funcionando
- Ambiente local com MySQL operacional e `backendAPI-shopMax/.env` configurado
- Navegador `chromium` do Playwright instalado localmente

Criterio de aceite:
- `npm run test:e2e:browser` executa com sucesso em ambiente local e cobre o fluxo principal do MVP.
- O fluxo browser cobre login admin, categoria, marca, produto com imagem, busca na loja, pagina de produto com imagem real, carrinho, checkout, pedido e atualizacao do pedido no admin.
- A suite nao usa SMTP real, nao usa tracking real e nao exige credenciais externas.
- `npm run db:reset --workspace backendAPI-shopMax`, `npm run test:e2e --workspace backendAPI-shopMax`, lint, testes e builds obrigatorios permanecem verdes.
- O fluxo visual usa dados de seed/fake seguros e nao introduz features fora do MVP.

Como validar:
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run test:e2e:browser`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Fluxos cobertos no browser:
- Login admin
- Cadastro de categoria
- Cadastro de marca
- Cadastro de produto
- Upload de imagem de produto
- Definicao de imagem principal
- Produto aparecendo na loja
- Busca de produto
- Pagina de produto com imagem real
- Adicionar ao carrinho
- Checkout
- Pedido criado
- Pedido aparecendo no admin
- Admin atualizando status do pedido

Status atual:
- Suite Playwright configurada e validada localmente.
- O browser E2E roda sobre backend, loja e admin reais com portas deterministicas.
- Sprint 16 aprovada para o escopo previsto.

#### Sprint 17 - Hardening final do MVP e checklist de release local
Objetivo:
- Preparar o MVP para um estado de release local/homologacao tecnica com estabilidade, seguranca basica, documentacao operacional clara e repetibilidade.

Arquivos afetados:
- `PLANS.md`

Dependencias:
- Sprint 16 concluida
- Banco local operacional
- Esteira de lint, testes, builds e E2E ja existente

Criterio de aceite:
- Auditoria final do MVP registrada no `PLANS.md` sem bloqueadores criticos para release local.
- Seguranca basica documentada: `.env` ignorado, uploads protegidos, erros sem secrets, rotas administrativas protegidas, payloads validados, senhas com hash, JWT ativo, CORS documentado e limites de upload documentados.
- `PLANS.md` passa a explicar install, `.env`, banco, migrations, seeders, reset, backend, admin, loja, testes, E2E browser, upload e checkout.
- A secao `Checklist de Release Local do MVP` fica disponivel como template operacional e snapshot validado.
- Todos os comandos obrigatorios da sprint executam com sucesso.

Como validar:
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run test:e2e:browser`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`

Resultado da auditoria final:
- Backend: aprovado para release local; auth, autorizacao, validacoes, uploads, checkout, pedidos, estoque e logs cobertos por testes.
- Admin Panel: aprovado para release local; login, CRUDs centrais, pedidos, estoque, relatorios e auditoria validados.
- Loja: aprovada para release local; busca, produto, carrinho, checkout, perfil e pedidos validados.
- Banco/migrations/seeders: aprovados para release local; `db:reset` permanece o fluxo padrao para repetibilidade.
- Uploads: aprovados para release local; extensao perigosa, binario invalido e tamanho excessivo bloqueados.
- Integracoes externas reais: fora do escopo desta sprint e ainda pendentes de credenciais.

Status atual:
- MVP pronto para release local e homologacao tecnica interna.
- Sem bloqueadores criticos conhecidos para uso local controlado.
- Sprint 17 aprovada para o escopo previsto.

## Concrete Steps

### Sequencia recomendada de execucao
1. Criar a base do backend.
2. Criar migracoes e seeders.
3. Implementar autenticacao e autorizacao.
4. Implementar catalogo administrativo.
5. Implementar exposicao publica de catalogo.
6. Implementar carrinho e checkout.
7. Implementar pedidos, pagamentos simulados e entregas.
8. Implementar dashboard, relatorios basicos e logs.

### Backlog tecnico imediato
- [x] Definir padrao de IDs, timestamps e soft delete
- [x] Definir estrategia de senha com hash
- [x] Definir estrategia de token de acesso e refresh
- [x] Definir convencao de erros da API
- [x] Definir estrategia de upload de imagem e video
- [x] Definir regra de reserva e baixa de estoque
- [x] Definir maquina de estados do pedido
- [x] Definir regra de cupom por cliente, periodo e valor minimo
- [x] Definir politica de cancelamento, reembolso e devolucao
- [x] Definir estrutura de logs administrativos
- [x] Definir comando minimo de homologacao E2E local

## Commands
Comandos padronizados esperados para o projeto. Mesmo antes de existirem, devem orientar a criacao dos scripts oficiais.

### Raiz do repositorio
```bash
npm run install:all
npm run dev:api
npm run dev:admin
npm run dev:shop
npm run lint:all
npm run test:all
```

### Backend
```bash
npm install
npm run lint
npm run integrations:validate-live
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:seed:fake
npm run dev
npm run test
npm run test:e2e
npm run db:reset
```

### Frontend admin
```bash
npm install
npm run lint
npm run dev
npm run test
```

### Frontend loja
```bash
npm install
npm run lint
npm run dev
npm run test
```

### E2E browser na raiz
```bash
npm run test:e2e:browser
```

## Checklist de Release Local do MVP

### Template operacional
- [ ] dependencias instaladas
- [ ] `.env` configurado
- [ ] banco criado
- [ ] migrations aplicadas
- [ ] seeders executados
- [ ] backend iniciado
- [ ] admin iniciado
- [ ] loja iniciada
- [ ] testes unitarios passando
- [ ] testes E2E API passando
- [ ] testes E2E browser passando
- [ ] builds passando
- [ ] fluxo admin validado
- [ ] fluxo cliente validado
- [ ] upload validado
- [ ] checkout validado
- [ ] pedido validado

### Snapshot validado na Sprint 17
- [x] dependencias instaladas
- [x] `.env` configurado
- [x] banco criado
- [x] migrations aplicadas
- [x] seeders executados
- [x] backend iniciado
- [x] admin iniciado
- [x] loja iniciada
- [x] testes unitarios passando
- [x] testes E2E API passando
- [x] testes E2E browser passando
- [x] builds passando
- [x] fluxo admin validado
- [x] fluxo cliente validado
- [x] upload validado
- [x] checkout validado
- [x] pedido validado

### Convencoes dos comandos
- `db:create`: cria o banco se nao existir.
- `db:migrate`: aplica migracoes versionadas.
- `db:seed`: carrega dados base obrigatorios.
- `db:seed:fake`: popula dados ficticios para homologacao.
- `db:reset`: recria estrutura e reaplica seeds.
- `integrations:validate-live`: executa o gate assistido de homologacao real e falha com exit code 1 quando o ambiente nao esta apto.
- `dev:*`: sobe a aplicacao em modo desenvolvimento.
- `lint*`: executa validacao estatica padronizada por workspace.
- `test:*`: executa testes automatizados por camada.
- Arquivos sensiveis devem permanecer fora do versionamento; apenas `.env.example` documenta nomes de variaveis.

### Validacao executada na Sprint 0
- `npm run install:all`
- `npm run test:all`
- `npm run build --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run dev:api` com `GET /api/health`

### Validacao executada na Sprint 1
- `npm run install:all`
- `npm run db:create --workspace backendAPI-shopMax`
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run db:seed:fake --workspace backendAPI-shopMax`
- `npm run test --workspace backendAPI-shopMax`

### Validacao executada na Sprint 2
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- `npm run dev:api` com `GET /api/health`

### Validacao executada na Sprint 3
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- fluxo real via API para `auth`, `cart`, `checkout` e `orders` coberto por testes de integracao

### Validacao executada na Sprint 4
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- endpoints administrativos validados para `dashboard`, `customers`, `reports`, `coupons` e `audit-logs`

### Validacao executada na Sprint 5
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- fluxos validados para `checkout` com cupom, `orders/:id/cancel` e bloqueio de transicao invalida no admin

### Validacao executada na Sprint 6
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- fluxos validados para `banners`, `promotions`, `favorites`, `reviews` e filtros avancados

### Validacao executada na Sprint 7
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxos validados para `reports/advanced`, `carts/abandoned` e `carts/abandoned/process`

### Validacao executada na Sprint 8
- `npm install --workspace backendAPI-shopMax`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxos validados para fallback de notificacao, `admin/orders/:orderId/tracking/sync` e operacao administrativa de rastreio

### Validacao executada na Sprint 9
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxos validados para `admin/integrations/status`, `admin/orders/tracking/sync-pending`, timeout e retentativa operacional das integracoes

### Validacao executada na Sprint 10
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxos validados para `admin/integrations/email/test`, `admin/integrations/tracking/test` e auditoria dos probes administrativos

### Validacao executada na Sprint 11
- `npm run db:create --workspace backendAPI-shopMax`
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- auditoria de retomada concluida com comparacao entre repositorio real e `PLANS.md`

### Validacao executada na Sprint 12
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- `npm run integrations:validate-live --workspace backendAPI-shopMax`
- gate live validado com bloqueio seguro e `exit code 1` no ambiente atual em sandbox

### Validacao executada na Sprint 13
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- cobertura nova validada para upload valido, bloqueio de binario invalido, bloqueio por tamanho e imagem principal

### Validacao executada na Sprint 14
- `npm run db:create --workspace backendAPI-shopMax`
- `npm run db:migrate --workspace backendAPI-shopMax`
- `npm run db:seed --workspace backendAPI-shopMax`
- `npm run db:seed:fake --workspace backendAPI-shopMax`
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxo E2E homologado: admin cria produto com imagem, loja exibe produto, cliente compra, pedido aparece no admin, status muda, estoque baixa e logs registram as acoes

### Validacao executada na Sprint 15
- `npm run integrations:validate-live --workspace backendAPI-shopMax`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- gate live validado com bloqueio seguro no ambiente atual (`INTEGRATIONS_LIVE_ENABLED=false`) e `exit code 1` intencional

### Validacao executada na Sprint 16
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run test:e2e:browser`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- fluxo browser homologado: admin autentica, cria categoria, marca e produto com imagem, loja encontra o produto, cliente compra e o admin atualiza o pedido

### Validacao executada na Sprint 17
- `npm run db:reset --workspace backendAPI-shopMax`
- `npm run test:e2e --workspace backendAPI-shopMax`
- `npm run test:e2e:browser`
- `npm run lint:all`
- `npm run test --workspace backendAPI-shopMax`
- `npm run test --workspace frontEnd-adminPanel`
- `npm run test --workspace frontEnd-shopMax`
- `npm run build --workspace frontEnd-adminPanel`
- `npm run build --workspace frontEnd-shopMax`
- auditoria final confirmada: banco resetavel, testes verdes, builds verdes, upload e checkout documentados e checklist de release local consolidado

## Validation and Acceptance

### Criterios transversais
- Toda regra de negocio critica deve existir no backend.
- Toda entidade principal deve possuir validacao de entrada.
- Toda acao administrativa sensivel deve gerar log.
- Estoque, pedido e pagamento devem permanecer consistentes apos falhas controladas.
- Scripts de setup devem permitir repetir o ambiente sem ajustes manuais ocultos.

### Status de validacao atual
- Sprint 0 aprovada: workspace instalado, backend respondendo healthcheck, loja e admin com build valido.
- Sprint 1 aprovada: banco, migracoes, seeders, auth e catalogo base validados com MySQL real.
- Sprint 2 aprovada: loja publica e carrinho operando sobre APIs reais do backend.
- Sprint 3 aprovada: checkout, pedidos, perfil, pagamento simulado e baixa de estoque validados por testes automatizados.
- Sprint 4 aprovada: painel admin operando sobre APIs reais com dashboard, CRUDs operacionais, cupons, relatorios e auditoria.
- Sprint 5 aprovada: regras criticas do MVP consolidadas com cupom real, cancelamento elegivel e transicoes protegidas.
- Sprint 6 aprovada: V1 comercial entregue com conteudo promocional, favoritos, reviews e filtros avancados.
- Sprint 7 aprovada: fundacao do V2 entregue com retencao operacional e observabilidade administrativa.
- Sprint 8 aprovada: integracoes operacionais do V2 entregues com provider de e-mail configuravel e sync de rastreio no admin.
- Sprint 9 aprovada: hardening das integracoes do V2 entregue com health operacional, retentativa e sync batch no admin.
- Sprint 10 aprovada: homologacao externa segura entregue com probes administrativos, sandbox controlado e auditoria operacional.
- Sprint 11 aprovada: DoD minimo fechado com lint padronizado, revalidacao do banco, testes e builds do workspace.
- Sprint 12 aprovada: homologacao externa real assistida entregue com gate live seguro no backend, CLI e painel admin.
- Sprint 13 aprovada: upload local seguro de midia entregue com validacao binaria, administracao basica no painel e galeria/fallback reais na loja.
- Sprint 14 aprovada: MVP homologado ponta a ponta em ambiente local com banco, admin, loja, checkout, estoque e auditoria validados.
- Sprint 15 aprovada: preparacao assistida para homologacao externa real entregue com gate live endurecido, mensagens seguras e documentacao sem secrets.
- Sprint 16 aprovada: homologacao visual em browser entregue com Playwright, fluxo principal do MVP automatizado e correcoes reais na camada de frontend.
- Sprint 17 aprovada: hardening final do MVP concluido com auditoria tecnica, checklist operacional e release local documentado.

### Checklist DoD da Sprint 13
- [x] Codigo implementado
- [x] Codigo testado
- [x] Testes passando
- [x] Build passando
- [x] Sem erros de lint
- [x] Banco validado
- [x] APIs validadas
- [x] UI funcionando
- [x] Variaveis de ambiente documentadas
- [x] Documentacao atualizada
- [x] PLANS.md atualizado
- [x] Progress atualizado
- [x] Decision Log atualizado

### Checklist DoD da Sprint 14
- [x] Codigo implementado
- [x] Codigo testado
- [x] Testes passando
- [x] Build passando
- [x] Sem erros de lint
- [x] Banco validado
- [x] APIs validadas
- [x] UI funcionando
- [x] Variaveis de ambiente documentadas
- [x] Documentacao atualizada
- [x] PLANS.md atualizado
- [x] Progress atualizado
- [x] Decision Log atualizado

### Checklist DoD da Sprint 15
- [x] Codigo implementado
- [x] Codigo testado
- [x] Testes passando
- [x] Build passando
- [x] Sem erros de lint
- [x] Banco validado
- [x] APIs validadas
- [x] UI funcionando
- [x] Variaveis de ambiente documentadas
- [x] Documentacao atualizada
- [x] PLANS.md atualizado
- [x] Progress atualizado
- [x] Decision Log atualizado

### Checklist DoD da Sprint 16
- [x] Codigo implementado
- [x] Codigo testado
- [x] Testes passando
- [x] Build passando
- [x] Sem erros de lint
- [x] Banco validado
- [x] APIs validadas
- [x] UI funcionando
- [x] Variaveis de ambiente documentadas
- [x] Documentacao atualizada
- [x] PLANS.md atualizado
- [x] Progress atualizado
- [x] Decision Log atualizado

### Checklist DoD da Sprint 17
- [x] Codigo implementado
- [x] Codigo testado
- [x] Testes passando
- [x] Build passando
- [x] Sem erros de lint
- [x] Banco validado
- [x] APIs validadas
- [x] UI funcionando
- [x] Variaveis de ambiente documentadas
- [x] Documentacao atualizada
- [x] PLANS.md atualizado
- [x] Progress atualizado
- [x] Decision Log atualizado

### MVP
- Cliente consegue navegar, buscar, visualizar produto, adicionar ao carrinho, finalizar checkout e consultar pedido.
- Admin consegue autenticar, cadastrar categoria, marca e produto, ajustar estoque e atualizar pedido.
- Banco possui entidades centrais operando com migracoes e seeders.
- Pagamento pode ser simulado, mas o fluxo completo deve existir.

### V1
- Cupons, banners, favoritos, avaliacoes, filtros avancados e relatorios basicos funcionando.
- Logs administrativos persistidos.
- Regras de desconto e promocao com validacao minima.

### V2
- Recomendacoes, comparador, notificacoes, carrinho abandonado, chat e relatorios avancados definidos e implementados.
- Integracoes externas com contrato claro e monitoramento basico.

### V3
- Arquitetura preparada para multiplos vendedores, integracoes reais ampliadas e automacoes avancadas.
- Novos modulos nao podem quebrar o dominio central de catalogo, estoque, pedidos e pagamentos.

## Idempotence and Recovery
- Migracoes devem ser versionadas, reversiveis quando possivel e reaplicaveis sem duplicar estrutura.
- Seeders base devem ser idempotentes ou protegidos por checagem de existencia.
- Reset de banco deve ser previsivel e documentado.
- Operacoes criticas de pedido e estoque devem ser transacionais.
- Integracoes assicronas futuras devem prever retentativa e reconciliacao.
- Mudancas de status de pedido devem ser auditaveis.
- O primeiro admin deve poder ser recriado de forma controlada sem corromper autorizacoes.

## Artifacts and Notes

### Design UI/UX
Existe a pasta `design/screens` com referencias visuais para orientar a interface da loja e do painel admin.

### Backend
Estrutura alvo:
```text
connection.js
.env
app.js
server.js
src/
  repositories/
  models/
  services/
  controllers/
  routes/
  middlewares/
  validators/
  jobs/
  config/
```

Artefatos implementados na Sprint 0:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/connection.js`
- `backendAPI-shopMax/app.js`
- `backendAPI-shopMax/server.js`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/routes/index.js`
- `backendAPI-shopMax/src/middlewares/not-found.js`
- `backendAPI-shopMax/src/middlewares/error-handler.js`
- `backendAPI-shopMax/src/jobs/*.js`
- `backendAPI-shopMax/tests/health.test.js`

Artefatos implementados na Sprint 1:
- `backendAPI-shopMax/migrations/001-initial-schema.js`
- `backendAPI-shopMax/seeders/001-base.js`
- `backendAPI-shopMax/seeders/002-fake.js`
- `backendAPI-shopMax/src/models/app-error.js`
- `backendAPI-shopMax/src/models/user-model.js`
- `backendAPI-shopMax/src/models/category-model.js`
- `backendAPI-shopMax/src/models/brand-model.js`
- `backendAPI-shopMax/src/models/product-model.js`
- `backendAPI-shopMax/src/repositories/user-repository.js`
- `backendAPI-shopMax/src/repositories/category-repository.js`
- `backendAPI-shopMax/src/repositories/brand-repository.js`
- `backendAPI-shopMax/src/repositories/product-repository.js`
- `backendAPI-shopMax/src/services/auth-service.js`
- `backendAPI-shopMax/src/services/category-service.js`
- `backendAPI-shopMax/src/services/brand-service.js`
- `backendAPI-shopMax/src/services/product-service.js`
- `backendAPI-shopMax/src/services/password-service.js`
- `backendAPI-shopMax/src/services/token-service.js`
- `backendAPI-shopMax/src/services/slug-service.js`
- `backendAPI-shopMax/src/controllers/auth-controller.js`
- `backendAPI-shopMax/src/controllers/users-controller.js`
- `backendAPI-shopMax/src/controllers/categories-controller.js`
- `backendAPI-shopMax/src/controllers/brands-controller.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/routes/auth-routes.js`
- `backendAPI-shopMax/src/routes/users-routes.js`
- `backendAPI-shopMax/src/routes/categories-routes.js`
- `backendAPI-shopMax/src/routes/brands-routes.js`
- `backendAPI-shopMax/src/routes/products-routes.js`
- `backendAPI-shopMax/src/middlewares/authenticate-request.js`
- `backendAPI-shopMax/src/middlewares/require-auth.js`
- `backendAPI-shopMax/src/middlewares/validate-body.js`
- `backendAPI-shopMax/src/validators/auth-validator.js`
- `backendAPI-shopMax/src/validators/category-validator.js`
- `backendAPI-shopMax/src/validators/brand-validator.js`
- `backendAPI-shopMax/src/validators/product-validator.js`
- `backendAPI-shopMax/src/jobs/database-tasks.js`
- `backendAPI-shopMax/src/jobs/database-error-handler.js`
- `backendAPI-shopMax/tests/api.test.js`
- `backendAPI-shopMax/tests/cart.test.js`

Artefatos implementados na Sprint 2:
- `backendAPI-shopMax/src/models/cart-model.js`
- `backendAPI-shopMax/src/repositories/cart-repository.js`
- `backendAPI-shopMax/src/services/cart-service.js`
- `backendAPI-shopMax/src/controllers/cart-controller.js`
- `backendAPI-shopMax/src/routes/cart-routes.js`
- `backendAPI-shopMax/src/validators/cart-validator.js`
- `backendAPI-shopMax/src/repositories/product-repository.js`
- `backendAPI-shopMax/src/services/product-service.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/routes/products-routes.js`
- `backendAPI-shopMax/src/routes/index.js`

Artefatos implementados na Sprint 3:
- `backendAPI-shopMax/src/models/address-model.js`
- `backendAPI-shopMax/src/models/order-model.js`
- `backendAPI-shopMax/src/repositories/customer-repository.js`
- `backendAPI-shopMax/src/repositories/order-repository.js`
- `backendAPI-shopMax/src/repositories/checkout-repository.js`
- `backendAPI-shopMax/src/services/customer-service.js`
- `backendAPI-shopMax/src/services/order-service.js`
- `backendAPI-shopMax/src/services/checkout-service.js`
- `backendAPI-shopMax/src/controllers/customers-controller.js`
- `backendAPI-shopMax/src/controllers/orders-controller.js`
- `backendAPI-shopMax/src/controllers/checkout-controller.js`
- `backendAPI-shopMax/src/routes/customers-routes.js`
- `backendAPI-shopMax/src/routes/orders-routes.js`
- `backendAPI-shopMax/src/routes/checkout-routes.js`
- `backendAPI-shopMax/src/validators/customer-validator.js`
- `backendAPI-shopMax/src/validators/checkout-validator.js`
- `backendAPI-shopMax/tests/checkout.test.js`

Artefatos implementados na Sprint 4:
- `backendAPI-shopMax/src/repositories/admin-repository.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/services/audit-log-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/controllers/categories-controller.js`
- `backendAPI-shopMax/src/controllers/brands-controller.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/routes/index.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/seeders/001-base.js`
- `backendAPI-shopMax/tests/admin.test.js`

Artefatos implementados na Sprint 5:
- `backendAPI-shopMax/src/validators/order-validator.js`
- `backendAPI-shopMax/src/validators/checkout-validator.js`
- `backendAPI-shopMax/src/controllers/checkout-controller.js`
- `backendAPI-shopMax/src/controllers/orders-controller.js`
- `backendAPI-shopMax/src/services/checkout-service.js`
- `backendAPI-shopMax/src/services/order-service.js`
- `backendAPI-shopMax/src/repositories/checkout-repository.js`
- `backendAPI-shopMax/src/repositories/order-repository.js`
- `backendAPI-shopMax/src/repositories/admin-repository.js`
- `backendAPI-shopMax/src/routes/orders-routes.js`
- `backendAPI-shopMax/tests/checkout.test.js`
- `backendAPI-shopMax/tests/admin.test.js`

Artefatos implementados na Sprint 6:
- `backendAPI-shopMax/src/models/banner-model.js`
- `backendAPI-shopMax/src/models/promotion-model.js`
- `backendAPI-shopMax/src/models/favorite-model.js`
- `backendAPI-shopMax/src/models/review-model.js`
- `backendAPI-shopMax/src/repositories/content-repository.js`
- `backendAPI-shopMax/src/repositories/favorite-repository.js`
- `backendAPI-shopMax/src/repositories/review-repository.js`
- `backendAPI-shopMax/src/repositories/product-repository.js`
- `backendAPI-shopMax/src/repositories/cart-repository.js`
- `backendAPI-shopMax/src/services/pricing-service.js`
- `backendAPI-shopMax/src/services/content-service.js`
- `backendAPI-shopMax/src/services/favorite-service.js`
- `backendAPI-shopMax/src/services/review-service.js`
- `backendAPI-shopMax/src/services/product-service.js`
- `backendAPI-shopMax/src/services/cart-service.js`
- `backendAPI-shopMax/src/controllers/content-controller.js`
- `backendAPI-shopMax/src/controllers/favorites-controller.js`
- `backendAPI-shopMax/src/controllers/reviews-controller.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/routes/content-routes.js`
- `backendAPI-shopMax/src/routes/favorites-routes.js`
- `backendAPI-shopMax/src/routes/reviews-routes.js`
- `backendAPI-shopMax/src/routes/index.js`
- `backendAPI-shopMax/src/validators/content-validator.js`
- `backendAPI-shopMax/src/validators/favorite-validator.js`
- `backendAPI-shopMax/src/validators/review-validator.js`
- `backendAPI-shopMax/seeders/001-base.js`
- `backendAPI-shopMax/tests/v1-commerce.test.js`

Artefatos implementados na Sprint 7:
- `backendAPI-shopMax/src/repositories/engagement-repository.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/engagement-service.js`
- `backendAPI-shopMax/src/controllers/engagement-controller.js`
- `backendAPI-shopMax/src/routes/engagement-routes.js`
- `backendAPI-shopMax/src/validators/engagement-validator.js`
- `backendAPI-shopMax/src/repositories/cart-repository.js`
- `backendAPI-shopMax/src/services/checkout-service.js`
- `backendAPI-shopMax/src/routes/index.js`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/seeders/001-base.js`
- `backendAPI-shopMax/tests/v2-foundation.test.js`

Artefatos implementados na Sprint 8:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/tests/v2-foundation.test.js`

Artefatos implementados na Sprint 9:
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/repositories/admin-repository.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/tests/admin.test.js`

Artefatos implementados na Sprint 10:
- `backendAPI-shopMax/.env`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/tests/admin.test.js`

Artefatos implementados na Sprint 11:
- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `backendAPI-shopMax/package.json`
- `frontEnd-shopMax/package.json`
- `frontEnd-adminPanel/package.json`
- `frontEnd-adminPanel/tests/smoke.test.js`

Artefatos implementados na Sprint 12:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/controllers/admin-controller.js`
- `backendAPI-shopMax/src/routes/admin-routes.js`
- `backendAPI-shopMax/src/validators/admin-validator.js`
- `backendAPI-shopMax/src/jobs/integrations-validate-live.js`
- `backendAPI-shopMax/tests/admin.test.js`

Artefatos implementados na Sprint 13:
- `package-lock.json`
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/app.js`
- `backendAPI-shopMax/src/controllers/products-controller.js`
- `backendAPI-shopMax/src/middlewares/error-handler.js`
- `backendAPI-shopMax/src/middlewares/upload-product-media.js`
- `backendAPI-shopMax/src/models/product-model.js`
- `backendAPI-shopMax/src/repositories/product-repository.js`
- `backendAPI-shopMax/src/routes/products-routes.js`
- `backendAPI-shopMax/src/services/product-media-storage-service.js`
- `backendAPI-shopMax/src/services/product-service.js`
- `backendAPI-shopMax/src/validators/product-validator.js`
- `backendAPI-shopMax/tests/api.test.js`

Artefatos implementados na Sprint 14:
- `backendAPI-shopMax/package.json`
- `backendAPI-shopMax/connection.js`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/jobs/database-tasks.js`
- `backendAPI-shopMax/tests/mvp-e2e.test.js`

Artefatos implementados na Sprint 15:
- `.gitignore`
- `backendAPI-shopMax/.env.example`
- `backendAPI-shopMax/src/config/env.js`
- `backendAPI-shopMax/src/jobs/integrations-validate-live.js`
- `backendAPI-shopMax/src/services/admin-service.js`
- `backendAPI-shopMax/src/services/integration-security-service.js`
- `backendAPI-shopMax/src/services/notification-service.js`
- `backendAPI-shopMax/src/services/tracking-service.js`
- `backendAPI-shopMax/tests/admin.test.js`
- `backendAPI-shopMax/tests/live-validation.test.js`

Artefatos implementados na Sprint 16:
- `.gitignore`
- `package.json`
- `package-lock.json`
- `playwright.config.mjs`
- `scripts/run-vite-app.mjs`
- `tests/browser-e2e/fixtures/product-image.png`
- `tests/browser-e2e/shopmax-mvp.spec.mjs`

Artefatos implementados na Sprint 17:
- `PLANS.md`

### Frontend
Estrutura alvo por aplicacao:
```text
index.html
main.js
src/
  pages/
  components/
  layouts/
  services/
  hooks/
  store/
  utils/
  guards/
```

Artefatos implementados na Sprint 0:
- `frontEnd-shopMax/package.json`
- `frontEnd-shopMax/index.html`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/styles.css`
- `frontEnd-shopMax/tests/smoke.test.js`
- `frontEnd-adminPanel/package.json`
- `frontEnd-adminPanel/index.html`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/styles.css`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `.gitignore`
- `package.json`

Artefatos implementados na Sprint 2:
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-shopMax/src/store/cart-session.js`
- `frontEnd-shopMax/src/styles.css`
- `frontEnd-shopMax/tests/api-contract.test.js`

Artefatos implementados na Sprint 3:
- `frontEnd-shopMax/src/store/auth-session.js`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-shopMax/src/styles.css`

Artefatos implementados na Sprint 4:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-adminPanel/src/store/auth-session.js`
- `frontEnd-adminPanel/src/styles.css`
- `frontEnd-adminPanel/tests/smoke.test.js`

Artefatos implementados na Sprint 5:
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`

Artefatos implementados na Sprint 6:
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`

Artefatos implementados na Sprint 7:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`

Artefatos implementados na Sprint 8:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`

Artefatos implementados na Sprint 9:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`

Artefatos implementados na Sprint 10:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`

Artefatos implementados na Sprint 11:
- `frontEnd-adminPanel/tests/smoke.test.js`

Artefatos implementados na Sprint 12:
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/tests/smoke.test.js`

Artefatos implementados na Sprint 13:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-adminPanel/tests/smoke.test.js`
- `frontEnd-shopMax/main.js`
- `frontEnd-shopMax/src/services/api.js`
- `frontEnd-shopMax/tests/api-contract.test.js`

Artefatos implementados na Sprint 14:
- `frontEnd-adminPanel/tests/smoke.test.js`
- `frontEnd-shopMax/tests/smoke.test.js`

Artefatos implementados na Sprint 15:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/tests/smoke.test.js`

Artefatos implementados na Sprint 16:
- `frontEnd-adminPanel/main.js`
- `frontEnd-adminPanel/src/services/api.js`
- `frontEnd-shopMax/src/services/api.js`

### Regras de negocio consolidadas

#### Produto
- Produto sem estoque nao pode ser comprado.
- Produto inativo nao aparece na loja.
- SKU deve ser unico.
- Produto pode existir sem imagem; nesse caso a loja e o admin exibem fallback visual.
- Quando existir ao menos uma imagem cadastrada, exatamente uma deve ser principal.
- Produto pode ter preco promocional e variacoes.
- Produto com variacao deve controlar estoque por SKU variado quando aplicavel.

#### Pedido
- Pedido so e criado na confirmacao do checkout.
- Pedido nao pode avancar para envio sem pagamento aprovado, exceto fluxos especiais futuros.
- Pedido pode ser cancelado apenas antes do envio, salvo permissao administrativa especifica.
- Pedido entregue nao retorna a status anterior sem registro de auditoria.
- Checkout autenticado exige endereco, frete e metodo de pagamento validos.

#### Pagamento
- PIX pode aplicar desconto.
- Cartao pode ter parcelamento configuravel.
- Boleto deve possuir vencimento quando existir.
- Pagamento pendente nao baixa estoque definitivamente.

#### Estoque
- Toda movimentacao deve gerar historico.
- Venda aprovada reduz estoque.
- Cancelamento elegivel pode devolver estoque.
- Estoque minimo deve gerar alerta administrativo.
- Reserva de estoque deve ter regra clara entre checkout, aprovacao e expiracao.

#### Cupons e promocoes
- Cupom deve respeitar validade, limite de uso, valor minimo e elegibilidade.
- Cupom pode ser restringido por cliente, categoria ou campanha.
- Promocoes nao devem gerar preco final negativo ou inconsistente.

#### Usuarios e seguranca
- Email e CPF de cliente devem ser unicos.
- Senha deve ser armazenada com hash.
- Perfis administrativos controlam permissao por modulo e acao.
- Alteracoes sensiveis exigem autenticacao e auditoria.

### Roadmap tecnico

#### MVP
- [x] Backend inicializado com conexao, migracoes, seeders e autenticacao
- [x] Loja com home, busca, categoria, produto, carrinho e checkout
- [x] Perfil basico do cliente com pedidos e enderecos
- [x] Admin com login, dashboard, produtos, categorias, marcas, estoque e pedidos
- [x] Pagamento simulado, entrega basica e status de pedido
- [x] Banco com entidades centrais implementadas

Criterios de aceite do MVP:
- Cliente consegue concluir uma compra simulada do inicio ao fim.
- Admin consegue publicar produto, ajustar estoque e acompanhar pedido.
- Dados persistem corretamente apos reinicio do ambiente.
- Validado na Sprint 5 com cobertura automatizada dos fluxos centrais e consolidacao das regras de negocio pendentes.

#### V1
- [x] Cupons
- [x] Banners
- [x] Promocoes
- [x] Favoritos
- [x] Avaliacoes
- [x] Filtros avancados
- [x] Relatorios basicos
- [x] Logs administrativos

Criterios de aceite da V1:
- Promocoes e cupons alteram o valor do pedido de forma valida.
- Favoritos e avaliacoes ficam disponiveis na conta do cliente.
- Painel registra logs das operacoes administrativas sensiveis.
- Validado na Sprint 6 com APIs reais, loja integrada e cobertura automatizada dos novos modulos comerciais.

#### V2
- [ ] Recomendacoes por IA
- [ ] Comparador de produtos
- [ ] Cashback
- [ ] Programa de fidelidade
- [ ] Rastreamento real
- [ ] Chat
- [x] Notificacoes por e-mail
- [x] Carrinho abandonado
- [x] Relatorios avancados
- [x] Integracao operacional de rastreio com provider `mock`
- [x] Health operacional de integracoes administrativas
- [x] Probes administrativos de homologacao

Criterios de aceite da V2:
- Recursos avancados nao quebram o fluxo central de compra.
- Integracoes externas possuem tratamento minimo de erro e retentativa.
- Fundacao validada na Sprint 7 com contrato de notificacao monitorado, recuperacao de carrinho abandonado e relatorios avancados reais.
- Evolucao operacional validada na Sprint 8 com provider de e-mail configuravel e sincronizacao de rastreio no admin, ainda sem dependencia obrigatoria de transportadora real.
- Hardening validado na Sprint 9 com health operacional, timeout, retentativa e sincronizacao em lote no painel admin.
- Homologacao segura validada na Sprint 10 com probes administrativos de e-mail e rastreio, sem assumir credenciais reais no repositorio.

#### V3
- [ ] Multiplos vendedores
- [ ] Gestao de comissoes
- [ ] Integracoes reais com transportadoras
- [ ] Integracoes reais com gateways
- [ ] Integracao fiscal
- [ ] App mobile
- [ ] Painel BI
- [ ] Automacao de marketing
- [ ] IA para precificacao e estoque

Criterios de aceite da V3:
- Dominio suporta escalabilidade sem reestruturar entidades centrais.
- Novos fluxos multi-vendedor preservam auditoria, estoque e repasse financeiro.

### Estrutura inicial do banco de dados

#### Entidades nucleares
- `usuarios`: credenciais e dados basicos de autenticacao.
- `perfis`: papeis administrativos e de sistema.
- `permissoes`: acoes permitidas por modulo.
- `perfil_permissoes`: relacao N:N entre perfis e permissoes.
- `clientes`: dados de conta do comprador.
- `enderecos`: enderecos de entrega e cobranca.

#### Catalogo
- `categorias`: hierarquia e organizacao de catalogo.
- `marcas`: marcas dos produtos.
- `produtos`: informacoes principais do produto.
- `produto_imagens`: galeria e imagem principal.
- `produto_videos`: videos relacionados.
- `produto_variacoes`: SKU variado, atributos e precos especificos.
- `banners`: banners da home, categoria ou campanha.
- `promocoes`: campanhas comerciais.
- `promocao_itens`: relacao de campanhas com produtos ou categorias.

#### Operacao comercial
- `estoques`: saldo atual por produto ou variacao.
- `movimentacoes_estoque`: historico de entrada, saida, ajuste, reserva e devolucao.
- `carrinhos`: carrinho ativo por cliente ou sessao.
- `itens_carrinho`: itens temporarios do carrinho.
- `pedidos`: cabecalho do pedido.
- `itens_pedido`: itens comprados, preco unitario e subtotal congelados no momento da compra.
- `pagamentos`: status, metodo, valor e referencia de pagamento.
- `entregas`: frete, transportadora, rastreio e status logistico.
- `cupons`: regras comerciais do cupom.
- `cupom_usos`: rastreio de uso por cliente e pedido.

#### Experiencia e auditoria
- `favoritos`: wishlist do cliente.
- `avaliacoes`: nota, comentario e moderacao.
- `logs_sistema`: trilha de auditoria administrativa e tecnica.

#### Relacionamentos principais
- Um `cliente` pertence a um `usuario`.
- Um `cliente` possui muitos `enderecos`.
- Um `cliente` possui muitos `pedidos`.
- Um `cliente` possui muitos `favoritos`.
- Um `cliente` possui muitas `avaliacoes`.
- Um `perfil` possui muitas `permissoes` via `perfil_permissoes`.
- Um `produto` pertence a uma `categoria` e a uma `marca`.
- Uma `categoria` pode possuir categoria pai.
- Um `produto` possui muitas `produto_imagens`, `produto_videos` e `produto_variacoes`.
- Um `produto` ou `produto_variacao` possui um registro de `estoques` e muitas `movimentacoes_estoque`.
- Um `carrinho` possui muitos `itens_carrinho`.
- Um `pedido` possui muitos `itens_pedido`, pode possuir um `pagamento`, uma `entrega` e opcionalmente um `cupom`.
- Um `cupom` possui muitos `cupom_usos`.
- Uma `promocao` pode atingir muitos produtos ou categorias por meio de `promocao_itens`.
- `logs_sistema` pode referenciar `usuario`, modulo, entidade e identificador afetado.

### Validacoes obrigatorias de dominio
- Cadastro de cliente: nome obrigatorio, email valido e unico, CPF valido e unico, telefone valido, senha confirmada.
- Login: email obrigatorio, senha obrigatoria, bloqueio progressivo futuro apos tentativas excessivas.
- Produto: nome obrigatorio, SKU unico, preco >= 0, estoque inicial >= 0, categoria obrigatoria e marca obrigatoria; quando houver imagens, uma deve ser principal; uploads aceitam apenas jpg, jpeg, png, webp, mp4 e webm, com validacao por assinatura binaria e limite de tamanho.
- Carrinho: quantidade > 0 e limitada ao estoque disponivel.
- Checkout: endereco, frete e pagamento obrigatorios para concluir.
- Pedido: nao pode existir sem itens validos.
- Cupom: validar data, status, limite, elegibilidade e conflito com outras promocoes.
- Avaliacao: cliente deve possuir compra elegivel do produto para avaliar.

### Itens para mover futuramente para `Archive.md`
- Marcos concluidos do roadmap quando deixarem de orientar trabalho ativo.
- Decisoes substituidas por novas decisoes arquiteturais.
- Descobertas temporarias ja resolvidas.
- Historico de setup antigo apos estabilizacao dos scripts oficiais.

## Interfaces and Dependencies

### Frontend
- HTML
- CSS
- JavaScript
- Bootstrap

### Backend
- Node.js
- Express
- MySQL
- `mysql2`
- `cors`
- `dotenv`
- `multer`
- `file-type`
- `nodemailer`

### Dependencias recomendadas para backlog tecnico
- `bcrypt` ou equivalente para hash de senha
- `jsonwebtoken` ou equivalente para autenticacao
- `zod`, `yup` ou equivalente para validacao
- biblioteca de testes para backend
- biblioteca de testes para frontend

### Interfaces internas
- Loja consome API publica de catalogo, autenticacao, carrinho, checkout, pedidos e favoritos.
- Admin consome API autenticada de catalogo, estoque, pedidos, clientes, cupons, promocoes, relatorios e logs.
- Backend centraliza regras de dominio e persistencia.

### Dependencias externas futuras
- Gateway de pagamento real
- Servico de notificacao por e-mail
- Servico de notificacao por WhatsApp
- Transportadoras e rastreamento
- Emissao fiscal

### Guia operacional do MVP local

#### Como instalar o projeto
1. Executar `npm run install:all` na raiz.
2. Confirmar que as dependencias foram resolvidas para backend, loja e admin.

#### Como configurar `.env`
1. Criar `backendAPI-shopMax/.env` a partir de `backendAPI-shopMax/.env.example`.
2. Preencher no minimo `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `JWT_SECRET`.
3. Para MVP local, manter `EMAIL_PROVIDER=simulated`, `TRACKING_PROVIDER=mock`, `INTEGRATIONS_LIVE_ENABLED=false` e `INTEGRATION_SANDBOX_ENABLED=true`.
4. Nao commitar `.env`; o arquivo ja esta protegido em `.gitignore`.

#### Como criar o banco
1. Executar `npm run db:create --workspace backendAPI-shopMax`.

#### Como rodar migrations
1. Executar `npm run db:migrate --workspace backendAPI-shopMax`.

#### Como rodar seeders
1. Executar `npm run db:seed --workspace backendAPI-shopMax`.
2. Para massa ampliada de homologacao local, executar `npm run db:seed:fake --workspace backendAPI-shopMax`.

#### Como resetar o banco
1. Executar `npm run db:reset --workspace backendAPI-shopMax`.
2. Usar este comando como fluxo padrao antes de testes E2E e antes da release local.

#### Como iniciar o backend
1. Executar `npm run dev:api` na raiz ou `npm run dev --workspace backendAPI-shopMax`.
2. Validar `GET http://127.0.0.1:3000/api/health`.

#### Como iniciar o admin
1. Executar `npm run dev:admin`.
2. Abrir a URL exibida pelo Vite para o painel administrativo local.

#### Como iniciar a loja
1. Executar `npm run dev:shop`.
2. Abrir a URL exibida pelo Vite para a loja local.

#### Como rodar testes
1. Executar `npm run test --workspace backendAPI-shopMax`.
2. Executar `npm run test --workspace frontEnd-adminPanel`.
3. Executar `npm run test --workspace frontEnd-shopMax`.

#### Como rodar E2E browser
1. Executar `npm run db:reset --workspace backendAPI-shopMax`.
2. Executar `npm run test:e2e --workspace backendAPI-shopMax`.
3. Executar `npm run test:e2e:browser`.

#### Como validar upload
1. Autenticar no admin com o usuario administrativo semeado.
2. Criar categoria e marca, depois cadastrar produto com `mainImage`.
3. Confirmar preview, persistencia e entrega do arquivo em `/uploads/products/images/...`.
4. Limites atuais: imagem ate `5MB`, video ate `20MB`, com bloqueio de extensao perigosa e validacao binaria por conteudo.

#### Como validar checkout
1. Registrar cliente na loja.
2. Buscar produto ativo com estoque e adiciona-lo ao carrinho.
3. Ir para `#/checkout`, preencher endereco e concluir pagamento simulado.
4. Confirmar pedido criado em `#/orders/:id`.
5. Validar no admin que o pedido aparece e aceita transicao de status permitida.

### Pendencias atuais
- Configurar credenciais reais de SMTP no ambiente local ou secreto da esteira usando `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` e `SMTP_FROM`.
- Configurar provider real de rastreio com `TRACKING_PROVIDER`, `TRACKING_BASE_URL` e `TRACKING_API_TOKEN`.
- Habilitar `INTEGRATIONS_LIVE_ENABLED=true` e `INTEGRATION_SANDBOX_ENABLED=false` somente no momento da homologacao externa real.
- Evoluir o gerenciamento de midia do admin com ordenacao visual e edicao rica caso o catalogo passe a exigir curadoria intensiva.
- Opcionalmente ampliar a suite Playwright com cenarios de favoritos, cupons e cancelamento de pedido se a regressao visual do MVP passar a exigir cobertura mais ampla.
- Opcionalmente endurecer `CORS` com whitelist por ambiente quando a homologacao externa real for iniciada; no MVP local o modo aberto permanece intencional e documentado.

### Proxima sprint recomendada
- `Sprint 18 - Homologacao externa real controlada`: preencher credenciais fora do repositorio, habilitar live de forma temporaria, executar `integrations:validate-live` com providers reais e registrar o resultado no `Decision Log`.

### Contratos operacionais atuais
- Notificacao por e-mail suporta `EMAIL_PROVIDER=simulated` e `EMAIL_PROVIDER=smtp`, com fallback auditado em `logs_sistema`.
- Rastreio suporta `TRACKING_PROVIDER=mock` e contrato HTTP futuro via `TRACKING_BASE_URL`, sem alterar entidades centrais.
- Integracoes expostas ao admin incluem `admin/integrations/status` e `admin/orders/tracking/sync-pending` para monitoramento e acao operacional em lote.
- Homologacao administrativa exposta ao admin inclui `admin/integrations/email/test` e `admin/integrations/tracking/test`.
- Homologacao live assistida exposta ao admin inclui `admin/integrations/validate-live` e ao backend inclui `npm run integrations:validate-live`.
- Homologacao visual do MVP em browser fica exposta na raiz via `npm run test:e2e:browser`, com Playwright subindo backend, loja e admin locais.
- `CORS` do backend permanece aberto via `cors()` para o ambiente local atual; antes da homologacao externa real, decidir whitelist por ambiente sem alterar o contrato do MVP local.

### Riscos arquiteturais em monitoramento
- Risco de duplicar regra de negocio entre admin, loja e backend.
- Risco de acoplamento excessivo entre produto simples e produto com variacoes.
- Risco de inconsistencias de estoque sem transacao e maquina de estados clara.
- Risco de pedido e pagamento divergirem sem reconciliacao.
- Risco de roadmap crescer antes da consolidacao do dominio central.

## Definition of Done (DoD)

Uma tarefa so pode ser considerada concluida quando:

[ ] Codigo implementado
[ ] Codigo testado
[x] Testes passando
[x] Build passando
[x] Sem erros de lint
[x] Banco validado
[x] APIs validadas
[x] UI funcionando
[x] Variaveis de ambiente documentadas
[x] Documentacao atualizada
[x] PLANS.md atualizado
[x] Progress atualizado
[x] Decision Log atualizado
