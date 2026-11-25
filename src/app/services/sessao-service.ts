import { Injectable, computed, signal } from '@angular/core';
import { Cliente } from '../model/cliente';

/* Sessão do cliente logado, salva no localStorage */
@Injectable({
  providedIn: 'root',
})
export class SessaoService {
  private readonly chaveStorage = 'cliente';

  readonly cliente = signal<Cliente | null>(this.lerSessao());
  readonly logado = computed(() => this.cliente() !== null);
  readonly admin = computed(() => this.cliente()?.perfil === 'ADMIN');
  readonly primeiroNome = computed(() => (this.cliente()?.nome ?? '').split(' ')[0]);

  entrar(cliente: Cliente) {
    localStorage.setItem(this.chaveStorage, JSON.stringify(cliente));
    this.cliente.set(cliente);
  }

  sair() {
    localStorage.removeItem(this.chaveStorage);
    this.cliente.set(null);
  }

  /* Lê a sessão salva e remove chaves antigas do localStorage */
  private lerSessao(): Cliente | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuariosGDC');
    localStorage.removeItem('produto');
    const json = localStorage.getItem(this.chaveStorage);
    if (!json) return null;
    try {
      const cliente = JSON.parse(json) as Cliente;
      return cliente && cliente.codigo > 0 ? cliente : null;
    } catch {
      return null;
    }
  }
}
