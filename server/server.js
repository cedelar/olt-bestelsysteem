// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");
const bodyParser = require('body-parser');
const bestellingcontroller = require("./bestellingcontroller.js")
  .Bestellingcontroller;

// Configuration
const PORT = process.env.PORT || 3000;
console.log(path.resolve("client"));
/* 
const pkey1 = 614253102;
const pkey2 = 111; */

const pkey1 = 383408195;
const pkey2 = 409;

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
  .get("/artikelen", function (req, res){
    res.json(datawrapper.getArtikelen())
  })
  .use(bodyParser.json())
  .post('/bestel',(req,res) => {
    res.json(datawrapper.addBestellingAuth(req.body, pkey1, pkey2));
    io.to("observer").emit("servermessage", {
      data: datawrapper.getBestellingen(),
      code: code,
    });
  })
  .use(express.static(path.resolve("client")))
  .listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = socketIO(server);

tafelHandler = function (socket, room) {
  socket.on("tafelmessage", (msg) => {
    datawrapper.addBestelling(msg);
    io.to("observer").emit("servermessage", {
      data: datawrapper.getBestellingen(),
      code: code,
    });
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
    socket.emit("servermessage", {
      data: datawrapper.getBestellingen(),
      code: code,
    });
  });
  socket.emit("servermessage", {
    data: datawrapper.getBestellingen(),
    code: code,
  });
};

uitverkochtHandler = function (socket, room) {
  socket.on("uitverkochtmessage", (msg) => {
    datawrapper.setBeschikbaar(msg.product, msg.value);
    io.to("uitverkocht").emit("servermessage", {
      data: datawrapper.getArtikelen(),
      code: code,
    });
  });
  socket.emit("servermessage", {
    data: datawrapper.getArtikelen(),
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

    if (room === "uitverkocht") {
      console.log("Join uitverkocht");
      uitverkochtHandler(socket, room);
    }
  });
});
