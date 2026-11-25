package com.fatec.grimdarkcave.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/* Jogo do catálogo (tabela produto) */
@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigo;
    private String nome;
    private String categoria;
    private String desenvolvedora;
    private String plataforma;
    @Column(length = 1000)
    private String descritivo;
    private double valor;
    /* Valor promocional (0 = sem promoção) */
    private double promo;
    /* Estoque de chaves */
    private int quantidade;
    /* Ordem no banner (0 = fora do banner) */
    private int destaque;
    /* Arquivo da pasta public ou URL da capa */
    @Column(length = 1000)
    private String imagem;

    public int getCodigo() {
        return codigo;
    }
    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public String getDesenvolvedora() {
        return desenvolvedora;
    }
    public void setDesenvolvedora(String desenvolvedora) {
        this.desenvolvedora = desenvolvedora;
    }
    public String getPlataforma() {
        return plataforma;
    }
    public void setPlataforma(String plataforma) {
        this.plataforma = plataforma;
    }
    public String getDescritivo() {
        return descritivo;
    }
    public void setDescritivo(String descritivo) {
        this.descritivo = descritivo;
    }
    public double getValor() {
        return valor;
    }
    public void setValor(double valor) {
        this.valor = valor;
    }
    public double getPromo() {
        return promo;
    }
    public void setPromo(double promo) {
        this.promo = promo;
    }
    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
    public int getDestaque() {
        return destaque;
    }
    public void setDestaque(int destaque) {
        this.destaque = destaque;
    }
    public String getImagem() {
        return imagem;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    /* Preço cobrado: o promocional, se houver */
    public double precoAtual() {
        return promo > 0 ? promo : valor;
    }
}
