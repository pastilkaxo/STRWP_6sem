const http = require("http");
const fs = require("fs");

let fileName = "lvo.txt";
let file = fs.createWriteStream(fileName);

let options = {
  host: "localhost",
  path: "/8/name.txt",
  port: 5000,
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log("http.request: statusCode", res.statusCode);
  res.pipe(file);
  res.on("end", () => {
    console.log(`http.request: end: file was delivered`);
  });
});
req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});
req.end();
