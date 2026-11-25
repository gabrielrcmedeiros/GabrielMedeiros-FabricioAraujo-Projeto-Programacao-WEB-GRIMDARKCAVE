import { Routes } from '@angular/router';

/* Telas da aplicação */
import { Vitrine } from './vitrine/vitrine';
import { Detalhe } from './detalhe/detalhe';
import { Cesta } from './cesta/cesta';
import { Busca } from './busca/busca';
import { Login } from './login/login';
import { Esqueci } from './esqueci/esqueci';
import { Biblioteca } from './biblioteca/biblioteca';
import { Admin } from './admin/admin';
import { adminGuard, authGuard } from './guards/guards';

/* Rotas */
export const routes: Routes = [
  /* Raiz redireciona para o catálogo */
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  /* Telas públicas */
  { path: 'inicio', component: Vitrine, title: 'GRIMDARK CAVE | Catálogo' },
  { path: 'detalhe/:codigo', component: Detalhe, title: 'GRIMDARK CAVE | Artefato' },
  { path: 'cesta', component: Cesta, title: 'GRIMDARK CAVE | Cesta' },
  { path: 'busca', component: Busca, title: 'GRIMDARK CAVE | Busca' },
  { path: 'login', component: Login, title: 'GRIMDARK CAVE | Entrar' },
  { path: 'esqueci', component: Esqueci, title: 'GRIMDARK CAVE | Recuperar acesso' },

  /* Exigem login (biblioteca) ou perfil ADMIN (admin) */
  { path: 'biblioteca', component: Biblioteca, canActivate: [authGuard], title: 'GRIMDARK CAVE | Meu Arsenal' },
  { path: 'admin', component: Admin, canActivate: [adminGuard], title: 'GRIMDARK CAVE | Forja' },

  /* Endereço desconhecido volta ao catálogo */
  { path: '**', redirectTo: 'inicio' },
];
