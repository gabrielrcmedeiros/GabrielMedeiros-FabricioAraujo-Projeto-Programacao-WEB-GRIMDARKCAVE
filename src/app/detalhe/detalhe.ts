import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { Produto, desconto, imagemDe } from '../model/produto';
import { ProdutoService } from '../services/produto-service';
import { CestaService } from '../services/cesta-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';
import { CardJogo } from '../card-jogo/card-jogo';

@Component({
  selector: 'app-detalhe',
  imports: [CurrencyPipe, RouterLink, CardJogo],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.css',
})
export class Detalhe implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProdutoService);
  private readonly aviso = inject(NotificacaoService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly cesta = inject(CestaService);

  /* Jogo indicado pelo código da URL */
  readonly produto = signal<Produto | null>(null);
  readonly relacionados = signal<Produto[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal('');

  protected readonly imagemDe = imagemDe;
  protected readonly desconto = desconto;

  ngOnInit() {
    /* Recarrega quando o código da URL muda */
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('codigo'))),
        switchMap((codigo) => {
          this.carregando.set(true);
          this.erro.set('');
          return this.service.carregar(codigo).pipe(
            catchError((err) => {
              this.erro.set(mensagemErro(err, 'Artefato não encontrado.'));
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((jogo) => {
        this.produto.set(jogo);
        this.carregando.set(false);
        if (jogo) this.carregarRelacionados(jogo);
      });
  }

  /* Até 3 jogos da mesma categoria */
  private carregarRelacionados(jogo: Produto) {
    this.service.buscarPorCategoria(jogo.categoria).subscribe({
      next: (lista) => this.relacionados.set(lista.filter((p) => p.codigo !== jogo.codigo).slice(0, 3)),
      error: () => this.relacionados.set([]),
    });
  }

  adicionarCesta(jogo: Produto): boolean {
    if (this.cesta.adicionar(jogo)) {
      this.aviso.sucesso(`${jogo.nome} adicionado à cesta!`);
      return true;
    }
    this.aviso.info(`Você já tem todas as ${jogo.quantidade} unidade(s) disponíveis na cesta.`);
    return false;
  }

  comprarAgora(jogo: Produto) {
    if (this.cesta.quantidadeDe(jogo.codigo) > 0 || this.adicionarCesta(jogo)) {
      this.router.navigate(['/cesta']);
    }
  }
}
