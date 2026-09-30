import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  /* Grupos de controle reativo para gerenciamento dos formularios independentes */
  loginForm: FormGroup;
  cadastroForm: FormGroup;
  modoCadastro: boolean = false;
  
  /* Variaveis de estado para controle de visibilidade dos campos de senha */
  mostrarSenhaLogin: boolean = false;
  mostrarSenhaCadastro: boolean = false;

  /* Metodos alternadores para manipulacao do tipo de input das senhas */
  alternarSenhaLogin() {
    this.mostrarSenhaLogin = !this.mostrarSenhaLogin;
  }

  alternarSenhaCadastro() {
    this.mostrarSenhaCadastro = !this.mostrarSenhaCadastro;
  }

  constructor(private fb: FormBuilder, private router: Router) {
    /* Instanciacao do formulario de login com aplicacao de regras de validacao nativas */
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    /* Instanciacao do formulario de cadastro com aplicacao de regras de validacao e expressoes regulares (Regex) */
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      /* Aplicacao de expressao regular para validacao estrutural do formato do CPF */
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/)]],
      /* Aplicacao de expressao regular para validacao estrutural do formato do telefone contendo DDD */
      telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?(9\d{4})\-?(\d{4})$/)]]
    });
  }

  /* Metodo responsavel pela alternancia entre as interfaces de autenticacao e registro */
  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }

  /* Processa a tentativa de autenticacao cruzando as credenciais inseridas com os registros da base local */
  fazerLogin() {
    if (this.loginForm.valid) {
      const emailDigitado = this.loginForm.value.email;
      const senhaDigitada = this.loginForm.value.senha;
      
      if (typeof window !== 'undefined' && window.localStorage) {
        /* Recupera a colecao de usuarios armazenada no cache local */
        let usuarios = JSON.parse(localStorage.getItem('usuariosGDC') || '[]');
        
        /* Valida a existencia do usuario requerendo correspondencia exata de email e senha */
        let usuarioValido = usuarios.find((u: any) => u.email === emailDigitado && u.senha === senhaDigitada);

        if (usuarioValido) {
          localStorage.setItem('usuarioLogado', emailDigitado);
          alert('Acesso autorizado às criptas da GRIMDARK CAVE!');
          this.loginForm.reset();
          this.router.navigate(['/inicio']);
        } else {
          /* Interrompe a autenticacao em caso de credenciais invalidas ou nao encontradas */
          alert('ACESSO NEGADO: E-mail não encontrado ou senha incorreta.');
        }
      }
    }
  }

  /* Processa o registro de um novo usuario garantindo a unicidade do endereco de e-mail na persistencia local */
  fazerCadastro() {
    if (this.cadastroForm.valid) {
      if (typeof window !== 'undefined' && window.localStorage) {
        let usuarios = JSON.parse(localStorage.getItem('usuariosGDC') || '[]');
        
        /* Verifica e bloqueia a criacao de contas duplicadas utilizando o e-mail como chave primaria */
        if (usuarios.find((u: any) => u.email === this.cadastroForm.value.email)) {
          alert('Este e-mail já pertence a um membro das criptas!');
          return;
        }

        /* Insere o novo objeto no vetor principal e atualiza o armazenamento local */
        usuarios.push(this.cadastroForm.value);
        localStorage.setItem('usuariosGDC', JSON.stringify(usuarios));
      }

      alert('Recrutamento realizado com sucesso! Faça seu login para entrar.');
      this.cadastroForm.reset();
      this.modoCadastro = false;
    } else {
      /* Tratamento de excecao para submissao do formulario de cadastro em estado de validacao irregular */
      alert('Os dados inseridos são inválidos. Verifique o formato do CPF e do Telefone.');
    }
  }

  /* Interceptador de eventos de entrada para o campo CPF que sanitiza a string mantendo apenas digitos e pontuacoes aceitas */
  filtrarCpf(event: any) {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/[^0-9.-]/g, '');
    this.cadastroForm.get('cpf')?.setValue(valorLimpo, { emitEvent: false });
  }

  /* Interceptador de eventos de entrada para o campo Telefone que sanitiza a string mantendo apenas digitos e caracteres de formatacao aceitos */
  filtrarTelefone(event: any) {
    const input = event.target as HTMLInputElement;
    const valorLimpo = input.value.replace(/[^0-9() -]/g, '');
    this.cadastroForm.get('telefone')?.setValue(valorLimpo, { emitEvent: false });
  }
}