document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("sendButton").addEventListener("click", sendMessage);
    document.getElementById("userInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

function sendMessage() {
    var userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") return;

    stopGenerating = false;

    addMessageToChat(userInput, 'user-message');
    document.getElementById("userInput").value = "";

    var loadingIndicator = addMessageToChat("...", 'loading-message');

    console.log("User Input:", userInput);

    fetch('https://generated-healthy-operation.glitch.me/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => {
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        return response.json();
    })
    .then(data => {
        if (stopGenerating) return;

        document.getElementById("chat-container").removeChild(loadingIndicator);

        console.log("Response Data:", data);

        if (data.error) {
            throw new Error(data.error);
        } else if (data.response) {
            addMessageToChat(data.response, 'bot-message');
        } else {
            throw new Error("No response returned in data. Full data: " + JSON.stringify(data));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("chat-container").removeChild(loadingIndicator);
        addMessageToChat("Sorry, there was an error processing your request.", 'bot-message');
    });
}

function addMessageToChat(message, className) {
    var messageElement = document.createElement("div");
    messageElement.className = "message " + className;
    messageElement.textContent = message;
    document.getElementById("chat-container").appendChild(messageElement);

    document.getElementById("chat-container").scrollTop = document.getElementById("chat-container").scrollHeight;

    return messageElement;
}


