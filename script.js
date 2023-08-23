const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotClose = document.querySelector(".close-btn");

let msg;
// change this API key, obtained from OpenAI
const API_KEY = "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";
const inputHeight = chatInput.scrollHeight;

const CreateChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let content = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">sentiment_calm</span><p></p>`;
    chatLi.innerHTML = content;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const response = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: msg}]
        })
    }

    fetch(API_URL, options).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    // removing excessive whitespace
    msg = chatInput.value.trim();
    if(!msg) return;
    chatInput.value = "";
    chatInput.style.height = `${inputHeight}px`;

    // appending the user's msg to chatbox
    chatbox.appendChild(CreateChatLi(msg, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // set delay for loading screen
    setTimeout(() => {
        const incomingChatLi = CreateChatLi("Loading...", "incoming");
        chatbox.appendChild(incomingChatLi);
        response(incomingChatLi);
    }, 300);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // if enter key is pressed w/o shift key and textarea width is more than 800
    // then handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);
chatbotClose.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));