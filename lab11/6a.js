const rpcWSC = require("rpc-websockets").Client;
let ws = new rpcWSC("ws://localhost:4000/");

ws.on("open", () => {
  ws.subscribe("A"); // subscribe to receive an event
  ws.subscribe("B");
  ws.subscribe("C");

  //   ws.unsubscribe("A");
  //   ws.unsubscribe("B");
  //   ws.unsubscribe("C");

  ws.on("A", () => {
    console.log("event A called");
  });

  ws.on("B", () => {
    console.log("event B called");
  });

  ws.on("C", () => {
    console.log("event C called");
  });
});
