/** Estado do aluno (S), estado da interface (app) e valores derivados. */

import { PETS, TOTAL } from '../data/content.js';

const S = {
  name: '범이',
  pet: 0,
  coins: 120,
  fome: 55,
  humor: 70,
  energia: 80,
  inv: {
    bolinho: 2,
    cha: 1,
  },
  owned: {},
  vocab: [20, 14, 6, 0, 0, 0],
  gram: [3, 3, 1, 0, 0, 0],
  bonus: {
    0: true,
  },
  secret: {},
  qr: {
    0: true,
  },
  rebels: 8,
  sel: 2,
  subs: [
    {
      id: 1,
      unit: 0,
      kind: 'texto',
      prompt: '자기소개를 써 보세요.',
      text: '안녕하세요! 저는 민지예요. 저는 브라질 사람이에요. 저는 학생이에요.',
      status: 'done',
      seen: true,
      pts: 30,
      date: '12/09',
      fb: 'Muito bem! Você usou 예요 depois de 민지 (vogal) e 이에요 depois de 사람 e 학생 (consoante), tudo certo. Para soar mais natural, feche a apresentação com 만나서 반갑습니다.',
    },
    {
      id: 2,
      unit: 1,
      kind: 'texto',
      prompt: '가족을 소개하세요.',
      text: '우리 엄마는 선생님이에요. 아빠는 의사예요. 동생은 학생이에요.',
      status: 'pending',
      seen: true,
      pts: 0,
      date: '28/09',
      fb: '',
    },
  ],
  nextId: 3,
};

/** Estado de interface compartilhado entre as telas. */
const app = {
  who: 'Jac',
  cur: 'home',
  reg: -1,
  wsel: 2,
  logged: false,
  stN: 0,
  actKind: '',
};

/** Espécie do bichinho adotado (por exemplo, "tiger"). */
function petKind() {
  return PETS[S.pet].k;
}

/**
 * Progresso de uma unidade, de 0 a 100: média entre o vocabulário coletado e as lições feitas.
 */
function progress(i) {
  return Math.round(((S.vocab[i] / TOTAL[i]) * 100 + (S.gram[i] / 3) * 100) / 2);
}

/**
 * Situação de uma unidade: 'locked', 'open' ou 'done'.
 * A unidade abre quando a anterior chega a 70% de progresso.
 */
function unitStatus(i) {
  if (i > 0 && progress(i - 1) < 70) return 'locked';
  return S.vocab[i] >= TOTAL[i] && S.gram[i] >= 3 ? 'done' : 'open';
}

/** Humor do bichinho: 'sleepy', 'hungry', 'sad' ou 'happy', nessa ordem de prioridade. */
function mood() {
  if (S.energia < 25) return 'sleepy';
  if (S.fome < 30) return 'hungry';
  if (S.humor < 30) return 'sad';
  return 'happy';
}

/** Nível do bichinho, calculado a partir das palavras coletadas e das lições feitas. */
function level() {
  let v = 0;
  let g = 0;
  let i;
  for (i = 0; i < 6; i++) {
    v += S.vocab[i];
    g += S.gram[i];
  }
  return 1 + Math.floor((v + g * 5) / 15);
}

export { S, app, level, mood, petKind, progress, unitStatus };
