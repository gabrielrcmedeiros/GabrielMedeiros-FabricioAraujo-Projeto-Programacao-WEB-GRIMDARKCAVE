import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cesta.html',
  styleUrl: './cesta.css'
})
export class Cesta implements OnInit {
  /* Estruturas de dados para gerenciamento de estado do carrinho de compras */
  itens: any[] = [];
  valorCesta: number = 0;
  mensagem: string = "";

  constructor(private router: Router) {}

  /* Metodo de ciclo de vida executado na inicializacao para carregar os dados em cache */
  ngOnInit() {
    this.carregarCesta();
  }

  /* Recupera e formata os itens armazenados na sessao atual do usuario */
  carregarCesta() {
    if (typeof window !== 'undefined' && window.localStorage) {
      let cestaStorage = localStorage.getItem('cesta');
      if (cestaStorage) {
        this.itens = JSON.parse(cestaStorage);
      }
    }

    if (this.itens.length === 0) {
      this.mensagem = "Sua cesta de compras está vazia.";
    } else {
      this.mensagem = "";
    }

    this.calculaTotal();
  }

  /* Processa o somatorio total dos valores financeiros dos produtos contidos no carrinho */
  calculaTotal() {
    this.valorCesta = 0;
    for (let obj of this.itens) {
      this.valorCesta += obj.valorTotal;
    }
  }

  /* Esvazia o carrinho de compras e redefine as variaveis de estado para o valor inicial */
  limparCesta() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('cesta');
      this.itens = [];
      this.valorCesta = 0;
      this.mensagem = "Sua cesta de compras está vazia.";
    }
  }

  /* Remove um item especifico do carrinho com base no codigo do produto preservando os demais */
  removerItem(codigo: number) {
    if (typeof window !== 'undefined' && window.localStorage) {
      /* Filtra a matriz retendo exclusivamente as entradas nao correspondentes ao codigo informado */
      this.itens = this.itens.filter((item: any) => item.produto.codigo !== codigo);
      
      /* Atualiza o armazenamento local com a matriz resultante */
      localStorage.setItem('cesta', JSON.stringify(this.itens));
      
      /* Recalcula os totais financeiros apos a atualizacao da lista */
      this.calculaTotal();
      
      /* Valida o estado atual do carrinho para atualizar a renderizacao da interface caso esteja vazio */
      if (this.itens.length === 0) {
        this.mensagem = "Sua cesta de compras está vazia.";
      }
    }
  }

  /* Aplica incremento ou decremento na quantidade do item com avaliacao de limite minimo permitido */
  alterarQuantidade(codigo: number, delta: number) {
    if (typeof window !== 'undefined' && window.localStorage) {
      let itemIndex = this.itens.findIndex((item: any) => item.produto.codigo === codigo);
      
      if (itemIndex !== -1) {
        let item = this.itens[itemIndex];
        
        /* Trava logica: Interrompe a execucao se a quantidade for o limite minimo e a acao for de decremento */
        if (item.quantidade === 1 && delta === -1) {
          return; 
        }

        let precoEfetivo = item.produto.promo > 0 ? item.produto.promo : item.produto.valor;
        
        /* Aplica o operador de variacao na quantidade total e atualiza o subtotal da linha correspondente */
        item.quantidade += delta;
        item.valorTotal = item.quantidade * precoEfetivo;

        /* Registra a nova configuracao no armazenamento local e solicita o recalculo do montante final */
        localStorage.setItem('cesta', JSON.stringify(this.itens));
        this.calculaTotal();
      }
    }
  }

  /* Gera uma string alfanumerica pseudo-aleatoria formatada para simular uma chave de ativacao digital */
  gerarChaveAtivacao(): string {
    const part = () => Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${part()}-${part()}-${part()}`;
  }

  /* Processa o fluxo de checkout, vincula os itens a conta do usuario logado e gera as concessoes de acesso */
  finalizarCompra() {
    if (typeof window !== 'undefined' && window.localStorage) {
      let usuarioLogado = localStorage.getItem('usuarioLogado');
      
      /* Interrompe o processo e redireciona para a tela de autenticacao caso nao exista usuario logado */
      if (!usuarioLogado) {
        alert('Acesso restrito! Você precisa fazer login nas criptas antes de finalizar a compra.');
        this.router.navigate(['/login']);
        return; 
      }

      if (this.itens.length > 0) {
        /* Localiza o historico de compras do usuario ativo ou inicializa uma nova matriz vazia */
        let chaveBancoUser = `biblioteca_${usuarioLogado}`;
        let bibliotecaAtual = JSON.parse(localStorage.getItem(chaveBancoUser) || '[]');

        /* Itera sobre a matriz de itens do carrinho para processamento e desmembramento individual */
        this.itens.forEach(item => {
          
          /* Estrutura de repeticao interna responsavel por gerar chaves unicas para cada unidade adquirida do produto */
          for (let i = 0; i < item.quantidade; i++) {
            bibliotecaAtual.push({
              produto: item.produto,
              dataCompra: new Date().toLocaleDateString('pt-BR'),
              chaveDigital: this.gerarChaveAtivacao()
            });
          }
          
        });

        /* Registra os artefatos adquiridos e formatados no perfil do usuario atual no armazenamento local */
        localStorage.setItem(chaveBancoUser, JSON.stringify(bibliotecaAtual));

        alert('Transação concluída! Os artefatos foram enviados para o seu arsenal.');
        this.limparCesta();
        
        /* Redireciona o usuario para a interface de controle do acervo apos a conclusao bem-sucedida do fluxo */
        this.router.navigate(['/biblioteca']);
      }
    }
  }
}