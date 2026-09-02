const CARD_VERSION = "0.5.0";

console.info(
  "%c HA-PRINTER-CARD %c v" + CARD_VERSION + " ",
  "color:white;background:#1565c0;font-weight:700;",
  "color:#1565c0;background:white;font-weight:700;"
);

// ---------------------------------------------------------------------------
// i18n
// NOTE: this file is intentionally pure ASCII -- every non-ASCII character
// is written as a \uXXXX escape so the card renders correctly no matter
// which charset the resource is served with.
// ---------------------------------------------------------------------------

const T = {
  en: {
    printing: "Printing\u2026", idle: "Ready", sleep: "Sleep", stopped: "Stopped", warning: "Attention needed",
    offline: "Offline", unknown: "Unknown state",
    low: "Low", alert_low: "Cartridge low", alert_part: "Wear part low",
    pages: "pages", pages_bw: "B&W", pages_color: "colour",
    fn_print: "Printed", fn_scan: "Scanned", fn_copy: "Copied", fn_fax: "Faxed",
    show_parts: "Show the drum, fuser and other wear parts", show_counters: "Show the page counters", more_info: "Tap a value to open its entity",
    paper_entity: "Paper tray sensor",
    supplies: "Supplies", toner: "Toner", ink: "Ink",
    c_black: "Black", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Yellow",
    c_grey: "Grey", c_photo: "Photo black", c_light_cyan: "Light cyan",
    c_light_magenta: "Light magenta", c_color: "Colour",
    entity: "Printer entity (required)",
    power_entity: "Power sensor (W)",
    plug_entity: "Printer socket (switch)",
    print_entity: "Test-print button or script",
    web_url: "Web interface URL (auto = from the printer)",
    cartridges_hint: "Cartridges, one entity per line (empty = auto-detect)",
    name: "Name", compact: "Compact mode (icon instead of illustration)",
    language: "Language", language_auto: "Follow Home Assistant",
    printer_type: "Printer type", type_mfp: "All-in-one (with scanner)", type_inkjet: "Inkjet (rear feed)",
    type_laser: "Laser (top output)", type_office: "Office multifunction",
    cartridge_style: "Cartridge style", style_cartridges: "Cartridges", style_bars: "Bars", style_inside: "Inside the printer",
    show_supplies: "Show the cartridges",
    show_message: "Show the printer message (jam, cover open\u2026)",
    show_power: "Show the socket and its power draw",
    low_threshold: "Low-cartridge threshold (%)",
    printing_watts: "Watts above which the printer counts as printing (0 = off)",
    plug_on: "On", plug_off: "Off", web_btn: "Web", print_btn: "Test print",
    section_look: "Appearance", section_advanced: "Advanced",
  },
  fr: {
    printing: "Impression\u2026", idle: "Pr\u00eate", sleep: "Veille", stopped: "Arr\u00eat\u00e9e", warning: "Attention requise",
    offline: "Hors ligne", unknown: "\u00c9tat inconnu",
    low: "Bas", alert_low: "Cartouche presque vide", alert_part: "Pi\u00e8ce d'usure en fin de vie",
    pages: "pages", pages_bw: "N&B", pages_color: "couleur",
    fn_print: "Impression", fn_scan: "Num\u00e9risation", fn_copy: "Copie", fn_fax: "Fax",
    show_parts: "Afficher le tambour, le four et les autres pi\u00e8ces d'usure", show_counters: "Afficher les compteurs de pages", more_info: "Ouvrir l'entit\u00e9 au clic sur une valeur",
    paper_entity: "Capteur du bac \u00e0 papier",
    supplies: "Consommables", toner: "Toner", ink: "Encre",
    c_black: "Noir", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Jaune",
    c_grey: "Gris", c_photo: "Noir photo", c_light_cyan: "Cyan clair",
    c_light_magenta: "Magenta clair", c_color: "Couleur",
    entity: "Entit\u00e9 de l'imprimante (obligatoire)",
    power_entity: "Capteur de puissance (W)",
    plug_entity: "Prise de l'imprimante (switch)",
    print_entity: "Bouton ou script d'impression de test",
    web_url: "URL de l'interface web (auto = depuis l'imprimante)",
    cartridges_hint: "Cartouches, une entit\u00e9 par ligne (vide = d\u00e9tection auto)",
    name: "Nom", compact: "Mode compact (ic\u00f4ne au lieu de l'illustration)",
    language: "Langue", language_auto: "Suivre Home Assistant",
    printer_type: "Type d'imprimante", type_mfp: "Multifonction (avec scanner)", type_inkjet: "Jet d'encre (bac arri\u00e8re)",
    type_laser: "Laser (sortie dessus)", type_office: "Multifonction de bureau",
    cartridge_style: "Style des cartouches", style_cartridges: "Cartouches", style_bars: "Barres", style_inside: "Dans l'imprimante",
    show_supplies: "Afficher les cartouches",
    show_message: "Afficher le message de l'imprimante (bourrage, capot ouvert\u2026)",
    show_power: "Afficher la prise et sa consommation",
    low_threshold: "Seuil de cartouche basse (%)",
    printing_watts: "Watts au-del\u00e0 desquels l'imprimante imprime (0 = d\u00e9sactiv\u00e9)",
    plug_on: "Allumer", plug_off: "\u00c9teindre", web_btn: "Web", print_btn: "Test",
    section_look: "Apparence", section_advanced: "Avanc\u00e9",
  },
  de: {
    printing: "Druckt\u2026", idle: "Bereit", sleep: "Ruhezustand", stopped: "Gestoppt", warning: "Achtung",
    offline: "Offline", unknown: "Unbekannter Zustand",
    low: "Niedrig", alert_low: "Patrone fast leer", alert_part: "Verschlei\u00dfteil fast am Ende",
    pages: "Seiten", pages_bw: "S/W", pages_color: "Farbe",
    fn_print: "Gedruckt", fn_scan: "Gescannt", fn_copy: "Kopiert", fn_fax: "Fax",
    show_parts: "Trommel, Fixiereinheit und andere Verschlei\u00dfteile anzeigen", show_counters: "Seitenz\u00e4hler anzeigen", more_info: "Beim Klick auf einen Wert die Entit\u00e4t \u00f6ffnen",
    paper_entity: "Sensor des Papierfachs",
    supplies: "Verbrauchsmaterial", toner: "Toner", ink: "Tinte",
    c_black: "Schwarz", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Gelb",
    c_grey: "Grau", c_photo: "Fotoschwarz", c_light_cyan: "Hellcyan",
    c_light_magenta: "Hellmagenta", c_color: "Farbe",
    entity: "Drucker-Entit\u00e4t (erforderlich)",
    power_entity: "Leistungssensor (W)",
    plug_entity: "Steckdose des Druckers (Switch)",
    print_entity: "Taste oder Skript f\u00fcr Testdruck",
    web_url: "URL der Weboberfl\u00e4che (auto = vom Drucker)",
    cartridges_hint: "Patronen, eine Entit\u00e4t pro Zeile (leer = automatisch)",
    name: "Name", compact: "Kompaktmodus (Symbol statt Illustration)",
    language: "Sprache", language_auto: "Home Assistant folgen",
    printer_type: "Druckertyp", type_mfp: "Multifunktionsger\u00e4t (mit Scanner)", type_inkjet: "Tintenstrahl (hintere Zufuhr)",
    type_laser: "Laser (Ausgabe oben)", type_office: "B\u00fcro-Multifunktionsger\u00e4t",
    cartridge_style: "Patronen-Stil", style_cartridges: "Patronen", style_bars: "Balken", style_inside: "Im Drucker",
    show_supplies: "Patronen anzeigen",
    show_message: "Druckermeldung anzeigen (Papierstau, Klappe offen\u2026)",
    show_power: "Steckdose und Verbrauch anzeigen",
    low_threshold: "Schwelle f\u00fcr niedrigen F\u00fcllstand (%)",
    printing_watts: "Watt, ab denen der Drucker als druckend gilt (0 = aus)",
    plug_on: "Ein", plug_off: "Aus", web_btn: "Web", print_btn: "Testdruck",
    section_look: "Darstellung", section_advanced: "Erweitert",
  },
  es: {
    printing: "Imprimiendo\u2026", idle: "Lista", sleep: "Reposo", stopped: "Detenida", warning: "Requiere atenci\u00f3n",
    offline: "Sin conexi\u00f3n", unknown: "Estado desconocido",
    low: "Bajo", alert_low: "Cartucho casi vac\u00edo", alert_part: "Pieza de desgaste al l\u00edmite",
    pages: "p\u00e1ginas", pages_bw: "B/N", pages_color: "color",
    fn_print: "Impresi\u00f3n", fn_scan: "Escaneo", fn_copy: "Copia", fn_fax: "Fax",
    show_parts: "Mostrar el tambor, el fusor y otras piezas de desgaste", show_counters: "Mostrar los contadores de p\u00e1ginas", more_info: "Abrir la entidad al pulsar un valor",
    paper_entity: "Sensor de la bandeja de papel",
    supplies: "Consumibles", toner: "T\u00f3ner", ink: "Tinta",
    c_black: "Negro", c_cyan: "Cian", c_magenta: "Magenta", c_yellow: "Amarillo",
    c_grey: "Gris", c_photo: "Negro foto", c_light_cyan: "Cian claro",
    c_light_magenta: "Magenta claro", c_color: "Color",
    entity: "Entidad de la impresora (obligatoria)",
    power_entity: "Sensor de potencia (W)",
    plug_entity: "Enchufe de la impresora (switch)",
    print_entity: "Bot\u00f3n o script de impresi\u00f3n de prueba",
    web_url: "URL de la interfaz web (auto = desde la impresora)",
    cartridges_hint: "Cartuchos, una entidad por l\u00ednea (vac\u00edo = autom\u00e1tico)",
    name: "Nombre", compact: "Modo compacto (icono en vez de ilustraci\u00f3n)",
    language: "Idioma", language_auto: "Seguir a Home Assistant",
    printer_type: "Tipo de impresora", type_mfp: "Multifunci\u00f3n (con esc\u00e1ner)", type_inkjet: "Inyecci\u00f3n de tinta (bandeja trasera)",
    type_laser: "L\u00e1ser (salida superior)", type_office: "Multifunci\u00f3n de oficina",
    cartridge_style: "Estilo de cartuchos", style_cartridges: "Cartuchos", style_bars: "Barras", style_inside: "Dentro de la impresora",
    show_supplies: "Mostrar los cartuchos",
    show_message: "Mostrar el mensaje de la impresora (atasco, tapa abierta\u2026)",
    show_power: "Mostrar el enchufe y su consumo",
    low_threshold: "Umbral de cartucho bajo (%)",
    printing_watts: "Vatios a partir de los cuales se considera que imprime (0 = desactivado)",
    plug_on: "Encender", plug_off: "Apagar", web_btn: "Web", print_btn: "Prueba",
    section_look: "Apariencia", section_advanced: "Avanzado",
  },
  it: {
    printing: "Stampa in corso\u2026", idle: "Pronta", sleep: "Sospensione", stopped: "Ferma", warning: "Richiede attenzione",
    offline: "Non in linea", unknown: "Stato sconosciuto",
    low: "Basso", alert_low: "Cartuccia quasi esaurita", alert_part: "Parte di consumo quasi esaurita",
    pages: "pagine", pages_bw: "B/N", pages_color: "colore",
    fn_print: "Stampa", fn_scan: "Scansione", fn_copy: "Copia", fn_fax: "Fax",
    show_parts: "Mostrare il tamburo, il fusore e le altre parti di consumo", show_counters: "Mostrare i contatori di pagine", more_info: "Aprire l'entit\u00e0 toccando un valore",
    paper_entity: "Sensore del vassoio carta",
    supplies: "Materiali di consumo", toner: "Toner", ink: "Inchiostro",
    c_black: "Nero", c_cyan: "Ciano", c_magenta: "Magenta", c_yellow: "Giallo",
    c_grey: "Grigio", c_photo: "Nero foto", c_light_cyan: "Ciano chiaro",
    c_light_magenta: "Magenta chiaro", c_color: "Colore",
    entity: "Entit\u00e0 della stampante (obbligatoria)",
    power_entity: "Sensore di potenza (W)",
    plug_entity: "Presa della stampante (switch)",
    print_entity: "Pulsante o script di stampa di prova",
    web_url: "URL dell'interfaccia web (auto = dalla stampante)",
    cartridges_hint: "Cartucce, una entit\u00e0 per riga (vuoto = automatico)",
    name: "Nome", compact: "Modalit\u00e0 compatta (icona invece dell'illustrazione)",
    language: "Lingua", language_auto: "Segui Home Assistant",
    printer_type: "Tipo di stampante", type_mfp: "Multifunzione (con scanner)", type_inkjet: "Getto d'inchiostro (vassoio posteriore)",
    type_laser: "Laser (uscita superiore)", type_office: "Multifunzione da ufficio",
    cartridge_style: "Stile delle cartucce", style_cartridges: "Cartucce", style_bars: "Barre", style_inside: "Dentro la stampante",
    show_supplies: "Mostra le cartucce",
    show_message: "Mostra il messaggio della stampante (inceppamento, coperchio aperto\u2026)",
    show_power: "Mostra la presa e il suo consumo",
    low_threshold: "Soglia di cartuccia scarica (%)",
    printing_watts: "Watt oltre i quali la stampante risulta in stampa (0 = disattivato)",
    plug_on: "Accendi", plug_off: "Spegni", web_btn: "Web", print_btn: "Prova",
    section_look: "Aspetto", section_advanced: "Avanzate",
  },
  nl: {
    printing: "Bezig met afdrukken\u2026", idle: "Gereed", sleep: "Slaapstand", stopped: "Gestopt", warning: "Aandacht nodig",
    offline: "Offline", unknown: "Onbekende status",
    low: "Laag", alert_low: "Cartridge bijna leeg", alert_part: "Slijtdeel bijna op",
    pages: "pagina's", pages_bw: "Z/W", pages_color: "kleur",
    fn_print: "Afgedrukt", fn_scan: "Gescand", fn_copy: "Gekopieerd", fn_fax: "Fax",
    show_parts: "Drum, fuser en andere slijtdelen tonen", show_counters: "Paginatellers tonen", more_info: "Entiteit openen bij tik op een waarde",
    paper_entity: "Sensor van de papierlade",
    supplies: "Verbruiksartikelen", toner: "Toner", ink: "Inkt",
    c_black: "Zwart", c_cyan: "Cyaan", c_magenta: "Magenta", c_yellow: "Geel",
    c_grey: "Grijs", c_photo: "Fotozwart", c_light_cyan: "Lichtcyaan",
    c_light_magenta: "Lichtmagenta", c_color: "Kleur",
    entity: "Printerentiteit (verplicht)",
    power_entity: "Vermogenssensor (W)",
    plug_entity: "Stopcontact van de printer (switch)",
    print_entity: "Knop of script voor testafdruk",
    web_url: "URL van de webinterface (auto = van de printer)",
    cartridges_hint: "Cartridges, \u00e9\u00e9n entiteit per regel (leeg = automatisch)",
    name: "Naam", compact: "Compacte modus (pictogram in plaats van illustratie)",
    language: "Taal", language_auto: "Home Assistant volgen",
    printer_type: "Type printer", type_mfp: "All-in-one (met scanner)", type_inkjet: "Inkjet (invoer achter)",
    type_laser: "Laser (uitvoer boven)", type_office: "Kantoormultifunctional",
    cartridge_style: "Cartridgestijl", style_cartridges: "Cartridges", style_bars: "Balken", style_inside: "In de printer",
    show_supplies: "Cartridges tonen",
    show_message: "Printerbericht tonen (papierstoring, klep open\u2026)",
    show_power: "Stopcontact en verbruik tonen",
    low_threshold: "Drempel voor bijna lege cartridge (%)",
    printing_watts: "Watt waarboven de printer als afdrukkend telt (0 = uit)",
    plug_on: "Aan", plug_off: "Uit", web_btn: "Web", print_btn: "Testafdruk",
    section_look: "Weergave", section_advanced: "Geavanceerd",
  },
  pt: {
    printing: "A imprimir\u2026", idle: "Pronta", sleep: "Suspensa", stopped: "Parada", warning: "Requer aten\u00e7\u00e3o",
    offline: "Offline", unknown: "Estado desconhecido",
    low: "Baixo", alert_low: "Cartucho quase vazio", alert_part: "Pe\u00e7a de desgaste no fim",
    pages: "p\u00e1ginas", pages_bw: "P/B", pages_color: "cor",
    fn_print: "Impress\u00e3o", fn_scan: "Digitaliza\u00e7\u00e3o", fn_copy: "C\u00f3pia", fn_fax: "Fax",
    show_parts: "Mostrar o tambor, o fusor e outras pe\u00e7as de desgaste", show_counters: "Mostrar os contadores de p\u00e1ginas", more_info: "Abrir a entidade ao tocar num valor",
    paper_entity: "Sensor do tabuleiro de papel",
    supplies: "Consum\u00edveis", toner: "Toner", ink: "Tinta",
    c_black: "Preto", c_cyan: "Ciano", c_magenta: "Magenta", c_yellow: "Amarelo",
    c_grey: "Cinzento", c_photo: "Preto foto", c_light_cyan: "Ciano claro",
    c_light_magenta: "Magenta claro", c_color: "Cor",
    entity: "Entidade da impressora (obrigat\u00f3ria)",
    power_entity: "Sensor de pot\u00eancia (W)",
    plug_entity: "Tomada da impressora (switch)",
    print_entity: "Bot\u00e3o ou script de impress\u00e3o de teste",
    web_url: "URL da interface web (auto = a partir da impressora)",
    cartridges_hint: "Cartuchos, uma entidade por linha (vazio = autom\u00e1tico)",
    name: "Nome", compact: "Modo compacto (\u00edcone em vez da ilustra\u00e7\u00e3o)",
    language: "Idioma", language_auto: "Seguir o Home Assistant",
    printer_type: "Tipo de impressora", type_mfp: "Multifun\u00e7\u00f5es (com scanner)", type_inkjet: "Jato de tinta (alimenta\u00e7\u00e3o traseira)",
    type_laser: "Laser (sa\u00edda superior)", type_office: "Multifun\u00e7\u00f5es de escrit\u00f3rio",
    cartridge_style: "Estilo dos cartuchos", style_cartridges: "Cartuchos", style_bars: "Barras", style_inside: "Dentro da impressora",
    show_supplies: "Mostrar os cartuchos",
    show_message: "Mostrar a mensagem da impressora (encravamento, tampa aberta\u2026)",
    show_power: "Mostrar a tomada e o seu consumo",
    low_threshold: "Limiar de cartucho baixo (%)",
    printing_watts: "Watts acima dos quais a impressora conta como a imprimir (0 = desligado)",
    plug_on: "Ligar", plug_off: "Desligar", web_btn: "Web", print_btn: "Teste",
    section_look: "Apar\u00eancia", section_advanced: "Avan\u00e7ado",
  },
  sv: {
    printing: "Skriver ut\u2026", idle: "Redo", sleep: "Vilol\u00e4ge", stopped: "Stoppad", warning: "Kr\u00e4ver \u00e5tg\u00e4rd",
    offline: "Offline", unknown: "Ok\u00e4nt tillst\u00e5nd",
    low: "L\u00e5g", alert_low: "Patron n\u00e4stan tom", alert_part: "Slitdel n\u00e4stan slut",
    pages: "sidor", pages_bw: "S/V", pages_color: "f\u00e4rg",
    fn_print: "Utskrift", fn_scan: "Skanning", fn_copy: "Kopiering", fn_fax: "Fax",
    show_parts: "Visa trumma, fixeringsenhet och andra slitdelar", show_counters: "Visa sidr\u00e4knarna", more_info: "\u00d6ppna entiteten n\u00e4r ett v\u00e4rde trycks",
    paper_entity: "Sensor f\u00f6r pappersfacket",
    supplies: "F\u00f6rbrukningsmaterial", toner: "Toner", ink: "Bl\u00e4ck",
    c_black: "Svart", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Gul",
    c_grey: "Gr\u00e5", c_photo: "Fotosvart", c_light_cyan: "Ljus cyan",
    c_light_magenta: "Ljus magenta", c_color: "F\u00e4rg",
    entity: "Skrivarens entitet (obligatorisk)",
    power_entity: "Effektsensor (W)",
    plug_entity: "Skrivarens uttag (switch)",
    print_entity: "Knapp eller skript f\u00f6r testutskrift",
    web_url: "Webbgr\u00e4nssnittets URL (auto = fr\u00e5n skrivaren)",
    cartridges_hint: "Patroner, en entitet per rad (tomt = automatiskt)",
    name: "Namn", compact: "Kompakt l\u00e4ge (ikon i st\u00e4llet f\u00f6r illustration)",
    language: "Spr\u00e5k", language_auto: "F\u00f6lj Home Assistant",
    printer_type: "Skrivartyp", type_mfp: "Allt-i-ett (med skanner)", type_inkjet: "Bl\u00e4ckstr\u00e5le (bakre inmatning)",
    type_laser: "Laser (utmatning upptill)", type_office: "Kontorsmultifunktion",
    cartridge_style: "Patronstil", style_cartridges: "Patroner", style_bars: "Staplar", style_inside: "Inuti skrivaren",
    show_supplies: "Visa patronerna",
    show_message: "Visa skrivarens meddelande (pappersstopp, lucka \u00f6ppen\u2026)",
    show_power: "Visa uttaget och dess f\u00f6rbrukning",
    low_threshold: "Gr\u00e4ns f\u00f6r l\u00e5g patron (%)",
    printing_watts: "Watt \u00f6ver vilka skrivaren r\u00e4knas som utskrivande (0 = av)",
    plug_on: "P\u00e5", plug_off: "Av", web_btn: "Webb", print_btn: "Testutskrift",
    section_look: "Utseende", section_advanced: "Avancerat",
  },
  no: {
    printing: "Skriver ut\u2026", idle: "Klar", sleep: "Hvilemodus", stopped: "Stoppet", warning: "Krever tilsyn",
    offline: "Frakoblet", unknown: "Ukjent tilstand",
    low: "Lav", alert_low: "Patron nesten tom", alert_part: "Slitedel nesten oppbrukt",
    pages: "sider", pages_bw: "S/H", pages_color: "farge",
    fn_print: "Utskrift", fn_scan: "Skanning", fn_copy: "Kopiering", fn_fax: "Faks",
    show_parts: "Vis trommel, fikseringsenhet og andre slitedeler", show_counters: "Vis sidetellerne", more_info: "\u00c5pne entiteten n\u00e5r en verdi trykkes",
    paper_entity: "Sensor for papirskuffen",
    supplies: "Forbruksmateriell", toner: "Toner", ink: "Blekk",
    c_black: "Svart", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Gul",
    c_grey: "Gr\u00e5", c_photo: "Fotosvart", c_light_cyan: "Lys cyan",
    c_light_magenta: "Lys magenta", c_color: "Farge",
    entity: "Skriverens entitet (p\u00e5krevd)",
    power_entity: "Effektsensor (W)",
    plug_entity: "Skriverens stikkontakt (switch)",
    print_entity: "Knapp eller skript for testutskrift",
    web_url: "URL til nettgrensesnittet (auto = fra skriveren)",
    cartridges_hint: "Patroner, \u00e9n entitet per linje (tom = automatisk)",
    name: "Navn", compact: "Kompakt modus (ikon i stedet for illustrasjon)",
    language: "Spr\u00e5k", language_auto: "F\u00f8lg Home Assistant",
    printer_type: "Skrivertype", type_mfp: "Alt-i-ett (med skanner)", type_inkjet: "Blekk (bakre mating)",
    type_laser: "Laser (utmating p\u00e5 toppen)", type_office: "Kontormultifunksjon",
    cartridge_style: "Patronstil", style_cartridges: "Patroner", style_bars: "S\u00f8yler", style_inside: "Inni skriveren",
    show_supplies: "Vis patronene",
    show_message: "Vis skriverens melding (papirstopp, deksel \u00e5pent\u2026)",
    show_power: "Vis stikkontakten og forbruket",
    low_threshold: "Grense for lav patron (%)",
    printing_watts: "Watt over dette regnes skriveren som utskrivende (0 = av)",
    plug_on: "P\u00e5", plug_off: "Av", web_btn: "Web", print_btn: "Testutskrift",
    section_look: "Utseende", section_advanced: "Avansert",
  },
  da: {
    printing: "Udskriver\u2026", idle: "Klar", sleep: "Dvale", stopped: "Stoppet", warning: "Kr\u00e6ver opm\u00e6rksomhed",
    offline: "Offline", unknown: "Ukendt tilstand",
    low: "Lav", alert_low: "Patron n\u00e6sten tom", alert_part: "Sliddel n\u00e6sten opbrugt",
    pages: "sider", pages_bw: "S/H", pages_color: "farve",
    fn_print: "Udskrift", fn_scan: "Scanning", fn_copy: "Kopiering", fn_fax: "Fax",
    show_parts: "Vis tromle, fikseringsenhed og andre sliddele", show_counters: "Vis sidet\u00e6llerne", more_info: "\u00c5bn entiteten n\u00e5r en v\u00e6rdi trykkes",
    paper_entity: "Sensor for papirbakken",
    supplies: "Forbrugsstoffer", toner: "Toner", ink: "Bl\u00e6k",
    c_black: "Sort", c_cyan: "Cyan", c_magenta: "Magenta", c_yellow: "Gul",
    c_grey: "Gr\u00e5", c_photo: "Fotosort", c_light_cyan: "Lys cyan",
    c_light_magenta: "Lys magenta", c_color: "Farve",
    entity: "Printerens entitet (p\u00e5kr\u00e6vet)",
    power_entity: "Effektsensor (W)",
    plug_entity: "Printerens stikkontakt (switch)",
    print_entity: "Knap eller script til testudskrift",
    web_url: "URL til webgr\u00e6nsefladen (auto = fra printeren)",
    cartridges_hint: "Patroner, \u00e9n entitet pr. linje (tom = automatisk)",
    name: "Navn", compact: "Kompakt tilstand (ikon i stedet for illustration)",
    language: "Sprog", language_auto: "F\u00f8lg Home Assistant",
    printer_type: "Printertype", type_mfp: "Alt-i-en (med scanner)", type_inkjet: "Bl\u00e6k (bagerste indf\u00f8ring)",
    type_laser: "Laser (udskrift foroven)", type_office: "Kontormultifunktion",
    cartridge_style: "Patronstil", style_cartridges: "Patroner", style_bars: "Bj\u00e6lker", style_inside: "Inde i printeren",
    show_supplies: "Vis patronerne",
    show_message: "Vis printerens meddelelse (papirstop, l\u00e5ge \u00e5ben\u2026)",
    show_power: "Vis stikkontakten og forbruget",
    low_threshold: "Gr\u00e6nse for lav patron (%)",
    printing_watts: "Watt over hvilke printeren t\u00e6ller som udskrivende (0 = fra)",
    plug_on: "T\u00e6nd", plug_off: "Sluk", web_btn: "Web", print_btn: "Testudskrift",
    section_look: "Udseende", section_advanced: "Avanceret",
  },
  pl: {
    printing: "Drukowanie\u2026", idle: "Gotowa", sleep: "U\u015bpienie", stopped: "Zatrzymana", warning: "Wymaga uwagi",
    offline: "Offline", unknown: "Nieznany stan",
    low: "Niski", alert_low: "Ko\u0144czy si\u0119 tusz", alert_part: "Cz\u0119\u015b\u0107 eksploatacyjna na wyczerpaniu",
    pages: "stron", pages_bw: "Cz/B", pages_color: "kolor",
    fn_print: "Wydruk", fn_scan: "Skanowanie", fn_copy: "Kopiowanie", fn_fax: "Faks",
    show_parts: "Poka\u017c b\u0119ben, utrwalacz i inne cz\u0119\u015bci eksploatacyjne", show_counters: "Poka\u017c liczniki stron", more_info: "Otw\u00f3rz encj\u0119 po klikni\u0119ciu warto\u015bci",
    paper_entity: "Czujnik podajnika papieru",
    supplies: "Materia\u0142y eksploatacyjne", toner: "Toner", ink: "Tusz",
    c_black: "Czarny", c_cyan: "Cyjan", c_magenta: "Magenta", c_yellow: "\u017b\u00f3\u0142ty",
    c_grey: "Szary", c_photo: "Czarny foto", c_light_cyan: "Jasny cyjan",
    c_light_magenta: "Jasna magenta", c_color: "Kolor",
    entity: "Encja drukarki (wymagana)",
    power_entity: "Czujnik mocy (W)",
    plug_entity: "Gniazdko drukarki (switch)",
    print_entity: "Przycisk lub skrypt wydruku testowego",
    web_url: "Adres URL interfejsu WWW (auto = z drukarki)",
    cartridges_hint: "Kartrid\u017ce, jedna encja na wiersz (puste = automatycznie)",
    name: "Nazwa", compact: "Tryb kompaktowy (ikona zamiast ilustracji)",
    language: "J\u0119zyk", language_auto: "Zgodnie z Home Assistant",
    printer_type: "Typ drukarki", type_mfp: "Urz\u0105dzenie wielofunkcyjne (ze skanerem)", type_inkjet: "Atramentowa (podajnik z ty\u0142u)",
    type_laser: "Laserowa (wyj\u015bcie u g\u00f3ry)", type_office: "Biurowe urz\u0105dzenie wielofunkcyjne",
    cartridge_style: "Styl kartrid\u017cy", style_cartridges: "Kartrid\u017ce", style_bars: "S\u0142upki", style_inside: "Wewn\u0105trz drukarki",
    show_supplies: "Poka\u017c kartrid\u017ce",
    show_message: "Poka\u017c komunikat drukarki (zaci\u0119cie, otwarta pokrywa\u2026)",
    show_power: "Poka\u017c gniazdko i jego pob\u00f3r",
    low_threshold: "Pr\u00f3g niskiego poziomu (%)",
    printing_watts: "Waty, powy\u017cej kt\u00f3rych drukarka liczy si\u0119 jako drukuj\u0105ca (0 = wy\u0142\u0105czone)",
    plug_on: "W\u0142\u0105cz", plug_off: "Wy\u0142\u0105cz", web_btn: "WWW", print_btn: "Wydruk testowy",
    section_look: "Wygl\u0105d", section_advanced: "Zaawansowane",
  },
  ru: {
    printing: "\u041f\u0435\u0447\u0430\u0442\u044c\u2026", idle: "\u0413\u043e\u0442\u043e\u0432", sleep: "\u0421\u043f\u044f\u0449\u0438\u0439 \u0440\u0435\u0436\u0438\u043c", stopped: "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d", warning: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u044f",
    offline: "\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438", unknown: "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435",
    low: "\u041c\u0430\u043b\u043e", alert_low: "\u041a\u0430\u0440\u0442\u0440\u0438\u0434\u0436 \u0437\u0430\u043a\u0430\u043d\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044f", alert_part: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0430\u044f \u0434\u0435\u0442\u0430\u043b\u044c \u043d\u0430 \u0438\u0441\u0445\u043e\u0434\u0435",
    pages: "\u0441\u0442\u0440\u0430\u043d\u0438\u0446", pages_bw: "\u0427/\u0411", pages_color: "\u0446\u0432\u0435\u0442",
    fn_print: "\u041f\u0435\u0447\u0430\u0442\u044c", fn_scan: "\u0421\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435", fn_copy: "\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435", fn_fax: "\u0424\u0430\u043a\u0441",
    show_parts: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0431\u0430\u0440\u0430\u0431\u0430\u043d, \u043f\u0435\u0447\u043a\u0443 \u0438 \u0434\u0440\u0443\u0433\u0438\u0435 \u0440\u0430\u0441\u0445\u043e\u0434\u043d\u044b\u0435 \u0434\u0435\u0442\u0430\u043b\u0438", show_counters: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0441\u0447\u0451\u0442\u0447\u0438\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446", more_info: "\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u043e\u0431\u044a\u0435\u043a\u0442 \u043f\u043e \u043d\u0430\u0436\u0430\u0442\u0438\u044e \u043d\u0430 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435",
    paper_entity: "\u0414\u0430\u0442\u0447\u0438\u043a \u043b\u043e\u0442\u043a\u0430 \u0431\u0443\u043c\u0430\u0433\u0438",
    supplies: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b", toner: "\u0422\u043e\u043d\u0435\u0440", ink: "\u0427\u0435\u0440\u043d\u0438\u043b\u0430",
    c_black: "\u0427\u0451\u0440\u043d\u044b\u0439", c_cyan: "\u0413\u043e\u043b\u0443\u0431\u043e\u0439", c_magenta: "\u041f\u0443\u0440\u043f\u0443\u0440\u043d\u044b\u0439", c_yellow: "\u0416\u0451\u043b\u0442\u044b\u0439",
    c_grey: "\u0421\u0435\u0440\u044b\u0439", c_photo: "\u0424\u043e\u0442\u043e \u0447\u0451\u0440\u043d\u044b\u0439", c_light_cyan: "\u0421\u0432\u0435\u0442\u043b\u043e-\u0433\u043e\u043b\u0443\u0431\u043e\u0439",
    c_light_magenta: "\u0421\u0432\u0435\u0442\u043b\u043e-\u043f\u0443\u0440\u043f\u0443\u0440\u043d\u044b\u0439", c_color: "\u0426\u0432\u0435\u0442\u043d\u043e\u0439",
    entity: "\u041e\u0431\u044a\u0435\u043a\u0442 \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430 (\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)",
    power_entity: "\u0414\u0430\u0442\u0447\u0438\u043a \u043c\u043e\u0449\u043d\u043e\u0441\u0442\u0438 (\u0412\u0442)",
    plug_entity: "\u0420\u043e\u0437\u0435\u0442\u043a\u0430 \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430 (switch)",
    print_entity: "\u041a\u043d\u043e\u043f\u043a\u0430 \u0438\u043b\u0438 \u0441\u043a\u0440\u0438\u043f\u0442 \u0442\u0435\u0441\u0442\u043e\u0432\u043e\u0439 \u043f\u0435\u0447\u0430\u0442\u0438",
    web_url: "URL \u0432\u0435\u0431-\u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430 (auto = \u043e\u0442 \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430)",
    cartridges_hint: "\u041a\u0430\u0440\u0442\u0440\u0438\u0434\u0436\u0438, \u043f\u043e \u043e\u0434\u043d\u043e\u043c\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u0443 \u0432 \u0441\u0442\u0440\u043e\u043a\u0435 (\u043f\u0443\u0441\u0442\u043e = \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438)",
    name: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435", compact: "\u041a\u043e\u043c\u043f\u0430\u043a\u0442\u043d\u044b\u0439 \u0440\u0435\u0436\u0438\u043c (\u0437\u043d\u0430\u0447\u043e\u043a \u0432\u043c\u0435\u0441\u0442\u043e \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438)",
    language: "\u042f\u0437\u044b\u043a", language_auto: "\u0421\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u044c Home Assistant",
    printer_type: "\u0422\u0438\u043f \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430", type_mfp: "\u041c\u0424\u0423 (\u0441\u043e \u0441\u043a\u0430\u043d\u0435\u0440\u043e\u043c)", type_inkjet: "\u0421\u0442\u0440\u0443\u0439\u043d\u044b\u0439 (\u0437\u0430\u0434\u043d\u044f\u044f \u043f\u043e\u0434\u0430\u0447\u0430)",
    type_laser: "\u041b\u0430\u0437\u0435\u0440\u043d\u044b\u0439 (\u0432\u044b\u0432\u043e\u0434 \u0441\u0432\u0435\u0440\u0445\u0443)", type_office: "\u041e\u0444\u0438\u0441\u043d\u043e\u0435 \u041c\u0424\u0423",
    cartridge_style: "\u0421\u0442\u0438\u043b\u044c \u043a\u0430\u0440\u0442\u0440\u0438\u0434\u0436\u0435\u0439", style_cartridges: "\u041a\u0430\u0440\u0442\u0440\u0438\u0434\u0436\u0438", style_bars: "\u041f\u043e\u043b\u043e\u0441\u044b", style_inside: "\u0412\u043d\u0443\u0442\u0440\u0438 \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430",
    show_supplies: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043a\u0430\u0440\u0442\u0440\u0438\u0434\u0436\u0438",
    show_message: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u043f\u0440\u0438\u043d\u0442\u0435\u0440\u0430 (\u0437\u0430\u043c\u044f\u0442\u0438\u0435, \u043e\u0442\u043a\u0440\u044b\u0442\u0430 \u043a\u0440\u044b\u0448\u043a\u0430\u2026)",
    show_power: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0440\u043e\u0437\u0435\u0442\u043a\u0443 \u0438 \u0435\u0451 \u043f\u043e\u0442\u0440\u0435\u0431\u043b\u0435\u043d\u0438\u0435",
    low_threshold: "\u041f\u043e\u0440\u043e\u0433 \u043d\u0438\u0437\u043a\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f (%)",
    printing_watts: "\u0412\u0430\u0442\u0442\u044b, \u0432\u044b\u0448\u0435 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043f\u0440\u0438\u043d\u0442\u0435\u0440 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044f \u043f\u0435\u0447\u0430\u0442\u0430\u044e\u0449\u0438\u043c (0 = \u0432\u044b\u043a\u043b.)",
    plug_on: "\u0412\u043a\u043b.", plug_off: "\u0412\u044b\u043a\u043b.", web_btn: "\u0412\u0435\u0431", print_btn: "\u0422\u0435\u0441\u0442 \u043f\u0435\u0447\u0430\u0442\u0438",
    section_look: "\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434", section_advanced: "\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e",
  },
  zh: {
    printing: "\u6253\u5370\u4e2d\u2026", idle: "\u5c31\u7eea", sleep: "\u7761\u7720", stopped: "\u5df2\u505c\u6b62", warning: "\u9700\u8981\u6ce8\u610f",
    offline: "\u79bb\u7ebf", unknown: "\u72b6\u6001\u672a\u77e5",
    low: "\u4e0d\u8db3", alert_low: "\u58a8\u76d2\u5373\u5c06\u8017\u5c3d", alert_part: "\u8017\u6750\u90e8\u4ef6\u5373\u5c06\u8017\u5c3d",
    pages: "\u9875", pages_bw: "\u9ed1\u767d", pages_color: "\u5f69\u8272",
    fn_print: "\u6253\u5370", fn_scan: "\u626b\u63cf", fn_copy: "\u590d\u5370", fn_fax: "\u4f20\u771f",
    show_parts: "\u663e\u793a\u7852\u9f13\u3001\u5b9a\u5f71\u5355\u5143\u7b49\u8017\u6750\u90e8\u4ef6", show_counters: "\u663e\u793a\u9875\u6570\u8ba1\u6570\u5668", more_info: "\u70b9\u51fb\u6570\u503c\u65f6\u6253\u5f00\u5b9e\u4f53",
    paper_entity: "\u7eb8\u76d2\u4f20\u611f\u5668",
    supplies: "\u8017\u6750", toner: "\u78b3\u7c89", ink: "\u58a8\u6c34",
    c_black: "\u9ed1\u8272", c_cyan: "\u9752\u8272", c_magenta: "\u54c1\u7ea2", c_yellow: "\u9ec4\u8272",
    c_grey: "\u7070\u8272", c_photo: "\u7167\u7247\u9ed1", c_light_cyan: "\u6de1\u9752\u8272",
    c_light_magenta: "\u6de1\u54c1\u7ea2", c_color: "\u5f69\u8272",
    entity: "\u6253\u5370\u673a\u5b9e\u4f53\uff08\u5fc5\u586b\uff09",
    power_entity: "\u529f\u7387\u4f20\u611f\u5668\uff08W\uff09",
    plug_entity: "\u6253\u5370\u673a\u63d2\u5ea7\uff08switch\uff09",
    print_entity: "\u6d4b\u8bd5\u6253\u5370\u6309\u94ae\u6216\u811a\u672c",
    web_url: "\u7f51\u9875\u754c\u9762\u5730\u5740\uff08auto = \u53d6\u81ea\u6253\u5370\u673a\uff09",
    cartridges_hint: "\u58a8\u76d2\uff0c\u6bcf\u884c\u4e00\u4e2a\u5b9e\u4f53\uff08\u7559\u7a7a = \u81ea\u52a8\u8bc6\u522b\uff09",
    name: "\u540d\u79f0", compact: "\u7d27\u51d1\u6a21\u5f0f\uff08\u7528\u56fe\u6807\u4ee3\u66ff\u63d2\u56fe\uff09",
    language: "\u8bed\u8a00", language_auto: "\u8ddf\u968f Home Assistant",
    printer_type: "\u6253\u5370\u673a\u7c7b\u578b", type_mfp: "\u4e00\u4f53\u673a\uff08\u542b\u626b\u63cf\u4eea\uff09", type_inkjet: "\u55b7\u58a8\uff08\u540e\u8fdb\u7eb8\uff09",
    type_laser: "\u6fc0\u5149\uff08\u9876\u90e8\u51fa\u7eb8\uff09", type_office: "\u529e\u516c\u591a\u529f\u80fd\u4e00\u4f53\u673a",
    cartridge_style: "\u58a8\u76d2\u6837\u5f0f", style_cartridges: "\u58a8\u76d2", style_bars: "\u6761\u5f62", style_inside: "\u6253\u5370\u673a\u5185\u90e8",
    show_supplies: "\u663e\u793a\u58a8\u76d2",
    show_message: "\u663e\u793a\u6253\u5370\u673a\u6d88\u606f\uff08\u5361\u7eb8\u3001\u673a\u76d6\u6253\u5f00\u2026\uff09",
    show_power: "\u663e\u793a\u63d2\u5ea7\u53ca\u5176\u529f\u8017",
    low_threshold: "\u58a8\u76d2\u4e0d\u8db3\u9608\u503c\uff08%\uff09",
    printing_watts: "\u8d85\u8fc7\u8be5\u74e6\u6570\u5373\u89c6\u4e3a\u6b63\u5728\u6253\u5370\uff080 = \u5173\u95ed\uff09",
    plug_on: "\u5f00\u542f", plug_off: "\u5173\u95ed", web_btn: "\u7f51\u9875", print_btn: "\u6d4b\u8bd5\u6253\u5370",
    section_look: "\u5916\u89c2", section_advanced: "\u9ad8\u7ea7",
  },
};

