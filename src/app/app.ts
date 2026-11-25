import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessaoService } from './services/sessao-service';
import { CestaService } from './services/cesta-service';
import { NotificacaoService } from './services/notificacao-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /* Serviços usados no cabeçalho e nas notificações */
  protected readonly sessao = inject(SessaoService);
  protected readonly cesta = inject(CestaService);
  protected readonly notificacoes = inject(NotificacaoService);
  private readonly router = inject(Router);

  termoPesquisa: string = '';
  readonly anoAtual = new Date().getFullYear();

  constructor() {
    /* Troca capas que não carregam pela imagem padrão (exceto a pré-visualização da Forja) */
    document.addEventListener(
      'error',
      (evento) => {
        const alvo = evento.target;
        if (alvo instanceof HTMLImageElement && !alvo.classList.contains('preview-capa') && !alvo.dataset['semCapa']) {
          alvo.dataset['semCapa'] = '1';
          alvo.src = 'sem-capa.svg';
        }
      },
      true,
    );
  }

  /* Abre a busca com o termo digitado */
  realizarBusca() {
    const termo = this.termoPesquisa.trim();
    if (termo !== '') {
      this.router.navigate(['/busca'], { queryParams: { q: termo } });
    }
  }

  /* Encerra a sessão e volta ao catálogo */
  sair() {
    this.sessao.sair();
    this.notificacoes.info('Você deixou as criptas. Até a próxima, viajante.');
    this.router.navigate(['/inicio']);
  }
}
