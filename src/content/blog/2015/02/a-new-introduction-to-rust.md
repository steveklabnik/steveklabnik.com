---
title: "A new introduction to Rust"
pubDate: 2015-02-27
blog: words
---


Lately, I’ve been giving a lot of thought to first impressions of Rust. On May 15, [we’re going to have a lot of them](http://blog.rust-lang.org/2015/02/13/Final-1.0-timeline.html). And you only get one chance at a first impression. So I’ve been wondering if our [Intro](http://doc.rust-lang.org/intro.html) and [Basics](http://doc.rust-lang.org/book/basic.html) are putting our best foot forward. At first I thought yes, but a few days ago, I had an idea, and it’s making me doubt it, maybe. So instead of re-writing all of our introductory material, I’m just going to write the first bit. A spike, if you will. And I’d like to hear what you think about it. This would take the same place as [2.4: Variable bindings](http://doc.rust-lang.org/book/variable-bindings.html) in the existing structure: They’ve installed Rust and gotten Hello World working.

```
$ rustc --version
rustc 1.0.0-dev (dcc6ce2c7 2015-02-22) (built 2015-02-22)
```

## Hello, Ownership

Let’s learn more about Rust’s central concept: ownership. Along the way, we’ll learn more about its syntax, too. Here’s the program we’re going to talk about:

```
fn main() {
    let x = 5;
}
```

This small snippit is enough to start with. First up: `let`. A `let` statement introduces a **variable binding**. Bindings allow you to associate a name with some sort of value.

Why ‘variable binding’? Rust draws heavily from both systems languages and functional programming languages. The name “variable binding” is a great example of this. Many systems languages let you declare a variable. These variables are called by that name because they can change over time, they’re mutable. Many functional languages let you declare bindings. These bindings are called by that name because they bind a name to a value, and don’t change over time. They’re immutable.

Rust’s variable bindings are immutable by default, but can become mutable, allowing them to be re-bound to something else. In other words,

```
fn main() {
    let x = 5;
    x = 6; // error: re-assignment of immutable variable

    let mut y = 5;
    y = 6; // just fine
}
```

You won’t be typing `mut` that often.

In any case, there’s one way in which `let` bindings work just like variables in other languages, but they’re the key insight into ownership. As you know, a computer program is executed line by line. At least, until you hit a control flow structure, anyway. Let’s give our program line numbers, so we can talk about it.

```
// 1
fn main() {    // 2
               // 3
    let x = 5; // 4
               // 5
}              // 6
               // 7
```

Line one is before our program starts. The endless void. Not actually endless, though, as line two is where we start `main`. This is the first line that is actually executed, and kicks off our program. Great. Line three is blank, so nothing happens, just like one. Line four is where the first actually interesting thing occurs: we introduce a new variable binding, `x`. We set `x`’s initial value to five, allocated on the stack. If you don’t know what that means, we’ll talk about it right after ownership. For now, `x` is five. No big deal. Line six has a closing curly brace, and so `main`, and thus, our program, is over. Line seven, the void returns.

This is basically the same thing as many programming languages. But let’s point out an aspect you, as a programmer, probably take for granted. Scoping. If I asked you, “Is `x` valid on line one?” you would say “no.” “Three? Seven?” “Nope, nada. `x` is valid from line four, where it was declared, to line six, where it goes out of scope.” This illustrates the idea. There is a certain scope, a certain set of lines, where `x` is a valid identifier. That scope starts from where it was declared, and goes until the end of the block. We can look at this scope in two ways: for the first, imagine this source code printed on a piece of paper. You highlight lines four three six. In some sense, this is a distance: three lines of code, rather than three meters. But if we imagine the computer running this program, this scope represents a time: three statements of processor execution. Even though that number is actually different based on the assembly, but at our level of abstraction, three units.

In Rust, we have names for these concepts, which are implicit in other languages. The thing that introduces a new scope is called the ‘owner.’ It’s in charge of the data it’s bound to, so we say that it ‘owns’ that data. The length of a scope is called a ‘lifetime,’ taken from that idea of time passing as your program executes. But you can also think of it as a segment of lines of code.

So if other programs do this, why does this make Rust special? Sure, Rust gives these concepts specific names, but names themselves aren’t significantly different. The difference is that Rust takes this concept and cranks it up to 11. Where most programming languages only keep track of how long variables are in scope, Rust knows how to connect the scopes of variables that are pointing to the same thing, as well as how to know the scope of things that are more than just stack-allocated memory.

Let’s talk more about this connecting of scopes. Here’s another Rust program:

```
fn main() {         // 1
    let x = 5;      // 2
                    // 3
    {               // 4
                    // 5
        let y = &x; // 6
                    // 7
    }               // 8
                    // 9
}                   // 10
```

In line four, we use an open curly brace to create a new scope. This scope, like in many languages needs to be closed before the scope of `main` gets closed. It’s nested inside of it.

In this new scope, on line six, we declare a new binding, `y`, and we set it equal to `&x`. This reads as “a reference to `x`,” as `&` is the reference operator in Rust. References are Rust’s version of ‘pointers’ from other systems programming languages. Here’s a quick introduction, if you haven’t had to deal with pointers before.

By default, in Rust, data is allocated on “the stack.” Your program is given a chunk of memory, and it’s able to allocate information there. The stack starts at the bottom address of memory, and then grows upwards. For example, at the start of our program, the stack has nothing in it:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20e35b5948ec7546b7a905f4db1ea869c6.csv)

