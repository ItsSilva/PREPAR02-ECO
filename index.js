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

//delete route for posts
app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send({ message: "Post not found" });
  }

  const deletedPost = posts[postIndex];
  posts.splice(postIndex, 1);

  io.emit("deleted-post", deletedPost);

  res.status(204).send();
});

//post route for like
app.post("/posts/:id/like", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send({ message: "Post not found" });
  }

  if (!posts[postIndex].likes) {
    posts[postIndex].likes = 1;
  } else {
    posts[postIndex].likes++;
  }

  const updatedPost = posts[postIndex];
  io.emit("liked-post", updatedPost);

  res.status(200).json(updatedPost);
});

httpServer.listen(5050);
