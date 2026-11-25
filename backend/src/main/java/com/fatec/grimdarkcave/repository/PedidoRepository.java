package com.fatec.grimdarkcave.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.grimdarkcave.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    /* Pedidos do cliente, do mais recente para o mais antigo */
    List<Pedido> findByCodigoClienteOrderByCodigoPedidoDesc(int codigoCliente);
}
