/**
 * ha-printer-card behaviour tests.  Run with:  node test/run.mjs
 *
 * The card has three pieces of real logic, and all three fail silently:
 *   1. the raw-state → normalized state table, which has to survive a dozen
 *      integrations and a dozen languages;
 *   2. cartridge discovery: the card scopes sensors to the printer, and a
 *      scope that is too wide puts a neighbour's toner on the card;
 *   3. the low-cartridge threshold, whose whole job is to fire before the
 *      printer runs dry.
 * Plus the two classic Lovelace traps: an editor whose config-changed carries
 * no detail.config, and a picker echo that erases a configured entity.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadCard, markup, check, contains, report } from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const registry = await loadCard(join(HERE, '..', 'dist', 'ha-printer-card.js'));
const Card   = registry.get('ha-printer-card');
const Editor = registry.get('ha-printer-card-editor');

const URI = 'ipp://192.168.0.128:631/ipp/print,ipps://192.168.0.128:443/ipp/print';

function toner(level, extra = {}) {
  return {
    state: String(level),
    attributes: { unit_of_measurement: '%', marker_type: 'toner', marker_low_level: 3, ...extra },
    last_changed: '2026-09-02T10:00:00Z',
  };
}

function makeHass(printerState, states = {}, attrs = {}) {
  return {
    language: 'en',
    states: {
      'sensor.printer': {
        state: printerState,
        attributes: { friendly_name: 'HP LaserJet', uri_supported: URI, ...attrs },
        last_changed: '2026-09-02T10:00:00Z',
      },
      ...states,
    },
    callService() {},
  };
}

function render(printerState, cfg = {}, states = {}, attrs = {}) {
  const c = new Card();
  c.setConfig({ entity: 'sensor.printer', ...cfg });
  c.hass = makeHass(printerState, states, attrs);
  return markup(c);
}

const label = html => (String(html).match(/<div class="state">([^<]*)</) || [])[1];
const cardClass = html => (String(html).match(/<ha-card class="([^"]*)"/) || [])[1];
const COLORS_BLACK = 'fill="#26292e"';

// ── State normalization ──────────────────────────────────────────────────────
// IPP says idle/printing/stopped, Brother adds a sleep mode, and every panel
// is free to word it in the user's language.

check('idle', label(render('idle')), 'Ready');
check('printing', label(render('printing')), 'Printing…');
check('stopped', label(render('stopped')), 'Stopped');
check('unavailable devient offline', label(render('unavailable')), 'Offline');
check('unknown reste unknown', label(render('unknown')), 'Unknown state');
check('"Sleep mode" (Brother)', label(render('Sleep mode')), 'Sleep');
check('"Ready to print"', label(render('Ready to print')), 'Ready');
check('"Paper jam" -> arret', label(render('Paper jam')), 'Stopped');
check('"Cover open" -> arret', label(render('Cover open')), 'Stopped');
check('"Impression en cours" (fr)', label(render('Impression en cours')), 'Printing…');
check('"Bourrage papier" (fr)', label(render('Bourrage papier')), 'Stopped');
check('"Druckt" (de)', label(render('Druckt')), 'Printing…');
check('state_map a la priorite', label(render('weird', { state_map: { weird: 'sleep' } })), 'Sleep');
check('state_map vers une valeur inconnue -> unknown',
  label(render('weird', { state_map: { weird: 'banana' } })), 'Unknown state');
check('entite absente -> unknown', label(render(undefined, { entity: 'sensor.nope' })), 'Unknown state');

// The jammed sheet is the visual half of the stopped state.
contains('arret: feuille bloquee', render('stopped'), 'class="sheet jam"');
contains('arret: triangle d\'alerte', render('stopped'), 'class="warn"');
check('impression: pas de feuille bloquee', /sheet jam/.test(render('printing')), false);
check('classe de carte = etat normalise', cardClass(render('printing')), 'printing');

// ── The socket and the wattmeter override the poll ───────────────────────────

const plugOff = { 'switch.plug': { state: 'off', attributes: {} } };
const plugOn  = { 'switch.plug': { state: 'on', attributes: {} } };
check('prise coupee -> hors ligne',
  label(render('idle', { plug_entity: 'switch.plug' }, plugOff)), 'Offline');
check('prise allumee ne change rien',
  label(render('idle', { plug_entity: 'switch.plug' }, plugOn)), 'Ready');

const w = v => ({ 'sensor.w': { state: String(v), attributes: { unit_of_measurement: 'W' } } });
check('conso au-dessus du seuil -> impression',
  label(render('idle', { power_entity: 'sensor.w', printing_watts: 60 }, w(320))), 'Printing…');
check('conso sous le seuil -> etat inchange',
  label(render('idle', { power_entity: 'sensor.w', printing_watts: 60 }, w(10.6))), 'Ready');
check('sans printing_watts la conso ne decide rien',
  label(render('idle', { power_entity: 'sensor.w' }, w(320))), 'Ready');
check('printing_watts a 0 est desactive',
  label(render('idle', { power_entity: 'sensor.w', printing_watts: 0 }, w(320))), 'Ready');
check('la conso ne masque jamais un bourrage',
  label(render('stopped', { power_entity: 'sensor.w', printing_watts: 60 }, w(320))), 'Stopped');
check('la conso ne rallume pas une prise coupee',
  label(render('idle', { plug_entity: 'switch.plug', power_entity: 'sensor.w', printing_watts: 60 },
    { ...plugOff, ...w(320) })), 'Offline');
contains('watts affiches dans le coin',
  render('idle', { power_entity: 'sensor.w' }, w(10.64)), '10.6 W');
// A plug_entity left pointing at a deleted entity used to draw a crossed-out
// plug, which reads as "socket off" instead of "entity gone".
check('une prise introuvable ne dessine pas de prise barree',
  /class="corner/.test(render('idle', { plug_entity: 'switch.gone' })), false);
contains('prise coupee: prise barree dans le coin',
  render('idle', { plug_entity: 'switch.plug' }, plugOff), 'mdi:power-plug-off');
check('show_power: false masque le coin',
  /class="corner/.test(render('idle', { plug_entity: 'switch.plug', show_power: false }, plugOn)), false);

// ── Cartridge discovery ──────────────────────────────────────────────────────
// Scoped by device when the entity registry is reachable, by entity_id prefix
// otherwise. A scope that is too wide shows a neighbour's toner.

const TONERS = {
  'sensor.printer_yellow_cartridge_hp_cf402x':  toner(58),
  'sensor.printer_black_cartridge_hp_cf400x':   toner(34),
  'sensor.printer_magenta_cartridge_hp_cf403x': toner(49),
  'sensor.printer_cyan_cartridge_hp_cf401x':    toner(89),
  'sensor.other_printer_black_cartridge':       toner(7),
  'sensor.humidity':                            { state: '55', attributes: { unit_of_measurement: '%' } },
};
const auto = render('idle', {}, TONERS);
contains('cartouche noire detectee', auto, '34%');
contains('cartouche cyan detectee', auto, '89%');
contains('cartouche magenta detectee', auto, '49%');
contains('cartouche jaune detectee', auto, '58%');
check("l'imprimante voisine est exclue (prefixe)", /sensor\.other_printer/.test(auto), false);
check('un simple capteur en % est exclu', /sensor\.humidity/.test(auto), false);
check('4 cartouches, pas une de plus', (auto.match(/class="cart /g) || []).length, 4);

const order = [...auto.matchAll(/<span class="lbl">([^<]*)</g)].map(m => m[1]);
check('ordre KCMY', order.join(','), 'Black,Cyan,Magenta,Yellow');

// hass.entities exists from HA 2023.4 on: the device wins over the prefix, so
// a printer whose sensors are not named after it is still found.
const devHass = makeHass('idle', {
  'sensor.marker_1': toner(12, { friendly_name: 'Black ink' }),
  'sensor.elsewhere': toner(90, { friendly_name: 'Black ink' }),
});
devHass.entities = {
  'sensor.printer': { device_id: 'dev1' },
  'sensor.marker_1': { device_id: 'dev1' },
  'sensor.elsewhere': { device_id: 'dev2' },
};
const byDevice = new Card();
byDevice.setConfig({ entity: 'sensor.printer' });
byDevice.hass = devHass;
contains('registre: cartouche du bon appareil', markup(byDevice), '12%');
check("registre: cartouche d'un autre appareil exclue", /sensor\.elsewhere/.test(markup(byDevice)), false);

// An explicit list beats discovery, and carries its own label and colour.
const manual = render('idle', {
  cartridges: ['sensor.printer_black_cartridge_hp_cf400x', { entity: 'sensor.custom', name: 'Bac 5', color: 'cyan' }],
}, { ...TONERS, 'sensor.custom': { state: '77', attributes: {} } });
contains('liste explicite: libelle force', manual, 'Bac 5');
check('liste explicite: la detection auto est ignoree', (manual.match(/class="cart /g) || []).length, 2);

// ── Low-cartridge threshold ──────────────────────────────────────────────────
// marker_low_level is 3 % on this HP: waiting for it means waiting for the
// print to come out streaked. The card's own floor is 20 %.

const low = render('idle', {}, { 'sensor.printer_black_cartridge_hp_cf400x': toner(18) });
contains('sous 20 % -> alerte', low, 'Cartridge low');
contains("sous 20 % -> pastille sur la cartouche", low, 'class="lowdot"');
check('au-dessus de 20 % -> pas d\'alerte',
  /Cartridge low/.test(render('idle', {}, { 'sensor.printer_black_cartridge_hp_cf400x': toner(34) })), false);
check('un marker_low_level plus haut que 20 gagne',
  /Cartridge low/.test(render('idle', {}, {
    'sensor.printer_black_cartridge_hp_cf400x': toner(30, { marker_low_level: 40 }),
  })), true);
check('low_threshold explicite gagne sur tout',
  /Cartridge low/.test(render('idle', { low_threshold: 40 }, {
    'sensor.printer_black_cartridge_hp_cf400x': toner(34, { marker_low_level: 60 }),
  })), true);
check('low_threshold a 0 desactive l\'alerte',
  /Cartridge low/.test(render('idle', { low_threshold: 0 }, {
    'sensor.printer_black_cartridge_hp_cf400x': toner(2),
  })), false);
contains("l'alerte nomme la cartouche et son niveau", low, 'Black 18%');

// A percentage out of range must not draw outside the cartridge.
const clamped = render('idle', {}, { 'sensor.printer_black_cartridge_hp_cf400x': toner(140) });
check('niveau > 100 borne a 100', /height="34.0"/.test(clamped), true);
const negative = render('idle', {}, { 'sensor.printer_black_cartridge_hp_cf400x': toner(-5) });
check('niveau negatif borne a 0', /height="0.0"/.test(negative), true);
contains('niveau non numerique affiche ?',
  render('idle', {}, { 'sensor.printer_black_cartridge_hp_cf400x': toner('unknown') }), '>?%<');
check('show_supplies: false masque les cartouches',
  /class="cart /.test(render('idle', { show_supplies: false }, TONERS)), false);

// ── Status message ───────────────────────────────────────────────────────────

contains('state_message affiche',
  render('stopped', {}, {}, { state_message: 'Paper jam in tray 2' }), 'Paper jam in tray 2');
check('state_message null non affiche',
  /class="msg"/.test(render('idle', {}, {}, { state_message: null })), false);
check('state_message "none" non affiche',
  /class="msg"/.test(render('idle', {}, {}, { state_message: 'none' })), false);
check('show_message: false masque le message',
  /class="msg"/.test(render('stopped', { show_message: false }, {}, { state_message: 'Paper jam' })), false);

// Freeform text is device-supplied: it must never reach innerHTML unescaped.
const xss = render('idle', {}, {}, { friendly_name: '<img src=x onerror=alert(1)>' });
check('le nom est echappe', /<img src=x/.test(xss), false);
contains('le nom echappe est bien rendu', xss, '&lt;img src=x');

// ── Web interface ────────────────────────────────────────────────────────────

contains('web_url: auto derive l\'adresse de uri_supported',
  render('idle', { web_url: 'auto' }), 'href="http://192.168.0.128/"');
contains('web_url explicite',
  render('idle', { web_url: 'http://printer.lan/' }), 'href="http://printer.lan/"');
check('pas de bouton web sans web_url', /class="btn"/.test(render('idle')), false);
check('web_url: auto sans uri_supported ne produit pas de lien',
  /class="btn"/.test(render('idle', { web_url: 'auto' }, {}, { uri_supported: undefined })), false);

// ── Buttons ──────────────────────────────────────────────────────────────────

contains('bouton prise quand plug_entity est configure',
  render('idle', { plug_entity: 'switch.plug' }, plugOn), 'data-action="plug"');
check('pas de bouton prise sans plug_entity',
  /data-action="plug"/.test(render('idle')), false);
contains('bouton test quand print_entity est configure',
  render('idle', { print_entity: 'script.test_print' }), 'data-action="print"');

// The service actually called decides whether the button does anything.
let called = null;
const btnCard = new Card();
btnCard.setConfig({ entity: 'sensor.printer', print_entity: 'script.test_print', plug_entity: 'switch.plug' });
btnCard.hass = { ...makeHass('idle', plugOn), callService: (d, s, data) => { called = [d, s, data.entity_id]; } };
btnCard._print();
check('print_entity script -> script.turn_on', called.join(' '), 'script turn_on script.test_print');
btnCard._togglePlug();
check('plug_entity -> homeassistant.toggle', called.join(' '), 'homeassistant toggle switch.plug');

// ── Language pinning ─────────────────────────────────────────────────────────

check('la carte suit Home Assistant par defaut', label(render('printing')), 'Printing…');
check('language: fr force le francais', label(render('printing', { language: 'fr' })), 'Impression…');
check('language: auto suit Home Assistant', label(render('printing', { language: 'auto' })), 'Printing…');
check('une langue inconnue retombe sur Home Assistant',
  label(render('printing', { language: 'xx' })), 'Printing…');
check('cartouches traduites', /<span class="lbl">Noir</.test(
  render('idle', { language: 'fr' }, TONERS)), true);

// ── Compact mode ─────────────────────────────────────────────────────────────

const compact = render('printing', { compact: true }, TONERS);
contains('compact: badge au lieu de l\'illustration', compact, 'class="badge"');
check('compact: pas d\'illustration', /class="illu"/.test(compact), false);
contains('compact: cartouches en barres', compact, 'class="supplies bars"');
// The socket chip is pinned over the illustration, which compact mode does not
// have: pinned there it landed on top of the buttons. It joins the flow instead.
const compactPower = render('printing', { compact: true, plug_entity: 'switch.plug', power_entity: 'sensor.w' },
  { ...plugOn, ...w(318) });
check('compact: la prise n\'est plus en position absolue',
  /ha-card.compact .corner \{ position:static/.test(compactPower), true);
check('compact: la prise est dans la ligne, avant les boutons',
  compactPower.indexOf('class="corner') < compactPower.indexOf('class="actions"'), true);
check('compact: la prise est apres le texte, pas devant lui',
  compactPower.indexOf('class="body"') < compactPower.indexOf('class="corner'), true);
const fullPower = render('printing', { plug_entity: 'switch.plug', power_entity: 'sensor.w' }, { ...plugOn, ...w(318) });
check('en pleine carte la prise reste epinglee au coin',
  fullPower.indexOf('class="corner') < fullPower.indexOf('class="top"'), true);
contains('compact: les watts sont bien affiches', compactPower, '318 W');
// A flex child with min-width:0 collapses to nothing on an over-full row and
// its text then paints over its neighbours, which is how the socket chip ended
// up under the name. Compact truncates instead, and drops the button labels.
contains('compact: le nom est tronque plutot que deborder', compactPower,
  'ha-card.compact .name, ha-card.compact .state, ha-card.compact .msg {');
contains('compact: la ligne peut passer a la ligne en dernier recours', compactPower,
  'ha-card.compact .bottom { flex-wrap:wrap;');
contains('compact: les libelles de boutons sont masques', compactPower,
  'ha-card.compact button span, ha-card.compact .btn span { display:none; }');
// Icon-only buttons still have to say what they do.
contains('les boutons portent leur libelle en infobulle', compactPower, 'title="Off"');
contains('le lien web aussi', render('idle', { web_url: 'auto' }), 'title="Web"');

// A printer sits idle for days and never prints for hours: the state's age was
// noise, and it was hidden on the one state where it would have meant something.
check('plus de ligne de duree', /class="since"/.test(render('idle')), false);
check('plus de duree non plus en impression', /class="since"/.test(render('printing')), false);
// ── The four models ──────────────────────────────────────────────────────────
// Each machine is told apart by where the page comes out, and that is carried
// by --pc-hidden: negative, the page drops out over the front; positive, it
// rises out of the roof.

const hidden = html => (String(html).match(/style="--pc-hidden:(-?\d+)px"/) || [])[1];

contains('mfp: capot de scanner', render('idle'), 'x="24" y="4"');
check('mfp: la page tombe vers l\'avant', hidden(render('idle')), '-56');
contains('jet d\'encre: pile de papier a l\'arriere',
  render('idle', { printer_type: 'inkjet' }), 'class="paper-stack"');
check('jet d\'encre: la page sort par l\'avant',
  hidden(render('idle', { printer_type: 'inkjet' })), '-44');
contains('laser: bac de sortie creuse dans le dessus',
  render('idle', { printer_type: 'laser' }), '<rect class="recess" x="44" y="34"');
check('laser: la page monte par le dessus',
  hidden(render('idle', { printer_type: 'laser' })), '56');
contains('bureau: chargeur de documents',
  render('idle', { printer_type: 'office' }), 'x="56" y="2"');
check('bureau: la page tombe dans la baie',
  hidden(render('idle', { printer_type: 'office' })), '-52');
check('un modele inconnu retombe sur le multifonction',
  hidden(render('idle', { printer_type: 'banana' })), '-56');
check('une seule zone de decoupe par carte',
  (render('idle', { printer_type: 'office' }).match(/<clipPath/g) || []).length, 1);
check('chaque modele dessine un ecran de commande',
  ['mfp', 'inkjet', 'laser', 'office']
    .every(m => /class="led"/.test(render('idle', { printer_type: m }))), true);
check('chaque modele signale le bourrage',
  ['mfp', 'inkjet', 'laser', 'office']
    .every(m => /class="warn"/.test(render('stopped', { printer_type: m }))), true);

// ── Cartridges drawn inside the machine ──────────────────────────────────────
// The point of this layout is that the card gets shorter: the row below the
// illustration goes away and the levels move into the machine, where they
// must never land on the page, the panel or the jam warning.

const insideCfg = { cartridge_style: 'inside' };
const ins = render('idle', insideCfg, TONERS);
check('dans l\'imprimante: plus de rangee sous l\'illustration',
  /class="supplies/.test(ins), false);
check('dans l\'imprimante: 4 cartouches dessinees dans la machine',
  (ins.match(/<g class="ink[ "]/g) || []).length, 4);
contains('dans l\'imprimante: encre noire dessinee', ins, COLORS_BLACK);
// 34 % of the 43 units of usable height inside a 48-unit bay.
check('dans l\'imprimante: le niveau est bien traduit en hauteur',
  /height="14.6" rx="2" fill="#26292e"/.test(ins), true);
contains('dans l\'imprimante: une infobulle nomme la cartouche et son niveau',
  ins, '<title>Black 34%</title>');
check('une cartouche basse est cerclee de rouge',
  /<g class="ink low"/.test(render('idle', insideCfg, { 'sensor.printer_black_cartridge_hp_cf400x': toner(8) })), true);
check('l\'alerte cartouche basse reste affichee',
  /Cartridge low/.test(render('idle', insideCfg, { 'sensor.printer_black_cartridge_hp_cf400x': toner(8) })), true);
check('compact reste en barres, il n\'a pas d\'illustration',
  /class="supplies bars"/.test(render('idle', { ...insideCfg, compact: true }, TONERS)), true);
check('les autres styles ne dessinent rien dans la machine',
  /<g class="ink[ "]/.test(render('idle', {}, TONERS)), false);
check('getCardSize raccourcit avec les cartouches dans la machine',
  (() => { const c = new Card(); c.setConfig({ entity: 'sensor.printer', ...insideCfg }); return c.getCardSize(); })(), 3);
// The bay is model-specific: every machine must draw all four somewhere.
check('les 4 modeles logent les cartouches',
  ['mfp', 'inkjet', 'laser', 'office']
    .every(m => (render('idle', { ...insideCfg, printer_type: m }, TONERS).match(/<g class="ink[ "]/g) || []).length === 4),
  true);
// A jam moves its warning out of the bay rather than on top of it.
for (const m of ['mfp', 'inkjet', 'laser', 'office']) {
  const html = render('stopped', { ...insideCfg, printer_type: m }, TONERS);
  const warn = (html.match(/class="warn" transform="translate\((\d+),(\d+)\)/) || []).slice(1).map(Number);
  const bay = (html.match(/<rect class="ink-track" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/) || []).slice(1).map(Number);
  const overlaps = warn[0] + 11 > bay[0] && warn[0] - 11 < bay[0] + 30 && warn[1] + 8 > bay[1] && warn[1] - 11 < bay[1] + bay[3];
  check(`${m}: le triangle de bourrage ne recouvre pas les cartouches`, overlaps, false);
}

// ── The rear paper tray (inkjet) ─────────────────────────────────────────────
// The stack stands in front of the support that holds it up, and goes away
// when the printer says the tray is empty.

const inkjetPaper = html => {
  const plate = html.indexOf('d="M60 52 L140 52 L132 18 L68 18 Z"');
  const stack = html.indexOf('class="paper-stack"');
  return { plate, stack };
};
const withPaper = inkjetPaper(render('idle', { printer_type: 'inkjet' }));
check('la pile de papier est dessinee', withPaper.stack > -1, true);
check('la pile est devant son support, pas derriere',
  withPaper.stack > withPaper.plate, true);
check('bac vide (state_reason IPP): plus de pile',
  /class="paper-stack"/.test(
    render('stopped', { printer_type: 'inkjet' }, {}, { state_reason: 'media-empty' })), false);
check('bac vide (message du panneau): plus de pile',
  /class="paper-stack"/.test(
    render('stopped', { printer_type: 'inkjet' }, {}, { state_message: 'Plus de papier dans le bac 1' })), false);
check('bac vide en anglais',
  /class="paper-stack"/.test(
    render('stopped', { printer_type: 'inkjet' }, {}, { state_message: 'Out of paper' })), false);
// media-jam is not media-empty: a jammed printer still has paper in the tray.
check('un bourrage ne vide pas le bac',
  /class="paper-stack"/.test(
    render('stopped', { printer_type: 'inkjet' }, {}, { state_reason: 'media-jam' })), true);
check('le support reste dessine quand le bac est vide',
  /d="M60 52 L140 52 L132 18 L68 18 Z"/.test(
    render('stopped', { printer_type: 'inkjet' }, {}, { state_reason: 'media-empty' })), true);
check('les autres modeles ne dessinent pas de pile arriere',
  /class="paper-stack"/.test(render('idle', { printer_type: 'laser' })), false);
// The tray emptying must survive the render guard, it is not part of the state.
const trayGuard = new Card();
trayGuard.setConfig({ entity: 'sensor.printer', printer_type: 'inkjet' });
trayGuard.hass = makeHass('stopped', {}, { state_message: 'Cover open' });
check('bac plein au depart', /class="paper-stack"/.test(markup(trayGuard)), true);
trayGuard.hass = makeHass('stopped', {}, { state_message: 'Out of paper' });
check('le bac qui se vide declenche bien un nouveau rendu',
  /class="paper-stack"/.test(markup(trayGuard)), false);

// ── Rendering guard ──────────────────────────────────────────────────────────
// The card skips a re-render when nothing it shows has changed. A guard that
// is too coarse freezes the levels on screen.

const guard = new Card();
guard.setConfig({ entity: 'sensor.printer' });
guard.hass = makeHass('idle', { 'sensor.printer_black_cartridge_hp_cf400x': toner(34) });
contains('niveau initial', markup(guard), '34%');
guard.hass = makeHass('idle', { 'sensor.printer_black_cartridge_hp_cf400x': toner(33) });
contains('un niveau qui bouge est bien re-rendu', markup(guard), '33%');
guard.hass = makeHass('printing', { 'sensor.printer_black_cartridge_hp_cf400x': toner(33) });
check("un etat qui change est bien re-rendu", label(markup(guard)), 'Printing…');

// ── Editor contract ──────────────────────────────────────────────────────────
// CustomEvent.detail is a readonly accessor: assigning it after construction
// silently drops the payload and every edit made in the editor is discarded.

const ed = new Editor();
ed.setConfig({ entity: 'sensor.printer' });
ed._emit();
const ev = ed.events.at(-1);
check("l'editeur emet config-changed", ev?.type, 'config-changed');
check('config-changed porte bien detail.config', ev?.detail?.config?.entity, 'sensor.printer');

// HA calls setConfig again after every config-changed the editor emits. If
// that echo rebuilt the form, a freshly created ha-entity-picker could fire
// an empty value-changed and silently erase a configured entity.
ed.hass = makeHass('idle');
const builds = ed._built;
ed.setConfig({ entity: 'sensor.printer' });
check('le re-echo de setConfig ne reconstruit pas le formulaire', ed._built, builds);
check('un pick vide avant toute interaction est ignore',
  ed._acceptsPick('sensor.printer', ''), false);
check("l'echo de la valeur deja detenue est ignore",
  ed._acceptsPick('sensor.printer', 'sensor.printer'), false);
check('un vrai changement est accepte',
  ed._acceptsPick('sensor.printer', 'sensor.autre'), true);
ed._touched = true;
check('un effacement volontaire est accepte apres interaction',
  ed._acceptsPick('sensor.printer', ''), true);

// Defaults are not written to YAML, so the config stays as short as the
// choices actually made.
const ed2 = new Editor();
ed2.setConfig({ entity: 'sensor.printer' });
ed2.hass = makeHass('idle');
ed2._set('printer_type', undefined);
check('une valeur par defaut est retiree de la config',
  'printer_type' in ed2.events.at(-1).detail.config, false);
ed2._set('printer_type', 'printer');
check('une valeur non par defaut est ecrite',
  ed2.events.at(-1).detail.config.printer_type, 'printer');
ed2._set('low_threshold', 0);
check('un zero explicite est conserve (et non traite comme vide)',
  ed2.events.at(-1).detail.config.low_threshold, 0);

// ── Config guards ────────────────────────────────────────────────────────────

let threw = false;
try { new Card().setConfig({}); } catch (e) { threw = true; }
check('setConfig sans entity leve une erreur', threw, true);
check('getCardSize', new (class { })() instanceof Object, true);
const sized = new Card();
sized.setConfig({ entity: 'sensor.printer' });
check('getCardSize plein', sized.getCardSize(), 4);
sized.setConfig({ entity: 'sensor.printer', compact: true });
check('getCardSize compact', sized.getCardSize(), 2);

const stub = Card.getStubConfig(makeHass('idle', TONERS));
check('getStubConfig trouve l\'imprimante', stub.entity, 'sensor.printer');
check('getStubConfig annonce le bon type', stub.type, 'custom:ha-printer-card');

// A card whose hass has not arrived yet must not throw.
const bare = new Card();
bare.setConfig({ entity: 'sensor.printer' });
check('pas de rendu sans hass', markup(bare), '');

report();
