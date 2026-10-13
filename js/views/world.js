/** Mapa-múndi com as seis regiões. */

import { creature } from '../art/creatures.js';
import {
  LAND,
  SK,
  islandPath,
  smoothPath,
  lockIcon,
  mountain,
  pine,
  round,
  sign,
  starIcon,
} from '../art/map.js';

import { OUT } from '../core/constants.js';
import { $ } from '../core/dom.js';
import { S, app, mood, petKind, progress, unitStatus } from '../core/state.js';
import { seededRandom } from '../core/util.js';
import { PAGES, TOTAL, UNITS } from '../data/content.js';
import { openRegion } from './region.js';

const SPOT = [
  [190, 440],
  [335, 335],
  [480, 460],
  [655, 405],
  [800, 285],
  [600, 235],
];

/** Mapa-múndi com as seis regiões. */
function showWorld() {
  app.reg = -1;
  $('#w-world').hidden = false;
  $('#w-region').hidden = true;
  let h = '';
  let i;
  h +=
    '<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sea-a)"/><stop offset="1" style="stop-color:var(--sea-b)"/></linearGradient><radialGradient id="land" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#B8EA76"/><stop offset=".7" stop-color="#7FCB5A"/><stop offset="1" stop-color="#5FB04E"/></radialGradient></defs>';
  h += '<rect width="1000" height="660" fill="url(#sea)"/>';
  for (i = 0; i < 40; i++) {
    let wx = 12 + seededRandom(i * 3.1) * 976;
    let wy = 10 + seededRandom(i * 7.7) * 640;
    h += `<path d="M${wx.toFixed(0)} ${wy.toFixed(0)} q9 -7 18 0 t18 0" fill="none" stroke="var(--sea-line)" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
  }
  h += `<path d="${islandPath(500, 350, 462, 282, 3, 16, 0.08)}" fill="#F7E4B0" stroke="${OUT}" stroke-width="4"/>`;
  h += `<path d="${islandPath(500, 345, 436, 258, 3, 16, 0.08)}" fill="url(#land)" stroke="${OUT}" stroke-width="3.5"/>`;
  h += `<path d="M455 190 C 420 250 540 290 480 350 C 430 405 395 520 430 628" fill="none" stroke="${OUT}" stroke-width="22" stroke-linecap="round"/><path d="M455 190 C 420 250 540 290 480 350 C 430 405 395 520 430 628" fill="none" stroke="#6FD3F5" stroke-width="15" stroke-linecap="round"/><path d="M455 190 C 420 250 540 290 480 350" fill="none" stroke="#C4F3FF" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 14"/>`;
  h += `<ellipse cx="880" cy="440" rx="50" ry="26" fill="#6FD3F5" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="868" cy="434" rx="18" ry="7" fill="#C4F3FF" opacity=".8"/>`;
  // arco-íris
  ['#FF6B5A', '#FFC83D', '#7ED957', '#35A3F2', '#9378F6'].forEach((c, k) => {
    h += `<path d="M690 240 A 96 96 0 0 1 880 240" transform="translate(0 ${0})" fill="none" stroke="${c}" stroke-width="9" opacity=".75" style="transform:scale(${1 - k * 0.07});transform-origin:785px 240px"/>`;
  });
  h +=
    mountain(300, 205, 150, 95) +
    mountain(380, 198, 170, 120) +
    mountain(470, 205, 140, 86) +
    mountain(250, 214, 100, 60);
  [
    [130, 300],
    [150, 350],
    [120, 390],
    [240, 500],
    [270, 540],
    [330, 560],
    [560, 570],
    [610, 560],
    [690, 520],
    [760, 470],
    [860, 360],
    [900, 330],
    [690, 160],
    [760, 170],
    [830, 200],
    [520, 150],
    [560, 160],
    [160, 250],
    [210, 230],
  ].forEach((pt, k) => {
    h += k % 4 === 3 ? round(pt[0], pt[1], 0.9) : pine(pt[0], pt[1], 0.8 + seededRandom(k) * 0.35);
  });
  [
    [420, 300],
    [560, 330],
    [360, 430],
    [720, 330],
    [540, 520],
  ].forEach((pt, k) => {
    h += round(
      pt[0],
      pt[1],
      0.7 + seededRandom(k + 5) * 0.2,
      k % 2 ? '#FFB1CE' : '#6FCB6C',
      k % 2 ? '#F58AB8' : '#4DB35B',
    );
  });
  // estrada
  const rd = smoothPath(SPOT.map((s) => [s[0], s[1] + 8]));
  h += `<path d="${rd}" fill="none" stroke="${OUT}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/><path d="${rd}" fill="none" stroke="#F4D488" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><path d="${rd}" fill="none" stroke="#FFF2C4" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="2 14"/>`;
  h +=
    '<g fill="#fff" opacity=".85"><ellipse cx="120" cy="90" rx="52" ry="16"/><ellipse cx="152" cy="76" rx="32" ry="16"/><ellipse cx="860" cy="100" rx="56" ry="16"/><ellipse cx="892" cy="86" rx="30" ry="15"/><ellipse cx="90" cy="590" rx="46" ry="14"/><ellipse cx="118" cy="578" rx="26" ry="14"/></g>';
  h += `<g transform="translate(80 600)"><path d="M-36 0 H36 L26 20 H-26Z" fill="#FF6B5A"${SK}/><path d="M0 -4 V-52 M0 -50 L28 -10 H0Z" fill="#fff"${SK}/></g>`;
  // regiões
  let here = 0;
  for (i = 0; i < 6; i++) {
    if (unitStatus(i) !== 'locked') here = i;
  }
  [5, 4, 3, 1, 2, 0].forEach((idx) => {
    const sp = SPOT[idx];
    const u = UNITS[idx];
    const st = unitStatus(idx);
    const x = sp[0];
    const y = sp[1];
    const lbl = `Região ${idx + 1}, ${u.pt}, ${st === 'locked' ? 'bloqueada' : st === 'done' ? 'concluída' : `aberta, ${progress(idx)}%`}`;
    h += `<g class="spot${idx === app.wsel ? ' sel' : ''}" data-i="${idx}" tabindex="0" role="button" aria-label="${lbl}">`;
    h += `<ellipse class="ring" cx="${x}" cy="${y - 24}" rx="86" ry="74"/><g class="lift">`;
    h += `<ellipse cx="${x}" cy="${y + 4}" rx="62" ry="13" fill="#000" opacity=".15"/>`;
    h += `<g transform="translate(${x} ${y})" style="${st === 'locked' ? 'filter:grayscale(1) brightness(.92)' : ''}">${LAND[idx]}</g>`;
    h += `<g transform="translate(${x - 74} ${y + 4}) scale(.42)" style="${st === 'locked' ? 'filter:brightness(0) opacity(.4)' : ''}">${creature(u.g, 'happy')}</g>`;
    if (st === 'locked')
      h += `<ellipse cx="${x}" cy="${y - 30}" rx="80" ry="58" fill="var(--fog)" opacity=".62" style="filter:blur(8px)"/>${lockIcon(x, y - 46)}`;
    if (st === 'done') h += starIcon(x + 52, y - 74);
    h += sign(x, y + 36, `${u.nat} · ${u.pt}`);
    if (st === 'open')
      h += `<rect x="${x - 28}" y="${y + 56}" width="56" height="21" rx="10.5" fill="${OUT}"/><text x="${x}" y="${y + 71}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="13" fill="#fff">${progress(idx)}%</text>`;
    if (idx === here)
      h += `<g transform="translate(${x + 60} ${y + 6}) scale(.34)">${creature(petKind(), mood())}</g><path d="M${x + 84} ${y - 36} V${y - 66} L${x + 106} ${y - 58} L${x + 84} ${y - 50}" fill="#FF6B5A"${SK}/>`;
    h += '</g></g>';
  });
  // faixa e bússola
  h += `<g transform="translate(500 628)"><path d="M-170 -16 H170 V14 H-170Z" fill="#FFF6D6" stroke="${OUT}" stroke-width="3.5"/><path d="M-170 -16 L-196 -6 L-170 4" fill="#F2D88C" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M170 -16 L196 -6 L170 4" fill="#F2D88C" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><text y="6" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="20" fill="${OUT}">O Mundo de Sonhália</text></g>`;
  h += `<g transform="translate(930 60)"><circle r="34" fill="#FFF6D6" stroke="${OUT}" stroke-width="3.5"/><path d="M0 -26 L8 0 L0 26 L-8 0Z" fill="#E8503A"${SK}/><path d="M0 -26 L8 0 L-8 0Z" fill="${OUT}"/><text y="-38" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="14" fill="#fff">N</text></g>`;
  $('#world').innerHTML = h;
  $('#world')
    .querySelectorAll('.spot')
    .forEach((g) => {
      const i2 = +g.getAttribute('data-i');
      const pick = () => {
        app.wsel = i2;
        showWorld();
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick();
        }
      });
      g.addEventListener('dblclick', () => {
        if (unitStatus(i2) !== 'locked') openRegion(i2);
      });
    });
  renderWorldPanel();
}

