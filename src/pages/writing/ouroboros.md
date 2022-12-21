---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Ouroboros"
pubDate: 2015-05-18
blog: words
---


One of the things that I love about open source is its ability to send improvements across projects. Sometimes, an improvement in one project ends up improving its upstream. This kind of network effect really gets to the core of it for me: steady, constant improvement.

I saw an example of this today that makes me smile. Before [Rust’s 1.0 release](http://blog.rust-lang.org/2015/05/15/Rust-1.0.html), I wrote a [chapter about the Dining Philosopher’s problem](http://doc.rust-lang.org/stable/book/dining-philosophers.html). Incidentally, I’m really happy to use classic CS concepts in the Rust docs, hopefully exposing them to people who didn’t get the opportunity to get a degree in computer science. Anyway, towards that end, I decided to cite [Tony Hoare’s classic CSP paper](http://www.usingcsp.com/cspbook.pdf). Other funny aspect of that: I started my implementation using channels, but ended up using mutexes instead.

Anyway, today, a new contributor [spotted a typo](https://github.com/rust-lang/rust/pull/25575). The PR message made me smile:

> Looks like this was an issue in the source material. I’ve let the editor know and he has told me he is correcting it there as well.
> 

In my own small way, a thing I did led to someone else improving one of the most classic and well-known CS papers ever written. And it’s just Monday.
