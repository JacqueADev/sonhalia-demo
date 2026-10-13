/** Criaturas em SVG: bichinhos e guardiões, com humor. */
let uid = 0;

const PAL = {
  tiger: {
    a: '#FFD27A',
    b: '#FF9B2F',
    c: '#C95E12',
    belly: '#FFF6E3',
    belly2: '#FFE2B4',
    line: '#5E2A0A',
    acc: '#E8503A',
    ear: '#FFE5C8',
  },
  bunny: {
    a: '#FFFFFF',
    b: '#DCCBFF',
    c: '#9677DD',
    belly: '#FFFFFF',
    belly2: '#F1E9FF',
    line: '#43308C',
    acc: '#4FC3F7',
    ear: '#FFB8D2',
  },
  fox: {
    a: '#FFB58A',
    b: '#FF7F48',
    c: '#C94A1E',
    belly: '#FFF8EC',
    belly2: '#FFE4CC',
    line: '#5A220E',
    acc: '#36CFC9',
    ear: '#3A1D14',
  },
  dokkaebi: {
    a: '#9CF0E3',
    b: '#3EC9C3',
    c: '#1F8F96',
    belly: '#E4FFF8',
    belly2: '#B3F3E6',
    line: '#0E4753',
    acc: '#FFC83D',
    ear: '#3EC9C3',
  },
  haetae: {
    a: '#FFE39A',
    b: '#FFB547',
    c: '#D8801A',
    belly: '#FFF7DC',
    belly2: '#FFE7AD',
    line: '#69380A',
    acc: '#E8503A',
    ear: '#FFB547',
  },
  turtle: {
    a: '#CBF59E',
    b: '#86D66D',
    c: '#439F4C',
    belly: '#FFF9D6',
    belly2: '#F4EBAA',
    line: '#1F5A2C',
    acc: '#FF8A5B',
    ear: '#86D66D',
  },
  magpie: {
    a: '#FFFFFF',
    b: '#F2F2FA',
    c: '#C4C7E2',
    belly: '#FFFFFF',
    belly2: '#EDEEF8',
    line: '#1E2340',
    acc: '#2E6FDB',
    ear: '#2B2F55',
  },
  dragon: {
    a: '#9AF2D4',
    b: '#38D0A5',
    c: '#16957C',
    belly: '#FFF9C2',
    belly2: '#FFE680',
    line: '#0B4B44',
    acc: '#FFC83D',
    ear: '#38D0A5',
  },
  toad: {
    a: '#DDF28C',
    b: '#A0D350',
    c: '#5F9A2D',
    belly: '#FFF4BE',
    belly2: '#F6E389',
    line: '#33521A',
    acc: '#FFC83D',
    ear: '#A0D350',
  },
};

/** Brilho de quatro pontas, usado como enfeite. */
function spark(x, y, r, col) {
  return `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="${col || '#FFE15A'}"/>`;
}

