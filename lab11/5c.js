const rpcWSC = require("rpc-websockets").Client;
let ws = new rpcWSC("ws://localhost:4000/");

ws.on("open", () => {
  ws.login({ login: "user", password: "1111" }).then(async () => {
    await calculate();
  });
});

const reducer = (previousValue, currentValue) => previousValue + currentValue;

async function calculate() {
  console.log(
    "result: ",
    (await ws.call("sum", [
      await ws.call("square", [3]),
      await ws.call("square", [5, 4]),
      await ws.call("mul", [3, 5, 7, 9, 11, 13]),
    ])) +
      (await ws.call("fib", 7)).reduce(reducer) *
        (await ws.call("mul", [2, 4, 6]))
  );
}
