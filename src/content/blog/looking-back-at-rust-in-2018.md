---
title: "Looking back at Rust in 2018"
pubDate: 2018-01-09
blog: words
---


> A careful reader will note the date of this post; it’s fundamentally in response to this call for blog posts, with a rhetorical device of looking backwards as if my personal plans for Rust came true. If you’re reading this in 2019 or beyond, this may be a work of fiction.
> 

It’s been an exciting year for Rust. Well, it depends on what you mean by “exciting”, exactly. In a word, this year has been about *polish*. I find this kind of thing exciting! It’s a very different kind of exciting than the “new and shiny” exciting. It’s “take what we have and make it shiny.”

Let’s recap the major achievements of the year.

## Rust 2018

First of all, we shipped our first epoch! If you type `cargo new` today, you’ll see a new shiny entry in your `Cargo.toml`:

```
[package]
name = "new-program"
version = "0.1.0"
authors = ["steveklabnik <steve@steveklabnik.com>"]

epoch = "2018"

[dependencies]
```

What does this mean in practical terms? Well, a few things. First, let’s get the big one out of the way: Try to compile this code with no epoch, or with `epoch = "2015"`:

```
fn main() {    let catch = 5;}
```

You’ll see this:

```
> cargo build
   Compiling new-program v0.1.0 (file:///C:/Users/steve/tmp/new-program)
warning: `catch` will become a keyword in the 2018 epoch
 --> src\main.rs:2:9
  |
2 |     let catch = 5;
  |         ^^^^^
  |
  = note: #[warn(new_keyword)] on by default
  = note: to avoid this warning, consider using `_catch` instead
```

And if you change it to `epoch = "2018"`, you’ll see this:

```
> cargo build
   Compiling new-program v0.1.0 (file:///C:/Users/steve/tmp/new-program)
error: expected pattern, found keyword `catch`
 --> src\main.rs:2:9
  |
2 |     let catch = 5;
  |         ^^^^^

error: aborting due to previous error
```

Success! However, the specifics here aren’t as interesting as what this change means:

First, *this is one of only two changes that relies on the epoch*. When we announced our plans for epochs, many people were skeptical that we would do as we said, and only included small, parser-level changes here. But we did, and will continue to do so. `catch` and `dyn Trait` are the only two changes here.

Second, *we’ve demonstrated that this doesn’t split the ecosystem*. All of the crates that had no epoch are treated as 2015, and everything still works. Mixing 2015 and 2018 code works just fine.

