/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detalhe } from './detalhe';

describe('Detalhe', () => {
  let component: Detalhe;
  let fixture: ComponentFixture<Detalhe>;

  /* Funcao assincrona de preparacao executada antes de cada teste para estabilizacao do modulo */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(Detalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste de integridade basica para verificar a instanciacao bem-sucedida do componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});