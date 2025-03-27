const socket = io("http://localhost:5050", { path: "/rea-time" });

// Create Users Cards
const userCard = async () => {
  const usersContainer = document.getElementById("users-container");
  if (!usersContainer) return;

  usersContainer.innerHTML = "";

  try {
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
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Create Posts Cards with likes
const postCard = async () => {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return;

  postsContainer.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5050/posts");
    const data = await response.json();

    data.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      postCard.dataset.id = post.id;
      postCard.innerHTML = `
        <img src="${post.image}" alt="${post.title}" />
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="likes-container">
          <button class="like-btn">Like</button>
          <span class="likes-count">${post.likes || 0} likes</span>
        </div>
        <div class="post-actions">
          <button class="delete-btn">Delete</button>
          <button class="edit-btn">Edit</button>
        </div>
      `;
      postsContainer.appendChild(postCard);
    });

    // Like buttons
    document.querySelectorAll(".like-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const postCardElement = e.target.closest(".post-card");
        const postId = postCardElement.dataset.id;

        if (!postId) {
          console.error("Post ID not found");
          return;
        }

        await likePost(postId);
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const postCardElement = e.target.closest(".post-card");
        const postId = postCardElement.dataset.id;

        if (!postId) {
          console.error("Post ID not found");
          return;
        }

        await deletePost(postId);
      });
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Like Post function
const likePost = async (id) => {
  try {
    const response = await fetch(`http://localhost:5050/posts/${id}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to like post: ${response.status}`);
    }
  } catch (error) {
    console.error("Error liking post:", error);
    alert("Error liking post: " + error.message);
  }
};

// Delete Post function
const deletePost = async (id) => {
  try {
    const response = await fetch(`http://localhost:5050/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Error deleting post: " + error.message);
  }
};

// Socket.io Events
socket.on("new-user", (data) => {
  console.log("New user:", data);
  userCard();
});

socket.on("new-post", (data) => {
  console.log("New post:", data);
  postCard();
});

socket.on("deleted-post", (data) => {
  console.log("Post deleted:", data);
  postCard();
});

socket.on("liked-post", (data) => {
  console.log("Post liked:", data);
  postCard();
});

// Initialize cards when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  userCard();
  postCard();
});
