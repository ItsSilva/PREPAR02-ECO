const socket = io("http://localhost:5050", { path: "/rea-time" });

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
  } else {
    alert(data.message);
  }
};
document.getElementById("register-btn").addEventListener("click", registerUser);

//login User
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
  } else {
    alert(data.message);
  }
};
document.getElementById("login-btn").addEventListener("click", loginUser);

//Create Post
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
  } else {
    alert(data.message);
  }
};
document.getElementById("post-btn").addEventListener("click", createPost);
