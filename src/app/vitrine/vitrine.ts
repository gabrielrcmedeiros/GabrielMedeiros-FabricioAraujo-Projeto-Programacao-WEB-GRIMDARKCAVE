import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto, desconto, imagemDe, precoAtual } from '../model/produto';
import { ProdutoService } from '../services/produto-service';
import { CestaService } from '../services/cesta-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';
import { CardJogo } from '../card-jogo/card-jogo';

type Filtro = 'todos' | 'promocao' | 'disponiveis';
type Ordem = 'padrao' | 'menor' | 'maior' | 'nome';

@Component({
  selector: 'app-vitrine',
  imports: [CurrencyPipe, RouterLink, CardJogo],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css',
})
export class Vitrine implements OnInit, OnDestroy {
  private readonly service = inject(ProdutoService);
  private readonly cesta = inject(CestaService);
  private readonly aviso = inject(NotificacaoService);

  /* Estado da tela */
  readonly lista = signal<Produto[]>([]);
  readonly destaques = signal<Produto[]>([]);
  readonly indiceDestaque = signal(0);
  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly filtro = signal<Filtro>('todos');
  readonly ordem = signal<Ordem>('padrao');

  readonly destaqueAtual = computed(() => this.destaques()[this.indiceDestaque()] ?? null);

  /* Lista com filtro e ordenação aplicados */
  readonly listaExibida = computed(() => {
    let jogos = this.lista();
    if (this.filtro() === 'promocao') jogos = jogos.filter((p) => p.promo > 0);
    if (this.filtro() === 'disponiveis') jogos = jogos.filter((p) => p.quantidade > 0);

    const ordenados = [...jogos];
    switch (this.ordem()) {
      case 'menor':
        ordenados.sort((a, b) => precoAtual(a) - precoAtual(b));
        break;
      case 'maior':
        ordenados.sort((a, b) => precoAtual(b) - precoAtual(a));
        break;
      case 'nome':
        ordenados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
    }
    return ordenados;
  });

  protected readonly imagemDe = imagemDe;
  protected readonly desconto = desconto;
  protected readonly placeholders = [1, 2, 3, 4, 5, 6];
  private temporizador?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.carregar();
    /* Troca o destaque a cada 7 segundos */
    this.temporizador = setInterval(() => this.proximoDestaque(), 7000);
  }

  ngOnDestroy() {
    clearInterval(this.temporizador);
  }

  /* Carrega catálogo e destaques */
  carregar() {
    this.carregando.set(true);
    this.erro.set('');

    this.service.listar().subscribe({
      next: (dados) => {
        this.lista.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErro(err, 'Não foi possível carregar o catálogo.'));
        this.carregando.set(false);
      },
    });

    this.service.destaques().subscribe({
      next: (dados) => this.destaques.set(dados),
      error: () => this.destaques.set([]),
    });
  }

  proximoDestaque() {
    const total = this.destaques().length;
    if (total > 0) this.indiceDestaque.update((i) => (i + 1) % total);
  }

  anteriorDestaque() {
    const total = this.destaques().length;
    if (total > 0) this.indiceDestaque.update((i) => (i - 1 + total) % total);
  }

  /* Imagem de fundo do banner */
  fundoDe(jogo: Produto): string {
    return `url("${imagemDe(jogo)}")`;
  }

  irParaDestaque(indice: number) {
    this.indiceDestaque.set(indice);
  }

  comprarDestaque(jogo: Produto) {
    if (this.cesta.adicionar(jogo)) {
      this.aviso.sucesso(`${jogo.nome} adicionado à cesta!`);
    } else {
      this.aviso.info(`Você já tem todas as unidades disponíveis de ${jogo.nome} na cesta.`);
    }
  }

  alterarFiltro(valor: Filtro) {
    this.filtro.set(valor);
  }

  alterarOrdem(evento: Event) {
    this.ordem.set((evento.target as HTMLSelectElement).value as Ordem);
  }
}