// Home Assistant reports Norwegian as nb / nn, never as no.
T.nb = T.no;
T.nn = T.no;

function lang(hass) {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "en")
    .toLowerCase().split("-")[0];
  return T[l] ? l : "en";
}
function t(hass, key) {
  const l = lang(hass);
  return (T[l] && T[l][key]) || T.en[key] || key;
}

// Each language names itself, so the list needs no translating.
const LANGUAGE_NAMES = {
  en: "English", fr: "Fran\u00e7ais", de: "Deutsch", es: "Espa\u00f1ol",
  it: "Italiano", nl: "Nederlands", pt: "Portugu\u00eas", sv: "Svenska",
  no: "Norsk", da: "Dansk", pl: "Polski", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", zh: "\u4e2d\u6587",
};

// A card can be pinned to one language whatever Home Assistant is set to.
// Overriding the locale on a copy of hass leaves every t() call downstream
// working unchanged, and carries the choice to the dates as well.
function localizedHass(hass, cfg) {
  const want = cfg && cfg.language;
  if (!hass || !want || want === "auto" || !T[want]) return hass;
  return { ...hass, language: want, locale: { ...(hass.locale || {}), language: want } };
}

// ---------------------------------------------------------------------------
// State normalization -- works across integrations. IPP reports idle /
// printing / stopped, Brother adds "sleep mode", HP Smart and the CUPS
// integrations word it differently again, and every one of them can be
// localized. Keywords are accent-stripped before matching, and order matters:
// "stopped" must be tested before "idle" ("ready to print, cover open"
// exists on some panels), and "printing" before everything else.
// ---------------------------------------------------------------------------

