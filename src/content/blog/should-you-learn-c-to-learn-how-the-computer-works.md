---
title: "Should you learn C to \"learn how the computer works\"?"
pubDate: 2018-10-02
blog: words
---


I’ve often seen people suggest that you should learn C in order to learn how computers work. Is this a good idea? Is this accurate? I’m going to start with my conclusion right upfront, just to be crystal clear about what I’m saying here:

- C is not “how the computer works.”
- I don’t think most people mean this phrase literally, so that is sort of irrelevant.
- Understanding the context means that learning C for this reason may still be a good idea for you, depending on your objectives.

I plan on making two follow-up posts as well, exploring more implications of this idea, but this is already quite a lot. I’ll update this post with links to them when I make them.

---

I’ve often seen people suggest this:

> By learning C, you can learn how computers work.
> 

I think that this idea is not inherently wrong, but does come with some caveats. As long as you keep those caveats in mind, I think this can be a viable strategy for learning new and important things. However, I rarely see people discuss this slogan in detail, so I’m writing this post so that I can provide that context that I believe is sorely needed. If you’re thinking about learning C for this reason, this post is written for you. I hope it’ll assist you as you learn.

> Before we truly begin, I’d like to say one more thing: if you want to learn C, then learn C! Learning things is great. Learning C was quite important to my understanding of computing and my career. Learning C and about its place in programming language history will make you a better programmer. You don’t need a justification. Learn stuff for the sake of learning it. This post is intended to be a guide to your quest for understanding, not a suggestion that you should or should not learn C.
> 

First of all, let’s talk about who is generally recommended this idea. If you’re trying to “learn how computers work,” then it stands to reason that you don’t currently understand that. Which programmers don’t understand how computers work? I’ve mostly seen this sentiment come from people who primarily program in dynamically typed, “scripting” languages, like Ruby, Python, or JavaScript. They “don’t know how computers work” because these languages operate inside of a virtual machine, and therefore, the semantics of the virtual machine are what actually matters. After all, the whole idea of a virtual machine is to provide portability. The goal is to only require knowledge of what’s portable, rather than rely on the details of the hardware that the VM is running on.

There’s just one problem with this: C *also* operates inside of a virtual machine.

## The C abstract machine

