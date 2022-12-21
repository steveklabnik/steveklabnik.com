---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Is WebAssembly the return of Java Applets & Flash?"
pubDate: 2018-07-25
blog: words
---


In my [last post on WebAssembly](http://words.steveklabnik.com/webassembly-is-more-than-just-the-web), I made the following claim:

> Some have compared WebAssembly to Java applets; in some ways, they’re very right, but in some ways, they’re very wrong. Eventually I’ll write a post about the wrong, but for now, the right: in some sense, WebAssembly is a different way of accomplishing what the JVM set out to do: it’s a common virtual machine that can be used to build very cross-platform software.
> 

A lot of people expressed interest in me elaborating, so let’s get to it! For this post, I’m going to make three comparisons: to Flash, to Java Applets, and *occasionally* to PNaCL. Secondly, this post is going to focus on the *web* use-case for WebAssembly, even though the previous post was about non-web uses. We’ll make *that* comparison in the next post. Finally, this post is kind of like eating tapas, there’s a bunch of little sections. I feel like it’s a bit short, but at the same time, I’m trying to get back into the habit of blogging, and if I try to keep expanding it, it’ll take forever, so it is what it is.

---

For what it’s worth, I think this comparison is very *natural*; that is, when you hear this pitch for WebAssembly:

> WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable target for compilation of high-level languages like C/C++/Rust, enabling deployment on the web for client and server applications.
> 

It sounds quite a bit like previous technologies. Asking how they relate, or assuming that they’re a slightly different take on the problem makes a lot of sense. But WebAssembly is significantly different, for a few reasons.

## Wasm won

The first reason that WebAssembly is different is that it’s succeeded, and those technologies did not. When I say this, I mean it in a very specific way; if you look at the number of Flash applications out there, and compare it to the number of WebAssembly apps out there, Wasm loses, for sure. Those of us that are excited about WebAssembly still have a lot of work to do before it’s widely used.

When I say “WebAssembly won”, I mean that it’s become a part of the Web Platform. Flash, Java Applets, and PNaCL used the browser’s plugin functionality to work. They were, in a sense, *outside* of the web ecosystem. They were never standardized, and that matters a lot.

In some sense, this is the final point, really. But just saying that it’s true doesn’t explain *why*. The rest of this post digs into *why* this occurred, and those points sort of sum up to this one: other technologies didn’t make it, but WebAssembly did. There’s a *lot* of overlap here, but I’m trying to reasonably separate it out into individual points.

## Other technologies didn’t fit nicely into the platform

Remember this?

![https://svbtleusercontent.com/gY9tj6D62jnC9Fc6RncFhD0xspap_small.gif](https://svbtleusercontent.com/gY9tj6D62jnC9Fc6RncFhD0xspap_small.gif)

Or this?

![https://svbtleusercontent.com/qaipxL2e5a4gLH5cAhRHDn0xspap_small.jpg](https://svbtleusercontent.com/qaipxL2e5a4gLH5cAhRHDn0xspap_small.jpg)

What about this?

![https://svbtleusercontent.com/9mGgBDzvwYYLGHFg4Pafzt0xspap_small.png](https://svbtleusercontent.com/9mGgBDzvwYYLGHFg4Pafzt0xspap_small.png)

If you built an applet in one of these technologies, you didn’t really build a *web application*. You had a web page with a chunk cut out of it, and your applet worked within that frame. You lost all of the benefits of other web technologies; you lost HTML, you lost CSS, you lost the accessibility built into the web. These platforms never gained the ability to interact with the rest of the platform provided by your browser. Well, [technically they might have](https://docs.oracle.com/javase/tutorial/deployment/applet/manipulatingDOMFromApplet.html), but that’s not how these technologies were used in practice.

How could the web sustain an ecosystem that doesn’t integrate with it? It was never going to happen. And users ended up solidly rejecting it. Outside of games, users *hated* Flash. Java Applets were heavy and slow. Enshrining these technologies into the web platform wasn’t going to work.

WebAssembly, on the other hand, is much closer to JavaScript. It doesn’t inherently require taking over a part of your screen. It doesn’t expect to be its own little closed off world. Via JavaScript today, and [on its own in the future](https://github.com/WebAssembly/host-bindings/blob/master/proposals/host-bindings/Overview.md), it’s able to interact with the surrounding environment. It just… fits.

## Other technologies were owned by companies

Java was owned by Sun Microsystems, Flash was owned by Adobe. But why does this matter?

Corporate influence on the web is a complicated topic. But *in general*, the web runs on a psuedo-consensus model. Java and Flash, on the other hand, were controlled by their respective companies. These companies have significant motive to make profit, not to make the web better. And that’s partially what led to the above situation; these companies didn’t care that they didn’t integrate properly with the rest of the platform. Why would they? It’d be much better for business if you got locked into their platform, and abandoned the rest of the web entirely. The incentives are fundamentally misaligned.

WebAssembly is a joint venture between Mozilla, Google, Apple, Microsoft, and others. It’s not trying to push anyone’s particular platform, but instead represents the shared interests of a wide number of stakeholders, both corporate and individual.

## WebAssembly followed the web process

This *also* meant that these technologies never really followed the process that we use to standardize the web. That being said, the web standards process is healthier than its ever been, and at the time these technologies were big, things worked a bit differently. Regardless, WebAssembly followed the way that we do things on the web.

First, `asm.js` was created, proving that we could do more impressive things with the web. Its performance was good enough to demonstrate what could be done, though it wasn’t fantastic. The secret sauce of `asm.js` was that it was just JavaScript; it was fully backwards compatible with the existing ecosystem. “Don’t break the web” is a very, very important rule for browser vendors.

WebAssembly was sort of `asm.js` done better. After building some degree of consensus around `asm.js`, a variety of people came together to make WebAssembly a reality. Given that it wasn’t just JavaScript, it had to go through the usual process for browsers to implement it, and it did so. Now a W3C spec, it went *with* the grain of web standards, not against them.

### Corollary: other technologies were too big and unstable

There’s another reason Wasm succeeded: it’s tiny. Wasm takes the approach of other web technologies: start small, and build on those foundations. Stay backwards compatible. These technologies also didn’t follow that particular social convention. For Flash and Java Applets, you’d be downloading the particular runtime you needed, and so there was no need for compatibility. PNaCl built on top of LLVM IR, which is completely unstable. They were going to make it a stable subset, but then when LLVM introduces changes, it would have ended up diverging, which isn’t a great situation to be in.

These technologies were also far too large to ever make it through the stabilization process. Can you imagine the big four browser vendors specifying the JVM in full and then agreeing to those semantics for all time? For all of ActionScript, itself a similar-to-but-not-quite version of ECMAScript? For all of LLVM-IR?

Large technologies introduce an unacceptable amount of risk in this situation. It’s an all-or-nothing kind of deal, and the safe bet is to go with “nothing.” WebAssembly, on the other hand, does almost nothing. It’s pretty much math and calling into JavaScript. This means it’s *much* easier to develop consensus around.

### Collary: other technologies required an entire separate virtual machine

I haven’t mentioned Dart in this post, but it sort of fits here too. One big issue with “let’s just put the JVM in every browser” is that browsers *already* contain a language runtime: JavaScript’s. It’s hard enough to maintain one runtime, let alone two. And then how do you integrate them?

WebAssembly, on the other hand, was designed to be a small extension to existing JavaScript virtual machines. While you *can* implement your own WebAssembly VM, and non-web use cases often do, for browsers, the maintenance cost is much, much lower.

## Other technologies were too specific

WebAssembly is fundamentally langauge-agnostic. Flash and Java Applets were built first and foremost to run ActionScript and Java. They’re deeply tied to their relative semantics. Even PNaCl suffers from this to some degree; LLVM is really designed for C-like languages, though not quite the same amount.

Do we really want to christen one language as the next language of the web? We already have JavaScript. Are we someday going to introduce a third language? A fourth? An agnostic approach is significantly better for longevity’s sake.

## Wasm has a strong approach for safety

Java Applets and Flash were security *nightmares*. Even if there were attempts to secure them, in reality, they constantly had problems.

WebAssembly, on the other hand, piggybacks on that JavaScript VM again; all of the effort going into creating its sandbox also applies to Wasm. Wasm is missing some features of regular assembly language that can cause security vulnerabilities, like stack smashing. Wasm is memory-safe, which is huge!

Additionally, WebAssembly was designed for *validation* in mind; its fully typed, and can be checked without running any of its code. It spec includes instructions on how to do validation. This stuff is quite useful!

## Conclusion

One thing I’ll say about this post is that it’s quite *implementer* focused. But implementers are important; they control the web. Providing a solution that works with their goals is just as important as something that works for users. In a future post, I’d like to try to go over user concerns some as well. I have lots of posts to write!

At the end of the day:

- Other technologies were not integrated into the platform, and commercial interests didn’t point towards that happening
- Other technologies required too much; too much to agree on, too much to implement
- Wasm has a really strong sandboxing and verification story that others simply did not.
