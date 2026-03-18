// Preis formatieren
function formatPreis(preis) {
    let ausgabe = preis.toFixed(2);
    ausgabe = ausgabe.replace(".", ",");
    return ausgabe + "€";
}

// Konstruktorfunktion für Filter
class Filter {
    constructor(name, unterkategorien, funktion) {
        this.name = name;
        this.unterkategorien = unterkategorien;
        this.funktion = funktion;
    }
}

// Funktion um Produktvisitenkarten erstellen
const bildformat = 120;
function visitenkarteErstellen(liste) {
    // Angezeigte Visitenkarten entfernen
    document.querySelector("#shop").replaceChildren();
    // Leere Suchanfrage abfangen
    if(liste.length === 0) {
        let h2 = document.createElement("h2");
        h2.textContent = "Die Suchanfrage hat keine Treffer ergeben." 
        h2.style.textAlign = "center";
        h2.style.width = "100%";
        document.querySelector("#shop").append(h2);
    }
    // Visitenkarten neu erzeugen
    liste.forEach(a => {
        // Visitenkarte erstellen
        let karte = document.createElement("section");
        karte.className = "visitenkarte";
        // Bild erstellen
        let bild = document.createElement("img");
        bild.src = a.bild;
        bild.alt = a.name;
        bild.width = bildformat
        bild.height = bildformat;
        karte.append(bild);

        // Produktinformationen
        let info = document.createElement("div");
        info.className = "produktinfos";
         // Produktname
        let produktname = document.createElement("div");
        produktname.className = "produktname";
        let h3 = document.createElement("h3");
        h3.textContent = a.name;
        produktname.append(h3);
        info.append(produktname);
        // Preis
        let preis = document.createElement("div");
        preis.className = "preis";
        let p = document.createElement("p");
        p.textContent = formatPreis(a.preis);
        preis.append(p);
        info.append(preis);
        // Produktbeschreibung
        let beschreibung = document.createElement("p");
        beschreibung.textContent = a.beschreibung;
        info.append(beschreibung);
        if(eingeloggt) {
            // In Warenkorb hinzufügen Formular
            let wk = document.createElement("form");
            wk.className = "produkt-hinzu";
            wk.action = "/hinzufuegen";
            wk.method = "POST";
            // Artikelnummer zum Abschicken
            let nr = document.createElement("input");
            nr.type = "hidden";
            nr.name = "artikelnr";
            nr.value = a.artikelnr;
            wk.append(nr);
            // URL-query zerlegen und in Formular-Body mitgeben
            let parameter = new URLSearchParams(window.location.search);
            parameter.forEach((value, key) => {
                let input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                wk.append(input);
            })
            // Submit-Button
            let btn = document.createElement("input");
            btn.type = "submit";
            btn.value = "In den Warenkorb ▶";
            wk.append(btn);
            info.append(wk);
        }
        karte.append(info);

        // Ins DOM einfügen
        document.querySelector("#shop").append(karte);
    });
}

// Sortier- und Filterfunktionen
// Alphabetisch sortieren
function alphabetisch(liste) {
    return liste.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}
// Aufsteigend nach Preis sortieren
function aufsteigend(liste) {
    return liste.sort((x, y) => x.preis - y.preis);
}
// Absteigend nach Preis sortieren
function absteigend(liste) {
    return liste.sort((x, y) => y.preis - x.preis);
}
// Sortiermethode auswählen (für Event-Listener)
function setSort(methode) {
    const url = new URL(window.location);
    url.searchParams.set("sort", methode);
    window.location = url; // Seite neu laden
}
// Nach Kategorien filtern
function zeigeKategorie(liste, kategorie) {
    const erg = liste.filter(a => a.kategorie.toLowerCase() === kategorie.toLowerCase());
    return erg;
}
// Kategoriefilter auswählen
function setFilter(kategorie) {
    const url = new URL(window.location);
    url.searchParams.set("kategorie", kategorie);
    window.location = url; // Seite neu laden
}
// Template zum erstellen von Kategoriefiltern
function neuerKategoriefilter(kategorie) {
    return new Filter(kategorie, undefined, () => setFilter(kategorie.toLowerCase()));
}

