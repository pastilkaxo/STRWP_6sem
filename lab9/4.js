let http = require("http");

let json = JSON.stringify({
  "__comment": "Запрос. Лаба 9",
  "x": 1,
  "y": 2,
  "s": "Сообщение",
  "m": ["a", "b", "c", "d"],
  "o": { "surname": "Лемеш", "name": "Влад" },
});

let options = {
  host: "localhost",
  path: "/4",
  port: 5000,
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "accept": "application/json",
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
    console.log("end:body (JSON parsed) =", JSON.parse(data));
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.end(json);
