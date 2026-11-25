# GRIMDARK CAVE

Loja de chaves digitais de jogos sombrios. Projeto de Programação Web (P1 + P2) de **Gabriel Medeiros** e **Fabrício Araujo**.

| Camada | Tecnologia |
| --- | --- |
| Front-end | Angular 22 (componentes standalone, signals, controle de fluxo `@if`/`@for`), Bootstrap 5 |
| Back-end | Spring Boot 4.1 (Java 17), Spring Web MVC, Spring Data JPA / Hibernate |
| Banco | MySQL 8 |

```
GRIMDARKCAVE/
├── backend/            API RESTful Spring Boot (porta 8081)
│   ├── src/main/java/com/fatec/grimdarkcave/
│   │   ├── model/        entidades JPA (tabelas)
│   │   ├── repository/   acesso ao banco (JpaRepository + @Query)
│   │   ├── controller/   endpoints REST (/api/...)
│   │   ├── service/      regra de negócio da compra e segurança
│   │   └── config/       carga inicial e tratamento de erros
│   ├── requisicoes.http  exemplos de chamadas para testar a API
│   └── consultas.sql     SELECTs para mostrar o banco
├── src/app/            front-end Angular
│   ├── model/            classes/interfaces espelhando o JSON da API
│   ├── services/         HttpClient + sessão + cesta + notificações
│   ├── guards/           proteção das rotas /biblioteca e /admin
│   └── <telas>/          vitrine, busca, detalhe, cesta, login, esqueci, biblioteca, admin
└── public/             capas dos jogos e logo
```

## Como rodar

### 1. Banco de dados
Basta ter o **MySQL** rodando em `localhost:3306`. O banco `grimdarkcave` e as tabelas são criados sozinhos na primeira execução.

Usuário e senha usados: `root` / `123456` (iguais aos exemplos da disciplina). Se o seu MySQL usa outra senha, altere em `backend/src/main/resources/application.properties`.

### 2. Back-end (API)
```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```
Ou abra a pasta `backend` no VS Code / IntelliJ e execute `GrimdarkCaveApplication`.

Na primeira subida, a classe `CargaInicial` grava os 12 jogos da P1 e a conta de administrador. Para testar, abra http://localhost:8081/api/produto: deve aparecer o JSON do catálogo.

### 3. Front-end
```bash
npm install
npm start          # ou: ng serve
```
Acesse http://localhost:4200.

### Contas
| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador (acessa a **Forja**) | `admin@grimdark.com` | `admin123` |
| Cliente | crie pelo site em *Entrar → Criar conta* | |

> Os usuários da P1 ficavam no `localStorage` e não existem no banco: crie a conta novamente.

## API REST

| Método | Rota | O que faz | Usado em |
| --- | --- | --- | --- |
| GET | `/api/produto` | Catálogo completo | Vitrine, Admin, Cesta (confere preço/estoque) |
| GET | `/api/produto/destaques` | Jogos do banner | Vitrine |
| GET | `/api/produto/categorias` | Categorias distintas | Busca, Admin |
| GET | `/api/produto/busca?termo=` / `?categoria=` | Busca textual ou por categoria | Busca, Detalhe |
| GET | `/api/produto/{codigo}` | Um jogo | Detalhe |
| POST | `/api/produto` | Cadastra jogo (201) | Admin |
| PUT | `/api/produto/{codigo}` | Altera jogo | Admin |
| DELETE | `/api/produto/{codigo}` | Exclui jogo (204, ou 409 se já vendido) | Admin |
| POST | `/api/cliente` | Cadastro (201, ou 409 se o e-mail já existir) | Login → Criar conta |
| POST | `/api/cliente/login` | Login (200, ou 401) | Login |
| GET | `/api/cliente/{codigo}` | Dados do cliente | requisicoes.http |
| POST | `/api/cliente/recuperarSenha` | Gera código de 6 caracteres (15 min) | Esqueci minha senha |
| PATCH | `/api/cliente/redefinirSenha` | Troca a senha com o código | Esqueci minha senha |
| POST | `/api/pedido` | Finaliza a compra (201, ou 409 sem estoque) | Cesta |
| GET | `/api/pedido/{codigo}` | Um pedido | requisicoes.http |
| GET | `/api/pedido/cliente/{codigo}` | Histórico de pedidos | Biblioteca → Pedidos |
| GET | `/api/chave/cliente/{codigo}` | Chaves de ativação | Biblioteca → Chaves |

