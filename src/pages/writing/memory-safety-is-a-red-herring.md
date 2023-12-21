---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Memory Safety is a Red Herring"
pubDate: 2023-12-21
blog: 
---

TL;DR:

I think that a focus on memory safe languages (MSLs) versus non memory-safe
languages is a bit of a red herring. The actual distinction is slightly bigger
than that: languages which have defined behavior by default, with a superset
where undefined behavior is possible, vs languages which allow for undefined
behavior anywhere in your program. Memory safety is an important aspect of this, 
but it is neccesary, not sufficient. Rust's marketing has historically focused
on memory safety, and I don't think that was a bad choice, but I do wonder
sometimes. Finally, I wonder about the future of the C++ successor langauges in
the face of coming legislation around MSLs for government procurement.

Additionally, I would like to thank ixi for discussing some of this stuff with
me. I do not claim that they agree with me, these opinions are solely my own!
But talking about it helped me form those opinions.

----

## ThreadId(1)

Today I have been programming in Rust for 11 years. I usually write some sort
of blog post reflecting on the year. This year, I am reflecting on some old
questions:

* Should Rust have focused so much on memory safety in its advocacy?
* Does Rust conflate a more general concept of "safety" with "memory safety?"
* What do people even mean by "memory safe languages?"

But before we get there, we have to talk about some other things.

## ThreadId(2)

