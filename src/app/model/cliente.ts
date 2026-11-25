/* Cliente (espelha a entidade da API; a senha nunca é devolvida) */
export class Cliente {
  codigo: number = 0;
  nome: string = '';
  email: string = '';
  senha?: string;
  cpf: string = '';
  telefone: string = '';
  perfil: string = 'CLIENTE';
}
