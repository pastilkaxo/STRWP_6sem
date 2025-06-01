const WebSocket = require("ws");

let startWS = () => {
  let socket = new WebSocket("ws://localhost:5000/broadcast");
  let sender;
  socket.onopen = () => {
    let n = 0;
    //sender = setInterval(() => socket.send("10-03-client : " + n++), 3 * 1000);
    sender = setInterval(() => socket.send("client 3 :" + "Vlad "), 3 * 1000);
  };

  socket.onmessage = (message) => console.log(message.data);

  socket.onclose = (e) => {
    console.log("socket.onclose() ");
  };
  setTimeout(() => {
    clearInterval(sender);
    socket.close();
  }, 25 * 1000);
};

startWS();
