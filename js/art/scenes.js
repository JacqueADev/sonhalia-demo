/** Cenas ilustradas da história de abertura. */

import { creature, spark } from './creatures.js';
import { OUT } from '../core/constants.js';
import { seededRandom } from '../core/util.js';

/** Coloca uma criatura em uma cena, com posição e escala. */
function placeCreature(kind, x, y, sc, mood) {
  return `<g transform="translate(${x} ${y}) scale(${sc})">${creature(kind, mood || 'happy')}</g>`;
}

/** Balão de fala com texto curto. */
function bubble(x, y, w, text) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="38" rx="16" fill="#fff" stroke="${OUT}" stroke-width="3"/><path d="M${x + w / 2 - 8} ${y + 37} l8 14 l8 -14Z" fill="#fff" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><rect x="${x + w / 2 - 10}" y="${y + 34}" width="20" height="6" fill="#fff"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-family="Noto Sans KR, sans-serif" font-weight="700" font-size="17" fill="${OUT}">${text}</text></g>`;
}

/**
 * Cena ilustrada da história de abertura.
 * @param {number} n índice da cena, de 0 a 4
 */
function scene(n) {
  let h = '<svg viewBox="0 0 800 400" role="img" aria-label="Ilustração da história">';
  let k;
  if (n === 0) {
    h += '<rect width="800" height="400" fill="#1E2A5C"/>';
    for (k = 0; k < 28; k++)
      h += `<circle cx="${(seededRandom(k * 1.7) * 800).toFixed(0)}" cy="${(seededRandom(k * 4.3) * 200).toFixed(0)}" r="${(1 + seededRandom(k) * 2).toFixed(1)}" fill="#fff" opacity=".75"/>`;
    h += `<rect y="290" width="800" height="110" fill="#3A2F5E"/><rect x="80" y="40" width="230" height="200" rx="14" fill="#0F1A44" stroke="${OUT}" stroke-width="5"/><circle cx="195" cy="140" r="58" fill="#FFF3B8"/><circle cx="178" cy="122" r="11" fill="#F0DE96"/><circle cx="216" cy="156" r="15" fill="#F0DE96"/><circle cx="226" cy="116" r="7" fill="#F0DE96"/><path d="M195 40 V240 M80 140 H310" stroke="${OUT}" stroke-width="5"/>`;
    h += `<rect x="370" y="236" width="360" height="96" rx="16" fill="#7A5AC8" stroke="${OUT}" stroke-width="4"/><ellipse cx="430" cy="236" rx="52" ry="20" fill="#fff" stroke="${OUT}" stroke-width="4"/>`;
    h += `<path d="M410 250 Q500 170 600 236 L718 244 L718 318 L410 318Z" fill="#FF80B5" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
    h += `<circle cx="540" cy="204" r="64" fill="#FFE070" opacity=".35"/><rect x="498" y="190" width="84" height="52" rx="5" fill="#C2422F" stroke="${OUT}" stroke-width="4"/><rect x="504" y="196" width="34" height="40" fill="#FFF8DC"/><rect x="542" y="196" width="34" height="40" fill="#FFF8DC"/><path d="M510 206 h22 M510 214 h22 M510 222 h22 M548 206 h22 M548 214 h22 M548 222 h22" stroke="#C4B48A" stroke-width="2.5"/>`;
  }
  if (n === 1) {
    h +=
      '<rect width="800" height="400" fill="#E9EDF3"/><circle cx="630" cy="90" r="46" fill="#F7F7FA"/><path d="M0 250 Q160 170 320 240 T640 220 T800 250 V400 H0Z" fill="#CBD2DB" stroke="#9AA4B3" stroke-width="3"/><path d="M0 300 Q200 250 400 300 T800 290 V400 H0Z" fill="#B9C1CC" stroke="#9AA4B3" stroke-width="3"/>';
    for (k = 0; k < 14; k++) {
      let fx = 40 + seededRandom(k * 3.3) * 720;
      let fy = 310 + seededRandom(k * 5.1) * 70;
      h += `<g transform="translate(${fx.toFixed(0)} ${fy.toFixed(0)})"><path d="M0 0 V14" stroke="#9AA4B3" stroke-width="3"/><circle r="7" fill="#D8DEE6" stroke="#9AA4B3" stroke-width="2.5"/></g>`;
    }
    h +=
      '<ellipse cx="400" cy="330" rx="130" ry="30" fill="#8FE08A" opacity=".55"/><ellipse cx="400" cy="330" rx="80" ry="18" fill="#B9F27C" opacity=".7"/>';
    h += `<circle cx="400" cy="270" r="92" fill="#FFE070" opacity=".35"/><g transform="translate(400 288) rotate(-4)"><rect x="-60" y="-40" width="120" height="76" rx="6" fill="#C2422F" stroke="${OUT}" stroke-width="4"/><rect x="-54" y="-34" width="50" height="64" fill="#FFF8DC"/><rect x="4" y="-34" width="50" height="64" fill="#FFF8DC"/><path d="M-48 -22 h38 M-48 -12 h38 M-48 -2 h38 M10 -22 h38 M10 -12 h38 M10 -2 h38" stroke="#C4B48A" stroke-width="3"/></g>`;
    h += spark(330, 200, 8) + spark(470, 190, 9) + spark(520, 250, 6) + spark(290, 262, 6, '#fff');
    h += `<g transform="rotate(-6 170 250)"><rect x="140" y="226" width="150" height="50" rx="6" fill="#C9A06E" stroke="${OUT}" stroke-width="4"/><text x="215" y="260" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="26" fill="${OUT}">Sonhália</text><rect x="208" y="276" width="14" height="60" fill="#8A5A30" stroke="${OUT}" stroke-width="3"/></g>`;
  }
  if (n === 2) {
    h +=
      '<rect width="800" height="400" fill="#E2E7EE"/><path d="M0 280 Q200 220 400 270 T800 260 V400 H0Z" fill="#BFC7D2" stroke="#98A2B1" stroke-width="3"/>';
    [
      [90, 150, 1],
      [700, 160, 1.1],
      [350, 120, 0.9],
    ].forEach((b) => {
      h += `<g transform="translate(${b[0]} ${b[1]}) scale(${b[2]})"><rect x="-52" y="0" width="104" height="70" fill="#D2D8E1" stroke="#98A2B1" stroke-width="3"/><path d="M-66 0 Q-40 -16 -30 -30 L30 -30 Q40 -16 66 0Z" fill="#9AA4B3" stroke="#7F8998" stroke-width="3"/><rect x="-14" y="26" width="28" height="44" fill="#B9C1CC"/></g>`;
    });
    h += `<g style="filter:grayscale(1) brightness(1.08)" opacity=".92"><g transform="translate(140 300) scale(.55)">${creature('dokkaebi', 'sad')}</g><g transform="translate(400 322) scale(.55)">${creature('haetae', 'sad')}</g><g transform="translate(660 300) scale(.55)">${creature('magpie', 'sad')}</g></g>`;
    h +=
      bubble(75, 170, 130, '안녕하세요?') +
      bubble(340, 196, 120, '…??') +
      bubble(590, 170, 140, '저기요…?');
    h +=
      '<g fill="#fff" opacity=".6"><ellipse cx="200" cy="378" rx="150" ry="22"/><ellipse cx="560" cy="386" rx="170" ry="20"/></g>';
  }
  if (n === 3) {
    h +=
      '<defs><radialGradient id="stg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".5" stop-color="#FFD66B" stop-opacity=".7"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient></defs><rect width="800" height="400" fill="#FFF3D6"/><rect y="310" width="800" height="90" fill="#CFE9B8"/><circle cx="400" cy="200" r="200" fill="url(#stg)"/>';
    h += `<g opacity=".5">${placeCreature('tiger', 160, 290, 0.55)}${placeCreature('fox', 640, 292, 0.55)}</g>`;
    h += placeCreature('bunny', 400, 300, 1.05);
    h += `<rect x="330" y="340" width="140" height="24" rx="6" fill="#C2422F" stroke="${OUT}" stroke-width="4"/>`;
    h +=
      spark(300, 130, 10) +
      spark(520, 120, 12) +
      spark(250, 230, 7, '#fff') +
      spark(560, 230, 8, '#fff') +
      spark(400, 60, 9);
  }
  if (n === 4) {
    h +=
      '<rect width="800" height="400" fill="#F1F6E4"/><path d="M0 290 Q220 230 420 280 T800 260 V400 H0Z" fill="#C9E9A8" stroke="#8FB574" stroke-width="3"/>';
    h +=
      '<ellipse cx="90" cy="340" rx="70" ry="16" fill="#8FE08A" opacity=".7"/><ellipse cx="560" cy="350" rx="60" ry="14" fill="#FF9BC4" opacity=".6"/>';
    h += `<g transform="translate(250 50) rotate(-3)"><rect x="0" y="0" width="240" height="290" rx="10" fill="#FFF3D6" stroke="${OUT}" stroke-width="4"/>`;
    [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
      h += `<rect x="28" y="${40 + i * 26}" width="${i === 6 ? 90 : 184}" height="9" rx="4" fill="#C9B88A"/>`;
    });
    h += `<circle cx="190" cy="250" r="26" fill="#E8503A" stroke="${OUT}" stroke-width="3.5"/><path d="M180 250 l8 8 l14 -16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    h +=
      '<path d="M610 350 Q600 280 660 282 Q690 260 722 286 Q760 290 754 350Z" fill="#7C7A94" stroke="#2B2940" stroke-width="3.5" stroke-linejoin="round"/>';
    h +=
      '<ellipse cx="670" cy="306" rx="12" ry="6" fill="#FFE15A" class="tw"/><ellipse cx="708" cy="306" rx="12" ry="6" fill="#FFE15A" class="tw"/><circle cx="670" cy="306" r="2.4" fill="#120F26"/><circle cx="708" cy="306" r="2.4" fill="#120F26"/>';
    h += placeCreature('fox', 120, 316, 0.6);
  }
  return `${h}</svg>`;
}

export { scene };