// Order matters: a panel that spells out "Ready to print" must not be read
// as printing, so the settled states are tested first and printing is the
// fallback of the five.
// Order matters: a panel that spells out "Ready to print" must not be read
// as printing, so the settled states are tested first and printing is the
// fallback of the six. "warning" sits between stopped and sleep: a Samsung
// SyncThru reports plain "warning", a Brother says "toner low", and neither
// means the machine has stopped.
const STATE_KEYWORDS = {
  stopped: ["stop", "error", "jam", "bourrage", "arret", "fehler", "gestoppt", "papierstau",
    "detenid", "atasco", "errore", "incepp", "ferma", "fout", "storing", "gestopt",
    "erro", "encravamento", "parada", "fel", "pappersstopp", "stoppad", "feil",
    "stoppet", "papirstopp", "zatrzyman", "blad", "zaciec", "\u043e\u0448\u0438\u0431",
    "\u043e\u0441\u0442\u0430\u043d\u043e\u0432", "\u505c\u6b62", "\u9519\u8bef",
    "halted", "paused", "cover open", "capot", "door open", "out of paper", "no paper",
    "replace toner", "replace cartridge", "remplacer"],
  warning: ["warning", "avertissement", "attention", "achtung", "advertencia", "avviso",
    "waarschuwing", "aviso", "varning", "advarsel", "ostrzezenie",
    "\u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434", "\u8b66\u544a",
    "low toner", "toner low", "low ink", "ink low", "niveau bas", "encre faible",
    "toner faible", "niedrig", "wenig toner", "bajo", "poco toner", "in esaurimento",
    "bijna leeg", "quase vazio", "lite toner", "lavt niva", "niski poziom",
    "\u0437\u0430\u043a\u0430\u043d\u0447\u0438\u0432\u0430", "\u4e0d\u8db3",
    "service required", "maintenance required", "check "],
  sleep: ["sleep", "veille", "schlaf", "ruhezustand", "reposo", "sospension", "slaap",
    "suspens", "vilolage", "dvale", "hvilemodus", "uspien",
    "\u0441\u043f\u044f\u0449", "\u7761\u7720", "power save", "powersave", "inpowersave", "eco"],
  offline: ["offline", "off line", "unavailable", "unreachable", "invalid", "hors ligne", "deconnect",
    "nicht erreichbar", "nicht verbunden", "desconect", "sin conexion", "non in linea",
    "niet beschikbaar", "frankoppl", "afkoblet", "niedostep", "wylaczona",
    "\u043d\u0435 \u0432 \u0441\u0435\u0442\u0438", "\u79bb\u7ebf"],
  idle: ["idle", "ready", "pret", "prete", "inactif", "disponible", "bereit", "listo",
    "inattiv", "pronta", "gereed", "klaar", "redo", "klar", "gotow", "bezczynn",
    "\u0433\u043e\u0442\u043e\u0432", "\u5c31\u7eea", "\u7a7a\u95f2", "standby", "normal", "online", "en ligne"],
  printing: ["print", "imprim", "druck", "stampa", "afdruk", "skriver ut", "utskrift",
    "udskriv", "drukowanie", "drukuje", "\u043f\u0435\u0447\u0430\u0442", "\u6253\u5370",
    "processing", "busy", "en cours", "traitement", "job", "testing", "warming",
    "copying", "scanprocessing", "canceljob"]
};

function stripAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const STATE_KEYWORD_PATTERNS = Object.fromEntries(
  Object.entries(STATE_KEYWORDS).map(([norm, keywords]) => [
    norm,
    keywords.map((kw) => new RegExp(`\\b${kw}`, "i")),
  ])
);

// Freeform text (friendly_name and the printer's own status message are
// device-supplied) must never reach innerHTML or an attribute unescaped.
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function normalizeState(raw, stateMap) {
  if (raw === undefined || raw === null) return "unknown";
  const s = String(raw).trim();
  if (["unknown", "inconnu", ""].includes(s.toLowerCase())) return "unknown";
  if (["unavailable", "indisponible"].includes(s.toLowerCase())) return "offline";
  const exact = { on: "idle", off: "offline", idle: "idle", printing: "printing", stopped: "stopped" }[s.toLowerCase()];
  if (exact && !(stateMap && Object.prototype.hasOwnProperty.call(stateMap, s))) return exact;
  if (stateMap && Object.prototype.hasOwnProperty.call(stateMap, s)) {
    const mapped = stateMap[s];
    return STATE_COLORS[mapped] ? mapped : "unknown";
  }
  const flat = stripAccents(s);
  for (const norm of Object.keys(STATE_KEYWORD_PATTERNS)) {
    if (STATE_KEYWORD_PATTERNS[norm].some((re) => re.test(flat))) return norm;
  }
  return "unknown";
}

const STATE_COLORS = {
  printing: "var(--info-color, #2196f3)",
  warning: "var(--warning-color, #ff9800)",
  idle: "var(--success-color, #4caf50)",
  sleep: "var(--secondary-text-color, #727272)",
  stopped: "var(--error-color, #f44336)",
  offline: "var(--disabled-text-color, #9e9e9e)",
  unknown: "var(--error-color, #f44336)",
};

// Warning and stopped share an icon: the colour carries the severity, and
// there is no second printer-with-a-problem glyph that reads differently.
const STATE_ICONS = {
  printing: "mdi:printer",
  warning: "mdi:printer-alert",
  idle: "mdi:printer-check",
  sleep: "mdi:printer-off",
  stopped: "mdi:printer-alert",
  offline: "mdi:printer-off",
  unknown: "mdi:printer-alert",
};

// ---------------------------------------------------------------------------
// Cartridges
// ---------------------------------------------------------------------------

// Order matters twice over: "light cyan" and "photo black" must be tested
// before plain "cyan" and "black", and the resulting order is the one the
// cartridges are drawn in (KCMY, the order they sit in the machine).
const COLOR_KEYWORDS = [
  ["light_cyan", ["light cyan", "lightcyan", "cyan clair", "hellcyan", "ljus cyan", "lys cyan", "jasny cyjan", "\blc\b"]],
  ["light_magenta", ["light magenta", "lightmagenta", "magenta clair", "hellmagenta", "ljus magenta", "lys magenta", "jasna magenta", "\blm\b"]],
  ["photo", ["photo black", "photoblack", "noir photo", "fotoschwarz", "negro foto", "nero foto", "fotozwart", "preto foto", "fotosvart", "fotosort", "czarny foto", "\bpb\b"]],
  ["black", ["black", "noir", "schwarz", "negro", "nero", "zwart", "preto", "svart", "sort", "czarny",
    "\u0447\u0435\u0440\u043d", "\u9ed1", "\bk\b", "\bbk\b"]],
  ["cyan", ["cyan", "cian", "ciano", "cyaan", "cyjan", "\u0433\u043e\u043b\u0443\u0431", "\u9752", "\bc\b"]],
  ["magenta", ["magenta", "\u043f\u0443\u0440\u043f\u0443\u0440", "\u54c1\u7ea2", "\bm\b"]],
  ["yellow", ["yellow", "jaune", "gelb", "amarill", "giallo", "geel", "gul", "zolty",
    "\u0436\u0435\u043b\u0442", "\u9ec4", "\by\b"]],
  ["grey", ["grey", "gray", "gris", "grau", "grigio", "grijs", "cinzent", "\u0441\u0435\u0440", "\u7070", "\bgy\b"]],
  ["color", ["tri-color", "tricolor", "tri color", "colour", "color", "couleur", "farbe", "colore", "kleur", "\u5f69\u8272"]],
];

const COLOR_SWATCH = {
  black: "#26292e",
  photo: "#15171a",
  cyan: "#00a9d4",
  light_cyan: "#7fd4ea",
  magenta: "#d6006e",
  light_magenta: "#e88bb8",
  yellow: "#f0c000",
  grey: "#8b9096",
  color: "#7a5cc6",
  other: "#5b6470",
};

const COLOR_ORDER = ["black", "photo", "grey", "cyan", "light_cyan", "magenta", "light_magenta", "yellow", "color", "other"];

function detectColor(text) {
  const hay = stripAccents(String(text || "")).toLowerCase().replace(/_/g, " ");
  for (const [color, keywords] of COLOR_KEYWORDS) {
    if (keywords.some((kw) => new RegExp(kw.startsWith("\\b") ? kw : `\\b${kw}`, "i").test(hay))) return color;
  }
  return "other";
}

// A printer's supplies are not only its cartridges. Brother reports a drum, a
// belt, a fuser, a laser unit and paper-feed kits; Samsung a drum per colour;
// Epson a maintenance box. They are all percentages that run down, they all
// need replacing, and none of them is an ink to be drawn in its own colour.
const PART_KEYWORDS = [
  "drum", "tambour", "trommel", "tambor", "cilindro", "bildtrommel",
  "belt", "courroie", "riemen", "correa", "cinghia", "band",
  "fuser", "fusion", "four", "fixiereinheit", "fusor", "fusore", "fixering",
  "laser unit", "unite laser", "lasereinheit", "pf kit", "feed kit", "kit d alimentation", "papiereinzug",
  "transfer", "transfert", "ubertragung",
  "maintenance kit", "kit de maintenance", "wartungskit",
  "developer", "developpeur", "entwickler",
  "imaging", "photoconduct", "\bopc\b",
];
// Waste receptacles: same shape, opposite meaning depending on the maker.
const WASTE_KEYWORDS = [
  "waste", "residu", "recuperateur", "resttoner", "abfall", "afval", "spild",
  "maintenance box", "boite de maintenance", "wartungsbox", "caja de mantenimiento",
  "cleaning", "nettoyage", "reinigung", "limpieza",
  "ink pad", "tampon", "flushing",
];
// Percentages on a printer's device that are not supplies at all: Epson
// exposes Wi-Fi metrics, and integrations happily hang diagnostics off the
// same device.
// Paper trays and covers are percentages on a printer too, and neither is a
// supply. The SNMP integration publishes a tray as a % that sits at unknown
// when the printer answers "at least one sheet" instead of a count, which
// would otherwise have drawn a blank cartridge next to the toners.
const SUPPLY_DENY = /signal|wifi|wi-fi|batter|humid|\bcpu\b|memor|uptime|volume|brightness|\bfan\b|temperat|disk|storage|progress|tray|\bbac\b|cassette|papierfach|bandeja|vassoio|papierlade|\bcover\b|capot|deckel|\btapa\b|coperchio/i;

function matchesAny(hay, keywords) {
  return keywords.some((kw) => new RegExp(kw.startsWith("\\b") ? kw : `\\b${kw.replace(/ /g, "[ _-]")}`, "i").test(hay));
}

