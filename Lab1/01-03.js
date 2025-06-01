var http = require("http");

let getRequestInfo = (req) => {
  let rc = "";
  for (let key in req.headers) {
    rc += `<tr><td style="border:1px solid black;">${key}</td><td  style="border:1px solid black;">${req.headers[key]}</td></tr>`;
  }
  return rc;
};

http
  .createServer((request, response) => {
    // слушает входящие запросы
    let body = "";
    request.on("data", (bdata) => {
      body += bdata;
      console.log("data", body);
    });
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    request.on("end", () => {
      // все данные запроса получены
      response.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>REQUEST STRUCTURE:</h1>
    <h2>METHOD:<small style="color:red;">${request.method}</small></h2>
    <h2>URI:${request.url}</h2>
    <table>
        ${getRequestInfo(request)}
    </table>
    <h2>BODY:\n ${body}</h2>
</body>
</html>`);
    });
  })
  .listen(3000, () => {
    console.log("Server is started! htttp://localhost:3000");
  });
