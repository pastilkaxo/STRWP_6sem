const http = require("http");
const fs = require("fs");
const mp = require("multiparty");
const qr = require("querystring");
const url = require("url");
const xml2js = require("xml2js");
const xmlbuilder = require("xmlbuilder");

let server = http.createServer();

let http_handler = (req, res) => {
  switch (req.method) {
    case "GET":
      switch (url.parse(req.url, true).pathname) {
        case "/1":
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Task 1 response");
          break;
        case "/2":
          let q = url.parse(req.url, true);
          let x = q.query.x;
          let y = q.query.y;
          if (x && y) {
            res.writeHead(200, { "Content-Type": "text/text; charset=utf-8" });
            let result = `x+y=> ${x} + ${y} = ${x + y}`;
            console.log(result);
            res.end(result);
          }
          break;
      }
      break;
    case "POST":
      switch (url.parse(req.url, true).pathname) {
        case "/3":
          let buff = "";
          req.on("data", (data) => (buff += data.toString()));
          req.on("end", () => {
            buff = qr.parse(buff);
            res.writeHead(200, {
              "Content-Type": "text/text; charset=utf-8",
            });
            let result2 = `x+y+s=> ${+buff["x"]} + ${+buff["y"]} + ${
              buff["s"]
            }`;
            res.end(result2);
          });
          break;
        case "/4":
          // {
          //     "__comment": "Запрос. Лаба 8",
          //     "x": 1,
          //     "y": 2,
          //     "s": "Сообщение",
          //     "m": ["a", "b", "c", "d"],
          //     "o": {"surname": "Лемеш", "name": "Влад"}
          // }
          let reqJson = "";
          let resJosn = {};
          req.on("data", (chunk) => (reqJson += chunk.toString()));
          req.on("end", () => {
            console.log(reqJson);
            reqJson = JSON.parse(reqJson);
            resJosn = {
              "__comment": "Ответ. Лаба 9",
              "x_plus_y": reqJson.x + reqJson.y,
              "Concatination_s_o":
                reqJson.s + ": " + reqJson.o.surname + ", " + reqJson.o.name,
              "Length_m": reqJson.m.length,
            };
            res.writeHead(200, { "Contet-Type": "application/json" });
            res.end(JSON.stringify(resJosn));
          });
          break;
        case "/5":
          // <request id = "23">
          //     <x value = "1" />
          //     <x value = "2" />
          //     <m value = "a" />
          //     <m value = "b" />
          //     <m value = "c" />
          // </request>
          let xmlbody = "";
          req.on("data", (chunk) => (xmlbody += chunk.toString()));
          req.on("end", () => {
            xml2js.parseString(xmlbody, (err, result) => {
              if (err) {
                console.log(err.message);
                return;
              }
              let sum = 0;
              result.request.x.forEach((e) => (sum += +e.$.value));
              let message = "";
              result.request.m.forEach((e) => (message += e.$.value));

              let xmlresponse = xmlbuilder
                .create("response")
                .att("id", Math.round(Math.random() * 100))
                .att("request", result.request.$.id);
              xmlresponse.ele("sum", { element: "x", sum: `${sum}` });
              xmlresponse.ele("concat", { element: "m", result: `${message}` });

              rc = xmlresponse.toString({ pretty: true });
              res.writeHead(400, {
                "Content-Type": "text/xml; charset=utf-8",
              });
              console.log(rc);
              res.end(rc);
            });
          });
          break;
        case "/6":
          let buffer = "";
          let form = new mp.Form({ uploadDir: "./static" });
          form.on("field", (name, field) => {
            console.log("---- got a field:");
            console.log(name, field);
            buffer += `<br/>${name} = ${field}`;
          });
          form.on("file", (name, file) => {
            console.log("--- File ---\n");
            console.log(name, file);
            buffer += `----> File ${name} = ${file.originalFilename}:${file.path}\n`;
          });
          form.on("error", (err) => {
            console.log("err = " + err.message);
            res.end("ERROR UPLOADINT FILE:" + err.message);
          });
          form.on("close", () => {
            console.log("--- Close ---\n");
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
            });
            res.end(buffer);
          });
          form.parse(req); // разбиваем файлы
          break;
      }
      break;
  }
  if (req.method === "GET" && url.parse(req.url).pathname.startsWith("/8/")) {
    fs.access(
      "static/" + url.parse(req.url).pathname.split("/")[2],
      fs.constants.F_OK,
      (err) => {
        if (err) {
          res.statusCode = 404;
          res.end("cannot access file...");
        } else {
          res.writeHead(200);
          fs.createReadStream(
            "./static/" + url.parse(req.url).pathname.split("/")[2]
          ).pipe(res);
        }
      }
    );
  }
};

server
  .listen(5000, () => {
    console.log("Server running at http://localhost:5000");
  })
  .on("request", http_handler)
  .on("error", (e) => {
    console.log(e.message);
  })
  .on("close", () => {
    console.log("Соединение закрыто (keepAliveTimeout истёк)");
  });
