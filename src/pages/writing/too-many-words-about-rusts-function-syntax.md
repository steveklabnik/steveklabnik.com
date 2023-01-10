---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Too many words about Rust's function syntax"
pubDate: 2023-01-03
---

There's a famous quote by Elanor Roosevelt:

> great minds discuss semantics, average minds discuss syntax and small minds discuss syntax of comments

(Apologies, Phil Wadler.)

I'd like to preface this post that I do *not* consider this to be an actual
proposal to change Rust, even a pre-RFC. I don't think that making changes like
this has enough benefits once a language is as established as Rust is. Consider
this post more of some musings about some things that there wasn't really time
to truly consider when Rust was younger, so that maybe someone who's making a
new language can learn from those things early enough in its life to do so.

Also, I am not the first person to think about this, but I have lost the
previous post to time. There also may be a newfangled language that has this or
similar syntax already I'm not aware of. If you know of similar previous
proposals or languages, please let me know so that I can link to them here.

Anyway, consider this post a "Steve decided to write up a thing instead of
just tweeting, it is not particularly well thought out but at least it's down
on paper" kind of thing. A serious proposal here, even if I thought the idea was
good in general, which to repeat again, I do not, would require examining a lot
more corner cases than I do in this post.

With all of that out of the way, let's begin.

---

## The fn syntax

Rust does a really good job of being orthogonal in many ways. While it isn't a
tiny language, that things fit together nicely is one of the things that can
make it feel a lot smaller, in my opinion. There's one thing, though, that
is really a bit inconsistent today, and that's the syntax and semantics of
functions.

Let me explain: you declare a function item (read: define a function) like this:

```rust
fn foo(x: i32) -> i32 {
    todo!()
}
```

Simple enough. However, there's a lot more going on for more complex
declarations. [Here][fn-item-grammar] is the beginning of the current grammar
of functions:

[fn-item-grammar]: https://doc.rust-lang.org/1.66.0/reference/items/functions.html

```text
Function :
   FunctionQualifiers fn IDENTIFIER GenericParams?
      ( FunctionParameters? )
      FunctionReturnType? WhereClause?
      ( BlockExpression | ; )
```

I read this like this: "A function consists of some function qualifiers, fn,
an identifier, and an optional list of generic parameters. We then have some
optional function parameters inside of parenthesis, an optional return type,
an optional where clause, and then a block expression or a semicolon."

This is in sharp contrast to a C-style function definition, which would
look like this:

```c
int foo(int x) {
    // todo
}
```

In general, most new languages have tended to settle closer to Rust's synatax
here than C's. There are a few reasons, and it's not like Rust invented this
style in the first place. One of the core nice things about Rust style syntax
is that `fn IDENTIFIER`, that is, if you want to find out where `foo()` is
defined, grep for `fn foo` and you can find it pretty quickly. You can't
do this as well with the `int` syntax. Some code styles have you write

```c
int
foo(int x) {
    // todo
}
```

Notably, the GNU project uses this style:

> It is also important for function definitions to start the name of the
> function in column one. This helps people to search for function definitions,
> and may also help certain tools recognize them.

You instead grep for `^foo`, and you can get a similar benefit.

So, what's bad about this syntax? Well, there are useful 'modifiers' to
functions, and Rust has added some and may add more in the future. For example,
if we want `foo` to be callable in a const context, we'd make it a `const fn`:

```rust
const fn foo(x: i32) -> i32 {
    todo!()
}
```

That's all well and good, we still even retain the "grep for `fn`" idea here,
but these are *also* useful on arbitrary blocks of code:

```rust
let x = const {
    1 + 2
};
```

This is of course a trivial example that's not very useful, but it shows off
the syntax here. My point is... this starts to feel a bit... nonuniform. In
the function delcaration, we put const at the front, but when it's any other
block expression, we put it right before the block. Rust's function bodies
are similar to blocks in other ways, such as the whole "evaluates to the final
expression" thing. But they're different when they're being used to describe
the body of a function. That's a bit less than ideal.

We could try the naive thing:

```rust
fn foo(x: i32) -> i32 const {
    todo!()
}
```

This is... weird, but it does sort of unify some syntaxes. We now can turn
any block of code, including a function body, `const` by adding the `const`
right before the opening brace. However... I kinda shudder at `i32 const`.
There's not enough separation between the return type and the modifier to make
quick sense of things, in my opinion. However, there's another small tweak we
could make here. But first, a small divergence into another corner of Rust's
syntax: variables.

## Variables

