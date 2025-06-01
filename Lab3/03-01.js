const http = require("http");
var state = "norm";

http
  .createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset:utf-8" });
    res.end(`<h1>${state}</h1>`);
  })
  .listen(5000, () =>
    console.log("Server is running on http://localhost:5000")
  );

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
  let chunk = null;
  while ((chunk = process.stdin.read()) != null) {
    let newState = chunk.trim();
    switch (newState) {
      case "exit":
        console.log(`${state} -> ${newState}\n`);
        process.exit(0);
        break;
      case "norm":
        console.log(`${state} -> ${newState}\n`);
        state = "norm";
        break;
      case "stop":
        console.log(`${state} -> ${newState}\n`);
        state = "stop";
        break;
      case "test":
        console.log(`${state} -> ${newState}\n`);
        state = "test";
        break;
      case "idle":
        console.log(`${state} -> ${newState}\n`);
        state = "idle";
        break;
      default:
        console.log(`Not correct value: ${newState}\n`);
        break;
    }
  }
});
