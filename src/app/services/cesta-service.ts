import { Injectable, computed, signal } from '@angular/core';
import { ItemCesta } from '../model/item-cesta';
import { Produto, precoAtual } from '../model/produto';

/* Cesta de compras, salva no localStorage */
@Injectable({
  providedIn: 'root',
})
export class CestaService {
  private readonly chaveStorage = 'cesta';

  readonly itens = signal<ItemCesta[]>(this.lerCesta());
  readonly quantidadeTotal = computed(() => this.itens().reduce((soma, i) => soma + i.quantidade, 0));
  readonly valorTotal = computed(() => this.itens().reduce((soma, i) => soma + i.valorTotal, 0));
  readonly economia = computed(() =>
    this.itens().reduce((soma, i) => soma + (i.produto.valor - precoAtual(i.produto)) * i.quantidade, 0),
  );

  /* Unidades do jogo na cesta */
  quantidadeDe(codigo: number): number {
    return this.itens().find((i) => i.produto.codigo === codigo)?.quantidade ?? 0;
  }

  /* Adiciona uma unidade; false se o estoque for atingido */
  adicionar(produto: Produto): boolean {
    const atual = this.quantidadeDe(produto.codigo);
    if (atual >= produto.quantidade) return false;

    if (atual > 0) {
      this.salvar(
        this.itens().map((i) => (i.produto.codigo === produto.codigo ? this.montar(produto, atual + 1) : i)),
      );
    } else {
      this.salvar([...this.itens(), this.montar(produto, 1)]);
    }
    return true;
  }

  /* Altera a quantidade entre 1 e o estoque; false se bloqueado */
  alterarQuantidade(codigo: number, delta: number): boolean {
    const item = this.itens().find((i) => i.produto.codigo === codigo);
    if (!item) return false;
    const nova = item.quantidade + delta;
    if (nova < 1 || nova > item.produto.quantidade) return false;
    this.salvar(this.itens().map((i) => (i.produto.codigo === codigo ? this.montar(i.produto, nova) : i)));
    return true;
  }

  remover(codigo: number) {
    this.salvar(this.itens().filter((i) => i.produto.codigo !== codigo));
  }

  limpar() {
    this.salvar([]);
  }

  /* Atualiza preço e estoque pela API e devolve avisos de ajuste */
  sincronizar(catalogo: Produto[]): string[] {
    const avisos: string[] = [];
    const atualizados: ItemCesta[] = [];

    for (const item of this.itens()) {
      const produto = catalogo.find((p) => p.codigo === item.produto.codigo);
      if (!produto) {
        avisos.push(`${item.produto.nome} saiu do catálogo e foi removido da cesta.`);
      } else if (produto.quantidade <= 0) {
        avisos.push(`${produto.nome} esgotou e foi removido da cesta.`);
      } else if (item.quantidade > produto.quantidade) {
        avisos.push(`Só restam ${produto.quantidade} unidade(s) de ${produto.nome}. Quantidade ajustada.`);
        atualizados.push(this.montar(produto, produto.quantidade));
      } else {
        atualizados.push(this.montar(produto, item.quantidade));
      }
    }
    this.salvar(atualizados);
    return avisos;
  }

  private montar(produto: Produto, quantidade: number): ItemCesta {
    return { produto, quantidade, valorTotal: precoAtual(produto) * quantidade };
  }

  private salvar(itens: ItemCesta[]) {
    this.itens.set(itens);
    if (itens.length > 0) {
      localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
    } else {
      localStorage.removeItem(this.chaveStorage);
    }
  }

  private lerCesta(): ItemCesta[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const itens = JSON.parse(localStorage.getItem(this.chaveStorage) || '[]');
      return Array.isArray(itens) ? itens : [];
    } catch {
      return [];
    }
  }
}