Rust also has a different syntax for variable declaration. Like C, it's similar
to its function declaration syntax:

```rust
// Rust
let x: i32 = 5;
```

```c
// C
int x = 5;
```

We have `let` instead of `fn`, we have the `name: type` instead of `type name`.
We can also declare a variable but not initialize it:

```rust
let x: i32;
```

Rust will make us initialize it before we use it, but we can declare the
variable on its own, and then give it an initial value later.

But what's this has to do with functions?

## A marginally better syntax

Functions also happen to have a "declare the signature but not the body" syntax
in Rust too, though it's almost exclusively used in an FFI context. Remember
the very end of our grammar?

> and then a block expression or a semicolon.

If we have a function `foo` that we're calling through FFI, we can define it
like this:

```rust
#[link(name = "something")]
extern {
    fn foo(x: i32) -> i32;
}
```

We don't provide a body, but we do provide a semicolon. This is strikingly
similar to the variable syntax. So why not have the regular function definition
also follow the variable syntax?

```rust
fn foo(x: i32) -> i32 = {
    todo!()
}
```

We've now added one little extra bit to the grammar: a `=` after the return
type, if any. This one little change allows us to unify the rest of the syntax
around blocks more easily:


```rust
// full signature
fn foo(x: i32) -> i32 = {
    todo!()
};

// empty return type
fn foo(x: i32) = {
    todo!()
};

// const
fn foo(x: i32) -> i32 = const {
    todo!()
};
```

I happen to *really* like this. It's a pretty small tweak but I think it
cleans stuff up nicely.

```text
let name = value;
fn name() = value;
```

Where both could be values or blocks, with `let` it's most often a value but
with `fn` it's most often a block. The symmetry pleases me.

(Sharp readers will also notice the introduction of a semicolon. Leaving it
off would be closer to the old syntax, requring it would be similar to the
variable syntax, but then that would diverge from the other item declaration
syntax... I don't feel strongly about it but just in case anyone noticed I
figured I'd mention that as well, yet another rabbit hole to chase down.)

## Going too far

This of course raises another divergence. But I'm not sure that fixing this one
is worth it; it starts to get *too* weird, I think. But maybe I'm wrong. This
one is about the types.

One of the things that makes `name: type` syntax nicer than `type name` syntax
is that it degrades nicely in the presence of type inference:

```rust
// Rust
let x: i32 = 5;
let x = 5;
```

```c
// C23 (https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3007.htm)
int x = 5;
auto x = 5;
```

Rust's function syntax isn't like this though, partially because there's no
type inference on function signatures, so there's not a lot of pressure for
it to degrade nicely. The choice not to offer inference is the right one for
Rust, but for a future language where that's not the case, we could unify
them with something like this:

```rust
// explicit type
fn foo(x): fn(i32) -> i32 = {
    todo!()
}

// inferred
fn foo(x) = {
    todo!()
}
```

This one... this may be too far afield. And, while Rust doesn't have named
parameters, and possibly never will, I have no idea how this style of syntax
would work with that. There's also some repetition of `fn` here that might be
worth trying to remove, but I'm trying to make the smallest possible deltas
from existing syntax here, and `fn(i32) -> i32` *is* the type of that function
in today's syntax.

What I mostly take away from this part of the exercise is that consistency is
a good goal, but it's not the *only* goal. Even if Rust didn't allow for
inference, making its function declaration syntax be like this may have simply
been a bridge too far for wide adoption. Rust already takes a lot of flak for
being weird, and spending some [Strangeness Budget][strangeness] to unify these
syntaxes probably wouldn't be the right choice. But maybe I'm too conservative!
Given that Rust already takes that flak, maybe a bigger jump would have been
okay here. Who knows.

[strangeness]: the-language-strangeness-budget

... actually, we have one way to find out, I guess. This is *very* similar
to the syntax that Herb Sutter came up with for [cppfront][cppfront]:

```rust
foo: (x: i32) -> i32 = {
    // todo
}
```

[cppfront]: https://github.com/hsutter/cppfront

There's no `fn` preceding. The type syntax works a bit differently. But it's
close. And Herb is targetting the people who I'd be most worried about hating
this syntax: C++ folks. Maybe this idea isn't so farfetched at all. He's
also got an example of how making it any expression after the `=` can be
nice for one-liner functions. If we applied this to our fake Rust syntax:

```rust
fn main() = println!("Hello, world!");
fn hello(name): fn(&str) = println!("Hello, {name}!");
```

That's kinda nice too.
