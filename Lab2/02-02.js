var http = require("http");
var fs = require("fs");

const fname = "./молния.png";
let png = null;

http
  .createServer((req, res) => {
    switch (req.method) {
      case "GET":
        switch (req.url) {
          case "/png":
            console.log(req.url);
            fs.stat(fname, (err, stat) => {
              console.log(stat);
              if (err) {
                console.log("ERROR:", err);
              } else {
                png = fs.readFileSync(fname);
                res.writeHead(200, {
                  "content-type": "image/png",
                  "content-length": stat.size,
                });
                res.end(png, "binary");
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
  })
  .listen(5000, () =>
    console.log("Server is running on http://localhost:5000")
  );
