package com.fatec.grimdarkcave.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/* Chave de ativação, uma por unidade comprada (tabela chave) */
@Entity
public class Chave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigo;
    @Column(unique = true, nullable = false, length = 20)
    private String chaveDigital;
    @ManyToOne(optional = false)
    @JoinColumn(name = "codigoProduto", nullable = false)
    private Produto produto;
    private int codigoCliente;
    private int codigoPedido;
    @CreationTimestamp
    private LocalDateTime dataCompra;

    public int getCodigo() {
        return codigo;
    }
    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    public String getChaveDigital() {
        return chaveDigital;
    }
    public void setChaveDigital(String chaveDigital) {
        this.chaveDigital = chaveDigital;
    }
    public Produto getProduto() {
        return produto;
    }
    public void setProduto(Produto produto) {
        this.produto = produto;
    }
    public int getCodigoCliente() {
        return codigoCliente;
    }
    public void setCodigoCliente(int codigoCliente) {
        this.codigoCliente = codigoCliente;
    }
    public int getCodigoPedido() {
        return codigoPedido;
    }
    public void setCodigoPedido(int codigoPedido) {
        this.codigoPedido = codigoPedido;
    }
    public LocalDateTime getDataCompra() {
        return dataCompra;
    }
    public void setDataCompra(LocalDateTime dataCompra) {
        this.dataCompra = dataCompra;
    }
}
