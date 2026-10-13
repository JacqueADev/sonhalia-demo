/** Cartas de palavras: mapa de palavras, flashcards e carta do material. */

import { ILLUSTRATIONS } from '../art/illustrations.js';
import { $, esc } from '../core/dom.js';
import { S, unitStatus } from '../core/state.js';
import { COMPLETE_CARDS, UNITS, WORD_UNITS } from '../data/content.js';

const WORDS = [];

let selectedNumber = '041';

let activeTab = 'map';
(() => {
  let n = 0;
  WORD_UNITS.forEach((u, ui) => {
    let idx = 0;
    u.themes.forEach((th, ti) => {
      th.words.forEach((w) => {
        n++;
        const o = {
          n: `00${n}`.slice(-3),
          num: n,
          unit: ui,
          theme: ti,
          idx: idx++,
          ko: w[0],
          pt: w[1],
          cl: w[2],
          col: th.col,
          cat: th.cat,
          tname: th.name,
        };
        const f = COMPLETE_CARDS[w[0]];
        if (f) {
          o.ill = f.art;
          o.ex = f.sentence;
          o.exp = f.translation;
        }
        WORDS.push(o);
      });
    });
  });
})();

/** Primeira letra maiúscula e o resto minúsculo. */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** A palavra já foi coletada? (unidade aberta e posição dentro do que o aluno já tem) */
function isCollected(o) {
  return unitStatus(o.unit) !== 'locked' && o.idx < S.vocab[o.unit];
}

/** Ilustração da carta, ou um marcador "Ilustração em produção" quando ainda não existe. */
function wordArt(o) {
  if (o.ill)
    return `<svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração: ${esc(o.pt)}">${ILLUSTRATIONS[o.ill]}</svg>`;
  const fs = o.ko.length <= 3 ? 62 : o.ko.length <= 5 ? 44 : 26;
  return `<svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração em produção"><rect width="240" height="150" fill="${o.col}" opacity=".5"/><text x="120" y="${fs > 40 ? 92 : 84}" text-anchor="middle" font-family="Noto Sans KR, sans-serif" font-weight="700" font-size="${fs}" fill="#1B2B4B" opacity=".28">${o.ko}</text><rect x="14" y="14" width="212" height="122" rx="14" fill="none" stroke="#1B2B4B" stroke-width="2.5" stroke-dasharray="6 7" opacity=".4"/><text x="120" y="128" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="12" fill="#1B2B4B" opacity=".65">Ilustração em produção</text></svg>`;
}

/** HTML do flashcard: a frente tem só a palavra; o verso tem ilustração, frase e categoria. */
function flashcardHtml(o, id) {
  const ex = o.ex
    ? `<div class="ko">${o.ex}</div><div class="exp">${esc(o.exp)}</div>`
    : '<div class="ko kmute">Frase de aplicação em produção</div>';
  const fs =
    o.ko.length <= 3 ? 'clamp(3.4rem,10vw,5.2rem)' : o.ko.length <= 5 ? '2.8rem' : '1.9rem';
  return `<button class="kflip" id="${id}" type="button" aria-label="Virar carta" style="--fc:${o.col}"><div class="kin"><div class="kface kfront"><div class="kpane"><div class="ksun"></div><div class="kring"></div><div class="kword" style="font-size:${fs}">${o.ko}</div></div></div><div class="kface kback"><div class="kpane"><span class="krib">COREANO • ${o.cat}</span><div class="karch">${wordArt(o)}</div><div class="kbody"><div class="kmeaning">${esc(capitalize(o.pt))}</div><div class="kexbox" style="--c:${o.col}">${ex}</div><div class="kchips"><span class="kchip" style="background:${o.col}">${capitalize(o.cat)}</span><span class="kchip kcls">${o.cl}</span></div></div></div></div></div></button>`;
}

/** Coloca um flashcard em `host` e liga o clique que vira a carta. */
function mountFlashcard(host, o, id, onFlip) {
  host.innerHTML = flashcardHtml(o, id);
  const f = host.querySelector('.kflip');
  f.addEventListener('click', () => {
    f.classList.toggle('on');
    if (onFlip) onFlip(f.classList.contains('on'));
  });
  return f;
}

/** HTML da carta do material impresso. */
function printCardHtml(o) {
  const ex = o.ex
    ? `<div class="ko">${o.ex}</div><div class="exp">${esc(o.exp)}</div>`
    : '<div class="ko kmute">Frase de aplicação em produção</div>';
  return `<article class="kpc" style="--c:${o.col}"><div class="kpane"><span class="krib">COREANO • ${o.cat}</span><span class="kstamp"><span><small>Nº</small><b>${o.n}</b></span></span><div class="karch2">${wordArt(o)}</div><div class="ktxt"><div class="kbig">${o.ko}</div><div class="kptrow"><b>${esc(o.pt.toUpperCase())}</b><span class="kpill">${o.cl}</span></div></div><div class="kexbox">${ex}</div></div><footer>✦ REVISE E PRATIQUE ✦</footer></article>`;
}