// Filterliste mit Funktionszuweisungen
const filterliste = [
    new Filter("Sortieren", [
        new Filter("Alphabetisch", undefined, () => setSort("alpha")), 
        new Filter("Preis (aufsteigend)", undefined, () => setSort("asc")), 
        new Filter("Preis (absteigend)", undefined, (liste) => setSort("desc"))
    ]),
    new Filter("Kategorien", [
        new Filter("Alle", undefined, () => {
            const url = new URL(window.location);
            url.searchParams.delete("kategorie");    // kategorie aus query entfernen
            window.location = url; // Seite neu laden
        }),
        neuerKategoriefilter("Elektronik"), 
        neuerKategoriefilter("Sport"), 
        neuerKategoriefilter("Werbeartikel")
    ])
];

// Alle Unterfilter schliessen
function clearFilter() {
    let dds = document.querySelectorAll("dd");
    dds.forEach(dd => {
        dd.remove();
    });
    // li-Elemente für Mobile ansicht
    let lis = document.querySelectorAll("li");
    lis.forEach(li => {
        li.remove();
    });
}
// Merken welcher Filter offen ist
let currFilter = null;
// Unterfilter öffnen
function openFilter(filter, dt) {
    // Alle offenen Unterfilter schliessen
    clearFilter();
    // Filter ist geöffnet
    if(currFilter === dt) {
        currFilter.removeAttribute("class");  // Geschlossenen Filter nicht mehr highlighten
        currFilter = null;
        return;
    }
    if(currFilter !== null) {  // Alten Filter nicht mehr highlighten
        currFilter.removeAttribute("class");
    }
    // Zeiger zu anhängen der dd-Elemente
    let zeiger = dt;
    // Filter ist nicht geöffnet
    filter.unterkategorien.forEach(unter => {
        let dd = document.createElement("dd");
        dd.textContent = unter.name;
        dd.addEventListener("click", () => unter.funktion(artikelliste));
        zeiger.after(dd);
        zeiger = dd;
        // li-Elemente für Mobile ansicht
        let li = document.createElement("li");
        li.textContent = unter.name;
        li.addEventListener("click", () => unter.funktion(artikelliste));
        document.querySelector("ul").append(li);
    });
    currFilter = dt;
    currFilter.className = "active-filter";  // Neuen Filter highlighten
}

// --- Seite aufbauen ---
// Filter einfügen
filterliste.forEach((filter) => {
    let dt = document.createElement("dt");
    dt.textContent = filter.name;
    dt.addEventListener("click", () => openFilter(filter, dt));
    document.querySelector("dl").append(dt);
});

// Parameter aus der query der URL holen
const parameter = new URLSearchParams(window.location.search);
// Artikellsite kopieren
let gefilterteArtikel = [...artikelliste];

// Kategorie filtern
if(parameter.get("kategorie")) {
    gefilterteArtikel = zeigeKategorie(gefilterteArtikel, parameter.get("kategorie"));
}

// Sortiermethode durchführen
if(parameter.get("sort") === "alpha") {
    gefilterteArtikel = alphabetisch(gefilterteArtikel);
} else if(parameter.get("sort") === "asc") {
    gefilterteArtikel = aufsteigend(gefilterteArtikel);
} else if((parameter.get("sort") === "desc")) {
    gefilterteArtikel = absteigend(gefilterteArtikel);
}

// Visitenkarten erstellen
visitenkarteErstellen(gefilterteArtikel);

// Zu grosse Überschriften markieren
document.querySelectorAll(".produktname > h3").forEach(h3 => {
    if(h3.offsetWidth > 100) {
        h3.className = "zu-gross";
    }
})