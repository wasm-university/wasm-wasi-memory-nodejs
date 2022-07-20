package main

import (
	"fmt"
)


// Declare a main function, this is the entrypoint into our go module
// That will be run. In our example, we won't need this
func main() {
  fmt.Println("👋 hello from the main method")
}

//export hello
func hello() *byte {
  return &(([]byte)("hello world")[0])
}


