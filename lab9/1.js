var http = require("http");

let options = {
  host: "localhost",
  path: "/1",
  port: 5000,
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log("http.request: statusCode: ", res.statusCode);
  console.log("http.request: statusMessage: ", res.statusMessage);
  console.log("http.request: socket.remoteAddress: ", res.socket.remoteAddress);
  console.log("http.request: socket.remotePort: ", res.socket.remotePort);

  let data = "";
  res.on("data", (chunk) => {
    console.log("chunk =", chunk.length);
    data += chunk.toString();
  });
  res.on("end", () => {
    console.log("end:body =", data);
  });
});

req.end();
