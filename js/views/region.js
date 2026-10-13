/** Mapa de uma região, com os prédios das atividades. */

import { creature } from '../art/creatures.js';
import { BLD, smoothPath, lockIcon, pine, round, sign, starIcon } from '../art/map.js';
import { OUT } from '../core/constants.js';
import { $ } from '../core/dom.js';
import { S, app, mood, petKind } from '../core/state.js';
import { seededRandom } from '../core/util.js';
import { PAGES, SECRET_COST, UNITS } from '../data/content.js';
import { openActivity } from './activities.js';
import { showWorld } from './world.js';

const BPOS = {
  desafio: [240, 175],
  qr: [500, 140],
  secreto: [770, 175],
  escola: [200, 445],
  mercado: [480, 455],
  atelie: [760, 450],
};

const BNAME = {
  escola: 'Escola de Gramática',
  mercado: 'Mercado de Palavras',
  atelie: 'Ateliê de Bônus',
  desafio: 'Desafio da Região',
  secreto: 'Desafio Secreto',
  qr: 'Placa do QR',
};

/** Mapa de uma região, com os seis prédios das atividades. */
function openRegion(i) {
  app.reg = i;
  app.wsel = i;
  app.cur = 'map';
  $('#w-world').hidden = true;
  $('#w-region').hidden = false;
  const u = UNITS[i];
  const t = u.tint;
  let h = '';
  let k;
  $('#rtitle').textContent = i + 1 + '. ' + u.pt + ' · ' + u.nat;
  $('#rsub').textContent = `Cartilha, págs. ${PAGES[i][0]} a ${PAGES[i][1]}`;
  h += `<defs><linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient></defs>`;
  h += '<rect width="1000" height="640" fill="url(#grass)"/>';
  for (k = 0; k < 60; k++) {
    h += `<circle cx="${(seededRandom(k * 2.3) * 1000).toFixed(0)}" cy="${(seededRandom(k * 5.1) * 640).toFixed(0)}" r="${(3 + seededRandom(k) * 3).toFixed(1)}" fill="${['#fff', '#FFE15A', '#FF9BC4'][k % 3]}" opacity=".55"/>`;
  }
  const rd = smoothPath([
    [40, 560],
    [220, 470],
    [420, 330],
    [610, 360],
    [790, 330],
    [960, 250],
  ]);
  h += `<path d="${rd}" fill="none" stroke="${OUT}" stroke-width="58" stroke-linecap="round"/><path d="${rd}" fill="none" stroke="#F4D488" stroke-width="48" stroke-linecap="round"/><path d="${rd}" fill="none" stroke="#FFF2C4" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 16"/>`;
  h += `<ellipse cx="120" cy="320" rx="70" ry="38" fill="#6FD3F5" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="104" cy="312" rx="24" ry="8" fill="#C4F3FF" opacity=".8"/>`;
  [
    [60, 120],
    [110, 70],
    [160, 120],
    [900, 90],
    [940, 150],
    [880, 230],
    [930, 380],
    [960, 520],
    [890, 590],
    [560, 600],
    [640, 570],
    [80, 420],
    [350, 590],
    [340, 260],
    [640, 250],
  ].forEach((pt, n) => {
    h += n % 3 === 2 ? round(pt[0], pt[1], 1.05) : pine(pt[0], pt[1], 1 + seededRandom(n) * 0.3);
  });
  const order = ['desafio', 'qr', 'secreto', 'escola', 'mercado', 'atelie'];
  order.forEach((id) => {
    const p = BPOS[id];
    const lockedSecret = id === 'secreto' && !S.secret[i];
    const done = (id === 'qr' && S.qr[i]) || (id === 'atelie' && S.bonus[i]);
    h += `<g class="bld${app.actKind === id ? ' sel' : ''}" data-b="${id}" tabindex="0" role="button" aria-label="${BNAME[id]}${lockedSecret ? ', trancado' : ''}">`;
    h += `<ellipse class="hl" cx="${p[0]}" cy="${p[1] - 36}" rx="86" ry="82"/><g class="lift"><ellipse cx="${p[0]}" cy="${p[1] + 4}" rx="64" ry="12" fill="#000" opacity=".17"/>`;
    h += `<g transform="translate(${p[0]} ${p[1]}) scale(1.15)">${BLD[id]}</g>`;
    if (lockedSecret)
      h += `<g transform="translate(${p[0]} ${p[1] - 24}) scale(1.3)">${lockIcon(0, 0).replace('<g transform="translate(0 0)">', '<g>')}</g>`;
    if (done) h += starIcon(p[0] + 56, p[1] - 90);
    const lab = BNAME[id];
    const w = lab.length * 7.6 + 24;
    h += sign(p[0], p[1] + 38, lab, w);
    if (id === 'desafio')
      h += `<g><rect x="${p[0] - 30}" y="${p[1] + 58}" width="60" height="20" rx="10" fill="#7ED957" stroke="${OUT}" stroke-width="2.5"/><text x="${p[0]}" y="${p[1] + 72}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="12" fill="${OUT}">padrão</text></g>`;
    if (id === 'secreto')
      h += `<g><rect x="${p[0] - 46}" y="${p[1] + 58}" width="92" height="20" rx="10" fill="#FFC83D" stroke="${OUT}" stroke-width="2.5"/><text x="${p[0]}" y="${p[1] + 72}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="12" fill="${OUT}">${lockedSecret ? `${SECRET_COST} pérolas` : 'aberto'}</text></g>`;
    h += '</g></g>';
  });
  h += `<g transform="translate(650 560) scale(.62)">${creature(petKind(), mood())}</g><g transform="translate(870 560) scale(.55)">${creature(u.g, 'happy')}</g>`;
  h += sign(650, 612, S.name, 80) + sign(870, 612, 'guardião', 84);
  $('#rscene').innerHTML = h;
  $('#rscene')
    .querySelectorAll('.bld')
    .forEach((g) => {
      const id = g.getAttribute('data-b');
      const pick = () => {
        openActivity(id);
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick();
        }
      });
    });
  if (!app.actKind)
    $('#act').innerHTML =
      '<h2>Escolha um prédio</h2><p class="lead">Toque num prédio do mapa para começar. O Desafio da Região já está aberto. O Desafio Secreto abre com pérolas.</p>';
  else openActivity(app.actKind, true);
}

function initRegion() {
  $('#back').addEventListener('click', () => {
    app.actKind = '';
    showWorld();
    window.scrollTo(0, 0);
  });
}

export { initRegion, openRegion };
