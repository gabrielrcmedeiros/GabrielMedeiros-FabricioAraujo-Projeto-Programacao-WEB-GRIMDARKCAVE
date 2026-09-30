/* Importacoes necessarias para a configuracao do ambiente de testes unitarios do Angular */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cesta } from './cesta';

describe('Cesta', () => {
  let component: Cesta;
  let fixture: ComponentFixture<Cesta>;

  /* Funcao assincrona executada antes de cada teste para configurar o modulo e as dependencias */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cesta],
    }).compileComponents();

    /* Instancia o componente e assegura que a interface DOM virtual esteja estabilizada */
    fixture = TestBed.createComponent(Cesta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /* Teste basico de integridade para confirmar a criacao bem-sucedida do componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});