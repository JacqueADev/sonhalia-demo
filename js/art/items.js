/** Itens da loja e ícone de pérola em SVG. */

import { OUT } from '../core/constants.js';

const DRAW = {
  bolinho: `<path d="M-32 14 Q-34 -28 0 -30 Q34 -28 32 14Z" fill="#FFF3D6" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-14 -22 q4 14 0 30 M0 -26 q3 16 0 34 M14 -22 q-3 14 0 30" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>`,
  cha: `<path d="M-26 -14 H22 V14 Q22 30 -2 30 Q-26 30 -26 14Z" fill="#7EE0C3" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M22 -6 Q40 -6 38 8 Q36 20 22 18" fill="none" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/><path d="M-12 -26 q-5 -8 0 -14 M2 -26 q-5 -8 0 -14" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
  sopa: `<path d="M-36 -2 H36 Q34 32 0 32 Q-34 32 -36 -2Z" fill="#FF6B5A" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="0" cy="-2" rx="36" ry="9" fill="#FFC83D" stroke="${OUT}" stroke-width="3.5"/><path d="M-14 -16 q-5 -8 0 -14 M4 -16 q-5 -8 0 -14 M20 -16 q-5 -8 0 -14" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
  rug: `<ellipse cx="0" cy="8" rx="46" ry="18" fill="#FF6B5A" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="0" cy="8" rx="30" ry="11" fill="#FFC83D" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="0" cy="8" rx="14" ry="5" fill="#25BD8D"/>`,
  plant: `<path d="M-18 6 H18 L13 38 H-13Z" fill="#FF8A3D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 6 Q-30 -4 -26 -34 Q-6 -26 0 6Z" fill="#25BD8D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 6 Q30 -4 26 -34 Q6 -26 0 6Z" fill="#4ED08F" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 6 Q-6 -20 0 -40 Q6 -20 0 6Z" fill="#25BD8D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`,
  lamp: `<path d="M0 -8 V36 M-14 38 H14" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M-22 -4 L-12 -34 H12 L22 -4Z" fill="#FFC83D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`,
  poster: `<rect x="-30" y="-38" width="60" height="76" rx="6" fill="#fff" stroke="${OUT}" stroke-width="3.5"/><rect x="-24" y="-32" width="48" height="64" rx="3" fill="#7FDDF5"/><ellipse cx="0" cy="18" rx="20" ry="9" fill="#25BD8D"/><circle cx="12" cy="-14" r="8" fill="#FFC83D"/><path d="M-14 4 L-8 -8 L-2 4Z" fill="#FF6B5A"/>`,
  bed: `<rect x="-44" y="-6" width="88" height="34" rx="10" fill="#FF80B5" stroke="${OUT}" stroke-width="3.5"/><rect x="-44" y="-22" width="22" height="20" rx="8" fill="#fff" stroke="${OUT}" stroke-width="3.5"/><rect x="-22" y="-4" width="66" height="14" rx="6" fill="#9378F6" stroke="${OUT}" stroke-width="3"/><path d="M-40 28 V38 M40 28 V38" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`,
  boost: `<circle cx="-6" cy="-6" r="22" fill="#BFEAFF" stroke="${OUT}" stroke-width="4"/><path d="M10 10 L34 34" stroke="${OUT}" stroke-width="9" stroke-linecap="round"/><path d="M-18 -10 Q-12 -22 0 -20" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  casa2: `<path d="M-36 -34 V38" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M-34 -32 H34 L22 -14 L34 4 H-34Z" fill="#FFC83D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="-4" cy="-14" r="6" fill="#FF6B5A"/>`,
};

/** Ícone quadrado de um item da loja. */
function itemIcon(id, w) {
  return `<svg viewBox="-55 -55 110 110" width="${w || 52}" height="${w || 52}" aria-hidden="true">${DRAW[id]}</svg>`;
}

/** Ícone da pérola, a moeda do app. */
function pearl(w) {
  return `<svg width="${w || 16}" height="${w || 16}" viewBox="-12 -12 24 24" aria-hidden="true"><circle r="10" fill="#fff" stroke="${OUT}" stroke-width="2.5"/><circle cx="-3" cy="-3" r="3" fill="#BFEAFF"/></svg>`;
}

/** Posiciona um item da loja na cena da casa (x, y e escala). */
function placeHouseItem(id, x, y, sc) {
  return `<g transform="translate(${x} ${y}) scale(${sc})">${DRAW[id]}</g>`;
}

export { itemIcon, pearl, placeHouseItem };
