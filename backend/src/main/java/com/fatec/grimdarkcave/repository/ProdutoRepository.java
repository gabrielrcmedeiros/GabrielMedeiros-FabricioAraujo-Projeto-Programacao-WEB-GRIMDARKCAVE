package com.fatec.grimdarkcave.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fatec.grimdarkcave.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    /* Destaques com estoque, na ordem do campo destaque */
    @Query(value = "select * from produto where destaque > 0 and quantidade > 0 order by destaque", nativeQuery = true)
    List<Produto> carregarDestaques();

    /* Busca por nome, descrição, desenvolvedora ou categoria */
    @Query(value = "select * from produto where nome like :termo or descritivo like :termo "
            + "or desenvolvedora like :termo or categoria like :termo order by nome", nativeQuery = true)
    List<Produto> fazerBusca(@Param("termo") String termo);

    /* Consulta derivada do nome do método */
    List<Produto> findByCategoriaOrderByNome(String categoria);

    @Query(value = "select distinct categoria from produto where categoria is not null order by categoria", nativeQuery = true)
    List<String> listarCategorias();
}
