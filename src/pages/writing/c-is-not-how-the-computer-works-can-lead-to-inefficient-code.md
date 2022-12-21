---
layout: ../../layouts/MarkdownPostLayout.astro
title: "\"C is not how the computer works\" can lead to inefficient code"
pubDate: 2019-10-25
blog: words
---


A little over a year ago, I wrote [“Should you learn C to ‘learn how the computer works’”](https://words.steveklabnik.com/should-you-learn-c-to-learn-how-the-computer-works). It was a bit controversial. I had promised two follow-up posts. It’s taken me a year, but here’s the first one.

In that post, I argued that C doesn’t “work like the computer”, but rather, by a concept called the “C abstract machine.” It happens to be close to how computers operate in some sense, but that when you write C, you’re writing for the abstract machine, not the computer itself. Here’s the trick, though: the C abstract machine doesn’t define every single aspect of how computation happens. And so sometimes, you can write code in two different ways, that the C abstract machine says are equivalent, yet are *not* equivalent in performance. This means that, even if you buy into my original point, you still need to know the boundaries of this definition, and can exploit those boundaries in important ways.

Let’s start with a made-up example, and then we’ll show how this happens in real code. Imagine that we have a very simple programming language, built on an abstract machine. It defines only the semantics for the multiplication of two 32-bit integers. It also ignores things like overflow. You could write a program like “3 * 4” and this machine would say “hey the result is 12.” Let’s also imagine we have a very simple computer: it has a single instruction, “add two numbers together.” This takes one clock cycle to execute. If we wrote a compiler for this machine, and didn’t apply any optimizations, it would execute “4 + 4”, and then take that result and add four to it. We have two add operations, and so our program takes two clock cycles.

Let’s imagine a new version of our computer comes out. It adds a new instruction: multiplication. This also takes one cycle, but can multiply two numbers directly. Our compiler adds a new back-end, and when compiling our “3 * 4” program for this fancy new machine, it emits a single multiplication instruction. Our program now takes one clock cycle.

Now imagine a new version of our compiler. It is able to do “constant folding”, an optimization. Our program does no computation at all, only produces a “12” directly. This now means our program takes zero cycles on both bits of hardware.

Is all of this okay?

Yes! The machine only defines how the `*` operator works on numbers in a “what number comes out the other side” sense. It doesn’t specify how to actually accomplish this task. Compilers for our little language are free to implement the details in any way they choose, as long as they respect the rules of the abstract machine. Other details are fair game. As long as the program “3 * 4” produces “12”, the rest of the computational process doesn’t actually matter.

This is how you can write “portable” code that is portable in one sense, but not at all in another sense. As long as you respect the rules of the abstract machine, you’ll be guaranteed (we live in a world with no compiler bugs, of course) to get the correct result. If it takes too long, or takes no time at all, that’s not the language’s concern, strictly speaking.

If this idea seems silly to you, well, I can assure you it’s real. For example, let’s consider the actual C language, and some actual hardware, specifically, x86.

Imagine we have an array of arrays, four by four: (markdown gives me a header even though I don’t want it, sorry about the weirdness)

[Untitled](C%20is%20not%20how%20the%20computer%20works%20can%20lead%20to%20ineffi%202b34895a7b344b0e93a0dbd0515139ca/Untitled%20Database%20df376e76bfe74a62abbdda51693c3dce.csv)

There are two naive ways to process it: row by row:

[Untitled](C%20is%20not%20how%20the%20computer%20works%20can%20lead%20to%20ineffi%202b34895a7b344b0e93a0dbd0515139ca/Untitled%20Database%20c2687cd2b9814695ba63e3183581d2e6.csv)

or column by column:

[Untitled](C%20is%20not%20how%20the%20computer%20works%20can%20lead%20to%20ineffi%202b34895a7b344b0e93a0dbd0515139ca/Untitled%20Database%20e999f44a3a62483092c9065991f9768a.csv)

Here’s a fun question: is one of these faster than the other?

At this small size, probably not. But there’s a way to do this that’s faster than either of these ways, and that’s called “blocking” or “tiling”. It means that you process a sub-set, or “block”, of the array each time. Something like this:

[Untitled](C%20is%20not%20how%20the%20computer%20works%20can%20lead%20to%20ineffi%202b34895a7b344b0e93a0dbd0515139ca/Untitled%20Database%20f238e97cef4442efb1628470bf902868.csv)

On x86, this is *meaningfully* faster in many circumstances. This has to do with the way that the CPU caches information. For more, see [this page from Intel](https://software.intel.com/en-us/articles/how-to-use-loop-blocking-to-optimize-memory-use-on-32-bit-intel-architecture), including a visualization that’s probably better than mine.

This raises an interesting point: is this code portable? Imagine a machine that didn’t have the cache behavior of x86 chips here. This code would run on them, but it may be 14 times slower. Strictly speaking, this program is “portable” in the sense that you’ll get the right computation in the end, but maybe this speed is part of the user requirements for this software to be successful, and so being super slow means that it “doesn’t work” according to those requirements, even though from a programming language point of view, it’s all good.

Because C’s abstract machine is so thin, these kinds of details can really, really matter, as we’ve seen. And this is where the good part of the “C teaches you how the computer works” meme comes in. Because the machine is thinner, you can learn more about the details, and as long as they’re not details that the C abstract machine cares about, exploit them. And there’s a good reason I mentioned an optimizing compiler above; it’s also the job of compiler authors to realize the difference between a given computer and the C abstract machine, and then exploit the difference to make your code go as fast as possible. But this really blurs the line between abstract machine and physical machine. And that’s why we all argue online about this all the time.

---

I have a third post to wrap up this series. I hope it won’t take me another year, but no guarantees…
