/** Atividades de cada região: gramática, palavras, bônus, desafios e missão do QR. */

import { creatureSvg } from '../art/creatures.js';
import { pearl } from '../art/items.js';
import { BLD, SK } from '../art/map.js';
import { $, esc, toast } from '../core/dom.js';
import { earn } from '../core/economy.js';
import { go } from '../core/router.js';
import { S, app, petKind, progress } from '../core/state.js';
import { clamp, shuffle } from '../core/util.js';
import { PAGES, SECRET_COST, TOTAL, UNITS } from '../data/content.js';
import { updateHeader } from './header.js';
import { petHop, petSay } from './pet.js';
import { openRegion } from './region.js';

/** Troca o conteúdo da área de atividade da região. */
function setActivityHtml(html) {
  $('#act').innerHTML = html;
}

/** Abre a atividade do prédio escolhido (escola, mercado, ateliê, desafios ou QR). */
function openActivity(id, quiet) {
  app.actKind = id;
  document.querySelectorAll('.bld').forEach((g) => {
    g.classList.toggle('sel', g.getAttribute('data-b') === id);
  });
  const i = app.reg;
  const u = UNITS[i];
  if (id === 'escola') openGrammarSchool();
  if (id === 'mercado') openWordMarket();
  if (id === 'atelie') openBonusStudio();
  if (id === 'desafio') openRegionChallenge();
  if (id === 'secreto') openSecretChallenge();
  if (id === 'qr') openQrMission();
  if (!quiet)
    $('#act').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
}

/** Escola de Gramática: resumo da unidade e as três lições. */
function openGrammarSchool() {
  const i = app.reg;
  const u = UNITS[i];
  const g = S.gram[i];
  let h = `<h2>Escola de Gramática</h2><p class="lead">Tema: <span class="ko">${u.topic}</span> · Cartilha, págs. ${PAGES[i][0]} a ${PAGES[i][1]}</p>`;
  h += `<div class="sumbox ko" style="font-family:var(--f-body)">${esc(u.sum)}</div><ul class="lessons">`;
  ['Resumo e "Monte a frase" 1', 'Monte a frase 2', 'Quiz da unidade: Monte a frase 3'].forEach(
    (t, n) => {
      const ok = g > n;
      const next = g === n;
      h += `<li class="${ok ? 'ok' : ''}"><span class="nb">${ok ? '✓' : n + 1}</span><div>Lição ${n + 1} · ${t}</div>${next ? `<button class="btn small jade" data-lesson="${n}" type="button">Fazer</button>` : ok ? `<button class="btn small ghost" data-lesson="${n}" type="button">Rever</button>` : '<span class="tag">Trancada</span>'}</li>`;
    },
  );
  h += '</ul><div id="arena"></div>';
  setActivityHtml(h);
  $('#act')
    .querySelectorAll('[data-lesson]')
    .forEach((b) => {
      b.addEventListener('click', () => {
        startSentenceGame(+b.getAttribute('data-lesson'));
      });
    });
}

/** Mercado de Palavras: entrada para o jogo de pares. */
function openWordMarket() {
  const i = app.reg;
  const h = `<h2>Mercado de Palavras</h2><p class="lead">Vocabulário da região: ${S.vocab[i]} de ${TOTAL[i]} palavras coletadas. Ache os pares para coletar mais.</p><button class="btn vio" id="goMem" type="button">Jogar pares de cartas</button><div id="arena" style="margin-top:16px"></div>`;
  setActivityHtml(h);
  $('#goMem').addEventListener('click', startMemoryGame);
}

