const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const wasmPath = path.join(__dirname, "calc.wasm");
    const buffer = fs.readFileSync(wasmPath);
    const { instance } = await WebAssembly.instantiate(buffer); // позволяет компилировать и инстанцировать код WebAssembly
    const x = 3,
      y = 4;

    console.log("Экспортированные функции:", Object.keys(instance.exports));

    console.log(`Sum: ${x}+${y} = ${instance.exports.sum(x, y)}`);
    console.log(`Sub: ${x}-${y} = ${instance.exports.sub(x, y)}`);
    console.log(`Mul: ${x}*${y} = ${instance.exports.mul(x, y)}`);
  } catch (err) {
    console.error("WASM error:", err);
  }
}

main();
