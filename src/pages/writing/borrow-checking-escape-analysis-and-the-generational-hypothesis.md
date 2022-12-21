---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Borrow checking, escape analysis, and the generational hypothesis"
pubDate: 2018-10-10
blog: words
---


There’s a fairly common argument that pops up on programming forums, and it’s about the nature of what “garbage collection” means. In the research world, [this](http://www.memorymanagement.org/glossary/g.html#term-garbage-collection) is what GC means:

> Garbage collection (GC), also known as automatic memory management, is the automatic recycling of dynamically allocated memory(2). Garbage collection is performed by a garbage collector which recycles memory that it can prove will never be used again. Systems and languages which use garbage collection can be described as garbage-collected.
> 

Historically, there has been two major forms of GC: reference counting, and tracing. The argument happens because, with the rise of tracing garbage collectors in many popular programming languages, for many programmers, “garbage collection” is synonymous with “tracing garbage collection.” For this reason, I’ve been coming around to the term “automatic memory management”, as it doesn’t carry this baggage.

---

I’ve often seen people make statements like this one, from the Rust subreddit this morning:

> Manual memory management requires more work than garbage collected. Its a trade off of course to be more performant or use lower resources. When and where should Rust be used or not used according to you?
> 

While I don’t *completely* disagree with this sentiment, it’s also never quite sat right with me. Yes, Rust is a bit harder *at the start*, but once you get over a hump, I don’t generally find writing Rust to be significantly harder than using a GC’d language. I’ve been trying to figure out why that is.

> The idea that it’s easy for me because I’m an amazing programmer is not an answer I’m willing to accept here, both because I don’t think that’s particularly true, but also because I’ve seen Rust have a pretty wide appeal to a fairly large group of people, and they can’t all be amazing programmers. It’s just math.
> 

---

My first clue comes from my own programming history. Some of my first programming languages were C, C++, and Java. These languages are *statically* typed, that is, they require you to declare (or have inferred) the type of variables up front, and check that the type holds. That is, they’re known at compile time. I can remember the first time I came across Perl, and the concept of dynamic typing. Wow, this is *so much easier*! I could do *anything*. From then on, I pretty much focused on dynamically typed languages.

While doing my work in Ruby, one thing I worked hard on was testing. Rubyists are big on tests; with a language that’s *so* dynamic, you really need them to make sure your stuff is working properly.

When I decided to start writing a bunch of Rust, I had to get used to using static types again. But I also wrote less tests. Many of the things that I was testing for were things that were taken care of by the type system. In other words, my tests were sort of like “dynamic type checking.” Instead of being checked by a compiler at compile-time, these behaviors of my system were checked at run time, by my tests. This isn’t a novel insight; many others have stated this relationship between tests and types.

We often acknowledge that writing tests is a *skill*. When I first started with Ruby, I was bad at testing. I got better with practice. But I don’t think we collectively acknowledge that working with types is *also* a skill. At first, it’s tough. But as you develop those skills, it becomes easier and easier.

---

Let’s switch gears a little, to garbage collection.

In garbage collection research, there’s a term, the [“generational hypothesis”](http://www.memorymanagement.org/glossary/g.html#term-generational-hypothesis). It states

> In most cases, young objects are much more likely to die than old objects.
> 

If that succinct description doesn’t make sense, here’s a slightly longer one: there’s a kind of GC called a “generational garbage collector.” There are a few options when implementing one, but I’m going to describe one form in particular. What it does is this: new objects are allocated in a section of memory called the “nursery,” an analogy to where human children go shortly after they’re born. When the GC runs, it looks through the nursery. Any objects that survive are promoted to a new section of memory. Some collectors may have multiple of these “generations.” The generational hypothesis states that most objects die in the nursery. The GC can then take advantage of this fact by scanning the nursery more often than the older generations, which allows you to not scan every object every collection.

Empirically, the generational hypothesis is true. But I haven’t seen much investigation into *why* it is true. That said, I’m also not a GC expert. If you have references here, please get in touch.

---

There’s another concept related to GCs called “escape analysis.” This is an optimization which several languages do. The idea is fairly straightforward: if something is declared in a function, and never leaves (“escapes”) that function, you don’t need to put the object on the heap, you can stack allocate it instead.

> “It isn't that the generational hypothesis isn't true for Go, it's just that the young objects live and die young on the stack.The result is that generational collection is much less effective than you might find in other managed runtime languages” #golang https://t.co/aXEleY2yQ6
— Dave Cheney (@davecheney) July 18, 2018
> 

If you squint a little at this tweet, you can almost think of escape analysis as a *stronger* version of the generational hypothesis. The claim is that escape analysis applies so often to Go code that any object that reaches the heap is effectively in the older generation.

Why is this? I’m not totally sure, but I have a feeling that is has to do with the core concept of functions and a call stack. Additionally, the value/reference type distinction. The more you program with values in functions, rather than references, the less likely objects are to escape past the call stack. in generational hypothesis terms, values allocated lower in the call stack tend to live longer, and ones higher in the call stack tend to live shorter.

---

There’s an interesting area of type research called “gradual typing.” The idea is that typing is not an either/or, static vs dynamic. It’s a spectrum. Some things are statically typed, some things are dynamically typed, and it all works together. The idea is that you can start off writing things that are dynamically typed, and then once you’re more sure of the behaviors you want, you can start to statically type them.

TypeScript is a great example:

```
// person is dynamically typed
function greeter(person) {
    return "Hello, " + person;
}

// person is statically typed
function greeter(person: string) {
    return "Hello, " + person;
}
```

TypeScript is really, really growing in popularity. I think one of those factors is the gradual typing; you can slowly work on your type-using skills, and you don’t have to use them everywhere.

---

Interestingly enough, many JIT compilers rely on the fact that in practice, programmers tend to pass the same types of things to functions, even if the language is dynamically typed. This is called [“type specialization”](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/). This is similar to the generational hypothesis to me, but in a different domain. And as I said about it, empirically, this is true. But I haven’t seen much investigation into *why* it is true. That said, I’m also not a JIT expert. If you have references here, please get in touch.

---

So what’s all this have to do with Rust?

Similar to the dichotomy between static and dynamic typing, I think that Rust is proving out a new niche in the concept of garbage collection. That is, historically, we think of GC as something *dynamic*, that is, it involves a run-time component that does stuff at runtime. However, the idea of automatic memory management doesn’t *inherently* mean that it has to execute at runtime.

> I should mention that C++ paved a lot of the path here too, so maybe the above is worded too strongly. I do think that Rust is significantly different here, but you may not. If you don’t, please replace the above with “Rust is continuing to prove out a niche pioneered by C++,” and that’s fine by me.
> 

This also opens up two more things about why I don’t feel that “Rust is too hard and so you should use a GC’d language when you can afford it.” First of all, Rust’s strong, static checking of memory provides me a similar peace of mind to a runtime GC. To make an analogy to types and tests, when I program in a language like C, I have to think a lot about the details of memory management, because I don’t really have anything at all checking my work. Its memory management is completely unchecked, similar to (compile time) types in a Ruby program. But with automatic memory management, I don’t have to worry about this, as the memory management system has my back. I won’t get a use after free, I won’t get dangling pointers.

I further think this line of thought is on the right track because lifetimes are generic types, and the ownership system is affine types.

---

This also relates to the “difficulty” of Rust. In the same way that learning to use static types takes time, learning to use static memory management takes time. But once you’ve developed that skill, you can rely on those static checks to free up your brain to instead focus on your program itself, and not the house-keeping tasks that these systems are checking for.

And, just like with static types, different people will make different choices of tradeoff for effort. Some people refuse to use dynamically typed languages, because they’ve invested the time into effectively using static types and prefer to have these things checked. Others don’t want to waste time on learning these kinds of things, and are more focused on shipping things. They have their own set of skills to ensure reliability. I think both approaches make sense depending on what you’re doing.

---

In some ways, you can think of the borrow checker as an even stronger form of escape analysis; that is, instead of saying “oh, this escapes, so allocate it on the heap”, the borrow checker says “oh, this escapes, so error at compile time.” For example, this code:

```
fn bar() -> i32 {
    5
}

fn foo() -> &'static i32 {
    &bar()
}
```

gives this error:

```
error[E0716]: temporary value dropped while borrowed
 --> src/lib.rs:6:6
  |
6 |     &bar()
  |      ^^^^^ creates a temporary which is freed while still in use
7 | }
  | - temporary value is freed at the end of this statement
  |
  = note: borrowed value must be valid for the static lifetime...
```

`bar()` produces a value, and so `&bar()` would produce a reference to a value on `foo()`’s stack. Returning it would be a dangling pointer. In a system without automatic memory management, this would cause a dangling pointer. In a system with dynamic automatic memory management, this would heap allocate the return value of `bar()`, so that everything works out. But Rust’s automatic memory management is fully static, and so it has to error in this situation.

---

Similar to gradual typing, this means that you can also have gradual GC. For example, Rust does have `Rc<T>` and `Arc<T>`, which are reference-counted types, clearly GC according to the literature. This moves the memory management from static to dynamic.

> I don’t think that the transition here is as seamless as in TypeScript, though that’s a whole other post… additionally, it’s not like gradual typing is perfect.
> 

---

One last thing before I go: the lifetime elision rules are also an empiric statement about how programmers write code, but I’m not sure what the underlying reasons are. From [the RFC](https://github.com/rust-lang/rfcs/blob/master/text/0141-lifetime-elision.md):

> We found that of the 169 lifetimes that currently require annotation for libstd, 147 would be elidable under the new rules, or 87%.
> 

If it were 100%, we could never require you to write annotations. But with 87%, we can let you not write annotations, and most code that follows most normal coding practices never needs to write explicit lifetimes.
