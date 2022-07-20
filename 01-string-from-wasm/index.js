"use strict";
const fs = require("fs");
const { WASI } = require("wasi");
const wasi = new WASI();
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

(async () => {
  const wasm = await WebAssembly.compile(
    fs.readFileSync("./function/hello.wasm")
  );
  const instance = await WebAssembly.instantiate(wasm, importObject);

  wasi.start(instance);

  let helloValue = instance.exports.hello()
  console.log("🖐 position of string pointer ([]byte)", helloValue)
  let memory = instance.exports.memory

  console.log("🤖 memory.buffer:", memory.buffer)

  const buffer = new Uint8Array(memory.buffer, helloValue, 11) // 11 == length of "hello world"
  const str = new TextDecoder("utf8").decode(buffer)
  console.log(`📝: ${str}`)

})();

// $ node --experimental-wasi-unstable-preview1 index.js

/*
  - read the memory
  - get buffer at the position of the value
  - transform the buffer to string
*/

/*
const greetValue = instance.exports.greet();
const memory = instance.exports.memory;
const buffer = new Uint8Array(memory.buffer, greetValue, 12);
const str = new TextDecoder("utf8").decode(buffer);
console.log(`📝: ${str}`)
*/
