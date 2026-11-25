import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { routes } from './app.routes';

/* Formatação brasileira de moeda, números e datas */
registerLocaleData(localePt, 'pt-BR');

/* Configuração global da aplicação */
export const appConfig: ApplicationConfig = {
  providers: [
    /* Captura global de erros */
    provideBrowserGlobalErrorListeners(),

    /* Rotas, com retorno ao topo a cada navegação */
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),

    /* Cliente HTTP para a API */
    provideHttpClient(withFetch()),

    /* Idioma e moeda padrão */
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
};
