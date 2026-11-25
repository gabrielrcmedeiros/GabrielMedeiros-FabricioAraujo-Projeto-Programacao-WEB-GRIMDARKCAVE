import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ItemCesta } from '../model/item-cesta';
import { NovoPedido } from '../model/pedido';
import { imagemDe, precoAtual } from '../model/produto';
import { CestaService } from '../services/cesta-service';
import { SessaoService } from '../services/sessao-service';
import { PedidoService } from '../services/pedido-service';
import { ProdutoService } from '../services/produto-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';

@Component({
  selector: 'app-cesta',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cesta.html',
  styleUrl: './cesta.css',
})
export class Cesta implements OnInit {
  protected readonly cesta = inject(CestaService);
  protected readonly sessao = inject(SessaoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly produtoService = inject(ProdutoService);
  private readonly aviso = inject(NotificacaoService);
  private readonly router = inject(Router);

  readonly finalizando = signal(false);

  protected readonly imagemDe = imagemDe;
  protected readonly precoAtual = precoAtual;

  /* Atualiza preços e estoque ao abrir */
  ngOnInit() {
    this.sincronizarComCatalogo();
  }

  private sincronizarComCatalogo() {
    if (this.cesta.itens().length === 0) return;
    this.produtoService.listar().subscribe({
      next: (catalogo) => this.cesta.sincronizar(catalogo).forEach((msg) => this.aviso.info(msg)),
      error: () => {
        /* Sem conexão: mantém a cesta local */
      },
    });
  }

  alterarQuantidade(item: ItemCesta, delta: number) {
    if (!this.cesta.alterarQuantidade(item.produto.codigo, delta) && delta > 0) {
      this.aviso.info(`Limite de estoque atingido: ${item.produto.quantidade} unidade(s) de ${item.produto.nome}.`);
    }
  }

  removerItem(item: ItemCesta) {
    this.cesta.remover(item.produto.codigo);
    this.aviso.info(`${item.produto.nome} foi descartado da cesta.`);
  }

  limparCesta() {
    this.cesta.limpar();
    this.aviso.info('A cesta foi esvaziada.');
  }

  /* Envia o pedido; a API valida o estoque, calcula o total e gera as chaves */
  finalizarCompra() {
    const cliente = this.sessao.cliente();
    if (!cliente) {
      this.aviso.info('Acesso restrito! Faça login nas criptas antes de finalizar a compra.');
      this.router.navigate(['/login'], { queryParams: { retorno: '/cesta' } });
      return;
    }
    if (this.cesta.itens().length === 0) return;

    const pedido: NovoPedido = {
      codigoCliente: cliente.codigo,
      itens: this.cesta.itens().map((i) => ({ produto: { codigo: i.produto.codigo }, quantidade: i.quantidade })),
    };

    this.finalizando.set(true);
    this.pedidoService.finalizar(pedido).subscribe({
      next: (salvo) => {
        const chaves = salvo.itens.reduce((soma, i) => soma + i.quantidade, 0);
        this.cesta.limpar();
        this.finalizando.set(false);
        this.aviso.sucesso(`Transação #${salvo.codigoPedido} concluída! ${chaves} chave(s) enviada(s) ao seu arsenal.`);
        this.router.navigate(['/biblioteca']);
      },
      error: (err) => {
        this.finalizando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível finalizar a compra.'));
        /* Estoque ou catálogo mudou: atualiza a cesta */
        if (err?.status === 409 || err?.status === 404) this.sincronizarComCatalogo();
        /* Sessão inválida: exige novo login */
        if (err?.status === 401) {
          this.sessao.sair();
          this.router.navigate(['/login'], { queryParams: { retorno: '/cesta' } });
        }
      },
    });
  }
}
