let http = require("http");
let fs = require("fs");

let bound = "hola-hola-hola";
let body = `--${bound}\r\n`;
body += `Content-Disposition:form-data; name="file"; filename="MyFile.png"\r\n`;
body += `Content-Type:application/octet-stream\r\n\r\n`;

let options = {
  host: "localhost",
  path: "/6",
  port: 5000,
  method: "POST",
  headers: {
    "content-type": "multipart/form-data; boundary=" + bound,
  },
};

const req = http.request(options, (res) => {
  console.log("http.request: statusCode", res.statusCode);
  let data = "";
  res.on("data", (chunk) => {
    console.log("chunk =", chunk.length);
    data += chunk.toString();
  });
  res.on("end", () => {
    console.log("end:body length img =", Buffer.byteLength(data));
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.write(body);
let stream = new fs.ReadStream("./MyFile.png");
stream.on("data", (chunk) => {
  req.write(chunk);
  console.log(Buffer.byteLength(chunk));
});
stream.on("end", () => {
  req.end(`\r\n--${bound}--\r\n`);
});
