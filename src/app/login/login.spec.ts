/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  /* Funcao assincrona executada antes de cada teste para configurar o modulo e instanciar o componente */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste padrao para verificar a integridade e a criacao bem-sucedida do componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});