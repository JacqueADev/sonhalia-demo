/** Início: ativação do código da cartilha e entrada na conta. */

import { creatureSvg } from '../art/creatures.js';
import { formatCode, isValidEmail, validateActivation } from '../core/activation.js';
import { $ } from '../core/dom.js';
import { go } from '../core/router.js';
import { app } from '../core/state.js';

const REDIRECT_DELAY_MS = 900;

let failedAttempts = 0;

function showMessage(element, kind, text) {
  element.className = `msg ${kind}`;
  element.textContent = text;
}

function setAvatar(name) {
  $('#av').textContent = name.charAt(0).toUpperCase();
}

/** Os três bichinhos que aparecem no destaque da página inicial. */
function renderHeroPets() {
  $('#hpets').innerHTML =
    creatureSvg('bunny', 200, 'happy') +
    creatureSvg('tiger', 230, 'happy') +
    creatureSvg('fox', 200, 'happy');
}

/** Alterna entre "Ativar minha cartilha" e "Já tenho conta". */
function initModeTabs() {
  const activateTab = $('#m-act');
  const loginTab = $('#m-in');
  const setMode = (activating) => {
    activateTab.setAttribute('aria-selected', activating);
    loginTab.setAttribute('aria-selected', !activating);
    $('#f-act').hidden = !activating;
    $('#f-in').hidden = activating;
  };
  activateTab.addEventListener('click', () => setMode(true));
  loginTab.addEventListener('click', () => setMode(false));
}

function initForgotPassword() {
  $('#forgot').addEventListener('click', () => {
    showMessage(
      $('#in-msg'),
      'ok',
      'Enviamos um link de redefinição para o seu e-mail. Ele vale por 1 hora.',
    );
  });
}

function initActivationForm() {
  const codeInput = $('#code');
  codeInput.addEventListener('input', () => {
    codeInput.value = formatCode(codeInput.value);
  });
  $('#f-act').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = $('#act-msg');
    const name = $('#nm').value.trim();
    const result = validateActivation(
      {
        code: codeInput.value,
        name,
        email: $('#em').value.trim(),
        password: $('#pw').value,
        accepted: $('#tm').checked,
      },
      failedAttempts,
    );
    if (!result.ok) {
      if (result.failedAttempt) failedAttempts++;
      showMessage(message, 'err', result.error);
      return;
    }
    failedAttempts = 0;
    app.who = name;
    app.logged = true;
    setAvatar(name);
    showMessage(message, 'ok', 'Cartilha ativada! Abrindo o livro…');
    setTimeout(() => {
      message.className = 'msg';
      app.stN = 0;
      go('story');
    }, REDIRECT_DELAY_MS);
  });
}

function initLoginForm() {
  $('#f-in').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('#em2').value.trim();
    if (!isValidEmail(email) || !$('#pw2').value) {
      showMessage($('#in-msg'), 'err', 'Preencha o e-mail e a senha.');
      return;
    }
    app.logged = true;
    setAvatar(app.who);
    go('pet');
  });
}

function initHome() {
  renderHeroPets();
  initModeTabs();
  initForgotPassword();
  initActivationForm();
  initLoginForm();
}

export { initHome };
