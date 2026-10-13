/** Tema claro e escuro. */

import { $ } from './dom.js';

const root = document.documentElement;

/** Tema em uso: o escolhido pela pessoa ou, sem escolha, o do sistema. */
function curTheme() {
  const t = root.getAttribute('data-theme');
  if (t) return t;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Troca o ícone do botão de tema (sol ou lua). */
function themeIcon() {
  const dark = curTheme() === 'dark';
  $('#theme').innerHTML = dark
    ? '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#FFC83D" stroke="#FFC83D" stroke-width="2"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="#FFC83D" stroke-width="2.2" stroke-linecap="round"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="#9378F6" stroke="#1B2B4B" stroke-width="2" stroke-linejoin="round"/></svg>';
}

/** Liga o botão de tema; onChange é chamado depois de cada troca. */
function initTheme(onChange) {
  $('#theme').addEventListener('click', () => {
    root.setAttribute('data-theme', curTheme() === 'dark' ? 'light' : 'dark');
    themeIcon();
    if (onChange) onChange();
  });
  themeIcon();
}

export { initTheme };
