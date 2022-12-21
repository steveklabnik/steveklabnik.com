---
layout: ../../layouts/MarkdownPostLayout.astro
title: "What's new with \"The Rust Programming Language\""
pubDate: 2016-08-15
blog: words
---


It’s been a while since I’ve mentioned my work on “The Rust Programming Language”, and I wanted to give you all an update. Before we get into the news, though, I’d like to take a moment to reflect on where the book has been, and then we’ll talk about it’s future.

I [previously wrote about my history with Rust and docs](http://words.steveklabnik.com/rusts-documentation-is-about-to-drastically-improve). As I said back then:

> But my first area of focus will be on the area of Rust’s documentation that’s the most weak, and simultaneously the most important: the tutorial.
> 

“The tutorial” eventually turned into “The Rust Programming Language.” But there’s a funny thing about writing a book for a language that isn’t done yet: you don’t really know *how* to write a good book on something that doesn’t exist, because, well, you haven’t played with it yourself. I could make decent guesses, given that Rust was evolving incrementally, but that’s still very different. I think “technical debt” is a great metaphor here: the evolution of the language meant that I had to keep up with the work of many, many people to try and update the documentation. Furthermore, since nobody had tried to learn Rust 1.0 yet, since it didn’t exist, I couldn’t write a book that would do an amazing job of teaching them, since I hadn’t used it either!

In some ways, this mirrors the compiler itself, which accrued a *massive* amount of technical debt until 1.0. And so, the story since 1.0 has largely about been paying off this debt; culminating in [MIR](https://blog.rust-lang.org/2016/04/19/MIR.html). By the same token, since 1.0, a lot of people have read the book, and a lot of people have tried to learn Rust. I now know so much more about how people go about doing so, and so am much, much better situated to write something that’ll be great for them.

And so, now that time has passed, re-writing the book is what I’ve been spending a lot of my time on. I’ve been mostly quiet about this work, since I’ve wanted to get a chunk finished before starting to talk about it, and so today is finally that day.

Let’s talk about what’s going on with the book today.

## A new coauthor.

The first bit of news is something that I’ve been wanting to tell you all for a few weeks now, and is the bit that I’m most excited about: I’m bringing [Carol (Nichols || Goulding)](https://twitter.com/carols10cents) on as a coauthor. TRPL is an incredibly personal work for me, one that I’ve poured my life into over the last few years. Carol and I have been friends for a long time, and there’s nobody else I’d rather share an authorship with. Not only is Carol a friend, but she’s been doing Rust longer than most. You might know her from [Rustlings](https://github.com/carols10cents/rustlings), or the [Rust Belt Rust conference](http://rust-belt-rust.com/), or as a cofounder of [Integer32](http://integer32.com/), the first Rust-focused consulting company. Carol knows her stuff, and I’m proud to have her name next time mine on the cover. The book will be far better through her influence.

## A new beginning

One of Carols’ first tasks was taking a bunch of the stuff I’d already written and checking it out herself, making improvements. She’s taken the first six chapters of the book and whipped them into shape. Some of the content you might recognize from the first edition of TRPL, but much of it is brand-new.

- [Read the first six chapters online](http://rust-lang.github.io/book/)
- [Source and issue tracker](https://github.com/rust-lang/book)

As an example of how much better this book is, can, and will be than the first edition, compare the [Ownership chapter](http://rust-lang.github.io/book/ch04-00-understanding-ownership.html) to [the current one](https://doc.rust-lang.org/stable/book/ownership.html) ( plus [borrowing](https://doc.rust-lang.org/stable/book/references-and-borrowing.html) ). Instead of an abstract set of rules, we took one of the biggest things facing a new Rustacean, strings, and used them as a way to make these concepts concrete.

If you have the time, please check it out, and file issues with any suggestions!

## More to come

If you’d like to see chapters as we work on them, just follow the repo: everything is open source. Initial PRs are already up for the start of the next three chapters, and hopefully we’ll get them merged and move forward soon. I’m really proud of how the book is shaping up, and hope you enjoy it too.
