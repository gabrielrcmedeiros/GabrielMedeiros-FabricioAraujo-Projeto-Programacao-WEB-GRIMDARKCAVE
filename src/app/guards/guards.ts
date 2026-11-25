import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessaoService } from '../services/sessao-service';
import { NotificacaoService } from '../services/notificacao-service';

/* Exige login; sem ele, redireciona ao login */
export const authGuard: CanActivateFn = (_rota, estado) => {
  const sessao = inject(SessaoService);
  if (sessao.logado()) return true;

  inject(NotificacaoService).info('Identifique-se para acessar esta área das criptas.');
  return inject(Router).createUrlTree(['/login'], { queryParams: { retorno: estado.url } });
};

/* Exige perfil ADMIN */
export const adminGuard: CanActivateFn = () => {
  const sessao = inject(SessaoService);
  if (sessao.admin()) return true;

  inject(NotificacaoService).erro('Área restrita ao Mestre das Criptas.');
  return inject(Router).createUrlTree(['/inicio']);
};
