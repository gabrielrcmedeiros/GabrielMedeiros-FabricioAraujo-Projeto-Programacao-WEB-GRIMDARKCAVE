package com.fatec.grimdarkcave.service;

import org.springframework.http.HttpStatus;

/* Erro de regra de negócio com o status HTTP da resposta */
public class RegraNegocioException extends RuntimeException {
    private final HttpStatus status;

    public RegraNegocioException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
