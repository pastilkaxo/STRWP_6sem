const http = require("http");
const ws = require("ws"); // для сокета
const fs = require("fs");
const url = require("url");

const HTTP_PORT = 3000;
const SOCKET_PORT = 4000;

let httpServer = http.createServer((req, res) => {
  if (req.method === "GET" && url.parse(req.url).pathname === "/start") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync("./10-01.html"));
  } else {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h2>Response:400</h2>");
  }
});

// req
// Connection: Upgrade
// Upgrade: websocket
// Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
// Sec-WebSocket-Version: 13
// resp 101 
// Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=

httpServer.listen(HTTP_PORT, () => {
  console.log("HTTP server running at http://localhost:3000/start");
});

let k = 0; // последовательный номер отправляемого клиенту сообщения
let wsServer = new ws.Server({
  port: SOCKET_PORT,
  host: "localhost",
  path: "/",
});

wsServer.on("connection", (ws) => {
  let n = 0; //  номер из последнего сообщения клиента
  console.log("client connected");
  setInterval(() => {
    ws.send(`Server: ${n}->${++k}`);
  }, 5 * 1000);
  ws.on("message", (m) => {
    console.log(`received message => ${m}`);
    n = Number.parseInt(m.toString().split(":")[1]);
    console.log("n:", n);
  });
});
wsServer.on("error", (e) => {
  console.log("ws server error", e);
});
console.log(
  `WS server: host: ${wsServer.options.host}, post: ${wsServer.options.port}, path: ${wsServer.options.path}`
);
