---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Rust is surprisingly expressive"
pubDate: 2013-12-28
blog: words
---


Do you remember the first time you saw Rails’ ActiveSupport library? I do: it totally blew my mind. The only dynamic language I had used up to that point was Perl, and it had a similarly mind-blowing effect on my young self. I thought that dynamic typing was mostly a requirement towards making this kind of expressiveness possible, but it turns out Rust can be just as expressive, while retaining type safety and static dispatch.

There was a time in the early days of Rails when its evangelists would show off snippets of what it let you do. These were often ActiveSupport extensions to the core language itself. It’d go something like this:

> Hey, have you tried Rails? Check this out:
> 

```
irb(main):002:0> Time.now - 2.days
=> 2009-12-26 09:57:02 -0800
irb(main):003:0> 2.days.ago
=> 2009-12-26 09:57:04 -0800
```

> Did I just blow your mind???
> 

At the time, I enthusiastically replied “Yes, yes you did!” and immediately typed `rails new foo`. And all was well and good in the world.

Fast forward a few years. I now know that static typing is not equivalent to `public static void main(String [] args) {`. I’ve seen the [Hindley-Milner](http://www.cafepress.com/mf/2498088/what-part-of-types-dont-you-understand_tshirt?shop=skicalc&productId=6225368) light. Yet, for all practical purposes, I’ve still been hacking in Ruby for these past few years. For the most part, I’d found the complaints about dynamic typing from the static typing camp to be very FUD-y. I very rarely get `TypeError`s in my Ruby code. Refactoring generally isn’t very difficult.

But slowly, this has started to change. I think that it’s that I tend to do more infrastructure and plumbing work now. I’ve run into more and more situations where types would be helpful, or picking the mutable state path has caused headaches.

Then, I wake up to an IM from [Yehuda](http://twitter.com/wycats):

> bro, did you see my tweets?
> 

Basically, this:

```
➜  active_support git:(master) cat main.rs
extern mod active_support;
use active_support::Period;
use active_support::Time;

fn main() {
  let time = Time::now();
  println!("{:?}", time);
  println!("{:?}", 2.days().from_now());
  println!("{:?}", 2.weeks().from_now());
  println!("{:?}", 2.months().from_now());
  println!("{:?}", 2.years().from_now());
}
➜  active_support git:(master) ./main 
active_support::time::Time{date: active_support::date::Date{year: 2013, month: 12u, day: 28u}, hours: 0u, minutes: 59u, seconds: 6u, nanos: 242647081u}
active_support::time::Time{date: active_support::date::Date{year: 2013, month: 12u, day: 30u}, hours: 0u, minutes: 59u, seconds: 6u, nanos: 243287552u}
active_support::time::Time{date: active_support::date::Date{year: 2014, month: 1u, day: 11u}, hours: 0u, minutes: 59u, seconds: 6u, nanos: 243347757u}
active_support::time::Time{date: active_support::date::Date{year: 2013, month: 2u, day: 28u}, hours: 0u, minutes: 59u, seconds: 6u, nanos: 243388962u}
active_support::time::Time{date: active_support::date::Date{year: 2015, month: 12u, day: 28u}, hours: 0u, minutes: 59u, seconds: 6u, nanos: 243427393u}
```

Whaaaat? Yup. To compare side-by-side:

```
# Ruby
2.days.from_now
// Rust
2.days().from_now()
```

Awesome. Please note that in Rust, this is fully type-checked, safe, and *statically dispatched*. No slow reflection techniques used here!

Now, I should say that I almost *never* use `2.days`, but the point is that it’s a benchmark of expressiveness: if you can write it, you can do all sorts of other flexible things. Thinking back to my ‘libraries vs. application code’ confusion over types, I’m reminded by something [Gary Bernhardt](https://twitter.com/garybernhardt) once said about Ruby vs. Python. I’m paraphrasing, but as I remember it:

> Python is a beautiful, clean language. But the same restrictions that make it nice and clean mean that it’s hard to write beautiful, clean libraries. Ruby, on the other hand, is a complicated, ugly language. But that complexity allows you to write really clean, nice, easy-to-use libraries. The end result is that I prefer Python the language, but I find myself preferring programming with Ruby.
> 

I’m starting to wonder if maybe I feel the same way about static vs. dynamic typing: I like the simplicity and the speed of programming in a dynamic language, but maybe, given the right static language, I’ll end up preferring to program in $LANGUAGE better.

And that language might just be Rust.

---

You can check out Yehuda’s [rust-activesupport on GitHub](https://github.com/wycats/rust-activesupport), if you’d like to see how this is accomplished. He’s also told me that he will write a post explaining its implementation in technical detail, I’ll link to it here when he’s written it.