At line2, we introduce `x`, and it stack-allocates the number five, like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20935c84280787447b8fefcaaefb4575c0.csv)

We’ve got an address in memory, the value at that address, and the name we’ve used in our program. It starts at the bottom because remember, the stack grows upward. Finally,on line six, we have `y`:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20f7b25102df1d41e884fdac5b761fe567.csv)

Instead of being a value itself, `y` is a pointer to another location in memory, which holds a value. Because `y = &x`, we take the memory location of `x` and store it into `y`.

On line eight, the inner scope ends, and `y` goes out of scope. Its lifetime is over. It gets deallocated. Our memory is back to this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20daa49962f5c5408d82e28e9e3e073be7.csv)

Finally, on line ten, our program is over. `x` goes out of scope, and we look like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%2086c230f1a23e49d892a529d7988a272c.csv)

Everything is gone, all is well.

Pointers can point other places than the stack: they can also point to ‘the heap.’ The heap starts at the top of your program’s memory, and grows down:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20007add295d434d84a281a93e7358f0d5.csv)

The heap starts at `0x00` and grows down, and the stack starts at `0xff` and grows up. While the stack contains the data that the programming language has allocated for our bindings, our program can request dynamic amounts of memory from the heap. Here’s how to do this in C:

```c
#include<stdio.h>
#include<stdlib.h>

int main() {
        int *x = malloc(sizeof(int)); // 1
        *x = 5;                       // 2
                                      // 3
        printf("%i", *x);             // 4
}
```

The call to `malloc` (‘memory allocate’) on line 1 requests some memory from the heap. We get a pointer, `int *x`, to that memory. Our memory looks like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%203e8198d0b0a5408bbcf399a9d682c779.csv)

We have `x`, which is a variable on the stack, as a pointer to our dynamically allocated memory, which is located on the heap at `0x00`. But at that location, we haven’t done anything, so who knows what the value is? This means that after line one is done executing, `x` will be pointing to garbage memory. Hopefully we set it equal to a value before we try to use it, or bad things could happen.

On line two, we set that memory location to five. Whew! Memory looks like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20ccd2c85eb0a34f6483acdbfafa4c841a.csv)

Everything looks good. On line four, we have to print out `*x`, not `x`: `x` is the address of the memory, so we’d get `0x00` instead of `5`. After line four, `x` goes out of scope, and gets deallocated. Memory looks like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%200aec19c2d6a645a3b860bf65cc922853.csv)

… wait a minute, we never took care of that `5`! We left some memory ‘dangling.’ In this program, that’s okay, because now that it’s over, the operating system reclaims all this memory, and so we don’t have any problems. But we *do* have a bug. We just don’t know it. This bug will sit there until something changes, and the bug is found. But we’ll get to that.

A slightly more responsible program looks like this:

```c
#include<stdio.h>
#include<stdlib.h>

int main() {
        int *x = malloc(sizeof(int));
        *x = 5;

        printf("%i", *x);

        free(x);
}
```

The call to `free` releases the memory pointed to by `x`, and all is good.

Let’s compare this to an equivalent Rust program:

```rust
fn main() {
    let x = Box::new(5);

    println!("{}", x);
}
```

It looks similar at first, with `Box::new` filling in for `malloc`, But where’s the free? Does this have the same bug?

