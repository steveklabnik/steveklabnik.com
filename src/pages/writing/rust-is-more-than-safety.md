---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Rust is more than safety"
pubDate: 2016-12-28
blog: words
---


Rust is most well-known for its features around writing low-level code in a safer way than its predecessors. But it’s also a lot more than that. The Rust community is slowly evolving the way that we talk about Rust to people who haven’t yet given Rust a try, but it can take time. But how did we get here?

In Rust’s initial release announcement, Graydon used a phrase that is amazing:

> [Rust is] Technology from the past come to save the future from itself
> 

He goes on to elaborate a bit:

> Many older languages [are] better than new ones. We keep forgetting already-learned lessons.
> 

This is one of the many things that the “Rust” name evokes. Rust was not intended to be a cutting-edge PLT (programming language theory) research language. It was challenging an assumption that I think many of us hold dear: that “progress” means that things always get better. Reality is a bit more complex than that. Yes, we’ve improved on some things, but there are some older things that were actually “better” in some sense, but never quite made it for other reasons. I’ve always phrased this sentiment like this:

[Untitled](Rust%20is%20more%20than%20safety%20dbafb611620445cb9bab3d2ec5828e08/Untitled%20Database%201c7b46da754549118fcf5e3d14a9999a.csv)

Now, there are a multitude of newer languages, and people do use them. And these languages have had more releases since then. But none of these languages has fundamentally changed. They’re all pretty much the same, but better. And specifically, you’ll notice that many of these languages are scripting or higher-level languages: if we restrict ourselves to “what most operating systems are programmed in”, we haven’t had a new generation of programming languages in thirty or forty years!

PLT research and industry live in two different worlds. Industry is effectively using ancient PLT tech. There’s lots of *good* reasons for this too, mind you. But if you’re looking to make a new hit programming language, you don’t actually have to be innovative in the PLT sense. You can take PLT tech from the 2005-2010 era and you’ll still be ten years ahead!

So in some senses, this is what Rust is trying to do: not be a cutting-edge programming language in a PLT sense, but advance the industry by mining “older” research.

However, plans don’t always work out the way you want to. [As Rust evolved](https://www.youtube.com/watch?v=79PSagCD_AY), many of its original bits were thrown out, and replaced with new ones. Rust *has* advanced a small bit of the universe in PLT with the ownership/borrowing system. Like most research, it’s built on top of older work. But that’s exciting!

Another thing about the borrow checker is that it’s “unique” about Rust as well. So if someone asks you, “hey, what’s cool about Rust?”, it’s extremely tempting to answer with the thing that makes it most clearly different than other programming languages. And for some people, this pitch is compelling! But not for everyone…

## Shifting priorities

Marketing is hard. But there’s one thing that I’ve learned about it that I think applies to Rust:

> Your marketing should be focused on what problems your product solves for the consumer.
> 

Rust’s marketing, historically, hasn’t been as good at this as it could have been. That is, we’ve been too focused on the details, and not enough on the big picture. We’ve been worried about what’s interesting in a PLT aspect, and not what problems Rust solves for users. I can think of two big examples where this has happened:

- Rust is safer than C or C++. (“I never have problems with safety in the C++ code I write” is a common reply.)
- Rust is as low-level of a programming language as C! (“I never write C. Rust is not for me.”)

Both of these pitches for Rust focus on the *how*, and not on the problem itself. And that means that sometimes people draw the opposite inference as to what you were intending with the pitch in the first place.

I have some ideas on a better pitch for Rust, and I even had a draft of it here, but I’ve decided to delete it for now. Instead, I’d like to ask all of you who love Rust to give this some thought, and write your own blog posts about what problems Rust solves for you. I’ll edit this post and link to yours if you ask me to. I’ve seen several people do a good job at articulating this kind of thing before. And I’ll work on my own post as well, as a follow-up.

Let’s figure out the best way to share our love of Rust with the rest of the programming world.

---

Here’s some of the responses generated from this:

I’ve written [Fire Mario, not Fire Flowers](http://words.steveklabnik.com/fire-mario-not-fire-flowers), as a response to two responses to this post.

The [/r/rust](https://www.reddit.com/r/rust/comments/5krhr0/rust_is_more_than_safety/), [proggit](https://www.reddit.com/r/programming/comments/5krw7r/rust_is_more_than_safety/), and [orange website](https://news.ycombinator.com/item?id=13272474) threads are full of good replies.

- [Rust in 2017](https://medium.com/@Hisako1337/rust-in-2017-8f2b57a67d9b)
- [Why Rust?](https://insanitybit.github.io/2016/12/28/why-rust-introduction) and [Why Rust? Sum Types](https://insanitybit.github.io/2016/12/28/why-rust-sum-types)
