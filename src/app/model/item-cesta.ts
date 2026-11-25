import { Produto } from './produto';

/* Item da cesta */
export interface ItemCesta {
  produto: Produto;
  quantidade: number;
  valorTotal: number;
}
