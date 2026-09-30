import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-esqueci',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './esqueci.html',
  styleUrl: './esqueci.css'
})
export class Esqueci {
  /* Grupos de controle reativo para gerenciamento dos formularios independentes */
  recuperacaoForm: FormGroup;
  redefinicaoForm: FormGroup;
  
  /* Variaveis de estado para controle de interface e armazenamento transitorio de dados */
  etapa: number = 1; 
  codigoGerado: string = '';
  emailAlvo: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    /* Instanciacao do formulario da primeira etapa aplicando validacao nativa de email */
    this.recuperacaoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    /* Instanciacao do formulario da segunda etapa com validacao de tamanho minimo e regra customizada de confirmacao */
    this.redefinicaoForm = this.fb.group({
      codigo: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.senhasIguaisValidator });
  }

  /* Validacao customizada que cruza os valores de dois campos para garantir identidade estrita */
  senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('novaSenha')?.value;
    const confirmar = control.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { senhasDiferentes: true };
  }

  /* Funcao geradora de sequencia alfanumerica pseudo-aleatoria para autenticacao em duas etapas simulada */
  gerarCodigoUnico(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /* Avalia o formulario inicial, cruza dados com o banco local e despacha o identificador se o usuario for valido */
  enviarEmail() {
    if (this.recuperacaoForm.valid) {
      this.emailAlvo = this.recuperacaoForm.value.email;

      if (typeof window !== 'undefined' && window.localStorage) {
        /* Extrai a colecao de usuarios armazenada no cache local */
        let usuarios = JSON.parse(localStorage.getItem('usuariosGDC') || '[]');
        
        /* Aplica funcao de busca logica para verificar a presenca do email na base de dados */
        let usuarioExiste = usuarios.some((u: any) => u.email === this.emailAlvo);

        if (!usuarioExiste) {
          alert('Operacao negada: O e-mail informado nao consta em nossos registros.');
          return;
        }
      }

      /* Gera a credencial provisoria e libera o acesso a proxima view de redefinicão */
      this.codigoGerado = this.gerarCodigoUnico();

      alert(
        `SINAL DE EMERGENCIA PROCESSADO!\n\n` +
        `Um protocolo de redefinicao foi aberto para: ${this.emailAlvo}\n\n` +
        `SEU CODIGO UNICO DE ACESSO: [ ${this.codigoGerado} ]\n\n` +
        `Guarde este codigo. Insira-o na proxima tela para forjar sua nova senha.`
      );
      
      this.etapa = 2;
    } else {
      alert('Acesso negado: E obrigatorio informar um e-mail valido para rastreio.');
    }
  }

  /* Compara a entrada do usuario com a string gerada e efetiva a persistencia da nova senha caso autenticado */
  redefinirSenha() {
    if (this.redefinicaoForm.valid) {
      const codigoDigitado = this.redefinicaoForm.value.codigo.toUpperCase().trim();
      const novaSenha = this.redefinicaoForm.value.novaSenha;

      if (codigoDigitado === this.codigoGerado) {
        if (typeof window !== 'undefined' && window.localStorage) {
          
          /* Isola a base de usuarios e mapeia o indice correspondente ao registro modificado */
          let usuarios = JSON.parse(localStorage.getItem('usuariosGDC') || '[]');
          let usuarioIndex = usuarios.findIndex((u: any) => u.email === this.emailAlvo);

          if (usuarioIndex !== -1) {
            /* Altera estritamente a propriedade da senha e sobrescreve o objeto matriz no storage */
            usuarios[usuarioIndex].senha = novaSenha;
            localStorage.setItem('usuariosGDC', JSON.stringify(usuarios));
            
            alert('Operacao concluida: Senha redefinida com sucesso.');
            this.router.navigate(['/login']);
          } else {
            alert('Falha na operacao: Usuario nao localizado no banco de dados.');
          }
        }
      } else {
        alert('Codigo invalido. O acesso foi negado.');
      }
    } else {
      alert('Falha na validacao: Preencha todos os campos e certifique-se de que as senhas sao identicas.');
    }
  }
}