/* pares de cartas */
function startMemoryGame() {
  const i = app.reg;
  const words = UNITS[i].words;
  let cards = [];
  let first = null;
  let lock = false;
  let matched = 0;
  let moves = 0;
  const arena = $('#arena');
  words.forEach((w, n) => {
    cards.push({
      id: n,
      t: 'n',
      a: w[0],
    });
    cards.push({
      id: n,
      t: 'p',
      a: w[1],
    });
  });
  cards = shuffle(cards);
  let h =
    '<div class="tr">Ligue cada palavra ao significado. <span id="mv" class="tag">0 jogadas</span></div><div class="mem">';
  cards.forEach((c, n) => {
    h += `<button type="button" class="mc" data-i="${n}" aria-label="Carta ${n + 1}">?</button>`;
  });
  arena.innerHTML = `${h}</div>`;
  const btns = arena.querySelectorAll('.mc');
  function face(b, c, on) {
    if (on) {
      b.classList.add('up');
      b.classList.toggle('pt', c.t === 'p');
      b.textContent = c.a;
    } else {
      b.classList.remove('up', 'pt');
      b.textContent = '?';
    }
  }
  btns.forEach((b) => {
    b.addEventListener('click', () => {
      const n = +b.getAttribute('data-i');
      const c = cards[n];
      if (lock || b.classList.contains('up') || b.classList.contains('got')) return;
      face(b, c, true);
      if (first === null) {
        first = n;
        return;
      }
      moves++;
      $('#mv').textContent = `${moves} jogadas`;
      const a = first;
      const bb = btns[a];
      first = null;
      if (cards[a].id === c.id && cards[a].t !== c.t) {
        bb.classList.add('got');
        b.classList.add('got');
        matched++;
        if (matched === words.length)
          setTimeout(() => {
            finishGame(
              startMemoryGame,
              Math.max(10, 30 - (moves - 6) * 2),
              3,
              0,
              'Você achou todos os pares!',
              'Três palavras novas entraram na sua coleção.',
            );
          }, 500);
      } else {
        lock = true;
        setTimeout(() => {
          face(bb, cards[a], false);
          face(b, c, false);
          lock = false;
        }, 800);
      }
    });
  });
}
/* monte a frase */
function startSentenceGame(lesson) {
  const i = app.reg;
  const P = UNITS[i].phr[lesson];
  let placed = [];
  let bank;
  const arena = $('#arena');
  do {
    bank = shuffle(
      P.t.map((t, n) => ({
        t: t,
        i: n,
      })),
    );
  } while (bank.every((x, n) => x.i === n) && P.t.length > 1);
  function draw() {
    let h = `<div class="tr">Traduza para o coreano: "${esc(P.pt)}"</div><div class="line" id="line" aria-label="Sua frase">`;
    if (!placed.length) h += '<span class="hint">Toque nas peças abaixo, na ordem certa.</span>';
    placed.forEach((x, n) => {
      h += `<button type="button" class="tok" data-p="${n}">${x.t}</button>`;
    });
    h += '</div><div class="bank">';
    bank.forEach((x, n) => {
      const used = placed.indexOf(x) > -1;
      h += `<button type="button" class="tok${used ? ' used' : ''}" data-b="${n}"${used ? ' disabled' : ''}>${x.t}</button>`;
    });
    h += `</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small jade" id="chk" type="button"${placed.length === P.t.length ? '' : ' disabled'}>Conferir</button><button class="btn small" id="clr" type="button">Limpar</button></div><div id="pm" style="margin-top:12px"></div>`;
    arena.innerHTML = h;
    arena.querySelectorAll('[data-b]').forEach((b) => {
      b.addEventListener('click', () => {
        placed.push(bank[+b.getAttribute('data-b')]);
        draw();
      });
    });
    arena.querySelectorAll('[data-p]').forEach((b) => {
      b.addEventListener('click', () => {
        placed.splice(+b.getAttribute('data-p'), 1);
        draw();
      });
    });
    $('#clr').addEventListener('click', () => {
      placed = [];
      draw();
    });
    $('#chk').addEventListener('click', () => {
      const ok = placed.every((x, n) => x.i === n);
      const m = $('#pm');
      if (ok) {
        m.innerHTML = `<div class="fb ok">✓ Certo! <span class="ko">${P.t.join(' ')}</span></div>`;
        setTimeout(() => {
          finishGame(
            () => {
              startSentenceGame(lesson);
            },
            25,
            0,
            lesson === S.gram[i] ? 1 : 0,
            'Frase certa!',
            P.t.join(' '),
          );
        }, 1000);
      } else {
        m.innerHTML = `<div class="fb no">✗ Quase! A ordem das palavras muda. Releia o ponto de gramática na cartilha, págs. ${PAGES[i][0]} a ${PAGES[i][1]}.</div>`;
        const ln = $('#line');
        ln.classList.remove('shake');
        void ln.offsetWidth;
        ln.classList.add('shake');
      }
    });
  }
  draw();
}

