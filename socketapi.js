const io = require("socket.io")();
const socketapi = {
  io: io,
};

io.on("connection", (socket) => {
  socket.on("join", (clientInfo) => {
    console.log(clientInfo);
    let room = clientInfo["room"];
    socket.user = clientInfo["user"];
    socket.join(room);
  });
  socket.on("chat message", (msg) => {
    let room = msg["room"];
    let message = msg["message"];
    io.to(room).emit(
      "chat message",
      `USER[${socket.id.slice(0, 6)}]:   ${message}`
    );
  });
});

module.exports = socketapi;
