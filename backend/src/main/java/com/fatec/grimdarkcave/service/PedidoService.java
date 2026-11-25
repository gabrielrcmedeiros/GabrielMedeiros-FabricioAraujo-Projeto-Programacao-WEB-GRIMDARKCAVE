package com.fatec.grimdarkcave.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fatec.grimdarkcave.model.Chave;
import com.fatec.grimdarkcave.model.ItemPedido;
import com.fatec.grimdarkcave.model.Pedido;
import com.fatec.grimdarkcave.model.Produto;
import com.fatec.grimdarkcave.repository.ChaveRepository;
import com.fatec.grimdarkcave.repository.ClienteRepository;
import com.fatec.grimdarkcave.repository.PedidoRepository;
import com.fatec.grimdarkcave.repository.ProdutoRepository;

/* Regras da compra: estoque, total e geração de chaves */
@Service
public class PedidoService {
    @Autowired
    private ProdutoRepository bdProduto;
    @Autowired
    private ClienteRepository bdCliente;
    @Autowired
    private PedidoRepository bdPedido;
    @Autowired
    private ChaveRepository bdChave;

    /* Transação única: qualquer falha desfaz a compra inteira */
    @Transactional
    public Pedido finalizarCompra(Pedido dados) {
        if (!bdCliente.existsById(dados.getCodigoCliente())) {
            throw new RegraNegocioException(HttpStatus.UNAUTHORIZED, "Faça login antes de finalizar a compra.");
        }
        if (dados.getItens() == null || dados.getItens().isEmpty()) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "A cesta está vazia.");
        }

        Pedido pedido = new Pedido();
        pedido.setCodigoCliente(dados.getCodigoCliente());
        double total = 0;

        for (ItemPedido recebido : dados.getItens()) {
            int codigoProduto = recebido.getProduto() != null ? recebido.getProduto().getCodigo() : 0;
            Produto produto = bdProduto.findById(codigoProduto).orElseThrow(() ->
                    new RegraNegocioException(HttpStatus.NOT_FOUND, "Um dos jogos da cesta não existe mais no catálogo."));

            int quantidade = recebido.getQuantidade();
            if (quantidade <= 0) {
                throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Quantidade inválida para " + produto.getNome() + ".");
            }
            if (quantidade > produto.getQuantidade()) {
                throw new RegraNegocioException(HttpStatus.CONFLICT, "Estoque insuficiente para " + produto.getNome()
                        + ". Disponível: " + produto.getQuantidade() + " unidade(s).");
            }

            /* Preço sempre lido do banco */
            double preco = produto.precoAtual();
            produto.setQuantidade(produto.getQuantidade() - quantidade);

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(quantidade);
            item.setValor(preco);
            item.setPedido(pedido);
            pedido.getItens().add(item);
            total += preco * quantidade;
        }

        pedido.setValorTotal(Math.round(total * 100) / 100.0);
        Pedido salvo = bdPedido.save(pedido);

        /* Uma chave por unidade comprada */
        for (ItemPedido item : salvo.getItens()) {
            for (int i = 0; i < item.getQuantidade(); i++) {
                Chave chave = new Chave();
                chave.setChaveDigital(gerarChaveUnica());
                chave.setProduto(item.getProduto());
                chave.setCodigoCliente(salvo.getCodigoCliente());
                chave.setCodigoPedido(salvo.getCodigoPedido());
                bdChave.save(chave);
            }
        }
        return salvo;
    }

    private String gerarChaveUnica() {
        String chave;
        do {
            chave = Seguranca.gerarChaveAtivacao();
        } while (bdChave.existsByChaveDigital(chave));
        return chave;
    }
}
