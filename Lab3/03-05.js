var http = require("http");
var url = require("url");
var fs = require("fs");

let fact = (n) => {
  if (n <= 1) {
    return n;
  } else {
    return n * fact(n - 1);
  }
};

function Fact(n, cb) {
  this.fn = n;
  this.ffact = fact;
  this.fcb = cb;
  this.calc = () => {
    setImmediate(() => {
      this.fcb(null, this.ffact(this.fn));
    });
  };
}

http
  .createServer((req, res) => {
    let rc = JSON.stringify({ k: 0 });
    if (url.parse(req.url).pathname === "/fact") {
      console.log(req.url);
      if (typeof url.parse(req.url, true).query.k != "undefined") {
        let k = parseInt(url.parse(req.url, true).query.k);
        if (Number.isInteger(k)) {
          res.writeHead(200, {
            "content-type": "application/json; charset=utf-8",
          });
          let fact = new Fact(k, (err, result) => {
            res.end(JSON.stringify({ k: k, fact: result }));
          });
          fact.calc();
        }
      }
    } else if (url.parse(req.url).pathname === "/") {
      let html = fs.readFileSync("./index2.html");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    } else {
      res.end(rc);
    }
  })
  .listen(5000, () =>
    console.log("Server is running on http://localhost:5000")
  );