No. This Rust is in fact equivalent to the one with the `malloc` and `free`. You see, when we introduce our binding, `x`, Rust knows that `x` has ownership over the memory in the `Box`. and so, at the end of the program, when `x` goes out of scope, Rust also ensures to free the memory that the `Box` allocated. It happens automatically. The programmer can’t forget it. And the allocation itself was a little easier, because Rust used the type system to figure out how many bytes to allocate, you didn’t need to calculate it with `sizeof`. Allocation also set the value to 5 for you, which is convenient and less error-prone. When printing out `x`, you could just use the binding name itself, and not need to dereference it with `*`.

C++ programmers have ways of doing this kind of thing, with something called “RAII.” As promised before, Rust knows this concept at a deeper, language level. So it can be safe in places that RAII cannot. Here’s an example, in C++:

```c
#include<iostream>
#include<vector>
#include<string>

int main() {
    std::vector<std::string> v;

    v.push_back("a");

    std::string& x = v[0];

    v.push_back("b");

    std::cout << x;
}
```

This program creates a vector of strings, called `v`:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20b1e4993d4fc14c9abbe2c2d7deb3be25.csv)

`v` is a ‘fat pointer,’ three pointers in one. The first is a pointer to the data, the second is the length of the array, how many elements are in it. The third is the capacity of the array, how much memory is allocated for this vector. The amount of initial capacity is up to the implementation, I’ve chosen one here. Because this is a vector of strings, we need to allocate a single string, so in line with our capacity. Strings are also a fat pointer, and so we allocate three bytes, starting at `0x00`.

The program then calls `push_back()` on the vector, which pushes a string onto the end of the vector:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%205c80884c8d7d4ae290de9e2b9caa1f11.csv)

We’ve now replaced our initial, `GARBAGE`, string with a real one. Therefore, our data, length, and capacity are updated: `0x03` is the next free location in the heap, so it gets our signle character, `A`. We have a length of one, and a capacity of one, so the other two values are set appropriately.

Next, it creates a pointer to the `0`th element of that vector:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%2031184db665934f5ea7acaea0b98ce4b9.csv)

`x` is allocated on the stack, and points to the first element of `v`, which, as we know, is located at address `0x00`, as its data pointer, `0xff`, shows us. So `x` has the initial value of `0x00`.

Next is where everything goes wrong. It tries to push a string onto the end of that vector. The problem is, we only allocated one element. So we need to allocate more. After this is done, memory looks like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20900c132e9e144b1e94ffb6c47d5fc068.csv)

Inside `push_back()`, there’s a call to `malloc`, and that is assigned to some temporary value. We’ve chosen `0xfb` and `(temp)` to identify it here. It points to the newly allocated data, at `0x04`.

Now that we’ve got space for two strings, let’s copy the data from the original place to the new one, from `0x00` to `0x04`:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%208311f6138fd34b39840f66e8b047db11.csv)

and then free that original string:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20885b35ff100341e6819740529f0d4701.csv)

Then, we have to update `v` to point at the newly allocated vector, at `0x04`:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20ec53dd46647143b58bb3c7b136d66a59.csv)

This step is where the bug is! You see, `x` was pointing at the same data that `v` was pointing at. This is called ‘aliasing.’ Because C++ does not have the concept of ownership and lifetimes, it doesn’t understand that the validity of `x` and the validity of `v` are closely intertwined. Thus, we’re allowed to do this reallocate-and-copy dance with what `v` points to, but `x` has no idea. Look at the diagram above: it still has `x` pointing to `0x00`. But we just deallocated that memory! This is when the bug occurs, but it’s a silent bug. A time bomb, ticking away.

Let’s see how it explodes. Our code goes on, oblivious.

Our new string at `0x04` still says that we have one capacity, one length, and that data is at `0x03`. That’s all still accurate, so we’re all good. Next, we need to deal with our new string, “B.” We have the space, so we do so:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20cc5b92de5ac545878c67a66a878863b6.csv)

We’ve placed our new string at `0x07` to `0x09`, with its data pointer, length, and capacity. Our data is at `0x0A`, which has the value `B` stored at it. All is good, and so we return from `push_back`. `(temp)` is deallocated, and memory looks like this:

[Untitled](A%20new%20introduction%20to%20Rust%204bbc792c85e141fb81570865cbbe2f87/Untitled%20Database%20ee6def6517424e0fb6c9ad7c3ec0389e.csv)

