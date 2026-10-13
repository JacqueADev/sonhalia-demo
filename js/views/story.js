/** História de abertura em cinco cenas. */

import { scene } from '../art/scenes.js';
import { $ } from '../core/dom.js';
import { go } from '../core/router.js';
import { app } from '../core/state.js';
import { STORY } from '../data/story.js';

/** Mostra a cena e o texto da parte atual da história. */
function renderStory() {
  const s = STORY[app.stN];
  $('#st-art').innerHTML = scene(app.stN);
  $('#st-n').textContent = `Parte ${app.stN + 1} de ${STORY.length}`;
  $('#st-t').textContent = s.t;
  $('#st-p').textContent = s.p;
  $('#st-dots').innerHTML = STORY.map(
    (x, i) => `<i class="${i === app.stN ? 'on' : ''}"></i>`,
  ).join('');
  $('#st-prev').hidden = app.stN === 0;
  $('#st-next').textContent = app.stN === STORY.length - 1 ? 'Escolher meu bichinho' : 'Continuar';
}

/** Fim (ou pulo) da história: segue para a escolha do bichinho. */
function storyEnd() {
  app.logged = true;
  $('#av').textContent = app.who.charAt(0).toUpperCase();
  go('pick');
}

function initStory() {
  $('#st-next').addEventListener('click', () => {
    if (app.stN === STORY.length - 1) storyEnd();
    else {
      app.stN++;
      renderStory();
      window.scrollTo(0, 0);
    }
  });
  $('#st-prev').addEventListener('click', () => {
    if (app.stN > 0) {
      stN--;
      renderStory();
    }
  });
  $('#st-skip').addEventListener('click', storyEnd);
}

export { initStory, renderStory };
