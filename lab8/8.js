const http = require("http");
const fs = require("fs");
const url = require("url");
const qr = require("querystring");
const xml2js = require("xml2js"); // XML parser to JS object
const xmlbuilder = require("xmlbuilder"); // xml creation на лету
const mp = require("multiparty"); // обработка мультипартовых данных
const PORT = 5000;

let server = http.createServer();

let http_handler = (req, res) => {
  switch (req.method) {
    case "GET":
      console.log("REQUEST URL: " + req.url);
      let parseURL = url.parse(req.url, true);
      let pathname = parseURL.pathname.split("/")[1];
      switch (pathname) {
        case "connection": // connection
          if (!parseURL.query.set) {
            res.end("keepAliveTime: " + server.keepAliveTimeout);
          } else {
            let kp = +parseURL.query.set;
            server.keepAliveTimeout = kp;
            res.end("keepAliveTime: " + server.keepAliveTimeout);
          }
          setTimeout(() => {
            server.close();
          }, server.keepAliveTimeout);
          break;
        case "headers":
          res.setHeader("LVO", "Hola Amigo!");
          res.write("[REQUEST HEADERS]:\n");
          for (let header in req.headers) {
            res.write(header + ":" + req.headers[header] + "\n");
          }
          res.write("<-------------------------->\n");
          res.write("[RESPONSE HEADERS]:\n");
          let respHeaders = res.getHeaders();
          for (let header in respHeaders) {
            res.write(header + ":" + respHeaders[header] + "\n");
          }
          res.end();
          break;
        case "parameter":
          if (parseURL.query.x && parseURL.query.y) {
            let x = +parseURL.query.x;
            let y = +parseURL.query.y;
            if (!isNaN(x) && !isNaN(y)) {
              res.write("[RESULT]:\n");
              let sum = x + y,
                mult = x * y,
                sub = x - y,
                div = x / y;
              res.end(`SUM: ${sum}\nMULT:${mult}\nSUB:${sub}\nDIV:${div}`);
            } else {
              res.end("ERROR: PARAMTER IS NOT A NUMBER -> X:" + x + " Y:" + y);
            }
          } else {
            // res.end("ERROR: PARAMTERS IS EMPTY");
            let parsedParamURL = parseURL.pathname.split("/");
            x = +parsedParamURL[2];
            y = +parsedParamURL[3];
            if (x && y) {
              res.write("[RESULT]:\n");
              let sum = x + y,
                mult = x * y,
                sub = x - y,
                div = x / y;
              res.end(`SUM: ${sum}\nMULT:${mult}\nSUB:${sub}\nDIV:${div}`);
            } else {
              res.end(parseURL.pathname);
            }
          }
          break;
        case "close":
          res.setHeader("Connection", "close");
          setTimeout(() => {
            server.close(() => {
              console.log("[SERVER CLOSED]");
            });
          }, 2000);
          break;
        case "socket": // инфа о TCP сокете запроса
          res.write("[SERVER INFO]:\n");
          res.write("server port: " + res.socket.localPort + "\n");
          res.write("server ip: " + res.socket.localAddress + "\n");
          res.write("[CLIENT INFO]:\n");
          res.write("client port: " + res.socket.remotePort + "\n");
          res.write("client ip: " + res.socket.remoteAddress + "\n");
          res.end();
          break;
        case "req-data":
          let count = 0;
          let buff = "";
          req.on("data", (data) => {
            ++count;
            console.log(count + " => request.on(data) = " + data.length);
            buff += data;
          });
          req.on("end", () => {
            console.log(
              "Total: request.on(end) = " + buff.length + " count:" + count
            );
            res.end();
          });

          break;
        case "resp-status":
          if (parseURL.query.c && parseURL.query.mess) {
            let code = +parseURL.query.c;
            let msg = parseURL.query.mess;
            if (code < 600 && code > 99) {
              res.statusCode = code;
              res.statusMessage = msg;
              res.end();
            }
          } else {
            res.end("ERROR: PARAMTERS IS EMPTY");
          }
          break;
        case "formparameter":
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          let html = fs.readFileSync("./form.html");
          res.end(html);
          break;
        case "files":
          if (parseURL.pathname.split("/")[2] != null) {
            fs.access(
              "./static/" + req.url.split("/")[2],
              fs.constants.F_OK,
              (err) => {
                if (err) {
                  res.statusCode = 404;
                  res.end("can not access file....");
                } else {
                  res.writeHead(200, {
                    "Content-Type": "text/plain; charset=utf-8",
                  });
                  fs.createReadStream("./static/" + req.url.split("/")[2]).pipe(
                    res
                  );
                }
              }
            );
          } else {
            fs.readdir("./static", (err, files) => {
              if (err) {
                res.end("./static dir is not found");
                return;
              } else {
                res.setHeader("X-static-files-count", `${files.length}`);
                res.end();
              }
            });
          }
          break;
        case "upload":
          let uploadForm = fs.readFileSync("./upload.html");
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end(uploadForm);
          break;
        default:
          res.end("Hello World!");
          break;
      }
      break;
    case "POST":
      switch (url.parse(req.url, true).pathname) {
        case "/formparameter":
          let buff = "";
          let result = "";
          req.on("data", (data) => {
            buff += data.toString();
          });
          req.on("end", () => {
            console.log(buff);
            buff = qr.parse(buff);
            for (let key in buff) {
              result += `${key}=${buff[key]}\n`;
            }
            res.end(result);
          });
          break;
        case "/json":
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
              "__comment": "Ответ. Лаба 8",
              "x_plus_y": reqJson.x + reqJson.y,
              "Concatination_s_o":
                reqJson.s + ": " + reqJson.o.surname + ", " + reqJson.o.name,
              "Length_m": reqJson.m.length,
            };
            res.writeHead(200, { "Contet-Type": "application/json" });
            res.end(JSON.stringify(resJosn));
          });
          break;
        case "/xml":
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
              res.end(xmlresponse.toString({ pretty: true }));
            });
          });
          break;
        case "/upload":
          let buffer = "";
          let form = new mp.Form({ uploadDir: "./static" });
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
};

server
  .listen(PORT, () => {
    console.log("Server running at http://localhost:5000/connection");
    console.log("Server running at http://localhost:5000/connection?set=6000");
    console.log("Server running at http://localhost:5000/headers");
    console.log("Server running at http://localhost:5000/parameter?x=10&&y=6");
    console.log("Server running at http://localhost:5000/parameter/2/4");
    console.log("Server running at http://localhost:5000/close");
    console.log("Server running at http://localhost:5000/socket");
    console.log("Server running at http://localhost:5000/req-data");
    console.log(
      "Server running at http://localhost:5000/resp-status?c=200&mess=HOLAAMIGO!"
    );
    console.log("Server running at http://localhost:5000/formparameter");
    console.log("Server running at http://localhost:5000/json");
    console.log("Server running at http://localhost:5000/xml");
    console.log("Server running at http://localhost:5000/files");
    console.log("Server running at http://localhost:5000/files/filename");
    console.log("Server running at http://localhost:5000/upload");
  })
  .on("request", http_handler)
  .on("error", (e) => {
    console.log(e.message);
  })
  .on("connection", () => {
    console.log("Новое соединение");
    server.on("close", () => {
      console.log("Соединение закрыто (keepAliveTimeout истёк)");
    });
  });
