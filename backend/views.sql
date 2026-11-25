-- Views de consulta e chaves estrangeiras do banco grimdarkcave
-- Executar com a API já iniciada (as tabelas são criadas pelo Hibernate)

-- Resumo geral da loja
CREATE OR REPLACE VIEW grimdarkcave.vw_resumo AS
SELECT
  (SELECT COUNT(*) FROM grimdarkcave.produto)                    AS `Jogos no catálogo`,
  (SELECT SUM(quantidade) FROM grimdarkcave.produto)             AS `Chaves em estoque`,
  (SELECT COUNT(*) FROM grimdarkcave.cliente WHERE perfil = 'CLIENTE') AS `Clientes`,
  (SELECT COUNT(*) FROM grimdarkcave.pedido)                     AS `Pedidos`,
  (SELECT COUNT(*) FROM grimdarkcave.chave)                      AS `Chaves vendidas`,
  (SELECT CONCAT('R$ ', FORMAT(COALESCE(SUM(valor_total), 0), 2, 'pt_BR')) FROM grimdarkcave.pedido) AS `Faturamento`;

-- Catálogo com preço atual, desconto e situação do estoque
CREATE OR REPLACE VIEW grimdarkcave.vw_catalogo AS
SELECT
  p.codigo     AS `Código`,
  p.nome       AS `Jogo`,
  p.categoria  AS `Categoria`,
  CONCAT('R$ ', FORMAT(p.valor, 2, 'pt_BR')) AS `Preço cheio`,
  CONCAT('R$ ', FORMAT(CASE WHEN p.promo > 0 THEN p.promo ELSE p.valor END, 2, 'pt_BR')) AS `Preço atual`,
  CASE WHEN p.promo > 0 THEN CONCAT('-', ROUND((1 - p.promo / p.valor) * 100), '%') ELSE '-' END AS `Desconto`,
  p.quantidade AS `Estoque`,
  CASE WHEN p.quantidade = 0 THEN 'Esgotado'
       WHEN p.quantidade <= 5 THEN 'Últimas unidades'
       ELSE 'Disponível' END AS `Situação`
FROM grimdarkcave.produto p
ORDER BY p.codigo;

-- Clientes com quantidade de pedidos e total gasto
CREATE OR REPLACE VIEW grimdarkcave.vw_clientes AS
SELECT
  c.codigo AS `Código`,
  c.nome   AS `Nome`,
  c.email  AS `E-mail`,
  c.perfil AS `Perfil`,
  DATE_FORMAT(c.data_cadastro, '%d/%m/%Y') AS `Cadastro`,
  CONCAT(LEFT(c.senha, 16), '...') AS `Senha (hash SHA-256)`,
  COUNT(pe.codigo_pedido) AS `Pedidos`,
  CONCAT('R$ ', FORMAT(COALESCE(SUM(pe.valor_total), 0), 2, 'pt_BR')) AS `Total gasto`
FROM grimdarkcave.cliente c
LEFT JOIN grimdarkcave.pedido pe ON pe.codigo_cliente = c.codigo
GROUP BY c.codigo, c.nome, c.email, c.perfil, c.data_cadastro, c.senha;

-- Pedidos com cliente, data, quantidade de chaves e total
CREATE OR REPLACE VIEW grimdarkcave.vw_pedidos AS
SELECT
  pe.codigo_pedido AS `Pedido`,
  c.nome           AS `Cliente`,
  DATE_FORMAT(pe.data_pedido, '%d/%m/%Y %H:%i') AS `Data`,
  SUM(i.quantidade) AS `Chaves`,
  CONCAT('R$ ', FORMAT(pe.valor_total, 2, 'pt_BR')) AS `Total`
FROM grimdarkcave.pedido pe
JOIN grimdarkcave.cliente c     ON c.codigo = pe.codigo_cliente
JOIN grimdarkcave.item_pedido i ON i.codigo_pedido = pe.codigo_pedido
GROUP BY pe.codigo_pedido, c.nome, pe.data_pedido, pe.valor_total
ORDER BY pe.codigo_pedido DESC;

-- Chaves de ativação entregues
CREATE OR REPLACE VIEW grimdarkcave.vw_chaves AS
SELECT
  k.chave_digital AS `Chave`,
  p.nome          AS `Jogo`,
  p.plataforma    AS `Plataforma`,
  c.nome          AS `Cliente`,
  k.codigo_pedido AS `Pedido`,
  DATE_FORMAT(k.data_compra, '%d/%m/%Y %H:%i') AS `Data`
FROM grimdarkcave.chave k
JOIN grimdarkcave.produto p ON p.codigo = k.codigo_produto
JOIN grimdarkcave.cliente c ON c.codigo = k.codigo_cliente
ORDER BY k.codigo DESC;

-- Ranking de vendas por jogo
CREATE OR REPLACE VIEW grimdarkcave.vw_vendas_por_jogo AS
SELECT
  p.nome            AS `Jogo`,
  SUM(i.quantidade) AS `Unidades vendidas`,
  CONCAT('R$ ', FORMAT(SUM(i.quantidade * i.valor), 2, 'pt_BR')) AS `Faturamento`,
  p.quantidade      AS `Estoque atual`
FROM grimdarkcave.item_pedido i
JOIN grimdarkcave.produto p ON p.codigo = i.codigo_produto
GROUP BY p.codigo, p.nome, p.quantidade
ORDER BY SUM(i.quantidade) DESC;

-- Chaves estrangeiras de cliente e pedido (executar uma única vez por banco)
ALTER TABLE grimdarkcave.pedido
  ADD CONSTRAINT fk_pedido_cliente FOREIGN KEY (codigo_cliente) REFERENCES grimdarkcave.cliente (codigo);

ALTER TABLE grimdarkcave.chave
  ADD CONSTRAINT fk_chave_cliente FOREIGN KEY (codigo_cliente) REFERENCES grimdarkcave.cliente (codigo),
  ADD CONSTRAINT fk_chave_pedido  FOREIGN KEY (codigo_pedido)  REFERENCES grimdarkcave.pedido (codigo_pedido);

-- Relacionamentos entre as tabelas
SELECT TABLE_NAME             AS `Tabela`,
       COLUMN_NAME            AS `Coluna`,
       REFERENCED_TABLE_NAME  AS `Referencia a`,
       REFERENCED_COLUMN_NAME AS `Coluna referenciada`
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'grimdarkcave' AND REFERENCED_TABLE_NAME IS NOT NULL;