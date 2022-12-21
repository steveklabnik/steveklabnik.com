---
layout: ../../layouts/MarkdownPostLayout.astro
title: "\"C is how the computer works\" is a dangerous mindset for C programmers"
pubDate: 2020-03-31
blog: words
---


A long time ago, I wrote [“Should you learn C to “learn how the computer works”?"](https://words.steveklabnik.com/should-you-learn-c-to-learn-how-the-computer-works). This was part 1 in a three part series. A year later, I got around to part 2, [““C is not how the computer works” can lead to inefficient code"](https://words.steveklabnik.com/c-is-not-how-the-computer-works-can-lead-to-inefficient-code).

It’s been five more months. I don’t think I really want to write out the third part; I expected this to be a quick series of blog posts, not something that was on my plate for a year and a half. Here’s the thesis of part 3:

> Part three is going to show what happens if you make a mistake with the ideas from part two. If you incorrectly assume that C’s abstract model maps directly to hardware, you can make mistakes. This is where UB gets dangerous. While you can take advantages of some properties of the machine you’re relying on, you have to know which ones fit within C’s model and which ones don’t.
> 

I honestly don’t feel like writing more than that, so I’m just gonna leave it there. Basically, the overall thrust of this series has been this: C is not the hardware, it’s an abstract machine. But that machine runs on real hardware, and abstractions are leaky. If you go too far into “purely only the abstract machine,” you may not be able to accomplish your tasks. If you go too far into “C runs directly on the hardware,” you may be surprised when a compiler does something that you didn’t expect.
