# HA Printer Card

[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-printer-card?sort=semver)](https://github.com/ADNPolymerase/ha-printer-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Link to my github.io for my other projects" height="60"></a>

A Lovelace card for printers: a sheet that really slides out while the machine prints, ink or toner levels drawn as cartridges, a low-cartridge alert and the printer's own status message.

Built for the `ipp` integration and just as happy with CUPS, Brother, Epson or HP sensors: the state is read through a keyword table rather than one integration's vocabulary, and the cartridges are discovered on their own.

> Feedback and issues welcome.
> 🇫🇷 [Lire en français](README.fr.md)

[![HA Printer Card screenshot](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.png)

## Features

- **Four classic machines**, each with the page coming out where it really does: an all-in-one drops it into the recess under the scanner, an inkjet feeds from the back and ejects at the front, a laser stacks it on top, an office multifunction lands it in the bay above its drawers.
- **A sheet that moves.** While printing, a page slides out on a loop and fades as if taken, the panel LED blinks, and a paper jam leaves the sheet stuck half-way with a warning triangle. `prefers-reduced-motion` is honoured.
- **Cartridges, discovered by themselves.** Any sensor carrying `marker_type` on the printer's device is picked up, sorted black → cyan → magenta → yellow, and drawn in its own ink colour. Toner or ink, four cartridges or one.
- **A low-cartridge alert that fires in time.** Printers advertise a `marker_low_level` of 3 %, which is the point where pages come out streaked. The card's own floor is 20 %, and `low_threshold` overrides both.
- **An empty tray looks empty**: when the printer reports `media-empty` / `media-needed`, or says so in its own words, the inkjet's rear tray is drawn without paper. A jam is not an empty tray, and keeps its stack.
- **The printer's own words**: `state_message` / `state_reason` are shown when the machine has something to say (jam, cover open, tray empty).
- **The socket as the outer truth**: a printer with no mains is offline whatever the last poll said, and with `printing_watts` a wattmeter promotes the state to *printing* for the short jobs that fit between two 60-second polls.
- **State normalization**: `idle`, `Ready to print`, `Sleep mode`, `Bourrage papier`, `Druckt`… are auto-detected (accent-insensitive, 13 languages) and mapped to ready / printing / sleep / stopped / offline. `state_map` covers anything else.
- **Three cartridge layouts**: cartridge shapes, bars, or `inside`, drawn in the machine itself for a card that is two rows shorter without losing the illustration.
- **Visual editor** for every option, a **compact mode**, and a `language` option to pin the card to one language whatever Home Assistant is set to.

The four models, here with `cartridge_style: inside`:

[![The four models](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.png)

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
| `entity` | **Required.** The printer's state sensor (`sensor.<printer>` from the `ipp` integration, or any sensor holding the status). |
| `cartridges` | Cartridge sensors. Leave it out and they are discovered: same device, or same `entity_id` prefix. Each item is an entity id, or `{entity, name, color}` for printers whose sensors are named after the part number only. |
| `plug_entity` | The socket the printer is on (`switch` / `input_boolean`). Off means offline, and an On/Off button appears. |
| `power_entity` | Power sensor (W), shown top-right. |
| `printing_watts` | Watts above which the printer counts as printing, whatever it reports. `0` or unset disables it. One-way: it never hides a jam or an unplugged socket. |
| `print_entity` | `button`, `input_button`, `script` or `switch` fired by the *Test print* button. |
| `web_url` | `auto` derives the printer's web interface from its own `uri_supported`, or give a URL. Unset, no button. |
| `low_threshold` | Low-cartridge threshold in %. Default: 20, or the printer's `marker_low_level` when that is higher. |
| `printer_type` | `mfp` (default), `inkjet`, `laser` or `office`. |
| `cartridge_style` | `cartridges` (default), `bars`, or `inside`: the levels drawn in the machine itself, which drops the row below and makes the card two rows shorter. Each model has its own bay, clear of the page, the panel and the jam warning. Hover a cartridge for its name and level. |
| `state_map` | Optional map: raw state → `printing`\|`idle`\|`sleep`\|`stopped`\|`offline`\|`unknown`. |
| `name` | Card title. Defaults to the entity's friendly name. |
| `compact` | `true` for a colored icon instead of the illustration (cartridges switch to bars). |
| `show_supplies` / `show_message` / `show_power` | `false` to hide the cartridges, the printer message, or the socket corner. All default to `true`. |
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
print_entity: script.print_test_page
web_url: auto
printer_type: mfp
low_threshold: 25
cartridges:
  - sensor.hp_color_laserjet_mfp_m277dw_black_cartridge_hp_cf400x
  - sensor.hp_color_laserjet_mfp_m277dw_cyan_cartridge_hp_cf401x
  - sensor.hp_color_laserjet_mfp_m277dw_magenta_cartridge_hp_cf403x
  - sensor.hp_color_laserjet_mfp_m277dw_yellow_cartridge_hp_cf402x
```

## Notes

- **Why a wattmeter helps.** The `ipp` integration polls every 60 seconds. A one-page job starts and finishes between two polls, so the card would never show it. A smart plug reacts in seconds: set `printing_watts` a little above the idle draw (a laser idles around 10 W and pulls several hundred while fusing).
- **Cartridge discovery** uses the entity registry when Home Assistant exposes it (2023.4+), and falls back to the `entity_id` prefix, which is exactly how the `ipp` integration names its sensors. List them under `cartridges` if your integration names them otherwise.
- The card only ever **reads** the printer. The only things it can act on are the ones you configure: the socket and the test-print entity.

## Tests

```bash
node test/run.mjs
```

No build step and no dependency: `dist/ha-printer-card.js` is the source.

## License

MIT
