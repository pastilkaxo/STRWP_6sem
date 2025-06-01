var http = require("http");
var fs = require("fs");
var data = require("./DB.js");
var url = require("url");
const readline = require("node:readline");

var db = new data.DB();
const stats = { start: null, finish: null, request: 0, commit: 0 };
let serverTimeout = null;
let commitInterval = null;
let statsInterval = null;
let tempStats = { request: 0, commit: 0 };
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  const [command, param] = input.split(" ");
  const x = parseInt(param);

  switch (command) {
    case "sd":
      if (serverTimeout) {
        clearTimeout(serverTimeout);
      }
      if (!isNaN(x)) {
        serverTimeout = setTimeout(() => {
          console.log("Stopping server...");
          process.exit(0);
        }, x * 1000);
        serverTimeout.unref();
      }
      break;
    case "sc": // периодич коммит
      if (commitInterval) {
        clearInterval(commitInterval);
        commitInterval = null;
      }
      if (!isNaN(x)) {
        commitInterval = setInterval(() => {
          db.commit();
        }, x * 1000);
        commitInterval.unref(); // чтобы таймер не блокировал заверш прог
      }
      break;
    case "ss": // сбор стат
      if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
        stats.finish = new Date().toLocaleString();
        console.log("Statistics collection stopped");
      } else if (!isNaN(x)) {
        stats.start = new Date().toLocaleString();
        stats.finish = null;
        stats.request = 0;
        stats.commit = 0;
        tempStats = { request: 0, commit: 0 };
        statsInterval = setInterval(() => {
          stats.request += tempStats.request;
          stats.commit += tempStats.commit;
          tempStats.request = 0;
          tempStats.commit = 0;
          stats.finish = null;
          console.log(
            `Statistics: request - ${stats.request}, commit - ${stats.commit}`
          );
        }, x * 1000);
        statsInterval.unref();
      }
      break;
    default:
      console.log("Unknown command");
  }
});

db.on("GET", (req, res) => {
  console.log("DB.GET");
  tempStats.request++;
  res.writeHead(200, { "Content-Type": "application/json" });
  db.select().then((el) => {
    res.end(JSON.stringify(el));
  });
});

db.on("POST", (req, res) => {
  console.log("DB.POST");
  tempStats.request++;
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
  tempStats.request++;
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
  tempStats.request++;
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

db.on("COMMIT", (req, res) => {
  tempStats.commit++;
  console.log(`COMMIT #${stats.commit + tempStats.commit} done`);
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
  } else if (url.parse(req.url).pathname === "/api/ss") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify(stats));
  }
});

server.listen(5000, () => {
  console.log("http://localhost:5000/");
});
