# HA Printer Card

[![GitHub Release](https://img.shields.io/github/v/release/ADNPolymerase/ha-printer-card?sort=semver)](https://github.com/ADNPolymerase/ha-printer-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/hacs.yml)
[![Tests](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml/badge.svg)](https://github.com/ADNPolymerase/ha-printer-card/actions/workflows/test.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Lien vers mon github.io pour mes autres projets" height="60"></a>

Une carte Lovelace pour imprimante : une feuille qui sort vraiment pendant l'impression, les niveaux d'encre ou de toner dessinés en cartouches, le tambour et le four à côté, les compteurs de pages, une alerte consommable bas et le message de l'imprimante elle-même.

Aucune intégration n'est privilégiée. L'état passe par une table de mots-clés plutôt que par le vocabulaire d'un constructeur, et les consommables sont trouvés en regardant l'appareil de l'imprimante plutôt qu'une convention de nommage : un tambour Brother, un toner Samsung, une boîte de maintenance Epson et un `sensor.black` Dell arrivent tous sur la carte.

> Retours et issues bienvenus.
> 🇬🇧 [Read in English](README.md)

[![Capture HA Printer Card](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.fr.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/screenshot.fr.png)

## Fonctionnalités

- **Quatre machines classiques**, chacune avec la page qui sort là où elle sort vraiment : le multifonction la dépose dans le renfoncement sous le scanner, le jet d'encre s'alimente par l'arrière et éjecte par l'avant, le laser l'empile sur le dessus, le multifonction de bureau la reçoit dans la baie au-dessus de ses tiroirs.
- **Une feuille qui bouge.** Pendant l'impression, une page sort en boucle puis s'efface comme si on l'avait prise, la LED du bandeau clignote, et un bourrage laisse la feuille coincée à mi-course avec un triangle d'alerte. `prefers-reduced-motion` est respecté.
- **Un bac vide se voit** : quand l'imprimante signale `media-empty` / `media-needed`, le dit avec ses mots, ou qu'un `paper_entity` que vous désignez le dit, le bac arrière du jet d'encre est dessiné sans papier. Un bourrage n'est pas un bac vide, et garde sa pile.
- **Les imprimantes photo comprises.** Huit encres sur un Canon PRO-100, dix sur un Epson grand format : cyan photo, magenta photo, gris clair, noir mat, noir clair et noir très clair sont distingués de leurs homologues simples, par leur nom complet ou par le code court imprimé sur la cartouche (`pk`, `mk`, `lgy`, `vlm`).
- **Des consommables trouvés tout seuls.** Chaque pourcentage posé sur l'appareil de l'imprimante est un candidat, moins les capteurs Wi-Fi et de diagnostic que les intégrations accrochent au même appareil. Ils sont ensuite triés en **encres** (dessinées dans leur couleur, du noir au jaune) et en **pièces d'usure** (tambour, courroie, four, unité laser, kits d'alimentation, boîte de maintenance) affichées en pastilles compactes.
- **Les imprimantes monochromes** sont traitées comme les autres : une cartouche seule et sans couleur dans son nom est noire, pas grise, et les compteurs abandonnent la ligne N&B qui ne fait que répéter le total.
- **Un seuil qui prévient à temps.** Les imprimantes annoncent un `marker_low_level` à 3 %, c'est-à-dire le moment où les pages sortent zébrées. Le plancher propre à la carte est 20 %, et `low_threshold` prime sur les deux. Encres et pièces d'usure ont chacune leur ligne d'alerte.
- **Compteurs, une ligne par fonction** : impression, numérisation, copie, fax, chacune avec son total et sa ventilation noir et blanc / couleur quand l'imprimante la donne. Les bourrages et les estimations de pages restantes restent dehors.
- **Ce que l'intégration sait déjà n'est pas deviné une seconde fois** : la couleur, la description et le type d'un consommable sont lus dans ses attributs, un consommable non reconnu est dessiné dans la teinte que l'imprimante annonce, et une imprimante qui publie ses erreurs et son panneau en entités séparées voit les deux lus sur son appareil, le texte du panneau affiché tel quel et une erreur promouvant l'état.
- **Une imprimante éclatée sur plusieurs appareils** reste une imprimante. L'intégration HP fait huit appareils d'une seule machine, un par toner plus une unité Printer, Scanner et Copy ; la carte suit `via_device_id` et le nommage des appareils pour tous les retrouver, et déduplique quand deux intégrations décrivent le même toner.
- **Les motifs de l'imprimante, dans la langue de la carte.** Les motifs RFC 8011 sont une liste finie, donc dix-neuf des plus courants sont traduits : `media-empty` s'affiche *Plus de papier*, `marker-supply-low-warning` s'affiche *Encre faible*. Leur gravité vient du jeton et non des mots, donc un bourrage arrête l'imprimante et un suffixe `-warning` se contente d'avertir, dans les treize langues à la fois. Ce qui n'est pas dans la liste reste rendu lisible.
- **Six états, pas cinq.** Une imprimante qui dit « toner low » imprime encore : c'est un **avertissement**, en orange, pas un arrêt. `idle`, `Ready to print`, `Sleep mode`, `Bourrage papier`, `Druckt` et les autres sont détectés automatiquement (insensible aux accents, 13 langues) et ramenés à prête / impression / veille / attention / arrêtée / hors ligne. `state_map` couvre le reste.
- **La prise fait foi** : une imprimante sans courant est hors ligne quoi qu'ait dit le dernier relevé, et avec `printing_watts` un wattmètre force l'état *impression* pour les petits travaux qui tiennent entre deux relevés de 60 secondes.
- **Trois dispositions de cartouches** : en cartouches, en barres, ou `inside`, dessinées dans la machine pour une carte deux lignes plus courte.
- **Éditeur visuel** pour toutes les options, un **mode compact**, et une option `language` pour figer la carte dans une langue quelle que soit celle de Home Assistant.

Les quatre modèles, ici avec `cartridge_style: inside` :

[![Les quatre modèles](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.fr.png)](https://raw.githubusercontent.com/ADNPolymerase/ha-printer-card/main/docs/models.fr.png)

## Intégrations

Rien à configurer : désignez le capteur d'état de l'imprimante et la carte lit le reste sur le même appareil.

| Intégration | État | Encres | Pièces d'usure | Compteurs |
|---|---|---|---|---|
| [`ipp`](https://www.home-assistant.io/integrations/ipp/) (cœur) | idle / printing / stopped, `state_message`, `state_reason` | capteurs `marker_type` | - | - |
| [`brother`](https://www.home-assistant.io/integrations/brother/) (cœur) | statut, y compris « toner low » et « sleep » | toner ou encre, par couleur | tambour par couleur, courroie, four, laser, kits PF | pages, N&B, couleur |
| [`syncthru`](https://www.home-assistant.io/integrations/syncthru/) (cœur, Samsung) | normal / warning / error / unreachable | toner par couleur | tambour par couleur | - |
| [HP Printers](https://github.com/elad-bar/ha-hpprinter) (HACS) | statut ePrint | niveaux des consommables | niveaux des consommables | pages, recto verso, bourrages |
| [Epson WorkForce](https://github.com/lymanepp/ha-epson-workforce) (HACS) | statut imprimante / scanner / fax | encre, dont noir photo, gris, cyan clair et magenta clair | niveau de nettoyage (boîte de maintenance) | total, N&B, couleur |
| [SNMP Printer](https://github.com/DSorlov/snmp_printer) (HACS) | ready / jammed, état des capots | toner et encre | tambour, courroie, récupérateur | total des pages |
| [Dell Printer](https://github.com/kongo09/hass-dell-printer) (HACS) | état de l'imprimante | `sensor.black`, `sensor.cyan`… | - | volume d'impression |

Les imprimantes 3D sont une autre machine avec un autre tableau de bord : cette carte ne cherche pas à couvrir Bambu Lab, Prusa, Anycubic ou Elegoo.

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
| `entity` | **Obligatoire.** Le capteur d'état de l'imprimante (`sensor.<imprimante>` de l'intégration `ipp`, `sensor.<imprimante>_status` chez Brother, ou tout capteur portant le statut). |
| `cartridges` | Capteurs de consommables. Sans cette option, ils sont détectés : même appareil, ou même préfixe d'`entity_id`. Chaque entrée est un identifiant d'entité, ou `{entity, name, color, kind}` pour les imprimantes dont les capteurs ne portent que la référence. |
| `plug_entity` | La prise sur laquelle est l'imprimante (`switch` / `input_boolean`). Coupée = hors ligne, et un bouton Allumer/Éteindre apparaît. |
| `power_entity` | Capteur de puissance (W), affiché en haut à droite. |
| `printing_watts` | Watts au-delà desquels l'imprimante est considérée en impression, quoi qu'elle annonce. `0` ou vide désactive. À sens unique : ne masque jamais un bourrage ni une prise coupée. |
| `paper_entity` | Capteur du bac à papier. Un `binary_sensor` est lu selon sa classe : `problem` signifie que *on* est le bac vide, sinon *on* signifie qu'il y a du papier. Un nombre à zéro, ou un état qui dit « vide », comptent aussi. |
| `print_entity` | `button`, `input_button`, `script` ou `switch` déclenché par le bouton *Test*. |
| `web_url` | `auto` reprend l'adresse que Home Assistant affiche sur la page de l'appareil (la `configuration_url` du registre), et retombe sur le propre `uri_supported` de l'imprimante. Ou indiquer une URL. Vide, pas de bouton. |
| `low_threshold` | Seuil de consommable bas en %. Par défaut 20, ou le `marker_low_level` de l'imprimante s'il est plus haut. |
| `full_threshold` | Pour un consommable déclaré `kind: waste_fill`, le % au-delà duquel il est signalé plein. Par défaut 90. |
| `printer_type` | `mfp` (défaut), `inkjet`, `laser` ou `office`. |
| `cartridge_rows` | Sur combien de rangées les cartouches sont disposées : `auto` (défaut : une rangée jusqu'à cinq, moitié-moitié au-delà), ou `1`, `2`, `3`. Une carte posée sur plusieurs colonnes du tableau de bord est assez large pour huit encres d'affilée, et vous seul le savez. Les niveaux dessinés dans la machine s'équilibrent toujours seuls, la largeur de leur emplacement venant du dessin et non de la carte. |
| `cartridge_style` | `cartridges` (défaut), `bars`, ou `inside` : les niveaux dessinés dans la machine elle-même, ce qui supprime la rangée du dessous et raccourcit la carte de deux lignes. Chaque modèle a son propre emplacement, à l'écart de la feuille, du bandeau et du triangle de bourrage, et au-delà de cinq encres elles s'y empilent sur deux rangées plutôt que de devenir des traits. Survoler une cartouche donne son nom et son niveau. |
| `more_info` | `false` pour que les valeurs n'ouvrent plus leur entité au clic. Par défaut `true`. |
| `state_map` | Table facultative : état brut → `printing`\|`idle`\|`sleep`\|`warning`\|`stopped`\|`offline`\|`unknown`. |
| `name` | Titre de la carte. Par défaut le nom de l'appareil, puis le nom convivial de l'entité. |
| `compact` | `true` pour une icône colorée au lieu de l'illustration (cartouches en barres, boutons en icônes). |
| `show_supplies` / `show_parts` / `show_counters` / `show_message` / `show_power` | `false` pour masquer les cartouches, les pièces d'usure, les compteurs de pages, le message de l'imprimante, ou le coin prise. Tous à `true` par défaut, et aucun ne s'affiche si l'imprimante n'a rien à y mettre. |
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
paper_entity: binary_sensor.imprimante_bac_1
print_entity: script.page_de_test
web_url: auto
printer_type: mfp
cartridge_style: inside
low_threshold: 25
cartridges:
  - sensor.hp_color_laserjet_mfp_m277dw_black_cartridge_hp_cf400x
  - sensor.hp_color_laserjet_mfp_m277dw_cyan_cartridge_hp_cf401x
  - entity: sensor.imprimante_recuperateur_toner
    kind: waste_fill
```

## Correspondance des états

Chaque intégration nomme l'état de l'imprimante à sa façon, alors la carte les
lit à travers une seule table et affiche un libellé unique. C'est pourquoi une
imprimante `ipp` qui annonce `idle` s'affiche **Prête**. Survoler l'état montre
la valeur brute, cliquer dessus ouvre l'entité.

| Carte | Couleur | États bruts reconnus |
|---|---|---|
| Prête | vert | `idle`, `ready`, `online`, `normal`, `standby`, et leurs traductions |
| Impression | bleu | `printing`, `processing`, `busy`, `copying`, `scanprocessing`, `warming_up` |
| Veille | gris | `sleep`, `inpowersave`, `power save`, `eco` |
| Attention requise | orange | `warning`, `toner low`, `low ink`, `service required` |
| Arrêtée | rouge | `stopped`, `error`, `jam`, `cover open`, `out of paper`, `replace toner` |
| Hors ligne | gris | `offline`, `unavailable`, `unreachable`, `off`, ou une prise coupée |

`state_map` permet de tout redéfinir.

## Notes

- **Les récupérateurs se lisent dans les deux sens.** Epson annonce la capacité *restante* de sa boîte de maintenance : elle descend comme une encre, et la carte la traite ainsi. Les imprimantes qui parlent la MIB SNMP annoncent au contraire à quel point le réceptacle est *plein*, ce qui est l'inverse : déclarer celles-là avec `kind: waste_fill` et elles alertent au-dessus de `full_threshold` au lieu d'en dessous de `low_threshold`. Rien dans la donnée ne distingue les deux conventions, il faut donc le dire.
- **Pourquoi un wattmètre aide.** L'intégration `ipp` interroge l'imprimante toutes les 60 secondes. Un travail d'une page commence et finit entre deux relevés : la carte ne le verrait jamais. Une prise connectée réagit en quelques secondes. Régler `printing_watts` un peu au-dessus de la consommation au repos (un laser tire une dizaine de watts au repos et plusieurs centaines pendant la fusion).
- **La détection des consommables** passe par le registre d'entités quand Home Assistant l'expose (2023.4+), et retombe sinon sur le préfixe d'`entity_id`. Les lister sous `cartridges` si votre intégration les pose sur un autre appareil.
- La carte ne fait que **lire** l'imprimante. Les seules choses sur lesquelles elle agit sont celles que vous configurez : la prise et l'entité d'impression de test.

## Tests

```bash
node test/run.mjs
```

Pas d'étape de build ni de dépendance : `dist/ha-printer-card.js` est la source.

## Licence

MIT
