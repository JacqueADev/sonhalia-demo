/**
 * Ponto de entrada: monta as telas, liga os eventos e abre o início.
 */

import { $ } from './core/dom.js';
import { initTheme } from './core/theme.js';
import { registerView, initNav } from './core/router.js';
import { app } from './core/state.js';
import { updateHeader } from './views/header.js';
import { initHome } from './views/home.js';
import { renderStory, initStory } from './views/story.js';
import { renderPick, initPick } from './views/pick.js';
import { renderPet, initPet } from './views/pet.js';
import { showWorld } from './views/world.js';
import { openRegion, initRegion } from './views/region.js';
import { renderCards, initCards } from './views/cards.js';
import { renderCorrections } from './views/corrections.js';
import { renderTeacher } from './views/teacher.js';

/** Carrega o texto das regras de negócio (partials/regras.html). */
async function loadRules() {
  const response = await fetch(new URL('../partials/regras.html', import.meta.url));
  $('#v-rules').innerHTML = await response.text();
}

/** Monta as telas, liga os eventos e registra o desenho de cada tela. */
async function start() {
  await loadRules();
  initTheme(() => {
    if (app.cur === 'pet') renderPet();
  });
  initNav();
  initHome();
  initStory();
  initPick();
  initPet();
  initRegion();
  initCards();
  registerView('story', renderStory);
  registerView('pick', renderPick);
  registerView('pet', renderPet);
  registerView('map', () => (app.reg >= 0 ? openRegion(app.reg) : showWorld()));
  registerView('cards', renderCards);
  registerView('corr', renderCorrections);
  registerView('tch', renderTeacher);
  updateHeader();
}
start();
