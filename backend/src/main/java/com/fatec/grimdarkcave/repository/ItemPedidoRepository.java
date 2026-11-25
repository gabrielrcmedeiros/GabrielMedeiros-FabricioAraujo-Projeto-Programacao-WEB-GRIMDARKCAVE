package com.fatec.grimdarkcave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.grimdarkcave.model.ItemPedido;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Integer> {

    /* Indica se o jogo já foi vendido */
    boolean existsByProdutoCodigo(int codigo);
}
