const express = require("express");
const bodyParser = require("body-parser"); // middleware для разбора JSON-тела запроса
const { JSONRPCServer } = require("json-rpc-2.0"); // JSON-RPC 2.0

const app = express();
const server = new JSONRPCServer();

app.use(bodyParser.json());

server.addMethod("sum", (params) => {
  return params.reduce((a, b) => a + b, 0);
});

server.addMethod("mul", (params) => {
  return params.reduce((a, b) => a * b, 1);
});

server.addMethod("div", ({ x, y }) => {
  if (y === 0) {
    throw new Error("Division by zero");
  }
  return x / y;
});

server.addMethod("proc", (params) => {
  const [x, y] = params;
  if (y === 0) {
    throw new Error("Division by zero");
  }
  return (x / y) * 100;
});

app.post("/jsonrpc", (req, res) => {
  // endpoint
  server
    .receive(req.body) // body data -> server ->
    .then((jsonrpcRes) => {
      res.json(jsonrpcRes); // -> result
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
// http://localhost:3000/jsonrpc
