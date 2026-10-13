/** Peças dos mapas: ilhas, árvores, placas, marcos e prédios. */

import { OUT } from '../core/constants.js';
import { seededRandom } from '../core/util.js';

/**
 * Contorno orgânico e fechado, usado em ilhas e lagos.
 * O ruído vem de `seed`, então a mesma ilha sai igual em toda visita.
 */
function islandPath(cx, cy, rx, ry, seed, n, amp) {
  const p = [];
  let i;
  let a;
  let k;
  for (i = 0; i < n; i++) {
    a = (i / n) * Math.PI * 2;
    k = 1 - amp + amp * 2 * seededRandom(seed + i);
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  function mid(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  const s = mid(p[n - 1], p[0]);
  let d = `M${s[0].toFixed(1)} ${s[1].toFixed(1)}`;
  for (i = 0; i < n; i++) {
    let q = p[i];
    let m = mid(q, p[(i + 1) % n]);
    d += ` Q${q[0].toFixed(1)} ${q[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Curva suave que passa por todos os pontos dados (Catmull-Rom). */
function smoothPath(p) {
  let d = `M${p[0][0]} ${p[0][1]}`;
  let i;
  for (i = 0; i < p.length - 1; i++) {
    let p0 = p[i - 1] || p[i];
    let p1 = p[i];
    let p2 = p[i + 1];
    let p3 = p[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const SK = ` stroke="${OUT}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

/** Pinheiro na posição (x, y) com escala s. */
function pine(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-4" width="6" height="12" fill="#6B4A2B"/><path d="M0 -50 L16 -18 H-16Z" fill="#2E8B57"/><path d="M0 -34 L20 0 H-20Z" fill="#2A7D4F"/><path d="M0 -22 L24 12 H-24Z" fill="#23703F"/><path d="M-6 -30 L0 -44 L-2 -30Z" fill="#fff" opacity=".25"/></g>`;
}

/** Árvore redonda; c1 e c2 são as cores da copa. */
function round(x, y, s, c1, c2) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3.5" y="-6" width="7" height="16" fill="#7A532F"/><circle cy="-22" r="20" fill="${c2 || '#4DB35B'}"/><circle cx="-5" cy="-27" r="14" fill="${c1 || '#6FCB6C'}"/></g>`;
}

/** Montanha com topo nevado. */
function mountain(x, y, w, h) {
  return `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0 L0 ${-h} L${w / 2} 0Z" fill="#8FA3C2" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M${-w * 0.14} ${-h * 0.72} L0 ${-h} L${w * 0.14} ${-h * 0.72} L${w * 0.05} ${-h * 0.64} L0 ${-h * 0.72} L${-w * 0.05} ${-h * 0.62}Z" fill="#fff"/><path d="M${w * 0.1} ${-h * 0.4} L${w / 2} 0 H${w * 0.1}Z" fill="#6F83A4" opacity=".6"/></g>`;
}

/** Placa oval com o nome de um lugar. */
function sign(x, y, text, w) {
  const ww = w || Math.max(58, text.length * 7.4 + 22);
  return `<g><ellipse cx="${x}" cy="${y}" rx="${ww / 2}" ry="17" fill="#FFF6D6" stroke="${OUT}" stroke-width="3"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Nunito, 'Noto Sans KR', sans-serif" font-weight="800" font-size="14" fill="${OUT}">${text}</text></g>`;
}

/** Cadeado, para regiões e desafios bloqueados. */
function lockIcon(x, y) {
  return `<g transform="translate(${x} ${y})"><rect x="-14" y="-4" width="28" height="22" rx="6" fill="${OUT}"/><path d="M-8 -4 v-6 a8 8 0 0 1 16 0 v6" fill="none" stroke="${OUT}" stroke-width="5.5" stroke-linecap="round"/><circle cy="7" r="3" fill="#FFC83D"/></g>`;
}

/** Estrela de conclusão. */
function starIcon(cx, cy) {
  const pts = [];
  let i;
  for (i = 0; i < 10; i++) {
    let a = -Math.PI / 2 + (i * Math.PI) / 5;
    let r = i % 2 ? 8 : 18;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="#FFC83D" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
}

const LAND = {
  0: `<rect x="-40" y="-70" width="11" height="70" fill="#E0382C"${SK}/><rect x="29" y="-70" width="11" height="70" fill="#E0382C"${SK}/><rect x="-50" y="-64" width="100" height="9" fill="#F25B3A"${SK}/><rect x="-44" y="-80" width="88" height="9" fill="#E0382C"${SK}/><path d="M-36 -80 l4 -12 l4 12 M-20 -80 l4 -14 l4 14 M-4 -80 l4 -16 l4 16 M12 -80 l4 -14 l4 14 M26 -80 l4 -12 l4 12" fill="#F25B3A"${SK}/><circle cx="-14" cy="-44" r="7" fill="#FFC83D"${SK}/><circle cx="14" cy="-44" r="7" fill="#FFC83D"${SK}/>`,
  1: `<rect x="-46" y="-34" width="92" height="34" fill="#FFF3DC"${SK}/><rect x="-14" y="-28" width="28" height="28" fill="#B9824F"${SK}/><path d="M0 -28 V0 M-14 -14 H14" stroke="${OUT}" stroke-width="2.5"/><rect x="-40" y="-26" width="16" height="14" fill="#8FD8F2"${SK}/><rect x="24" y="-26" width="16" height="14" fill="#8FD8F2"${SK}/><path d="M-66 -34 Q-52 -40 -34 -54 L34 -54 Q52 -40 66 -34 Q40 -30 0 -30 Q-40 -30 -66 -34Z" fill="#59657A"${SK}/><path d="M-50 -54 Q-36 -58 -22 -72 L22 -72 Q36 -58 50 -54Z" fill="#6B7890"${SK}/><path d="M-22 -72 H22" stroke="${OUT}" stroke-width="4"/>`,
  2: `<g><rect x="-62" y="-30" width="54" height="30" rx="4" fill="#E8B26F"${SK}/><path d="M-66 -52 H-4 L2 -34 H-72Z" fill="#E8503A"${SK}/><path d="M-56 -52 l-2 18 M-44 -52 l-1 18 M-32 -52 l0 18 M-20 -52 l1 18 M-8 -52 l2 18" stroke="#fff" stroke-width="6"/><circle cx="-48" cy="-36" r="7" fill="#E8503A"${SK}/><circle cx="-34" cy="-36" r="7" fill="#FFC83D"${SK}/><circle cx="-20" cy="-36" r="7" fill="#7ED957"${SK}/></g><g><rect x="8" y="-30" width="54" height="30" rx="4" fill="#E8B26F"${SK}/><path d="M4 -52 H66 L72 -34 H-2Z" fill="#35A3F2"${SK}/><path d="M14 -52 l-2 18 M26 -52 l-1 18 M38 -52 l0 18 M50 -52 l1 18 M62 -52 l2 18" stroke="#fff" stroke-width="6"/><ellipse cx="24" cy="-38" rx="8" ry="6" fill="#FF80B5"${SK}/><ellipse cx="44" cy="-38" rx="8" ry="6" fill="#FFC83D"${SK}/></g>`,
  3: `<rect x="-50" y="-46" width="100" height="46" fill="#FFE0A8"${SK}/><path d="M-58 -46 L0 -80 L58 -46Z" fill="#E8503A"${SK}/><circle cx="0" cy="-58" r="10" fill="#fff"${SK}/><path d="M0 -64 V-58 H5" stroke="${OUT}" stroke-width="2.5" fill="none"/><rect x="-12" y="-26" width="24" height="26" rx="12" fill="#8A5A30"${SK}/><rect x="-42" y="-34" width="18" height="16" fill="#8FD8F2"${SK}/><rect x="24" y="-34" width="18" height="16" fill="#8FD8F2"${SK}/><path d="M0 -80 V-96 L18 -90 L0 -84" fill="#35A3F2"${SK}/>`,
  4: `<ellipse cx="0" cy="-70" rx="36" ry="42" fill="#FF6B5A"${SK}/><path d="M-12 -110 Q-24 -70 -12 -28 M12 -110 Q24 -70 12 -28" fill="none" stroke="#FFC83D" stroke-width="12"/><path d="M0 -112 V-28" stroke="#fff" stroke-width="10"/><ellipse cx="0" cy="-70" rx="36" ry="42" fill="none"${SK}/><path d="M-14 -28 L-10 -14 M14 -28 L10 -14" stroke="${OUT}" stroke-width="2.5"/><rect x="-14" y="-16" width="28" height="18" rx="3" fill="#B9824F"${SK}/>`,
  5: `<rect x="-62" y="-50" width="26" height="50" fill="#8FB5E8"${SK}/><rect x="-30" y="-78" width="24" height="78" fill="#6FA0E0"${SK}/><rect x="30" y="-58" width="30" height="58" fill="#A58BEF"${SK}/><rect x="2" y="-42" width="24" height="42" fill="#FF9BC4"${SK}/><path d="M-56 -40 h14 M-56 -30 h14 M-56 -20 h14 M-24 -66 h12 M-24 -54 h12 M-24 -42 h12 M-24 -30 h12 M36 -48 h18 M36 -36 h18 M36 -24 h18" stroke="#FFF3B0" stroke-width="4"/><path d="M-2 -82 V-120" stroke="${OUT}" stroke-width="5"/><ellipse cx="-2" cy="-100" rx="12" ry="7" fill="#FF6B5A"${SK}/>`,
};

const BLD = {
  escola: `<rect x="-46" y="-42" width="92" height="42" fill="#FFE0A8"${SK}/><path d="M-56 -42 L0 -78 L56 -42Z" fill="#35A3F2"${SK}/><rect x="-14" y="-62" width="28" height="18" rx="3" fill="#fff"${SK}/><path d="M0 -62 V-44" stroke="${OUT}" stroke-width="2.5"/><rect x="-12" y="-24" width="24" height="24" rx="12" fill="#8A5A30"${SK}/><rect x="-40" y="-32" width="18" height="14" fill="#8FD8F2"${SK}/><rect x="22" y="-32" width="18" height="14" fill="#8FD8F2"${SK}/>`,
  mercado: LAND[2],
  atelie: `<path d="M-52 0 L-40 -52 H40 L52 0Z" fill="#9378F6"${SK}/><path d="M-38 -52 L-30 0 M-12 -52 L-8 0 M12 -52 L8 0 M38 -52 L30 0" stroke="#fff" stroke-width="5" opacity=".8"/><path d="M-46 -52 L0 -92 L46 -52Z" fill="#FF80B5"${SK}/><path d="M0 -92 V-110" stroke="${OUT}" stroke-width="4"/><path d="M0 -118 l5 10 l11 1 l-8 8 l2 11 l-10 -6 l-10 6 l2 -11 l-8 -8 l11 -1Z" fill="#FFC83D"${SK}/><path d="M-14 0 V-28 Q0 -42 14 -28 V0Z" fill="#2B2F55"${SK}/>`,
  desafio: `<rect x="-30" y="-92" width="60" height="92" fill="#E9B88A"${SK}/><path d="M-36 -92 V-106 H-24 V-98 H-12 V-106 H0 V-98 H12 V-106 H24 V-98 H36 V-92Z" fill="#D9A06E"${SK}/><path d="M0 -106 V-134 L26 -126 L0 -118" fill="#E8503A"${SK}/><rect x="-10" y="-30" width="20" height="30" rx="10" fill="#8A5A30"${SK}/><rect x="-8" y="-72" width="16" height="22" rx="8" fill="#8FD8F2"${SK}/><path d="M-30 -60 h60" stroke="#C7915F" stroke-width="3"/>`,
  secreto: `<path d="M-54 0 Q-54 -70 0 -70 Q54 -70 54 0Z" fill="#9AA5B5"${SK}/><path d="M-30 -40 l10 -8 M26 -30 l-8 -10 M-40 -14 l12 -2" stroke="#7B879B" stroke-width="4" stroke-linecap="round"/><path d="M-18 0 V-28 Q0 -48 18 -28 V0Z" fill="#2B2F55"${SK}/>`,
  qr: `<path d="M0 0 V-84" stroke="#8A5A30" stroke-width="9" stroke-linecap="round"/><path d="M0 0 V-84" stroke="${OUT}" stroke-width="3" opacity=".3"/><rect x="-36" y="-110" width="72" height="72" rx="10" fill="#fff"${SK}/><rect x="-26" y="-100" width="18" height="18" rx="3" fill="${OUT}"/><rect x="8" y="-100" width="18" height="18" rx="3" fill="${OUT}"/><rect x="-26" y="-66" width="18" height="18" rx="3" fill="${OUT}"/><rect x="-2" y="-76" width="10" height="10" fill="${OUT}"/><rect x="14" y="-62" width="12" height="12" fill="${OUT}"/><rect x="-1" y="-96" width="6" height="6" fill="${OUT}"/>`,
};

export { BLD, LAND, SK, islandPath, smoothPath, lockIcon, mountain, pine, round, sign, starIcon };
