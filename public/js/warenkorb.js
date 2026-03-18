const versand = 4.49;
const warenkorbLeer = warenkorb.length === 0;

// Preis formatieren
function formatPreis(preis) {
    let ausgabe = preis.toFixed(2);
    ausgabe = ausgabe.replace(".", ",");
    return ausgabe + " €";
}

// Warenpreis berechnen
function warenpreis(ware) {
    return ware.anzahl * ware.artikel.preis;
}

// Gesamtpreis berechnen
function gesamtpreis(warenkorb) {
    let sum = 0.0;
    warenkorb.forEach(w => {
        sum += warenpreis(w);
    });
    return sum;
}

// Preise nach änderung der Anzahl anpassen
function refreshPreise() {
    let bestellsummeText = "Ihre Bestellsumme beträgt ";
    if(warenkorbLeer) {
        document.querySelector("#oben > h2").textContent = bestellsummeText + formatPreis(0.0);
        document.querySelector("#oben > p").textContent = "Kostenloser Versand ab Bestellwert von 40,00 €";
    } else {
        const zwischensumme = gesamtpreis(warenkorb);
        const versandkosten = zwischensumme < 40.0 ? versand : 0;
        const bestellsumme = zwischensumme + versandkosten;
        // Bestellsumme in der Überschrift
        document.querySelector("#oben > h2").textContent = bestellsummeText + formatPreis(bestellsumme);
        // Versandinfo in der Überschrift
        document.querySelector("#oben > p").textContent = versandkosten === 0 ? "Kostenloser Versand" : ("inkl. " + formatPreis(versandkosten) + " Versandkosten");
        //Kostentabelle im unteren Teil
        document.querySelector("#zwsum > td:last-child").textContent = formatPreis(zwischensumme);
        document.querySelector("#versand > td:last-child").textContent = formatPreis(versandkosten);
        document.querySelector("#total > td:last-child").textContent = formatPreis(bestellsumme);
    }
}

// Produkte im Warenkorb anzeigen
function zeigeWarenkorb(warenkorb) {
    refreshPreise();
    // Meldung, falls Warenkorb leer
    if(warenkorbLeer) {
        let p = document.createElement("p");
        p.textContent = "Ihr Warenkorb ist leer.";
        p.style.textAlign = "center";
        p.style.fontSize = "24px";
        document.querySelector("#mitte").append(p);
        return;
    }
    warenkorb.forEach(w => {
        let produkt = document.createElement("div");
        produkt.className = "produkt";
        // Bild
        let bild = document.createElement("div");
        bild.className = "bild";
        let img = document.createElement("img");
        img.src = w.artikel.bild;
        img.alt = w.artikel.name;
        img.width = "120";
        img.heigth = "120";
        bild.append(img);
        let name = document.createElement("h3");
        name.textContent = w.artikel.name;
        bild.append(name);
        produkt.append(bild);
        // Anzahl
        let anzahl = document.createElement("form");
        anzahl.action = "/anzahl";
        anzahl.method = "POST";
        anzahl.className = "anzahl";
        // Artikelnummer für die Änderung mitgeben
        let anr = document.createElement("input");
        anr.type = "hidden";
        anr.name = "artikelnr";
        anr.value = w.artikel.artikelnr;
        anzahl.append(anr);
        // Dropdown-Menü für die Anzahl
        let select = document.createElement("select");
        select.name = "anzahl";
        // 1-10 Stück zur Auswahl geben
        for(let i=1; i <= 10; i++) {
            let option = document.createElement("option");
            let ii = i.toString();
            option.value = ii;
            option.textContent = ii;
            if(i === w.anzahl) {    // ausgewählte anzahl ist eingestellt
                option.selected = true;
            }
            select.append(option);
        }
        anzahl.append(select);
        produkt.append(anzahl);
        // Preis
        let preisDiv = document.createElement("div");
        preisDiv.className = "preis";
        let preis = document.createElement("h3");
        preis.textContent = formatPreis(warenpreis(w));
        preisDiv.append(preis);
        // Entfernen Formular
        let form = document.createElement("form");
        form.action = "entfernen";
        form.method = "POST";
        // Artikelnummer zum Abschicken
        let nr = document.createElement("input");
        nr.type = "hidden";
        nr.name = "artikelnr";
        nr.value = w.artikel.artikelnr;
        form.append(nr);
        // Submit-Button
        let entf = document.createElement("input");
        entf.type = "submit";
        entf.value = "Entfernen";
        form.append(entf);
        preisDiv.append(form);
        produkt.append(preisDiv);
        // Event Listener für Dropdown
        select.addEventListener("change", (e) => {   // Anzahl ändern
            w.anzahl = parseInt(e.target.value);
            preis.textContent = formatPreis(warenpreis(w));
            refreshPreise();
            // Anzahl-Formular abschicken
            anzahl.submit();
        });
        // Ins DOM einfügen
        document.querySelector("#mitte").append(produkt);
    });
}

zeigeWarenkorb(warenkorb);