/** Tela de vitória: soma pérolas, avança a unidade e avisa se a próxima região abriu. */
function finishGame(again, reward, vocabGain, gramGain, title, msg) {
  const i = app.reg;
  const before = progress(i);
  const got = earn(reward);
  if (vocabGain) S.vocab[i] = Math.min(TOTAL[i], S.vocab[i] + vocabGain);
  if (gramGain) S.gram[i] = Math.min(3, S.gram[i] + gramGain);
  S.humor = clamp(S.humor + 10);
  S.energia = clamp(S.energia - 5);
  const after = progress(i);
  const extra =
    i < 5 && before < 70 && after >= 70
      ? '<p style="font-weight:800;color:var(--jade);margin-top:6px">A próxima região abriu no mundo!</p>'
      : '';
  const arena = $('#arena');
  arena.innerHTML = `<div class="win">${creatureSvg(petKind(), 130, 'happy')}<h3>${title}</h3><p class="ko">${msg}</p><p style="margin-top:8px;font-weight:800" class="price">${pearl(18)} +${got} pérolas · região em ${after}%</p>${extra}<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn small" id="again" type="button">Jogar de novo</button><button class="btn small alt" id="tohome" type="button">Ver o bichinho</button></div></div>`;
  updateHeader();
  $('#tohome').addEventListener('click', () => {
    go('pet');
    petHop();
    petSay('play');
  });
  $('#again').addEventListener('click', () => {
    if (app.actKind === 'escola') openGrammarSchool();
    else again();
  });
}

/* ateliê de bônus (camada extra) */
function openBonusStudio() {
  const i = app.reg;
  const h = `<h2>Ateliê de Bônus</h2><p class="lead">Camada extra de gramática: ${UNITS[i].bonus.length} exercícios com correção na hora. ${S.bonus[i] ? 'O prêmio desta série já foi coletado, mas você pode treinar à vontade.' : 'Ganhe 8 pérolas por acerto e 10 a mais se acertar todos.'}</p><button class="btn vio" id="goB" type="button">Começar a série</button><div id="arena" style="margin-top:16px"></div>`;
  setActivityHtml(h);
  $('#goB').addEventListener('click', startBonusSeries);
}

