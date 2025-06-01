var http = require("http");
var fs = require("fs");

http
  .createServer((req, res) => {
    switch (req.url) {
      case "/html":
        let html = fs.readFileSync("./index.html");
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(html);
        break;
      default:
        res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
        res.end("Hello world!");
        break;
    }
  })
  .listen(5000, () =>
    console.log("Server is running on http://localhost:5000")
  );
