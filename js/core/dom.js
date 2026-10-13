/** Atalhos de DOM, avisos na tela e escape de texto. */
/** Atalho para document.querySelector. */
const $ = (selector) => document.querySelector(selector);

let toastT;

/** Mostra um aviso curto na parte de baixo da tela. */
function toast(t) {
  const el = $('#toast');
  el.textContent = t;
  el.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    el.classList.remove('on');
  }, 3200);
}

/** Escapa um texto para colocá-lo com segurança dentro de HTML. */
function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export { $, esc, toast };
