import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-busca',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './busca.html',
  styleUrl: './busca.css'
})
export class Busca implements OnInit {
  /* Propriedade para armazenamento e renderizacao do rotulo dinamico na visualizacao */
  termoExibicao: string = "";
  
  /* Matriz principal atuando como base de dados em memoria com os produtos disponiveis */
  listaCompleta = [
    { codigo: 1, nome: "Sekiro: Shadows Die Twice", categoria: "Souls-like", desenvolvedora: "FromSoftware", plataforma: "Chave Steam", descritivo: "Acao e furtividade em um Japao feudal sombrio, punitivo e brutal.", valor: 199.90, promo: 149.90, quantidade: 10 },
    { codigo: 2, nome: "Warhammer 40,000: Darktide", categoria: "Warhammer", desenvolvedora: "Fatshark", plataforma: "Chave Steam", descritivo: "Enfrente hordas de inimigos hereges na cidade-colmeia de Tertium.", valor: 169.95, promo: 0, quantidade: 50 },
    { codigo: 3, nome: "Dead Space Remake", categoria: "Sci-Fi Horror", desenvolvedora: "Motive Studio", plataforma: "Chave EA App", descritivo: "Sobreviva ao terror no espaco profundo a bordo da nave USG Ishimura.", valor: 249.00, promo: 199.00, quantidade: 15 },
    { codigo: 4, nome: "Elden Ring", categoria: "Souls-like", desenvolvedora: "FromSoftware", plataforma: "Chave Steam", descritivo: "Explore as Terras Intermedias neste vasto RPG de fantasia sombria.", valor: 229.90, promo: 0, quantidade: 25 },
    { codigo: 5, nome: "Kingdom Come: Deliverance", categoria: "RPG Medieval", desenvolvedora: "Warhorse Studios", plataforma: "Chave Steam", descritivo: "RPG medieval realista e imersivo no coracao do Sacro Imperio Romano.", valor: 89.99, promo: 29.99, quantidade: 100 },
    { codigo: 6, nome: "Blasphemous", categoria: "Souls-like", desenvolvedora: "The Game Kitchen", plataforma: "Chave Steam", descritivo: "Acao e plataforma brutal com combates intensos e exploracao nao linear.", valor: 59.90, promo: 25.00, quantidade: 5 },
    { codigo: 7, nome: "Castlevania: Lords of Shadow 2", categoria: "Acao Sombria", desenvolvedora: "MercurySteam", plataforma: "Chave Steam", descritivo: "Assuma o papel de Dracula em uma jornada sombria para recuperar seus poderes e enfrentar ameacas sobrenaturais.", valor: 99.90, promo: 0, quantidade: 10 },
    { codigo: 8, nome: "Darksiders Genesis", categoria: "Acao e RPG", desenvolvedora: "Airship Syndicate", plataforma: "Chave Steam", descritivo: "Explore um mundo de fantasia apocaliptica em uma aventura de acao com Guerra e Discordia.", valor: 89.90, promo: 29.90, quantidade: 10 },
    { codigo: 9, nome: "Middle-earth: Shadow of Mordor", categoria: "RPG de Acao", desenvolvedora: "Monolith Productions", plataforma: "Chave Steam", descritivo: "Enfrente as forcas de Sauron em Mordor como Talion, um patrulheiro que busca vinganca.", valor: 79.90, promo: 49.90, quantidade: 15 },
    { codigo: 10, nome: "Wolfenstein: The Old Blood", categoria: "Sci-Fi Horror", desenvolvedora: "MachineGames", plataforma: "Chave Steam", descritivo: "Vivencie uma aventura intensa de tiro em primeira pessoa durante a Segunda Guerra Mundial.", valor: 79.90, promo: 0, quantidade: 20 },
    { codigo: 11, nome: "Metal Gear Solid 3: Snake Eater", categoria: "Furtividade", desenvolvedora: "Konami", plataforma: "Chave Steam", descritivo: "Infiltre-se em territorio inimigo durante a Guerra Fria em uma missao de espionagem e sobrevivencia.", valor: 89.90, promo: 59.90, quantidade: 8 },
    { codigo: 12, nome: "Batman: Arkham Asylum GOTY", categoria: "Acao Sombria", desenvolvedora: "Rocksteady Studios", plataforma: "Chave Steam", descritivo: "Entre no manicomio de Gotham como Batman e enfrente o Coringa em uma aventura de acao e investigacao.", valor: 69.90, promo: 0, quantidade: 12 }
  ];
  
  /* Matriz resultante apos o processo de filtragem, mapeada diretamente para renderizacao no HTML */
  resultados: any[] = [];

  /* Construtor responsavel por instanciar injecoes de dependencia de roteamento e verificacao de alteracoes */
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  /* Metodo do ciclo de vida chamado apos a inicializacao. Avalia os parametros de rota e configura eventos de navegacao */
  ngOnInit() {
    this.aplicarFiltros(this.route.snapshot.queryParams);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.aplicarFiltros(this.route.snapshot.queryParams);
      this.cdr.detectChanges();
    });
  }

  /* Funcao central de negocios que avalia os parametros e executa a filtragem por texto ou categoria */
  aplicarFiltros(params: any) {
    let textoBusca = params['q'] || '';
    let categoriaClicada = params['categoria'] || '';

    if (textoBusca.trim() !== "") {
      this.termoExibicao = textoBusca.toUpperCase();
      this.resultados = this.listaCompleta.filter(item => 
        item.nome.toLowerCase().includes(textoBusca.toLowerCase()) || 
        item.descritivo.toLowerCase().includes(textoBusca.toLowerCase())
      );
    } else if (categoriaClicada.trim() !== "") {
      this.termoExibicao = `CATEGORIA: ${categoriaClicada.toUpperCase()}`;
      this.resultados = this.listaCompleta.filter(item => 
        item.categoria.toLowerCase() === categoriaClicada.toLowerCase()
      );
    } else {
      this.termoExibicao = "TODO O CATALOGO";
      this.resultados = this.listaCompleta;
    }
  }

  /* Metodo de isolamento de estado: Salva os dados do produto selecionado no cache local e realiza redirecionamento */
  verDetalhe(obj: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('produto', JSON.stringify(obj));
      this.router.navigate(['/detalhe']);
    }
  }

  /* Metodo gestor de sessoes da cesta: Avalia duplicidade de itens, recalcula montantes e salva no armazenamento local */
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
        itens.push({ produto: obj, quantidade: 1, valorTotal: precoEfetivo });
      }

      localStorage.setItem('cesta', JSON.stringify(itens));
      alert('Operacao concluida: Item inserido no carrinho.');
    }
  }
}