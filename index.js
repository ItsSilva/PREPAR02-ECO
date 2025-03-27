const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  // This is a Socket.io instance on our server
  path: "/rea-time",
  cors: { origin: "*" },
});

app.use(express.json());
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let users = [];

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", (req, res) => {
  const dataUser = req.body;

  if (!dataUser.name || !dataUser.email || !dataUser.password) {
    return res.status(400).send({ message: "All fields are required" });
  }
  const userExists = users.some((user) => user.email === dataUser.email);
  if (userExists) {
    return res.status(400).send({ message: "User already exists" });
  }

  const userId = Math.floor(Math.random() * 1000000);

  const newUser = {
    id: userId,
    name: dataUser.name,
    email: dataUser.email,
    password: dataUser.password,
  };

  users.push(newUser);
  res.status(201).json(newUser);

  io.emit("new-user", newUser);
});

httpServer.listen(5050);