/* mapa de palavras */
function renderWordMap() {
  const got = WORDS.filter(isCollected).length;
  let currentUnit = 0;
  let i;
  let h = '';
  for (i = 0; i < 6; i++) {
    if (unitStatus(i) !== 'locked') currentUnit = i;
  }
  h += `<div class="ksum"><span><b>${WORDS.length}</b> palavras</span><span><b>${WORD_UNITS.length}</b> unidades</span><span><b>25</b> temas</span><span><b>${got}</b> coletadas</span><span class="klg"><i class="kfull"></i>carta completa</span></div>`;
  WORD_UNITS.forEach((u, ui) => {
    const st = unitStatus(ui);
    const uw = WORDS.filter((x) => x.unit === ui);
    const g = uw.filter(isCollected).length;
    const label = st === 'locked' ? 'Bloqueada' : st === 'done' ? 'Concluída' : 'Em andamento';
    h += `<details class="kunit"${ui === currentUnit ? ' open' : ''}><summary><span class="dt" style="background:${st === 'locked' ? '#9FB0BC' : UNITS[ui].tint[0]}"></span>${ui + 1}. ${UNITS[ui].pt} <span class="ko ksub">${u.nat}</span><span class="kcount">${g}/${uw.length} · ${label}</span></summary><div class="kub">`;
    u.themes.forEach((th, ti) => {
      const tw = uw.filter((x) => x.theme === ti);
      h += `<div class="kth"><div class="kthh"><i style="background:${th.col}"></i><b>${th.name}</b><span>${tw.length} palavras · nº ${tw[0].n} a ${tw[tw.length - 1].n}</span></div><div class="kwords">`;
      tw.forEach((o) => {
        h += `<button type="button" class="kwd${isCollected(o) ? ' got' : ''}${selectedNumber === o.n ? ' sel' : ''}" data-n="${o.n}" style="--c:${o.col}" aria-label="Carta ${o.n}: ${esc(o.ko)}, ${esc(o.pt)}">${o.ill ? '<i class="kfull"></i>' : ''}<small>${o.n}</small><b>${o.ko}</b><span>${esc(o.pt)}</span></button>`;
      });
      h += '</div></div>';
    });
    h += '</div></details>';
  });
  $('#k-list').innerHTML = h;
  $('#k-list')
    .querySelectorAll('.kwd')
    .forEach((b) => {
      b.addEventListener('click', () => {
        openWord(b.getAttribute('data-n'));
      });
    });
  renderWordPanel();
}

/** Abre o flashcard da palavra com o número dado (por exemplo, "081"). */
function openWord(n) {
  selectedNumber = n;
  document.querySelectorAll('#k-list .kwd').forEach((b) => {
    b.classList.toggle('sel', b.getAttribute('data-n') === n);
  });
  renderWordPanel();
}

/** Painel ao lado do mapa, com o flashcard e a busca pelo número. */
function renderWordPanel() {
  const o = WORDS[parseInt(selectedNumber, 10) - 1];
  const host = $('#k-panel');
  const st = unitStatus(o.unit);
  const state =
    st === 'locked'
      ? 'Unidade bloqueada'
      : isCollected(o)
        ? 'Palavra coletada'
        : 'Ainda não coletada';
  host.innerHTML = `<div class="kpt"><span class="tag">Carta ${o.n} · ${UNITS[o.unit].pt}</span><span class="kst${isCollected(o) ? ' ok' : ''}">${state}</span></div><div id="k-pf"></div><p class="khint">Toque na carta para virar</p><div class="kfind"><div><label for="k-num">Abrir pelo número</label><input id="k-num" type="text" inputmode="numeric" placeholder="ex.: 081"></div><button class="btn small alt" id="k-go" type="button">Abrir</button></div><div class="kmsg" id="k-msg" role="status"></div>`;
  mountFlashcard($('#k-pf'), o, 'kflipP');
  $('#k-go').addEventListener('click', () => {
    const v = `000${$('#k-num').value.trim()}`.slice(-3);
    const m = $('#k-msg');
    const k = parseInt(v, 10);
    if (k >= 1 && k <= WORDS.length) {
      m.textContent = '';
      openWord(v);
      const el = document.querySelector(`#k-list .kwd[data-n="${v}"]`);
      if (el) {
        const d = el.closest('details');
        if (d) d.open = true;
        el.scrollIntoView({
          block: 'center',
        });
      }
    } else {
      m.textContent = `Número fora do baralho. Use de 001 a ${WORDS.length}.`;
    }
  });
  $('#k-num').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#k-go').click();
    }
  });
}

/* estudo */
let deck = [];

let deckIndex = 0;

let hits = 0;

let results = [];

