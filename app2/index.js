const socket = io("http://localhost:5050", { path: "/rea-time" });

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

//Socket.io
socket.on("new-user", (data) => {
  console.log("New user:", data);
  userCard();
});
//
