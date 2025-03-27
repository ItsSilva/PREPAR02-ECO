const socket = io("http://localhost:5050", { path: "/rea-time" });

// Navigation System
document.addEventListener("DOMContentLoaded", () => {
  const btnsContainer = document.querySelector(".btns-container");
  const registerForm = document.querySelector(".register-form");
  const loginForm = document.querySelector(".login-form");
  const createPostForm = document.querySelector(".create-post-form");

  const showMainScreen = () => {
    btnsContainer.style.display = "block";
    registerForm.style.display = "none";
    loginForm.style.display = "none";
    createPostForm.style.display = "none";
  };

  const navigateToRegister = () => {
    btnsContainer.style.display = "none";
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    createPostForm.style.display = "none";
  };

  const navigateToLogin = () => {
    btnsContainer.style.display = "none";
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    createPostForm.style.display = "none";
  };

  document
    .querySelector(".register-btn")
    .addEventListener("click", navigateToRegister);
  document
    .querySelector(".screen-login-btn")
    .addEventListener("click", navigateToLogin);

  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showMainScreen();
    });
  });

  showMainScreen();
});

// Register User
const registerUser = async (event) => {
  event.preventDefault();

  const name = document.getElementsByName("name")[0].value;
  const email = document.getElementsByName("email")[0].value;
  const password = document.getElementsByName("password")[0].value;

  const dataUser = {
    name: name,
    email: email,
    password: password,
  };

  const response = await fetch("http://localhost:5050/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUser),
  });

  const data = await response.json();
  if (response.ok) {
    socket.emit("new-user", data);
    alert("User registered successfully");
    document.querySelector(".btns-container").style.display = "block";
    document.querySelector(".register-form").style.display = "none";
  } else {
    alert(data.message);
  }
};
document.getElementById("register-btn").addEventListener("click", registerUser);

// Login User
const loginUser = async (event) => {
  event.preventDefault();

  const email = document.getElementsByName("email")[0].value;
  const password = document.getElementsByName("password")[0].value;

  const dataUser = {
    email: email,
    password: password,
  };

  const response = await fetch("http://localhost:5050/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUser),
  });

  const data = await response.json();
  if (response.ok) {
    alert("User logged in successfully");
    document.querySelector(".btns-container").style.display = "none";
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".create-post-form").style.display = "block";
  } else {
    alert(data.message);
  }
};
document.getElementById("login-btn").addEventListener("click", loginUser);

// Create Post
const createPost = async (event) => {
  event.preventDefault();

  const image = document.getElementsByName("image")[0].value;
  const title = document.getElementsByName("title")[0].value;
  const description = document.getElementsByName("description")[0].value;

  const dataPost = {
    image: image,
    title: title,
    description: description,
  };

  const response = await fetch("http://localhost:5050/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataPost),
  });

  const data = await response.json();
  if (response.ok) {
    socket.emit("new-post", data);
    alert("Post created successfully");
    document.querySelector(".create-post-form").reset();
  } else {
    alert(data.message);
  }
};
document.getElementById("post-btn").addEventListener("click", createPost);