/** Roda os exercícios do ateliê, com a correção aparecendo logo após cada resposta. */
function startBonusSeries() {
  const i = app.reg;
  const qs = UNITS[i].bonus;
  let n = 0;
  let ok = 0;
  const arena = $('#arena');
  function show() {
    const q = qs[n];
    let h = `<div class="tag">Exercício ${n + 1} de ${qs.length}</div><div class="tr" style="margin-top:4px">${esc(q.pt)}</div>`;
    if (q.s)
      h += `<div class="qs">${esc(q.s).replace('___', '<span style="border-bottom:4px solid var(--sky);padding:0 18px">&nbsp;</span>')}</div>`;
    h += '<div class="opts">';
    q.o.forEach((o, k) => {
      h += `<button type="button" class="opt" data-k="${k}">${esc(o)}</button>`;
    });
    h += '</div><div id="fb"></div>';
    arena.innerHTML = h;
    arena.querySelectorAll('.opt').forEach((b) => {
      b.addEventListener('click', () => {
        const k = +b.getAttribute('data-k');
        const right = k === q.a;
        arena.querySelectorAll('.opt').forEach((x) => {
          x.disabled = true;
          const kk = +x.getAttribute('data-k');
          if (kk === q.a) x.classList.add('right');
          else if (kk === k) x.classList.add('wrong');
        });
        if (right) ok++;
        $('#fb').innerHTML =
          `<div class="fb ${right ? 'ok' : 'no'}">${right ? '✓ Correto!' : '✗ Não foi dessa vez.'} Resposta certa: <span class="ko"><b>${esc(q.o[q.a])}</b></span><br><span style="font-weight:600">${esc(q.e)}</span></div><button class="btn small alt" id="nx" type="button" style="margin-top:10px">${n + 1 < qs.length ? 'Próximo exercício' : 'Ver resultado'}</button>`;
        $('#nx').addEventListener('click', () => {
          n++;
          if (n < qs.length) show();
          else finish();
        });
      });
    });
  }
  function finish() {
    let prize = 0;
    if (!S.bonus[i]) {
      prize = earn(ok * 8 + (ok === qs.length ? 10 : 0), true);
      S.bonus[i] = true;
      updateHeader();
    }
    arena.innerHTML = `<div class="win">${creatureSvg(petKind(), 120, ok === qs.length ? 'happy' : 'sad')}<h3>${ok} de ${qs.length} certas</h3><p>${ok === qs.length ? 'Perfeito! Você dominou este ponto.' : 'Releia as explicações acima e tente de novo.'}</p><p style="margin-top:8px;font-weight:800" class="price">${prize ? `${pearl(18)} +${prize} pérolas de bônus` : 'Prêmio já coletado nesta região'}</p><div style="margin-top:12px"><button class="btn small" id="rp" type="button">Refazer a série</button></div></div>`;
    $('#rp').addEventListener('click', startBonusSeries);
    refreshRegionKeepingActivity();
  }
  show();
}

/** Redesenha o mapa da região sem fechar a atividade aberta. */
function refreshRegionKeepingActivity() {
  /* atualiza estrela do ateliê sem fechar a atividade */
  const arenaHtml = $('#act').innerHTML;
  const k = app.actKind;
  openRegion(app.reg);
  $('#act').innerHTML = arenaHtml;
  const rp = $('#rp');
  if (rp) rp.addEventListener('click', startBonusSeries);
}

/* desafios com correção da professora */
function openRegionChallenge() {
  renderChallengeForm(
    'texto',
    'Desafio da Região',
    'Desafio padrão · já aberto',
    UNITS[app.reg].write,
  );
}

/** Desafio secreto (fala): precisa ser desbloqueado com pérolas. */
function openSecretChallenge() {
  const i = app.reg;
  if (!S.secret[i]) {
    setActivityHtml(
      `<h2>Desafio Secreto</h2><p class="lead">Este desafio está trancado. Ele é de <b>fala</b>: você grava um áudio e a professora corrige.</p><div class="info2" style="margin-bottom:14px"><div><b>Custo para abrir</b><span class="price">${pearl(16)} ${SECRET_COST} pérolas · você tem ${S.coins}</span></div></div><button class="btn alt" id="unl" type="button"${S.coins >= SECRET_COST ? '' : ' disabled'}>Desbloquear</button>${S.coins >= SECRET_COST ? '' : `<p class="hint">Faltam ${SECRET_COST - S.coins} pérolas. Faça jogos e desafios para juntar.</p>`}`,
    );
    const b = $('#unl');
    if (b)
      b.addEventListener('click', () => {
        S.coins -= SECRET_COST;
        S.secret[i] = true;
        updateHeader();
        toast('Desafio secreto desbloqueado!');
        openRegion(i);
        openActivity('secreto');
      });
    return;
  }
  renderChallengeForm('fala', 'Desafio Secreto', 'Desbloqueado · fala', UNITS[i].speak);
}

/**
 * Formulário de um desafio corrigido pela professora.
 * @param {'texto'|'fala'} kind tipo do envio
 */
