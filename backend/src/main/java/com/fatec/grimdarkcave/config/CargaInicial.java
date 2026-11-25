package com.fatec.grimdarkcave.config;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fatec.grimdarkcave.model.Cliente;
import com.fatec.grimdarkcave.model.Produto;
import com.fatec.grimdarkcave.repository.ClienteRepository;
import com.fatec.grimdarkcave.repository.ProdutoRepository;
import com.fatec.grimdarkcave.service.Seguranca;

/* Ao iniciar: ajusta a coluna de imagem e grava o catálogo inicial e o administrador, se ausentes */
@Component
public class CargaInicial implements CommandLineRunner {
    @Autowired
    private ProdutoRepository bdProduto;
    @Autowired
    private ClienteRepository bdCliente;
    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) {
        ajustarColunaImagem();

        if (bdProduto.count() == 0) {
            bdProduto.saveAll(List.of(
                jogo("Sekiro: Shadows Die Twice", "Souls-like", "FromSoftware", "Chave Steam",
                    "Ação e furtividade em um Japão feudal sombrio, punitivo e brutal.", 199.90, 149.90, 10, 4, "1.jpg"),
                jogo("Warhammer 40,000: Darktide", "Warhammer", "Fatshark", "Chave Steam",
                    "Enfrente hordas de inimigos hereges na cidade-colmeia de Tertium.", 169.95, 0, 50, 2, "2.jpg"),
                jogo("Dead Space Remake", "Sci-Fi Horror", "Motive Studio", "Chave EA App",
                    "Sobreviva ao terror no espaço profundo a bordo da nave USG Ishimura.", 249.00, 199.00, 15, 3, "3.jpg"),
                jogo("Elden Ring", "Souls-like", "FromSoftware", "Chave Steam",
                    "Explore as Terras Intermédias neste vasto RPG de fantasia sombria.", 229.90, 0, 25, 1, "4.jpg"),
                jogo("Kingdom Come: Deliverance", "RPG Medieval", "Warhorse Studios", "Chave Steam",
                    "RPG medieval realista e imersivo no coração do Sacro Império Romano.", 89.99, 29.99, 100, 0, "5.jpg"),
                jogo("Blasphemous", "Souls-like", "The Game Kitchen", "Chave Steam",
                    "Ação e plataforma brutal com combates intensos e exploração não linear.", 59.90, 25.00, 5, 0, "6.jpg"),
                jogo("Castlevania: Lords of Shadow 2", "Ação Sombria", "MercurySteam", "Chave Steam",
                    "Assuma o papel de Drácula em uma jornada sombria para recuperar seus poderes e enfrentar ameaças sobrenaturais.", 99.90, 0, 10, 0, "7.jpg"),
                jogo("Darksiders Genesis", "Ação e RPG", "Airship Syndicate", "Chave Steam",
                    "Explore um mundo de fantasia apocalíptica em uma aventura de ação com Guerra e Discórdia.", 89.90, 29.90, 10, 0, "8.jpg"),
                jogo("Middle-earth: Shadow of Mordor", "RPG de Ação", "Monolith Productions", "Chave Steam",
                    "Enfrente as forças de Sauron em Mordor como Talion, um patrulheiro que busca vingança.", 79.90, 49.90, 15, 0, "9.jpg"),
                jogo("Wolfenstein: The Old Blood", "Sci-Fi Horror", "MachineGames", "Chave Steam",
                    "Vivencie uma aventura intensa de tiro em primeira pessoa durante a Segunda Guerra Mundial.", 79.90, 0, 20, 0, "10.jpg"),
                jogo("Metal Gear Solid 3: Snake Eater", "Furtividade", "Konami", "Chave Steam",
                    "Infiltre-se em território inimigo durante a Guerra Fria em uma missão de espionagem e sobrevivência.", 89.90, 59.90, 8, 0, "11.jpg"),
                jogo("Batman: Arkham Asylum GOTY", "Ação Sombria", "Rocksteady Studios", "Chave Steam",
                    "Entre no manicômio de Gotham como Batman e enfrente o Coringa em uma aventura de ação e investigação.", 69.90, 0, 12, 0, "12.jpg")
            ));
        }

        /* Conta administradora */
        if (!bdCliente.existsByEmail("admin@grimdark.com")) {
            Cliente admin = new Cliente();
            admin.setNome("Mestre das Criptas");
            admin.setEmail("admin@grimdark.com");
            admin.setSenha(Seguranca.gerarHash("admin123"));
            admin.setPerfil("ADMIN");
            bdCliente.save(admin);
        }
    }

    /* Amplia a coluna imagem para 1000 caracteres em bancos antigos */
    private void ajustarColunaImagem() {
        String consulta = "select character_maximum_length from information_schema.columns "
                + "where table_schema = database() and table_name = 'produto' and column_name = 'imagem'";
        try (Connection conexao = dataSource.getConnection()) {
            long tamanho = 0;
            try (Statement comando = conexao.createStatement(); ResultSet resultado = comando.executeQuery(consulta)) {
                if (resultado.next()) {
                    tamanho = resultado.getLong(1);
                }
            }
            if (tamanho > 0 && tamanho < 1000) {
                try (Statement alteracao = conexao.createStatement()) {
                    alteracao.execute("alter table produto modify imagem varchar(1000)");
                }
                System.out.println("Coluna produto.imagem ampliada para 1000 caracteres.");
            }
        } catch (SQLException e) {
            System.out.println("Aviso: nao foi possivel ajustar a coluna imagem: " + e.getMessage());
        }
    }

    private Produto jogo(String nome, String categoria, String desenvolvedora, String plataforma, String descritivo,
            double valor, double promo, int quantidade, int destaque, String imagem) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setCategoria(categoria);
        p.setDesenvolvedora(desenvolvedora);
        p.setPlataforma(plataforma);
        p.setDescritivo(descritivo);
        p.setValor(valor);
        p.setPromo(promo);
        p.setQuantidade(quantidade);
        p.setDestaque(destaque);
        p.setImagem(imagem);
        return p;
    }
}
