const PORT = process.env.PORT || 3001;

const users = [];

const app = require("express")();
app.use(require("helmet")());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  console.log(`${socket.id} has connected`);

  socket.on("video-offer", offer => {
    socket.broadcast.emit("video-offer", offer);
  });

  socket.on("video-answer", answer => {
    socket.broadcast.emit("video-answer", answer);
  });

  socket.on("candidate", candidate => {
    socket.broadcast.emit("candidate", candidate);
  });

  socket.on("join-room", room => {
    console.log("join-room", room);
    const user = addUser(socket.id, room);
    if (!user) {
      console.log("room full");
      socket.emit("join-room", false);
      return;
    }
    socket.join(user.room);
    socket.emit("join-room", true);
    console.log("users in room:", getUsersInRoom(user.room));
  });

  socket.on("end-call", () => {
    socket.broadcast.emit("end-call");
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
    console.log(removeUser(socket.id));
  });
});

function addUser(id, room) {
  if (getUsersInRoom(room).length >= 2) return null;
  const user = { id, room };
  users.push(user);
  return user;
}

function getUsersInRoom(room) {
  return users.filter(user => user.room === room);
}

function removeUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1);
}
