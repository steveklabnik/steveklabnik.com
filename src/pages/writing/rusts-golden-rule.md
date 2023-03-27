---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Rust's Golden Rule"
pubDate: 2023-03-27
---

I find myself thinking about a particular design principle of Rust today. I'm
not sure I've ever seen it named specifically before, but it gets referred to
from time to time, and I think it's an under-rated but very important aspect
of why Rust works so well. I was going to refer to it as "the signature is the
contract" today, but then I ended up changing it. Regardless of that, if someone
else has already written this out somewhere, and used a different name, please
let me know!

Magic: the Gathering is a really interesting project. I say "project" rather
than "card game" because while it is a card game, it also pioneered a whole
bunch of incedental other things that had big effects on related hobbies.

I learned MtG in the late 90s. The rules were a bit different then, but many
of them are the same. The very first rule I was taught was sort of the "Magic
Golden Rule," though in today's Comprehensive Rulebook, there are four of them.
This one is still the first, though:

> 101. The Magic Golden Rules
> 
> 101.1. Whenever a card’s text directly contradicts these rules, the card takes
> precedence. The card overrides only the rule that applies to that specific
> situation. The only exception is that a player can concede the game at any
> time (see rule 104.3a).

This rule is the most important rule because it kind of creates the spaces of
possibilities for cards: many cards exist to tweak, modify, or break some sort
of fundamental rule.

That being said, all these years later, this idea is so pervasive in games like
this that it's barely even considered an actual rule. It's just part of the
physics of the genre, it's how these games work. Yet it's critical to the
entire enterprise.

Rust also has a rule. It's kinda funny, because in some senses, this rule
is almost the opposite of Magic's, if you can even stretch the comparison this
far. Here it is:

> Whenever the body of a function contradicts the function's signature, the
> signature takes precedence; the signature is right and the body is wrong.

This rule is also so pervasive in Rust that we take it for granted, but it
is really, truly important. I think it is also important for Rust users to
internalize the implications of this rule, so that they know why certain things
work the way that they do.

Here is the most famous implication of this rule: Rust does not infer function
signatures. If it did, changing the body of the function would change its
signature. While this is convenient in the small, it has massive ramifications.

Consider this example program:

```rust
fn foo(x: i32) -> i32 {
    dbg!(x);
    
    x
}
```

This function prints out `x`, and then returns it. Nothing fancy going on here,
this is just random stuff to make an example. This compiles just fine. But let's
imagine that we have a version of Rust that infers our signatures. So we could
type this instead:

```rust
fn foo(x) {
```

This is what a Ruby-ish Rust might look like; we declare the name of our
argument but not its type, and we don't declare a return type. Now, let's
do a small refactoring, we're gonna comment out the final value there:


```rust
fn foo(x) {
    dbg!(x);
    
    //x
}
```

the final expression has changed; it's no longer `x`, but instead is `()`,
which is what `dbg!(x);` evaluates to. Because of type inference, the inferrred
type of `foo` is now `fn(i32) -> ()`. Our function typechecks! It's all good,
right?

Well, no:

```text
error[E0369]: cannot add `{integer}` to `()`
 --> src/lib.rs:5:11
  |
5 |         y + 1
  |         - ^ - {integer}
  |         |
  |         ()
```

Wait, what? We don't have a `y + 1` anywhere in our code?! Where's that
error coming from... `src/lib.rs:5`. What's at the top of `lib.rs`?

```rust
mod bar {
    fn baz() -> i32 {
        let y = crate::foo(5);
        
        y + 1
    }
}
```

Oh. Some other code was using `foo`. When its signature changed, we broke
this invocation. It's nice that alt-Rust caught this for us, but this error is
(would be, anyway!) really bad: no longer is it telling us that our code
is wrong, but instead points to some other code somewhere else we weren't even
messing with. Sure, we can go "hey why is `y` `()`?" and then figure it out,
but compare that to today's error:

```text
error[E0308]: mismatched types
  --> src/lib.rs:9:19
   |
9  | fn foo(x: i32) -> i32 {
   |    ---            ^^^ expected `i32`, found `()`
   |    |
   |    implicitly returns `()` as its body has no tail or `return` expression
10 |     dbg!(x);
   |            - help: remove this semicolon to return this value

```

