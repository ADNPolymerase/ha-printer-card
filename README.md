# HA Printer Card

[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-printer-card?sort=semver)](https://github.com/ADNPolymerase/ha-printer-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Link to my github.io for my other projects" height="60"></a>

A Lovelace card for printers: a sheet that really slides out while the machine prints, ink or toner levels drawn as cartridges, the drum and the fuser alongside them, page counters, a low-supply alert and the printer's own status message.

No integration is privileged. The state goes through a keyword table rather than one vendor's vocabulary, and the supplies are found by looking at the printer's device rather than at a naming convention, so a Brother drum, a Samsung toner, an Epson maintenance box and a Dell `sensor.black` all land on the card.

> Feedback and issues welcome.
> 🇫🇷 [Lire en français](README.fr.md)

[![HA Printer Card screenshot](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.png)

## Features

- **Four classic machines**, each with the page coming out where it really does: an all-in-one drops it into the recess under the scanner, an inkjet feeds from the back and ejects at the front, a laser stacks it on top, an office multifunction lands it in the bay above its drawers.
- **A sheet that moves.** While printing, a page slides out on a loop and fades as if taken, the panel LED blinks, and a paper jam leaves the sheet stuck half-way with a warning triangle. `prefers-reduced-motion` is honoured.
- **An empty tray looks empty**: when the printer reports `media-empty` / `media-needed`, says so in its own words, or a `paper_entity` you point at says so, the inkjet's rear tray is drawn without paper. A jam is not an empty tray, and keeps its stack.
- **Photo printers included.** Eight inks on a Canon PRO-100, ten on a wide format Epson: photo cyan, photo magenta, light grey, matte black, light black and light light black are told apart from their plain counterparts, by full name or by the short code printed on the cartridge (`pk`, `mk`, `lgy`, `vlm`).
- **Supplies found on their own.** Every percentage on the printer's device is a candidate, minus the Wi-Fi and diagnostic sensors integrations hang off the same device. They are then sorted into **inks** (drawn in their own colour, black to yellow) and **wear parts** (drum, belt, fuser, laser unit, feed kits, maintenance box) shown as a compact chip row.
- **Mono printers** are first-class: a single cartridge with no colour in its name is black, not grey, and the page counters drop the B/W line that just repeats the total.
- **A low threshold that fires in time.** Printers advertise a `marker_low_level` of 3 %, which is the point where pages come out streaked. The card's own floor is 20 %, and `low_threshold` overrides both. Inks and wear parts get their own alert line.
- **Counters, one row per function**: printed, scanned, copied, faxed, each with its total, black-and-white and colour split when the printer reports one. Jams and remaining-page estimates are counters too and stay out.
- **What the integration already knows is not guessed again**: a supply's declared colour, description and type are read from its attributes, an unrecognized supply is drawn in the shade the printer reports, and a printer that publishes its errors and its front panel as their own entities has both read off its device, the panel text shown plainly and an error promoting the state.
- **A printer split across many devices** is still one printer. The HP integration makes eight devices out of one machine, one per toner plus a Printer, a Scanner and a Copy unit; the card follows `via_device_id` and the device naming to find them all, and de-duplicates when two integrations report the same toner.
- **Six states, not five.** A printer saying "toner low" still prints: that is a **warning**, in orange, not a stop. `idle`, `Ready to print`, `Sleep mode`, `Bourrage papier`, `Druckt` and the rest are auto-detected (accent-insensitive, 13 languages) and mapped to ready / printing / sleep / warning / stopped / offline. `state_map` covers anything else.
- **The socket is the outer truth**: a printer with no mains is offline whatever the last poll said, and with `printing_watts` a wattmeter promotes the state to *printing* for the short jobs that fit between two 60-second polls.
- **Three cartridge layouts**: cartridge shapes, bars, or `inside`, drawn in the machine itself for a card two rows shorter.
- **Visual editor** for every option, a **compact mode**, and a `language` option to pin the card to one language whatever Home Assistant is set to.

The four models, here with `cartridge_style: inside`:

[![The four models](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.png)

## Integrations

Nothing to configure: point the card at the printer's status sensor and it reads the rest off the same device.

| Integration | State | Inks | Wear parts | Counters |
|---|---|---|---|---|
| [`ipp`](https://www.home-assistant.io/integrations/ipp/) (core) | idle / printing / stopped, `state_message`, `state_reason` | `marker_type` sensors | - | - |
| [`brother`](https://www.home-assistant.io/integrations/brother/) (core) | status, including "toner low" and "sleep" | toner or ink, per colour | drum per colour, belt, fuser, laser, PF kits | page, B/W, colour |
| [`syncthru`](https://www.home-assistant.io/integrations/syncthru/) (core, Samsung) | normal / warning / error / unreachable | toner per colour | drum per colour | - |
| [HP Printers](https://github.com/elad-bar/ha-hpprinter) (HACS) | ePrint status | consumable levels | consumable levels | pages, duplex, jams |
| [Epson WorkForce](https://github.com/lymanepp/ha-epson-workforce) (HACS) | printer / scanner / fax status | ink, including photo black, grey, light cyan and light magenta | cleaning level (maintenance box) | total, B/W, colour |
| [SNMP Printer](https://github.com/DSorlov/snmp_printer) (HACS) | ready / jammed, cover status | toner and ink | drum, belt, waste container | total pages |
| [Dell Printer](https://github.com/kongo09/hass-dell-printer) (HACS) | printer state | `sensor.black`, `sensor.cyan`… | - | print volume |

3D printers are a different machine with a different dashboard: this card does not try to cover Bambu Lab, Prusa, Anycubic or Elegoo.

## Installation (HACS)

1. Add `https://github.com/ADNPolymerase/ha-printer-card` as a **custom repository** (category *Dashboard*), then install **HA Printer Card**.
2. Add a `custom:ha-printer-card` card (YAML or visual editor).

<details>
<summary>Manual installation</summary>

Copy `dist/ha-printer-card.js` into `/config/www/`, then add it as a dashboard resource of type *JavaScript module* pointing at `/local/ha-printer-card.js`.
</details>

## Configuration

| Option | Description |
|---|---|
| `entity` | **Required.** The printer's state sensor (`sensor.<printer>` from the `ipp` integration, `sensor.<printer>_status` from Brother, or any sensor holding the status). |
| `cartridges` | Supply sensors. Leave it out and they are discovered: same device, or same `entity_id` prefix. Each item is an entity id, or `{entity, name, color, kind}` for printers whose sensors are named after the part number only. |
| `plug_entity` | The socket the printer is on (`switch` / `input_boolean`). Off means offline, and an On/Off button appears. |
| `power_entity` | Power sensor (W), shown top-right. |
| `printing_watts` | Watts above which the printer counts as printing, whatever it reports. `0` or unset disables it. One-way: it never hides a jam or an unplugged socket. |
| `paper_entity` | Paper tray sensor. A `binary_sensor` is read by its device class: `problem` means *on* is the empty tray, anything else means *on* is paper present. A number at zero, or a state saying "empty", also counts. |
| `print_entity` | `button`, `input_button`, `script` or `switch` fired by the *Test print* button. |
| `web_url` | `auto` uses the address Home Assistant shows on the device page (the registry's `configuration_url`), falling back to the printer's own `uri_supported`. Or give a URL. Unset, no button. |
| `low_threshold` | Low-supply threshold in %. Default: 20, or the printer's `marker_low_level` when that is higher. |
| `full_threshold` | For a supply declared `kind: waste_fill`, the % above which it is reported full. Default 90. |
| `printer_type` | `mfp` (default), `inkjet`, `laser` or `office`. |
| `cartridge_style` | `cartridges` (default), `bars`, or `inside`: the levels drawn in the machine itself, which drops the row below and makes the card two rows shorter. Each model has its own bay, clear of the page, the panel and the jam warning, and past five inks they stack in two rows there rather than becoming slivers. Hover a cartridge for its name and level. |
| `more_info` | `false` to stop values from opening their entity when tapped. Default `true`. |
| `state_map` | Optional map: raw state → `printing`\|`idle`\|`sleep`\|`warning`\|`stopped`\|`offline`\|`unknown`. |
| `name` | Card title. Defaults to the device name, then to the entity's friendly name. |
| `compact` | `true` for a colored icon instead of the illustration (cartridges switch to bars, buttons to icons). |
| `show_supplies` / `show_parts` / `show_counters` / `show_message` / `show_power` | `false` to hide the cartridges, the wear parts, the page counters, the printer message, or the socket corner. All default to `true`, and none of them shows if the printer has nothing to put there. |
| `language` | Pin the card to one language: `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh`. Default: follow Home Assistant. |

### Minimal

```yaml
type: custom:ha-printer-card
entity: sensor.hp_color_laserjet_mfp_m277dw
```

### Everything

```yaml
type: custom:ha-printer-card
entity: sensor.hp_color_laserjet_mfp_m277dw
plug_entity: switch.printer_socket
power_entity: sensor.printer_socket_power
printing_watts: 60
paper_entity: binary_sensor.printer_tray_1
print_entity: script.print_test_page
web_url: auto
printer_type: mfp
cartridge_style: inside
low_threshold: 25
cartridges:
  - sensor.hp_color_laserjet_mfp_m277dw_black_cartridge_hp_cf400x
  - sensor.hp_color_laserjet_mfp_m277dw_cyan_cartridge_hp_cf401x
  - entity: sensor.printer_waste_toner_box
    kind: waste_fill
```

## How states are mapped

Every integration words the printer's state differently, so the card reads them
through one table and shows a single label. This is why an `ipp` printer
reporting `idle` reads **Ready** on the card. Hover the state to see the raw
value, or tap it to open the entity.

| Card | Colour | Raw states it recognizes |
|---|---|---|
| Ready | green | `idle`, `ready`, `online`, `normal`, `standby`, and their translations |
| Printing | blue | `printing`, `processing`, `busy`, `copying`, `scanprocessing`, `warming_up` |
| Sleep | grey | `sleep`, `inpowersave`, `power save`, `eco` |
| Attention needed | orange | `warning`, `toner low`, `low ink`, `service required` |
| Stopped | red | `stopped`, `error`, `jam`, `cover open`, `out of paper`, `replace toner` |
| Offline | grey | `offline`, `unavailable`, `unreachable`, `off`, or a socket that is off |

`state_map` overrides any of it.

## Notes

- **Waste containers point both ways.** Epson reports the *remaining* capacity of its maintenance box, so it runs down like an ink and the card treats it that way. Printers speaking the SNMP printer MIB report how *full* the receptacle is, which is the opposite: declare those with `kind: waste_fill` and they alert above `full_threshold` instead of below `low_threshold`. Nothing in the data distinguishes the two conventions, so it has to be said.
- **Why a wattmeter helps.** The `ipp` integration polls every 60 seconds. A one-page job starts and finishes between two polls, so the card would never show it. A smart plug reacts in seconds: set `printing_watts` a little above the idle draw (a laser idles around 10 W and pulls several hundred while fusing).
- **Supply discovery** uses the entity registry when Home Assistant exposes it (2023.4+), and falls back to the `entity_id` prefix. List them under `cartridges` if your integration puts them on a different device.
- The card only ever **reads** the printer. The only things it can act on are the ones you configure: the socket and the test-print entity.

## Tests

```bash
node test/run.mjs
```

No build step and no dependency: `dist/ha-printer-card.js` is the source.

## License

MIT
