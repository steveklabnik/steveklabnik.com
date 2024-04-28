---
title: "Four years with Rust"
pubDate: 2016-12-21
blog: words
---


Today is four years since I first learned about the existence of Rust. I know this because Rust 0.5 was the first release I used. Rust has changed a lot in that time. For a brief overview of its history, [watch this talk of mine](https://www.youtube.com/watch?v=79PSagCD_AY). But for today, I thought it would be fun to check out [the release announcement](https://mail.mozilla.org/pipermail/rust-dev/2012-December/002787.html) and see what’s the same, and what’s changed.

## rust-dev

First up, the announcement itself. The [rust-dev mailing list](https://mail.mozilla.org/listinfo/rust-dev) used to be your one-stop shop for talking about Rust in a persistent form. But in [January of 2015](https://mail.mozilla.org/pipermail/rust-dev/2015-January/011558.html), we decided to close it down. Why? Let’s see what Brian said at the time:

> You likely have already noticed, but traffic to rust-dev has decreased dramatically in recent months. This was a result of natural changes in project coordination at first, and then an intentional effort to phase out the list.In the beginning of the project there were only two places to talk about rust: #rust and rust-dev, and they served us well for all purposes for several years. As Rust grew though the coordination of the project moved to different venues, conversations were happening in a number of other places, and the purpose of rust-dev became less clear. At the same time there were also a number of heated and essentially unmoderatable discussions that caused many to lose faith in the effectiveness of the mailing list.
> 

I love mailing lists, but I know I’m fairly unique in that. But they do have one big problem, which is that the tools for moderating them are extremely thin. You can pretty much ban someone, and that’s about it. No removing only certain posts, no cooldown periods, no shadow banning. While Rust has a generally positive reputation for community and moderation, that doesn’t mean things were always perfect. We learned some lessons the hard way.

More than that, mailman represents something of the “old guard” of open source. People see it as a sign of something backwards. Very few people want even more email. The culture is changing. We recognized this, and decided to move to [Discourse](http://www.discourse.org/) instead. rust-dev was survived by two children, [users](http://users.rust-lang.org/) and [internals](https://internals.rust-lang.org/). This created a clear split between “discussion about Rust” and “discussions about building Rust.” It’s still free/open source software, it has good moderation tools, and you can even have it send you email!

We also don’t make release announcements on these forums; we do it on [our blog](https://blog.rust-lang.org/).

Let’s dig into those notes!

## 900 changes, numerous bugfixes

900 changes is a lot! At the time, Rust was on a roughly six-month release schedule, so that’s about five patches merged per day. Rust 1.14 [will have](https://github.com/rust-lang/blog.rust-lang.org/pull/141) 1230 patches over its six-week release cycle: that’s just over 29 per day. That’s a much, much higher velocity. And that only counts the main repository; we’ve since added many more, like [Cargo](https://github.com/rust-lang/cargo/) and [crates.io](https://github.com/rust-lang/crates.io). This is actually something I’ve been worried about for a while now; we only credit people for commits to `rust-lang/rust` in release announcements, basically due to this history, but there’s a lot more work that goes on here these days. I want [Rails Contributors](http://contributors.rubyonrails.org/), but for the Rust project. Anyone want to work on it with me sometime?

## Syntax changes

- Removed `<-` move operator

Rust went through several iterations of “when do you move, when do you copy” over its lifetime. Today, that distinction is made between types that implement `Copy` and ones that don’t. But older Rusts had various schemes. Given that this one was removed in the first version of Rust I used, I don’t *exactly* remember this, but I think it was

```
x <- y; // move
x = y; // copy
```

Rust also had this at one point in time, I believe:

```
x = move y; // move
x = y; // copy
```

We decided to unify the two syntactically for two reasons: one, the annotations felt like busywork, the compiler would tell you what to put if you got it wrong. Secondly, at least in today’s Rust, move and copy are identical operations, with the exception of what you can do with the older variable after the move. Sharing the syntax reinforces that.

Niko’s blog has a lot of great history in it, and [this topic is no exception](http://smallcultfollowing.com/babysteps/blog/2012/10/01/moves-based-on-type/).

- Completed transition from `#fmt` extension syntax to `fmt!`

Long ago, Rust had a “no keywords can have more than five letters” rule, and so many things were abbreviated. This particular extension lives on today, but with the longer name `[format!](https://doc.rust-lang.org/stable/std/macro.format.html)`.

- Removed old fixed length vector syntax - `[T]/N`

Rust’s vector and array types, as we know them today, went through a *lot* of internal iteration, across many axes. The moral equivalent of `[T]/N` today is `[T; N]`, but I’m sure there are/were lots of subtle differences between the two. I can’t quite remember.

- New token quasi-quoters, `quote_tokens!`, `quote_expr!`, etc.

These live on in some sense; they’re still not stable, so much so that they’re note even shown in the official docs. [Manish hosts a copy though](https://manishearth.github.io/rust-internals-docs/syntax/ext/quote/index.html). These are tools for “syntax extensions”, Rust’s most powerful form of metaprogramming. A final design for them was [just accepted eight days ago](https://github.com/rust-lang/rfcs/pull/1566), so it’ll be a while still before you see this on stable Rust.

- Macros may now expand to items and statements

I don’t know why macros couldn’t do this before, but they still can today, and it’s very useful.

- `a.b()` is always parsed as a method call, never as a field

This is a fun edge case. Here’s the problem:

```
struct Env<F: Fn(i32)> {    f: F,}let e = Env { f: |i| println!("Hello, {}", i) };e.f(); // what does this do?
```

According to this entry, this would be a method call. In today’s Rust, this would be an error, you need to write `(e.f)();` At least the error tells you exactly what to do!

```
error: no method named `f` found for type `Env<[closure@<anon>:6:22: 6:50]>` in the current scope
 --> <anon>:8:7
  |
8 |     e.f(); // what does this do?
  |       ^
  |
note: use `(e.f)(...)` if you meant to call the function stored in the `f` field
 --> <anon>:8:7
  |
8 |     e.f(); // what does this do?
  |       ^

```

- `Eq` and `IterBytes` implementations automatically generated with `#[deriving_eq]` and `#[deriving_iter_bytes]` respectively

We now have a more generic way to derive traits: `#[derive(Eq)]`, for example. `Eq` is still here today, but `IterBytes` is not. I can’t recall exactly what it did.

Today, the list of traits you can derive is still only blessed ones by the compiler, and it’s a huge cause of people using nightly today, for better ergonomics with libraries like [Serde](http://serde.rs/) and [Diesel](http://diesel.rs/). But as of Rust 1.15, this restriction will be lifted, and one of the largest blockers of people using stable Rust will be eliminated! ???

- Removed the special crate language for `.rc` files

The moral equivalent of `.rc` files today are `.crate` files, which Cargo will upload to crates.io. But unlike in the 0.5 days, you almost never need to worry or think about them, since Cargo makes it Just Work (tm).

- Function arguments may consist of any irrefutable pattern

This is true today, and is a little known fact! It works like this:

```
struct Point {    x: i32,    y: i32,}fn takes_point(Point {x, y}: Point) {    println!("({}, {})", x, y);}fn main() {    let origin = Point { x: 0, y: 0 };    takes_point(origin);}
```

That is, arguments to functions are `PATTERN: TYPE`, not `NAME: TYPE`. Inside of `takes_point`, `x` and `y` are in scope, rather than a whole point.

## Semantic changes

- `&` and `~` pointers may point to objects

Rust did have objects, long ago, but I thought they were removed at this point. This one is unclear to me.

Worth mentioning that `~` is `Box<T>` now, though. That’s a long story…

- Tuple structs - `struct Foo(Bar, Baz)`. Replace newtype enums.

These are [still in Rust today](https://doc.rust-lang.org/stable/book/structs.html#tuple-structs).

- Enum variants may be structs

This is true today:

```
enum Foo {
    Variant { x: i32, y: i32 },
}
```

- Destructors can be added to all nominal types via Drop trait

This is [still true](https://doc.rust-lang.org/stable/std/ops/trait.Drop.html)!

I think the “nominal” here is alluding to something older in Rust’s type system; we don’t make these kinds of distinctions today, as IIRC, all types are nominal. Not 100% sure.

- Structs and nullary enum variants may be constants

This is true today.

- Values that cannot be implicitly copied are automatically moved without writing `move` explicitly

I alluded to this above with `<-`.

- `&T` may now be coerced to `*T`

`*T` is `*const T` or `*mut T` today, but this is still true:

```
let x = &5;
let y: *const i32 = x;
```

- Coercions happen in `let` statements as well as function calls

We’ve gone through many different iterations of “what coerces and what doesn’t” over the years; I actually expected the example with `*const i32` above to require an `as`.

- `use` statements now take crate-relative paths

This is true today. I really like it, but a lot of people find it confusing. Basically, “use” always starts from the root of the crate. So

```
mod bar {    struct Foo;    mod baz {        use bar::Foo; // from the root        use super::Foo; // if you want to start from the parent        use self::super::Foo; // self makes it be relative. Not even sure if self + super works, but you get the idea.    }}
```

- The module and type namespaces have been merged so that static method names can be resolved under the trait in which they are declared

Not sure on this one, it’s too in the weeds.

## Improved support for language features

- Trait inheritance works in many scenarios

This has always been a bit of a misnomer, inheritance means:

```
trait Foo: Bar {
}
```

If you implement `Foo`, you must also implement `Bar`. That’s it. This line makes me smile: “it works more often.”

- Support for explicit self arguments in methods - `self`, `&self` `@self`, and `~self` all generally work as expected

Today’s Rust doesn’t just support this; it’s required! However:

- `self` is still `self`
- `&self` is still `&self`
- `@self` is `Rc<self>`, sorta kinda.
- `~self` is `Box<self>`

`@self` was supposed to be a garbage-collected type, but was never really more than refcounting.

In addition, the last two don’t actually work like that: they would be `self: Rc<Self>` and `self: Box<self>`. The `Box` version will compile today, but the `Rc` version does not, because `Box` is magical. Eventually this will be rectified.

- Static methods work in more situations

Another “yay more features work” line. :)

- Experimental: Traits may declare default methods for impls to use

This works today, and is very useful. Consider `[Iterator](https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html)`: all of those methods have default implementations, so you only need to define `next()`, and you get the rest automatically.

## Libraries

- New condition handling system in `core::condition`

Conditions were a Lisp way of handling errors that Rust supported for a while. They were really cool, but nobody really knew how to effectively use them, so they never got used, so they’re gone now.

- Timsort added to `std::sort`

`std::sort` doesn’t exist anymore, though we do have [a sort function on slices](https://doc.rust-lang.org/stable/std/primitive.slice.html#method.sort). We don’t declare it to have a particular algorithm, though we do say “This sort is stable and O(n log n) worst-case but allocates approximately 2 * n where n is the length of self.”

[Recently it was improved a ton](https://github.com/rust-lang/rust/pull/38192), by a first-time contributor, no less! Extremely well-done. In the PR, he explains the algorithm:

> However, if we take the main ideas from TimSort (intelligent merging strategy of sorted runs) and drop galloping, then we’ll have great performance on random inputs and it won’t be bad on partially sorted inputs either.
> 

`TimSort` is still around, kicking.

- New priority queue, `std::priority_queue`

Today this is `[std::collections::binary_heap](https://doc.rust-lang.org/std/collections/binary_heap/)`.

- Pipes for serializable types, `std::flatpipes’

No idea where this went.

- Serialization overhauled to be trait-based

This is true today. See the above comments about Serde, though. `[rustc-serialize](https://crates.io/crates/rustc-serialize)` got to cheat though, and the compiler understands `RustcEncodable` and `RustcDecodable`. Can’t wait for Rust 1.15.

- Expanded `getopts` definitions

We’ve [moved `getopts` out of tree](https://github.com/rust-lang-nursery/getopts), but it’s still there.

- Moved futures to `std`

Hoo boy! I forgot that we used to have futures in the standard library. Futures are one of the hottest topics in Rust today. [Tokio](https://github.com/tokio-rs) is one of the most anticipated releases of all time in Rust world. For a taste, [watch this talk](https://www.youtube.com/watch?v=bcrzfivXpc4). A little birdie told me that Tokio should have a `0.1` release soon…

- More functions are pure now

Rust no longer has a notion of purity, though `[const fn](https://github.com/rust-lang/rfcs/blob/master/text/0911-const-fn.md)` (still unstable) sorta feels like it in some senses. For some history on purity in Rust, see [Niko’s blog](http://smallcultfollowing.com/babysteps/blog/2012/10/12/extending-the-definition-of-purity-in-rust/), or [this explanation by Graydon on why it was removed](https://mail.mozilla.org/pipermail/rust-dev/2013-April/003926.html).

- `core::comm` renamed to `oldcomm`. Still deprecated

Very, very long gone.

- `rustdoc` and `cargo` are libraries now

Rustdoc still exists, though not *really* as a library. Cargo however, is not the cargo you’re thinking of. [It’s a totally different one](https://github.com/rust-lang/rust-wiki-backup/blob/73816d6f888c24fb8115d78078a1601805cbecb5/Doc-using-cargo-to-manage-packages.md). Rust went through many iterations of package managers before coming up with today’s Cargo; there was also `[rustpkg](https://github.com/rust-lang/rust/blob/3e39e3e80dcf726a96ec0fe778f96e2a9dde620b/doc/guide-rustpkg.md)`, for example, which was *after* the Cargo referenced here, but before the Cargo we’re using today.

## Misc

- Added a preliminary REPL, `rusti`

We removed the repl from the tree, as it never *really* worked, and was a maintenance nightmare. [This one](https://github.com/murarth/rusti) is the only one I know of today. Some people ask about one, but nobody has done the work to get a good one together yet. It’s tough!

- License changed from MIT to dual MIT/APL2

This is still true today, with no plans on changing.

## Contributors to Rust 0.5:

We had 41 people contribute to 0.5. 1.14 will have 144 contributors, and that’s around average for a release these days. Out of those 41 people, at a glance, I recognize the names of about 17 individuals, and roughly six of them are still involved with Rust and Servo today. What about the other eleven? Some were interns that got jobs at other places and can’t work on Rust anymore, some are contributors that left for various reasons, and then of course, there’s Graydon.

I personally opened [my first pull request](https://github.com/rust-lang/rust/pull/4305) six days after discovering it. You’ll note this PR wasn’t merged due to a procedural issue: I sent it into the wrong branch! Today, GitHub lets you change this, but I had to [open a new PR instead](https://github.com/rust-lang/rust/pull/4308).

As I said in that PR:

> I’ve just started using Rust, and I really like it. One of the things that makes Rust hard to use is its lack of documentation, which is obviously fine, given that Rust isn’t production-ready yet.I’d like to help change that.To get started, I’ve just modified this one little description in the rustdoc. If this works out, and you all like my changes, I’ll start working on more docs like this for the rest of core, and maybe the stdlib after that.
> 

You might say it did work out. I’m now [on the core team](https://blog.rust-lang.org/2014/12/12/Core-Team.html), I’ve sent in 866 PRs since then, and that first patch landed in [Rust 0.6](https://mail.mozilla.org/pipermail/rust-dev/2013-April/003427.html). Rust 0.10 is the only release since then that I’ve not gotten at least one patch into, and today, I write the release announcements.

I hope you’ve enjoyed this little trip down memory lane! I’m still really loving Rust and its community. Here’s to many more years ?♥