This error is far better: it points out that the body of our function
contradicts the signature. It points out what in our body is generating the
value that contradicts the signature. And it doesn't complain about callers.

So sure, this gets us nicer error messages, but is that really a big deal?
I think it is, but it's not the only implication here. I'd like to talk about
two more: one that's clearly an advantage, and one that has led to some pain
that people would like to resolve. Balance :)

First, the one that's an advantage. The advantage is modularity. That makes
some forms of analysis much more reasonable, or sometimes even possible, as
opposed to super difficult. Because everything you need for memory safety is
described in the signature of the function, Rust doesn't need to examine your
entire program to determine if there's some shenanigans going on elsewhere.
This is far, far less work than just checking the signatures of the functions
you call. Each function can be checked in isolation, and then assembled
together. This is a very nice property.

Second, where this leads to some pain. Users have nicknamed this one "borrow
splitting," or "partial borrowing." It looks like this:

```rust
struct Point {
    x: i32,
    y: i32, 
}

impl Point {
    pub fn x_mut(&mut self) -> &mut i32 {
        &mut self.x
    }

    pub fn y_mut(&mut self) -> &mut i32 {
        &mut self.y
    }
}
```

I find accessors, and especially mutators, to be where this sort of thing pops
up most often. This is the classic example. The above code is fine, but if we
try to do this:

```rust
// this doesn't work
impl Point {
    pub fn calculate(&mut self) -> i32 {
        let x = self.x_mut();
        let y = self.y_mut();
        
        // yes I picked multiplication because this looks kinda funny
        *x * *y
    }
}

// we would call it like this:
let answer = p.calculate();
```

We get this:

```text
error[E0499]: cannot borrow `*self` as mutable more than once at a time
  --> src/lib.rs:19:17
   |
18 |         let x = self.x_mut();
   |                 ------------ first mutable borrow occurs here
19 |         let y = self.y_mut();
   |                 ^^^^^^^^^^^^ second mutable borrow occurs here
20 |         
21 |         *x * *y
   |         -- first borrow later used here
```

However, if we didn't have these accessors, `x` and `y` were instead just
public, this very similar free function:

```rust
fn calculate(x: &mut i32, y: &mut i32) -> i32 {
    *x * *y
}

// called like this:
let answer = calculate(&mut point.x, &mut point.y);
```

works just fine. Why? Because of the signatures. This signature:

```rust
pub fn calculate(&mut self) -> i32 {
```

and these signatures:

```rust
pub fn x_mut(&mut self) -> &mut i32 {
pub fn y_mut(&mut self) -> &mut i32 {
```

says "hey, I am going to borrow all of `self` mutably," which implies an
exclusive reference to `self`. That the body of `calculate` borrows two
different parts of `self` independently is 100% irrelevant, that's what the
signature says! And so rustc looks at this and says "hey wait a minute, 
calling `x_mut` borrows `self` mutably, and calling `y_mut` borrows `self`
mutably. That's aliasing! Bad programmer!

Whereas in the second example, this signature:

```rust
fn calculate(x: &mut i32, y: &mut i32) -> i32 {
```

says "hey, I have two mutable references, to two different integers." And
at the call site, Rust sees that we're creating two different borrows to two
different integers, even though they're both part of our `point`, and so it
okays things.

This is kind of a pain in the butt! But what it saves us from is that scary
action at a distance in our typecheck example. Imagine that Rust somehow
inferred that the first version was okay, due to the body only being disjoint.
What happens in the future, when we refactor our function, and the borrows need
to change? That would have the same problem as before; we'd get weird errors
elsewhere in our code. There have been some proposals over the years to possibly
fix this pain point, but it's a tough one. Putting "here's the fields I'm
borrowing in the body" into the signature, in order to conform with the Golden
Rule, looks very odd. Maybe something will happen here, maybe not. I have
complicated feelings.

So beyond error messages and making accessors/mutators awkward, how does this
affect you day to day? Well, one way is that I find I end up paying more
attention to signatures and less attention to bodies, when I'm trying to sort
something out. In many cases, what you're doing in the body is irrelevant, I
care only about what your signature affords me. This isn't *quite* as true
as in some pure functional languages, but it has that vague feel to it. Another
way, and a slightly bigger one, has to do with the relationships between types
and TDD, but I think I'm going to save that for its own post.
