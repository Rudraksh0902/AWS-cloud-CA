
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const chatHistory = document.getElementById("chat-history");
const newChatBtn = document.getElementById("new-chat-btn");
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");

// Store conversations in memory
let chats = [];
let activeChatId = 1;
let nextChatId = 2;

function createChat() {
    const chat = {
        id: nextChatId++,
        title: "New chat",
        messages: []
    };

    chats.unshift(chat);
    activeChatId = chat.id;

    renderHistory();
    renderMessages();
}

function getActiveChat() {
    return chats.find(chat => chat.id === activeChatId);
}

// Display the conversation history
function renderHistory() {
    chatHistory.replaceChildren();

    chats.forEach(chat => {
        const button = document.createElement("button");

        button.className = "history-item";
        button.textContent = chat.title;

        if (chat.id === activeChatId) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            activeChatId = chat.id;
            renderHistory();
            renderMessages();
            sidebar.classList.remove("open");
        });

        chatHistory.appendChild(button);
    });
}

// Create a message bubble safely
function addMessage(sender, text) {
    const message = document.createElement("div");
    message.className = "message";

    if (sender === "You") {
        message.classList.add("user-message");
    }

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "You" ? "Y" : "AI";

    const body = document.createElement("div");
    body.className = "message-body";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    body.appendChild(paragraph);
    message.append(avatar, body);
    messages.appendChild(message);
}

// Display the active conversation
function renderMessages() {
    messages.replaceChildren();

    const chat = getActiveChat();

    if (!chat || chat.messages.length === 0) {
        messages.appendChild(welcome);
        return;
    }

    chat.messages.forEach(message => {
        addMessage(message.sender, message.text);
    });
}

// Simulate a response from an AI
function getDemoReply(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("html")) {
        return "HTML provides the structure of a webpage using elements and tags.";
    }

    if (lowerText.includes("css")) {
        return "CSS controls the appearance and layout of a webpage.";
    }

    if (lowerText.includes("javascript") || lowerText.includes("dom")) {
        return "JavaScript can manipulate the DOM to update content, styles, and elements.";
    }

    return "This is a demo response. Connect an AI API to generate real answers.";
}

// Handle form submission
chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    const chat = getActiveChat();

    chat.messages.push({
        sender: "You",
        text: text
    });

    // Use the first message as the chat title
    if (chat.title === "New chat") {
        chat.title = text.slice(0, 28);
        renderHistory();
    }

    messageInput.value = "";

    renderMessages();
    messages.scrollTop = messages.scrollHeight;

    // Simulate a delayed AI reply
    setTimeout(function () {
        const reply = getDemoReply(text);

        chat.messages.push({
            sender: "AI",
            text: reply
        });

        // Refresh only if this chat is still active
        if (activeChatId === chat.id) {
            renderMessages();
            messages.scrollTop = messages.scrollHeight;
        }
    }, 600);
});

// Start a new conversation
newChatBtn.addEventListener("click", function () {
    createChat();
    sidebar.classList.remove("open");
    messageInput.focus();
});

// Toggle the sidebar on mobile
menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
});

// Create the first chat when the page loads
createChat();
