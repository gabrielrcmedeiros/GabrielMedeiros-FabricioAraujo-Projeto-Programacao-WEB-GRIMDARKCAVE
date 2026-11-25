import { Produto } from './produto';

/* Item de um pedido gravado */
export interface ItemPedido {
  codigoItemPedido: number;
  produto: Produto;
  quantidade: number;
  valor: number;
}

/* Pedido devolvido pela API */
export interface Pedido {
  codigoPedido: number;
  codigoCliente: number;
  valorTotal: number;
  dataPedido: string;
  itens: ItemPedido[];
}

/* Dados enviados para finalizar a compra */
export interface NovoPedido {
  codigoCliente: number;
  itens: { produto: { codigo: number }; quantidade: number }[];
}
