/** Correções recebidas pelo aluno. */

import { $, esc } from '../core/dom.js';
import { S } from '../core/state.js';
import { UNITS } from '../data/content.js';
import { updateHeader } from './header.js';

/** Lista os envios do aluno e as correções recebidas. */
function renderCorrections() {
  let h = '';
  if (!S.subs.length)
    h =
      '<div class="card"><p>Você ainda não fez nenhum envio. Os desafios ficam dentro de cada região.</p></div>';
  S.subs.forEach((x) => {
    const u = UNITS[x.unit];
    h += `<div class="card sb"><div class="sbh"><span class="chip ${x.kind === 'texto' ? 't' : 'f'}">${x.kind === 'texto' ? 'Texto' : 'Fala'}</span><b>${x.unit + 1}. ${u.pt}</b><span class="sub">${x.date}</span><span class="chip ${x.status === 'done' ? 'd' : 'p'}" style="margin-left:auto">${x.status === 'done' ? 'Corrigido' : 'Aguardando correção'}</span></div><div class="ko" style="font-weight:700">${esc(x.prompt)}</div><div class="quote">${x.kind === 'fala' ? 'Áudio enviado: ' : ''}${esc(x.text)}</div>`;
    if (x.status === 'done')
      h += `<div class="feedback"><b>Correção da professora · +${x.pts} pérolas</b>${esc(x.fb)}</div>`;
    h += '</div>';
    x.seen = true;
  });
  $('#sublist').innerHTML = h;
  updateHeader();
}

export { renderCorrections };
