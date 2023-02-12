const io = require("socket.io")();
const socketapi = {
  io: io,
};

io.on("connection", (socket) => {
  socket.on("join", (clientInfo) => {
    let room = clientInfo["room"];
    socket.join(room);
  });

  socket.on("chat message", (msg) => {
    let resp = {};
    let room = msg["room"];
    let message = msg["message"];
    let id = socket.id;
    //Time that shows the hour, minutes but not seconds
    let time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    //Create a json object to send to the client
    resp["message"] = message;
    resp["id"] = id;
    //Send the message to the client
    io.to(room).emit(
      "chat message",
      JSON.stringify({ message: message, id: id, time: time })
    );
  });
});

module.exports = socketapi;
