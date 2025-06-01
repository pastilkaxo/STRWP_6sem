const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "t2.html"));
});

app.get("/wasm", (req, res) => {
  res.setHeader("Content-Type", "application/wasm");
  res.sendFile(path.join(__dirname, "public", "calc.wasm"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
