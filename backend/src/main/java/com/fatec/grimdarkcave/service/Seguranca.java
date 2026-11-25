package com.fatec.grimdarkcave.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/* Hash de senha e geração de códigos aleatórios */
public final class Seguranca {
    private static final SecureRandom ALEATORIO = new SecureRandom();
    /* Sem 0, O, 1 e I, para facilitar a leitura */
    private static final String ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private Seguranca() {
    }

    /* Hash SHA-256 da senha */
    public static String gerarHash(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 indisponivel", e);
        }
    }

    /* Código aleatório do tamanho informado */
    public static String gerarCodigo(int tamanho) {
        StringBuilder codigo = new StringBuilder();
        for (int i = 0; i < tamanho; i++) {
            codigo.append(ALFABETO.charAt(ALEATORIO.nextInt(ALFABETO.length())));
        }
        return codigo.toString();
    }

    /* Chave no formato XXXXX-XXXXX-XXXXX */
    public static String gerarChaveAtivacao() {
        return gerarCodigo(5) + "-" + gerarCodigo(5) + "-" + gerarCodigo(5);
    }
}
