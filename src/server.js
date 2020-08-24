const PORT = process.env.PORT || 3000;

const app = require("express")();
app.use(require("helmet")());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  console.log(`${socket.id} has connected`);
});
