const socket = io("http://localhost:5050", { path: "/rea-time" });

//Create Users Cards
userCard = async () => {
  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  const response = await fetch("http://localhost:5050/users");
  const data = await response.json();

  data.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `;
    usersContainer.appendChild(userCard);
  });
};

//create Posts Cards
const postCard = async () => {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  const response = await fetch("http://localhost:5050/posts");
  const data = await response.json();

  data.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.innerHTML = `
      <img src="${post.image}" alt="${post.title}" />
      <h3>${post.title}</h3>
      <p>${post.description}</p>
    `;
    postsContainer.appendChild(postCard);
  });
};

//Socket.io
//New User
socket.on("new-user", (data) => {
  console.log("New user:", data);
  userCard();
});

//New Post
socket.on("new-post", (data) => {
  console.log("New post:", data);
  postCard();
});
