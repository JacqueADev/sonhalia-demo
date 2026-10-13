/** Visão da professora: envios a corrigir. */

import { $, esc, toast } from '../core/dom.js';
import { S, app } from '../core/state.js';
import { UNITS } from '../data/content.js';
import { updateHeader } from './header.js';

/** Visão da professora: envios pendentes e formulário de correção. */
function renderTeacher() {
  const pend = S.subs.filter((x) => x.status === 'pending');
  let h = '';
  if (!pend.length)
    h =
      '<div class="card"><p>Nenhum envio esperando correção. Faça um desafio no mapa (como aluno) e volte aqui para corrigir.</p></div>';
  pend.forEach((x) => {
    const u = UNITS[x.unit];
    const max = x.kind === 'texto' ? 50 : 80;
    h += `<div class="card sb"><div class="sbh"><span class="chip ${x.kind === 'texto' ? 't' : 'f'}">${x.kind === 'texto' ? 'Texto' : 'Fala'}</span><b>${app.who} · ${x.unit + 1}. ${u.pt}</b><span class="sub">${x.date} · recebido por WhatsApp</span></div><div class="ko" style="font-weight:700">${esc(x.prompt)}</div><div class="quote">${x.kind === 'fala' ? 'Áudio: ' : ''}${esc(x.text)}</div>`;
    h += `<div><label for="fb${x.id}">Sua correção para o aluno</label><textarea id="fb${x.id}" style="min-height:96px;font-family:var(--f-body)" placeholder="Escreva a correção, os acertos e o que melhorar…"></textarea></div>`;
    h += `<div class="pts"><div><label for="pt${x.id}">Pontos (0 a ${max})</label><input id="pt${x.id}" type="number" min="0" max="${max}" value="${Math.round(max * 0.6)}"></div><button class="btn jade" data-ret="${x.id}" type="button">Devolver correção ao aluno</button></div></div>`;
  });
  $('#tlist').innerHTML = h;
  $('#tlist')
    .querySelectorAll('[data-ret]')
    .forEach((b) => {
      b.addEventListener('click', () => {
        const id = +b.getAttribute('data-ret');
        const x = S.subs.filter((s) => s.id === id)[0];
        const max = x.kind === 'texto' ? 50 : 80;
        const fb = $(`#fb${id}`).value.trim();
        const pts = Math.max(0, Math.min(max, parseInt($(`#pt${id}`).value, 10) || 0));
        if (!fb) {
          toast('Escreva a correção antes de devolver.');
          return;
        }
        x.status = 'done';
        x.fb = fb;
        x.pts = pts;
        x.seen = false;
        S.coins += pts;
        updateHeader();
        toast(`Correção devolvida. O aluno recebeu +${pts} pérolas.`);
        renderTeacher();
      });
    });
}

export { renderTeacher };
