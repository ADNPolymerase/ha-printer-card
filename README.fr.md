# HA Printer Card

[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-printer-card?sort=semver)](https://github.com/ADNPolymerase/ha-printer-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Lien vers mon github.io pour mes autres projets" height="60"></a>

Une carte Lovelace pour imprimante : une feuille qui sort vraiment pendant l'impression, les niveaux d'encre ou de toner dessinés en cartouches, une alerte cartouche basse et le message de l'imprimante elle-même.

Pensée pour l'intégration `ipp`, et tout aussi à l'aise avec des capteurs CUPS, Brother, Epson ou HP : l'état passe par une table de mots-clés plutôt que par le vocabulaire d'une intégration, et les cartouches sont trouvées toutes seules.

> Retours et issues bienvenus.
> 🇬🇧 [Read in English](README.md)

[![Capture HA Printer Card](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.fr.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.fr.png)

## Fonctionnalités

- **Quatre machines classiques**, chacune avec la page qui sort là où elle sort vraiment : le multifonction la dépose dans le renfoncement sous le scanner, le jet d'encre s'alimente par l'arrière et éjecte par l'avant, le laser l'empile sur le dessus, le multifonction de bureau la reçoit dans la baie au-dessus de ses tiroirs.
- **Une feuille qui bouge.** Pendant l'impression, une page sort en boucle puis s'efface comme si on l'avait prise, la LED du bandeau clignote, et un bourrage laisse la feuille coincée à mi-course avec un triangle d'alerte. `prefers-reduced-motion` est respecté.
- **Des cartouches trouvées toutes seules.** Tout capteur portant `marker_type` sur l'appareil de l'imprimante est repris, trié noir → cyan → magenta → jaune, et dessiné dans sa propre couleur d'encre. Toner ou encre, quatre cartouches ou une seule.
- **Une alerte cartouche basse qui prévient à temps.** Les imprimantes annoncent un `marker_low_level` à 3 %, c'est-à-dire le moment où les pages sortent zébrées. Le plancher propre à la carte est 20 %, et `low_threshold` prime sur les deux.
- **Les mots de l'imprimante** : `state_message` / `state_reason` sont affichés quand la machine a quelque chose à dire (bourrage, capot ouvert, bac vide).
- **La prise fait foi** : une imprimante sans courant est hors ligne quoi qu'ait dit le dernier relevé, et avec `printing_watts` un wattmètre force l'état *impression* pour les petits travaux qui tiennent entre deux relevés de 60 secondes.
- **Normalisation des états** : `idle`, `Ready to print`, `Sleep mode`, `Bourrage papier`, `Druckt`… sont détectés automatiquement (insensible aux accents, 13 langues) et ramenés à prête / impression / veille / arrêtée / hors ligne. `state_map` couvre le reste.
- **Trois dispositions de cartouches** : en cartouches, en barres, ou `inside`, dessinées dans la machine, pour une carte deux lignes plus courte sans perdre l'illustration.
- **Éditeur visuel** pour toutes les options, un **mode compact**, et une option `language` pour figer la carte dans une langue quelle que soit celle de Home Assistant.

Les quatre modèles, ici avec `cartridge_style: inside` :

[![Les quatre modèles](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.fr.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.fr.png)

## Installation (HACS)

1. Ajouter `https://github.com/ADNPolymerase/ha-printer-card` en **dépôt personnalisé** (catégorie *Tableau de bord*), puis installer **HA Printer Card**.
2. Ajouter une carte `custom:ha-printer-card` (YAML ou éditeur visuel).

<details>
<summary>Installation manuelle</summary>

Copier `dist/ha-printer-card.js` dans `/config/www/`, puis l'ajouter en ressource de tableau de bord, type *module JavaScript*, pointant sur `/local/ha-printer-card.js`.
</details>

## Configuration

| Option | Description |
|---|---|
| `entity` | **Obligatoire.** Le capteur d'état de l'imprimante (`sensor.<imprimante>` de l'intégration `ipp`, ou tout capteur portant le statut). |
| `cartridges` | Capteurs de cartouches. Sans cette option, ils sont détectés : même appareil, ou même préfixe d'`entity_id`. Chaque entrée est un identifiant d'entité, ou `{entity, name, color}` pour les imprimantes dont les capteurs ne portent que la référence. |
| `plug_entity` | La prise sur laquelle est l'imprimante (`switch` / `input_boolean`). Coupée = hors ligne, et un bouton Allumer/Éteindre apparaît. |
| `power_entity` | Capteur de puissance (W), affiché en haut à droite. |
| `printing_watts` | Watts au-delà desquels l'imprimante est considérée en impression, quoi qu'elle annonce. `0` ou vide désactive. À sens unique : ne masque jamais un bourrage ni une prise coupée. |
| `print_entity` | `button`, `input_button`, `script` ou `switch` déclenché par le bouton *Test*. |
| `web_url` | `auto` déduit l'interface web de l'imprimante depuis son propre `uri_supported`, ou indiquer une URL. Vide, pas de bouton. |
| `low_threshold` | Seuil de cartouche basse en %. Par défaut 20, ou le `marker_low_level` de l'imprimante s'il est plus haut. |
| `printer_type` | `mfp` (défaut), `inkjet`, `laser` ou `office`. |
| `cartridge_style` | `cartridges` (défaut), `bars`, ou `inside` : les niveaux dessinés dans la machine elle-même, ce qui supprime la rangée du dessous et raccourcit la carte de deux lignes. Chaque modèle a son propre emplacement, à l'écart de la feuille, du bandeau et du triangle de bourrage. Survoler une cartouche donne son nom et son niveau. |
| `state_map` | Table facultative : état brut → `printing`\|`idle`\|`sleep`\|`stopped`\|`offline`\|`unknown`. |
| `name` | Titre de la carte. Par défaut le nom convivial de l'entité. |
| `compact` | `true` pour une icône colorée au lieu de l'illustration (les cartouches passent en barres). |
| `show_supplies` / `show_message` / `show_power` | `false` pour masquer les cartouches, le message de l'imprimante, ou le coin prise. Tous à `true` par défaut. |
| `language` | Fige la carte dans une langue : `en`, `fr`, `de`, `es`, `it`, `nl`, `pt`, `sv`, `no`, `da`, `pl`, `ru`, `zh`. Par défaut, suit Home Assistant. |

### Minimal

```yaml
type: custom:ha-printer-card
entity: sensor.hp_color_laserjet_mfp_m277dw
```

### Complet

```yaml
type: custom:ha-printer-card
entity: sensor.hp_color_laserjet_mfp_m277dw
plug_entity: switch.prise_imprimante
power_entity: sensor.prise_imprimante_power
printing_watts: 60
print_entity: script.page_de_test
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

- **Pourquoi un wattmètre aide.** L'intégration `ipp` interroge l'imprimante toutes les 60 secondes. Un travail d'une page commence et finit entre deux relevés : la carte ne le verrait jamais. Une prise connectée réagit en quelques secondes. Régler `printing_watts` un peu au-dessus de la consommation au repos (un laser tire une dizaine de watts au repos et plusieurs centaines pendant la fusion).
- **La détection des cartouches** passe par le registre d'entités quand Home Assistant l'expose (2023.4+), et retombe sinon sur le préfixe d'`entity_id`, qui est exactement la façon dont l'intégration `ipp` nomme ses capteurs. Les lister sous `cartridges` si votre intégration les nomme autrement.
- La carte ne fait que **lire** l'imprimante. Les seules choses sur lesquelles elle agit sont celles que vous configurez : la prise et l'entité d'impression de test.

## Tests

```bash
node test/run.mjs
```

Pas d'étape de build ni de dépendance : `dist/ha-printer-card.js` est la source.

## Licence

MIT
