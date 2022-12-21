---
layout: ../../layouts/MarkdownPostLayout.astro
title: "WebAssembly is more than just the web"
pubDate: 2018-07-13
blog: words
---


While WebAssembly was given its name for good reason, I also think it’s quite the misnomer. When you hear about WebAssembly, don’t just think of the web: think bigger.

Many programmers know that WebAssembly is a technology that lets you run non-JavaScript code in the browser. That is true, but there’s a lot more to it. You see, the spec is written in a very interesting way: there’s the core, what WebAssembly actually is. Here’s [the opening section](https://webassembly.github.io/spec/):

> To support the embedding of WebAssembly into different environments, its specification is split into layers that are specified in separate documents.
> 

> Core specification - Defines the semantics of WebAssembly modules and its instruction set, independent from a concrete embedding.API specifications - Define application programming interfaces enabling the use of WebAssembly modules in concrete embedding environments.
> 

It goes on to say:

> Currently, two APIs are specified: JavaScript API … Web API.
> 

So, WebAssembly itself, the core, is completely independent of the web. The web is a particular environment that Wasm is embedded *in*, but not actually required to use wasm. Other embedding APIs can be created, with their own interfaces, to do various things.

Let’s make this concrete: on the web, we can write a program that draws graphics using WebGL. But we could also write a desktop program that embeds a WebAssembly interpreter, and provides an OpenGL (or whatever else) API to render to the screen. And now our WebAssembly program is running on the desktop.

Why would you want to do this? Well:

> I wonder if wasm, in being sufficiently minimal, well defined, practical and widely supported, will wind up as an archival format of choice for emulation-based software preservation. https://t.co/33OUOrqiWg
— Graydon Hoare (@graydon_pub) July 11, 2018
> 

These emulators, with a teeny bit of work, could be made to run on the desktop as well. “Cross-platform” doesn’t just mean “Windows, Linux, and MacOS”, but can also mean running to the web as well.

There’s so many more things that can be done, too. All it requires is a bit of re-framing of WebAssembly in your mind:

WebAssembly is *not* a way to run code other than JavaScript on the web; WebAssembly is a tiny, embeddable language that you can use almost anywhere.

Some have compared WebAssembly to Java applets; in some ways, they’re very right, but in some ways, they’re very wrong. Eventually I’ll write a post about the wrong, but for now, the right: in some sense, WebAssembly is a different way of accomplishing what the JVM set out to do: it’s a common virtual machine that can be used to build very cross-platform software.

There’s a couple of other interesting applications of WebAssembly outside of the browser; one of my personal favorites is [Nebulet](https://github.com/nebulet/nebulet):

> A microkernel that implements a WebAssembly “usermode” that runs in Ring 0.
> 

I’d describe it like this:

> Nebulet is an operating system that runs WebAssembly programs.
> 

None of this has anything to do with a web browser; just like ELF is the standard binary format on many Linuxes, WebAssembly is the standard binary format on Nebulet. It’s a new implementation of a quite old idea, but I’m really excited to see where it goes.

A second interesting example is Parity. I’m a cryptocurrency skeptic, but from a tech perspective, this is quite cool. Parity is a company who is building a VM for the Ethereum cryptocurrency. Etherium’s VM has a programming language, Solidity, that lets you script their blockchain. Writing a programming language is a tough task on its own, and Solidity has had some issues, leading to pretty serious bugs. And those bugs are affecting people’s money.

So, rather than keep their custom language, Parity is experimenting with [embedding WebAssembly into the Ethereum VM instead](https://wiki.parity.io/WebAssembly-Design). This gets them a well-tested language that has pretty decent toolchain support, and lets them use a variety of other languages to do said scripting. This is very cool!

These are a few of the possibilities for WebAssembly, and I’m really excited about where it could go in the future.
