import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vitrine',
  imports: [CommonModule],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css'
})
export class Vitrine {
  /* Matriz central de dados contendo o catalogo de produtos e seus respectivos atributos tecnicos */
  lista = [
    { codigo: 1, nome: "Sekiro: Shadows Die Twice", categoria: "Souls-like", desenvolvedora: "FromSoftware", plataforma: "Chave Steam", descritivo: "Ação e furtividade em um Japão feudal sombrio, punitivo e brutal.", valor: 199.90, promo: 149.90, quantidade: 10 },
    { codigo: 2, nome: "Warhammer 40,000: Darktide", categoria: "Warhammer", desenvolvedora: "Fatshark", plataforma: "Chave Steam", descritivo: "Enfrente hordas de inimigos hereges na cidade-colmeia de Tertium.", valor: 169.95, promo: 0, quantidade: 50 },
    { codigo: 3, nome: "Dead Space Remake", categoria: "Sci-Fi Horror", desenvolvedora: "Motive Studio", plataforma: "Chave EA App", descritivo: "Sobreviva ao terror no espaço profundo a bordo da nave USG Ishimura.", valor: 249.00, promo: 199.00, quantidade: 15 },
    { codigo: 4, nome: "Elden Ring", categoria: "Souls-like", desenvolvedora: "FromSoftware", plataforma: "Chave Steam", descritivo: "Explore as Terras Intermédias neste vasto RPG de fantasia sombria.", valor: 229.90, promo: 0, quantidade: 25 },
    { codigo: 5, nome: "Kingdom Come: Deliverance", categoria: "RPG Medieval", desenvolvedora: "Warhorse Studios", plataforma: "Chave Steam", descritivo: "RPG medieval realista e imersivo no coração do Sacro Império Romano.", valor: 89.99, promo: 29.99, quantidade: 100 },
    { codigo: 6, nome: "Blasphemous", categoria: "Souls-like", desenvolvedora: "The Game Kitchen", plataforma: "Chave Steam", descritivo: "Ação e plataforma brutal com combates intensos e exploração não linear.", valor: 59.90, promo: 25.00, quantidade: 5 },
    { codigo: 7, nome: "Castlevania: Lords of Shadow 2", categoria: "Ação Sombria", desenvolvedora: "MercurySteam", plataforma: "Chave Steam", descritivo: "Assuma o papel de Drácula em uma jornada sombria para recuperar seus poderes e enfrentar ameaças sobrenaturais.", valor: 99.90, promo: 0, quantidade: 10 },
    { codigo: 8, nome: "Darksiders Genesis", categoria: "Ação e RPG", desenvolvedora: "Airship Syndicate", plataforma: "Chave Steam", descritivo: "Explore um mundo de fantasia apocalíptica em uma aventura de ação com Guerra e Discórdia.", valor: 89.90, promo: 29.90, quantidade: 10 },
    { codigo: 9, nome: "Middle-earth: Shadow of Mordor", categoria: "RPG de Ação", desenvolvedora: "Monolith Productions", plataforma: "Chave Steam", descritivo: "Enfrente as forças de Sauron em Mordor como Talion, um patrulheiro que busca vingança.", valor: 79.90, promo: 49.90, quantidade: 15 },
    { codigo: 10, nome: "Wolfenstein: The Old Blood", categoria: "Sci-Fi Horror", desenvolvedora: "MachineGames", plataforma: "Chave Steam", descritivo: "Vivencie uma aventura intensa de tiro em primeira pessoa durante a Segunda Guerra Mundial.", valor: 79.90, promo: 0, quantidade: 20 },
    { codigo: 11, nome: "Metal Gear Solid 3: Snake Eater", categoria: "Furtividade", desenvolvedora: "Konami", plataforma: "Chave Steam", descritivo: "Infiltre-se em território inimigo durante a Guerra Fria em uma missão de espionagem e sobrevivência.", valor: 89.90, promo: 59.90, quantidade: 8 },
    { codigo: 12, nome: "Batman: Arkham Asylum GOTY", categoria: "Ação Sombria", desenvolvedora: "Rocksteady Studios", plataforma: "Chave Steam", descritivo: "Entre no manicômio de Gotham como Batman e enfrente o Coringa em uma aventura de ação e investigação.", valor: 69.90, promo: 0, quantidade: 12 }
  ];

  /* Construtor responsavel por instanciar a injecao de dependencia de roteamento interno */
  constructor(private router: Router) {}

  /* Persiste o estado do produto selecionado no armazenamento local e redireciona para a interface de detalhamento */
  verDetalhe(obj: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('produto', JSON.stringify(obj));
      this.router.navigate(['/detalhe']);
    }
  }

  /* Metodo de integracao ao carrinho: verifica presenca previa, ajusta somatorios e atualiza o estado da sessao */
  adicionarCesta(obj: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      let cestaStorage = localStorage.getItem('cesta');
      let itens = cestaStorage ? JSON.parse(cestaStorage) : [];

      let itemExistente = itens.find((item: any) => item.produto.codigo === obj.codigo);
      let precoEfetivo = obj.promo > 0 ? obj.promo : obj.valor;

      if (itemExistente) {
        itemExistente.quantidade += 1;
        itemExistente.valorTotal = itemExistente.quantidade * precoEfetivo;
      } else {
        itens.push({
          produto: obj,
          quantidade: 1,
          valorTotal: precoEfetivo
        });
      }

      localStorage.setItem('cesta', JSON.stringify(itens));
      alert('Artefato adicionado à cesta de compras!');
    }
  }
}