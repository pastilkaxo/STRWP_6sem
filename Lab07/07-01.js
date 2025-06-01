const http = require("http");
const Checker = require("./m07-01");
const PORT = 3000;

let httpHandler = (req, res) => {
  let ck = new Checker("./static");
  let found = true;
  let headers = { "Content-Type": "text/plain" };

  switch (req.method) {
    case "GET":
      console.log(ck.getExtension(req.url));
      switch (ck.getExtension(req.url)) {
        case "html":
          headers = { "Content-Type": "text/html" };
          break;
        case "css":
          headers = { "Content-Type": "text/css" };
          break;
        case "js":
          headers = { "Content-Type": "text/javascript" };
          break;
        case "png":
          headers = { "Content-Type": "image/png" };
          break;
        case "docx":
          headers = { "Content-Type": "application/msword" };
          break;
        case "json":
          headers = { "Content-Type": "application/json" };
          break;
        case "xml":
          headers = { "Content-Type": "application/xml" };
          break;
        case "mp4":
          headers = { "Content-Type": "video/mp4" };
          break;
        default:
          ck.notFound(res);
          found = false;
          break;
      }
      found ? ck.sendFile(headers, req, res) : null;
      break;
    default:
      res.writeHead(405);
      res.end("405: request method is " + req.method);
      break;
  }
};

const server = http.createServer();

server
  .listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  })
  .on("request", httpHandler)
  .on("error", (e) => {
    console.log("error server listening: " + e.message);
  });
