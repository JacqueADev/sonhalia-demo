/** Funções pequenas e puras de apoio. */
function clamp(x) {
  return Math.max(0, Math.min(100, x));
}

/** Devolve uma cópia embaralhada da lista. */
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** Número entre 0 e 1 que depende só de `s`: o mesmo valor dá sempre o mesmo resultado. */
function seededRandom(s) {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export { clamp, seededRandom, shuffle };