/** Painel de detalhes da região selecionada. */
function renderWorldPanel() {
  const idx = app.wsel;
  const u = UNITS[idx];
  const st = unitStatus(idx);
  let h = '';
  const col = st === 'locked' ? '#9FB0BC' : u.tint[0];
  const label = st === 'done' ? 'Concluída' : st === 'open' ? 'Em andamento' : 'Bloqueada';
  h += `<div class="pn-head"><svg viewBox="-70 -82 140 130" style="background:${col}" aria-hidden="true"><g style="${st === 'locked' ? 'filter:brightness(0) opacity(.4)' : ''}">${creature(u.g, 'happy')}</g></svg><div><h2>${idx + 1}. ${u.pt}</h2><div class="sub ko">${u.nat}</div></div></div>`;
  h += `<span class="status" style="background:${col}">${label}</span>`;
  h += `<div class="book">Cartilha, págs. ${PAGES[idx][0]} a ${PAGES[idx][1]}</div>`;
  if (st === 'locked') {
    const pu = UNITS[idx - 1];
    const need = 70 - progress(idx - 1);
    h += `<div class="info2"><div><b>Como abrir</b><span>Chegue a 70% de progresso em "${pu.pt}" (hoje está em ${progress(idx - 1)}%, faltam ${need} pontos).</span></div></div>`;
    h += `<div class="info2"><div><b>O que vem aqui</b><span>${TOTAL[idx]} palavras, 3 lições (${u.topic}), ateliê de bônus e dois desafios com correção da professora.</span></div></div>`;
  } else {
    const vp = Math.round((S.vocab[idx] / TOTAL[idx]) * 100);
    const gp = Math.round((S.gram[idx] / 3) * 100);
    h += `<div><div class="row"><span>Vocabulário</span><span>${S.vocab[idx]} / ${TOTAL[idx]}</span></div><div class="bar"><i style="width:${vp}%;background:var(--violet)"></i></div></div>`;
    h += `<div><div class="row"><span>Gramática</span><span>${S.gram[idx]} / 3 lições</span></div><div class="bar"><i style="width:${gp}%;background:var(--sky)"></i></div></div>`;
    h += `<div class="info2"><div><b>Tema de gramática</b><span class="ko">${u.topic}</span></div></div>`;
    h += '<button class="btn" id="enter" type="button">Entrar na região</button>';
  }
  $('#wpanel').innerHTML = h;
  const e = $('#enter');
  if (e)
    e.addEventListener('click', () => {
      openRegion(idx);
    });
}

export { showWorld };
