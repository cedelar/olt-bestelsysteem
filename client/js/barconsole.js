// Get WebSocket
var socket = io();

let queryString = window.location.search;
let code = new URLSearchParams(queryString).get("code");

klaarhandler = function (bestelling) {
  console.log(" is klaar");
  socket.emit("observermessage", bestelling);
};

populateList = function (bestellingen) {
  let parent = document.getElementById("contain");
  parent.innerHTML = "";
  let child = document.createElement("h1");
  child.innerHTML = "Actieve bestellingen";
  parent.appendChild(child);
  for (let i = 0; i < bestellingen.length; i++) {
    let child = document.createElement("h1");
    child.innerHTML = "Tafel " + bestellingen[i].tafel + ":";
    parent.appendChild(child);

    //bevestigbutton
    let button = document.createElement("button");
    button.setAttribute("class", "bevestigbutton");
    button.innerHTML = "Klaar";
    button.onclick = () => {
      klaarhandler(bestellingen[i]);
    };
    parent.appendChild(button);

    let gc = document.createElement("div");
    gc.setAttribute("class", "grid-container");
    for (let j = 0; j < bestellingen[i].bestelling.length; j++) {
      //empty
      let div0 = document.createElement("div");
      div0.setAttribute("class", "grid-item");
      gc.appendChild(div0);

      //naam
      let div1 = document.createElement("div");
      div1.setAttribute("class", "grid-item");
      let p = document.createElement("p");
      p.setAttribute("class", "name");
      p.innerHTML = bestellingen[i].bestelling[j].artikel.naam;
      div1.appendChild(p);
      //opties
      for (let z = 0; z < bestellingen[i].bestelling[j].opties.length; z++) {
        let p7 = document.createElement("p");
        p7.setAttribute("class", "optie");
        p7.innerHTML = bestellingen[i].bestelling[j].opties[z];
        div1.appendChild(p7);
      }
      gc.appendChild(div1);

      //aantal
      let div2 = document.createElement("div");
      div2.setAttribute("class", "grid-item");
      let p2 = document.createElement("p");
      p2.setAttribute("class", "price");
      p2.innerHTML = bestellingen[i].bestelling[j].aantal + "x";
      div2.appendChild(p2);
      gc.appendChild(div2);
    }
    //empty
    let div0 = document.createElement("div");
    div0.setAttribute("class", "grid-item-totaal");
    gc.appendChild(div0);

    //naam
    let div1 = document.createElement("div");
    div1.setAttribute("class", "grid-item-totaal");
    let p = document.createElement("p");
    p.setAttribute("class", "totaal");
    p.innerHTML = "Bonnen:";
    div1.appendChild(p);
    gc.appendChild(div1);

    //aantal
    let div2 = document.createElement("div");
    div2.setAttribute("class", "grid-item-totaal");
    let p2 = document.createElement("p");
    p2.setAttribute("class", "totaal");
    p2.innerHTML = bestellingen[i].prijs;
    div2.appendChild(p2);
    gc.appendChild(div2);
    parent.appendChild(gc);
  }
};

// Join a channel
socket.emit("join", "observer");
socket.on("servermessage", (msg) => {
  if (code == msg.code) {
    populateList(msg.data);
  }
});
