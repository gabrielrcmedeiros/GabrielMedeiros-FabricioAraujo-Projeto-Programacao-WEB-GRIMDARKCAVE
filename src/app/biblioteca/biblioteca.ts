import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Chave } from '../model/chave';
import { Pedido } from '../model/pedido';
import { imagemDe } from '../model/produto';
import { PedidoService } from '../services/pedido-service';
import { SessaoService } from '../services/sessao-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';

@Component({
  selector: 'app-biblioteca',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css',
})
export class Biblioteca implements OnInit {
  private readonly service = inject(PedidoService);
  private readonly aviso = inject(NotificacaoService);
  protected readonly sessao = inject(SessaoService);

  /* Chaves e pedidos do cliente logado */
  readonly chaves = signal<Chave[]>([]);
  readonly pedidos = signal<Pedido[]>([]);
  readonly aba = signal<'chaves' | 'pedidos'>('chaves');
  readonly carregando = signal(true);
  readonly erro = signal('');

  protected readonly imagemDe = imagemDe;

  /* Acesso garantido pelo authGuard */
  ngOnInit() {
    this.carregar();
  }

  /* Busca chaves e pedidos em paralelo */
  carregar() {
    const cliente = this.sessao.cliente();
    if (!cliente) return;

    this.carregando.set(true);
    this.erro.set('');
    forkJoin({
      chaves: this.service.listarChaves(cliente.codigo),
      pedidos: this.service.listarPorCliente(cliente.codigo),
    }).subscribe({
      next: ({ chaves, pedidos }) => {
        this.chaves.set(chaves);
        this.pedidos.set(pedidos);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemErro(err, 'Não foi possível abrir o seu arsenal.'));
        this.carregando.set(false);
      },
    });
  }

  /* Copia a chave para a área de transferência */
  copiar(chave: Chave) {
    navigator.clipboard
      .writeText(chave.chaveDigital)
      .then(() => this.aviso.sucesso(`Chave de ${chave.produto.nome} copiada!`))
      .catch(() => this.aviso.erro('Não foi possível copiar. Selecione a chave manualmente.'));
  }

  totalChaves(pedido: Pedido): number {
    return pedido.itens.reduce((soma, i) => soma + i.quantidade, 0);
  }
}
