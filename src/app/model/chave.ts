import { Produto } from './produto';

/* Chave de ativação de um jogo comprado */
export interface Chave {
  codigo: number;
  chaveDigital: string;
  produto: Produto;
  codigoCliente: number;
  codigoPedido: number;
  dataCompra: string;
}
