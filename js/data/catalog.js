/** Catálogo da loja do bichinho. */
const CAT = {
  bolinho: {
    n: 'Bolinho',
    p: 5,
    food: true,
    f: 25,
    h: 5,
  },
  cha: {
    n: 'Chá gelado',
    p: 8,
    food: true,
    f: 15,
    h: 20,
  },
  sopa: {
    n: 'Sopa quentinha',
    p: 12,
    food: true,
    f: 45,
    h: 10,
  },
  rug: {
    n: 'Tapete listrado',
    p: 40,
  },
  plant: {
    n: 'Planta feliz',
    p: 60,
  },
  poster: {
    n: 'Quadro da ilha',
    p: 70,
  },
  lamp: {
    n: 'Lâmpada solar',
    p: 80,
  },
  bed: {
    n: 'Caminha fofa',
    p: 150,
  },
  boost: {
    n: 'Lupa de estudo',
    p: 200,
    d: '+20% de pérolas nos jogos',
  },
  casa2: {
    n: 'Bandeira dourada',
    p: 300,
    d: 'Enfeita a casa no topo',
  },
};

const FOODS = ['bolinho', 'cha', 'sopa'];

const DECOR = ['rug', 'plant', 'poster', 'lamp', 'bed'];

const UPS = ['boost', 'casa2'];

export { CAT, DECOR, FOODS, UPS };
