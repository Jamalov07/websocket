const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("message", (e) => {
    let messageData;

    if (e.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
            messageData = tryParseJSON(reader.result);
            if (messageData !== null) {
                displayMessage(messageData);
            } else {
                displayMessage(reader.result);
            }
        };
        reader.readAsText(e.data);
    } else if (e.data instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(e.data);
        const messageText = Buffer.from(uint8Array).toString();
        messageData = tryParseJSON(messageText);
        if (messageData !== null) {
            displayMessage(messageData.message);
        } else {
            displayMessage(messageText);
        }
    } else {
        messageData = tryParseJSON(e.data);
        if (messageData !== null) {
            displayMessage(messageData.message);
        } else {
            displayMessage(e.data);
        }
    }
});

document.querySelector("button").onclick = () => {
    const input = document.querySelector("input").value || "nothing";
    socket.send(input);
    document.querySelector("input").value = "";
};

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const input = document.querySelector("input").value || "nothing";
        socket.send(input);
        document.querySelector("input").value = "";
    }
});

function tryParseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        // If parsing fails, return null
        return null;
    }
}

function displayMessage(message) {
    if (typeof message === "object") {
        // If the message is an object (parsed JSON), stringify it for display
        const messageText = JSON.stringify(message);
        const el = document.createElement("li");
        el.textContent = messageText;
        document.querySelector("ol").appendChild(el);
    } else {
        // If the message is not an object (text), display it directly
        const el = document.createElement("li");
        el.textContent = message;
        document.querySelector("ol").appendChild(el);
    }
}
