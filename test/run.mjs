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
import { readFile } from 'node:fs/promises';
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

// ── Supplies across integrations ─────────────────────────────────────────────
// The IPP integration tags its sensors with marker_type. Nobody else does:
// Brother, Samsung, Epson and Dell just publish percentages. The card has to
// pick those up without hoovering up the Wi-Fi diagnostics sitting on the
// same device.

const pct = (v, name, extra = {}) => ({
  state: String(v),
  attributes: { unit_of_measurement: '%', friendly_name: name, ...extra },
  last_changed: '2026-09-02T10:00:00Z',
});

// Renders with an entity registry, so the scope is the device and not the id.
function renderDev(printerState, cfg, states, attrs = {}) {
  const c = new Card();
  c.setConfig({ entity: 'sensor.printer', ...cfg });
  const hass = makeHass(printerState, states, attrs);
  hass.entities = Object.fromEntries(Object.keys(hass.states).map((id) => [id, { device_id: 'dev1' }]));
  c.hass = hass;
  return markup(c);
}

const BROTHER = {
  'sensor.printer_black_toner_remaining': pct(64, 'HL-L8360 Black toner remaining'),
  'sensor.printer_cyan_toner_remaining': pct(80, 'HL-L8360 Cyan toner remaining'),
  'sensor.printer_drum_remaining_life': pct(52, 'HL-L8360 Drum remaining lifetime'),
  'sensor.printer_fuser_remaining_life': pct(74, 'HL-L8360 Fuser remaining lifetime'),
  'sensor.printer_belt_unit_remaining_life': pct(88, 'HL-L8360 Belt unit remaining lifetime'),
  'sensor.printer_pf_kit_1_remaining_life': pct(91, 'HL-L8360 PF Kit 1 remaining lifetime'),
};
const brother = renderDev('idle', {}, BROTHER, { friendly_name: 'HL-L8360 Status' });
check('Brother: 2 toners en cartouches', (brother.match(/class="cart /g) || []).length, 2);
check('Brother: 4 pieces d\'usure en pastilles', (brother.match(/class="part /g) || []).length, 4);
contains('Brother: le tambour est reconnu', brother, 'Drum');
contains('Brother: le four est reconnu', brother, 'Fuser');
const partNames = html => [...String(html).matchAll(/<span class="pname">([^<]*)</g)].map(m => m[1]);
check('le nom de l\'imprimante est retire du libelle',
  partNames(brother).some(n => n.includes('HL-L8360')), false);
check('le qualificatif de fin est retire',
  partNames(brother).some(n => /remaining/i.test(n)), false);
check('les libelles de pieces sont propres',
  partNames(brother).join(','), 'Drum,Fuser,Belt unit,PF Kit 1');
// The tooltip keeps the full name the integration gave it.
contains('le nom complet reste en infobulle', brother, 'title="HL-L8360 Drum remaining lifetime"');

// The title comes from the device, not from the status entity: a Brother's
// status sensor is called "HL-L8360CDW Status", which is a poor card title.
const withDevice = (() => {
  const c = new Card();
  c.setConfig({ entity: 'sensor.printer' });
  const hass = makeHass('idle', BROTHER, { friendly_name: 'HL-L8360CDW Status' });
  hass.entities = Object.fromEntries(Object.keys(hass.states).map((id) => [id, { device_id: 'dev1' }]));
  hass.devices = { dev1: { name: 'HL-L8360CDW', name_by_user: null } };
  c.hass = hass;
  return markup(c);
})();
contains('le titre vient du nom de l\'appareil', withDevice, '<div class="name">HL-L8360CDW</div>');
check('le suffixe du capteur d\'etat ne finit pas dans le titre',
  /HL-L8360CDW Status<\/div>/.test(withDevice), false);
contains('sans registre d\'appareils on retombe sur le nom convivial',
  renderDev('idle', {}, BROTHER, { friendly_name: 'HL-L8360CDW Status' }), 'HL-L8360CDW Status</div>');
contains('un nom configure gagne sur tout',
  render('idle', { name: 'Imprimante du bureau' }), 'Imprimante du bureau');

const SYNCTHRU = {
  'sensor.printer_toner_black': pct(41, 'M2070 Toner black'),
  'sensor.printer_drum_black': pct(77, 'M2070 Drum black'),
};
const syncthru = renderDev('normal', {}, SYNCTHRU);
check('SyncThru: le toner est une cartouche', (syncthru.match(/class="cart /g) || []).length, 1);
check('SyncThru: le tambour est une piece', (syncthru.match(/class="part /g) || []).length, 1);
check('SyncThru "normal" est un etat pret', label(syncthru), 'Ready');

const EPSON = {
  'sensor.printer_ink_bk': pct(70, 'Ink level Black'),
  'sensor.printer_ink_lc': pct(55, 'Ink level Light Cyan'),
  'sensor.printer_clean': pct(35, 'Cleaning level'),
  'sensor.printer_signal_strength': pct(62, 'Signal Strength'),
};
const epson = renderDev('idle', {}, EPSON);
check('Epson: 2 encres', (epson.match(/class="cart /g) || []).length, 2);
contains('Epson: le code court bk vaut noir', epson, '>Black<');
contains('Epson: le code court lc vaut cyan clair', epson, '>Light cyan<');
check('Epson: le recuperateur est une piece', (epson.match(/class="part /g) || []).length, 1);
check('la force du signal Wi-Fi n\'est pas un consommable',
  /Signal Strength/.test(epson), false);

// Dell names its toners after the colour and nothing else.
const dell = renderDev('idle', {}, {
  'sensor.printer_black': pct(30, 'Dell C1765 Black'),
  'sensor.printer_cyan': pct(60, 'Dell C1765 Cyan'),
});
check('Dell: des noms de couleur nus suffisent', (dell.match(/class="cart /g) || []).length, 2);

// Without the entity registry the scope falls back to the id prefix, and the
// deny list still has to hold.
const noReg = render('idle', {}, {
  'sensor.printer_black_toner_remaining': pct(64, 'Black toner remaining'),
  'sensor.printer_wifi_signal': pct(70, 'Wifi signal'),
  'sensor.autre_black_toner_remaining': pct(10, 'Black toner remaining'),
});
check('sans registre: prefixe respecte', (noReg.match(/class="cart /g) || []).length, 1);
check('sans registre: la deny list tient', /Wifi signal/.test(noReg), false);

// ── A printer split across many devices (HP) ─────────────────────────────────
// The HP integration makes eight devices out of one machine: the printer, one
// per toner, plus Printer, Scanner and Copy sub-units. Only the sub-units are
// linked by via_device_id; the toners are named after the machine and nothing
// else ties them to it.

const HP_SEED = 'HP Color LaserJet MFP M277dw (192.168.0.128)';
const HP_DEVICES = {
  main: { name: HP_SEED, via_device_id: null },
  black: { name: `${HP_SEED} Black Toner`, via_device_id: null },
  cyan: { name: `${HP_SEED} Cyan Toner`, via_device_id: null },
  magenta: { name: `${HP_SEED} Magenta Toner`, via_device_id: null },
  yellow: { name: `${HP_SEED} Yellow Toner`, via_device_id: null },
  printer: { name: `${HP_SEED} Printer`, via_device_id: 'main' },
  scanner: { name: `${HP_SEED} Scanner`, via_device_id: 'main' },
  copy: { name: `${HP_SEED} Copy`, via_device_id: 'main' },
};
const pages = (v, n) => ({ state: String(v), attributes: { unit_of_measurement: 'pages', friendly_name: n } });
const HP_STATES = {
  'sensor.hp_statut': { state: 'inpowersave', attributes: { friendly_name: `${HP_SEED} Statut` }, last_changed: '2026-09-02T10:00:00Z' },
  'sensor.hp_black_niveau': pct(30, `${HP_SEED} Black Toner Niveau`),
  'sensor.hp_cyan_niveau': pct(90, `${HP_SEED} Cyan Toner Niveau`),
  'sensor.hp_magenta_niveau': pct(50, `${HP_SEED} Magenta Toner Niveau`),
  'sensor.hp_yellow_niveau': pct(60, `${HP_SEED} Yellow Toner Niveau`),
  'sensor.hp_black_restant': pages(700, `${HP_SEED} Black Toner Restant`),
  'sensor.hp_printer_bw': pages(2800, `${HP_SEED} Printer Total pages en noir et blanc`),
  'sensor.hp_printer_color': pages(12223, `${HP_SEED} Printer Total pages couleur`),
  'sensor.hp_printer_jams': pages(14, `${HP_SEED} Printer Total bourrages entrants`),
  'sensor.hp_scanner_glass': pages(500, `${HP_SEED} Scanner Total pages de la vitre du scanner`),
  'sensor.hp_scanner_jams': pages(0, `${HP_SEED} Scanner Total bourrages`),
  'sensor.hp_copy_adf': pages(164, `${HP_SEED} Copy Pages totales de l'ADF`),
  'sensor.hp_copy_glass': pages(397, `${HP_SEED} Copy Total pages de la vitre du scanner`),
  'sensor.hp_copy_bw': pages(387, `${HP_SEED} Copy Total pages en noir et blanc`),
  'sensor.hp_copy_color': pages(315, `${HP_SEED} Copy Total pages couleur`),
};
const HP_ENTITY_DEVICE = {
  'sensor.hp_statut': 'main',
  'sensor.hp_black_niveau': 'black', 'sensor.hp_black_restant': 'black',
  'sensor.hp_cyan_niveau': 'cyan', 'sensor.hp_magenta_niveau': 'magenta', 'sensor.hp_yellow_niveau': 'yellow',
  'sensor.hp_printer_bw': 'printer', 'sensor.hp_printer_color': 'printer', 'sensor.hp_printer_jams': 'printer',
  'sensor.hp_scanner_glass': 'scanner', 'sensor.hp_scanner_jams': 'scanner',
  'sensor.hp_copy_adf': 'copy', 'sensor.hp_copy_glass': 'copy', 'sensor.hp_copy_bw': 'copy', 'sensor.hp_copy_color': 'copy',
};

function renderHp(cfg = {}, extraStates = {}, extraDevices = {}, extraReg = {}) {
  const c = new Card();
  c.setConfig({ entity: 'sensor.hp_statut', language: 'en', ...cfg });
  c.hass = {
    language: 'en',
    states: { ...HP_STATES, ...extraStates },
    entities: Object.fromEntries([
      ...Object.entries(HP_ENTITY_DEVICE).map(([id, d]) => [id, { device_id: d }]),
      ...Object.entries(extraReg),
    ]),
    devices: { ...HP_DEVICES, ...extraDevices },
    callService() {},
  };
  return markup(c);
}

const hp = renderHp();
check('HP: les 4 toners sont trouves malgre 4 appareils distincts',
  (hp.match(/class="cart /g) || []).length, 4);
contains('HP: le noir', hp, '30%');
contains('HP: le cyan', hp, '90%');
check('HP: les pages restantes du toner ne sont pas une cartouche',
  /Toner Restant/.test(hp), false);
check('HP "inpowersave" est une mise en veille', label(hp), 'Sleep');
check('HP "copying"', label(renderHp({}, { 'sensor.hp_statut': { state: 'copying', attributes: {}, last_changed: '2026-09-02T10:00:00Z' } })), 'Printing…');
check('HP "scanprocessing"', label(renderHp({}, { 'sensor.hp_statut': { state: 'scanprocessing', attributes: {}, last_changed: '2026-09-02T10:00:00Z' } })), 'Printing…');
check('HP "canceljob"', label(renderHp({}, { 'sensor.hp_statut': { state: 'canceljob', attributes: {}, last_changed: '2026-09-02T10:00:00Z' } })), 'Printing…');
check('HP "ready"', label(renderHp({}, { 'sensor.hp_statut': { state: 'ready', attributes: {}, last_changed: '2026-09-02T10:00:00Z' } })), 'Ready');
check('HP "off"', label(renderHp({}, { 'sensor.hp_statut': { state: 'off', attributes: {}, last_changed: '2026-09-02T10:00:00Z' } })), 'Offline');

// Counters, one row per function.
const hpRows = [...hp.matchAll(/<div class="crow">([\s\S]*?)<\/div>/g)].map(m => m[1].replace(/\s+/g, ' ').trim());
check('HP: trois fonctions comptees', hpRows.length, 3);
contains('HP: impression', hpRows[0], 'Printed');
contains('HP: 2 800 pages N&B imprimees', hpRows[0], '<b>2,800</b> B&W');
contains('HP: 12 223 pages couleur', hpRows[0], '<b>12,223</b> colour');
contains('HP: numerisation', hpRows[1], 'Scanned');
contains('HP: 500 pages numerisees', hpRows[1], '<b>500</b> pages');
contains('HP: copie', hpRows[2], 'Copied');
contains('HP: copies N&B', hpRows[2], '<b>387</b> B&W');
// The copy unit counts the glass and the feeder separately: neither is a total.
check('HP: un "total" plus petit que sa propre ventilation est ecarte',
  /397|164/.test(hpRows[2]), false);
check('HP: la copie ne montre que ses deux ventilations',
  (hpRows[2].match(/<b>/g) || []).length, 2);
check('les bourrages ne sont pas des pages produites',
  hpRows.join(' ').includes('<b>14</b>') || hpRows.join(' ').includes('<b>0</b>'), false);

// A second machine named after the first must not be absorbed.
const rival = renderHp({}, { 'sensor.other_black': pct(5, `${HP_SEED} 2 Black Toner`) },
  { rival: { name: `${HP_SEED} 2`, via_device_id: null } }, { 'sensor.other_black': { device_id: 'rival' } });
check('un deuxieme appareil numerote n\'est pas absorbe',
  (rival.match(/class="cart /g) || []).length, 4);

// Two integrations on one printer report the same toners.
const doubled = renderHp({}, {
  'sensor.ipp_black': pct(34, 'HP Color LaserJet MFP M277dw Black Cartridge HP CF400X'),
}, {}, { 'sensor.ipp_black': { device_id: 'main' } });
check('deux integrations sur la meme imprimante: pas de doublon',
  (doubled.match(/class="cart /g) || []).length, 4);
contains('la source la plus proche gagne', doubled, '34%');
check('la source la plus lointaine est ecartee', /30%/.test(doubled), false);
// An explicit list is taken as given, doubles included: the user asked for it.
const explicit = renderHp({ cartridges: ['sensor.hp_black_niveau', 'sensor.ipp_black'] }, {
  'sensor.ipp_black': pct(34, 'HP Black Cartridge'),
}, {}, { 'sensor.ipp_black': { device_id: 'main' } });
check('une liste explicite n\'est pas dedupliquee',
  (explicit.match(/class="cart /g) || []).length, 2);

// ── An integration that describes its own supplies (SNMP) ────────────────────
// The SNMP integration publishes the colour, the full description and the
// type of every supply as attributes. Reading them beats guessing from a name.

const snmpSupply = (v, name, extra) => ({
  state: String(v),
  attributes: { unit_of_measurement: '%', friendly_name: name, ...extra },
  last_changed: '2026-09-02T10:00:00Z',
});
function renderSnmp(states, cfg = {}) {
  const c = new Card();
  c.setConfig({ entity: 'sensor.printer', ...cfg });
  const hass = makeHass('idle', states, { friendly_name: 'HP Color LaserJet MFP M277dw' });
  hass.entities = Object.fromEntries(Object.keys(hass.states).map((id) => [id, { device_id: 'dev1' }]));
  hass.devices = { dev1: { name: 'HP Color LaserJet MFP M277dw', via_device_id: null } };
  c.hass = hass;
  return markup(c);
}

const described = renderSnmp({
  'sensor.printer_noir': snmpSupply(34, 'HP Color LaserJet MFP M277dw Noir',
    { type: 'toner', color: 'Black', description: 'Black Cartridge HP CF400X', rgb_color: [0, 0, 0] }),
});
check('la description de l\'integration devient une cartouche',
  (described.match(/class="cart /g) || []).length, 1);
contains('elle est reconnue noire', described, 'fill="#26292e"');
contains('la description complete sert d\'infobulle', described, 'title="Black Cartridge HP CF400X"');
check('une couleur connue garde la palette de la carte, pas le rgb brut',
  /rgb\(0,0,0\)/.test(described), false);

// An exotic supply the card cannot name is better drawn in the shade the
// printer reports than in a default grey.
const exotic = renderSnmp({
  'sensor.printer_supply': snmpSupply(70, 'HP Color LaserJet MFP M277dw Supply',
    { type: 'toner', description: 'Gloss Enhancer', rgb_color: [120, 200, 90] }),
});
contains('une couleur inconnue prend le rgb du fabricant', exotic, 'fill="rgb(120,200,90)"');
const noRgb = renderSnmp({
  'sensor.printer_supply': snmpSupply(70, 'HP Color LaserJet MFP M277dw Supply', { type: 'toner', description: 'Gloss Enhancer' }),
});
contains('sans rgb on retombe sur le gris neutre', noRgb, `fill="#5b6470"`);

// A tray is a percentage on a printer and it is not a supply. The SNMP
// integration leaves it at unknown when the printer answers "at least one
// sheet" rather than a count, which would have drawn a blank cartridge.
const withTrays = renderSnmp({
  'sensor.printer_noir': snmpSupply(34, 'HP Color LaserJet MFP M277dw Noir',
    { type: 'toner', color: 'Black', description: 'Black Cartridge HP CF400X' }),
  'sensor.printer_bac_1': { state: 'unknown', attributes: { unit_of_measurement: '%', friendly_name: 'HP Color LaserJet MFP M277dw Bac 1', max_capacity: 1 } },
  'sensor.printer_bac_2': { state: 'unknown', attributes: { unit_of_measurement: '%', friendly_name: 'HP Color LaserJet MFP M277dw Bac 2', max_capacity: 150 } },
  'sensor.printer_etat_du_capot': { state: 'unknown', attributes: { friendly_name: 'HP Color LaserJet MFP M277dw Etat du capot' } },
});
check('les bacs ne deviennent pas des cartouches',
  (withTrays.match(/class="cart /g) || []).length, 1);
check('aucune cartouche sans niveau', /">\?%</.test(withTrays), false);
check('un capot sans etat ne devient pas un message',
  /class="msg"/.test(withTrays), false);

check('"online" est une imprimante disponible', label(render('online')), 'Ready');
check('"warming_up" est une imprimante qui travaille', label(render('warming_up')), 'Printing…');

// ── The printer's own words, in their own entities ───────────────────────────
// The SNMP integration gives the RFC 3805 error bits and the front panel text
// their own sensors rather than attributes.

const withErrors = (err, disp, cfg = {}) => renderSnmp({
  'sensor.printer_erreurs': { state: err, attributes: { friendly_name: 'HP Color LaserJet MFP M277dw Erreurs' } },
  'sensor.printer_affichage': { state: disp, attributes: { friendly_name: 'HP Color LaserJet MFP M277dw Affichage' } },
}, cfg);

contains('le capteur d\'erreurs est affiche', withErrors('jammed', 'Bourrage'), '>Jammed<');
check('une erreur de bourrage arrete l\'imprimante malgre un etat idle',
  label(withErrors('jammed', 'Pret')), 'Stopped');
check('"none" n\'est pas une erreur', /class="msg"/.test(withErrors('none', '')), false);
contains('sans erreur on affiche le panneau', withErrors('none', 'Mode veille active'), 'Mode veille active');
// The panel is chatty: it must not talk the printer out of its real state.
check('un panneau en veille ne change pas un etat pret',
  label(withErrors('none', 'Mode veille active')), 'Ready');
check('un panneau qui signale un toner bas leve un avertissement',
  label(withErrors('none', 'Toner low')), 'Attention needed');
// The panel says ordinary things most of the time. Red is for what earns it.
check('un message banal n\'est pas en rouge',
  /class="msg severe"/.test(withErrors('none', 'Mode veille active')), false);
check('un bourrage est en rouge',
  /class="msg severe"/.test(withErrors('jammed', 'Bourrage')), true);
// RFC 3805 error bits arrive as bare tokens. A sentence is left alone.
contains('un token d\'erreur est rendu lisible', withErrors('jammed', ''), '>Jammed<');
contains('le camelCase est separe', withErrors('doorOpen', ''), '>Door open<');
contains('le snake_case aussi', withErrors('media_empty', ''), '>Media empty<');
contains('une phrase du panneau reste intacte',
  withErrors('none', 'Mode veille active'), '>Mode veille active<');
// A "no paper" error empties the tray, like a state_reason would.
check('une erreur de bac vide vide le bac dessine',
  /class="paper-stack"/.test(withErrors('media_empty', '', { printer_type: 'inkjet' })), false);
check('un bourrage ne vide pas le bac',
  /class="paper-stack"/.test(withErrors('jammed', '', { printer_type: 'inkjet' })), true);
check('show_message: false coupe la recherche',
  /class="msg"/.test(withErrors('jammed', 'Bourrage', { show_message: false })), false);
check('un capteur avec une unite n\'est jamais un message',
  /class="msg"/.test(renderSnmp({
    'sensor.printer_erreurs': { state: '3', attributes: { unit_of_measurement: 'errors', friendly_name: 'Erreurs' } },
  })), false);
// A message on a neighbour's device is not this printer's message.
const foreign = (() => {
  const c = new Card();
  c.setConfig({ entity: 'sensor.printer' });
  const hass = makeHass('idle', { 'sensor.autre_erreurs': { state: 'jammed', attributes: { friendly_name: 'Autre Erreurs' } } });
  hass.entities = { 'sensor.printer': { device_id: 'dev1' }, 'sensor.autre_erreurs': { device_id: 'dev2' } };
  hass.devices = { dev1: { name: 'P1', via_device_id: null }, dev2: { name: 'P2', via_device_id: null } };
  c.hass = hass;
  return markup(c);
})();
check('le message d\'un autre appareil est ignore', label(foreign), 'Ready');

// ── Wear parts and waste receptacles ─────────────────────────────────────────

check('show_parts: false masque les pieces',
  /class="part /.test(renderDev('idle', { show_parts: false }, BROTHER)), false);
const lowPart = renderDev('idle', {}, { 'sensor.printer_fuser_remaining_life': pct(8, 'Fuser remaining lifetime') });
contains('une piece en fin de vie a sa propre alerte', lowPart, 'Wear part low');
contains('l\'alerte piece nomme la piece', lowPart, 'Fuser 8%');
check('une piece basse ne declenche pas l\'alerte cartouche',
  /Cartridge low/.test(lowPart), false);

// A receptacle that fills up is in trouble when it runs high, not low. There
// is no way to tell the two conventions apart from the data, so it is opt-in.
const wasteFill = renderDev('idle', { cartridges: [{ entity: 'sensor.printer_waste', kind: 'waste_fill' }] },
  { 'sensor.printer_waste': pct(95, 'Waste toner box') });
contains('waste_fill: plein = alerte', wasteFill, 'Wear part low');
const wasteFillOk = renderDev('idle', { cartridges: [{ entity: 'sensor.printer_waste', kind: 'waste_fill' }] },
  { 'sensor.printer_waste': pct(12, 'Waste toner box') });
check('waste_fill: vide = pas d\'alerte', /Wear part low/.test(wasteFillOk), false);
const wasteRemaining = renderDev('idle', {}, { 'sensor.printer_waste': pct(12, 'Waste toner box') });
contains('par defaut un recuperateur se lit comme une capacite restante',
  wasteRemaining, 'Wear part low');

// ── Page counters ────────────────────────────────────────────────────────────

const COUNTERS = {
  'sensor.printer_page_counter': { state: '12480', attributes: { friendly_name: 'Page counter' } },
  'sensor.printer_bw_counter': { state: '9210', attributes: { friendly_name: 'B/W pages' } },
  'sensor.printer_color_counter': { state: '3270', attributes: { friendly_name: 'Color pages' } },
  'sensor.printer_bw_scans': { state: '55', attributes: { friendly_name: 'B&W Scans' } },
  'sensor.printer_color_copies': { state: '12', attributes: { friendly_name: 'Color Copies' } },
  'sensor.printer_drum_remaining_pages': { state: '4000', attributes: { friendly_name: 'Drum remaining pages' } },
};
const counters = renderDev('idle', {}, COUNTERS);
contains('compteur total', counters, '12,480');
contains('compteur noir et blanc', counters, '9,210');
contains('compteur couleur', counters, '3,270');
const countersLine = html => (String(html).match(/<div class="counters">[\s\S]*?<\/div>/) || [''])[0];
check('les scans ne sont pas des impressions', /55/.test(countersLine(counters)), false);
check('les copies non plus', />12</.test(countersLine(counters)), false);
check('les pages restantes d\'un tambour ne sont pas un compteur',
  /4,000/.test(countersLine(counters)), false);
check('trois compteurs et pas un de plus',
  (countersLine(counters).match(/<b>/g) || []).length, 3);
// A machine that only prints keeps the bare line, without a function label.
check('une imprimante simple garde sa ligne sans libelle',
  /class="cfn"/.test(counters), false);
check('show_counters: false masque la ligne',
  /class="counters"/.test(renderDev('idle', { show_counters: false }, COUNTERS)), false);
check('pas de ligne de compteurs sans compteur',
  /class="counters"/.test(render('idle')), false);
contains('les compteurs suivent la langue de la carte',
  renderDev('idle', { language: 'fr' }, COUNTERS), '12\u202f480');

// ── Mono printers ────────────────────────────────────────────────────────────
// One cartridge, no colour anywhere in its name, and the machine prints black.

const mono = renderDev('idle', {}, { 'sensor.printer_toner_remaining': pct(45, 'HL-L2350DW Toner remaining') });
check('mono: une seule cartouche', (mono.match(/class="cart /g) || []).length, 1);
contains('mono: elle est noire', mono, 'fill="#26292e"');
contains('mono: elle est nommee noir', mono, '>Black<');
// Two nameless supplies is not a mono printer, and guessing black would be wrong.
const twoUnknown = renderDev('idle', {}, {
  'sensor.printer_supply_a': pct(45, 'Supply A'),
  'sensor.printer_supply_b': pct(60, 'Supply B'),
});
check('deux consommables anonymes ne deviennent pas noirs',
  /fill="#26292e"/.test(twoUnknown), false);
// A mono machine counts every page in black: the same number twice is noise.
const monoCounters = renderDev('idle', {}, {
  'sensor.printer_page_counter': { state: '5000', attributes: { friendly_name: 'Page counter' } },
  'sensor.printer_bw_counter': { state: '5000', attributes: { friendly_name: 'B/W pages' } },
});
check('mono: le compteur N&B redondant est masque',
  (monoCounters.match(/5,000/g) || []).length, 1);

// ── The warning state ────────────────────────────────────────────────────────
// A printer that says "toner low" still prints. Calling that stopped was wrong.

check('"warning" (SyncThru)', label(render('warning')), 'Attention needed');
check('"Toner low" (Brother)', label(render('Toner low')), 'Attention needed');
check('"Low ink"', label(render('Low ink')), 'Attention needed');
check('un avertissement n\'est pas un arret', label(render('Toner low')) === label(render('stopped')), false);
contains('l\'avertissement est orange', render('warning'), '--pc-color: var(--warning-color');
check('"Replace toner" reste un arret', label(render('Replace toner')), 'Stopped');
check('"unreachable" est hors ligne', label(render('unreachable')), 'Offline');
check('un avertissement ne dessine pas de bourrage', /class="warn"/.test(render('warning')), false);

// ── An explicit paper sensor ─────────────────────────────────────────────────

const paperCfg = { printer_type: 'inkjet', paper_entity: 'binary_sensor.tray' };
const bs = (state, dc) => ({ 'binary_sensor.tray': { state, attributes: dc ? { device_class: dc } : {} } });
check('binary_sensor off = bac vide',
  /class="paper-stack"/.test(render('idle', paperCfg, bs('off'))), false);
check('binary_sensor on = du papier',
  /class="paper-stack"/.test(render('idle', paperCfg, bs('on'))), true);
check('device_class problem: on = bac vide',
  /class="paper-stack"/.test(render('idle', paperCfg, bs('on', 'problem'))), false);
check('un capteur numerique a zero = bac vide',
  /class="paper-stack"/.test(render('idle', { printer_type: 'inkjet', paper_entity: 'sensor.tray' },
    { 'sensor.tray': { state: '0', attributes: { unit_of_measurement: '%' } } })), false);
check('un capteur numerique non nul = du papier',
  /class="paper-stack"/.test(render('idle', { printer_type: 'inkjet', paper_entity: 'sensor.tray' },
    { 'sensor.tray': { state: '80', attributes: { unit_of_measurement: '%' } } })), true);
check('un capteur texte "Empty" = bac vide',
  /class="paper-stack"/.test(render('idle', { printer_type: 'inkjet', paper_entity: 'sensor.tray' },
    { 'sensor.tray': { state: 'Empty', attributes: {} } })), false);
check('un capteur de bac introuvable ne vide pas le bac',
  /class="paper-stack"/.test(render('idle', { printer_type: 'inkjet', paper_entity: 'sensor.nope' })), true);

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

// ── The translation tables ───────────────────────────────────────────────────
// A key added to English and forgotten elsewhere falls back silently, so the
// card ends up half translated with nothing to show for it. This caught four
// keys that had all landed in the English table by accident.

const cardSource = await readFile(join(HERE, '..', 'dist', 'ha-printer-card.js'), 'utf8');
const tablesBody = cardSource.slice(cardSource.indexOf('const T = {'), cardSource.indexOf('\n};\n\n// Home Assistant reports Norwegian'));
const tables = [...tablesBody.matchAll(/^  ([a-z]{2}): \{([\s\S]*?)\n  \},/gm)];
const keysOf = body => new Set([...body.matchAll(/(\w+):\s*"/g)].map(m => m[1]));
check('13 langues', tables.length, 13);
// A stale rule painting every message red would defeat the severity colouring.
check('une seule regle de couleur pour les messages',
  (cardSource.match(/^\.msg \{/gm) || []).length, 1);
const enKeys = keysOf(tables[0][2]);
const incomplete = tables.filter(([, , body]) => [...enKeys].some(k => !keysOf(body).has(k)))
  .map(t => t[1]);
check('aucune langue ne retombe sur l\'anglais faute de cle', incomplete.join(',') || 'aucune', 'aucune');
const duplicated = tables.filter(([, , body]) => {
  const all = [...body.matchAll(/(\w+):\s*"/g)].map(m => m[1]);
  return all.length !== new Set(all).size;
}).map(t => t[1]);
check('aucune cle en double dans une table', duplicated.join(',') || 'aucune', 'aucune');
check('les libelles de fonction sont bien traduits',
  /class="cfn">Impression</.test(renderHp({ language: 'fr' })), true);

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
