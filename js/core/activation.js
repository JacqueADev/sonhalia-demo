/**
 * Regras de ativação do código da cartilha.
 *
 * No protótipo a validação roda no navegador, só para demonstração. Na versão real
 * ela acontece no servidor (ver a documentação de segurança do projeto).
 */

const CODE_PATTERN = /^KOR-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const USED_CODE = 'KOR-USED-0000';

const MAX_FAILED_ATTEMPTS = 5;

const MIN_PASSWORD_LENGTH = 8;

/** Confere se o texto parece um e-mail (formato apenas, sem verificar a caixa de entrada). */
function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

/**
 * Formata o código enquanto a pessoa digita: letras maiúsculas e hífens em KOR-XXXX-XXXX.
 * @param {string} raw texto digitado
 * @returns {string}
 */
function formatCode(raw) {
  const compact = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 11);
  let formatted = compact.slice(0, 3);
  if (compact.length > 3) formatted += `-${compact.slice(3, 7)}`;
  if (compact.length > 7) formatted += `-${compact.slice(7, 11)}`;
  return formatted;
}

/**
 * Valida o formulário de ativação, na ordem em que os problemas aparecem para o aluno.
 *
 * @param {{code: string, name: string, email: string, password: string, accepted: boolean}} form
 * @param {number} failedAttempts quantos códigos errados já foram digitados
 * @returns {{ok?: true, error?: string, failedAttempt?: boolean}}
 *   `failedAttempt` indica que esta tentativa deve contar para o limite de erros.
 */
function validateActivation(form, failedAttempts) {
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    return {
      error: 'Muitas tentativas. Aguarde 15 minutos ou fale com a gente.',
    };
  }
  if (!CODE_PATTERN.test(form.code)) {
    const left = MAX_FAILED_ATTEMPTS - failedAttempts - 1;
    return {
      error: `Não encontramos esse código. Ele começa com KOR. Confira se digitou tudo certo (${left} tentativas restantes).`,
      failedAttempt: true,
    };
  }
  if (form.code === USED_CODE) {
    return {
      error: 'Esse código já foi ativado em outra conta. Se a cartilha é sua, fale com a gente.',
    };
  }
  if (!form.name)
    return {
      error: 'Diga como podemos te chamar.',
    };
  if (!isValidEmail(form.email)) {
    return {
      error: 'Esse e-mail não parece certo. Confira e tente de novo.',
    };
  }
  if (form.password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    };
  }
  if (!form.accepted)
    return {
      error: 'Aceite os termos para criar a conta.',
    };
  return {
    ok: true,
  };
}

export { formatCode, isValidEmail, validateActivation, MAX_FAILED_ATTEMPTS };
