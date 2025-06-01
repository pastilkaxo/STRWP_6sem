const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("resource.key"),
  cert: fs.readFileSync("resource.crt"),
};

https
  .createServer(options, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running!");
  })
  .listen(443, () => console.log("Сервер запущен на https://localhost:443"));
