/* Jogo do catálogo (espelha a entidade Produto da API) */
export class Produto {
  codigo: number = 0;
  nome: string = '';
  categoria: string = '';
  desenvolvedora: string = '';
  plataforma: string = '';
  descritivo: string = '';
  valor: number = 0;
  promo: number = 0;
  quantidade: number = 0;
  destaque: number = 0;
  imagem: string = '';
}

/* Preço cobrado: o promocional, se houver */
export function precoAtual(produto: Produto): number {
  return produto.promo > 0 ? produto.promo : produto.valor;
}

/* Caminho da capa (campo imagem ou codigo.jpg) */
export function imagemDe(produto: Produto): string {
  return produto.imagem ? produto.imagem : `${produto.codigo}.jpg`;
}

/* Percentual de desconto */
export function desconto(produto: Produto): number {
  if (produto.promo <= 0 || produto.valor <= 0) return 0;
  return Math.round((1 - produto.promo / produto.valor) * 100);
}
