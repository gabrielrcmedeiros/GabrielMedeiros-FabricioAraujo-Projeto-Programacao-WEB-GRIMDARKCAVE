import { Component, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements DoCheck {
  /* Variaveis reativas encarregadas do armazenamento de metadados da sessao e estado da busca */
  termoPesquisa: string = '';
  usuarioLogado: string | null = null;

  /* Inversao de controle com padrao de injecao do provedor de roteamento */
  constructor(private router: Router) {}

  /* Implementacao de verificador de ciclo continuo (DoCheck) para monitoramento do estado da sessao no armazenamento local */
  ngDoCheck() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.usuarioLogado = localStorage.getItem('usuarioLogado');
    }
  }

  /* Captura da submissao do relatorio de busca com execucao de parametrizacao e redirecionamento de view */
  realizarBusca() {
    if (this.termoPesquisa.trim() !== '') {
      this.router.navigate(['/busca'], { queryParams: { q: this.termoPesquisa.trim() } });
    }
  }

  /* Funcao controladora de desconexao responsavel por remover credenciais da memoria local */
  sair() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('usuarioLogado');
    }
    alert('Operacao concluida: O usuario foi desconectado do sistema.');
    this.router.navigate(['/inicio']);
  }
}