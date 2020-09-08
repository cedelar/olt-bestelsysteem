// Get WebSocket
var socket = io();

let bestelling = [];
let queryString = window.location.search;
let tafel = new URLSearchParams(queryString).get("id");
let controle = new URLSearchParams(queryString).get("c");

windowcontrole = function (k1, k2) {
  if (controle == (k1 % tafel) * k2) {
    return true;
  } else {
    return false;
  }
};

bevestigbuttonhandler = function (bonnen) {
  socket.emit("tafelmessage", {
    bestelling: bestelling,
    tafel: tafel,
    prijs: bonnen,
  });
  //confirmationscreen
  let parent = document.getElementById("contain");
  parent.innerHTML = "";
  let child = document.createElement("h1");
  child.innerHTML = "Tafel " + tafel + ": Ontvangen";
  parent.appendChild(child);

  let child2 = document.createElement("p");
  child2.innerHTML =
    "Uw bestelling is succesvol ontvangen, dit wordt zodadelijk naar uw tafel gebracht!";
  child2.setAttribute("class", "confirmtext");
  parent.appendChild(child2);

  let child3 = document.createElement("img");
  child3.setAttribute("src", "../../afbeeldingen/banner.png");
  child3.setAttribute("class", "banner");
  parent.appendChild(child3);

  //reloadbutton
  let button = document.createElement("button");
  button.setAttribute("class", "bestelbutton");
  button.innerHTML = "Bestel opnieuw";
  button.onclick = () => {
    annuleerbuttonhandler();
  };
  parent.appendChild(button);
};

annuleerbuttonhandler = function () {
  location.reload();
};

bestelbuttonhandler = function (artikelen) {
  //save bestelling
  for (let i = 0; i < artikelen.length; i++) {
    let input = document.getElementById(
      "input-" + artikelen[i].naam.replace(/\s/g, "-")
    ).value;
    if (input > 0) {
      bestelling.push({
        artikel: artikelen[i],
        aantal: input,
      });
    }
  }

  if (bestelling.length > 0) {
    //update bevestingingveld
    let parent = document.getElementById("contain");
    parent.innerHTML = "";

    let prijsCounter = 0;

    let child = document.createElement("h1");
    child.innerHTML = "Tafel " + tafel + ": Bevestiging";
    parent.appendChild(child);
    let gc = document.createElement("div");
    gc.setAttribute("class", "grid-container-2");
    //titelbalk
    //naam
    let div1 = document.createElement("div");
    div1.setAttribute("class", "grid-item-3");
    let p = document.createElement("p");
    p.setAttribute("class", "titel");
    p.innerHTML = "Artikel";
    div1.appendChild(p);
    gc.appendChild(div1);

    //aantal
    let div2 = document.createElement("div");
    div2.setAttribute("class", "grid-item-3");
    let p2 = document.createElement("p");
    p2.setAttribute("class", "titel");
    p2.innerHTML = "Aantal";
    div2.appendChild(p2);
    gc.appendChild(div2);

    //prijs
    let div3 = document.createElement("div");
    div3.setAttribute("class", "grid-item-3");
    let p3 = document.createElement("p");
    p3.setAttribute("class", "titel");
    p3.innerHTML = "Prijs";
    div3.appendChild(p3);
    gc.appendChild(div3);

    for (let i = 0; i < bestelling.length; i++) {
      //naam
      let div1 = document.createElement("div");
      div1.setAttribute("class", "grid-item-2");
      let p = document.createElement("p");
      p.setAttribute("class", "name");
      p.innerHTML = bestelling[i].artikel.naam;
      div1.appendChild(p);
      gc.appendChild(div1);

      //aantal
      let div2 = document.createElement("div");
      div2.setAttribute("class", "grid-item-2");
      let p2 = document.createElement("p");
      p2.setAttribute("class", "price");
      p2.innerHTML = bestelling[i].aantal + "x";
      div2.appendChild(p2);
      gc.appendChild(div2);

      //prijs
      let div3 = document.createElement("div");
      div3.setAttribute("class", "grid-item-2");
      let p3 = document.createElement("p");
      p3.setAttribute("class", "price");
      let prijs = bestelling[i].aantal * bestelling[i].artikel.prijs;
      prijsCounter += prijs;
      if (prijs === 1) {
        p3.innerHTML = prijs + " bon";
      } else {
        p3.innerHTML = prijs + " bonnen";
      }
      div3.appendChild(p3);
      gc.appendChild(div3);
    }
    //totaal
    //naam
    let div4 = document.createElement("div");
    div4.setAttribute("class", "grid-item-4");
    let p4 = document.createElement("p");
    p4.setAttribute("class", "titel");
    p4.innerHTML = "Totaal: ";
    div4.appendChild(p4);
    gc.appendChild(div4);

    //leeg
    let div5 = document.createElement("div");
    div5.setAttribute("class", "grid-item-4");
    gc.appendChild(div5);

    //prijs
    let div6 = document.createElement("div");
    div6.setAttribute("class", "grid-item-4");
    let p6 = document.createElement("p");
    p6.setAttribute("class", "titel");
    p6.innerHTML = prijsCounter + " bonnen";
    div6.appendChild(p6);
    gc.appendChild(div6);
    parent.appendChild(gc);

    //bevestigbutton
    let button = document.createElement("button");
    button.setAttribute("class", "bestelbutton");
    button.innerHTML = "Bevestig";
    button.onclick = () => {
      bevestigbuttonhandler(prijsCounter);
    };
    parent.appendChild(button);

    //annuleerbutton
    let button2 = document.createElement("button");
    button2.setAttribute("class", "bestelbutton");
    button2.innerHTML = "Annuleer";
    button2.onclick = () => {
      annuleerbuttonhandler();
    };
    parent.appendChild(button2);
  } else {
    console.log("Niks besteld");
  }
};

