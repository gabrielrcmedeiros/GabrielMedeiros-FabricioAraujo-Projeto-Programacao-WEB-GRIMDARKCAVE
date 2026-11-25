import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NovoPedido, Pedido } from '../model/pedido';
import { Chave } from '../model/chave';
import { API_URL } from './api';

/* Acesso a /api/pedido e /api/chave */
@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly http = inject(HttpClient);

  /* POST /api/pedido */
  finalizar(pedido: NovoPedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_URL}/pedido`, pedido);
  }

  /* GET /api/pedido/cliente/{codigo} */
  listarPorCliente(codigoCliente: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/pedido/cliente/${codigoCliente}`);
  }

  /* GET /api/chave/cliente/{codigo} */
  listarChaves(codigoCliente: number): Observable<Chave[]> {
    return this.http.get<Chave[]>(`${API_URL}/chave/cliente/${codigoCliente}`);
  }
}
