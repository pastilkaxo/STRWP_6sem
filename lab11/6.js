const rpcWSS = require("rpc-websockets").Server;
let server = new rpcWSS({ port: 4000, host: "localhost" });

server.event("A");
server.event("B");
server.event("C");

server.on("connection", () => {
  console.log("EVENTS:" + server.eventList());
});

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
  let data = null;
  while ((data = process.stdin.read())) {
    if (data.trim() == "A") server.emit("A"); // emit an event to subscribers
    if (data.trim() == "B") server.emit("B");
    if (data.trim() == "C") server.emit("C");
  }
});
