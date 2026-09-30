/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  /* Funcao assincrona para configuracao inicial do modulo root */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  /* Teste basico para avaliacao de integridade da classe App */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /* Avaliacao de contorno para o componente titulo da aplicacao */
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, loja-games');
  });
});