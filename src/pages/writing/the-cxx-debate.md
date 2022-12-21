---
layout: ../../layouts/MarkdownPostLayout.astro
title: "The CXX Debate"
pubDate: 2020-08-22
---

Let's talk about safe and unsafe in Rust.

To review, Rust has a concept of "unsafe code." Unsafe Rust is a superset of safe Rust, letting you do some extra things that are dangerous. It's your job as a programmer to verify that your code is playing by the rules, because the compiler cannot check them for you.

Imagine we have a C program, `add.c` that looks like this:

```c
#include <stdint.h>

uint32_t add_one(uint32_t x) {
    return x + 1;
}
```

We can call this function from Rust like this:

```rust
extern {
    fn add_one(x: u32) -> u32;
}

fn main() {
    let x = 5;

    let y = unsafe { add_one(x) };

    println!("{}", y);
}
```

We need to invoke `unsafe` here because any `extern` function doesn't come from Rust; it comes from another language, and it's possible that that function does something that would cause undefined behavior. We look at `add_one`, see that it's not violating any rules, and we're good.

However, we know that we can pass any `u32` to this function, and it's safe. We don't need to example the value of the argument every single time, they're all fine. So we do this:

```rust
mod internal {
    extern {
        pub fn add_one(x: u32) -> u32;
    }
}

fn add_one(x: u32) -> u32 {
    unsafe {
        internal::add_one(x)
    }
}

fn main() {
    let x = 5;

    let y = add_one(x);

    println!("{}", y);
}
```

This is a classic way that unsafe code gets used in Rust; we have our binding, `internal::add_one`, and our wrapper, `add_one`. The wrapper is safe, but uses unsafe internally. This is totally fine! The idea is that this gives us a sort of "seam" in our code. Imagine that `add_one` would do bad things if we passed it a number less than five. We could use our wrapper to check this:

```rust
// we would use a real error type in real code but we're using () here because we don't
// actually care about the error handling here.
fn add_one(x: u32) -> Result<u32, ()> {
    if x < 5 {
        return Err(());
    }

    unsafe {
        Ok(internal::add_one(x))
    }
}
```

But, `add_one` doesn't need to do this. Every `u32` we pass is totally fine.

Nothing so far is controversial here, this is just background and setup. The purpose of these examples is for you to read and ask yourself, "Is this okay? How do I feel about this?"

Somewhere after this point, opinions start to diverge. 

---

Our C library is growing new functionality! Here it is:

```c
#include <stdint.h>

uint32_t add_one(uint32_t x) {
    return x + 1;
}

uint32_t add_two(uint32_t x) {
    return x + 2;
}
```

We can now add two, not only one. Amazing, I know. Let's write another wrapper:

```rust
mod internal {
    extern {
        pub fn add_one(x: u32) -> u32;
        pub fn add_two(x: u32) -> u32;
    }
}

fn add_one(x: u32) -> u32 {
    unsafe {
        internal::add_one(x)
    }
}

fn add_two(x: u32) -> u32 {
    unsafe {
        internal::add_two(x)
    }
}

fn main() {
    let x = 5;

    let y = add_one(x);
    let z = add_two(x);

    println!("{}, {}", y, z);
}
```

Two functions, both have an unsafe binding, and a safe wrapper. 

Is this okay? How do you feel about this?

Now, imagine we had 100 of these functions. Writing this all out ends up being a massive amount of error-prone boilerplate. Heck, I almost forgot to switch to `internal::add_two` after I copy/pasted the new function there. Rust has a tool to abstract over code like this: macros! So let's refactor our code with a macro:

```rust
macro_rules! call_c {
    // implementation elided
}

call_c! {
    fn add_one(x: u32) -> u32;
    fn add_two(x: u32) -> u32;
}

fn main() {
    let x = 5;

    let y = add_one(x);
    let z = add_two(x);

    println!("{}, {}", y, z);
}
```

I am not showing you the macro because the exact contents are gnarly and immaterial to the point. I also think that maybe this needs to be a procedural macro not a `macro_rules` macro but again, those details don't really matter. The point is, we have a macro, it generates the exact same structure that we had before.

Is this okay? How do you feel about this?

---

This wrapper is also known as [CXX](https://github.com/dtolnay/cxx). The syntax is slightly different, but conceptually, this is what it is doing. The reason it is controversial is that some people do not in fact feel that the above macro is okay. The reason that they feel it is not okay is that you do not write `unsafe` by hand, yet, if you're not careful, things can go wrong. I think this is a totally understandable and reasonable reaction, but I also don't think that it makes a ton of sense once you actually dig into the details.

We actually don't need C to think about this problem, we can do this with unsafe Rust purely. And I think that using unsafe Rust makes it a bit more clear, so let's talk about this in some more depth, but purely with Rust.

The `unsafe` keyword has two, complimentary uses. It can be used to require your caller to check invariants, and it can be used to tell the compiler "I have checked the invariants." In other words:

```rust
// I am leaving off parameters and return types because it doesn't matter, but real code
// would of course have them.

// When calling foo, please check some invariants.
unsafe fn foo() {
    // ...
}

// I have checked the invaraints, and this is okay to do.
unsafe {
    foo();
}
```

The compiler forces these combinations of things; using a feature that generates a requirement to check something will require you to also declare that you've checked it. These requirements bubble up, in other words, we can also pass that obligation to our callers:

```rust
unsafe fn foo() {
   // ...
}

fn bar1() {
    // I have checked the invariants, and this is okay to do
    unsafe {
        foo();
    }
}

// I have not checked the invariants, so since I'm calling foo, you must check
// the invariants
unsafe fn bar2() {
    foo();
}
```

Rust's built-in FFI works like `bar2`; if the contents of `foo` are written in another language, it has to be unsafe. This means that, even if it is perfectly safe to call `foo` with any possible arguments, or in any circumstances, we still need to write a wrapper.

CXX's take on FFI is that it works like `bar1`; by using the library we are saying "hey, I know that `foo` is safe in all circumstances, so please generate the wrapper for me." In other words, in some sense, it pushes the unsafe block across the other side of the boundary, because that's where it actually belongs in this case.

---

This has generated a lot of feelings on both sides. The people who don't like it are upset that the letters `['u', 'n', 's', 'a', 'f', 'e']` are not present, and feel that this makes it quite easy to make a mistake and accidentally use the macro on some code that is not actually safe to call in all circumstances. The people who do like it argue that when you have a large number of calls that are actually safe, using a macro to abstract them away is fine, like you'd abstract away any other boilerplate. Sometimes, repeating the same thing over and over again makes mistakes more likely, not less.

In the meantime, [dtolnay has decided](https://www.reddit.com/r/rust/comments/ielvxu/the_cxx_debate/g2i1r7a/?context=3) to change the macro and re-add the `unsafe` token, which helps assuage the fears of the people who are upset. But it also centralizes these sorts of uses of `unsafe`, which helps achieve the goals of the library in the first place. I am continually impressed by dtolnay's ability to design libraries, and hope he keeps writing Rust code forever.

Anyway, if you were wondering what this all was about, that's my take on it. I personally feel that CXX is fine the way that it is, but I'm also happy with this compromise, and hope that others are too.
