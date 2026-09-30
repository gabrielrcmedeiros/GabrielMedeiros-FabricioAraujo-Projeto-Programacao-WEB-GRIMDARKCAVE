/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vitrine } from './vitrine';

describe('Vitrine', () => {
  let component: Vitrine;
  let fixture: ComponentFixture<Vitrine>;

  /* Funcao assincrona executada antes de cada teste para configurar as dependencias e instanciar o componente */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vitrine],
    }).compileComponents();

    fixture = TestBed.createComponent(Vitrine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste basico de integridade para confirmar a criacao bem-sucedida do componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});