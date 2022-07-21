

// did the same return as the Go Function

let ptr = 103040
console.log(ptr, typeof ptr)
let size = 11
console.log(size, typeof size)


let ptr64 = BigInt(ptr)
let size64 = BigInt(size)

console.log(ptr64, typeof ptr64)
console.log(size64, typeof size64)

ret = (ptr64 << BigInt(32)) | size64
console.log(ret, typeof ret)

