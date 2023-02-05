var express = require("express");
var router = express.Router();
const http = require("http");
const WebSocket = require("ws");

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

/* GET home page. */
router.post("/", function (req, res, next) {
  // Get the index.html file from the views folder
  res.render("chat.html", { emoji: "Alex" });
});

module.exports = router;
