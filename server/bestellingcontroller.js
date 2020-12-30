class Bestellingcontroller {
  constructor() {
    this._bestellingen = [];
  }

  vulArtikelen(data) {
    this._artikelen = new Array();
    let artikellijnen = data.split("\r\n");
    artikellijnen.forEach((element) => {
      let delen = element.split("  ");
      this._artikelen.push({
        naam: delen[0],
        prijs: delen[1],
        link: "../../afbeeldingen/" + delen[0] + ".jpg",
        categorie: delen[2],
        beschrijving: delen[3],
        opties: delen[4],
        beschikbaar: "Ja",
      });
    });
    console.log(this._artikelen);
  }

  getArtikelen() {
    return this._artikelen;
  }

  addBestellingAuth(data, k1, k2){
    console.log(data)
    if (data.controle == (k1 % data.tafel) * k2) {
      this.addBestelling(data);
      return {status: "OK",
    reason: ""}
    } else {
      return {status: "NOK",
              reason: "Code onjuist"
            };
    }  
  }

  addBestelling(data) {
    if (data == null) {
      console.log("Error: null");
    }
    console.log("Bestelling tafel " + data.tafel);
    for (let i = 0; i < data.bestelling.length; i++) {
      console.log(data.bestelling[i]);
    }
    console.log("-----------------------------");
    this._bestellingen.push(data);
  }

  setBeschikbaar(naam, value) {
    console.log(naam + " " + value);
    this._artikelen.filter((a) => a.naam === naam)[0].beschikbaar = value;
    console.log(this._artikelen.filter((a) => a.naam === naam)[0].beschikbaar);
  }

  removeBestelling(bestelling) {
    if (bestelling == null) {
      console.log("Error: null");
    }
    return this._bestellingen.splice(
      this._bestellingen.findIndex((el) => deepEqual(el, bestelling)),
      1
    );
  }

  getBestellingen() {
    return this._bestellingen;
  }

  printBestellingen() {
    console.log("Bestellingen:");
    for (let i = 0; i < this._bestellingen.length; i++) {
      console.log(this._bestellingen[i]);
    }
    console.log("---------------------------------");
  }
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}

module.exports = {
  Bestellingcontroller: Bestellingcontroller,
};
