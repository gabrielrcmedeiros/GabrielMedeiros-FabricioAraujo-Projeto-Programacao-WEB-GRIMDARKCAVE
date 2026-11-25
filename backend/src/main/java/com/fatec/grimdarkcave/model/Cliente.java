package com.fatec.grimdarkcave.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/* Cliente cadastrado (tabela cliente) */
@Entity
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigo;
    private String nome;
    @Column(unique = true, nullable = false)
    private String email;
    /* Recebida no JSON, mas nunca devolvida */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
    private String cpf;
    private String telefone;
    /* CLIENTE ou ADMIN; ignorado quando enviado pelo front */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String perfil;
    /* Recuperação de senha (fora do JSON) */
    @JsonIgnore
    private String codigoRecuperacao;
    @JsonIgnore
    private LocalDateTime validadeCodigo;
    @CreationTimestamp
    private LocalDateTime dataCadastro;

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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    public String getPerfil() {
        return perfil;
    }
    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
    public String getCodigoRecuperacao() {
        return codigoRecuperacao;
    }
    public void setCodigoRecuperacao(String codigoRecuperacao) {
        this.codigoRecuperacao = codigoRecuperacao;
    }
    public LocalDateTime getValidadeCodigo() {
        return validadeCodigo;
    }
    public void setValidadeCodigo(LocalDateTime validadeCodigo) {
        this.validadeCodigo = validadeCodigo;
    }
    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
