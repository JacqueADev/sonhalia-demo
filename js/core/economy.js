/** Ganho de pérolas. */

import { S } from './state.js';
import { updateHeader } from '../views/header.js';

/**
 * Soma pérolas ao aluno e devolve quantas entraram.
 * Com a "lupa de estudo" o ganho sobe 20%, a menos que `noBoost` seja verdadeiro.
 */
function earn(n, noBoost) {
  const v = !noBoost && S.owned.boost ? Math.round(n * 1.2) : n;
  S.coins += v;
  updateHeader();
  return v;
}

export { earn };
