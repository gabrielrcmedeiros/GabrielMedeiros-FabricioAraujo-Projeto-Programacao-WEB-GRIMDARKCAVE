import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../services/cliente-service';
import { NotificacaoService } from '../services/notificacao-service';
import { mensagemErro } from '../services/api';
import { senhasIguais } from '../validadores';

@Component({
  selector: 'app-esqueci',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './esqueci.html',
  styleUrl: './esqueci.css',
})
export class Esqueci {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(ClienteService);
  private readonly aviso = inject(NotificacaoService);

  /* Etapa 1: e-mail; etapa 2: código e nova senha */
  readonly etapa = signal<1 | 2>(1);
  readonly emailAlvo = signal('');
  readonly codigoRecebido = signal('');
  readonly enviando = signal(false);

  readonly recuperacaoForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly redefinicaoForm = this.fb.nonNullable.group(
    {
      codigo: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );

  /* Solicita o código de recuperação */
  enviarEmail() {
    if (this.recuperacaoForm.invalid) {
      this.aviso.erro('Acesso negado: é obrigatório informar um e-mail válido para rastreio.');
      return;
    }
    const email = this.recuperacaoForm.getRawValue().email;

    this.enviando.set(true);
    this.service.recuperarSenha(email).subscribe({
      next: (resposta) => {
        this.enviando.set(false);
        this.emailAlvo.set(email);
        this.codigoRecebido.set(resposta.codigo);
        this.redefinicaoForm.reset();
        this.etapa.set(2);
        this.aviso.sucesso('Sinal de emergência processado! Confira o código na caixa de mensagens.');
      },
      error: (err) => {
        this.enviando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível gerar o código.'));
      },
    });
  }

  /* Troca a senha usando o código */
  redefinirSenha() {
    if (this.redefinicaoForm.invalid) {
      this.aviso.erro('Preencha todos os campos e certifique-se de que as senhas são idênticas.');
      return;
    }
    const { codigo, novaSenha } = this.redefinicaoForm.getRawValue();

    this.enviando.set(true);
    this.service.redefinirSenha(this.emailAlvo(), codigo.toUpperCase().trim(), novaSenha).subscribe({
      next: (resposta) => {
        this.enviando.set(false);
        this.aviso.sucesso(resposta.mensagem + ' Faça login com a nova senha.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.enviando.set(false);
        this.aviso.erro(mensagemErro(err, 'Não foi possível redefinir a senha.'));
      },
    });
  }

  voltar() {
    this.etapa.set(1);
    this.codigoRecebido.set('');
  }
}