// waste before part: a "waste toner box" carries both words.
function classifyKind(text) {
  const hay = stripAccents(String(text || "")).toLowerCase().replace(/_/g, " ");
  if (matchesAny(hay, WASTE_KEYWORDS)) return "waste";
  if (matchesAny(hay, PART_KEYWORDS)) return "part";
  return "ink";
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// A supply sensor is one carrying the IPP/CUPS `marker_type` attribute, or
// failing that any percentage on the printer's own device that is not an
// obvious diagnostic. That wider net is what picks up Brother's drums and
// fuser, Samsung's per-colour drums, Epson's maintenance box and Dell's bare
// `sensor.black`, none of which say "cartridge" anywhere in their name.
// Scoped to the printer by device when the entity registry is reachable
// (hass.entities is only there from 2023.4 on), by entity_id prefix otherwise.
// Integrations do not agree on what a printer is. The `ipp` one puts
// everything on a single device; the HP one splits the machine into eight,
// one per toner plus a Printer, a Scanner and a Copy unit, and only some of
// them are linked by via_device_id. So the scope is the seed device, whatever
// declares itself its child, and whatever is named after it, ranked by that
// order so the nearest source wins when two of them report the same thing.
function deviceScope(hass, printerEntity) {
  const reg = hass.entities;
  const devices = hass.devices;
  const seed = reg && reg[printerEntity] ? reg[printerEntity].device_id : null;
  if (!seed) return null;
  const rank = { [seed]: 0 };
  const seedDevice = devices ? devices[seed] : null;
  const seedName = seedDevice ? String(seedDevice.name_by_user || seedDevice.name || "") : "";
  if (devices) {
    for (const [id, device] of Object.entries(devices)) {
      if (id === seed || !device) continue;
      if (device.via_device_id === seed) { rank[id] = 1; continue; }
      const name = String(device.name_by_user || device.name || "");
      if (!seedName || name.length <= seedName.length) continue;
      if (name.toLowerCase().startsWith(seedName.toLowerCase())) {
        // "Printer" must not swallow "Printer 2", a second machine.
        const rest = name.slice(seedName.length).trim();
        if (rest && !/^\d+$/.test(rest)) rank[id] = 2;
      }
    }
  }
  return rank;
}

// Every friendly name starts with the machine's own name, and a model name is
// full of words this card reads as meaning something: an "HP Color LaserJet"
// would make every supply a laser unit and every counter a colour counter.
// So the machine's name comes off before anything is matched, from the label
// and from the entity id alike.
function cleanHay(id, friendlyName, printerName, printerEntity) {
  const name = friendlyName ? stripPrinterName(friendlyName, printerName) : "";
  let shortId = id;
  let i = 0;
  while (i < id.length && i < printerEntity.length && id[i] === printerEntity[i]) i++;
  const cut = id.lastIndexOf("_", i);
  if (cut > 0) shortId = id.slice(cut + 1);
  return `${name} ${shortId}`;
}

function printerLabel(hass, cfg) {
  const st = stateObj(hass, cfg.entity);
  return deviceName(hass, cfg.entity) || (st && st.attributes.friendly_name) || "";
}

function deviceLabel(hass, deviceId) {
  const device = hass.devices ? hass.devices[deviceId] : null;
  return device ? String(device.name_by_user || device.name || "") : "";
}

function autoCartridgeIds(hass, printerEntity, printerName) {
  const reg = hass.entities || null;
  const scope = deviceScope(hass, printerEntity);
  const prefix = `${printerEntity}_`;
  const found = [];
  for (const [id, st] of Object.entries(hass.states)) {
    if (id === printerEntity || !id.startsWith("sensor.")) continue;
    const attrs = (st && st.attributes) || {};
    const hay = cleanHay(id, attrs.friendly_name, printerName, printerEntity);
    const isPercent = attrs.unit_of_measurement === "%" && !SUPPLY_DENY.test(hay);
    if (attrs.marker_type === undefined && !isPercent) continue;
    let rank = 0;
    if (scope) {
      const device = reg[id] ? reg[id].device_id : null;
      if (device === null || scope[device] === undefined) continue;
      rank = scope[device];
    } else if (!id.startsWith(prefix)) continue;
    found.push({ id, rank });
  }
  found.sort((a, b) => a.rank - b.rank);
  return found.map((f) => ({ entity: f.id, rank: f.rank }));
}

// Normalizes both spellings of the option: a plain entity id, or an object
// overriding the label, the colour or the kind for printers whose sensors are
// named after the part number and nothing else.
function readCartridges(hass, cfg) {
  const printerName = printerLabel(hass, cfg);
  const raw = Array.isArray(cfg.cartridges) && cfg.cartridges.length
    ? cfg.cartridges
    : autoCartridgeIds(hass, cfg.entity, printerName);
  let out = [];
  for (const item of raw) {
    const entry = typeof item === "string" ? { entity: item } : (item || {});
    const rank = entry.rank === undefined ? 0 : entry.rank;
    const st = entry.entity ? hass.states[entry.entity] : null;
    if (!st) continue;
    const attrs = st.attributes || {};
    const level = toNumber(st.state);
    // Some integrations hand over what this card otherwise has to guess: the
    // SNMP one publishes the supply's colour, its full description and its
    // type as attributes. Read them before falling back to the name.
    const described = attrs.description ? `${attrs.color || ""} ${attrs.description}` : "";
    const hay = described || cleanHay(entry.entity, attrs.friendly_name, printerName, cfg.entity);
    const declaredType = attrs.marker_type !== undefined ? attrs.marker_type : attrs.type;
    const kind = entry.kind || (declaredType !== undefined && /toner|ink/i.test(String(declaredType))
      ? "ink"
      : classifyKind(hay));
    const color = entry.color || detectColor(attrs.color ? `${attrs.color} ${hay}` : hay);
    const attrLow = toNumber(attrs.marker_low_level);
    const low = toNumber(cfg.low_threshold);
    const threshold = low !== null ? low : Math.max(20, attrLow !== null ? attrLow : 0);
    const full = toNumber(cfg.full_threshold);
    out.push({
      entity: entry.entity,
      rank,
      level,
      kind,
      color,
      swatch: (color === "other" && Array.isArray(attrs.rgb_color) && attrs.rgb_color.length === 3
        ? `rgb(${attrs.rgb_color.map((n) => Math.max(0, Math.min(255, Number(n) || 0))).join(",")})`
        : COLOR_SWATCH[color]) || (entry.color && /^#|^rgb|^var\(/.test(entry.color) ? entry.color : COLOR_SWATCH.other),
      name: entry.name || null,
      // The integration said what this is, so "other" is an answer and not a
      // gap to be filled by the mono-printer guess below.
      described: !!(attrs.description || (Array.isArray(attrs.rgb_color) && attrs.rgb_color.length === 3)),
      title: attrs.description || attrs.friendly_name || entry.entity,
      type: attrs.marker_type || null,
      // A receptacle declared as filling up is in trouble when it runs high,
      // everything else when it runs low.
      low: level !== null && (kind === "waste_fill"
        ? level >= (full !== null ? full : 90)
        : level <= threshold),
    });
  }
  // Two integrations pointed at the same machine report the same supplies:
  // an `ipp` black cartridge and an HP one are the same physical toner. Keep
  // the nearest source, which is the seed device before its children and its
  // namesakes. Supplies with no recognizable colour are keyed by their label
  // instead, since "other" would collapse unrelated ones together.
  if (!Array.isArray(cfg.cartridges) || !cfg.cartridges.length) {
    const seen = new Map();
    for (const c of out) {
      const key = `${c.kind}/${c.color === "other" ? stripAccents(String(c.title)).toLowerCase() : c.color}`;
      const held = seen.get(key);
      if (!held || c.rank < held.rank) seen.set(key, c);
    }
    out = out.filter((c) => seen.get(`${c.kind}/${c.color === "other" ? stripAccents(String(c.title)).toLowerCase() : c.color}`) === c);
  }
  out.sort((a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color));
  // A mono printer has one cartridge and rarely says which colour it is: a
  // Brother HL-L2350DW just calls it "Toner remaining". One nameless ink and
  // nothing else means black, and drawing it grey would be plain wrong.
  const inks = out.filter((c) => c.kind === "ink");
  if (inks.length === 1 && inks[0].color === "other" && !inks[0].name && !inks[0].described) {
    inks[0].color = "black";
    inks[0].swatch = COLOR_SWATCH.black;
  }
  return out;
}

// Integrations name a part "<printer> Fuser remaining lifetime". The printer's
// own name and the trailing qualifier are noise on a card that already says
// which printer this is.
const PART_SUFFIX = /[\s-]*(remaining\s*(life\s*time|lifetime|life|pages)?|level|niveau|restant(e|s)?|verbleibend\w*|kvar|resterende|pozostaly)\s*$/i;

// Home Assistant composes a friendly name as "<device> <entity>", so the
// printer's own sensor reads "HL-L8360 Status" while its fuser reads
// "HL-L8360 Fuser remaining lifetime". Matching on the card's title would
// therefore never strip anything: what the two share is a run of leading
// words, and that run is the device name.
function stripPrinterName(title, printerName) {
  const words = String(title || "").split(/\s+/).filter(Boolean);
  const ref = String(printerName || "").split(/\s+/).filter(Boolean);
  let i = 0;
  while (i < ref.length && i < words.length - 1 && ref[i].toLowerCase() === words[i].toLowerCase()) i++;
  return words.slice(i).join(" ") || String(title || "");
}

function supplyLabel(hass, c, printerName) {
  if (c.name) return c.name;
  if (c.kind === "ink") return cartridgeLabel(hass, c);
  const label = stripPrinterName(c.title, printerName).replace(PART_SUFFIX, "").trim();
  if (!label) return c.title;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Page counters: Brother, Epson, HP, Dell and the SNMP integrations all expose
// them, each with its own wording. Scans, copies, faxes and jams are counters
// too, and none of them belongs on a line about what the printer has printed.
const COUNTER_NAME = /page|pages|counter|compteur|volume|impressions|zaehler|seiten/i;
const COUNTER_DENY = /jam|bourrage|mispick|miss.?pick|remaining|restant|duplex|simplex/i;
const COUNTER_BW = /\bb\s*(&|and|\/)?\s*w\b|black.?and.?white|monochrome|\bmono\b|noir et blanc|\bn&b\b|schwarz.?weiss|blanco y negro/i;
const COUNTER_COLOR = /colou?r|couleur|farb|kleur|colore|kolor/i;

// A multifunction counts four different things, and an all-in-one that split
// itself into a Printer, a Scanner and a Copy device says so in the device
// name. That beats the entity name, which on HP's copy unit still mentions
// the scanner glass.
const COUNTER_FUNCTIONS = [
  ["scan", /\bscan|numeris|digitaliza|scansion|skann|\u626b\u63cf/i],
  ["copy", /\bcopy|copie|kopi|copia|\u590d\u5370/i],
  ["fax", /\bfax|telecopi|\u4f20\u771f/i],
];

function counterFunction(deviceName, hay) {
  for (const [fn, re] of COUNTER_FUNCTIONS) if (re.test(stripAccents(deviceName || ""))) return fn;
  for (const [fn, re] of COUNTER_FUNCTIONS) if (re.test(stripAccents(hay))) return fn;
  return "print";
}

function readCounters(hass, cfg) {
  const printerName = printerLabel(hass, cfg);
  const reg = hass.entities || null;
  const scope = deviceScope(hass, cfg.entity);
  const prefix = `${cfg.entity}_`;
  const groups = {};
  const ranks = {};
  for (const [id, st] of Object.entries(hass.states)) {
    if (id === cfg.entity || !id.startsWith("sensor.")) continue;
    const attrs = (st && st.attributes) || {};
    const unit = attrs.unit_of_measurement;
    if (unit !== undefined && unit !== null && !/^page/i.test(String(unit))) continue;
    const hay = cleanHay(id, attrs.friendly_name, printerName, cfg.entity);
    if (!COUNTER_NAME.test(hay) || COUNTER_DENY.test(hay)) continue;
    let rank = 0;
    let deviceId = null;
    if (scope) {
      deviceId = reg[id] ? reg[id].device_id : null;
      if (deviceId === null || scope[deviceId] === undefined) continue;
      rank = scope[deviceId];
    } else if (!id.startsWith(prefix)) continue;
    const value = toNumber(st.state);
    if (value === null) continue;
    const fn = counterFunction(deviceId ? deviceLabel(hass, deviceId) : "", hay);
    const slot = COUNTER_BW.test(hay) ? "bw" : COUNTER_COLOR.test(hay) ? "color" : "total";
    groups[fn] = groups[fn] || { total: null, bw: null, color: null, ids: {} };
    ranks[fn] = ranks[fn] || {};
    if (groups[fn][slot] === null || rank < ranks[fn][slot]) {
      groups[fn][slot] = value;
      groups[fn].ids[slot] = id;
      ranks[fn][slot] = rank;
    }
  }
  for (const fn of Object.keys(groups)) {
    const g = groups[fn];
    // On a mono printer every page is a black page: the same number twice
    // under two labels is noise.
    if (g.color === null && g.bw !== null && g.bw === g.total) g.bw = null;
    // A "total" that is smaller than its own breakdown is not a total but
    // another breakdown: HP's copy unit counts the glass and the feeder.
    if (g.bw !== null && g.color !== null && g.total !== null && g.total < g.bw + g.color) g.total = null;
    if (g.total === null && g.bw === null && g.color === null) delete groups[fn];
  }
  return Object.keys(groups).length ? groups : null;
}

// Not every integration puts the printer's own words in an attribute. The
// SNMP one gives them their own entities: one for the RFC 3805 error bits,
// one for the text on the front panel. Both sit on the printer's own device,
// so they can be found rather than configured. Errors come first: a jam
// matters more than whatever the panel happens to be showing.
const MESSAGE_NAME = /error|erreur|fehler|alert|alarm|message/i;
const DISPLAY_NAME = /display|affichage|console|panel|panneau|anzeige|pantalla/i;

// RFC 3805 error bits arrive as bare tokens: "jammed", "doorOpen",
// "media_empty". A sentence is left alone; a lone token is made readable.
// Not translated, because it is what the printer said.
function prettyMessage(text) {
  const raw = String(text || "").trim();
  if (!raw || /\s/.test(raw)) return raw;
  const words = raw.replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function deviceMessage(hass, cfg) {
  const reg = hass.entities;
  const seed = reg && reg[cfg.entity] ? reg[cfg.entity].device_id : null;
  if (!seed) return null;
  let display = null;
  for (const [id, st] of Object.entries(hass.states)) {
    if (id === cfg.entity || !id.startsWith("sensor.")) continue;
    if (!reg[id] || reg[id].device_id !== seed) continue;
    const attrs = (st && st.attributes) || {};
    if (attrs.unit_of_measurement) continue;
    const text = String(st.state || "").trim();
    if (!text || ["none", "unknown", "unavailable", "0", "ok", "idle"].includes(text.toLowerCase())) continue;
    const hay = `${attrs.friendly_name || ""} ${id}`;
    if (MESSAGE_NAME.test(hay)) return prettyMessage(text);
    if (display === null && DISPLAY_NAME.test(hay)) display = prettyMessage(text);
  }
  return display;
}

// An explicit paper sensor, for the printers whose status text says nothing.
// A binary_sensor is read the way its device_class says: `problem` means on is
// the trouble, anything else means on is paper present.
function paperEntityEmpty(hass, cfg) {
  const id = cfg.paper_entity;
  if (!id) return false;
  const st = hass.states[id];
  if (!st) return false;
  const raw = String(st.state).trim().toLowerCase();
  if (["unknown", "unavailable", ""].includes(raw)) return false;
  if (domainOf(id) === "binary_sensor") {
    const dc = st.attributes && st.attributes.device_class;
    return dc === "problem" ? raw === "on" : raw === "off";
  }
  const n = toNumber(raw);
  if (n !== null) return n <= 0;
  if (["empty", "vide", "leer", "vacio", "vuoto", "leeg", "vazio", "tom", "pusty"].includes(raw)) return true;
  return PAPER_OUT_PATTERNS.some((re) => re.test(stripAccents(raw)));
}

function cartridgeLabel(hass, c) {
  if (c.name) return c.name;
  if (c.color === "other") {
    // Nothing recognizable in the name: keep whatever the printer calls it,
    // minus the model prefix the IPP integration prepends.
    const parts = String(c.title).split(/\s+/);
    return parts.slice(-2).join(" ");
  }
  return t(hass, `c_${c.color}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// The status entity of a Brother is called "HL-L8360CDW Status", which makes
// a poor card title. The device registry knows the machine's actual name, and
// the name the user gave it wins over the one the integration invented.
function deviceName(hass, entityId) {
  const reg = hass.entities;
  const devices = hass.devices;
  if (!reg || !devices) return null;
  const entry = reg[entityId];
  const device = entry && entry.device_id ? devices[entry.device_id] : null;
  return device ? (device.name_by_user || device.name || null) : null;
}

function stateObj(hass, entityId) {
  return entityId && hass.states[entityId] ? hass.states[entityId] : null;
}

function domainOf(entityId) {
  return entityId ? entityId.split(".")[0] : null;
}

// The printer's own status text, when it has something to say. IPP fills
// state_message on a jam or an open cover and leaves it null the rest of the
// time; "none" and "0" are how some firmwares spell the same nothing.
function statusMessage(st) {
  if (!st) return null;
  for (const key of ["state_message", "state_reason", "status", "message"]) {
    const v = st.attributes ? st.attributes[key] : null;
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (!s || ["none", "0", "null", "unknown", "idle"].includes(s.toLowerCase())) continue;
    return s;
  }
  return null;
}

// An empty tray, in the printer's own words. IPP puts "media-empty" or
// "media-needed" in state_reason, panels spell it out in the user's language.
// Kept away from the jam keywords: "media-jam" must not read as an empty tray.
const PAPER_OUT_KEYWORDS = [
  "media-empty", "media_empty", "media-needed", "media_needed", "input-tray-missing",
  "out of paper", "no paper", "paper out", "paper empty", "load paper", "add paper",
  "plus de papier", "papier epuise", "bac vide", "manque de papier", "charger du papier",
  "kein papier", "papier leer", "papierfach leer",
  "sin papel", "falta papel", "carta esaurita", "manca carta",
  "geen papier", "papier op", "sem papel", "falta de papel",
  "slut pa papper", "papperet slut", "tom for papir", "ikke mer papir",
  "brak papieru", "\u043d\u0435\u0442 \u0431\u0443\u043c\u0430\u0433\u0438", "\u7f3a\u7eb8", "\u65e0\u7eb8",
];
const PAPER_OUT_PATTERNS = PAPER_OUT_KEYWORDS.map((kw) => new RegExp(kw.replace(/[-_]/g, "[-_ ]"), "i"));

// Scans everything the printer says, not just the first field that has words
// in it: an empty tray often sits in state_reason while state_message carries
// something else entirely.
function isPaperOut(st) {
  if (!st) return false;
  const attrs = st.attributes || {};
  const hay = stripAccents([st.state, attrs.state_message, attrs.state_reason, attrs.status, attrs.message]
    .filter((v) => v !== null && v !== undefined).join(" "));
  return PAPER_OUT_PATTERNS.some((re) => re.test(hay));
}

// `web_url: auto` reads the address the printer advertises itself, rather
// than asking the user to retype an IP that DHCP may move.
// `auto` should find the same address Home Assistant puts on the device page.
// That is the device registry's configuration_url, which most printer
// integrations fill in; the IPP one does not, and publishes the address it
// talks to as an attribute instead.
function webUrl(cfg, st, hass) {
  const raw = cfg.web_url;
  if (!raw) return null;
  if (raw !== "auto") return raw;
  const devices = hass && hass.devices;
  const reg = hass && hass.entities;
  const entry = reg ? reg[cfg.entity] : null;
  const device = entry && entry.device_id && devices ? devices[entry.device_id] : null;
  const configured = device && device.configuration_url ? String(device.configuration_url) : "";
  if (/^https?:\/\//i.test(configured)) return configured;
  const uris = st && st.attributes ? st.attributes.uri_supported : null;
  const first = String(uris || "").split(",")[0].trim();
  const m = first.match(/^ipps?:\/\/([^/:]+)/i);
  if (!m) return null;
  return `http://${m[1]}/`;
}

// ---------------------------------------------------------------------------
// Illustrations -- four classic machines, drawn in a neutral device grey (it
// reads on a light card and on a dark one alike). The state colour is carried
// by the panel LED, the status text and the alerts, not by the shell.
//
// The sheet is the whole point of the card: while printing it slides out on a
// loop, then fades as if taken. Where it comes out is what tells the models
// apart at a glance -- an inkjet feeds from the back and ejects at the front,
// a laser stacks on top, an all-in-one drops into the recess under its
// scanner, an office machine into the bay under its bridge. Each hands the
// shared sheet layer its own hidden offset through --pc-hidden.
// ---------------------------------------------------------------------------

const SHELL = "#dfe3e8";
const SHELL_DARK = "#adb4bd";
const SHELL_LINE = "#8d939b";
const PANEL = "#31363c";
const PAPER = "#ffffff";
const PAPER_LINE = "#c9ced5";

function sheetShape(x, y, w, h) {
  const inset = 8;
  const lw = w - inset * 2;
  return `
    <rect class="sheet-page" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"/>
    <g class="sheet-text">
      <rect x="${x + inset}" y="${y + 13}" width="${lw}" height="3" rx="1.5"/>
      <rect x="${x + inset}" y="${y + 22}" width="${lw}" height="3" rx="1.5"/>
      <rect x="${x + inset}" y="${y + 31}" width="${Math.round(lw * 0.55)}" height="3" rx="1.5"/>
    </g>`;
}

// clip = the window the page is allowed to show through, i.e. everything
// outside the machine. hidden = where the page waits, inside it.
function sheetLayer(page, clip, hidden, jam) {
  return `
    <clipPath id="pc-slot"><rect x="${clip.x}" y="${clip.y}" width="${clip.w}" height="${clip.h}"/></clipPath>
    <g class="sheet-clip">
      <g class="sheet${jam ? " jam" : ""}" style="--pc-hidden:${hidden}px">
        ${sheetShape(page.x, page.y, page.w, page.h)}
      </g>
    </g>`;
}

function panelBlock(x, y, w = 38, h = 21) {
  const r = h > 18 ? 3.6 : 3;
  return `
  <g class="panel"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></g>
  <circle class="led" cx="${x + 8}" cy="${y + h / 2}" r="${r}"/>
  <g class="panel-lines">
    <rect x="${x + 16}" y="${y + h / 2 - 4.7}" width="${w - 22}" height="2.4" rx="1.2"/>
    <rect x="${x + 16}" y="${y + h / 2 + 1.7}" width="${Math.round((w - 22) * 0.62)}" height="2.4" rx="1.2"/>
  </g>`;
}

// Cartridges drawn inside the machine itself, for the layout that drops the
// separate row. Each model declares a bay clear of everything that moves --
// the page, the control panel, the jam warning -- so nothing ever overlaps.
function inkBay(carts, bay, tappable) {
  if (!carts.length) return "";
  const gap = 2.5;
  const w = Math.min(9, (bay.w - gap * (carts.length - 1)) / carts.length);
  const span = w * carts.length + gap * (carts.length - 1);
  const x0 = bay.x + (bay.w - span) / 2;
  const capH = 3;
  const top = bay.y + capH;
  const inner = bay.h - capH;
  return carts.map((c, i) => {
    const x = +(x0 + i * (w + gap)).toFixed(1);
    const pct = Math.max(0, Math.min(100, c.level === null ? 0 : c.level));
    const fh = +((inner - 2) * pct / 100).toFixed(1);
    const fy = +(top + inner - 1 - fh).toFixed(1);
    return `
    <g class="ink${tappable ? " clickable" : ""}${c.low ? " low" : ""}"${tappable && c.entity ? ` data-entity="${escapeHtml(c.entity)}"` : ""}>
      <title>${escapeHtml(c.label || c.title)} ${c.level === null ? "?" : Math.round(c.level)}%</title>
      <rect class="ink-cap" x="${+(x + w * 0.3).toFixed(1)}" y="${bay.y}" width="${+(w * 0.4).toFixed(1)}" height="${capH}" rx="1"/>
      <rect class="ink-track" x="${x}" y="${top}" width="${+w.toFixed(1)}" height="${inner}" rx="2"/>
      ${fh > 0 ? `<rect x="${x}" y="${fy}" width="${+w.toFixed(1)}" height="${fh}" rx="${Math.min(2, fh / 2)}" fill="${c.swatch}"/>` : ""}
      <rect class="ink-outline" x="${x}" y="${top}" width="${+w.toFixed(1)}" height="${inner}" rx="2"/>
    </g>`;
  }).join("");
}

function warningBadge(x, y) {
  return `<g class="warn" transform="translate(${x},${y})">
    <path d="M0 -11 L11 8 L-11 8 Z"/>
    <rect class="warn-bar" x="-1.4" y="-6" width="2.8" height="8" rx="1.4"/>
    <circle class="warn-bar" cx="0" cy="5" r="1.6"/>
  </g>`;
}

// A drawer with a handle, plus the plinth it stands on -- shared by the
// models that sit on a paper tray.
function drawerBase(y) {
  return `
  <g class="shell">
    <rect class="fill" x="30" y="${y}" width="140" height="16" rx="3"/>
    <line class="seam" x1="34" y1="${y + 7}" x2="166" y2="${y + 7}"/>
    <rect class="recess" x="86" y="${y + 10}" width="28" height="3" rx="1.5"/>
    <rect class="recess" x="24" y="${y + 16}" width="152" height="5" rx="2"/>
  </g>`;
}

// All-in-one: a scanner unit on a shadowed gap, the page drops into that gap
// and drapes over the front. Drawing the gap darker than the shell is what
// stops the whole machine reading as one flat box.
function svgMfp(jam, ink) {
  return `
  <g class="shell">
    <rect class="fill" x="24" y="4" width="152" height="24" rx="4"/>
    <line class="seam" x1="28" y1="22" x2="172" y2="22"/>
    <rect class="recess" x="30" y="28" width="140" height="16" rx="2"/>
    <rect class="fill" x="18" y="44" width="164" height="68" rx="6"/>
  </g>
  ${ink}
  ${sheetLayer({ x: 62, y: 42, w: 66, h: 56 }, { x: 56, y: 42, w: 78, h: 66 }, -56, jam)}
  ${panelBlock(136, 53)}
  ${jam ? warningBadge(156, 94) : ""}
  ${drawerBase(112)}`;
}

// Laser: a boxy machine whose output tray is a dip in its own top, so the
// page rises out of the roof.
function svgLaser(jam, ink) {
  return `
  <g class="shell">
    <rect class="fill" x="22" y="34" width="156" height="78" rx="6"/>
    <rect class="recess" x="44" y="34" width="112" height="11" rx="3"/>
  </g>
  ${ink}
  ${sheetLayer({ x: 60, y: -20, w: 64, h: 56 }, { x: 54, y: -24, w: 76, h: 60 }, 56, jam)}
  ${panelBlock(130, 58)}
  ${jam ? warningBadge(152, 95) : ""}
  ${drawerBase(112)}`;
}

// Inkjet: paper stands in a tray leaning off the back, the printed page comes
// out of the front slot and lands on the output tray.
function svgInkjet(jam, ink, noPaper) {
  return `
  <g class="shell">
    <path class="fill" d="M60 52 L140 52 L132 18 L68 18 Z"/>
    ${noPaper ? "" : `
    <rect class="paper-stack" x="77" y="11" width="46" height="43" rx="1.5"/>
    <rect class="paper-stack" x="73" y="8" width="54" height="46" rx="1.5"/>`}
    <rect class="fill" x="20" y="50" width="160" height="52" rx="6"/>
    <rect class="recess" x="56" y="97" width="88" height="6" rx="3"/>
    <path class="fill" d="M30 102 L170 102 L178 122 L22 122 Z"/>
    <rect class="recess" x="72" y="118" width="56" height="3" rx="1.5"/>
  </g>
  ${ink}
  ${sheetLayer({ x: 62, y: 99, w: 64, h: 44 }, { x: 56, y: 100, w: 76, h: 48 }, -44, jam)}
  ${panelBlock(134, 58)}
  ${jam ? warningBadge(154, 90) : ""}`;
}

// Office multifunction: a document feeder and scanner bridged over a stack of
// paper drawers on one side, the page landing in the open bay between them.
function svgOffice(jam, ink) {
  const drawer = (y, h) => `
    <rect class="fill" x="40" y="${y}" width="120" height="${h}" rx="2"/>
    <rect class="recess" x="88" y="${y + h - 6}" width="24" height="3" rx="1.5"/>`;
  return `
  <g class="shell">
    <rect class="fill" x="56" y="2" width="88" height="11" rx="3"/>
    <rect class="fill" x="36" y="13" width="128" height="20" rx="3"/>
    <line class="seam" x1="40" y1="29" x2="160" y2="29"/>
    <rect class="recess" x="50" y="33" width="114" height="20" rx="2"/>
    <rect class="fill" x="34" y="33" width="20" height="22"/>
    <rect class="fill" x="32" y="53" width="136" height="73" rx="5"/>
    ${drawer(60, 20)}
    ${drawer(83, 20)}
    ${drawer(106, 16)}
    <rect class="recess" x="38" y="126" width="124" height="6" rx="2"/>
  </g>
  ${ink}
  ${sheetLayer({ x: 62, y: 51, w: 62, h: 52 }, { x: 56, y: 51, w: 74, h: 62 }, -52, jam)}
  ${panelBlock(128, 36, 34, 15)}
  ${jam ? warningBadge(48, 92) : ""}`;
}

const MODELS = {
  mfp: { draw: svgMfp, bay: { x: 26, y: 52, w: 30, h: 48 } },
  laser: { draw: svgLaser, bay: { x: 30, y: 52, w: 30, h: 48 } },
  inkjet: { draw: svgInkjet, bay: { x: 28, y: 56, w: 30, h: 40 } },
  office: { draw: svgOffice, bay: { x: 132, y: 60, w: 30, h: 44 } },
};

function printerSvg(norm, cfg, carts, noPaper) {
  const model = MODELS[cfg.printer_type] || MODELS.mfp;
  const ink = carts && carts.length ? inkBay(carts, model.bay, cfg.more_info !== false) : "";
  return `
<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img">
  ${model.draw(norm === "stopped", ink, noPaper)}
</svg>`;
}

function cartridgeSvg(level, swatch, idx) {
  const pct = Math.max(0, Math.min(100, level === null ? 0 : level));
  const inner = 34;                       // usable height inside the body
  const h = (inner * pct) / 100;
  const y = 42 - h;
  return `
<svg viewBox="0 0 28 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <clipPath id="pc-cart-${idx}">
      <path d="M10 3 h8 v5 h3 a3 3 0 0 1 3 3 v29 a3 3 0 0 1 -3 3 h-14 a3 3 0 0 1 -3 -3 v-29 a3 3 0 0 1 3 -3 h3 z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#pc-cart-${idx})">
    <rect class="cart-track" x="0" y="0" width="28" height="50"/>
    <rect x="0" y="${y.toFixed(1)}" width="28" height="${h.toFixed(1)}" fill="${swatch}"/>
  </g>
  <path class="cart-outline" d="M10 3 h8 v5 h3 a3 3 0 0 1 3 3 v29 a3 3 0 0 1 -3 3 h-14 a3 3 0 0 1 -3 -3 v-29 a3 3 0 0 1 3 -3 h3 z"/>
</svg>`;
}

function cartridgeBar(level, swatch) {
  const pct = Math.max(0, Math.min(100, level === null ? 0 : level));
  return `<div class="bar"><i style="width:${pct}%;background:${swatch}"></i></div>`;
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

class PrinterCard extends HTMLElement {
  static getStubConfig(hass) {
    const sensors = Object.keys(hass.states).filter((e) => e.startsWith("sensor."));
    const guess =
      sensors.find((e) => {
        const a = hass.states[e].attributes || {};
        return a.uri_supported !== undefined || a.command_set !== undefined
          || (Array.isArray(a.options) && a.options.includes("printing"));
      }) ||
      sensors.find((e) => /printer|imprimante|drucker|impresora|stampante|drukarka/i.test(e));
    return { type: "custom:ha-printer-card", entity: guess || "" };
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("ha-printer-card: 'entity' (the printer sensor) is required");
    }
    this._config = config;
    this._signature = null;
    if (!this._root) {
      this.attachShadow({ mode: "open" });
      this._root = this.shadowRoot;
    }
  }

  getCardSize() {
    const cfg = this._config || {};
    if (cfg.compact) return 2;
    return cfg.cartridge_style === "inside" ? 3 : 4;
  }

  static getConfigElement() {
    return document.createElement("ha-printer-card-editor");
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // Home Assistant's own fireEvent: a plain Event carrying a detail, composed
  // so it crosses the shadow boundary. Every number on this card comes from an
  // entity, and an entity the user can open is an entity whose history and
  // settings are one tap away.
  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _togglePlug() {
    const id = this._config.plug_entity;
    if (id) this._hass.callService("homeassistant", "toggle", { entity_id: id });
  }

  _print() {
    const id = this._config.print_entity;
    if (!id) return;
    const domain = domainOf(id);
    if (domain === "button" || domain === "input_button") {
      this._hass.callService(domain, "press", { entity_id: id });
    } else if (domain === "script") {
      this._hass.callService("script", "turn_on", { entity_id: id });
    } else {
      this._hass.callService("homeassistant", "turn_on", { entity_id: id });
    }
  }

  _render() {
    const rawHass = this._hass;
    const cfg = this._config;
    if (!rawHass || !cfg) return;
    const hass = localizedHass(rawHass, cfg);

    const st = stateObj(hass, cfg.entity);
    let norm = normalizeState(st ? st.state : null, cfg.state_map);

    // The socket is the outer truth: a printer with no mains is offline
    // whatever the last IPP poll said.
    const plugSt = cfg.plug_entity ? stateObj(hass, cfg.plug_entity) : null;
    const plugOn = plugSt ? plugSt.state === "on" : null;
    if (plugOn === false) norm = "offline";

    // Power above the threshold means the motor is running, whatever the
    // printer claims: IPP polls every 60 s and a short job fits between two
    // polls. Deliberately one-way -- it can only promote to printing.
    const powerSt = cfg.power_entity ? stateObj(hass, cfg.power_entity) : null;
    const watts = powerSt ? toNumber(powerSt.state) : null;
    const threshold = toNumber(cfg.printing_watts);
    if (threshold !== null && threshold > 0 && watts !== null && watts > threshold
        && !["offline", "stopped"].includes(norm)) {
      norm = "printing";
    }

    const name = cfg.name || deviceName(hass, cfg.entity) || (st && st.attributes.friendly_name) || "Printer";
    const msg = cfg.show_message === false ? null : (statusMessage(st) || deviceMessage(hass, cfg));
    // A panel that says "paper jam" outranks a poll that still says idle, but
    // a chatty display must never talk the printer out of a worse state.
    let msgSevere = false;
    if (msg) {
      const fromMsg = normalizeState(msg, cfg.state_map);
      if ((fromMsg === "stopped" && norm !== "offline")
          || (fromMsg === "warning" && ["idle", "sleep", "printing", "unknown"].includes(norm))) {
        norm = fromMsg;
        msgSevere = true;
      }
    }
    const supplies = cfg.show_supplies === false ? [] : readCartridges(hass, cfg);
    supplies.forEach((c) => { c.label = supplyLabel(hass, c, name); });
    const color = STATE_COLORS[norm];
    const carts = supplies.filter((c) => c.kind === "ink");
    const parts = cfg.show_parts === false ? [] : supplies.filter((c) => c.kind !== "ink");
    const lows = carts.filter((c) => c.low);
    const lowParts = parts.filter((c) => c.low);
    const counters = cfg.show_counters === false ? null : readCounters(hass, cfg);
    const url = webUrl(cfg, st, hass);
    const noPaper = isPaperOut(st) || paperEntityEmpty(hass, cfg)
      || (!!msg && PAPER_OUT_PATTERNS.some((re) => re.test(stripAccents(msg))));
    // "inside" draws the cartridges in the machine and drops the row below it,
    // which is the shortest the card gets while keeping the illustration. It
    // needs that illustration, so compact mode falls back to bars.
    const inside = cfg.cartridge_style === "inside" && !cfg.compact;
    const bars = cfg.cartridge_style === "bars" || cfg.compact;
    // Only when there is something to show: a plug_entity pointing at an
    // entity that no longer exists would otherwise draw a crossed-out plug,
    // which reads as "socket off" rather than "entity missing".
    const showPower = cfg.show_power !== false && (plugOn !== null || watts !== null);

    const signature = JSON.stringify([
      norm, name, msg, url, lang(hass), cfg.compact, cfg.printer_type,
      cfg.cartridge_style, showPower, plugOn, watts, !!cfg.print_entity,
      inside, noPaper, counters,
      supplies.map((c) => [c.entity, c.level, c.low, c.color, c.kind]),
    ]);
    if (signature === this._signature) return;
    this._signature = signature;

    // Opening an entity is useful when its history is: a toner that drops in
    // steps of ten tells you little. So it is a switch, on by default because
    // a value you cannot tap is a surprise in Home Assistant.
    const tappable = cfg.more_info !== false;
    const clk = tappable ? " clickable" : "";
    const ent = (id) => (tappable && id ? ` data-entity="${escapeHtml(id)}"` : "");

    const cartMarkup = carts.length === 0 || inside ? "" : bars
      ? `<div class="supplies bars">${carts.map((c) => `
          <div class="row-b${clk} ${c.low ? "low" : ""}"${ent(c.entity)} title="${escapeHtml(c.title)}">
            <span class="lbl">${escapeHtml(c.label)}</span>
            ${cartridgeBar(c.level, c.swatch)}
            <span class="pct">${c.level === null ? "?" : Math.round(c.level)}%</span>
          </div>`).join("")}</div>`
      : `<div class="supplies">${carts.map((c, i) => `
          <div class="cart${clk} ${c.low ? "low" : ""}"${ent(c.entity)} title="${escapeHtml(c.title)}">
            <span class="wrap">${cartridgeSvg(c.level, c.swatch, i)}${c.low ? '<span class="lowdot">!</span>' : ""}</span>
            <span class="pct">${c.level === null ? "?" : Math.round(c.level)}%</span>
            <span class="lbl">${escapeHtml(c.label)}</span>
          </div>`).join("")}</div>`;

    const corner = showPower ? `<div class="corner${clk} ${plugOn ? "on" : ""}"${ent(cfg.power_entity || cfg.plug_entity)}>
          ${plugOn !== null ? `<ha-icon icon="${plugOn ? "mdi:power-plug" : "mdi:power-plug-off"}"></ha-icon>` : ""}
          ${watts !== null ? `${watts.toFixed(watts >= 100 ? 0 : 1)} W` : ""}
        </div>` : "";

    const nf = new Intl.NumberFormat(lang(hass));
    const partsMarkup = parts.length === 0 ? "" : `<div class="parts">${parts.map((c) => `
          <span class="part${clk} ${c.low ? "low" : ""}"${ent(c.entity)} title="${escapeHtml(c.title)}">
            <span class="pname">${escapeHtml(c.label)}</span>
            <span class="pval">${c.level === null ? "?" : Math.round(c.level)}%</span>
            <i style="width:${Math.max(0, Math.min(100, c.level === null ? 0 : c.level)) * 0.42}px"></i>
          </span>`).join("")}</div>`;

    // A machine that only prints keeps the bare line it had; one that also
    // scans, copies or faxes gets a row per function, because "12 223" means
    // nothing without saying 12 223 of what.
    const fnKeys = counters ? ["print", "scan", "copy", "fax"].filter((fn) => counters[fn]) : [];
    const labelled = fnKeys.length > 1 || (fnKeys.length === 1 && fnKeys[0] !== "print");
    const countersMarkup = !counters ? "" : `<div class="counters">${fnKeys.map((fn) => {
      const g = counters[fn];
      return `<div class="crow">
            ${labelled ? `<span class="cfn">${t(hass, "fn_" + fn)}</span>` : ""}
            ${g.total !== null ? `<span class="${tappable ? "clickable" : ""}"${ent(g.ids.total)}><b>${nf.format(g.total)}</b> ${t(hass, "pages")}</span>` : ""}
            ${g.bw !== null ? `<span class="${tappable ? "clickable" : ""}"${ent(g.ids.bw)}><b>${nf.format(g.bw)}</b> ${t(hass, "pages_bw")}</span>` : ""}
            ${g.color !== null ? `<span class="${tappable ? "clickable" : ""}"${ent(g.ids.color)}><b>${nf.format(g.color)}</b> ${t(hass, "pages_color")}</span>` : ""}
          </div>`;
    }).join("")}</div>`;

    const buttons = [
      cfg.plug_entity && plugOn !== null
        ? `<button data-action="plug" title="${t(hass, plugOn ? "plug_off" : "plug_on")}"><ha-icon icon="${plugOn ? "mdi:power-plug-off" : "mdi:power-plug"}"></ha-icon><span>${t(hass, plugOn ? "plug_off" : "plug_on")}</span></button>`
        : "",
      cfg.print_entity
        ? `<button data-action="print" title="${t(hass, "print_btn")}"><ha-icon icon="mdi:printer-check"></ha-icon><span>${t(hass, "print_btn")}</span></button>`
        : "",
      url
        ? `<a class="btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="${t(hass, "web_btn")}"><ha-icon icon="mdi:open-in-new"></ha-icon><span>${t(hass, "web_btn")}</span></a>`
        : "",
    ].join("");

    this._root.innerHTML = `
      <style>
:host { --pc-color: ${color}; }
ha-card { position:relative; display:flex; flex-direction:column; gap:12px; padding:16px; }
ha-card.compact { padding:12px 16px; gap:10px; }
.top { display:flex; align-items:center; gap:16px; }
.illu { width:190px; max-width:64%; margin:0 auto; }
.illu svg { display:block; width:100%; }
ha-card.offline .illu { opacity:.55; }
.shell .fill { fill:${SHELL}; stroke:${SHELL_LINE}; stroke-width:1.6; }
.shell .recess { fill:${SHELL_DARK}; }
.shell .seam { stroke:${SHELL_LINE}; stroke-width:1.2; opacity:.55; }
.slot { fill:${PANEL}; }
.panel rect { fill:${PANEL}; }
.panel-lines rect { fill:${SHELL_LINE}; opacity:.9; }
.led { fill:var(--pc-color); }
.warn path { fill:var(--error-color, #f44336); stroke:${PAPER}; stroke-width:2.4; stroke-linejoin:round; paint-order:stroke; }
.warn .warn-bar { fill:${PAPER}; stroke:none; }
.sheet-clip { clip-path:url(#pc-slot); }
.sheet .sheet-page { fill:${PAPER}; stroke:${PAPER_LINE}; stroke-width:1.4; }
.sheet .sheet-text rect { fill:${PAPER_LINE}; }
.paper-stack { fill:${PAPER}; stroke:${PAPER_LINE}; stroke-width:1.4; }
.sheet { opacity:0; --pc-hidden:-56px; }
.printing .sheet { animation:pc-sheet 2.6s ease-in-out infinite; }
.sheet.jam { opacity:1; transform:translateY(calc(var(--pc-hidden) * .55)) rotate(-2.5deg); }
@keyframes pc-sheet {
  0%, 10% { transform:translateY(var(--pc-hidden)); opacity:1; }
  55%, 78% { transform:translateY(0); opacity:1; }
  92% { transform:translateY(0); opacity:0; }
  93% { transform:translateY(var(--pc-hidden)); opacity:0; }
  100% { transform:translateY(var(--pc-hidden)); opacity:1; }
}
.printing .led { animation:pc-blink 1s steps(1, end) infinite; }
@keyframes pc-blink { 50% { opacity:.2; } }
.sleep .led, .offline .led { animation:pc-breathe 3.4s ease-in-out infinite; }
@keyframes pc-breathe { 0%, 100% { opacity:.9; } 50% { opacity:.25; } }
.badge { flex:none; width:46px; height:46px; border-radius:50%; background:var(--pc-color); color:#fff; display:flex; align-items:center; justify-content:center; }
.badge ha-icon { --mdc-icon-size:27px; }
.printing .badge { animation:pc-pulse 1.6s ease-in-out infinite; }
@keyframes pc-pulse { 50% { opacity:.55; } }
.bottom { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; }
ha-card.compact .bottom { align-items:center; flex:1; }
.body { min-width:0; flex:1 1 auto; }
.name { font-size:15px; font-weight:500; color:var(--primary-text-color); }
.state { font-size:13.5px; font-weight:500; color:var(--pc-color); }
.msg { font-size:12px; color:var(--secondary-text-color); }
.msg.severe { color:var(--pc-color); }
.alert { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--warning-color, #ff9800); }
.alert ha-icon { --mdc-icon-size:17px; }
.corner { position:absolute; top:10px; right:12px; display:flex; align-items:center; gap:5px; font-size:12px; color:var(--secondary-text-color); z-index:2; }
.corner ha-icon { --mdc-icon-size:16px; }
.corner.on { color:var(--success-color, #4caf50); }
ha-card.compact .corner { position:static; flex:none; white-space:nowrap; }
/* A flex child with min-width:0 collapses to nothing on an over-full row and
   its text then paints over its neighbours. Compact rows are the ones that
   overflow, so there the text truncates and the buttons keep icons only. */
ha-card.compact .bottom { flex-wrap:wrap; row-gap:8px; }
ha-card.compact .name, ha-card.compact .state, ha-card.compact .msg {
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
ha-card.compact button, ha-card.compact .btn { min-width:0; padding:8px 10px; }
ha-card.compact button span, ha-card.compact .btn span { display:none; }
.actions { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; flex:0 0 auto; }
button, .btn { display:flex; align-items:center; justify-content:center; gap:6px; padding:8px 13px; border:none; border-radius:12px; cursor:pointer; font:inherit; font-size:13px; text-decoration:none; background:var(--secondary-background-color); color:var(--primary-text-color); }
button:hover, .btn:hover { filter:brightness(.93); }
button ha-icon, .btn ha-icon { --mdc-icon-size:18px; }
.supplies { display:flex; gap:8px; justify-content:space-around; }
.cart { flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center; gap:1px; }
.wrap { position:relative; display:block; }
.clickable { cursor:pointer; }
.body.clickable:hover .name, .clickable:hover .pct, .clickable:hover .pval { text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:2px; }
svg .clickable { cursor:pointer; }
.cart svg { display:block; width:30px; height:54px; }
.ink-track { fill:#d3d8de; }
.ink-cap { fill:${SHELL_LINE}; }
.ink-outline { fill:none; stroke:${SHELL_LINE}; stroke-width:1; }
.ink.low .ink-outline { stroke:var(--error-color, #f44336); stroke-width:1.6; }
.cart-track { fill:#d3d8de; }
.cart-outline { fill:none; stroke:${SHELL_LINE}; stroke-width:1.4; }
.lowdot { position:absolute; top:-2px; right:-4px; width:15px; height:15px; border-radius:50%; background:var(--error-color, #f44336); color:#fff; font-size:11px; font-weight:700; line-height:15px; text-align:center; }
.pct { font-size:12.5px; font-weight:600; color:var(--primary-text-color); }
.lbl { font-size:11px; color:var(--secondary-text-color); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%; }
.low .pct { color:var(--error-color, #f44336); }
.parts { display:flex; flex-wrap:wrap; gap:6px; }
.part { position:relative; display:flex; align-items:baseline; gap:5px; padding:4px 8px 7px; border-radius:8px; background:var(--secondary-background-color); font-size:11.5px; color:var(--secondary-text-color); }
.part .pval { font-weight:600; color:var(--primary-text-color); }
.part i { position:absolute; left:8px; bottom:3px; height:2px; border-radius:1px; background:var(--secondary-text-color); opacity:.55; }
.part.low { color:var(--error-color, #f44336); }
.part.low .pval { color:var(--error-color, #f44336); }
.part.low i { background:var(--error-color, #f44336); opacity:1; }
.counters { display:flex; flex-direction:column; gap:3px; font-size:12px; color:var(--secondary-text-color); }
.crow { display:flex; flex-wrap:wrap; gap:2px 12px; align-items:baseline; }
.cfn { flex:none; min-width:82px; }
.counters b { color:var(--primary-text-color); font-weight:600; }
.supplies.bars { flex-direction:column; gap:6px; }
.row-b { display:flex; align-items:center; gap:8px; }
.row-b .lbl { flex:none; width:88px; text-align:left; }
.row-b .pct { flex:none; width:38px; text-align:right; }
.bar { flex:1; height:8px; border-radius:4px; background:#d3d8de; position:relative; overflow:hidden; }
.bar i { display:block; height:100%; border-radius:4px; }
@media (prefers-reduced-motion: reduce) {
  .sheet, .led, .badge { animation:none !important; }
  .printing .sheet { opacity:1; transform:none; }
}
      </style>
      <ha-card class="${norm}${cfg.compact ? " compact" : ""}">
        ${cfg.compact ? "" : corner}
        <div class="top">
          ${cfg.compact
            ? `<div class="badge"><ha-icon icon="${STATE_ICONS[norm]}"></ha-icon></div>`
            : `<div class="illu">${printerSvg(norm, cfg, inside ? carts : null, noPaper)}</div>`}
          ${cfg.compact ? `<div class="bottom">
            <div class="body${clk}"${ent(cfg.entity)}>
              <div class="name">${escapeHtml(name)}</div>
              <div class="state" title="${escapeHtml(st ? String(st.state) : "")}">${t(hass, norm)}</div>
              ${msg ? `<div class="msg${msgSevere ? " severe" : ""}">${escapeHtml(msg)}</div>` : ""}
            </div>
            ${corner}
            <div class="actions">${buttons}</div>
          </div>` : ""}
        </div>
        ${cfg.compact ? "" : `<div class="bottom">
          <div class="body${clk}"${ent(cfg.entity)}>
            <div class="name">${escapeHtml(name)}</div>
            <div class="state" title="${escapeHtml(st ? String(st.state) : "")}">${t(hass, norm)}</div>
            ${msg ? `<div class="msg${msgSevere ? " severe" : ""}">${escapeHtml(msg)}</div>` : ""}
          </div>
          <div class="actions">${buttons}</div>
        </div>`}
        ${lows.length ? `<div class="alert"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t(hass, "alert_low")} : ${lows
            .map((c) => `${escapeHtml(c.label)} ${Math.round(c.level)}%`).join(", ")}</span></div>` : ""}
        ${lowParts.length ? `<div class="alert"><ha-icon icon="mdi:wrench-outline"></ha-icon><span>${t(hass, "alert_part")} : ${lowParts
            .map((c) => `${escapeHtml(c.label)} ${Math.round(c.level)}%`).join(", ")}</span></div>` : ""}
        ${cartMarkup}
        ${partsMarkup}
        ${countersMarkup}
      </ha-card>`;

    this._root.querySelectorAll("[data-entity]").forEach((el) => {
      const id = el.getAttribute("data-entity");
      if (!id) return;
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._moreInfo(id);
      });
    });
    this._root.querySelectorAll("button[data-action]").forEach((b) => {
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (b.dataset.action === "plug") this._togglePlug();
        else this._print();
      });
    });
  }
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

const EDITOR_PICKERS = [
  { field: "entity", domains: ["sensor"] },
  { field: "plug_entity", domains: ["switch", "input_boolean"] },
  { field: "power_entity", domains: ["sensor"] },
  { field: "print_entity", domains: ["button", "input_button", "script", "switch"] },
  { field: "paper_entity", domains: ["binary_sensor", "sensor"] },
];

class PrinterCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._maybeBuild();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._maybeBuild();
    else this._refreshPickersHass();
  }

  _maybeBuild() {
    if (!this._hass || !this._config || this._built) return;
    this._built = true;
    this._build();
  }

  _refreshPickersHass() {
    if (!this._root) return;
    this._root.querySelectorAll("ha-entity-picker").forEach((p) => {
      p.hass = this._hass;
    });
  }

  // A freshly created ha-entity-picker announces an empty value before it
  // knows its own, and Home Assistant calls setConfig again after every
  // config-changed we emit. Without this guard an echo can delete a
  // configured entity with nobody having touched anything.
  _acceptsPick(current, value) {
    const next = value || "";
    const held = current || "";
    if (next === held) return false;
    if (!next && held && !this._touched) return false;
    return true;
  }

  _wireTouchTracking() {
    if (this._touchWired) return;
    this._touchWired = true;
    for (const type of ["focusin", "pointerdown", "keydown"]) {
      this._root.addEventListener(type, () => { this._touched = true; });
    }
  }

  _emit() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _set(field, value) {
    this._config = { ...this._config };
    if (value === undefined || value === "" || value === null) delete this._config[field];
    else this._config[field] = value;
    this._emit();
  }

  _mountPicker(slotEl, field, domains) {
    if (!slotEl) return;
    const picker = document.createElement("ha-entity-picker");
    picker.hass = this._hass;
    picker.value = this._config[field] || "";
    picker.label = t(this._hass, field);
    if (domains) picker.includeDomains = domains;
    picker.addEventListener("value-changed", (ev) => {
      const value = ev.detail.value;
      if (!this._acceptsPick(this._config[field], value)) return;
      this._set(field, value);
    });
    slotEl.appendChild(picker);
  }

  _build() {
    if (!this._root) {
      this.attachShadow({ mode: "open" });
      this._root = this.shadowRoot;
    }
    const hass = this._hass;
    const cfg = this._config;
    const cartLines = (cfg.cartridges || [])
      .map((c) => (typeof c === "string" ? c : c && c.entity) || "")
      .filter(Boolean).join("\n");

    this._root.innerHTML = `
      <style>
.form { display:flex; flex-direction:column; gap:14px; padding:4px 0; }
.row label { display:block; font-size:13px; margin-bottom:4px; color:var(--secondary-text-color); }
.row input[type="text"], .row input[type="number"], .row select, .row textarea { width:100%; box-sizing:border-box; padding:8px; border-radius:6px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); font:inherit; }
.row textarea { min-height:72px; resize:vertical; font-family:var(--code-font-family, monospace); font-size:12.5px; }
.row-inline label { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--primary-text-color); }
details { border:1px solid var(--divider-color); border-radius:8px; padding:8px 12px; }
summary { cursor:pointer; font-size:13.5px; color:var(--secondary-text-color); }
details .form { padding-top:10px; }
      </style>
      <div class="form">
        <div class="row" data-picker="entity"></div>
        <div class="row" data-picker="plug_entity"></div>
        <div class="row" data-picker="power_entity"></div>
        <div class="row">
          <label>${t(hass, "name")}</label>
          <input type="text" data-field="name" value="${escapeHtml(cfg.name || "")}" />
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="show_supplies" ${cfg.show_supplies !== false ? "checked" : ""}/> ${t(hass, "show_supplies")}</label>
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="show_message" ${cfg.show_message !== false ? "checked" : ""}/> ${t(hass, "show_message")}</label>
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="show_parts" ${cfg.show_parts !== false ? "checked" : ""}/> ${t(hass, "show_parts")}</label>
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="show_counters" ${cfg.show_counters !== false ? "checked" : ""}/> ${t(hass, "show_counters")}</label>
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="show_power" ${cfg.show_power !== false ? "checked" : ""}/> ${t(hass, "show_power")}</label>
        </div>
        <div class="row row-inline">
          <label><input type="checkbox" data-field="more_info" ${cfg.more_info !== false ? "checked" : ""}/> ${t(hass, "more_info")}</label>
        </div>
        <details open>
          <summary>${t(hass, "section_look")}</summary>
          <div class="form">
            <div class="row">
              <label>${t(hass, "printer_type")}</label>
              <select data-field="printer_type">
                ${["mfp", "inkjet", "laser", "office"]
                  .map((v) => `<option value="${v}" ${(cfg.printer_type || "mfp") === v ? "selected" : ""}>${t(hass, "type_" + v)}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="row">
              <label>${t(hass, "cartridge_style")}</label>
              <select data-field="cartridge_style">
                ${["cartridges", "bars", "inside"]
                  .map((v) => `<option value="${v}" ${(cfg.cartridge_style || "cartridges") === v ? "selected" : ""}>${t(hass, "style_" + v)}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="row">
              <label>${t(hass, "language")}</label>
              <select data-field="language">
                <option value="auto" ${!cfg.language || cfg.language === "auto" ? "selected" : ""}>${t(hass, "language_auto")}</option>
                ${Object.entries(LANGUAGE_NAMES)
                  .map(([code, label]) => `<option value="${code}" ${cfg.language === code ? "selected" : ""}>${label}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="row row-inline">
              <label><input type="checkbox" data-field="compact" ${cfg.compact ? "checked" : ""}/> ${t(hass, "compact")}</label>
            </div>
          </div>
        </details>
        <details ${cfg.print_entity || cfg.paper_entity || cfg.web_url || cfg.cartridges || cfg.printing_watts || cfg.low_threshold ? "open" : ""}>
          <summary>${t(hass, "section_advanced")}</summary>
          <div class="form">
            <div class="row" data-picker="print_entity"></div>
            <div class="row" data-picker="paper_entity"></div>
            <div class="row">
              <label>${t(hass, "web_url")}</label>
              <input type="text" data-field="web_url" placeholder="auto" value="${escapeHtml(cfg.web_url || "")}" />
            </div>
            <div class="row">
              <label>${t(hass, "low_threshold")}</label>
              <input type="number" min="0" max="100" step="1" data-field="low_threshold" placeholder="20" value="${cfg.low_threshold ?? ""}" />
            </div>
            <div class="row">
              <label>${t(hass, "printing_watts")}</label>
              <input type="number" min="0" step="1" data-field="printing_watts" placeholder="0" value="${cfg.printing_watts ?? ""}" />
            </div>
            <div class="row">
              <label>${t(hass, "cartridges_hint")}</label>
              <textarea data-field="cartridges" spellcheck="false">${escapeHtml(cartLines)}</textarea>
            </div>
          </div>
        </details>
      </div>`;

    this._wireTouchTracking();
    for (const { field, domains } of EDITOR_PICKERS) {
      this._mountPicker(this._root.querySelector(`[data-picker="${field}"]`), field, domains);
    }

    this._root.querySelectorAll('input[type="text"][data-field]').forEach((el) => {
      el.addEventListener("change", () => this._set(el.dataset.field, el.value.trim()));
    });
    this._root.querySelectorAll('input[type="number"][data-field]').forEach((el) => {
      el.addEventListener("change", () => {
        const n = Number(el.value);
        this._set(el.dataset.field, el.value === "" || !Number.isFinite(n) ? undefined : n);
      });
    });
    this._root.querySelectorAll("select[data-field]").forEach((el) => {
      el.addEventListener("change", () => {
        const field = el.dataset.field;
        // Every select has a default -- only store the key when it differs,
        // so the YAML stays as short as what the user actually chose.
        const dflt = { printer_type: "mfp", cartridge_style: "cartridges", language: "auto" }[field];
        this._set(field, el.value === dflt ? undefined : el.value);
      });
    });
    this._root.querySelectorAll('input[type="checkbox"][data-field]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const field = cb.dataset.field;
        if (["show_supplies", "show_message", "show_power", "show_parts", "show_counters", "more_info"].includes(field)) {
          // defaults to true -- only store the key when disabled
          this._set(field, cb.checked ? undefined : false);
        } else {
          this._set(field, cb.checked ? true : undefined);
        }
      });
    });
    const ta = this._root.querySelector("textarea[data-field]");
    if (ta) ta.addEventListener("change", () => {
      const list = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
      this._set("cartridges", list.length ? list : undefined);
    });
  }
}

// ---------------------------------------------------------------------------

customElements.define("ha-printer-card", PrinterCard);
customElements.define("ha-printer-card-editor", PrinterCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-printer-card",
  name: "HA Printer Card",
  description: "Printer card: an animated sheet while it prints, ink or toner levels, low-cartridge alert and the printer's own status message.",
  preview: true,
  documentationURL: "https://github.com/ADNPolymerase/ha-printer-card",
});
