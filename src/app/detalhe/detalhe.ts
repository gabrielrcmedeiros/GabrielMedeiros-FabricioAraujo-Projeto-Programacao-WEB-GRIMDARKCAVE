import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detalhe',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.css'
})
export class Detalhe implements OnInit {
  /* Propriedade para armazenamento e vinculacao do objeto selecionado na visualizacao */
  produto: any;

  /* Metodo de ciclo de vida inicial: executa a recuperacao do contexto do produto armazenado na sessao local */
  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      let prodStorage = localStorage.getItem('produto');
      if (prodStorage) {
        this.produto = JSON.parse(prodStorage);
      }
    }
  }

  /* Metodo gestor de inclusao de carrinho: verifica duplicidade, ajusta quantidades e persiste o estado localmente */
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