import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css'
})
export class Biblioteca implements OnInit {
  /* Vetor responsavel por armazenar e fornecer os dados dos produtos adquiridos para a interface */
  jogosAdquiridos: any[] = [];
  
  /* Variavel de controle para armazenar a identificacao do usuario ativo na sessao */
  usuarioAtual: string | null = '';

  constructor(private router: Router) {}

  /* Metodo de ciclo de vida executado na inicializacao do componente */
  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      
      /* Recupera a credencial do usuario autenticado armazenada localmente */
      this.usuarioAtual = localStorage.getItem('usuarioLogado');

      /* Controle de acesso: bloqueia a visualizacao e redireciona para o login se o usuario nao estiver autenticado */
      if (!this.usuarioAtual) {
        alert('Acesso negado. Identifique-se para visualizar seu arsenal.');
        this.router.navigate(['/login']);
        return;
      }

      /* Realiza a busca no armazenamento local filtrando exclusivamente pelo historico da conta logada */
      let historico = localStorage.getItem(`biblioteca_${this.usuarioAtual}`);
      
      /* Se o registro existir, converte a string JSON de volta para objeto e atribui ao vetor principal */
      if (historico) {
        this.jogosAdquiridos = JSON.parse(historico);
      }
    }
  }
}