On the final line, we print out the value that `x` points to. As we can see above, `x` points to `0x00`, which has nothing saved at it! `x` is invalid memory. Using `x` is a bad idea. But the programming language can’t save us, even though the bug happened many lines ago.

How are you supposed to deal with this problem? Here’s [the documentation for `push_back`](http://en.cppreference.com/w/cpp/container/vector/push_back):

> If the new size() is greater than capacity() then all iterators and references (including the past-the-end iterator) are invalidated.
> 

In other words, when you call `push_back`, it’s your responsibility to make sure to not use anything that points to the underlying data, because they are now invalid. The documentation has explained our bug perfectly! And while this is a short example, these problems can crop up in huge codebases, and the errors can be very hard to track down.

Let’s look at the same problem, in Rust:

```
fn main() {
    let mut v = vec![];

    v.push("Hello".to_string());

    let x = &v[0];

    v.push("world".to_string());

    println!("{}", x);
}
```

This program has identical semantics to the C++ version presented above. (If we weren’t trying to get the exact same semantics, we could leave off the `.to_string()` calls, and it would still work. But let’s ignore that for now.) So does it have the same bug? Well, it would, but it doesn’t compile:

```
main.rs:8:5: 8:6 error: cannot borrow `v` as mutable because it is also borrowed as immutable
main.rs:8     v.push("world");
              ^
main.rs:6:14: 6:15 note: previous borrow of `v` occurs here; the immutable borrow prevents subsequent moves or mutable borrows of `v` until the borrow ends
main.rs:6     let x = &v[0];
                       ^
main.rs:11:2: 11:2 note: previous borrow ends here
main.rs:1 fn main() {
...
main.rs:11 }
           ^
```

When you call the method `push()` on a vector, it ‘borrows’ the vector. Just like we wrote `let y = &x` before, to borrow the value of `x`. Rust now understands that the scope of `x` and the scope of `v` are connected. There’s just one problem: because `push` allocates more memory, it can’t just do a regular borrow, it needs a mutable borrow. If `&x` borrows x, `&mut x` mutably borrows `x`. Like we discussed previously, mutability means that you can reassign the value of that binding. But when we mutably *borrow* something, we make a guarantee: this is the only reference to this memory that exists. That way, we don’t have the problem of the C++ code, where a reference became outdated. If we’re the only reference, we are free to change what we’re pointing to, becuase that won’t cause any problems.

So when we create a borrow with `&`, it lasts for the scope that it exists, like this:

```
fn main() {
    let mut v = vec![];

    v.push("A");   

    let x = &v[0];     // <+
                       //  |
    v.push("B");       //  |
                       //  |
    println!("{}", x); //  |
}                      // <+
```

The line indicates the scope, or lifetime, of the borrow. But when we call push with `B`, we have to get a mutable borrow, in order to allocate the new memory. But because `&mut` is a promise that there are no other references, this is a violation of the rules. This is the point at which the bug happened in the C++ example, if you remember. And so it’s the place where the Rust compiler throws its error message. It might make more sense this time around:

```
main.rs:8:5: 8:6 error: cannot borrow `v` as mutable because it is also borrowed as immutable
main.rs:8     v.push("world");
              ^
main.rs:6:14: 6:15 note: previous borrow of `v` occurs here; the immutable borrow prevents subsequent moves or mutable borrows of `v` until the borrow ends
main.rs:6     let x = &v[0];
                       ^
main.rs:11:2: 11:2 note: previous borrow ends here
main.rs:1 fn main() {
...
main.rs:11 }
           ^
```

We cannot borrow `v` as mutable, with `push()`, becuase it is also borrowed as immutable, by `x`. That’s exactly the problem, and Rust solves it.

There’s more to both ownership and Rust syntax, so let’s cover some syntactical things, and then talk more about ownership.

---

I’m fairly confident with the memory layouts involved, though the addresses are of course not exact. I’m also not sure that this mega deep detail dive is the correct way to do an introduction either, it’s also thorough, but maybe in a bad way? It’s almost the exact opposite of the way that I’ve done things at present. Also, apparently I visuallize things in reverse, with `0x00` to `0xFF` as going down, but others think the opposite, which may be confusing. Please send me a [tweet](http://twitter.com/steveklabnik) or [an email](mailto:steve@steveklabnik.com) with your thoughts. Thanks!
