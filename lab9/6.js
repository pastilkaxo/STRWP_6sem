let http = require("http");
let fs = require("fs");

let bound = "hola-hola-hola";
let body = `--${bound}\r\n`; // новая часть запроса
body += `Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n`; // имя поля формы и имя файла передаваемое
body += `Content-Type:text/plain\r\n\r\n`;
body += fs.readFileSync("./MyFile.txt");
body += `\r\n--${bound}--\r\n`;

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
    console.log("end:body (From txt) =", data);
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.end(body);
