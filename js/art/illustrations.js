/**
 * Ilustrações das cartas completas. Cada arquivo SVG de assets/illustrations/
 * vira um texto com o miolo do desenho, para ser usado dentro de um <svg>.
 */
const NAMES = ['nuvem', 'maca', 'escola', 'gato', 'trem', 'agua', 'comer', 'grande'];

const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const entries = await Promise.all(
  NAMES.map(async (name) => {
    const url = new URL(`../../assets/illustrations/${name}.svg`, import.meta.url);
    return [name, inner(await (await fetch(url)).text())];
  }),
);

const ILLUSTRATIONS = Object.fromEntries(entries);

export { ILLUSTRATIONS };
