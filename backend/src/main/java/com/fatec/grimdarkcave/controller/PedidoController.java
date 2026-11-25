package com.fatec.grimdarkcave.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.grimdarkcave.model.Pedido;
import com.fatec.grimdarkcave.repository.PedidoRepository;
import com.fatec.grimdarkcave.service.PedidoService;
import com.fatec.grimdarkcave.service.RegraNegocioException;

/* Pedidos: /api/pedido */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/pedido")
public class PedidoController {
    @Autowired
    private PedidoService service;
    @Autowired
    private PedidoRepository bd;

    /* POST /api/pedido: finaliza a compra (201) */
    @PostMapping
    public ResponseEntity<Pedido> finalizar(@RequestBody Pedido obj) {
        Pedido salvo = service.finalizarCompra(obj);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /* GET /api/pedido/{codigo} */
    @GetMapping("/{codigo}")
    public Pedido carregar(@PathVariable("codigo") int codigo) {
        return bd.findById(codigo).orElseThrow(() ->
                new RegraNegocioException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
    }

    /* GET /api/pedido/cliente/{codigo} */
    @GetMapping("/cliente/{codigo}")
    public List<Pedido> listarPorCliente(@PathVariable("codigo") int codigo) {
        return bd.findByCodigoClienteOrderByCodigoPedidoDesc(codigo);
    }
}
