package com.fatec.grimdarkcave.config;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fatec.grimdarkcave.service.RegraNegocioException;

/* Converte erros em respostas JSON {"mensagem": "..."} */
@RestControllerAdvice
public class TratadorErros {

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<Map<String, String>> tratarRegraNegocio(RegraNegocioException erro) {
        return ResponseEntity.status(erro.getStatus()).body(Map.of("mensagem", erro.getMessage()));
    }

    /* Violações de restrição do banco */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarIntegridade(DataIntegrityViolationException erro) {
        /* Mensagem original do banco */
        Throwable causa = erro;
        while (causa.getCause() != null && causa.getCause() != causa) {
            causa = causa.getCause();
        }
        String detalhe = causa.getMessage() == null ? "" : causa.getMessage();

        String mensagem;
        Matcher coluna = Pattern.compile("column '(\\w+)'").matcher(detalhe);
        if (detalhe.contains("Data too long") && coluna.find()) {
            mensagem = "O campo " + coluna.group(1) + " é longo demais para o banco de dados.";
        } else if (detalhe.contains("Duplicate entry")) {
            mensagem = "Já existe um registro com esses dados.";
        } else if (detalhe.contains("foreign key")) {
            mensagem = "Este registro está em uso por outros dados e não pode ser removido.";
        } else {
            mensagem = "A operação viola uma regra do banco de dados.";
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensagem", mensagem));
    }
}
