package com.fatec.grimdarkcave.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.grimdarkcave.model.Chave;
import com.fatec.grimdarkcave.repository.ChaveRepository;

/* Chaves de ativação: /api/chave */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chave")
public class ChaveController {
    @Autowired
    private ChaveRepository bd;

    /* GET /api/chave/cliente/{codigo} */
    @GetMapping("/cliente/{codigo}")
    public List<Chave> listarPorCliente(@PathVariable("codigo") int codigo) {
        return bd.findByCodigoClienteOrderByCodigoDesc(codigo);
    }
}
