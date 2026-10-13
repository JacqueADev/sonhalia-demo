/** Casa do bichinho: cena, atributos, mochila e loja. */

import { creature } from '../art/creatures.js';
import { itemIcon, pearl, placeHouseItem } from '../art/items.js';
import { OUT } from '../core/constants.js';
import { $, toast } from '../core/dom.js';
import { go } from '../core/router.js';
import { S, app, level, mood, petKind } from '../core/state.js';
import { clamp } from '../core/util.js';
import { CAT, DECOR, FOODS, UPS } from '../data/catalog.js';
import { SAY } from '../data/content.js';
import { updateHeader } from './header.js';

let shopTab = 'bag';

/** Desenha a casa do bichinho, os atributos e a mochila ou loja. */
function renderPet() {
  let h = '';
  h += '<rect width="600" height="420" fill="var(--wall)"/>';
  h += `<g opacity=".22">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${i * 80}" y="0" width="40" height="290" fill="#fff"/>`).join('')}</g>`;
  h +=
    '<rect y="290" width="600" height="130" fill="var(--floor)"/><rect y="290" width="600" height="14" fill="var(--floor2)"/>';
  h +=
    '<path d="M0 304 H600 M0 340 H600 M0 380 H600" stroke="var(--floor2)" stroke-width="3" opacity=".6"/>';
  h += `<g transform="translate(120 90)"><rect x="-62" y="-52" width="124" height="104" rx="14" fill="#7FDDF5" stroke="${OUT}" stroke-width="5"/><circle cx="-20" cy="-14" r="16" fill="#FFC83D" stroke="${OUT}" stroke-width="3"/><ellipse cx="22" cy="14" rx="26" ry="10" fill="#fff"/><ellipse cx="38" cy="8" rx="16" ry="9" fill="#fff"/><path d="M0 -52 V52 M-62 0 H62" stroke="${OUT}" stroke-width="5"/></g>`;
  if (S.owned.casa2) h += placeHouseItem('casa2', 300, 60, 1.1);
  if (S.owned.poster) h += placeHouseItem('poster', 440, 120, 1.2);
  if (S.owned.lamp)
    h += `<circle cx="520" cy="270" r="60" fill="#FFC83D" opacity=".25"/>${placeHouseItem('lamp', 520, 258, 1.6)}`;
  if (S.owned.rug) h += placeHouseItem('rug', 300, 352, 2.5);
  if (S.owned.plant) h += placeHouseItem('plant', 62, 290, 1.7);
  if (S.owned.bed) h += placeHouseItem('bed', 500, 352, 1.3);
  h += `<g transform="translate(300 292) scale(1.3)"><g class="pet-bob" id="pet-g">${creature(petKind(), mood())}</g></g>`;
  $('#scene').innerHTML = h;
  $('#pname').textContent = S.name;
  $('#plvl').textContent = `Nível ${level()}`;
  $('#pmood').textContent = {
    happy: 'Feliz',
    hungry: 'Com fome',
    sleepy: 'Com sono',
    sad: 'Tristinho',
  }[mood()];
  const bars = [
    ['Fome', 'fome', 'var(--coral)'],
    ['Humor', 'humor', 'var(--sun)'],
    ['Energia', 'energia', 'var(--jade)'],
  ];
  $('#stats').innerHTML = bars
    .map(
      (b) =>
        `<div class="stat"><span>${b[0]}</span><div class="bar" role="progressbar" aria-label="${b[0]}" aria-valuenow="${Math.round(S[b[1]])}" aria-valuemin="0" aria-valuemax="100"><i style="width:${S[b[1]]}%;background:${b[2]}"></i></div><span>${Math.round(S[b[1]])}</span></div>`,
    )
    .join('');
  renderShelf();
}

let bubT;

/** Mostra uma fala do bichinho em coreano, com tradução. */
function petSay(key) {
  const p = SAY[key];
  if (!p) return;
  const b = $('#bubble');
  b.innerHTML = `<big>${p[0]}</big><small>${p[1]}</small>`;
  b.classList.add('on');
  clearTimeout(bubT);
  bubT = setTimeout(() => {
    b.classList.remove('on');
  }, 2600);
}

/** Anima um pulinho do bichinho. */
function petHop() {
  const g = $('#pet-g');
  if (!g) return;
  g.classList.remove('hop');
  void g.getBBox();
  g.classList.add('hop');
  setTimeout(() => {
    g.classList.remove('hop');
  }, 1100);
}

/** Mochila (comida e itens da casa) ou loja, conforme a aba. */
function renderShelf() {
  let h = '';
  $('#s-bag').setAttribute('aria-selected', shopTab === 'bag');
  $('#s-shop').setAttribute('aria-selected', shopTab === 'shop');
  if (shopTab === 'bag') {
    let any = false;
    h += '<div class="tag grp">Comida</div>';
    FOODS.forEach((id) => {
      const n = S.inv[id] || 0;
      if (!n) return;
      any = true;
      h += `<div class="item">${itemIcon(id)}<div><b>${CAT[id].n}</b><span>x${n} · fome +${CAT[id].f}</span></div><div class="bt"><button class="btn small jade" data-use="${id}" type="button">Dar</button><button class="btn small" data-sell="${id}" type="button"><span class="price">${pearl(13)}${Math.floor(CAT[id].p / 2)}</span></button></div></div>`;
    });
    if (!any) h += '<div class="empty">Sem comida. Compre na Loja.</div>';
    const dec = DECOR.concat(UPS).filter((id) => S.owned[id]);
    h += '<div class="tag grp">Na casa</div>';
    if (!dec.length) h += '<div class="empty">Nada ainda. Decore a casa pela Loja.</div>';
    dec.forEach((id) => {
      h += `<div class="item">${itemIcon(id)}<div><b>${CAT[id].n}</b><span>${CAT[id].d || 'Decoração'}</span></div><div class="bt"><button class="btn small" data-sell="${id}" type="button"><span class="price">Vender ${pearl(13)}${Math.floor(CAT[id].p / 2)}</span></button></div></div>`;
    });
  } else {
    [
      ['Comida', FOODS],
      ['Decoração', DECOR],
      ['Melhorias', UPS],
    ].forEach((g) => {
      h += `<div class="tag grp">${g[0]}</div>`;
      g[1].forEach((id) => {
        const it = CAT[id];
        const have = !it.food && S.owned[id];
        const can = S.coins >= it.p;
        h += `<div class="item">${itemIcon(id)}<div><b>${it.n}</b><span>${it.d || (it.food ? `Fome +${it.f}` : 'Decoração')}</span></div><div class="bt">${have ? '<span class="tag">Comprado</span>' : `<button class="btn small alt" data-buy="${id}" type="button"${can ? '' : ' disabled'}><span class="price">${pearl(13)}${it.p}</span></button>`}</div></div>`;
      });
    });
  }
  $('#shelf').innerHTML = h;
  $('#shelf')
    .querySelectorAll('[data-use]')
    .forEach((b) => {
      b.addEventListener('click', () => {
        useFood(b.getAttribute('data-use'));
      });
    });
  $('#shelf')
    .querySelectorAll('[data-sell]')
    .forEach((b) => {
      b.addEventListener('click', () => {
        sell(b.getAttribute('data-sell'));
      });
    });
  $('#shelf')
    .querySelectorAll('[data-buy]')
    .forEach((b) => {
      b.addEventListener('click', () => {
        buy(b.getAttribute('data-buy'));
      });
    });
}

/** Dá comida ao bichinho: sobe a fome e o humor. */
function useFood(id) {
  if (!(S.inv[id] > 0)) return;
  S.inv[id]--;
  S.fome = clamp(S.fome + CAT[id].f);
  S.humor = clamp(S.humor + CAT[id].h);
  renderPet();
  petHop();
  petSay('feed');
}

/** Vende um item de volta por 50% do preço. */
function sell(id) {
  const v = Math.floor(CAT[id].p / 2);
  if (CAT[id].food) {
    if (!(S.inv[id] > 0)) return;
    S.inv[id]--;
  } else {
    if (!S.owned[id]) return;
    delete S.owned[id];
  }
  S.coins += v;
  updateHeader();
  renderPet();
  toast(`Vendido por ${v} pérolas.`);
}

/** Compra um item, se houver pérolas. */
function buy(id) {
  const it = CAT[id];
  if (S.coins < it.p) {
    toast('Faltam pérolas. Estude e faça desafios para ganhar mais.');
    return;
  }
  S.coins -= it.p;
  if (it.food) S.inv[id] = (S.inv[id] || 0) + 1;
  else S.owned[id] = true;
  updateHeader();
  renderPet();
  toast(`${it.n} comprado!`);
  if (!it.food) {
    petHop();
    petSay('thanks');
  }
}

function initPet() {
  $('#s-bag').addEventListener('click', () => {
    shopTab = 'bag';
    renderShelf();
  });
  $('#s-shop').addEventListener('click', () => {
    shopTab = 'shop';
    renderShelf();
  });
  $('#a-talk').addEventListener('click', () => {
    petHop();
    petSay(mood() === 'hungry' ? 'hungry' : mood() === 'sleepy' ? 'sleep' : 'hi');
  });
  $('#a-play').addEventListener('click', () => {
    go('map');
  });
  $('#a-sleep').addEventListener('click', () => {
    S.energia = clamp(S.energia + 40);
    S.fome = clamp(S.fome - 5);
    renderPet();
    petSay('sleep');
    toast(`${S.name} tirou uma sonequinha.`);
  });
  setInterval(() => {
    S.fome = clamp(S.fome - 2);
    S.humor = clamp(S.humor - 1);
    S.energia = clamp(S.energia - 1);
    if (app.cur === 'pet') renderPet();
  }, 20000);
}

export { petHop, initPet, renderPet, petSay };
