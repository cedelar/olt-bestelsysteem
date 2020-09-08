// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");
const bestellingcontroller = require("./bestellingcontroller.js")
  .Bestellingcontroller;

// Configuration
const PORT = process.env.PORT || 3000;
console.log(path.resolve("client"));

const pkey1 = 614253102;
const pkey2 = 111;

const code = 2626110280;

//data
const datawrapper = new bestellingcontroller();
fs.readFile("server/artikelen.txt", "utf8", (err, data) => {
  if (err) throw err;
  datawrapper.vulArtikelen(data);
});

// Start server
const server = express()
  .get("/", (req, res) => res.sendFile(path.resolve("client/html/index.html")))
  .use(express.static(path.resolve("client")))
  .listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = socketIO(server);

tafelHandler = function (socket, room) {
  socket.on("tafelmessage", (msg) => {
    datawrapper.addBestelling(msg);
    io.to("observer").emit("servermessage", datawrapper.getBestellingen());
  });
  socket.emit("servermessage", {
    data: datawrapper.getArtikelen(),
    key1: pkey1,
    key2: pkey2,
  });
};

observerHandler = function (socket, room) {
  socket.on("observermessage", (msg) => {
    datawrapper.removeBestelling(msg);
    socket.emit("servermessage", datawrapper.getBestellingen());
  });
  socket.emit("servermessage", {
    data: datawrapper.getBestellingen(),
    code: code,
  });
};

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    if (room === "tafel") {
      console.log("Join tafel");
      tafelHandler(socket, room);
    }

    if (room === "observer") {
      console.log("Join observer");
      observerHandler(socket, room);
    }
  });
});
