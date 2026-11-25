package com.fatec.grimdarkcave.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.grimdarkcave.model.Chave;

@Repository
public interface ChaveRepository extends JpaRepository<Chave, Integer> {

    /* Chaves do cliente, das mais recentes para as mais antigas */
    List<Chave> findByCodigoClienteOrderByCodigoDesc(int codigoCliente);

    boolean existsByChaveDigital(String chaveDigital);
}
