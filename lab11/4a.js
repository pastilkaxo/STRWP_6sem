const ws = require("ws");
const wsClient = new ws("ws://localhost:4000/");

// {client:x, timestamp:t}

let parm = process.argv[2];
let clientName = typeof parm === "undefined" ? "nameeee" : parm;

wsClient.on("open", () => {
  wsClient.on("message", (mess) => {
    console.log(`client.on('message'): ${mess}`);
  });

  setInterval(() => {
    wsClient.send(
      JSON.stringify({
        client: clientName,
        timestamp: new Date().toISOString(),
      })
    );
  }, 5000);
});
