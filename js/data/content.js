/**
 * Conteúdo da cartilha. Os dados ficam em arquivos JSON (pasta data/) e são
 * carregados uma vez, na abertura do app.
 */
const load = async (file) => (await fetch(new URL(`../../data/${file}`, import.meta.url))).json();

const [petsData, unitsData, wordUnits, completeCards] = await Promise.all([
  load('pets.json'),
  load('units.json'),
  load('words.json'),
  load('cards-complete.json'),
]);

const PETS = petsData.pets;

const SAY = petsData.say;

const PAGES = unitsData.pages;

const TOTAL = unitsData.totals;

const SECRET_COST = unitsData.secretCost;

const UNITS = unitsData.units;

const WORD_UNITS = wordUnits;

const COMPLETE_CARDS = completeCards;

export { PETS, SAY, PAGES, TOTAL, UNITS, SECRET_COST, WORD_UNITS, COMPLETE_CARDS };
