var http = require("http"); // функционал

http
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello From Vlad!</h1>\n");
  })
  .listen(3000, "127.0.0.1", () => {
    console.log("Server is started! htttp://localhost:3000");
  });