/** Hexágono do casco da tartaruga. */
function hexa(cx, cy, r) {
  const pts = [];
  let i;
  for (i = 0; i < 6; i++) {
    let a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="none" stroke="#E4FBC4" stroke-width="2.5" opacity=".75" stroke-linejoin="round"/>`;
}

/**
 * Desenha uma criatura em SVG (somente o conteúdo, sem a tag <svg>).
 * @param {string} kind tiger, bunny, fox, dokkaebi, haetae, turtle, magpie, dragon ou toad
 * @param {string} [mood='happy'] happy, hungry, sleepy ou sad
 */
function creature(kind, mood) {
  mood = mood || 'happy';
  const p = PAL[kind];
  const u = `c${++uid}`;
  const L = p.line;
  let back = '';
  let front = '';
  let s = '';
  const B = `url(#${u}b)`;
  const Bl = `url(#${u}l)`;
  const ST = ` stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const bx = kind === 'toad' ? 58 : 54;
  const by = kind === 'toad' ? 42 : 47;
  const defs = `<defs><radialGradient id="${u}b" cx=".35" cy=".28" r=".9"><stop offset="0" stop-color="${p.a}"/><stop offset=".55" stop-color="${p.b}"/><stop offset="1" stop-color="${p.c}"/></radialGradient><radialGradient id="${u}l" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="${p.belly}"/><stop offset="1" stop-color="${p.belly2}"/></radialGradient><radialGradient id="${u}e" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#6A58D0"/><stop offset=".5" stop-color="#2B2368"/><stop offset="1" stop-color="#120E36"/></radialGradient><radialGradient id="${u}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#9BE7FF"/><stop offset="1" stop-color="#9BE7FF" stop-opacity="0"/></radialGradient><radialGradient id="${u}s" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#9DDB72"/><stop offset=".6" stop-color="#4FA64E"/><stop offset="1" stop-color="#25663A"/></radialGradient></defs>`;
  const ear = (x, y, r) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${B}"${ST}/><circle cx="${x}" cy="${y + 1}" r="${r * 0.5}" fill="${p.ear}"/>`;
  const scarf = (col) =>
    `<path d="M-34 36 Q0 54 34 36 L30 48 Q0 66 -30 48Z" fill="${col}"${ST}/><path d="M-6 52 L-12 68 L0 62 L10 70 L8 54Z" fill="${col}"${ST}/><path d="M-22 44 q6 6 12 2 M6 48 q8 4 14 -4" stroke="#fff" stroke-width="2.5" fill="none" opacity=".6" stroke-linecap="round"/>`;

  /* atrás do corpo */
  if (kind === 'tiger') {
    back += `<path d="M46 34 C98 50 108 -8 76 -22" fill="none" stroke="${L}" stroke-width="19" stroke-linecap="round"/><path d="M46 34 C98 50 108 -8 76 -22" fill="none" stroke="${p.b}" stroke-width="13" stroke-linecap="round"/><path d="M82 14 l11 -3 M88 -2 l10 -5 M82 -16 l8 -7" stroke="${L}" stroke-width="4.5" stroke-linecap="round"/><circle cx="76" cy="-22" r="7.5" fill="${L}"/>`;
    back += ear(-38, -36, 17) + ear(38, -36, 17);
  }
  if (kind === 'bunny') {
    back += `<g transform="rotate(-10 -22 -42)"><ellipse cx="-22" cy="-74" rx="16" ry="40" fill="${B}"${ST}/><ellipse cx="-22" cy="-70" rx="8" ry="29" fill="${p.ear}"/></g>`;
    back += `<g transform="rotate(14 22 -42)"><ellipse cx="22" cy="-74" rx="16" ry="40" fill="${B}"${ST}/><ellipse cx="22" cy="-70" rx="8" ry="29" fill="${p.ear}"/></g>`;
    back += `<circle cx="48" cy="32" r="14" fill="${Bl}"${ST}/>`;
  }
  if (kind === 'fox') {
    [-78, -52, -26, 0, 26, 52, 78].forEach((a, i) => {
      back += `<g transform="rotate(${a} 0 34)"><path d="M-11 34 C-36 12 -38 -42 -6 -80 C6 -50 8 -10 11 34Z" fill="${i % 2 ? B : B}"${ST}/><path d="M-6 -80 C-18 -66 -24 -52 -28 -38 C-14 -40 2 -52 6 -52 C6 -62 2 -72 -6 -80Z" fill="#FFF8EC"/></g>`;
    });
    back += `<path d="M-50 -18 L-46 -66 L-16 -42Z" fill="${B}"${ST}/><path d="M-43 -32 L-42 -56 L-26 -42Z" fill="${p.ear}"/>`;
    back += `<path d="M50 -18 L46 -66 L16 -42Z" fill="${B}"${ST}/><path d="M43 -32 L42 -56 L26 -42Z" fill="${p.ear}"/>`;
  }
  if (kind === 'dokkaebi') {
    back += `<path d="M-54 -2 L-76 -16 L-56 12Z" fill="${B}"${ST}/><path d="M54 -2 L76 -16 L56 12Z" fill="${B}"${ST}/>`;
    back += `<path d="M-26 -42 L-18 -72 L-8 -44Z" fill="#FFF0B8"${ST}/><path d="M26 -42 L18 -72 L8 -44Z" fill="#FFF0B8"${ST}/>`;
    back += `<path d="M-16 -42 L-10 -68 L-3 -50 L2 -76 L8 -50 L15 -64 L17 -40Z" fill="#E8503A"${ST}/>`;
  }
  if (kind === 'haetae') {
    for (let k = 0; k < 9; k++) {
      let an = (k / 9) * Math.PI * 2;
      back += `<circle cx="${(Math.cos(an) * 54).toFixed(1)}" cy="${(-6 + Math.sin(an) * 48).toFixed(1)}" r="16" fill="${p.acc}"${ST}/>`;
    }
    back += `<path d="M46 36 C86 46 92 4 66 6" fill="none" stroke="${L}" stroke-width="17" stroke-linecap="round"/><path d="M46 36 C86 46 92 4 66 6" fill="none" stroke="${p.b}" stroke-width="11" stroke-linecap="round"/><circle cx="66" cy="6" r="10" fill="${p.acc}"${ST}/>`;
    back += `<ellipse cx="-46" cy="-30" rx="10" ry="14" transform="rotate(-30 -46 -30)" fill="${B}"${ST}/><ellipse cx="46" cy="-30" rx="10" ry="14" transform="rotate(30 46 -30)" fill="${B}"${ST}/>`;
  }
  if (kind === 'turtle') {
    back += `<ellipse cx="0" cy="10" rx="68" ry="54" fill="url(#${u}s)"${ST}/>${hexa(0, -18, 15)}${hexa(-32, -2, 15)}${hexa(32, -2, 15)}${hexa(-18, 26, 15)}${hexa(18, 26, 15)}${hexa(-54, 22, 10)}${hexa(54, 22, 10)}`;
    back += `<path d="M44 44 L66 56 L48 58Z" fill="${B}"${ST}/>`;
  }
  if (kind === 'magpie') {
    back += `<g fill="#2B2F55"${ST}><path d="M30 40 Q72 66 100 48 Q78 40 54 30Z"/><path d="M26 44 Q60 84 90 76 Q70 62 46 38Z"/></g><path d="M44 46 Q70 58 92 52" stroke="#4A7BE8" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>`;
  }
  if (kind === 'dragon') {
    back += `<path d="M42 38 C100 56 112 -14 76 -28 C94 -8 78 28 42 24Z" fill="${B}"${ST}/>`;
    back += `<path d="M-26 -42 C-32 -66 -46 -72 -56 -82 M-38 -64 C-48 -64 -54 -58 -56 -52" stroke="${L}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-26 -42 C-32 -66 -46 -72 -56 -82 M-38 -64 C-48 -64 -54 -58 -56 -52" stroke="#FFD84A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    back += `<path d="M26 -42 C32 -66 46 -72 56 -82 M38 -64 C48 -64 54 -58 56 -52" stroke="${L}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M26 -42 C32 -66 46 -72 56 -82 M38 -64 C48 -64 54 -58 56 -52" stroke="#FFD84A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    back += `<path d="M-22 -44 l6 -16 l6 16 M-6 -48 l6 -18 l6 18 M10 -44 l6 -16 l6 16" fill="${p.acc}"${ST}/>`;
  }
  if (kind === 'toad') {
    back += `<ellipse cx="0" cy="58" rx="64" ry="13" fill="#FFD84A"${ST}/><ellipse cx="0" cy="58" rx="11" ry="3.6" fill="#B58A12"/>`;
  }

  /* corpo */
  s += `<ellipse cx="0" cy="4" rx="${bx}" ry="${by}" fill="${B}"${ST}/>`;
  s += `<ellipse cx="0" cy="${kind === 'toad' ? 18 : 22}" rx="${kind === 'toad' ? 38 : 30}" ry="${kind === 'toad' ? 22 : 24}" fill="${Bl}"/>`;
  s +=
    '<ellipse cx="-22" cy="-28" rx="17" ry="8" fill="#fff" opacity=".4" transform="rotate(-25 -22 -28)"/>';
  const fc = kind === 'magpie' ? '#F7F7FF' : B;
  s += `<ellipse cx="-27" cy="49" rx="18" ry="10.5" fill="${fc}"${ST}/><ellipse cx="27" cy="49" rx="18" ry="10.5" fill="${fc}"${ST}/>`;
  s += `<path d="M-33 53 v-5 M-27 54 v-6 M-21 53 v-5 M21 53 v-5 M27 54 v-6 M33 53 v-5" stroke="${p.c}" stroke-width="2.2" stroke-linecap="round"/>`;
  if (kind !== 'magpie')
    s += `<ellipse cx="-55" cy="16" rx="10" ry="16" transform="rotate(16 -55 16)" fill="${B}"${ST}/><ellipse cx="55" cy="16" rx="10" ry="16" transform="rotate(-16 55 16)" fill="${B}"${ST}/>`;
  if (kind === 'magpie') {
    s += `<path d="M-52 -14 C-56 -54 56 -54 52 -14 C34 -28 -34 -28 -52 -14Z" fill="#2B2F55"${ST}/><path d="M-34 -34 Q-8 -46 18 -40" stroke="#5B8CF0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`;
    s += `<ellipse cx="-58" cy="16" rx="12" ry="24" transform="rotate(14 -58 16)" fill="#2B2F55"${ST}/><ellipse cx="58" cy="16" rx="12" ry="24" transform="rotate(-14 58 16)" fill="#2B2F55"${ST}/><path d="M-60 6 Q-56 20 -52 30 M60 6 Q56 20 52 30" stroke="#4A7BE8" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }

  /* detalhes do rosto por espécie */
  if (kind === 'tiger') {
    front += `<path d="M-10 -44 L-6 -29 M0 -46 L0 -30 M10 -44 L6 -29" stroke="${L}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-55 0 L-42 4 M-56 13 L-43 12 M55 0 L42 4 M56 13 L43 12" stroke="${L}" stroke-width="4.5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="14" rx="18" ry="12" fill="${Bl}"/>`;
  }
  if (kind === 'bunny') {
    front += `<path d="M3 -45 A10 10 0 1 0 3 -25 A7.5 7.5 0 1 1 3 -45Z" fill="#FFD84A" stroke="${L}" stroke-width="2"/><ellipse cx="0" cy="14" rx="17" ry="11" fill="#fff" opacity=".9"/>${spark(-76, -34, 6)}${spark(74, -56, 5)}${spark(80, -20, 4, '#BFEAFF')}`;
  }
  if (kind === 'fox') {
    front += `<path d="M-56 8 L-40 0 L-46 14 L-34 12 L-42 26 Q-54 24 -56 8Z" fill="#FFF8EC"${ST}/><path d="M56 8 L40 0 L46 14 L34 12 L42 26 Q54 24 56 8Z" fill="#FFF8EC"${ST}/><path d="M-4 -40 L0 -30 L4 -40Z" fill="${p.c}"/><circle cx="72" cy="-10" r="20" fill="url(#${u}g)"/><path d="M72 -30 Q82 -14 72 -2 Q62 -14 72 -30Z" fill="#7FE3FF" stroke="#1B8FB5" stroke-width="2"/>`;
  }
  if (kind === 'dokkaebi') {
    front += `<path d="M-34 36 Q0 52 34 36 L30 58 L0 50 L-30 58Z" fill="#FFB02E"${ST}/><path d="M-20 42 l4 13 M-6 46 l3 11 M8 46 l-3 11 M20 42 l-4 13" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`;
    front += `<g transform="rotate(24 70 6)"><rect x="63" y="-34" width="14" height="56" rx="7" fill="#B9824F"${ST}/><circle cx="70" cy="-42" r="16" fill="#CF9660"${ST}/><circle cx="62" cy="-46" r="3" fill="#8A5A30"/><circle cx="76" cy="-38" r="3" fill="#8A5A30"/><circle cx="70" cy="-52" r="3" fill="#8A5A30"/></g>`;
  }
  if (kind === 'haetae') {
    front += `<path d="M-6 -46 L0 -68 L6 -46Z" fill="#FFD84A"${ST}/><path d="M-16 20 q4 7 8 0 M0 20 q4 7 8 0 M-8 29 q4 7 8 0 M8 29 q4 7 8 0" stroke="${p.c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-30 38 Q0 50 30 38" stroke="${p.acc}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="0" cy="48" r="9" fill="#FFD84A"${ST}/><path d="M-9 48 h18 M0 48 v6" stroke="${L}" stroke-width="2"/>`;
  }
  if (kind === 'turtle') {
    front += `<circle cx="-10" cy="-38" r="3.4" fill="${p.c}"/><circle cx="0" cy="-42" r="3.4" fill="${p.c}"/><circle cx="10" cy="-38" r="3.4" fill="${p.c}"/><ellipse cx="0" cy="14" rx="19" ry="12" fill="${Bl}"/>`;
  }
  if (kind === 'dragon') {
    front += `<path d="M-16 12 C-52 6 -72 30 -92 24 M16 12 C52 6 72 30 92 24" stroke="${L}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M-16 12 C-52 6 -72 30 -92 24 M16 12 C52 6 72 30 92 24" stroke="${p.acc}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-6 26 Q0 44 6 26" fill="${p.acc}" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="70" cy="4" r="14" fill="url(#${u}g)"/><circle cx="70" cy="4" r="9" fill="#DFF8FF" stroke="#4AB3D9" stroke-width="2.5"/><path d="M-44 4 q4 6 8 0 M36 4 q4 6 8 0" stroke="${p.c}" stroke-width="2.4" fill="none"/>`;
  }
  if (kind === 'toad') {
    front += `<circle cx="-34" cy="-8" r="5" fill="${p.c}" opacity=".5"/><circle cx="36" cy="-14" r="6" fill="${p.c}" opacity=".5"/><circle cx="-14" cy="-28" r="4" fill="${p.c}" opacity=".5"/><circle cx="18" cy="34" r="5" fill="${p.c}" opacity=".4"/><circle cx="-38" cy="26" r="6" fill="${p.c}" opacity=".4"/>`;
  }

  /* olhos */
  let ex = 21;
  let ey = -8;
  let sc = 1;
  if (kind === 'toad') {
    s += front;
    front = '';
    s += `<circle cx="-25" cy="-36" r="16" fill="${B}"${ST}/><circle cx="25" cy="-36" r="16" fill="${B}"${ST}/>`;
    ex = 25;
    ey = -37;
    sc = 0.8;
  }
  let eyes = '';
  if (mood === 'sleepy') {
    eyes += `<path d="M-${ex + 9} ${ey} Q-${ex} ${ey + 9} -${ex - 9} ${ey} M${ex - 9} ${ey} Q${ex} ${ey + 9} ${ex + 9} ${ey}" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else {
    [-1, 1].forEach((d) => {
      const cx = d * ex;
      eyes += `<g transform="translate(${cx} ${ey}) scale(${sc})"><ellipse rx="10" ry="12.5" fill="url(#${u}e)" stroke="${L}" stroke-width="2.5"/><ellipse cx="0" cy="5" rx="6" ry="4" fill="#7A6AE8" opacity=".55"/><circle cx="-3.4" cy="-4.4" r="4.2" fill="#fff"/><circle cx="3.6" cy="4.6" r="2" fill="#fff"/><path d="M-11 -9 Q0 -20 11 -9" fill="none" stroke="${L}" stroke-width="3" stroke-linecap="round"/></g>`;
    });
    if (mood === 'sad')
      eyes += `<path d="M-33 ${ey - 17} L-12 ${ey - 12} M33 ${ey - 17} L12 ${ey - 12}" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="-30" cy="${ey + 10}" rx="2.5" ry="4" fill="#9BE7FF"/>`;
  }
  let blush =
    '<ellipse cx="-37" cy="10" rx="10" ry="6.5" fill="#FF7FA0" opacity=".42"/><ellipse cx="37" cy="10" rx="10" ry="6.5" fill="#FF7FA0" opacity=".42"/>';
  if (kind === 'toad')
    blush =
      '<ellipse cx="-40" cy="8" rx="10" ry="6" fill="#FF7FA0" opacity=".4"/><ellipse cx="40" cy="8" rx="10" ry="6" fill="#FF7FA0" opacity=".4"/>';

  /* boca e nariz */
  let mouth = '';
  if (kind === 'magpie') {
    mouth = `<path d="M-9 4 L0 -3 L9 4 L0 15Z" fill="#3A3F66"${ST}/><path d="M-4 5 L0 1 L3 5" stroke="#8D95D4" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else if (kind === 'toad') {
    if (mood === 'hungry')
      mouth = `<ellipse cx="0" cy="16" rx="12" ry="9" fill="#7A1F2B"${ST}/><ellipse cx="0" cy="21" rx="6" ry="3.5" fill="#FF8FA3"/>`;
    else if (mood === 'sad')
      mouth = `<path d="M-26 22 Q0 8 26 22" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`;
    else if (mood === 'sleepy')
      mouth = `<path d="M-14 16 Q0 22 14 16" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`;
    else
      mouth = `<path d="M-32 8 Q0 34 32 8" fill="#7A1F2B" stroke="${L}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="0" cy="22" rx="10" ry="5" fill="#FF8FA3"/>`;
    mouth += `<circle cx="-5" cy="1" r="1.8" fill="${L}"/><circle cx="5" cy="1" r="1.8" fill="${L}"/>`;
  } else {
    const nose =
      kind === 'bunny' ||
      kind === 'fox' ||
      kind === 'tiger' ||
      kind === 'dokkaebi' ||
      kind === 'haetae'
        ? `<path d="M-5 5 Q0 3 5 5 Q3 11 0 12 Q-3 11 -5 5Z" fill="${kind === 'bunny' ? '#FF8FB3' : L}"/>`
        : `<ellipse cx="0" cy="6" rx="3.4" ry="2.6" fill="${L}"/>`;
    if (mood === 'hungry')
      mouth = `${nose}<ellipse cx="0" cy="19" rx="6.5" ry="8" fill="#7A1F2B"${ST}/><ellipse cx="0" cy="23" rx="4" ry="3" fill="#FF8FA3"/>`;
    else if (mood === 'sad')
      mouth = `${nose}<path d="M-9 22 Q0 13 9 22" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"/>`;
    else if (mood === 'sleepy')
      mouth = `${nose}<ellipse cx="0" cy="18" rx="4" ry="3" fill="${L}"/>`;
    else
      mouth = `${nose}<path d="M-11 13 Q0 28 11 13 Q0 15 -11 13Z" fill="#7A1F2B" stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="0" cy="21" rx="5" ry="3" fill="#FF8FA3"/>${kind === 'dokkaebi' ? '<path d="M-8 14 l2.4 5 l2.6 -4.6Z M8 14 l-2.4 5 l-2.6 -4.6Z" fill="#fff"/>' : ''}`;
  }
  if (kind === 'tiger' || kind === 'bunny' || kind === 'fox')
    mouth += `<path d="M-48 3 L-64 -1 M-48 10 L-64 12 M48 3 L64 -1 M48 10 L64 12" stroke="${L}" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`;
  let acc = '';
  if (kind === 'tiger') acc = scarf('#E8503A');
  if (kind === 'bunny') acc = scarf('#4FC3F7');
  if (kind === 'fox') acc = scarf('#36CFC9');
  const zz =
    mood === 'sleepy'
      ? `<text x="58" y="-34" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="${L}">z</text><text x="72" y="-56" font-family="Fredoka, sans-serif" font-weight="700" font-size="17" fill="${L}">z</text>`
      : '';
  return `${defs}<ellipse cx="0" cy="62" rx="${kind === 'toad' ? 62 : 52}" ry="8" fill="#000" opacity=".16"/>${back}${s}${front}${eyes}${blush}${mouth}${acc}${zz}`;
}

/**
 * Embrulha uma criatura em um <svg> pronto para uso.
 * @param {number} w largura em pixels
 */
function creatureSvg(kind, w, mood) {
  return `<svg viewBox="-112 -120 224 196" width="${w}" role="img" aria-label="Bichinho">${creature(kind, mood || 'happy')}</svg>`;
}

export { creatureSvg, creature, spark };
