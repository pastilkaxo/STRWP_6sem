let http = require("http");
let qr = require("querystring");

let parms = qr.stringify({ x: 3, y: 4 });
let path = `/2?${parms}`;
console.log("parms", parms);
console.log("path", path);

let options = {
  host: "localhost",
  path: path,
  port: 5000,
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log("http.request: statusCode", res.statusCode);

  let data = "";
  res.on("data", (chunk) => {
    console.log("chunk =", chunk.length);
    data += chunk.toString();
  });
  res.on("end", () => {
    console.log("end:body =", data);
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.end();
