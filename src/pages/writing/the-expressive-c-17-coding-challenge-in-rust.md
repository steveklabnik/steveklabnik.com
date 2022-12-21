---
layout: ../../layouts/MarkdownPostLayout.astro
title: "\"The Expressive C++17 Coding Challenge\" in Rust"
pubDate: 2017-10-25
blog: words
---


A few weeks ago, two C++ bloggers initiated a challenge ([here](https://www.fluentcpp.com/2017/10/23/results-expressive-cpp17-coding-challenge/) and [here](http://www.bfilipek.com/2017/09/the-expressive-cpp17-challenge.html)): use the shiny new features of C++17 to write a small program that manipulates CSV files. The link is to the results; you can see the examples people came up with.

---

I’ve written [a follow-up post](http://words.steveklabnik.com/the-expressive-c-17-coding-challenge-in-rust-revisited) too!

---

I decided to implement it in Rust for fun. You should give it a try, in whatever language you use, it’s a nice sample problem. I held myself to the same constraints as the original contest; no external packages is a bit painful in Rust, but it’s not too bad. Mostly it would let me eliminate boilerplate while also improving correctness, and making the code a bit shorter.

Anyway, here it is:

https://gist.github.com/steveklabnik/ad0a33acc82e21ca3f763e4278ad31a5

I implemented `From` for everything so I could use `?`, but then `main` just has a ton of `unwrap`s. I normally would remove those too, but the challenge does not include good error handling, so I decided to just stick to the text of the challenge.

I’m not going to say that this is the *best* Rust code in the world, nor compare it directly to the C++ examples. But it was a fun hour or two to knock it out, and figured I’d at least share my results.
