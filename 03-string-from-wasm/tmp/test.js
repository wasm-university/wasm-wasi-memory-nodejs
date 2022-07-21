/* from https://twitter.com/rauschma/status/1550053773694976000?s=20&t=SliD1HRBSHgw81zZFQHl_A
const ptr = 103040
const size = 11
const combined = (BigInt(ptr) << 32n) | BigInt(size)

const MASK = (2n**32n)-1n
  // > MASK.toString(2)
  // '11111111111111111111111111111111'

const size2 = Number(combined & MASK)
const ptr2 = Number(combined >> 32n)

*/

/*
– I prefer `const`, you may not.
– 32n is better than BigInt(32)
*/

// did the same return as the Go Function

const ptr = 103040
console.log(ptr, typeof ptr)
const size = 11
console.log(size, typeof size)


const ptr64 = BigInt(ptr)
const size64 = BigInt(size)

console.log(ptr64, typeof ptr64)
console.log(size64, typeof size64)

const ret = (ptr64 << 32n) | size64

//const ret = (ptr64 << BigInt(32)) | size64
console.log("return value:",ret, typeof ret)

/*
helloWorldPtr := uint32(ptrSize[0] >> 32)
helloWorldSize := uint32(ptrSize[0])
*/

const MASK = (2n**32n)-1n
console.log("mask:", MASK)

//console.log("get ptr from return value:", Number(ret >> BigInt(32)))
console.log("get ptr from return value:", Number(ret >> 32n))
console.log("get size from return value:", Number(ret & MASK))
