var socket = io();

let queryString = window.location.search;
let code = new URLSearchParams(queryString).get("code");

populateList = function (artikels) {
  let parent = document.getElementById("contain");
  parent.innerHTML = "";
  let child = document.createElement("h1");
  child.innerHTML = "Uitverkocht Scherm";
  parent.appendChild(child);
  let gc = document.createElement("div");
  gc.setAttribute("class", "grid-container");
  for (let i = 0; i < artikels.length; i++) {
    let p5 = document.createElement("label");
    p5.innerHTML = artikels[i].naam + ": ";
    p5.setAttribute("class", "name");
    gc.appendChild(p5);

    let button = document.createElement("button");
    button.setAttribute("class", "button");
    if (artikels[i].beschikbaar === "Ja") {
      button.innerHTML = "Uitverkocht!";
      button.onclick = () => {
        console.log(artikels[i].naam + " uitverkocht");
        socket.emit("uitverkochtmessage", {
          product: artikels[i].naam,
          value: "Nee",
        });
      };
    } else {
      button.innerHTML = "Weer beschikbaar!";
      button.onclick = () => {
        console.log(artikels[i].naam + " terug");
        socket.emit("uitverkochtmessage", {
          product: artikels[i].naam,
          value: "Ja",
        });
      };
    }
    gc.appendChild(button);
  }
  parent.appendChild(gc);
};

// Join a channel
socket.emit("join", "uitverkocht");
socket.on("servermessage", (msg) => {
  if (code == msg.code) {
    populateList(msg.data);
  }
});
