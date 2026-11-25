import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente-service';
import { SessaoService } from '../services/sessao-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';
import { cpfValido } from '../validadores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ClienteService);
  private readonly sessao = inject(SessaoService);
  private readonly aviso = inject(NotificacaoService);

  /* Estado da tela */
  readonly modoCadastro = signal(false);
  readonly mostrarSenhaLogin = signal(false);
  readonly mostrarSenhaCadastro = signal(false);
  readonly enviando = signal(false);

  /* Formulário de login */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  /* Formulário de cadastro */
  readonly cadastroForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/), cpfValido]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?(9\d{4})\-?(\d{4})$/)]],
  });

  alternarModo(cadastro: boolean) {
    this.modoCadastro.set(cadastro);
  }

  /* Autentica o cliente */
  fazerLogin() {
    if (this.loginForm.invalid) return;
    const { email, senha } = this.loginForm.getRawValue();

    this.enviando.set(true);
    this.service.login(email, senha).subscribe({
      next: (cliente) => {
        this.enviando.set(false);
        this.entrar(cliente, `Acesso autorizado às criptas! Bem-vindo, ${cliente.nome.split(' ')[0]}.`);
      },
      error: (err) => {
        this.enviando.set(false);
        this.aviso.erro(mensagemErro(err, 'ACESSO NEGADO: e-mail não encontrado ou senha incorreta.'));
      },
    });
  }

  /* Cadastra e já inicia a sessão */
  fazerCadastro() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.aviso.erro('Os dados inseridos são inválidos. Verifique o CPF e o telefone.');
      return;
    }

    const novo: Cliente = { ...new Cliente(), ...this.cadastroForm.getRawValue() };
    this.enviando.set(true);
    this.service.cadastrar(novo).subscribe({
      next: (cliente) => {
        this.enviando.set(false);
        this.cadastroForm.reset();
        this.entrar(cliente, 'Recrutamento realizado com sucesso! Você já está nas criptas.');
      },
      error: (err) => {
        this.enviando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível concluir o cadastro.'));
      },
    });
  }

  /* Inicia a sessão e volta à página de origem */
  private entrar(cliente: Cliente, mensagem: string) {
    this.sessao.entrar(cliente);
    this.loginForm.reset();
    this.aviso.sucesso(mensagem);
    const retorno = this.route.snapshot.queryParamMap.get('retorno');
    this.router.navigateByUrl(retorno && retorno.startsWith('/') ? retorno : '/inicio');
  }

  /* Aceita só dígitos, ponto e hífen */
  filtrarCpf(event: Event) {
    const input = event.target as HTMLInputElement;
    this.cadastroForm.controls.cpf.setValue(input.value.replace(/[^0-9.-]/g, ''), { emitEvent: false });
  }

  /* Aceita só dígitos e formatação de telefone */
  filtrarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    this.cadastroForm.controls.telefone.setValue(input.value.replace(/[^0-9() -]/g, ''), { emitEvent: false });
  }
}
