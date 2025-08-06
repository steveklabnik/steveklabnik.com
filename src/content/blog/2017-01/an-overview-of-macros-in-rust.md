---
title: "An overview of macros in Rust"
pubDate: 2017-01-24
blog: words
---


Rust has had a lot of stuff going on with “macros”. There are a few, interconnected aspects of these features, many different names for the same thing, and a lot of development work going on. This post will give an overview of the past, present, and future of macros in Rust.

Ultimately, macros allow you to write things like this:

```
let map = hashmap!{
    "a" => 1,
    "b" => 2,
};
```

or

```
#[derive(Serialize, Deserialize)]
struct S {
    #[serde(rename = "a")]
    f: i32,
}
```

That is, some macros look like functions: `foo!`, but allow you to write nearly arbitrary syntax inside of the `()`s. Some let you control the ability to write custom attributes. Both generate some other kind of valid Rust code for the compiler to interpret. In the first case, the `hashmap!` macro will expand to a call to `HashMap::new` and a bunch of `insert` calls, and the second case, the `Serialize` and `Deserialize` traits will be automatically implemented for this struct, along with a bit of custom logic where the field `f` maps to the name `a` in the data that’s being {de,}serialized.

These features are extremely powerful, but also must be done right: metaprogramming is very useful, but can also make code inscrutable, or give poor error messages.

Oh, and I’d like to give a shout-out to [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html), which is basically *the* resource for doing this kind of work. If you are interested in writing macros, you should check it out.

## Pre-1.0