populateList = function (artikelen) {
  let categories = Array.from(new Set(artikelen.map((art) => art.categorie)));

  let parent = document.getElementById("contain");
  parent.innerHTML = "";
  let child = document.createElement("h1");
  child.innerHTML = "Tafel " + tafel + ": Bestelling";
  parent.appendChild(child);
  for (let i = 0; i < categories.length; i++) {
    let child = document.createElement("h1");
    child.innerHTML = categories[i];
    parent.appendChild(child);
    let soorten = artikelen.filter((art) => art.categorie === categories[i]);
    let gc = document.createElement("div");
    gc.setAttribute("class", "grid-container");
    for (let j = 0; j < soorten.length; j++) {
      //image
      let div1 = document.createElement("div");
      div1.setAttribute("class", "grid-item");
      let img = document.createElement("img");
      img.setAttribute("src", soorten[j].link);
      img.setAttribute("class", "artikel");
      div1.appendChild(img);
      gc.appendChild(div1);

      //empty
      let div2 = document.createElement("div");
      div2.setAttribute("class", "grid-item");
      gc.appendChild(div2);

      //text
      let div3 = document.createElement("div");
      div3.setAttribute("class", "grid-item");
      let p1 = document.createElement("p");
      p1.innerHTML = soorten[j].naam;
      p1.setAttribute("class", "name");
      div3.appendChild(p1);
      let p3 = document.createElement("p");
      p3.innerHTML = soorten[j].beschrijving;
      p3.setAttribute("class", "description");
      div3.appendChild(p3);
      let p2 = document.createElement("p");
      p2.innerHTML = soorten[j].prijs + " bonnen";
      p2.setAttribute("class", "price");
      div3.appendChild(p2);
      let pre = document.createElement("pre");
      pre.innerHTML =
        "Aantal: <input id=input-" +
        soorten[j].naam.replace(/\s/g, "-") +
        ' type="number" value="0" min="0"> ';
      div3.appendChild(pre);
      gc.appendChild(div3);
    }
    parent.appendChild(gc);
  }
  let button = document.createElement("button");
  button.setAttribute("class", "bestelbutton");
  button.innerHTML = "Bestel!";
  button.onclick = () => {
    bestelbuttonhandler(artikelen);
  };
  parent.appendChild(button);
};

// Join a channel
socket.emit("join", "tafel");
socket.on("servermessage", (msg) => {
  if (!(msg.size === 0)) {
    if (windowcontrole(msg.key1, msg.key2)) {
      populateList(msg.data);
    }
  }
});