/** Preenche a lista de unidades abertas na aba de estudo. */
function fillStudyUnits() {
  let h = '<option value="all">Todas as unidades abertas</option>';
  let i;
  for (i = 0; i < 6; i++) {
    if (unitStatus(i) !== 'locked') h += `<option value="${i}">${i + 1}. ${UNITS[i].pt}</option>`;
  }
  $('#ks-u').innerHTML = h;
  fillStudyThemes();
}

/** Preenche a lista de temas da unidade escolhida. */
function fillStudyThemes() {
  const uv = $('#ks-u').value;
  let h = '<option value="all">Todos os temas</option>';
  if (uv !== 'all')
    WORD_UNITS[+uv].themes.forEach((th, ti) => {
      h += `<option value="${ti}">${th.name}</option>`;
    });
  $('#ks-t').innerHTML = h;
  $('#ks-t').disabled = uv === 'all';
}

/** Monta o baralho com as palavras coletadas no grupo escolhido e começa. */
function startStudy() {
  const uv = $('#ks-u').value;
  const tv = $('#ks-t').value;
  deck = WORDS.filter(
    (o) => isCollected(o) && (uv === 'all' || o.unit === +uv) && (tv === 'all' || o.theme === +tv),
  );
  deckIndex = 0;
  hits = 0;
  results = [];
  showStudyCard();
}

/** Mostra a carta atual do estudo, ou o resultado ao fim do baralho. */
function showStudyCard() {
  const host = $('#k-study');
  let h;
  if (!deck.length) {
    host.innerHTML =
      '<div class="kdone">Nenhuma palavra coletada neste grupo ainda. Estude no Mapa para coletar palavras.</div>';
    return;
  }
  if (deckIndex >= deck.length) {
    host.innerHTML = `<div class="kdone"><h3>Fim do baralho!</h3><p>${hits} de ${deck.length} acertos. As cartas que você errou voltam na próxima rodada.</p><div style="margin-top:14px"><button class="btn alt" id="k-again" type="button">Recomeçar</button></div></div>`;
    $('#k-again').addEventListener('click', startStudy);
    return;
  }
  const o = deck[deckIndex];
  host.innerHTML = `<div class="kstudy"><div><div id="k-sf"></div><p class="khint" id="k-sh">Toque na carta para ver a ilustração e a frase</p></div><div class="kctl"><div><div class="krow"><span>Carta ${deckIndex + 1} de ${deck.length}</span><span>${hits}${hits === 1 ? ' acerto' : ' acertos'}</span></div><div class="kbar"><i style="width:${(deckIndex / deck.length) * 100}%"></i></div></div><div class="kbtns"><button class="btn ghost" id="k-prev" type="button"${deckIndex === 0 ? ' disabled' : ''}>Voltar</button><button class="btn" id="k-miss" type="button" disabled>Errei</button><button class="btn jade" id="k-hit" type="button" disabled>Acertei</button></div><p class="khint" style="text-align:left">Carta ${o.n} · ${esc(UNITS[o.unit].pt)} · ${esc(o.tname)}</p></div></div>`;
  mountFlashcard($('#k-sf'), o, 'kflipS', (on) => {
    $('#k-miss').disabled = !on;
    $('#k-hit').disabled = !on;
    $('#k-sh').textContent = on
      ? 'Você acertou o significado?'
      : 'Toque na carta para ver a ilustração e a frase';
  });
  function ans(ok) {
    results[deckIndex] = ok;
    if (ok) hits++;
    deckIndex++;
    showStudyCard();
  }
  $('#k-hit').addEventListener('click', () => {
    ans(true);
  });
  $('#k-miss').addEventListener('click', () => {
    ans(false);
  });
  $('#k-prev').addEventListener('click', () => {
    if (deckIndex > 0) {
      if (results[kI - 1]) kHits--;
      kI--;
      showStudyCard();
    }
  });
}

/* material impresso */
function renderPrintCards() {
  $('#k-pgrid').innerHTML = WORDS.filter((o) => o.ill)
    .map(printCardHtml)
    .join('');
}

/** Troca a aba da tela de cartas: mapa, estudo ou material. */
function setCardsTab(t) {
  activeTab = t;
  ['map', 'study', 'print'].forEach((k) => {
    $(`#kt-${k}`).setAttribute('aria-selected', k === t ? 'true' : 'false');
    $(`#kv-${k}`).hidden = k !== t;
  });
  if (t === 'map') renderWordMap();
  if (t === 'study') {
    fillStudyUnits();
    startStudy();
  }
  if (t === 'print') renderPrintCards();
}

function renderCards() {
  setCardsTab(activeTab);
}

function initCards() {
  ['map', 'study', 'print'].forEach((k) => {
    $(`#kt-${k}`).addEventListener('click', () => {
      setCardsTab(k);
    });
  });
  $('#ks-u').addEventListener('change', () => {
    fillStudyThemes();
    startStudy();
  });
  $('#ks-t').addEventListener('change', startStudy);
}

export { WORDS, initCards, isCollected, renderCards };
