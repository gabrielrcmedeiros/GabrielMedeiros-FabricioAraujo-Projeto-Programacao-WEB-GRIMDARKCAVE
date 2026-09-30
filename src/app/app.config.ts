import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/* Configuracao global da aplicacao exportada para injecao no main.ts */
export const appConfig: ApplicationConfig = {
  providers: [
    /* Habilita o rastreamento global de erros no navegador */
    provideBrowserGlobalErrorListeners(),
    
    /* Inicializa o roteador da aplicacao utilizando a matriz de rotas pre-definidas */
    provideRouter(routes)
  ]
};