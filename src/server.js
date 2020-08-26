const PORT = process.env.PORT || 3001;

const app = require("express")();
app.use(require("helmet")());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  console.log(`${socket.id} has connected`);

  socket.on("video-offer", offer => {
    console.log("video-offer");
    socket.broadcast.emit("video-offer", offer);
  });

  socket.on("video-answer", answer => {
    console.log("video-answer");
    socket.broadcast.emit("video-answer", answer);
  });

  socket.on("candidate", candidate => {
    console.log("candidate");
    socket.broadcast.emit("candidate", candidate);
  });

  socket.on("join-room", room => {
    console.log("join-room", room);
    socket.join(room);
  });

  socket.on("end-call", () => {
    console.log("end-call");
    socket.broadcast.emit("end-call");
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
  });
});
