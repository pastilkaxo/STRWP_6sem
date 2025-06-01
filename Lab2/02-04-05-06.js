var http = require("http");
var fs = require("fs");
let server = http.createServer((req, res) => {
  const fname = "./xmlhttprequest.html";
  const fname2 = "./fetch.html";
  const fname3 = "./jquery.html";
  switch (req.method) {
    case "GET":
      switch (req.url) {
        case "/xmlhttprequest":
          fs.readFile(fname, (err, data) => {
            if (err) {
              res.writeHead(404, {
                "content-type": "text/plain; charset=utf-8",
              });
              res.end(`ERROR: ${err}`);
            }
            res.writeHead(200, {
              "content-type": "text/html; charset=utf-8",
            });
            res.end(data);
          });
          break;
        case "/fetch":
          fs.readFile(fname2, (err, data) => {
            if (err) {
              res.writeHead(404, {
                "content-type": "text/plain; charset=utf-8",
              });
              res.end(`ERROR: ${err}`);
            } else {
              res.writeHead(200, {
                "content-type": "text/html; charset=utf-8",
              });
              res.end(data);
            }
          });
          break;
        case "/api/name":
          res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
          res.end("Лемешевский Владислав Олегович");
          break;
        case "/jquery":
          fs.readFile(fname3, (err, data) => {
            if (err) {
              res.writeHead(404, {
                "content-type": "text/plain; charset=utf-8",
              });
              res.end(`ERROR: ${err}`);
            } else {
              res.writeHead(200, {
                "content-type": "text/html; charset=utf-8",
              });
              res.end(data);
            }
          });
          break;
        default:
          res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
          res.end("Hello world!");
          break;
      }
      break;
  }
});

server.listen(5000, () =>
  console.log("Server is running on http://localhost:5000")
);
