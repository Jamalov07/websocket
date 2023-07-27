const WebSocket = require("ws");
const server = new WebSocket.Server({ port: "8080" });
console.log("WebSocket server is running.");

const clients = new Set();

server.on("connection", (socket) => {
    clients.add(socket);

    socket.on("message", (message, isBinary) => {
        socket.send(message);
        console.log("Received new message:", message);
        broadcastMessage(socket, isBinary ? message : message.toString());
    });

    socket.on("close", () => {
        clients.delete(socket);
    });
});

function broadcastMessage(senderSocket, message) {
    const data = JSON.stringify({ sender: senderSocket._socketId, message });

    for (const client of clients) {
        if (client !== senderSocket) client.send(data);
    }
}