Os erros sempre voltam como `{"mensagem": "..."}` com o status HTTP adequado (400, 401, 404, 409), e o front mostra essa mensagem na notificação.

## Banco de dados

```
cliente (1) ──< pedido (1) ──< item_pedido >── (1) produto
   │                                              │
   └──────────────< chave >───────────────────────┘
```
- **produto**: catálogo e estoque.
- **cliente**: senha guardada como hash SHA-256, nunca em texto puro; `perfil` CLIENTE ou ADMIN.
- **pedido / item_pedido**: compra finalizada; o item guarda o preço cobrado naquele momento.
- **chave**: uma chave de ativação única por unidade comprada.

## Regras de negócio no servidor
- O **preço é calculado pelo back-end** a partir do banco; o front envia só o código do jogo e a quantidade.
- A compra é `@Transactional`: confere o estoque de todos os itens, baixa o estoque e gera as chaves. Se um item falhar, nada é gravado.
- A senha nunca sai da API (`@JsonProperty(WRITE_ONLY)`) e o front não consegue se cadastrar como ADMIN (`READ_ONLY`).
- Jogo que já foi vendido não pode ser excluído (o histórico de pedidos depende dele); basta zerar o estoque.
- Recuperação de senha: código aleatório com validade de 15 minutos. Como o projeto não tem servidor de e-mail, o código aparece numa "caixa de e-mail simulada" na tela.

## O que mudou da P1 para a P2
- Catálogo, cadastro, login, recuperação de senha, compra e biblioteca saíram do código fixo/`localStorage` e passaram a usar a API + MySQL. Só a cesta continua no `localStorage` até a finalização, como no exemplo da disciplina.
- Services com `HttpClient` (`produto-service`, `cliente-service`, `pedido-service`) e estado com **signals** (`SessaoService`, `CestaService`).
- Guardas de rota: `/biblioteca` exige login; `/admin` exige perfil administrador.
- Painel **Forja** para o administrador com CRUD completo de jogos.
- Notificações flutuantes no lugar dos `alert()`, carregamento com esqueleto, tela de erro quando a API está fora do ar.
- Banner de destaques, filtros e ordenação na vitrine, jogos relacionados no detalhe, contador na cesta, botão para copiar a chave, histórico de pedidos.
- Preços em formato brasileiro (`R$ 1.234,56`), validação real dos dígitos do CPF.
- Componente `card-jogo` reaproveitado na vitrine, na busca e no detalhe (antes o código de "adicionar à cesta" era repetido em 3 telas).
- Rota de detalhe com o código na URL (`/detalhe/4`), assim a página funciona ao recarregar ou compartilhar o link.
- Imagens otimizadas (de 16 MB para 1,5 MB), o que deixa o carregamento bem mais rápido.

## Roteiro sugerido para a apresentação
1. **Banco vazio → API sobe**: mostrar o console do Spring e o `SHOW TABLES` / `SELECT * FROM produto` (`backend/consultas.sql`).
2. **Vitrine**: banner, filtros e busca; abrir o DevTools (aba Rede) e mostrar o `GET /api/produto`.
3. **Cadastro e login**: criar uma conta; mostrar no banco que a senha está em hash.
4. **Compra**: adicionar jogos, finalizar, mostrar as chaves na biblioteca e o estoque baixando no banco.
5. **Erro de negócio**: colocar as 5 unidades de Blasphemous na cesta; numa janela anônima, entrar como admin e mudar o estoque dele para 2; voltar e clicar em Finalizar. A API responde 409, a mensagem aparece na notificação e a cesta é ajustada.
6. **Esqueci a senha**: gerar o código e redefinir.
7. **Forja (admin)**: entrar como admin, cadastrar, editar e excluir um jogo (POST, PUT, DELETE). Tentar excluir um jogo já vendido para mostrar a proteção.
