import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente';
import { API_URL } from './api';

/* Resposta da recuperação de senha (envio de e-mail simulado) */
export interface RespostaRecuperacao {
  mensagem: string;
  codigo: string;
}

/* Acesso a /api/cliente */
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/cliente`;

  /* POST /api/cliente */
  cadastrar(obj: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, obj);
  }

  /* POST /api/cliente/login */
  login(email: string, senha: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.url}/login`, { email, senha });
  }

  /* POST /api/cliente/recuperarSenha */
  recuperarSenha(email: string): Observable<RespostaRecuperacao> {
    return this.http.post<RespostaRecuperacao>(`${this.url}/recuperarSenha`, { email });
  }

  /* PATCH /api/cliente/redefinirSenha */
  redefinirSenha(email: string, codigo: string, novaSenha: string): Observable<{ mensagem: string }> {
    return this.http.patch<{ mensagem: string }>(`${this.url}/redefinirSenha`, {
      email,
      codigo,
      novaSenha,
    });
  }
}
