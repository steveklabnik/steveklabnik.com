---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Are out parameters idiomatic in Rust?"
pubDate: 2020-10-16
blog: words
---

There is a pretty straightforward design pattern called "out parameters" that you may have heard of before. In short, the question is, does your function wear pants... err, I mean, does your function modify data like this:

```rust
fn foo() -> i32 {
    // body elided
}

let x = foo();

```

or like this:

```rust
fn foo(out: &mut i32) {
    // body elided
}

let mut x = 0;

foo(&mut x);

```

That is, does your function return a value, or modify a parameter?

There are a number of different reasons you may or may not use one or the other of these techniques in different langauges, and they often depend on the semantics of the langauge itself.

In Rust, you almost always want to return a value from a function, that is, prefer option one over option two. There are a few reasons for this.

The first is that it's generally semantically more accurate. Your function is producing a value of some kind, so it should, well, produce a value. Additionally, with Rust's relatively rich data type support, it's easy to do things like return a tuple if you need to return more than one thing.

The second is that, in some languages and with some compilers, the out parameter is a performance optimization that you as a programmer do by hand. Imagine if I wasn't returning an `i32`, which is just a few bytes. The most straightforward way of implementing the function in assembly is to copy the return value from the function to its parent's stack. This also may be required by your ABI. Now, I am not an expert here, so I am not 100% sure of the exact current state of things, but at least in theory, optimizations can be done by the compiler. This is a pretty well-known optimization, see [Wikipedia for more](https://en.wikipedia.org/wiki/Copy_elision). But, I think that we do already do this today in some cases, if I compile both of these functions:

```rust
fn returns_huge(out: &mut [u64; 1024]) {
    *out = [0; 1024];
}

fn returns_huge() -> [u64; 1024] {
    [0; 1024]
}

```

I get identical assembly:

```rust
playground::returns_huge: # @playground::returns_huge
# %bb.0:
    movl    $8192, %edx                     # imm = 0x2000
    xorl    %esi, %esi
    jmpq    *memset@GOTPCREL(%rip)          # TAILCALL
                                        # -- End function

```

However, it is possible that this breaks for other examples, and so you may, may, may want to move to an out parameter if you see extraneous copies appear in your performance profiling.

C++ guarantees this optimization in certain circumstances; it would be really nice for Rust to do so as well. My understanding is that's the intention.

## When you should use out parameters

There is one case where it is idiomatic to use an out parameter in Rust though. That's when you are writing into some kind of buffer, and you want to be able to allow your caller to provide the buffer to you, rather than making a new one. This would allow the caller to re-use the same buffer for multiple operations.

(I say "buffer" here but really, this generalizes to any sort of grow-able container, to be clear. I am using "buffer" in a loose sense here.)

You can see this play out in the Rust standard library. `std::io::Read` looks like this:

```rust
pub trait Read {
    fn read(&mut self, buf: &mut [u8]) -> Result<usize>;
}

```

This accepts a `&mut [u8]` rather than returning a new buffer. This allows for significant savings by re-using a buffer. For example, in [Chapter 2 of the book](https://doc.rust-lang.org/stable/book/ch02-00-guessing-game-tutorial.html), we have this example:

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1, 101);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

```

We aren't *quite* properly re-using the buffer here, but we could modify this to look like this:

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1, 101);

    let mut guess = String::new();

    loop {
        println!("Please input your guess.");

        guess.clear();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

```

Here, we create our string outside of the loop, and then on each iteration of the loop, clear it. Clearing it does not deallocate the backing memory; it only changes the length to zero. When the next line is read in, if it's smaller than the existing size of the string, it won't allocate any new memory. This would not be possible if `stdin()` returned a new `String` every time, so even though the out parameter is a bit less nice to use, it can be much faster.

It took 26 releases of Rust for `[std::fs::read](https://doc.rust-lang.org/stable/std/fs/fn.read.html)` and `[std::fs::read_to_string](https://doc.rust-lang.org/stable/std/fs/fn.read_to_string.html)` to be added for this reason; we eventually did because in many cases, you don't care about re-using the buffer, and these functions are nicer to use, but they weren't included originally because they're pretty simple, and are built on top of the re-usable solutions:

```rust
pub fn read_to_string<P: AsRef<Path>>(path: P) -> io::Result<String> {
    fn inner(path: &Path) -> io::Result<String> {
        let mut file = File::open(path)?;
        let mut string = String::with_capacity(initial_buffer_size(&file));
        file.read_to_string(&mut string)?;
        Ok(string)
    }
    inner(path.as_ref())
}

```

That said, I am exceedingly glad we did add them. It is a much nicer user experience.

(You may be wondering "what's up with that inner function there?"... that maybe deserves another post! It's not neccesary, strictly speaking, but is another case of "the compiler does not do an optimization yet so write some code in a strange way by hand.")
