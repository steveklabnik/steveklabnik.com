---
layout: ../../layouts/MarkdownPostLayout.astro
title: You can't "turn off the borrow checker" in Rust
pubDate: 2018-09-14
blog: words
---


Every once in a while, someone will talk about `unsafe` in Rust, and how it “turns off the borrow checker.” I think this framing leads to misconceptions about `unsafe` and how it interacts with safe code.

Here’s some code that causes a borrow checker error:

```
fn main() {
    let mut x = 5;
    
    let y = &x;
    let z = &mut x;

    println!("{}", y);
}
```

And the error:

```
error[E0502]: cannot borrow `x` as mutable because it is also borrowed as immutable
 --> src/main.rs:5:18
  |
4 |     let y = &x;
  |              - immutable borrow occurs here
5 |     let z = &mut x;
  |                  ^ mutable borrow occurs here
6 | }
  | - immutable borrow ends here
```

Rust won’t let us have a `&T` and a `&mut T` to the same `T` at the same time.

If `unsafe` "turned off the borrow checker, we’d expect this code to work:

```
fn main() {
    let mut x = 5;
    
    unsafe {
        let y = &x;
        let z = &mut x;

        println!("{}", y);
    }
}
```

However, we get the same error, plus a new warning:

```
error[E0502]: cannot borrow `x` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:22
  |
5 |         let y = &x;
  |                  - immutable borrow occurs here
6 |         let z = &mut x;
  |                      ^ mutable borrow occurs here
7 |     }
  |     - immutable borrow ends here

warning: unnecessary `unsafe` block
 --> src/main.rs:4:5
  |
4 |     unsafe {
  |     ^^^^^^ unnecessary `unsafe` block
  |
  = note: #[warn(unused_unsafe)] on by default
```

So what does `unsafe` actually do? Unsafe Rust is a *superset* of Safe Rust. `Unsafe` never changes the semantics of Rust code. It instead adds new features that you can only use inside an `unsafe` block.

One of those features is the ability to de-reference a “raw pointer”. This code *does* compile:

```
fn main() {
    let mut x = 5;
    
    let y = &x as *const i32;
    let z = &mut x as *mut i32;
    
    unsafe {
        println!("y: {} z: {}", *y, *z);
    }
}
```

`y` and `z` here have the types `*const i32` and `*mut i32`, both kinds of raw pointers. In order to print `y` and `z`, we must de-reference them, which means that we need an unsafe block.

> Incidentally, this code is safe. Raw pointers are allowed to alias. And we have no &T or &mut Ts here. So we’re good.
> 

Why does this matter? Well, a lot of people think that as soon as you drop into `unsafe`, you’re missing the point of Rust, and that you lose all of its guarantees. It’s true that you have to do a lot more work when writing unsafe, since you don’t have the compiler helping you in certain situations, but that’s only for the unsafe constructs.

For example, let’s look at Rust’s standard library, and the `[LinkedList<T>](https://doc.rust-lang.org/stable/std/collections/linked_list/struct.LinkedList.html)` that it contains. It looks like this:

```
pub struct LinkedList<T> {
    head: Option<NonNull<Node<T>>>,
    tail: Option<NonNull<Node<T>>>,
    len: usize,
    marker: PhantomData<Box<Node<T>>>,
}
```

I’m not gonna go into *too* much detail here, but it has a head pointer, a tail pointer, a length. `[NonNull<T>](https://doc.rust-lang.org/stable/std/ptr/struct.NonNull.html)` is like `*mut T`, but asserts that it will never be null. This means that we can combine it with `Option<T>`, and the option will use the `null` case for `None`:

```
fn main() {
    println!("{}", std::mem::size_of::<*mut i32>());
    println!("{}", std::mem::size_of::<Option<std::ptr::NonNull<i32>>>());
}
```

prints this on my system:

```
8
8
```

This optimization is guaranteed due to guarantees on both `Option<T>` and `NonNull<T>`.

So now, we have a sort of hybrid construct: `Option<T>` is safe, and so we can do some operations entirely in safe code. Rust is now forcing us to handle the null checks, even though we have zero runtime overhead in representation.

I think a good example of how this plays out in practice is in the implementation of `[append](https://doc.rust-lang.org/stable/std/collections/linked_list/struct.LinkedList.html#method.append)`, which takes two `LinkedList<T>`s and appends the contents of one to the end of the other:

```
    pub fn append(&mut self, other: &mut Self) {
        match self.tail {
            None => mem::swap(self, other),
            Some(mut tail) => {
                if let Some(mut other_head) = other.head.take() {
                    unsafe {
                        tail.as_mut().next = Some(other_head);
                        other_head.as_mut().prev = Some(tail);
                    }

                    self.tail = other.tail.take();
                    self.len += mem::replace(&mut other.len, 0);
                }
            }
        }
    }
```

Here’s some comments to help understand what’s going on:

```
    pub fn append(&mut self, other: &mut Self) {
        // do we have a tail?
        match self.tail {

            // If we don't, then we have no elements, and so appending a
           // list to this one means that that list is now this list.
            None => mem::swap(self, other),

            // If we do have a tail...
            Some(mut tail) => {

                // the first thing we do is, check if the other list has
                //  a head. if it does...
                if let Some(mut other_head) = other.head.take() {

                    // we set our tail to point at their head, and we 
                    // set their head to point at our tail.
                    unsafe {
                        tail.as_mut().next = Some(other_head);
                        other_head.as_mut().prev = Some(tail);
                    }

                    // We set our tail to their tail
                    self.tail = other.tail.take();

                    // finally, we add their length to our length, and 
                    // replace theirs with zero, because we took all
                    // their nodes!
                    self.len += mem::replace(&mut other.len, 0);

                } // there's no else case for that if let; if they don't
                  //  have a head, that list is empty and so there's
                  //  nothing to do.
            }
        }
    }
```

We only need `unsafe` when mutating the `next` of the `tail` of the first list, and the `prev` of the `head` of the second list. And that’s even only in the case where the `tail` exists in the first place. We can do things like “set our tail to their tail” in safe code, because we’re never de-referencing pointers. Safe Rust is helping us manage many, but not all, of our guarantees. We *could* move the `unsafe` block to encompass the entire body of this function, and Rust would still make us check those `Option<T>`s. It would still check that `self` and `other` are not aliased by `&T` or `&mut T`s in the body of the function.

`unsafe` is a powerful tool, and should be used with care. But that doesn’t mean that you throw out many of the things that make Rust what it is.
