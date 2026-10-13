/** Escolha do bichinho. */

import { creatureSvg } from '../art/creatures.js';
import { $, toast } from '../core/dom.js';
import { go } from '../core/router.js';
import { S } from '../core/state.js';
import { PETS } from '../data/content.js';
import { petSay } from './pet.js';

let pickIdx = 0;

/** Cartões dos bichinhos para adotar. */
function renderPick() {
  let h = '';
  PETS.forEach((p, i) => {
    h += `<button type="button" class="pcard" data-i="${i}" aria-pressed="${i === pickIdx}">${creatureSvg(p.k, 190, 'happy')}<b class="ko">${p.n}</b><span>${p.d}</span></button>`;
  });
  $('#pets').innerHTML = h;
  $('#petname').value = PETS[pickIdx].n;
  document.querySelectorAll('.pcard').forEach((b) => {
    b.addEventListener('click', () => {
      pickIdx = +b.getAttribute('data-i');
      renderPick();
    });
  });
}

function initPick() {
  $('#adopt').addEventListener('click', () => {
    S.pet = pickIdx;
    S.name = $('#petname').value.trim() || PETS[pickIdx].n;
    toast(`${S.name} entrou para a sua família!`);
    go('pet');
    petSay('hi');
  });
}

export { initPick, renderPick };
