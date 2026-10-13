/** Cabeçalho do site: contador de pérolas e selo de correções novas. */

import { $ } from '../core/dom.js';
import { S } from '../core/state.js';

/** Atualiza o contador de pérolas e o selo de correções novas. */
function updateHeader() {
  $('#coins').textContent = S.coins;
  const n = S.subs.filter((x) => x.status === 'done' && !x.seen).length;
  const b = $('#cbadge');
  b.hidden = !n;
  b.textContent = n;
}

export { updateHeader };
