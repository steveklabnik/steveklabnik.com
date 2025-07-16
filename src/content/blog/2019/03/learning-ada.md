---
title: "Learning Ada"
pubDate: 2019-03-26
blog: words
---


I decided to try and learn Ada. I love programming languages. This post documents my attempt, and explains what I learned. This is pretty stream of consciousness and basically is a bunch of random notes, so if you hate that, better close the tab. I typed my thoughts up pretty raw, so I may be incorrect in places too. Let me know if you know the answer to something I don’t!

---

The first step, of course, is to google:

![https://svbtleusercontent.com/72NhELV1orufu8jasf5iiT0xspap_small.png](https://svbtleusercontent.com/72NhELV1orufu8jasf5iiT0xspap_small.png)

Great! I know that Adacore are sort of the stewards of Ada? Vaguely, that might be wrong. Let’s look at all three of those.

> Learn.adacore.com is an interactive learning platform designed to teach the Ada and SPARK programming languages.
> 

Ah, that’s awesome! No installation needed.

The second one looks **extremely** like spam. It does have a page of learning materials that look legit enough. I wonder if this is a low-effort attempt to make money through ads. Or maybe it’s actually good and real and feels outdated, it does have a high google ranking. Upon doing some more research, it seems like the latter. Oops…

The third one is a parked domain, it apparently expired. Oops.

Anyway, I’m going to pursue learn.adacore.com

## learn.adacore.com

Here’s the initial code presented:

```
with Ada.Text_IO; use Ada.Text_IO;

procedure Learn is

   subtype Alphabet is Character range 'A' .. 'Z';

begin

   Put_Line ("Learning Ada from " & Alphabet'First & " to " & Alphabet'Last);

end Learn;
```

Okay! This clearly has some style to it. Seems like `Pascal_Snake_Case`. I’m not super hyped about this, but it’s fine. Syntax discussions are like the tabloids of programming language discussion. They’re fun, but they don’t really have any educational comment. One thing I will point out: are apostrophes used for method calls? Otherwise, this seems to be fairly Pascal like, which I think makes sense given what I know about Ada.

I can click run and see it execute right there! Awesome.

There seems to be three sections here: About, Courses, and Books. About is a single page of information that reinforces what I already know:

> The Ada programming language was designed from its inception to be used in applications where safety and security are of the utmost importance.The SPARK programming language is a formally verifiable subset of the Ada language which allows developers to mathematically prove program correctness through static means.Founded in 1994, AdaCore is the leading provider of commercial and open-source software solutions for Ada
> 

Cool.

There are two courses, introduction to Ada, and introduction to SPARK. I think SPARK is cool but I’ll learn that after I learn Ada itself. I also do like books, but let’s do that first.

I’m not going to write everything about the book as I read it, but I will say that I like the basic structure here: first some history, then imperative programming stuff, then talking about types. After that it gets into packages, more type stuff, privacy, generics, exceptions, tasks, interfacing with C, the standard library, and some appendices. This feels pretty logical. Time to do some reading, I’ll jump back here at random points with notes.

> The first Ada standard was issued in 1983; it was subsequently revised and enhanced in 1995, 2005 and 2012, with each revision bringing useful new features.
> 

I heard that Ada 2020 is a thing; seems like they’re on a roughly 7-8ish year timeframe generally. Cool.

> In terms of modern languages, the closest in terms of targets and level of abstraction are probably C++ and Rust.
> 

We got a shout-out! That’s nice.

> Readability is more important than conciseness. Syntactically this shows through the fact that keywords are preferred to symbols, that no keyword is an abbreviation, etc.
> 

This is interesting; it seems to suggest that readability and verbosity are synonymous. I often find concise things easier to read, personally. This is, of course, subjective, and I wonder how I’ll feel after I learn more of the language.

> Ada is a multi-paradigm language with support for object orientation and some elements of functional programming, but its core is a simple, coherent procedural/imperative language akin to C or Pascal.
> 

This makes a lot of sense, especially given the time it was created.

I’m finding it a *little* hard to understand what `main` is. The docs say

> Greet is a procedure, and the main entry point for our first program. Unlike in C or C++, it can be named anything you prefer. The builder will determine the entry point. In our simple example, gprbuild, GNAT’s builder, will use the file you passed as parameter.
> 

It will use it as … parameter? Like, is the fact that we called the file `greet.adb` the reason it calls `Greet`? It’s not clear to me at the moment.

> Integer’Image is a function that takes an Integer and converts it to a String. It is an example of a language construct known as an attribute, indicated by the “’” syntax, which will be covered in more detail later.
> 

Ah, it’s not a method call, it’s an attribute.

> In Ada, an integer type is not specified in terms of its machine representation, but rather by its range. The compiler will then choose the most appropriate representation.
> 

Very interesting. I wonder how well-defined these mappings are, for example, if you need to call a C function, you’re gonna need to give it the correct sized type… I’m sure I’ll get to that.

> Mainly for efficiency reasons, while machine level overflow always results in an exception, type level overflows will only be checked at specific boundaries, like assignment:
> 

Okay, *this* is the good stuff. Ranged integers are something people always say Ada is better at than Rust; I wondered if this was a static or dynamic check. It *is* a dynamic check. Cool. I’ve always wanted to know!

> As mentioned previously, every “built-in” type in Ada is defined with facilities generally available to the user.
> 

Pretty cool!

> While unconstrained arrays in Ada might seem similar to variable length arrays in C, they are in reality much more powerful, because they’re truly first-class values in the language. You can pass them as parameters to subprograms or return them from functions, and they implicitly contain their bounds as part of their value. This means that it is useless to pass the bounds or length of an array explictly along with the array, because they are accessible via the ’First, ’Last, ’Range and ’Length attributes explained earlier.
> 

Awesome. This is the way to do it, for sure.

> Here is how the string type is defined in Ada:type String is array (Positive range <>) of Character;
> 

Hmm, what’s a `Character` though? Let’s try to mess with the example:

```
with Ada.Text_IO; use Ada.Text_IO;

procedure Greet is
   Message : String (1 .. 2) := "😊";
   --        ^ Pre-defined array type.
   --          Component type is Character
begin
   for I in reverse Message'Range loop
      --    ^ Iterate in reverse order
      Put (Message (I));
   end loop;
   New_Line;
end Greet;
```

Here’s the output:

```
Run...
greet.adb:4:04: warning: "Message" is not modified, could be declared constant
greet.adb:4:33: warning: wrong length for array of subtype of "Standard.String" defined at line 4
greet.adb:4:33: warning: "Constraint_Error" will be raised at run time
raised CONSTRAINT_ERROR : greet.adb:4 length check failed
```

Hm, wrong length. What is the right length? This particular emoji is four bytes, so let’s try to set it to 5, since we start at 1. Nope that doesn’t work either. What about 4?

```
Run...
the machine running the examples is not responding, please try again later
```

Very suspicious. Anyway, I’m guessing it’s ASCII, maybe it’ll tell me later.

> One last feature of Ada arrays that we’re going to cover is array slices. It is possible to take and use a slice of an array (a contiguous sequence of elements) as a name or a value.
> 

Hell yeah, I love slices.

> Ada has multidimensional arrays, which are not covered in this course. Slices will only work on one dimensional arrays.
> 

Ah, bummer. I guess I’ll have to read up on those separately.

> Returning variable size objects in languages lacking a garbage collector is a bit complicated implementation-wise, which is why C and C++ don’t allow it, prefering to depend on explicit dynamic allocation / free from the user.The problem is that explicit storage management is unsafe as soon as you want to collect unused memory. Ada’s ability to return variable size objects will remove one use case for dynamic allocation, and hence, remove one potential source of bugs from your programs.Rust follows the C/C++ model, but with safe pointer semantics. However, dynamic allocation is still used. Ada can benefit from an eventual performance edge because it can use any model.
> 

Hmmm, I wonder *how* it is doing this. Doesn’t that still dynamically allocate in Ada?

> Ada doesn’t have a tuple construct and does not allow returning multiple values from a subprogram (except by declaring a full-fledged record type). Hence, a way to return multiple values from a subprogram is to use out parameters.
> 

I love tuples, oh well.

> While reading an out variable before writing to it should, ideally, trigger an error, imposing that as a rule would cause either inefficient run-time checks or complex compile-time rules. So from the user’s perspective an out parameter acts like an uninitialized variable when the subprogram is invoked.
> 

Hmmmmmmmmmmmmmmmmmm. This seems *extremely* against Ada’s safety focus.

```
with Ada.Text_IO; use Ada.Text_IO;

procedure Outp is
   procedure Foo (A : out Integer) is
   begin
      Put_Line (Integer'Image (A));
   end Foo;
   A : Integer := 12;
begin
   Foo(A);
end Outp;
```

gives

```
Run...
outp.adb:4:19: warning: formal parameter "A" is read but never assigned
outp.adb:10:08: warning: "A" modified by call, but value might not be referenced
32514
2 errors.
```

Each time I run it, I get a different number. Seems bad?

> There are two ways in which Ada helps shield programmers from the dangers of pointers:One approach, which we have already seen, is to provide alternative features so that the programmer does not need to use pointers. Parameter modes, arrays, and varying size types are all constructs that can replace typical pointer usages in C.Second, Ada has made pointers as safe and restricted as possible, but allows “escape hatches” when the programmer explicitly requests them and presumably will be exercising such features with appropriate care.
> 

Seems great! I’m very here for this.

… but they have `null`. Of course they do, given the timeframe Ada was developed. Oh well.

Okay, so `new` is a keyword, and is in the language. But freeing is an unsafe standard library API? I guess this makes sense, similarly to how leaking memory isn’t unsafe in Rust. Feels weird, though.

I guess, reading more, the idea is that you should basically never need to do this yourself. I think this is where I was getting caught up earlier with the “return an unknown type” bit too. It *is* allocating, but since you’re not typing `new`, you’re not responsible, and so that’s safer. That makes sense. I hope my understanding is correct here, but I’m not totally sure.

This does mean that it feels like allocations exist, but are hidden from you, the user. That’s okay, but it’s very different than Rust.

> Ada’s variant records are very similar to Sum types in functional languages such as OCaml or Haskell. A major difference is that the discriminant is a separate field in Ada, whereas the ‘tag’ of a Sum type is kind of built in, and only accessible with pattern matching.There are other differences (you can have several discriminants in a variant record in Ada). Nevertheless, they allow the same kind of type modeling as sum types in functional languages.
> 

This is pretty cool.

The “Character Types” section still does not explain to me what valid characters are. Oh well. Googling it gives me [this](https://www.adaic.org/resources/add_content/standards/05rm/html/RM-3-5-2.html) which says

> The predefined type Character is a character type whose values correspond to the 256 code positions of Row 00 (also known as Latin-1) of the ISO/IEC 10646:2003 Basic Multilingual Plane (BMP). Each of the graphic characters of Row 00 of the BMP has a corresponding character_literal in Character. Each of the nongraphic positions of Row 00 (0000-001F and 007F-009F) has a corresponding language-defined name, which is not usable as an enumeration literal, but which is usable with the attributes Image, Wide_Image, Wide_Wide_Image, Value, Wide_Value, and Wide_Wide_Value; these names are given in the definition of type Character in A.1, “The Package Standard”, but are set in italics.
> 

Ah. Yeah so that’s why the emoji didn’t work. Did that crash the compiler earlier, is that what was happening?

> Generic subprograms or packages can’t be used directly. Instead, they need to be instantiated, which we do using the new keyword, as shown in the following example:
> 

Wait, is this the same `new` keyword as before? Do generics require heap allocation? That is a reasonable design, I’m just a bit surprised.

> Ada exceptions are not types, but instead objects, which may be peculiar to you if you’re used to the way Java or Python support exceptions.
> 

I found this sentence confusing; aren’t the objects in Java or Python as well? When I was reading this sentence, halfway through, I thought to myself “oh, like the stuff I know, cool” and then the second half was “this is unlike the stuff you know”. Hrm.

> A task can be thought as an application that runs concurrently with the main application. In other programming languages, a task can be called a thread, and tasking can be called multithreading.
> 

Cool, this is a big topic I’ve been wondering about.

> As we’ve just seen, as soon as the main task starts, its subtasks also start automatically. The main task continues its processing until it has nothing more to do. At that point, however, it will not terminate. Instead, the task waits until its subtasks have finished before it allows itself to terminate.
> 

Ah interesting, this is different than Rust. Well, Rust’s standard library, anyway.

I wish it explained if tasks *are* system threads, or if they’re green threads.

I did some googling, and apparently this is implementation-defined. GNAT uses system threads for some of the same reason that Rust decided to expose system threads. Seems good.

> The pragma Assertion_Policy statement is used to force the compiler to generate code to check the precondition.
> 

Design by contract works at runtime. This is something I always thought was true, but was never actually sure of. Cool.

> To interface with C’s built-in types, we use the Interfaces.C package, which contains most of the type definitions we need. For example:
> 

Ah ha, this answers my question from earlier. Cool.

> Object-oriented programming (OOP) is a large and ill-defined concept in programming languages and one that tends to encompass many different meanings because different languages often implement their own vision of it, with similarities and differences from the implementations in other languages.However, one model mostly “won” the battle of what object-oriented means, if only by sheer popularity. It’s the model used in the Java programming language, which is very similar to the one used by C++. Here are some defining characteristics:
> 

Spicy! But not incorrect.

Dot notation exists! But only if you’re actually using objects, er, “tagged types”.
