Melhorar UI/UX em relacao a criacao de um novo produto, especificamente em SKU. Deve ser criado o valor automaticamente, o ADMIN nao precisa preencher esse valor

A pagina "/produto" precisa ser mais fiel a imagem "product.png.png" :
- Consigo visualizar somente uma imagem na galera de fotos do produto, deveria aparecer em um componente lateral, todas as imagens do produto, existe esse componente na imagem de referencia

Ao tentar cadastrar uma nova conta no sistema ShopMax, acontece o seguinte erro:
- No console: api.js:7  POST http://127.0.0.1:3000/api/auth/register/customer 422 (Unprocessable Entity)
- No console: api.js:22 Uncaught (in promise) Error: VALIDATION_ERROR
    at request (api.js:22:11)
    at async HTMLFormElement.<anonymous> (main.js:684:5)

No sistema de Admin, o ADMIN tem que ter a opção de editar os Editar os Produtos, Marcas, Categorias, Cupons, Promotions