---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Structure literals vs. constructors in Rust"
pubDate: 2016-07-26
blog: words
---


Learning the basics of a language and its syntax is easy. Learning how all those bits fit together is a bit harder. There’s a neat intersection between three of Rust’s features that I’ve seen people use, but never seen written down. I was explaining this technique to someone in `#rust-beginners` the other day, and thought I’d write it down in case it helps you, too.

A small review: If you have a `struct` in Rust, like this:

```
struct Point {
    x: i32,
    y: i32,
}
```

You can use ‘`struct` literal syntax’ to create a new instance of the `struct`:

```
let origin = Point { x: 0, y: 0 };
```

However, this syntax only works if you have the proper access to the `struct` and its members via Rust’s privacy rules.

```
mod foo {
    pub struct Point {
        x: i32,
        y: i32,
    }

    pub fn foo(x: i32, y: i32) -> Point {
        Point { x: x, y: y } // this is fine, as we're in the same module
    }
}

fn main() {
    let origin = foo::Point { x: 0, y: 0 }; // this is not fine
}
```

We can’t use `struct` literal synatx in `main` because `x` and `y` are also not public. But within the same module, we have access, so it works. So how would we let `main` instantiate a `Point` if we can’t use the literal syntax? Well, our `foo` function does this, so we could expose it. More conventionally, we’d make it an associated function and call it `new`:

```
mod foo {
    pub struct Point {
        x: i32,
        y: i32,
    }
    
    impl Point {
        pub fn new(x: i32, y: i32) -> Point {
            Point { x: x, y: y } // this is fine, as we're in the same module
        }
    }
}

fn main() {
    let origin = foo::Point::new(0, 0);
}
```

Great. But what if we wanted `x` and `y` to be public for some reason, yet we still wanted to force people to use the `new` function to create `Point`s? Maybe the initial creation does some sort of side effect that’s important. If we changed our code to this:

```
mod foo {
    pub struct Point {
        pub x: i32,
        pub y: i32,
    }
    
    impl Point {
        pub fn new(x: i32, y: i32) -> Point {
            Point { x: x, y: y } // this is fine, as we're in the same module
        }
    }
}

fn main() {
    let origin = foo::Point::new(0, 0);

    // but so does this:
    let origin = foo::Point { x: 0, y: 0 };
}
```

By making all of the elements of `Point` public, we’ve re-enabled the literal syntax, which isn’t what we wanted. So what do we do?

Fixing this requires two insights. The first is “zero-sized types”. In Rust, certain types only have values that don’t require any storage. Take, for example, `()`, the “unit” type. It only has one possible value, also `()`. Since it only has one value, there’s no need to actually store anything in memory to represent `()`; if we have a valid value, we already know what it is. That means that once we compile down to actual assembly, `()` just goes away entirely. So we can do this:

```
mod foo {
    pub struct Point {
        pub x: i32,
        pub y: i32,
        _secret: (),
    }
    
    impl Point {
        pub fn new(x: i32, y: i32) -> Point {
            Point { x: x, y: y, _secret: () }
        }
    }
}

fn main() {
    let origin = foo::Point::new(0, 0);
}
```

Now, we have a new, non-public field, `_secret`. I’ve given it a name that starts with an underscore because we don’t intend to use it for anything, and so Rust won’t warn us about it. `_secret` has the type of `()`, and so it’s entirely a compile-time construct; it doesn’t materially affect `Point`’s representation. But it being private *does* affect how we’re allowed to construct our `Point`s. `main` can no longer use the `struct` literal syntax, since not all of the fields are public.

However, remember that privacy is a module-level thing in Rust. Therefore, we can still use the `struct` literal syntax inside of the `foo` module:

```
mod foo {
    pub struct Point {
        pub x: i32,
        pub y: i32,
        _secret: (),
    }
    
    impl Point {
        pub fn new(x: i32, y: i32) -> Point {
            Point { x: x, y: y, _secret: () }
        }
    }

    fn foo() -> Point {
        Point: { x: 0, y: 0, _secret: () } // this is still allowed!
    }
}

fn main() {
    let origin = foo::Point::new(0, 0);
}
```

To prevent `foo` from being able to use the literal syntax, we need one more concept: `pub use`. Check this out:

```
mod foo {
    mod point {
        pub struct Point {
            pub x: i32,
            pub y: i32,
            _secret: (),
        }
    
        impl Point {
            pub fn new(x: i32, y: i32) -> Point {
                Point { x: x, y: y, _secret: () }
            }
        }
    }

    pub use foo::point::Point;

    fn foo() -> Point {
        Point::new(0, 0) // must use `new` here, as we're no longer in the same module!
    }
}

fn main() {
    let origin = foo::Point::new(0, 0);
}
```

By giving `Point` its own module, everything that’s private to it is private. But typing `foo::point::Point` would be redundant and an ergonomic regression; `pub use` saves the day! We re-export the `Point` structure into `foo`, so we can still use `foo::Point`, but since one of its members is private, literal syntax isn’t allowed.

To me, understanding things like this is when I really start to feel like I’m getting to know a language: putting three or four disparate concepts together to achieve some goal. It’s when a language stops being a bunch of disjoint parts and starts becoming a cohesive whole.