The other day, someone [asked an interesting question on Hacker
News](https://news.ycombinator.com/item?id=38616605):

> Can someone with a security background enlighten me, on why Python is on the
> list of "memory safe" languages? Most of the python code I have worked with is
> a thin wrapper on C. Wouldnt that make python vulnerable as well?

This is a very reasonable question! If you click the link, you'd see my answer:

> You are correct that if you call C from Python, you can run into problems. But
> the fault there lies with the C, not the Python. Pure Python itself is memory
> safe.
> 
> Because memory safety is built on top of memory unsafety, it is generally
> understood that when discussing things at this sort of level, that we are
> speaking about the Python-only subset. (Same as any other memory safe language.)

But this has been gnawing at me for a while. Like it's one of those things that
"everybody knows what I mean." But isn't that kind of... bullshit? Like something
is wrong with your definitions. But on the other hand, if we accept FFI as
being not safe, and that since you can FFI from anywhere, that means it's also
unsafe, then every single program is unsafe. Your operating system does not
offer memory-safe APIs. To do anything useful, you must call into the operating
system. This means every program would be infected via this conception of safety,
and therefore, as a definition, it would be useless.

If we instead make an exception for a language's runtime, which is allowed to
make unsafe calls, but users' code is not, that would draw an appropriate
boundary: only write code in the guest langauge, and you don't have to worry
about safety anymore. And I think that this sort of definition has been the
default for many years. You have "managed" languages which are safe, and you have
"unmanaged" languages which are unsafe. Unmanaged languages are used to implement
managed languages. What's that? A Java runtime written in Java? A Ruby runtime
written in Ruby? Yeah those are weird exceptions. Ignore those. And those
"native extentions" that segfault? Well they aren't written in the host language,
so of course that will happen, and yeah it's kinda annoying when it happens, but
it's fine. Sometimes you have to risk it for performance.

I just don't find this satisfying. It's too vague. You just kinda know it when
you see it. Ignore FFI, and we're good. And sometimes, you just can't have safety.
What if you want to write a runtime? You're gonna need to call into the system
directly, and now we're back to unsafe, so just use an unsafe langauge. It is
what it is.

## ThreadId(3)

That comment is on an article titled [The Case for Memory Safe
Roadmaps: Why Both C-Suite Executives and Technical Experts
Need to Take Memory Safe Coding Seriously
](https://media.defense.gov/2023/Dec/06/2003352724/-1/-1/0/THE-CASE-FOR-MEMORY-SAFE-ROADMAPS-TLP-CLEAR.PDF).
This document, published by [the Five Eyes](https://en.wikipedia.org/wiki/Five_Eyes),
suggests... that executives and technical experts need to take memory safety
seriously. Call it boring if you want, but it is what it says on the tin.

More specifically, it says:

> Memory safe programming languages (MSLs) can eliminate memory safety
> vulnerabilities. 

As well as an appendix, "Memory Safe Languages," which describes C#, Go, Java,
Python, Rust, and Swift as memory safe languages.

Finally, it says:

> Programming languages such as C and C++ are examples of memory unsafe programming
> languages that can lead to memory unsafe code and are still among the most widely used
> languages today.

But it also acknowledges the reality that sometimes you can get around memory
safety:

> MSLs, whether they use a garbage collection model or not, will almost
> certainly need to rely on libraries written in languages such as C and C++.
> Although there are efforts to re-write widely used libraries in MSLs, no such
> effort will be able to re-write them all anytime soon.
> 
> For the foreseeable future, most developers will need to work in a hybrid model
> of safe and unsafe programming languages. Developers who start writing in an MSL
> will need to call C and C++ libraries that are not memory safe. Likewise, there
> are going to be situations where a memory unsafe application needs to call into
> a memory safe library. When calling a memory unsafe component or application,
> the calling application needs to be explicitly aware of—and limit any input
> passed to—the defined memory bounds.
> 
> The memory safety guarantees offered by MSLs are going to be qualified when data
> flows across these boundaries. Other potential challenges include differences
> in data marshalling, error handling, concurrency, debugging, and versioning. 

Okay, that's enough quoting from the report. And I swear I'm not about to say
nice things about it becuase I am cited as #42, though to be honest it's real
fucking weird that searching "klabnik" on a page on defense.gov returns 1/1.
But I think this is an excellent formulation of the critical distinction between
the languages on one side of the line versus the other, though they make the
same conceptual mistake that I believe Rust may have: it's not just about
memory unsafety. "safety" itself is basically the idea that most of the time,
you're in a universe where everything is peachy keen, and occasionally, you'll
need to reach across that line into the scary other place, but you gotta do what
you gotta do. But there is a line there. But that line is more abstract than
just memory safety.

## ThreadId(4)

Rust often describes itself as "data race free." But what the heck is a data
race anyway? Here's [John Regehr](https://blog.regehr.org/archives/490):

> A data race happens when there are two memory accesses in a program where both:
> 
> * target the same location
> * are performed concurrently by two threads
> * are not reads
> * are not synchronization operations
> 
> There are other definitions but this one is fine; it’s from Sebastian Burckhardt at Microsoft Research.

Oh. Well I guess "Here's Sebastian Burckhardt:" instead.

Point is, data races are undefined behavior in Rust, and they're also undefined
behavior in C++. When looking for a succinct citation for that fact, I came
across [this 2006 post by Hans Boehm](https://www.hboehm.info/c++mm/why_undef.html).
Its first line:

> Our proposed C++ memory model gives completely undefined semantics to programs
> with data races.

I believe this was the model that was accepted, so that's the best citation you're
gonna get from me. Okay, as soon as I read that I said "come on Steve, that's stupid,
make sure it's not just trivial to actually find in the standard" and lo and
behold
[n4849](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2020/n4849.pdf)
says:

> The execution of a program contains a data race if it contains two potentially
> concurrent conflicting actions, at least one of which is not atomic, and
> neither happens before the other, except for the special case for
> signal handlers described below. Any such data race results in undefined
> behavior.

Okay, the real citation was easier. The article by Bohm is still fascinating.

But data races aren't undefined behavior in every programming language. For
example, let's consider both Java and Go. Now I hate that I even have to
pre-emptively say this, but I am *not* saying Java and Go are bad. I think
these are good decisions for both of the two languages. And I think their
decisions here are very informative. Language wars are stupid. Stop it.

Java was the first time I remember hearing "yeah you can have data races but
like, it's fine" about. I kinda lodged that fact in the back of my brain, and
didn't think about it much. But lately I was wondering. So I went and read
the Java specification, and more specifically, [Chapter
17](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html). It contains
this text:

> The semantics of operations other than inter-thread actions, such as reads of
> array lengths (§10.7), executions of checked casts (§5.5, §15.16), and
> invocations of virtual methods (§15.12), are not directly affected by data
> races.
> 
> Therefore, a data race cannot cause incorrect behavior such as returning the
> wrong length for an array.

This is morally equivalent to "not undefined behavior" even though the
specification doesn't define "undefined behavior" in the way that the C, C++,
and Rust specifications do. Notably, the specification also defines "data race"
in a slightly different way:

> When a program contains two conflicting accesses (§17.4.1) that are not
> ordered by a happens-before relationship, it is said to contain a data race.

Not just any ordering or synchronization primitive, an happens-before relation
specifically. Fun! We have three technically-slightly different but basically
morally equivalent ways of defining a data race. Let's do a fourth. Go also
allows data races. Sort of. From [the Go memory model](https://go.dev/ref/mem):

> A data race is defined as a write to a memory location happening concurrently
> with another read or write to that same location, unless all the accesses
> involved are atomic data accesses as provided by the sync/atomic package.

Given that Rust provides atomic ordering operations in a submodule of its
standard library, Rust and Go agree here, though Go's more specific about naming
it.

But they also have this to say:

> While programmers should write Go programs without data races, there are
> limitations to what a Go implementation can do in response to a data race. An
> implementation may always react to a data race by reporting the race and
> terminating the program. Otherwise, each read of a single-word-sized or
> sub-word-sized memory location must observe a value actually written to that
> location (perhaps by a concurrent executing goroutine) and not yet overwritten.

So it's not right, but it's also not exactly UB. It goes on:

> These implementation constraints make Go more like Java or JavaScript, in that
> most races have a limited number of outcomes, and less like C and C++, where the
> meaning of any program with a race is entirely undefined, and the compiler may
> do anything at all. Go's approach aims to make errant programs more reliable and
> easier to debug, while still insisting that races are errors and that tools can
> diagnose and report them.

While a Go program may exhibit what a Rust or C++ program would consider
undefined behavior, and it does also consider it an error, the consequences are
very different. You don't get time travel. You get 998 instead of 1,000.

Go also provides [an unsafe package](https://go.dev/ref/spec#Package_unsafe):

> The built-in package unsafe, known to the compiler and accessible through the
> import path "unsafe", provides facilities for low-level programming including
> operations that violate the type system. A package using unsafe must be vetted
> manually for type safety and may not be portable. 

Oh yeah, I forgot, Java also has `sun.misc.unsafe`, essentially the same thing.
They have actually wanted to remove it for a long time, and some progress has
been made, but it's not quite gone yet. [The Unsafe Class: Unsafe at Any
Speed](https://blogs.oracle.com/javamagazine/post/the-unsafe-class-unsafe-at-any-speed)
is a good explanation of the topic.

## ThreadId(5)

One weird thing about suggesting that the borrow checker is only about memory
safety, and that memory safety means the absence of data races, is that memory
safety is more than just the absence of data races. Consider a problem that
requires no threads to become an issue: iterator invalidation. And different
languages have different answers to this issue:

* In C++, it is undefined behavior.
* In Java, some data structures detect this and throw a `ConcurrentModificationException`.
* In JavaScript, Ruby, and other languages, you often get "weird" behavior:

```ruby
numbers = [1, 2, 3, 4]
numbers.each do |number|
  p number
  numbers.shift(1)
end
p numbers
```

prints

```text
1
3
[3, 4]
```

But you don't get full-blown time-travel undefined behavior. Sort of like this
code in Rust:

```rust
fn main() {
    let i = i32::MAX + 1;
    println!("{i}");
}
```

Okay in this case because it's all at compile time Rust can detect it:

```text
error: this arithmetic operation will overflow
 --> src/main.rs:2:13
  |
2 |     let i = i32::MAX + 1;
  |             ^^^^^^^^^^^^ attempt to compute `i32::MAX + 1_i32`, which would overflow
  |
  = note: `#[deny(arithmetic_overflow)]` on by default
```

But in the general case, you won't get a compile error. You may get a panic, you
may get `-2147483648`. It's weird. But it's not full-blown time-travel undefined
behavior.

Anyway, back to iterator invalidation:

* In Rust, it is prevented at compile time.

This is neat! This is cool! This is good! And it's pretty unique to Rust.

It is nice when our programs do what we expect, instead of what we don't expect.
It is even nicer when, if our programs don't do what we expect, we have some sort
of waypost, some sort of sign where the problem might be. What "nice" means may
be a bit different in different languages, but the boundary is the important
part: we're gonna have to potentially violate the rules somewhere, so at least
give us some help when that inevitably goes wrong. Over here, logic bugs may
happen, some weird behavior may result, but over there? There be dragons.
Nobody can save you out there. Tread carefully.

## ThreadId(6)

If we think about all of these designs, they all are very similar conceptually:
safe code is the default, but you can call into some sort of unsafe facility.
And everyone is very clear on the relationship between the two: while the unsafe
facility exists to be used, it must uphold the rules that the safe world relies
on. And that means that safety and unsafety have a super/sub-set relationship.
In the core is unsafety. But at some point, we draw a line, and on top of that
line, safety exists.

In Rust, we often talk about how unsafe is great, because it clearly draws a
line around code with which serious bugs may happen. More specifically, while
most people describe it as "where memory safety can originate from" or similar,
it's actually slightly broader than that: it's where undefined behavior can
originate from.

[The nomicon](https://doc.rust-lang.org/reference/behavior-considered-undefined.html):

> Rust code is incorrect if it exhibits any of the behaviors in the following
> list. This includes code within unsafe blocks and unsafe functions. unsafe
> only means that avoiding undefined behavior is on the programmer; it does not
> change anything about the fact that Rust programs must never cause undefined
> behavior.
> 
> It is the programmer's responsibility when writing unsafe code to ensure that
> any safe code interacting with the unsafe code cannot trigger these behaviors.
> unsafe code that satisfies this property for any safe client is called sound;
> if unsafe code can be misused by safe code to exhibit undefined behavior, it
> is unsound.

This is not a new insight, but basically, unsafe is like FFI in a managed
language. It's not something you do often. But it is something you sometimes
have to do. And when you do, you can at least contain the danger: the problem
has to lie somewhere behind that veil. You have clear points to begin your
search into where the issues lie, should the abyss claim another soul.

In some ways I'm also repeating another older slogan Rust had: "memory safety
without garbage collection." But it's more like "no UB and no garbage collection."
Gosh, why didn't we put *that* on the website? Practically rolls right off the
tounge. What makes Rust appealing, and I think especially to the "non-systems"
crowd, is that it shares a property of many managed languges, that of "no
undefined behavior by default," with a property of many systems languages, that
of "no runtime, as little overhead as possible." And sure, there's an escape
hatch, but it's rarely used, and clearly separates the two worlds. This is a
fundamentally different way of viewing the world than "unsafe by default."

Another way in which there's an interesting split here in language design
is between the scripting languages like Ruby, Python, and JavaScript, and
languages like Rust, Go, and Java, is that the boundary in the former is purely
FFI, while in the latter, there are also unsafe faculties in the host language
itself, as well as with FFI. In all three cases, they're behind either a specific
package or `unsafe {}`, but they give you some interesting tools that don't
require you to use another language to use. I think this is an under-apprecaited
part of the overall design space.

## threads.into_iter().for_each(|t| t.join().unwrap());

So: did Rust focus too much on memory safety? And what should newer languages
do in this area?

Well, I think that in some sense, the answer is obviously "no, Rust did not
focus too much on memory safety." Rust has been wildly successful, reaching
heights that I only could dream about eleven years ago. Yes, usually I have
tried to be fairly tempered when talking about Rust's successes, and some
folks still try to claim Rust is still super niche. But when I think about the
ways that Rust touched even this blog post, it's staggering: I wrote this post
in VS: Code, which uses Rust, on Windows, which has Rust in the kernel. I
published it to GitHub, which uses Rust for code search. I previewed it in
Chrome, which uses some Rust today and may start having more tomorrow. It's
hosted on Vercel, which uses Rust in projects like turbopack, though maybe not
in the critical path for this post. When you read it, the bytes probably passed
through CloudFlare, which uses a ton of Rust, and maybe you're reading this in
Firefox, which is about 12% Rust. And maybe you're on Asahi Linux, where the
GPU drivers are written in Rust. Rust has Made It, and is here to stay. And
the marketing we used got us here. So in some sense, it would be silly to
declare said messaging a failure.

However, I also wonder what else could have been. Could Rust have grown faster
with a different message? Maybe. That said, what would that message be?
"Undefined behavior is scary?" I'm not sure that's as compeling, even if I think
it's actually a bigger deal. While memory unsafety is only part of undefined
behavior, it is the part that is easy to understand: pointers are the bane of
every C newbie. It has consequences that are easy to understand: security
vulnerabilites are bad. Has Rust *really* conflated "memory safety" and "safety"
that much? I don't actually think so. People still talk about SQL injection,
about Remote Code Execution, about Cross Site Scripting. People don't *really*
believe that just because it's written in Rust, bugs are impossible. Sure you
can find a few comments on the internet as such, but the big organizations that
are using Rust for meaningful work do not take this position. Given [Amdahl's
Law](https://en.wikipedia.org/wiki/Amdahl%27s_law), if 70% of security
vulnerabilities are related to memory safety, focusing so strongly on it makes
sense, as fixing that will give you a much larger impact than other things.

So what should new langauges do here? Well, pretty much the only language that
is gaining developer mindshare that's new and is memory unsafe by default is
Zig. I think Andrew is very sharp, and a tremendous engineer. I am very
interested to see how things shake out there. But as a language, it does not
appeal to me personally, because I think we've sort of moved past "unsafe by
default." That being said, it's also not that Zig is exactly like other
languages in this space either: if we are willing to go beyond "memory unsafe vs
memory safe at compile time" as a strict binary, and instead look at "memory
unsafe at compile time" itself, we see a pretty big gradient. Zig is doing a
bunch of things to mitigate issues where possible. Maybe "safe enough" truly is
safe enough. Time will tell. But beyond that, you also don't have to go full
Rust in the design space. Rust wants to be a language that you can (and at
Oxide,  we do) use at the lowest levels of the system. But also memory safe.
And extremely fast. These constraints mean that Rust takes on a lot of
complexity in the type system, where languages that are willing to relax these
things wouldn't have to. Here are three languages that I think are sort of
"post-Rust" in a sense, that are learning from Rust but putting their own
twist on things:

* [Hylo](https://www.hylo-lang.org/) (formerly Val) tries to, in their own words,
  "strengthens [value semantics], while de-emphasizing reference semantics".
  This lets them avoid a lot of Rust's complexity. Hylo looks more explicitly
  to Swift than Rust for positive inspiration in many cases, but I'm including
  it here anyway, as I've sort of ended up not talking about Swift in this post.
* [Austral](https://austral-lang.org/) is "if affine types are good for systems
  programming, linear types are even better." Austral also believes that parsimony
  is a virtue in language design, and that linear types can replace a lot of
  different features in other programming languages, while also eschewing other
  features that they deem as not carying their weight.
* [Mojo](https://www.modular.com/max/mojo), "the usability of Python with the
  performance of C." It also has this sort of "lower into a more complex language"
  idea; you can Just Write Python for the most part and it works, but if you want
  to get fancier, you can. [Lifetimes are a current
  proposal.](https://github.com/modularml/mojo/blob/main/proposals/lifetimes-and-provenance.md)

I think there are some other languages that are forming the next big cohort of
programming languages, and they're interesting too, but these two I think have
the most explicit connection to Rust in the design and goals of the language
itself. Shout out to Nu, Inko, Gleam, Roc, Oil Shell, Unison, and others. Lots
of cool stuff going on.

## int atexit(void (*func)(void))

There is one way in which the question "is the focus on memory unsafety
misguided?" is much more serious than battles in the comment sections of
various fora: the government.

We talked about this earlier, but various government organizations have been
slowly putting out recommendations that organizations should be moving towards
MSLs. And the first reactions to these were always "well they're not laws so
they don't have teeth" as well as "laws are inevitably coming." To be honest,
I have mostly been in the former camp, and viewed the later as fearmongering.
Sure, maybe someday, but like, dipping your toes in does not mean that you're
about to cannonball moments later.

But then I got [this interesting reply from David Tolnay on Hacker
News](https://news.ycombinator.com/item?id=38700267). In it, he refers me to
[ADSP: The Podcast](https://adspthepodcast.com/about/), and more specifically,
[Episode 160: Rust & Safety at Adobe with Sean
Parent](https://adspthepodcast.com/2023/12/15/Episode-160.html). In it, Sean
makes reference to two pieces of legislation, [one in the
US](https://www.congress.gov/bill/118th-congress/house-bill/2670)
 and [one in
the EU](https://digital-strategy.ec.europa.eu/en/library/cyber-resilience-act).
Now, I am not a politican, and these bills are huge, so I wasn't able to figure
out how these bills do this specifically, but to quote Sean:

> The one in the U.S. that's pending basically says that the Department of
> Defense is going to within 270 days of the bill passing (and it's a funding bill
> which means it will probably pass late this year - early next year) that the
> Department of Defense will establish guidelines around safety and security
> including memory safety for software products purchased by Department of
> Defense. The E.U. has a similar wording in a bill that's slowly winding its way
> through their channels. I don't have insight into when that will pass. The U.S.
> one will almost certainly pass here within a month or two.

This sounds much more realisitic, of course. Now, this does not mean that
C++ is outlawed or something silly like that, but it does mean that using Rust
could become a more serious competitive advantage when it comes to selling to
government: if you don't need an exception for your product, that's an advantage
over a product which does.

This all also may go the way of another anecdote Sean talks about in the past:
when a similar bill tried to mandate POSIX compliance. What I'm saying is, go
listen to the podcast. And while this still isn't something as wild as "not
using MSLs is illegal," it is really shocking to me how quickly things seem to
be moving in that vague direction, though of course it will never actually
arrive there. There seems to be at least some sort of thinking that's not
immediately lauged out of the room that memory unsafety could be a consumer
safety issue in a similar sense that other unsafe materials are a consumer
safety issue. Is that right? I'm not sure, but it seems to be where the
conversation is heading.

So where does that leave existing widely used memory-unsafe languages? Well,
the C++ community has... had a wide variety of discussions on this topic. I
should also say I mean "community" at large, and the comittee feels like it
has a big divide as well. Now I should re-iterate that while I pay attention to
the C++ standardization process, I am very much an outsider: I have never
attended a meeting, I have no direct involvement in these things, I just read
a lot. And while historically most of the community wrote Rust off as a novelty,
I think that at this point, those with their head in the sand about Rust's usage
are mostly a fringe minority. But the big question that remains is, what to do?

Two approaches have appeared:

* Improve the safety of C++ in some fashion.
* Create a "successor language" that will fix C++'s problems.

What is interesting to me about these approaches is that they are both good,
for different reasons. The former is a sort of harm reduction approach: don't
let the perfect be the enemy of the good. [What can we do today to improve the
lives of a ton of
people?](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2023/p3023r1.html)
But if you want to move into the realm of an MSL, you have to break backwards
compatibility. This is tantamount to just doing #2 in the first place, and so
some are cutting straight to that approach. But if we look at it in a slightly
different way, an interesting thing happens:

* breaking backwards compatibility vs not
* memory safety by default vs not

This leads to four approaches:

* We do not break backwards compatibility, and we ignore the memory safety
  issue (this is the 'do nothing' option).
* We do not break backwards compatibility, but we try to make things as memory
  safe as possible given the constraints we have.
* We break backwards compatibility, and we try to make things as memory safe as
  possible but still remain unsafe.
* We break backwards compatibility, and we become memory safe by default.

The first option is seemingly untenable, but is also where I see C heading.
There's seemingly not nearly as much desire for movement in the C space as the
C++ space, even though I am following what JeanHeyd Meneide is doing and
appreciate it.

The second option is how I view at least one of the possible C++ successor
languages, [Circle](https://www.circle-lang.org/). Circle is incredibly
interesting and is worth its own post. But in short, it is a C++ compiler that
also implements a lot of extensions, both ones that are proposals in the
committee, but also ones that its author is interested in. He has been doing
lifetime experiments.

The third option is where the most famous successor languages live:
[Carbon](https://github.com/carbon-language/carbon-lang) and
[cpp2](https://github.com/hsutter/cppfront). I haven't gotten to spend a ton of
time with either of these yet, but they explicitly aim to do to C++ what C++ did
to C, or what TypeScript did to JavaScript: create a new language for new code,
while allowing you to use the older language for older code. This allows them
to break backwards compatibility more easily: new code can more easily be
written under the new constraints. This gives them a larger degree of freedom
to make changes, which may be neccesary to move the needle significantly on
the safety issue. But to my knowledge, they do not attempt to be memory safe
by default. They're conceptually similar to Zig in this way.

But what about a fourth option? What if someone did a TypeScript for C++, but
one that was closer to what Rust does? You might argue that this is basically
just Rust? (Interestingly, it is also sort of what Zig is with C: you can use
the same compiler to compile a mixed codebase, which is close enough in my
opinion.) What makes me worry about option #3 is that it doesn't pass the
seeming test that is coming: memory safe by default. I still think moving
to a #3 style soltuion is better than staying with #1, but is that enough?
I don't know, time will tell. I wonder to what degree you can get "C++ but memory
safe" without just being Rust. As we talked about earlier, most languages that
are trying to improve on Rust in this space are willing to trade off some core
constraints on Rust's design to get them, but C++ and Rust share the same
constraints. That said, it would take a tremendous amount of hubris to declare
that Rust is the final, ultimate, best language in the "memory safe without GC"
space. Rust has made a lot of mistakes too. Maybe reflecting on those will make
for a good twelth year post. Someone get started on Rust++, please!

The reason that today is my Rust-a-versary is that I usually play with a new
language over Christmas break, and in 2012, that language was Rust. Maybe this
Christmas I'll give cpp2 a try.

In the final minutes before publishing this, I also found another [interesting
report](https://www.cisa.gov/sites/default/files/2023-12/CSAC_TAC_Recommendations-Memory-Safety_Final_20231205_508.pdf).
This is a report to the CISA director by the Technical Advisory Council on
how to engage with the memory safety question. Rust has 17 mentions. I haven't
read it yet, but I figured I'd include it here.
