let anzArtikel = 0;
class Artikel {
    constructor(name, beschreibung, kategorie, preis, bild) {
        this.artikelnr = ++anzArtikel;
        this.name = name;
        this.beschreibung = beschreibung;
        this.kategorie = kategorie;
        this.preis = Math.round(preis * 100) / 100; // Auf 2 Nachkommastellen runden
        this.bild = bild;
    }

}

const artikelliste = [
    new Artikel("Tasse", "Weiße Tasse mit OnlineShop-Logo.", "Werbeartikel", 2.99, "img/tasse.png"),
    new Artikel("Laptop", "Moderner, stylischer Laptop in silber.", "Elektronik", 799.99, "img/laptop.png"),
    new Artikel("Fußball", "Etwas rundes, was ins Eckige muss.", "Sport", 14.79, "img/fussball.png"),
    new Artikel("Stift", "Kugelschreiber mit Logo des OnlineShops.", "Werbeartikel", 0.69, "img/pen.png"),
    new Artikel("USB-Stick", "Mit 128 GB Speicherplatz.", "Werbeartikel", 4.99, "img/usb.png"),
    new Artikel("Tennis-Set", "Set aus 2 Schlägern und einem Ball.", "Sport", 23.89, "img/tennis.png"),
    new Artikel("Handy", "Elegantes Handy in schwarzem Gehäuse.", "Elektronik", 499.99, "img/handy.png"),
    new Artikel("Toaster", "Einstellbar, für die perfekte Röstung.", "Elektronik", 49.99, "img/toaster.png"),
    new Artikel("Kaffee maschine", "Für excellent aufgebrühten Kaffe.", "Elektronik", 119.99, "img/kaffee.png"),
    new Artikel("Volleyball", "Perfekt für den Strandbesuch.", "Sport", 12.49, "img/volleyball.png"),
    new Artikel("Football", "Aus Leder, für gute Langlebigkeit.", "Sport", 17.49, "img/football.png"),
    new Artikel("Football-Helm", "Einfacher Helm zum Football spielen.", "Sport", 35.97, "img/helm.png")
];

module.exports = artikelliste;