import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Produto } from '../model/produto';
import { ProdutoService } from '../services/produto-service';
import { mensagemErro } from '../services/api';
import { CardJogo } from '../card-jogo/card-jogo';

@Component({
  selector: 'app-busca',
  imports: [RouterLink, CardJogo],
  templateUrl: './busca.html',
  styleUrl: './busca.css',
})
export class Busca implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProdutoService);
  private readonly destroyRef = inject(DestroyRef);

  /* Estado da tela */
  readonly termoExibicao = signal('');
  readonly resultados = signal<Produto[]>([]);
  readonly categorias = signal<string[]>([]);
  readonly categoriaAtiva = signal('');
  readonly carregando = signal(true);
  readonly erro = signal('');

  ngOnInit() {
    /* Categorias para o filtro */
    this.service.categorias().subscribe({
      next: (dados) => this.categorias.set(dados),
      error: () => this.categorias.set([]),
    });

    /* Refaz a busca a cada mudança na URL; o switchMap descarta respostas antigas */
    this.route.queryParamMap
      .pipe(
        switchMap((params) => this.consultar(params.get('q') ?? '', params.get('categoria') ?? '')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dados) => {
        this.resultados.set(dados);
        this.carregando.set(false);
      });
  }

  /* Consulta por termo, por categoria ou o catálogo completo */
  private consultar(texto: string, categoria: string): Observable<Produto[]> {
    this.carregando.set(true);
    this.erro.set('');
    this.categoriaAtiva.set(categoria);

    let requisicao: Observable<Produto[]>;
    if (texto.trim() !== '') {
      this.termoExibicao.set(texto.trim().toUpperCase());
      requisicao = this.service.buscarPorTermo(texto.trim());
    } else if (categoria.trim() !== '') {
      this.termoExibicao.set(`CATEGORIA: ${categoria.toUpperCase()}`);
      requisicao = this.service.buscarPorCategoria(categoria.trim());
    } else {
      this.termoExibicao.set('TODO O CATÁLOGO');
      requisicao = this.service.listar();
    }

    return requisicao.pipe(
      catchError((err) => {
        this.erro.set(mensagemErro(err, 'Não foi possível realizar a busca.'));
        return of([] as Produto[]);
      }),
    );
  }
}
