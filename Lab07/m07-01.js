const fs = require("fs");

function checker(dir) {
  this.notFound = (res) => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not found\n");
  };

  this.getExtension = (path) => path.split(".").slice(-1)[0];
  this.sendFile = (headers, req, res) => {
    fs.access(dir + req.url, fs.constants.F_OK, (err) => {
      if (err) {
        res.statusCode = 404;
        res.end("No access to file.");
      } else {
        res.writeHead(200, headers);
        fs.createReadStream(dir + req.url).pipe(res);
      }
    });
  };
}

module.exports = checker;
