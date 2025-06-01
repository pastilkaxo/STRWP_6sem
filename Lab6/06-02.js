const http = require("http");
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");
const nodemailer = require("nodemailer");
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const mailer = nodemailer.createTransport({
  service: config.smtp.service,
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.auth.user,
    pass: config.smtp.auth.pass,
  },
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync("./index.html"));
  } else if (path === "/send" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const formData = querystring.parse(body);

      mailer.sendMail(
        {
          from: formData.from,
          to: formData.to,
          subject: formData.subject,
          text: formData.text,
        },
        (err, info) => {
          const responseHtml = `
          <html>
            <head>
              <title>Результат отправки</title>
            </head>
            <body>
              ${
                err
                  ? `<div >Ошибка: ${err.message}</div>`
                  : `<div>Письмо отправлено!</div>`
              }
              <p><a href="/">Назад</a></p>
            </body>
          </html>
        `;

          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end(responseHtml);
        }
      );
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    res.end("404 Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