function renderChallengeForm(kind, title, badge, ch) {
  const i = app.reg;
  const prevs = S.subs.filter((x) => x.unit === i && x.kind === kind);
  let h = '';
  h += `<h2>${title}<span class="badge">${badge}</span></h2><p class="lead">Este desafio é corrigido pela professora. Ela recebe o seu envio por WhatsApp e devolve a correção e os pontos aqui, na aba Correções.</p>`;
  h += `<div class="prompt"><span class="ko">${ch.ko}</span><span>${esc(ch.pt)}</span></div>`;
  if (kind === 'texto') {
    h +=
      '<label for="tx">Seu texto em coreano</label><textarea id="tx" placeholder="여기에 쓰세요…"></textarea><p class="hint"><span id="cnt">0</span> caracteres · mínimo de 20</p>';
  } else {
    h +=
      '<label for="au">Seu áudio</label><input id="au" type="file" accept="audio/*"><p class="hint">Envie um arquivo de áudio gravado no celular (mp3, m4a ou ogg).</p>';
  }
  h +=
    '<div id="sm" style="margin:10px 0"></div><button class="btn" id="send" type="button">Enviar para a professora</button>';
  if (prevs.length)
    h += `<p class="hint" style="margin-top:10px">Você já tem ${prevs.length} envio(s) neste desafio. Veja na aba Correções.</p>`;
  setActivityHtml(h);
  const tx = $('#tx');
  if (tx)
    tx.addEventListener('input', () => {
      $('#cnt').textContent = tx.value.length;
    });
  $('#send').addEventListener('click', () => {
    const sm = $('#sm');
    let body;
    if (kind === 'texto') {
      body = tx.value.trim();
      if (body.length < 20) {
        sm.innerHTML = '<div class="fb no">Escreva pelo menos 20 caracteres antes de enviar.</div>';
        return;
      }
    } else {
      const f = $('#au').files && $('#au').files[0];
      body = f ? f.name : 'audio-exemplo.m4a (demonstração)';
    }
    S.subs.unshift({
      id: S.nextId++,
      unit: i,
      kind: kind,
      prompt: ch.ko,
      text: body,
      status: 'pending',
      seen: true,
      pts: 0,
      date: 'hoje',
      fb: '',
    });
    updateHeader();
    sm.innerHTML =
      '<div class="fb ok">✓ Enviado! A professora recebeu no WhatsApp. A correção aparece na aba Correções, em até 3 dias úteis.</div>';
    if (tx) tx.value = '';
    toast('Envio feito. Aguarde a correção da professora.');
  });
}

/** Missão do QR code impresso na cartilha (simulada no protótipo). */
function openQrMission() {
  const i = app.reg;
  const done = S.qr[i];
  let h = `<h2>Placa do QR</h2><p class="lead">A cartilha tem um QR code na página ${PAGES[i][1]}. Aponte o celular para ele e a missão desta região abre aqui.</p>`;
  h += `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="qrplate"><svg viewBox="-40 -112 80 80" width="100" height="100" aria-hidden="true">${BLD.qr.replace(/<path d="M0 0 V-84"[^>]*>/g, '').replace(`<rect x="-36" y="-110" width="72" height="72" rx="10" fill="#fff"${SK}/>`, '')}</svg></div><div style="flex:1 1 240px"><p style="font-weight:700;margin-bottom:10px">Missão: traduza o texto curto da cartilha sobre <b>${UNITS[i].pt}</b>. Vale 40 pérolas na primeira vez.</p>${done ? '<span class="chip d">Missão concluída</span>' : '<button class="btn jade" id="qrb" type="button">Simular leitura do QR</button>'}</div></div>`;
  setActivityHtml(h);
  const b = $('#qrb');
  if (b)
    b.addEventListener('click', () => {
      S.qr[i] = true;
      const g = earn(40);
      toast(`Missão do QR concluída: +${g} pérolas!`);
      openRegion(i);
      openActivity('qr', true);
    });
}

export { openActivity };
