/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Busca } from './busca';

describe('Busca', () => {
  let component: Busca;
  let fixture: ComponentFixture<Busca>;

  /* Funcao assincrona executada antes de cada teste para configurar o modulo e as dependencias */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Busca],
    }).compileComponents();

    /* Instancia o componente e assegura que a interface DOM virtual esteja estabilizada */
    fixture = TestBed.createComponent(Busca);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste basico de integridade para confirmar a criacao bem-sucedida do componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});