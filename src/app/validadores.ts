import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/* Valida os dígitos verificadores do CPF */
export const cpfValido: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
  const digitos = String(controle.value ?? '').replace(/\D/g, '');
  if (digitos.length === 0) return null;
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return { cpf: true };

  const calcularDigito = (base: string, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiro = calcularDigito(digitos.substring(0, 9), 10);
  const segundo = calcularDigito(digitos.substring(0, 10), 11);
  return primeiro === Number(digitos[9]) && segundo === Number(digitos[10]) ? null : { cpf: true };
};

/* Exige promoção menor que o valor cheio */
export const promoValida: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const valor = Number(grupo.get('valor')?.value ?? 0);
  const promo = Number(grupo.get('promo')?.value ?? 0);
  return promo > 0 && promo >= valor ? { promoInvalida: true } : null;
};

/* Exige senha e confirmação iguais */
export const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('novaSenha')?.value;
  const confirmar = grupo.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
};
