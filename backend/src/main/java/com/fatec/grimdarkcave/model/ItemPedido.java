package com.fatec.grimdarkcave.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/* Item de um pedido (tabela item_pedido) */
@Entity
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigoItemPedido;
    @ManyToOne(optional = false)
    @JoinColumn(name = "codigoProduto", nullable = false)
    private Produto produto;
    private int quantidade;
    /* Preço unitário no momento da compra */
    private double valor;
    /* Fora do JSON para evitar referência circular */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "codigoPedido", nullable = false)
    private Pedido pedido;

    public int getCodigoItemPedido() {
        return codigoItemPedido;
    }
    public void setCodigoItemPedido(int codigoItemPedido) {
        this.codigoItemPedido = codigoItemPedido;
    }
    public Produto getProduto() {
        return produto;
    }
    public void setProduto(Produto produto) {
        this.produto = produto;
    }
    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
    public double getValor() {
        return valor;
    }
    public void setValor(double valor) {
        this.valor = valor;
    }
    public Pedido getPedido() {
        return pedido;
    }
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
}
