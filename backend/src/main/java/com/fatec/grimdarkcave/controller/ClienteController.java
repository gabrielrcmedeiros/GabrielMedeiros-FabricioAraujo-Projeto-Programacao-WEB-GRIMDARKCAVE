package com.fatec.grimdarkcave.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.grimdarkcave.model.Cliente;
import com.fatec.grimdarkcave.repository.ClienteRepository;
import com.fatec.grimdarkcave.service.RegraNegocioException;
import com.fatec.grimdarkcave.service.Seguranca;

/* Cadastro, login e recuperação de senha: /api/cliente */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/cliente")
public class ClienteController {
    @Autowired
    private ClienteRepository bd;

    /* Corpos JSON de login e senha */
    public record DadosLogin(String email, String senha) {
    }

    public record DadosRecuperacao(String email) {
    }

    public record DadosRedefinicao(String email, String codigo, String novaSenha) {
    }

    /* POST /api/cliente (201) */
    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@RequestBody Cliente obj) {
        if (obj.getNome() == null || obj.getNome().trim().length() < 3) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Informe o nome completo.");
        }
        if (obj.getEmail() == null || !obj.getEmail().contains("@")) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Informe um e-mail válido.");
        }
        if (obj.getSenha() == null || obj.getSenha().length() < 6) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "A senha precisa ter no mínimo 6 caracteres.");
        }
        String email = normalizarEmail(obj.getEmail());
        if (bd.existsByEmail(email)) {
            throw new RegraNegocioException(HttpStatus.CONFLICT, "Este e-mail já pertence a um membro das criptas!");
        }
        obj.setCodigo(0);
        obj.setNome(obj.getNome().trim());
        obj.setEmail(email);
        obj.setSenha(Seguranca.gerarHash(obj.getSenha()));
        obj.setPerfil("CLIENTE");
        Cliente salvo = bd.save(obj);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /* POST /api/cliente/login: cliente sem a senha, ou 401 */
    @PostMapping("/login")
    public Cliente login(@RequestBody DadosLogin dados) {
        if (dados.email() == null || dados.senha() == null) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Informe e-mail e senha.");
        }
        String hash = Seguranca.gerarHash(dados.senha());
        return bd.findByEmail(normalizarEmail(dados.email()))
                .filter(cliente -> hash.equals(cliente.getSenha()))
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.UNAUTHORIZED,
                        "ACESSO NEGADO: e-mail não encontrado ou senha incorreta."));
    }

    /* GET /api/cliente/{codigo} */
    @GetMapping("/{codigo}")
    public Cliente carregar(@PathVariable("codigo") int codigo) {
        return bd.findById(codigo).orElseThrow(() ->
                new RegraNegocioException(HttpStatus.NOT_FOUND, "Membro não encontrado."));
    }

    /* POST /api/cliente/recuperarSenha: código válido por 15 minutos, devolvido na resposta (e-mail simulado) */
    @PostMapping("/recuperarSenha")
    public Map<String, String> recuperarSenha(@RequestBody DadosRecuperacao dados) {
        Cliente cliente = bd.findByEmail(normalizarEmail(dados.email())).orElseThrow(() ->
                new RegraNegocioException(HttpStatus.NOT_FOUND, "O e-mail informado não consta em nossos registros."));

        String codigo = Seguranca.gerarCodigo(6);
        cliente.setCodigoRecuperacao(codigo);
        cliente.setValidadeCodigo(LocalDateTime.now().plusMinutes(15));
        bd.save(cliente);

        return Map.of(
                "mensagem", "Código de recuperação gerado para " + cliente.getEmail() + ". Válido por 15 minutos.",
                "codigo", codigo);
    }

    /* PATCH /api/cliente/redefinirSenha: troca a senha com código válido */
    @PatchMapping("/redefinirSenha")
    public Map<String, String> redefinirSenha(@RequestBody DadosRedefinicao dados) {
        Cliente cliente = bd.findByEmail(normalizarEmail(dados.email())).orElseThrow(() ->
                new RegraNegocioException(HttpStatus.NOT_FOUND, "O e-mail informado não consta em nossos registros."));

        String codigoDigitado = dados.codigo() == null ? "" : dados.codigo().trim();
        if (cliente.getCodigoRecuperacao() == null || !cliente.getCodigoRecuperacao().equalsIgnoreCase(codigoDigitado)) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Código inválido. O acesso foi negado.");
        }
        if (cliente.getValidadeCodigo() == null || cliente.getValidadeCodigo().isBefore(LocalDateTime.now())) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Código expirado. Gere um novo código.");
        }
        if (dados.novaSenha() == null || dados.novaSenha().length() < 6) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "A nova senha precisa ter no mínimo 6 caracteres.");
        }

        cliente.setSenha(Seguranca.gerarHash(dados.novaSenha()));
        cliente.setCodigoRecuperacao(null);
        cliente.setValidadeCodigo(null);
        bd.save(cliente);
        return Map.of("mensagem", "Senha redefinida com sucesso.");
    }

    private String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
