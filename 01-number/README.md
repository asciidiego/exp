# Number

## How to run?

To assemble (and link) the code, I used the following commands on a M1 MacBook Pro:

```zsh
# assembler
as -o number.o number.s -g

# linker
ld -macosx_version_min 13.0 -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib number.o -o number -lSystem

```

## What is this

This is an experiment to understand how computer memory works.
I did it in ARM assembly and C.

I assemble the `.s` extension code using the `as` assembler.
Note however that I use the "Mac OS X Mach-O GNU-based assembler".

In particular, this is my version output:

```zsh

as --version

# Output
#
# Apple clang version 14.0.3 (clang-1403.0.22.14.1)
# Target: arm64-apple-darwin22.4.0
# Thread model: posix
# InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin

```

## C version

I did the C version because I wanted to debug it to see and try
to understand why people called C "portable assembly". It was
helpful to see how each C statement matched to a few ARM assembly
instructions and seeing the stack  (or heap if you use `malloc`)
registers and the memory where they point to change.

