import { Routes } from '@angular/router';

/* Importacoes dos componentes estruturais requeridos para a definicao dos caminhos virtuais */
import { Vitrine } from './vitrine/vitrine';
import { Detalhe } from './detalhe/detalhe';
import { Cesta } from './cesta/cesta';
import { Busca } from './busca/busca';
import { Login } from './login/login';
import { Esqueci } from './esqueci/esqueci';
import { Biblioteca } from './biblioteca/biblioteca';

/* Matriz de configuracao definindo as entidades da arvore de roteamento */
export const routes: Routes = [
  
  /* Interceptacao da rota base com mecanismo de redirecionamento padrao */
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  
  /* Mapeamento de endpoints paras as classes instanciadoras */
  { path: 'inicio', component: Vitrine },
  { path: 'detalhe', component: Detalhe },
  { path: 'cesta', component: Cesta },
  { path: 'busca', component: Busca },
  { path: 'login', component: Login },
  { path: 'esqueci', component: Esqueci },
  { path: 'biblioteca', component: Biblioteca },
];