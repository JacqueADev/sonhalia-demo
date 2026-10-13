/** Navegação entre as telas. */

import { $ } from './dom.js';
import { app } from './state.js';
import { updateHeader } from '../views/header.js';

const views = ['home', 'story', 'pick', 'pet', 'map', 'cards', 'corr', 'tch', 'rules'];

const renderers = {};

/** Registra a função que desenha uma tela quando ela é aberta. */
function registerView(name, render) {
  renderers[name] = render;
}

/** Abre uma tela: esconde as outras, atualiza o menu e chama o desenho da tela. */
function go(name) {
  app.cur = name;
  views.forEach((k) => {
    $(`#v-${k}`).hidden = k !== name;
  });
  document.querySelectorAll('nav button').forEach((b) => {
    if (b.getAttribute('data-go') === name) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  $('#coinbox').hidden = !app.logged;
  $('#av').hidden = !app.logged;
  window.scrollTo(0, 0);
  updateHeader();
  if (renderers[name]) renderers[name]();
}

/** Liga os botões do menu (data-go). */
function initNav() {
  document.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => {
      const target = b.getAttribute('data-go');
      if (target === 'story') app.stN = 0;
      if (!app.logged && ['pet', 'map', 'cards', 'corr'].includes(target)) {
        app.logged = true;
        $('#av').textContent = app.who.charAt(0).toUpperCase();
      }
      go(target);
    });
  });
}

export { go, initNav, registerView };
