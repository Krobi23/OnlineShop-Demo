class Ware {
    constructor(artikel) {
        this.artikel = artikel;
        this.anzahl = 1;
    }
}

let anzUser = 0;
class User {
    constructor(username, password) {
        this.id = ++anzUser;
        this.username = username;
        this.password = password;
        this.warenkorb = [];
    }

    in_den_Warenkorb(artikel) {
        this.warenkorb.push(new Ware(artikel));
    }

    artikelEntf(artikelnr) {
        const index = this.warenkorb.findIndex(w => w.artikel.artikelnr === artikelnr);
        if(index !== -1) {
            this.warenkorb.splice(index, 1); // Entfernt Artikel mit selber Artikelnr
        }
    }

    warenkorbLeeren() {
        this.warenkorb.splice(0, this.warenkorb.length);
    }
}

let userliste = [new User("admin", "admin123")];

function addUser(username, password) {
    userliste.push(new User(username, password));
}

module.exports = { liste: userliste, addUser };