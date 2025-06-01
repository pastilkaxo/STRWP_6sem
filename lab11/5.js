const rpcWSS = require("rpc-websockets").Server; // вызов удаленных процедур

// instantiate Server and start listening for requests
let server = new rpcWSS({ port: 4000, host: "localhost" });

server.setAuth((l) => l.login === "user" && l.password === "1111"); // Проверка логина/пароля при подключении клиента.

// Методы:
// public - no auth
// protected - with auth

// register an RPC method

server
  .register("square", (params) => {
    return params.length === 2
      ? params[0] * params[1]
      : Math.PI * params[0] ** 2;
  })
  .public();

server
  .register("sum", (params) => {
    let sum = 0;
    params.forEach((elem) => {
      if (Number.isInteger(elem)) sum += elem;
    });
    return sum;
  })
  .public();

server
  .register("mul", (params) => {
    let mul = 1;
    params.forEach((elem) => {
      if (Number.isInteger(elem)) mul *= elem;
    });
    return mul;
  })
  .public();

let fibonacci = (n) => {
  var fibonacci = [0, 1];
  if (n != 1) {
    for (i = 2; i < n; i++) {
      fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }
    return fibonacci;
  } else return 0;
};

server
  .register("fib", (params) => {
    if (params.length !== 1) return [1];
    return fibonacci(params);
  })
  .protected();

let factorial = (k) => {
  if (k == 0) {
    return 1;
  }
  return k * factorial(k - 1);
};

server
  .register("fact", (params) => {
    if (params.length !== 1) return [1];
    return factorial(params);
  })
  .protected();
