let http = require("http");
let xmlbuilder = require("xmlbuilder");
let parseString = require("xml2js").parseString;

let xmldoc = xmlbuilder.create("request").att("id", 33);
xmldoc.ele("x").att("value", 1);
xmldoc.ele("x").att("value", 2);
xmldoc.ele("x").att("value", 3);
xmldoc.ele("m").att("value", "a");
xmldoc.ele("m").att("value", "b");
xmldoc.ele("m").att("value", "c");

let options = {
  host: "localhost",
  path: "/5",
  port: 5000,
  method: "POST",
  headers: {
    "content-type": "text/xml; charset=utf-8",
    "accept": "text/xml",
  },
};

console.log(xmldoc.toString({ pretty: true }));

const req = http.request(options, (res) => {
  console.log("http.request: statusCode", res.statusCode);
  let data = "";
  res.on("data", (chunk) => {
    console.log("chunk =", chunk.length);
    data += chunk.toString();
  });
  res.on("end", () => {
    console.log("end:body (XML parsed) =", data);
    parseString(data, (err, str) => {
      if (err) console.log("xml parse error");
      else {
        console.log("str = ", str);
      }
    });
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.end(xmldoc.toString({ pretty: true }));
