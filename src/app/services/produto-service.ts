import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../model/produto';
import { API_URL } from './api';

/* Acesso a /api/produto */
@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/produto`;

  /* GET /api/produto */
  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url);
  }

  /* GET /api/produto/destaques */
  destaques(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.url}/destaques`);
  }

  /* GET /api/produto/categorias */
  categorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categorias`);
  }

  /* GET /api/produto/busca?termo=... */
  buscarPorTermo(termo: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.url}/busca`, { params: { termo } });
  }

  /* GET /api/produto/busca?categoria=... */
  buscarPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.url}/busca`, { params: { categoria } });
  }

  /* GET /api/produto/{codigo} */
  carregar(codigo: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.url}/${codigo}`);
  }

  /* POST /api/produto */
  gravar(obj: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.url, obj);
  }

  /* PUT /api/produto/{codigo} */
  alterar(obj: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.url}/${obj.codigo}`, obj);
  }

  /* DELETE /api/produto/{codigo} */
  remover(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${codigo}`);
  }
}
