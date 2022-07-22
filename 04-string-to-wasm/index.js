"use strict";
const fs = require("fs");
const { WASI } = require("wasi");
const wasi = new WASI();
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };


// Copy `data` into the `instance` exported memory buffer.
function copyMemory(data, instance) {
  // the `alloc` function returns an offset in
  // the module's memory to the start of the block
  var ptr = instance.exports.alloc(data.length);
  // create a typed `ArrayBuffer` at `ptr` of proper size
  var mem = new Uint8Array(instance.exports.memory.buffer, ptr, data.length);
  // copy the content of `data` into the memory buffer
  mem.set(new Uint8Array(data));
  // return the pointer
  return ptr;
}


(async () => {
  const wasm = await WebAssembly.compile(
    fs.readFileSync("./function/hello.wasm")
  );
  const instance = await WebAssembly.instantiate(wasm, importObject);

  wasi.start(instance);


  // 🖐 Prepare parameters
  // transform the input string into its UTF-8 representation
  var bytes = new TextEncoder("utf-8").encode("Bob Morane");

  // copy the contents of the string into the module's memory
  var ptr = copyMemory(bytes, instance);

  // call the module's `hello` function and
  // get the offset into the memory where the
  // module wrote the result string
  // call hello
  let helloStringPosition = instance.exports.hello(ptr, bytes.length); // ptrSize

  /*
	helloWorldPtr := uint32(ptrSize[0] >> 32)
	helloWorldSize := uint32(ptrSize[0])
  */

  console.log("🖐 position of the string pointer ([]byte)", helloStringPosition)
  console.log(helloStringPosition, typeof helloStringPosition) // bigInt
  let memory = instance.exports.memory

  //console.log("🤖 memory.buffer:", memory.buffer)
  /*
    memory.buffer is an ArrayBuffer
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

    It is an array of bytes, often referred to in other languages as a "byte array". You cannot directly manipulate the contents of an ArrayBuffer; instead, you create one of the typed array objects or a DataView object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.

  */
  const completeBufferFromMemory = new Uint8Array(memory.buffer)

  console.log("🤖 buffer:", completeBufferFromMemory)

  const MASK = (2n**32n)-1n
  let stringPtrPosition = Number(helloStringPosition >> BigInt(32))
  let stringSize = Number(helloStringPosition & MASK)

  const extractedBuffer = completeBufferFromMemory.slice(stringPtrPosition, stringPtrPosition+stringSize)
  console.log("extract --->", extractedBuffer)

  const str = new TextDecoder("utf8").decode(extractedBuffer)
  console.log(`📝: ${str}`)


  /*
  console.log("start   --->", completeBufferFromMemory[helloStringPosition], String.fromCharCode(completeBufferFromMemory[helloStringPosition]))
  console.log("extract --->", completeBufferFromMemory.slice(helloStringPosition, helloStringPosition+11))

  let message = completeBufferFromMemory.slice(helloStringPosition, helloStringPosition+11).forEach(item => console.log(item,":",String.fromCharCode(item)))


  const extractedBuffer = new Uint8Array(memory.buffer, helloStringPosition, 11) // 11 == length of "hello world"

  console.log("😁 Uint8Array buffer:", extractedBuffer)

  const str = new TextDecoder("utf8").decode(extractedBuffer)
  console.log(`📝: ${str}`)
  */

  // call the module's `dealloc` function
  instance.exports.dealloc(ptr, bytes.length);

})();

// $ node --experimental-wasi-unstable-preview1 index.js