Finally, *mrustc has not had trouble implementing this split*. `[mrustc` is an alternative implementation of Rust](https://github.com/thepowersgang/mrustc), and some of the worries about epochs would be that they would unnecessarily burden alternative implementations. This fear has not borne fruit yet though.

## We did ship *some* new stuff

Even though this year was about polish, that doesn’t mean that we had no new features. The key is, these features were all *designed* in 2017 or before. That is, features like non-lexical lifetimes, `impl Trait`, and Macros 2.0 didn’t land in stable until 2018, but they’ve been worked on for years. At the end of 2017, we had preliminary implementations already landed, it was just about polishing them up so we could ship.

Cargo, however, did gain some new abilities. Cargo was sort of neglected in 2017, or at least, wasn’t worked on as much as the rest of the project was. Cargo grew the ability to use alternative registries, and at least one company is offering “crates.io as a service” and “crates.io behind your firewall”. Cargo also became easier to use offline, and the “integrate Cargo into other build systems” work bore some more fruit.

## WebAssembly and Embedded platforms

At the end of 2017, Rust was poised to take advantage of WebAssembly. And take advantage, we did. WebAssembly has not taken over the world yet, but that was also never its intention. It is a common aspect of the Web Platform these days, and Rust’s support for it is so excellent that it’s the primary language with which you write new code for WebAssembly today. Tons of JavaScript programmers use Rust for their various systems-level tasks on the web, and we’re just starting to see completely new kinds of applications form. Adding Rust to your Node or front-end project is trivial, thanks to excellent integration from JavaScript’s build tools, or as we now call them, “compilers”.

> An aside: in the 2014-2017 era, even though JavaScript was JIT compiled, many programmers used various “build tools” or “transpilers” to do things like minify and bundle their JavaScript together. This was useful for things like “let me use new ES2017 features today but transpile to ES5.” In 2017, lots of JavaScript programmers, through tools like Rollup, started to appreciate that what they’re doing, on a fundamental level, is compiling. Once these tools realized this, they started taking advantage of decades of existing compiler research, and these tools started doing amazing things. Oddly enough, this makes JavaScript feel more like Java: you compile to a thing that ends up being JIT-ed. And that’s not even half of it; stuff like Ember’s GlimmerVM took this approach to new heights.
> 

Furthermore, it’s considered standard practice to test your crate against the WebAssembly target, just like you would Windows, Linux, and macOS, so the vast majority of the crates.io ecosystem Just Works.

But this work on wasm has a good side effect: wasm is basically a very minimal embedded platform. By doing the legwork to make wasm awesome, we also made embedded platforms of various kinds awesome. There’s also specific work that had to be done, for example, remember `xargo`? Cargo just does that now. We’ve elevated ARM to a Tier 1 platform these days, and provide easy instructions for getting a new architecture going.

This also implies stabilizing some of the lower-level things that are needed to do OSdev work. You can’t write a “real” OS in stable Rust yet, but you can write toy ones, and real OSes should be usable by next year.

## Stabilization

One way in which we did polish was to ship a ton of stuff that was previously in flight. I mentioned non-lexical lifetimes earlier, as well as some other features, but there’s also a sort of “long tail” of stabilizations that we addressed.

At the start of the year, the teams went through each of their feature gates, and voted: stabilize, put on hold, or remove. Things put on hold this year will get decided next year, but cannot be put on hold for another year. Of course, there were some small course-corrections over the year, but in general, it let us go “oh hey, slice patterns has been unstable since before Rust 1.0, let’s finally ship it.”

## Bugs & new contributors

Rust’s bugtracker was in a much better state in 2017 than in 2016, but got even better in 2018. 2017 saw the infrastructure team actually ensure that all bugs get triaged, that is, they all have tags within two days of being opened. In 2018, however, there was a focus to knock out a lot of the long-standing, papercut style bugs. At the start of 2018, there were ~3100 bugs on the tracker, but today, there are only ~1500. That’s four bugs per day! We couldn’t have gotten there without all of the new contributors and team members we’ve added this year; in 2017, we had about 75 people on our various teams, and now we have 100. Your average Rust release in 2017 had about 120 contributors, it’s 180 for 2018.

## Community and Job growth

It’s not just the teams that have grown, but also the community. For example, in 2016, crates.io had ~7500 crates. In 2017, ~13,000. In 2018, we’re up to 35,000. That’s a lot of packages! One major driver of this growth is jobs; once **REDACTED** announced that they’d been using Rust in a production setting, and that compared to the old system written in **REDACTED**, it saved them millions of dollars in server costs per year, a ton of companies started using Rust. It’s not *super* easy to get a Rust job, but they’re out there. We’ve also seen our meetups continue to grow, RustConf had two tracks this year, and there’s a new RustFest in South America, with rumors of a conference in China next year.

## IDEs

While I don’t really use IDEs, we put a lot of work into making them awesome, and 2018 was the first time that people who *do* use IDEs love using one. Specifically, they love using the new IDE that JetBrains has released for Rust. In 2017, JetBrains was sponsoring the plugin for IntelliJ, but in 2018, they’ve released a whole product. Other IDEs are coming along swimmingly; Visual Studio now has really excellent support, for example.

## Documentation

I work on docs, so I’m going to give this a section, even though maybe other things are more “exciting”.

2018 saw the release of $REDACTED, a sort of “next-generation `rustdoc`.” It focused on not just API docs, but all of your docs holistically; you can publish guides as well, structure things how you’d like, etc. In some ways, it’s “`rustdoc` + `mdbook`” in a nice integrated package. This has led to even more people writing even better docs, since it’s so nice to use.

There were two other major initiatives this year: focusing on intermediate documentation, and helping major ecosystem crates get excellent docs. In 2017, there was sort of a “what do I do after TRPL” situation, but now we’ve got some great resources to help you grow as a Rust programmer. Additionally, many of the more popular crates have docs that rival the standard library’s, and smaller crates have decent docs.

Oh, and TRPL saw its initial paper release early in the year. Yay!

## Epilogue

Whew, that’s a lot of stuff! What does 2019 hold for Rust? That post is for another time.
