/* Endereço base da API */
export const API_URL = 'http://localhost:8081/api';

/* Extrai a mensagem de erro da resposta da API */
export function mensagemErro(erro: unknown, padrao: string = 'Ocorreu um erro. Tente novamente.'): string {
  const resposta = erro as { status?: number; error?: { mensagem?: string } } | null;
  if (resposta?.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando na porta 8081.';
  }
  return resposta?.error?.mensagem ?? padrao;
}
