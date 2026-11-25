import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto, desconto, imagemDe } from '../model/produto';
import { CestaService } from '../services/cesta-service';
import { NotificacaoService } from '../services/notificacao-service';

/* Cartão de jogo reutilizável */
@Component({
  selector: 'app-card-jogo',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './card-jogo.html',
})
export class CardJogo {
  /* Jogo exibido no cartão */
  readonly produto = input.required<Produto>();

  private readonly cesta = inject(CestaService);
  private readonly aviso = inject(NotificacaoService);

  protected readonly imagemDe = imagemDe;
  protected readonly desconto = desconto;

  comprar() {
    const jogo = this.produto();
    if (this.cesta.adicionar(jogo)) {
      this.aviso.sucesso(`${jogo.nome} adicionado à cesta!`);
    } else {
      this.aviso.info(`Você já tem todas as ${jogo.quantidade} unidade(s) disponíveis de ${jogo.nome} na cesta.`);
    }
  }
}
