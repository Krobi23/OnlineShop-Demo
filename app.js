const express = require("express");
const session = require("express-session");
const app = express();

// Logik importieren:
const artikelliste = require("./logik/artikel");
const users = require("./logik/user");

// Vorbereitung:
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routing:
// Startseite aufrufen
app.get("/", (req, res) => {
    let eingeloggt = (req.session.userId != null); // Auch false bei undefined
    res.render("index", { eingeloggt });
});

// Impressum und Datenschutz
app.get("/datenschutz", (req, res) => {
    let eingeloggt = (req.session.userId != null);
    res.render("datenschutz", { eingeloggt });
});

// Shopseite aufrufen
app.get("/shop", (req, res) => {
    let eingeloggt = (req.session.userId != null);
    let liste = artikelliste;

    // Falls Suchanfrage existiert
    if(req.query.suche) {
        let suchbegriff = req.query.suche.toLowerCase();
        liste = artikelliste.filter(a => a.name.toLowerCase().includes(suchbegriff));
    }

    // Falls Nachricht existiert
    let message = req.session.message;
    if(message != null) {
        req.session.message = null; // Messege löschen
    } else {
        message = false;
    }

    res.render("shop", { eingeloggt, artikelliste: liste, message });
});

// Suchanfrage im Shop
app.post("/suche", (req, res) => {
    let suchbegriff = req.body.suchanfrage.toLowerCase();
    if(suchbegriff) {
        res.redirect("/shop?suche=" + suchbegriff); // Setzt auch bisher eingestellte Filter zurück (wichtig!)
    } else {
        res.redirect("/shop");
    }
});

// zum Warenkorb hinzufügen
app.post("/hinzufuegen", (req, res) => {
    if(req.session.userId != null) {
        const artikelnummer = parseInt(req.body.artikelnr);
        let user = users.liste.find(u => u.id === req.session.userId); // User der Anfrage ermitteln
        const imWarenkorb = user.warenkorb.find(w => w.artikel.artikelnr === artikelnummer) != null;
        const neuerArtikel = artikelliste.find(a => a.artikelnr === artikelnummer);
        if(!imWarenkorb) {
            user.in_den_Warenkorb(neuerArtikel);
            req.session.message = "Artikel: " + neuerArtikel.name + " wurde dem Warenkorb hinzugefügt"
        } else {
            req.session.message = "Artikel: " + neuerArtikel.name + " ist bereits im Warenkorb"
        }

        // URL-query wieder aufbauen
        const query = new URLSearchParams(req.body).toString();
        // Artikelnummer aus query entfernen
        const parameter = new URLSearchParams(query);
        parameter.delete("artikelnr");

        if(query) { // Nur wenn noch Parameter übrig
            res.redirect("/shop?" + parameter);
        } else {
            res.redirect("/shop");
        }
    }
});

// Warenkorb abrufen
app.get("/warenkorb", (req, res) => {
    let eingeloggt = (req.session.userId != null);
    if(!eingeloggt) {
        res.render("forbidden", { eingeloggt });
    } else {
        let user = users.liste.find(u => u.id === req.session.userId);

        // Falls Nachricht existiert
        let message = req.session.message;
        if(message != null) {
            req.session.message = null; // Messege löschen
        } else {
            message = false;
        }

        res.render("warenkorb", { eingeloggt, warenkorb: user.warenkorb, message });
    }
});

// Anzahl im Warenkorb ändern
app.post("/anzahl", (req, res) => {
    if(req.session.userId != null) {
        const artikelnummer = parseInt(req.body.artikelnr);
        const neueAnzahl = parseInt(req.body.anzahl);
        let user = users.liste.find(u => u.id === req.session.userId); // User der Anfrage ermitteln

        const index = user.warenkorb.findIndex(w => w.artikel.artikelnr === artikelnummer);

        if(index !== -1) {  // Anzahl im Warenkorb anpassen
            user.warenkorb[index].anzahl = neueAnzahl;
        }

        res.redirect("/warenkorb");
    }
})

// aus Warenkorb entfernen
app.post("/entfernen", (req, res) => {
    if(req.session.userId != null) {
        const artikelnummer = parseInt(req.body.artikelnr);
        let user = users.liste.find(u => u.id === req.session.userId); // User der Anfrage ermitteln
        
        const geloeschterArtikel = artikelliste.find(a => a.artikelnr === artikelnummer);
        user.artikelEntf(artikelnummer);

        req.session.message = "Artikel: " + geloeschterArtikel.name + " wurde aus dem Warenkorb entfernt";
       
        res.redirect("/warenkorb");
    }
});

// "Bestellen", bzw. Einkaufswagen leeren
app.post("/bestellen", (req, res) => {
    if(req.session.userId != null) {
        let user = users.liste.find(u => u.id === req.session.userId); // User der Anfrage ermitteln
        user.warenkorbLeeren();
        req.session.message = "Die Demo-Bestellung wurde abgeschlossen";
        res.redirect("/warenkorb");
    }
});

// Login-Seite abrufen
app.get("/login-form", (req, res) => {
    let eingeloggt = (req.session.userId != null);
    if(eingeloggt) {
        res.render("forbidden", { eingeloggt });
    } else {
        res.render("login", { eingeloggt, falscheingabe: false});
    }
});

// Login-Anfragen
app.post("/login", (req, res) => {
    // Daten aus dem Anfrage-Body holen
    const username = req.body.username;
    const password = req.body.password;
    // Prüfen ob User existiert
    const user = users.liste.find(u => u.username === username && u.password === password);

    if(!user) { // Kein User gefunden
        res.status(401).render("login", { eingeloggt: false, falscheingabe: true });
    } else {
        req.session.userId = user.id;
        res.redirect("/shop");
    }
});

// Register-Seite abrufen
app.get("/register-form", (req, res) => {
    let eingeloggt = (req.session.userId != null);
    if(eingeloggt) {
        res.render("forbidden", { eingeloggt });
    } else {
        res.render("register", { eingeloggt, falscheingabe: false});
    }
});

// Register-Anfragen
app.post("/register", (req, res) => {
    // Daten aus dem Anfrage-Body holen
    const username = req.body.username;
    const password = req.body.password;
    // Prüfen ob Nutzername bereits existiert
    const nameVergeben = users.liste.find(u => u.username === username);

    if(nameVergeben) {
        res.status(401).render("register", { eingeloggt: false, falscheingabe: true });
    } else {
        users.addUser(username, password);
        res.redirect("/login-form");
    }
});

// Logout
app.post("/logout", (req, res) => {
    if(req.session.userId != null) {
        req.session.destroy();
        res.render("logout", { eingeloggt: false });
    }
});

// Error 404
app.use((req, res) => {
    res.status(404).render("error");
});

// Lauschen:
app.listen(8020, () => {
    console.log("URL: http://localhost:8020");
});