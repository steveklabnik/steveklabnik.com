---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Fire Mario not fire flowers"
pubDate: 2016-12-29
blog: words
---


[My post yesterday](http://words.steveklabnik.com/rust-is-more-than-safety) got a lot of great responses. Two of them are from people I greatly respect, [Dave Herman](https://thefeedbackloop.xyz/safety-is-rusts-fireflower/) and [Graydon Hoare](http://graydon2.dreamwidth.org/247406.html). You should go read those two posts; this one is in response to them. I’m going to respond to both at the same time by mixing them together.

Graydon says:

> Safety in the systems space is Rust’s raison d’être. Especially safe concurrency (or as Aaron put it, fearless concurrency). I do not know how else to put it.
> 

“Fearless concurrency” is a different way to put it! That is, to use Dave’s metaphor, “safety” is the fire flower. But “fearless concurrency” is Fire Mario. This is where I think Dave misses the mark slightly as well. I agree with his metaphor, but disagree with his conclusion.

I’m not saying that we get rid of fire flowers. I’m saying that we focus on “Rust makes you Fire Mario,” not “Rust is made of fire flowers”, when talking to people about Rust.

Dave also misses my mark slightly, but in a different way:

> I don’t think the Rust community should worry about shying away from talking about safety, but I hope we all remember that it’s in service of something much more exciting: making more badass systems programmers!
> 

We are so close here that it feels like nitpicking, but I think the difference is important. I think one of Rust’s greatest potentials, like Dave does, is bringing a ton of new people into systems programming. But my point is this: “memory safety without garbage collection” doesn’t speak to that *at all*. That is, memory safety without garbage collection is the mechanism of how that’s accomplished, but it’s not the accomplishment itself. It’s the Fire Flower, not Fire Mario.

I’d like to make sure we’re talking about being Fire Mario, rather than being Fire Flower enthusiasts.
