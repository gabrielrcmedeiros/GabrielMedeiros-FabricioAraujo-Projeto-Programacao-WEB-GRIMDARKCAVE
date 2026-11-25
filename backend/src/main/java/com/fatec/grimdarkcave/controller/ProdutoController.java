package com.fatec.grimdarkcave.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.grimdarkcave.model.Produto;
import com.fatec.grimdarkcave.repository.ItemPedidoRepository;
import com.fatec.grimdarkcave.repository.ProdutoRepository;
import com.fatec.grimdarkcave.service.RegraNegocioException;

/* Catálogo de jogos: /api/produto */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/produto")
public class ProdutoController {
    @Autowired
    private ProdutoRepository bd;
    @Autowired
    private ItemPedidoRepository bdItens;

    /* GET /api/produto */
    @GetMapping
    public List<Produto> listar() {
        return bd.findAll(Sort.by("codigo"));
    }

    /* GET /api/produto/destaques */
    @GetMapping("/destaques")
    public List<Produto> destaques() {
        return bd.carregarDestaques();
    }

    /* GET /api/produto/categorias */
    @GetMapping("/categorias")
    public List<String> categorias() {
        return bd.listarCategorias();
    }

    /* GET /api/produto/busca?termo=... ou ?categoria=... */
    @GetMapping("/busca")
    public List<Produto> buscar(@RequestParam(value = "termo", required = false) String termo,
            @RequestParam(value = "categoria", required = false) String categoria) {
        if (termo != null && !termo.isBlank()) {
            return bd.fazerBusca("%" + termo.trim() + "%");
        }
        if (categoria != null && !categoria.isBlank()) {
            return bd.findByCategoriaOrderByNome(categoria.trim());
        }
        return listar();
    }

    /* GET /api/produto/{codigo} */
    @GetMapping("/{codigo}")
    public Produto carregar(@PathVariable("codigo") int codigo) {
        return bd.findById(codigo).orElseThrow(() ->
                new RegraNegocioException(HttpStatus.NOT_FOUND, "Jogo não encontrado."));
    }

    /* POST /api/produto (201) */
    @PostMapping
    public ResponseEntity<Produto> gravar(@RequestBody Produto obj) {
        validar(obj);
        obj.setCodigo(0);
        Produto salvo = bd.save(obj);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /* PUT /api/produto/{codigo} */
    @PutMapping("/{codigo}")
    public Produto alterar(@PathVariable("codigo") int codigo, @RequestBody Produto obj) {
        if (!bd.existsById(codigo)) {
            throw new RegraNegocioException(HttpStatus.NOT_FOUND, "Jogo não encontrado.");
        }
        validar(obj);
        obj.setCodigo(codigo);
        return bd.save(obj);
    }

    /* DELETE /api/produto/{codigo} (204; 409 se já vendido) */
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> remover(@PathVariable("codigo") int codigo) {
        if (!bd.existsById(codigo)) {
            throw new RegraNegocioException(HttpStatus.NOT_FOUND, "Jogo não encontrado.");
        }
        if (bdItens.existsByProdutoCodigo(codigo)) {
            throw new RegraNegocioException(HttpStatus.CONFLICT,
                    "Este jogo já foi vendido e não pode ser excluído. Zere o estoque para retirá-lo da venda.");
        }
        bd.deleteById(codigo);
        return ResponseEntity.noContent().build();
    }

    private void validar(Produto obj) {
        if (obj.getNome() == null || obj.getNome().isBlank()) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Informe o nome do jogo.");
        }
        if (obj.getValor() <= 0) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "O valor deve ser maior que zero.");
        }
        if (obj.getPromo() < 0 || obj.getPromo() >= obj.getValor()) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST,
                    "O valor promocional deve ser zero (sem promoção) ou menor que o valor cheio.");
        }
        if (obj.getQuantidade() < 0) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "O estoque não pode ser negativo.");
        }
        /* Limites das colunas no banco */
        verificarTamanho(obj.getNome(), 255, "nome");
        verificarTamanho(obj.getCategoria(), 255, "categoria");
        verificarTamanho(obj.getDesenvolvedora(), 255, "desenvolvedora");
        verificarTamanho(obj.getPlataforma(), 255, "plataforma");
        verificarTamanho(obj.getDescritivo(), 1000, "descrição");
        verificarTamanho(obj.getImagem(), 1000, "imagem");
    }

    private void verificarTamanho(String valor, int maximo, String campo) {
        if (valor != null && valor.length() > maximo) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST,
                    "O campo " + campo + " aceita no máximo " + maximo + " caracteres.");
        }
    }
}
