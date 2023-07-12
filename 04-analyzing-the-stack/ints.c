// What looks like a simple file can be extremely interesting
// under the eyes of a great debugger and a curious programmer.

// I was doing investigating how the stack works going line by
// line.

int main(void) {
  int x, y, z;
  
  x = 7;
  y = 3;
  z = 5;

  return x + y + z;
}
