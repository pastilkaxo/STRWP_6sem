const WebSocket = require("ws");

let startWS = () => {
  let socket = new WebSocket("ws://localhost:4000/");
  let sender;
  socket.onopen = () => {
    let n = 0;
    sender = setInterval(() => socket.send("10-01-client : " + n++), 3 * 1000);
  };

  socket.onmessage = (message) => console.log(message.data);

  socket.onclose = (e) => {
    console.log("socket.onclose() ", e);
  };
  setTimeout(() => {
    clearInterval(sender);
    socket.close();
  }, 25 * 1000);
};

startWS();
