const fs = require("fs");
const ws = require("ws");
const wsClient = new ws("ws://localhost:4000/");

wsClient.on("open", () => {
  const duplex = ws.createWebSocketStream(wsClient, { encoding: "utf8" }); // дуплексный ws поток
  let rfile = fs.createReadStream("./num1.txt");
  rfile.pipe(duplex); // stdin -> ws поток сервера
});
