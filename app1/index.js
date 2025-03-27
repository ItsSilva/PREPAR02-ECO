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