As Rust developed, two major forms of macros evolved. One was called “macros” and the other was called “compiler plugins”. Both of these systems were pretty good, but both of them also had a lot of problems. We’ll get into the details of each of these kinds of macros below, but there’s one thing we should talk about first. On the way to 1.0, it was decided to stabilize one kind of macros, but not the other. From [Stability as a Deliverable](https://blog.rust-lang.org/2014/10/30/Stability.html): (also, this uses some terms that we will cover shortly)

> After extensive discussion, we plan to release globs and macros as stable at 1.0. For globs, we believe we can address problems in a backwards-compatible way. For macros, we will likely provide an alternative way to define macros (with better hygiene) at some later date, and will incrementally improve the “macro rules” feature until then. The 1.0 release will stabilize all current macro support, including import/export.On the other hand, we cannot stabilize syntax extensions, which are plugins with complete access to compiler internals. Stabilizing it would effectively forever freeze the internals of the compiler; we need to design a more deliberate interface between extensions and the compiler. So syntax extensions will remain behind a feature gate for 1.0.Many major uses of syntax extensions could be replaced with traditional code generation, and the Cargo tool will soon be growing specific support for this use case. We plan to work with library authors to help them migrate away from syntax extensions prior to 1.0. Because many syntax extensions don’t fit this model, we also see stabilizing syntax extensions as an immediate priority after the 1.0 release.
> 

We’ll discuss in each section how this ended up working out, but it’s important to remember that only *one* form of these macros was available on stable Rust for 1.0, and in fact, as of the time of this writing. That’s going to change soon…

It’s also important to note that we weren’t entirely happy with macros. They were fine, but they have some flaws. We wanted to fix them, but we also didn’t want to ship 1.0 without macros. Language design is hard. I’ll talk about this more in the appropriate section.

## Declarative Macros

The first form of Macros in Rust, and the one that’s most widely used, are called “declarative macros”, sometimes “macros by example”, sometimes “macro_rules macros”, or sometimes just “macros”. At their core, declarative macros allow you to write something similar to a Rust `match` statement:

```
match x {
    4 => println!("four!"),
    5 => println!("five!"),
    _ => println!("something else"),
}
```

With `match`, `x`’s structure and value will be evaluated, and the right arm will execute based on what matches. So if `x` is five, the second arm happens. Etc.

These kinds of macros work in the same way: you set up some sort of pattern, and then, if that pattern matches, some code is generated. One important difference here is that in `match`, `x` gets evaluated. With macros, `x` does not get evaluated.

There are two kinds of declarative macros: ones defined with the `macro_rules!` keyword, and ones defined with the `macro` keyword.

### `macro_rules!`

These are most commonly known as “macros” in Rust world, and are the only thing that’s stable in Rust at the time of this writing. Here’s a macro you’ll see when using Rust:

```
let x: Vec<u32> = vec![1, 2, 3];
```

This macro creates a new vector, with three elements inside. Here’s what the macro could look like, written with `macro_rules!`:

```
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

Whew! That’s a bunch of stuff. The most important line is here:

```
    ( $( $x:expr ),* ) => {
```

This `pattern => block` looks similar to the `match` statement above. If this pattern matches, then the block of code will be emitted. Given that this is the only pattern in this macro, there’s only one valid way to match; any other will be an error. More complex macros will have more than one rule.

The `$x:expr` part matches an expression, and gives it the name `$x`. The `$(),*` part matches zero or more of these expressions. Then, in the body of the macro, the `$()*` part is generated for each part that matches, and the `$x` within is replaced with each expression that was matched.

These macros are fine, but there’s a number of bugs and rough edges. For example, there’s no namespacing: if a macro exists, it’s everywhere. In order to prevent name clashes, this means that you have to explicitly import the macros when using a crate:

```
#[macro_use]
extern crate serde;
```

Otherwise, you couldn’t import two crates that had the same macro name. In practice this conflict doesn’t come up much, but as we grow, it becomes more likely. The hygiene of `macro_rules` is there, but not perfect. (Only local variables and labels are hygienic…) Et cetera. The plan is that with the new macro systems, you’ll be able to use the regular module system, and use macros just like you use functions today.

Even with these problems, macros were useful enough to include in Rust 1.0. But plans for a better macro system were already being worked on, and so, they were given the name `macro_rules!` so that we could eventually deprecate all of this. This is one of the few features that we decided to do this with Rust 1.0; a vestigial thing that was always planned for obsolescence. Doing it hurts, but not having any metaprogramming at all would hurt much more.

### `macro`

As such, the `macro` keyword was reserved for a new macro system. We’re still not 100% sure if we’re calling these “macros by example” (which you’ll sometimes see with a “2.0” at the end) or “declarative macros”. I prefer the latter, because it pairs nicely with “procedural macros.” It seems like most agree with me. We’ll see.

These macros are an incremental improvement over the existing `macro_rules!` macros: they’re fundamentally the same thing, but with some nicer features.

At the time of this writing, [an initial RFC is in FCP](https://github.com/rust-lang/rfcs/pull/1584), laying out some high-level aspects of this feature. An initial implementation is underway, but it hasn’t landed yet, so you can’t use `macro` in real code yet.

## Procedural Macros

In opposition to the pattern-based declarative macros, the second form are called “procedural macros” because they’re functions: they accept some Rust code as an input, and produce some Rust code as an output. I say “code” but I don’t mean that literally; we’ll get into the exact details in each section.

### Syntax Extensions

Syntax extensions, also sometimes just called “procedural macros” or “compiler plugins”, were not stabilized for Rust 1.0. Here’s (part of) a syntax extension that implements roman numeral literals:

```
#![feature(plugin_registrar, rustc_private)]

extern crate syntax;
extern crate rustc;
extern crate rustc_plugin;

use syntax::parse::token;
use syntax::tokenstream::TokenTree;
use syntax::ext::base::ExtCtxt;
use rustc_plugin::Registry;

fn expand_rn(cx: &mut ExtCtxt, sp: Span, args: &[TokenTree])
        -> Box<MacResult + 'static> {
    // implementation goes here
}

#[plugin_registrar]
pub fn plugin_registrar(reg: &mut Registry) {
    reg.register_macro("rn", expand_rn);
}
```

You’d use it like this:

```
#![feature(plugin)]
#![plugin(roman_numerals)]

fn main() {
    assert_eq!(rn!(MMXV), 2015);
}
```

That is… a lot of code. And frankly, probably doesn’t even work on today’s Rust right now. Why not? Well, that’s the big problem with syntax extensions:

```
extern crate syntax;
extern crate rustc;
extern crate rustc_plugin;
```

This literally loads up bits of the Rust compiler and uses it as a library. Then, it uses Rust’s internal AST to do the processing. This is extremely powerful, but also extremely unstable. We don’t and can’t freeze Rust’s internal AST, or any of its other internal APIs, at least not at this time. Not to mention that this means any alternative Rust compiler would need to either use our AST or map ours to theirs, which puts a damper on alternative Rust implementations. This means that syntax extensions haven’t had a good path towards stability. It’s also why they couldn’t be made stable as-of Rust 1.0. But “run arbitrary Rust code to produce more Rust code” is a useful feature, and so, some projects needed them. In addition, while declarative macros can produce function-style `foo!` calls, they cannot do the custom attribute stuff. And those are very useful. We *could* make this work, but there hasn’t been a real reason to, nor much demand.

A side note: there’s also the term “compiler plugin.” Syntax extensions are a particular kind of compiler plugin; there are others, like lint passes, LLVM pass plugins, MIR plugins… we’re only talking about syntax extensions in this post, however.

The current plan is to never stabilize syntax extensions, and instead, stabilize “procedural macros.” Again, this isn’t for all compiler plugins, only syntax extensions.

### Procedural Macros

Accepted in [RFC 1566](https://github.com/rust-lang/rfcs/blob/master/text/1566-proc-macros.md), procedural macros will give you the same power as compiler plugins, without needing to reach into the guts of `rustc`. How? Well, they look like this:

```
#[proc_macro]
pub fn foo(TokenStream) -> TokenStream {
    // do stuff to implement the foo macro
}
```

This creates a `foo!` procedural macro. You’ll note that it accepts a `TokenStream` and produces a `TokenStream`. To quote the RFC:

> The first argument is the tokens between the delimiters in the macro use. For example in foo!(a, b, c), the first argument would be [Ident(a), Comma, Ident(b), Comma, Ident(c)].The value returned replaces the macro use.
> 

Why tokens? Well, while an AST can change, the actual tokens will not. This approach will allow us the flexibility to change `rustc`’s internal AST, while giving us the full power of compiler plugins.

So, how do you work with one of these kinds of macros? You can of course work with the token stream directly, but we also expect to see libraries that will provide easier-to-use interfaces on top of this. You could imagine a package that converts a `TokenStream` to its own AST, and then provides an interface to that AST. This is nicer to use than working with tokens directly. There are already some libraries that do similar kinds of things, like [syn](https://github.com/dtolnay/syn). More on that in a moment.

### Function-like vs attribute like

The above is for a macro that gives you a `foo!` macro, that is, one that looks like a function. What about one that gives you an attribute? That’d look like this:

```
#[proc_macro_attribute]
pub fn foo(Option<TokenStream>, TokenStream) -> TokenStream {
    // implementation goes here
}
```

To quote the RFC:

> The first argument is a list of the tokens between the delimiters in the macro use. Examples:#[foo] => None#[foo()] => Some([])#[foo(a, b, c)] => Some([Ident(a), Comma, Ident(b), Comma, Ident(c)])The second argument is the tokens for the AST node the attribute is placed on.
> 

Internally, it’s the same thing: use a `TokenStream`, produce a `TokenStream`.

### “Macros 1.1”

You may have also heard a lot of commotion about “Macros 1.1.” In fact, they will be stable as of the next release of Rust, 1.15. Macros 1.1 are the [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) applied to procedural macros: as it turns out, the vast majority of people who use procedural macros today use it for “custom derive”, that is, the ability to say `#[derive(MyTrait)]` and implement a trait automatically. As such, a plan was hatched: we could stabilize *just the very very very basics* of procedural macros, enough to get the ability to write custom derives, and stabilize that, without needing to implement everything. What does that look like? Here’s one that implements `#[derive(Double)]`

```
extern crate proc_macro;

use proc_macro::TokenStream;

#[proc_macro_derive(Double)]
pub fn double(input: TokenStream) -> TokenStream {
    let source = input.to_string();

    // Parse `source` for struct/enum declaration, and then build up some new
    // source code representing a number of items in the implementation of
    // the `Double` trait for the struct/enum in question.
    let source = derive_double(&source);

    // Parse this back to a token stream and return it
    source.parse().unwrap()
}
```

You’ll notice that this still looks like `TokenStream` -> `TokenStream`, but there’s something more subtle here: `input.to_string()`. That is, for Macros 1.1, `TokenStream` has two methods; all it has is the ability to be converted to a string, with the original Rust code inside of it, and a `parse` method, which can take a string of Rust code and produce another `TokenStream`. What you do with that `String` is your own business.

What most people will do is use [syn](https://github.com/dtolnay/syn) to parse the Rust code, and [quote](https://github.com/dtolnay/quote) to generate Rust code from that. These libraries will make it feasible to build real-world custom derive code, without us needing to stabilize anything we don’t want to. Of course, once full procedural macros are implemented, it’s not likely that people will want to turn `TokenStream`s into and parse `TokenStream`s from strings, but it’s not *totally* unheard of, and will be the tiniest wart. It’s worth it to move a significant chunk of the ecosystem onto the stable compiler.

For more details, see [RFC 1681](https://github.com/rust-lang/rfcs/blob/master/text/1681-macros-1.1.md).

### “Macros 1.2” ?

There’s also been some small talk about possibly doing a “macros 1.2”, that is, another step towards full procedural macros without needing the whole thing. This would be “procedural macros without hygiene”, though it’s still early days for this idea; there isn’t even an RFC yet. We’ll see if this happens. There’s still some controversy around this idea.
