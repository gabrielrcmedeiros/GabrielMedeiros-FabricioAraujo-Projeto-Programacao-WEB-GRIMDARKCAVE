-- Consultas de conferência do banco (tabelas criadas pelo Hibernate)

USE grimdarkcave;

SHOW TABLES;

-- Catálogo e estoque
SELECT codigo, nome, categoria, valor, promo, quantidade, destaque FROM produto;

-- Clientes (senha armazenada como hash SHA-256)
SELECT codigo, nome, email, perfil, senha, data_cadastro FROM cliente;

-- Pedidos com o nome do cliente
SELECT p.codigo_pedido, c.nome AS cliente, p.valor_total, p.data_pedido
FROM pedido p
JOIN cliente c ON c.codigo = p.codigo_cliente
ORDER BY p.codigo_pedido DESC;

-- Itens de cada pedido com o nome do jogo
SELECT i.codigo_pedido, j.nome AS jogo, i.quantidade, i.valor
FROM item_pedido i
JOIN produto j ON j.codigo = i.codigo_produto
ORDER BY i.codigo_pedido DESC;

-- Chaves geradas (uma por unidade comprada)
SELECT k.chave_digital, j.nome AS jogo, c.email, k.data_compra
FROM chave k
JOIN produto j ON j.codigo = k.codigo_produto
JOIN cliente c ON c.codigo = k.codigo_cliente
ORDER BY k.codigo DESC;
