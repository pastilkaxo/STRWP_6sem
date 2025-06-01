var http = require("http");

http
  .createServer((req, res) => {
    switch (req.method) {
      case "GET":
        switch (req.url) {
          case "/api/name":
            res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
            res.end("Лемешевский Владислав Олегович");
            break;
          default:
            res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
            res.write("It's default page!\n");
            res.end("Hello world!");
            break;
        }
        break;
    }
  })
  .listen(5000, () =>
    console.log("Server is running on http://localhost:5000")
  );
