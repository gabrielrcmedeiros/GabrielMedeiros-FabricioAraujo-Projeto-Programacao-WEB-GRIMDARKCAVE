/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Esqueci } from './esqueci';

describe('Esqueci', () => {
  let component: Esqueci;
  let fixture: ComponentFixture<Esqueci>;

  /* Funcao assincrona executada antes de cada teste para configurar as dependencias do componente */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Esqueci],
    }).compileComponents();

    /* Instanciacao do componente e estabilizacao do DOM virtual para testes */
    fixture = TestBed.createComponent(Esqueci);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste padrao para verificar se a instanciação do componente ocorreu sem erros de execucao */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});