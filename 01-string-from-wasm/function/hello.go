package main

// Declare a main function, this is the entrypoint into our go module
// That will be run.
func main() { }

//export hello
func hello() *byte {
  return &(([]byte)("hello world")[0])
}


