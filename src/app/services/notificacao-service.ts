import { Injectable, signal } from '@angular/core';

export type TipoNotificacao = 'sucesso' | 'erro' | 'info';

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  texto: string;
}

/* Notificações temporárias no canto da tela */
@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  readonly lista = signal<Notificacao[]>([]);
  private sequencia = 0;

  sucesso(texto: string) {
    this.mostrar('sucesso', texto);
  }

  erro(texto: string) {
    this.mostrar('erro', texto, 6500);
  }

  info(texto: string) {
    this.mostrar('info', texto);
  }

  fechar(id: number) {
    this.lista.update((lista) => lista.filter((n) => n.id !== id));
  }

  private mostrar(tipo: TipoNotificacao, texto: string, duracao: number = 4500) {
    const id = ++this.sequencia;
    /* No máximo 4 visíveis */
    this.lista.update((lista) => [...lista.slice(-3), { id, tipo, texto }]);
    setTimeout(() => this.fechar(id), duracao);
  }
}
