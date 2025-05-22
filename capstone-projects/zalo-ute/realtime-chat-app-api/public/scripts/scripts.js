const socket = io(); // Connects to the current domain by default
const messagesContainer = document.getElementById("messages");
const conversationIdInput = document.getElementById("conversationId");
const joinButton = document.getElementById("joinButton");
let currentConversationId = null;

joinButton.addEventListener("click", () => {
  const newConversationId = conversationIdInput.value.trim();
  if (newConversationId) {
    if (currentConversationId) {
      socket.emit("LEAVE_CONVERSATION", currentConversationId);
    }
    currentConversationId = newConversationId;
    socket.emit("JOIN_CONVERSATION", currentConversationId);
    messagesContainer.innerHTML = ""; // Clear previous messages
    joinButton.textContent = "Leave";
  } else if (currentConversationId) {
    socket.emit("LEAVE_CONVERSATION", currentConversationId);
    currentConversationId = null;
    joinButton.textContent = "Join";
  }
});

socket.on("CREATE_MESSAGE", (message) => {
  addMessageToDOM(message);
});

socket.on("UPDATE_MESSAGE", (message) => {
  updateMessageInDOM(message);
});

socket.on("DELETE_MESSAGE", (messageId) => {
  deleteMessageFromDOM(messageId);
});

function addMessageToDOM(message) {
  const messageElement = createMessageElement(message);
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateMessageInDOM(message) {
  const existingMessage = document.getElementById(
    `message-${message._id.toString()}`
  );
  if (existingMessage) {
    const updatedMessage = createMessageElement(message);
    existingMessage.replaceWith(updatedMessage);
  }
}

function deleteMessageFromDOM(messageId) {
  const messageToDelete = document.getElementById(`message-${messageId}`);
  if (messageToDelete) {
    messageToDelete.remove();
  }
}

function createMessageElement(message) {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.id = `message-${message._id.toString()}`;
  const avatarUrl = message.user.avatarUrl || "./styles/user_icon.png";
  messageElement.innerHTML = `
    <img class="avatar" src="${avatarUrl}" alt="${message.user.displayName}">
    <div class="message-content">
      <div class="message-header">
        <span class="user-name">${message.user.displayName}</span>
        <span class="timestamp">${message.createdAt}</span>
      </div>
      <div>${message.content}</div>
      ${
        message.imageUrl
          ? `<img src="${message.imageUrl}" alt="Attached image">`
          : ""
      }
      <div class="reactions">
        ${message.isReacted ? "❤️​" : "🖤​"}${message.totalReactions}
      </div>
    </div>
  `;

  return messageElement;
}
