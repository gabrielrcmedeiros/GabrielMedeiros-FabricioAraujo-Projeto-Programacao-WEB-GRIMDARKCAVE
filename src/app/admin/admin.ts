import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Produto, imagemDe } from '../model/produto';
import { ProdutoService } from '../services/produto-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';
import { promoValida } from '../validadores';

/* Administração do catálogo (CRUD de jogos) */
@Component({
  selector: 'app-admin',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProdutoService);
  private readonly aviso = inject(NotificacaoService);

  readonly lista = signal<Produto[]>([]);
  readonly categorias = signal<string[]>([]);
  readonly carregando = signal(true);
  readonly salvando = signal(false);
  /* Código do jogo em edição (0 = novo) */
  readonly editando = signal(0);
  readonly filtro = signal('');
  /* Falha ao carregar a pré-visualização */
  readonly previewComErro = signal(false);

  /* Indicadores do painel */
  readonly totalEstoque = computed(() => this.lista().reduce((soma, p) => soma + p.quantidade, 0));
  readonly emPromocao = computed(() => this.lista().filter((p) => p.promo > 0).length);
  readonly esgotados = computed(() => this.lista().filter((p) => p.quantidade <= 0).length);

  readonly listaFiltrada = computed(() => {
    const termo = this.filtro().trim().toLowerCase();
    if (!termo) return this.lista();
    return this.lista().filter(
      (p) => p.nome.toLowerCase().includes(termo) || (p.categoria ?? '').toLowerCase().includes(termo),
    );
  });

  protected readonly imagemDe = imagemDe;

  readonly form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      categoria: ['', [Validators.required, Validators.maxLength(255)]],
      desenvolvedora: ['', Validators.maxLength(255)],
      plataforma: ['Chave Steam', [Validators.required, Validators.maxLength(255)]],
      descritivo: ['', [Validators.required, Validators.maxLength(1000)]],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      promo: [0, [Validators.min(0)]],
      quantidade: [0, [Validators.required, Validators.min(0)]],
      destaque: [0, [Validators.min(0)]],
      imagem: ['', Validators.maxLength(1000)],
    },
    { validators: promoValida },
  );

  ngOnInit() {
    this.carregar();
  }

  /* Carrega jogos e categorias */
  carregar() {
    this.carregando.set(true);
    this.service.listar().subscribe({
      next: (dados) => {
        this.lista.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível carregar o catálogo.'));
      },
    });
    this.service.categorias().subscribe({
      next: (dados) => this.categorias.set(dados),
      error: () => this.categorias.set([]),
    });
  }

  /* Cadastra ou altera o jogo */
  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.aviso.erro('Revise os campos destacados do formulário.');
      return;
    }

    const jogo: Produto = { ...new Produto(), ...this.form.getRawValue(), codigo: this.editando() };
    const requisicao = jogo.codigo > 0 ? this.service.alterar(jogo) : this.service.gravar(jogo);

    this.salvando.set(true);
    requisicao.subscribe({
      next: (salvo) => {
        this.salvando.set(false);
        this.aviso.sucesso(
          this.editando() > 0 ? `${salvo.nome} foi reforjado com sucesso.` : `${salvo.nome} entrou no catálogo (código ${salvo.codigo}).`,
        );
        this.cancelar();
        this.carregar();
      },
      error: (err) => {
        this.salvando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível salvar o jogo.'));
      },
    });
  }

  /* Preenche o formulário para edição */
  editar(jogo: Produto) {
    this.editando.set(jogo.codigo);
    this.form.setValue({
      nome: jogo.nome,
      categoria: jogo.categoria ?? '',
      desenvolvedora: jogo.desenvolvedora ?? '',
      plataforma: jogo.plataforma ?? '',
      descritivo: jogo.descritivo ?? '',
      valor: jogo.valor,
      promo: jogo.promo,
      quantidade: jogo.quantidade,
      destaque: jogo.destaque,
      imagem: jogo.imagem ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Exclui o jogo (recusado se já vendido) */
  excluir(jogo: Produto) {
    if (!confirm(`Excluir "${jogo.nome}" do catálogo? Esta ação não pode ser desfeita.`)) return;

    this.service.remover(jogo.codigo).subscribe({
      next: () => {
        this.aviso.sucesso(`${jogo.nome} foi banido do catálogo.`);
        if (this.editando() === jogo.codigo) this.cancelar();
        this.carregar();
      },
      error: (err) => this.aviso.erro(mensagemErro(err, 'Não foi possível excluir o jogo.')),
    });
  }

  cancelar() {
    this.editando.set(0);
    this.form.reset();
  }

  filtrar(evento: Event) {
    this.filtro.set((evento.target as HTMLInputElement).value);
  }

  /* Campo inválido e já tocado */
  invalido(campo: string): boolean {
    const controle = this.form.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }
}
