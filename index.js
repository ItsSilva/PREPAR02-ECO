const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { log } = require("console");

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
let posts = [];

//get route for users
app.get("/users", (req, res) => {
  res.send(users);
});

//post route for register
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

//post route for login
app.post("/login", (req, res) => {
  const dataUser = req.body;

  if (!dataUser.email || !dataUser.password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const user = users.find(
    (user) =>
      user.email === dataUser.email && user.password === dataUser.password
  );

  if (!user) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  res.status(200).json(user);
});

//get route for posts
app.get("/posts", (req, res) => {
  res.send(posts);
});

//post route for posts
app.post("/posts", (req, res) => {
  const dataPost = req.body;

  if (!dataPost.title || !dataPost.description || !dataPost.image) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const postId = Math.floor(Math.random() * 1000000);

  const newPost = {
    id: postId,
    image: dataPost.image,
    title: dataPost.title,
    description: dataPost.description,
  };

  posts.push(newPost);
  res.status(201).json(newPost);

  io.emit("new-post", newPost);
});

httpServer.listen(5050);
