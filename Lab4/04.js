var http = require("http");
var fs = require("fs");
var data = require("./DB.js");
var url = require("url");

var db = new data.DB();

db.on("GET", (req, res) => {
  console.log("DB.GET");
  res.writeHead(200, { "Content-Type": "application/json" });
  db.select().then((el) => {
    res.end(JSON.stringify(el));
  });
});

db.on("POST", (req, res) => {
  console.log("DB.POST");
  res.writeHead(200, { "Content-Type": "application/json" });
  req.on("data", (data) => {
    let r = JSON.parse(data);
    if (r != null) {
      db.insert(r).then((el) => {
        res.end(JSON.stringify(el));
      });
    }
  });
});

db.on("PUT", (req, res) => {
  console.log("DB.PUT");
  res.writeHead(200, { "Content-Type": "application/json" });
  req.on("data", (data) => {
    let r = JSON.parse(data);
    if (r != null) {
      db.update(r).then((el) => {
        res.end(JSON.stringify(el));
      });
    }
  });
});

db.on("DELETE", (req, res) => {
  console.log("DB.DELETE");
  res.writeHead(200, { "Content-Type": "application/json" });
  if (typeof url.parse(req.url, true).query.id != "undefined") {
    let id = parseInt(url.parse(req.url, true).query.id);
    if (Number.isInteger(id)) {
      db.delete({ id }).then((el) => {
        res.end(JSON.stringify(el));
      });
    }
  } else {
    req.on("data", (data) => {
      let r = JSON.parse(data);
      if (r != null) {
        db.delete(r).then((el) => {
          res.end(JSON.stringify(el));
        });
      }
    });
  }
});

let server = http.createServer((req, res) => {
  if (url.parse(req.url).pathname === "/") {
    let html = fs.readFileSync("./index.html");
    res.writeHead(200, { "content-type": "text/html,charset=utf-8" });
    res.end(html);
  } else if (url.parse(req.url).pathname === "/api/db") {
    if (typeof url.parse(req.url, true).query.id != "undefined") {
      let id = parseInt(url.parse(req.url, true).query.id);
      if (Number.isInteger(id)) {
        db.emit("DELETE", req, res);
      }
    } else {
      db.emit(req.method, req, res);
    }
  }
});

server.listen(5000, () => {
  console.log("http://localhost:5000/");
});