From the [C99 spec](http://www.open-std.org/jtc1/sc22/WG14/www/docs/n1256.pdf), Section 5.1.2.3, “Program Execution”:

> The semantic descriptions in this International Standard describe the behavior of an abstract machine in which issues of optimization are irrelevant.
> 

In my opinion, this is the most important concept to understand when learning C. C does not “describe how the computer works,” it describes how the “C abstract machine” works. Everything else of importance flows from this concept and its implications.

> A further note: I’ve chosen C99 here, which is not the latest C standard. Why? Well, MSVC has an …interesting amount of C support, and I’m a Windows user these days. Yes, you can run clang and gcc on Windows. There is not a ton of difference between C89, C99, and C11 with regards to what we’re talking about in these posts. At some point you have to pick. The version I’ve linked here includes some amendments to the initial spec.
> 

You may have heard another slogan when talking about C: “C is portable assembler.” If you think about this slogan for a minute, you’ll also find that if it’s true, C cannot be how the computer works: there are many kinds of different computers, with different architectures. If C is like a version of assembly language that works on multiple computers with multiple architectures, then it cannot function exactly how each of those computers work simultaneously. It *must* hide details, or else it wouldn’t be portable!

That said, I think this fact is sort of irrelevant, because I don’t think people mean the phrase “C is how the computer works” literally. Before we can talk about that, let’s talk about the C abstract machine, and why many people don’t seem to understand this aspect of the C language.

## Aside: why do people get this wrong?

I can only relate my own experience, though I think it generalizes to many others.

I learned GW-BASIC, then C, then C++, then Java. I had heard about Java before I started writing it in roughly 1999, four years after it was introduced. Java’s marketing at the time was very anti-C++, and it focused on the JVM as a platform, and how the machine model was what differentiated it from C++, and therefore C. Sun Microsystems no longer exists, but a [mirror of the press release](https://tech-insider.org/java/research/1996/0123.html) has this to say:

> Java-based applications are platform-independent; only the Java Virtual Machine needs to be ported to each platform. It acts as an interpreter between an end user’s computer and the Java-based application. An application written in the Java environment can run anywhere, ending the need for porting applications to multiple platforms.
> 

“Write once, run everywhere” was the big slogan. These two sentences were how I (and many others) came to understand Java, and how it differed from C++. Java has an interpreter, the Java Virtual Machine. C++ does not have a Virtual Machine.

With this huge marketing push, “virtual machine” became synonymous with “large runtime and/or interpreter” in the minds of many. Languages without this feature were too tied to the particular computer, and required porting between platforms, because they are not truly platform independent. Java’s very reason to exist was to change this aspect of writing applications in C++.

> “Runtime”, “virtual machine”, and “abstract machine” are different words for the same fundamental thing. But they’ve since gained different connotations, due to non-essential variance in different implementations of these ideas.
> 

I personally believe that this marketing, in 1995, is why programmers still misunderstand C’s nature today.

So is this claim false? Why would Sun Microsystems spend millions and millions of dollars promoting a lie? If C is also based on an abstract machine that offers portability between platforms, why did Java need to exist? I think this is key to understanding what people *really* mean when they say “C is how the computer works.”

## What do people actually mean?

Even though C operates in the context of a virtual machine, it still is significantly different than something like Java. Sun was not lying. In order to understand why, you have to understand C’s history.

An operating system was written in assembly language for a computer called the “PDP-7” in 1969 at Bell Labs. In 1970, it was christened UNIX. As time went on, Bell Labs bought more and newer computers; including the PDP-11.

When it came time to port Unix to the PDP-11, they considered using a higher-level language, which was a pretty radical idea at the time. Imagine that I said to you “I’m going to write an OS in Java” today, you’d probably laugh, even though [it is possible](https://en.wikipedia.org/wiki/JavaOS). The situation (in my understanding, I wasn’t alive then) was pretty analogous. They considered a language called B, but it didn’t support some of the features that the PDP-11 had, and so they created a successor, naming it “C”, since C was the next letter in the alphabet.

> There was no “A”; B was a successor to BCPL, the “Basic Combined Programming Language.”
> 

In 1972, on a PDP-11, they wrote the first C compiler, and simultaneously re-wrote UNIX in C. Initially, portability wasn’t the actual goal, but C did resonate with a lot of people, and C compilers were ported to other systems.

In 1978, the first edition of “The C Programming Language,” a book on C, was published. Affectionately known as “K&R,” after its authors, the book was very much not a specification, but provided enough of a description of the language that others attempted to write C compilers. This would later be called “K&R C.”

As UNIX spread, so did C, and both were ported to many computers. In the 70s and 80s, the ports grew and grew. In the same way that C was created because B couldn’t support all of the features of the PDP-11, many compilers had extensions to the language. Since there was only K&R, and not a spec, as long as they were close enough, that was considered acceptable. By 1983, the lack of any sort of standardization was causing issues, and so a group was created at ANSI to produce a spec. C89 was published in 1989, and is sometimes called “ANSI C.”

As such, the C specification was attempting to unify these diverse implementations, on diverse hardware. And so the C abstract machine is sort of the minimal possible specification that would allow the same code to run the same on all platforms. Implementations of C were compiled, not interpreted, and so there was no interpreter, so there was no “VM” in that 1995 sense. However, C programs are written against this abstract, non-existent machine, which is then translated into assembly that is specific to the actual computer that the program is running on. You could not rely on some specific details in order to write portable C code. This makes writing portable C very tricky, as you may have made a platform-specific assumption when writing the initial version of your code.

This is best illustrated with an example. One of the fundamental data types in C is a `char`, named after “character.” However, the C abstract machine does not define how many bits a `char` is. Well, it defines it, but not with a number; it defines it as `CHAR_BIT` big, which is a constant. Section 5.2.4.2.1 of the spec:

> The values given below shall be replaced by constant expressions suitable or use in #if preprocessing directives. … Their implementation-defined values shall be equal or greater in magnitude (absolute value) to those shown, with the same sign.CHAR_BIT: 8
> 

So in other words, you know that a `char` must be at least 8 bits in size, but implementations are allowed to be larger. In order to properly code against the “C abstract machine”, you must use `CHAR_BIT` instead of `8` as the size when doing `char`-by-`char` processing. But this isn’t some sort of interpreter feature, in the way that we think of virtual machines; it’s a property of how the compiler turns your source code into machine code.

> Yes, there are systems where CHAR_BIT isn’t 8.
> 

So this “abstract machine”, while still technically being the same idea as the Java VM, is more of a compile-time construct to guide compilers in the task of emitting assembly code than some sort of runtime check or property. The equivalent type in Java is `byte`, which is always 8 bits, and it’s up to the implementation of the JVM to decide how to make that happen on platforms where a byte is larger. (I am not sure if the JVM runs on any of those platforms, but that’s how it would work.) The C abstract machine was created to be a minimal papering over of various hardware, not to be some sort of platform created from whole cloth that’s written in software that your code targets.

So while Sun is technically incorrect, in practice, they mean something different than what they’re literally saying, and what they *mean* is accurate. It’s the same with “learn C to learn how computers work.”

## Learn C to learn *more* about how computers work

What *do* people actually mean? In the context of “should a Rubyist learn C to learn about how computers work”, this desire to drop “down to the metal,” as it were, is an interest in understanding not only their program, and how it works inside the VM, but to understand how the combo of their program + their VM operates in the context of the machine itself.

Learning C *will* expose you to more of these kinds of details, because the abstract machine maps so much more closely to hardware, as well as abstractions provided by operating systems. C is very different than these sorts of languages, and so learning C can teach you a lot.

But it’s also important to remember that C is fundamentally an *abstraction* of hardware, and abstractions are leaky. Don’t conflate what C does or how it operates with the machine itself. If you do, you’re bound to run afoul of these differences, which can cause problems. Most learning resources for C, especially today, as hardware becomes more and more homogeneous, will promote the idea that this is how the computer works. So it can be hard, as a learner, to know what’s going on under the hood, and what’s an abstraction provided by C.

We haven’t even touched on other factors in this discussion, like that due to C’s tremendous popularity, hardware has become more homogeneous because it tends towards being similar to the semantics of C’s abstract machine. If your architecture deviates too much from C’s semantics, C programs may run much more slowly than others, and C programs are often how the speed of hardware is tested. This post is long enough…

For this reason, I think a more accurate version of this statement would be “By learning C, you can learn *more* about how computers work.” I do think that a rough familiarity with C can be useful to many programmers, and will serve them well even if they don’t write any C themselves. Learning more about C can also give you insight into the history of how our field has developed.

There are other ways to learn this stuff as well; C is not *inherently* the way to learn these topics, but it is a good option. My next two posts will explore some of the implications of this intersection between portability, the C abstract machine, and how people think about C programs.

There’s so many things to learn in computing. I wish you well on your journey.
