---
title: "Six years with Rust"
pubDate: 2018-12-21
blog: words
---


Today is six years since I first heard of Rust. [I wrote a post last year](https://words.steveklabnik.com/five-years-with-rust) about it.

This past year was… intense. Rust 1.31 was basically Rust 2.0, at least in the marketing sense. I burned myself out getting the first edition of the book together for Rust 1.0, and I burned myself out getting the edition shipped.

Let’s talk about the bad and the good. Bad first so we end on the high notes.

## The Bad

This year, the docs team sort of… died. Not entirely, but it’s… different now. We used to have a single docs team that handled most everything docs related. The core of that for the past few years has been me and two others. But early this year, we split the sub-teams into fewer individual teams. The old docs team became the docs team, the `rustdoc` team, the Rust By Example team, and the Reference team. But we didn’t really attract many more people. We did to some degree! The reference team did a *ton* of amazing reference work. RBE has still struggled. I stayed on the docs team, and the other two went to the `rustdoc` team. That’s fine, and they’re doing great work, but it’s a little lonely over here now. I can’t decide how much of this issue is “it’s really hard to get people to volunteer to write docs” and how much of this issue is “I mis-managed the team(s) somehow and so it’s my fault.”

Shipping the edition was a monumental effort that caused a lot of debt. We did a good job at avoiding *technical* debt, but we have a lot of social and organizational debt. [See here for more](https://boats.gitlab.io/blog/post/rust-2019/). This has to be paid off now…

There’s a few other things, but let’s stop there.

## The Good

We shipped the edition! In fact, we invented the entire edition system and then shipped our first one. Whew! This is a *massive*, *massive* accomplishment. Figuring out how we are going to manage Rust’s evolution decades into the future is, frankly a pretty amazing thing to do in twelve months. Non-lexical lifetimes finally landed. Procedural macros finally landed. Rocket is almost on stable. `async`/`await` is almost here, and `Futures` are finally where they should be after two years of work. We did *so much* good work this year, technically speaking. I’m very proud.

We shipped the new website! This was met with some controversy, but every single website redesign in the history of redesigns has been met with controversy. Doing so in less than a year is also an incredible accomplishment. It almost always takes way longer. We now have the foundations for Rust web properties going forward. This will also pay off a ton later.

We made wasm a thing! I really really wanted wasm to be a thing. A lot of people put in a ton of work, and Rust’s wasm support is bar-none best-in-class. I think this is still a *massive* growth area for Rust, and we’re almost a full year ahead of almost everyone else on this.

Speaking of growth, Rust’s commercial uptake skyrocketed this year. I met someone for the first time who told me “I learned Rust because it’s what we use at work.” A ton of companies, big and small, have started deploying Rust in critical places, and report good things. Out of the FAANGs, we’ve got Facebook, Amazon, and Google. Three out of five ain’t bad. This tweet is wild:

> Introducing #HyperledgerSawtooth version 1.1, an enterprise-grade #blockchain platform with support for #WebAssembly smart contracts and great performance with @rustlang. Empower your business. https://t.co/wl9OYVnUsR #HyperledgerForum pic.twitter.com/5vurpbVMP1
— Intel Security (@IntelSecurity) December 12, 2018
> 

So is this one:

> Discover Rust, a C-like language that supports imperative, functional, and object-oriented programming. https://t.co/fCgY4x6zqc
— IBM Developer (@IBMDeveloper) June 10, 2018
> 

There’s still lots more to do, but things are headed in the right direction.

Speaking of heading in the right direction, tomorrow will be the compliment to this post; my entry for `#rust2019`. Catch you then!
