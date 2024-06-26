---
title: "Rust-y Scraps: iterating with a step"
pubDate: 2013-05-30
blog: literate-programming
---


This blog post works with [Rust](http://rust-lang.org/) v 0.6, and may change in the future :).

A common need in various algorithms is to iterate with some sort of step. A simple way to do this in Rust is with `unit::range_step`:

```
let nums = [1,2,3,4,5,6,7];
for uint::range_step(0, bytes.len() - 1, 2) |i| {
    println(fmt!("%d & %d", nums[i], nums[i+1]));
}
```

This yields

```
1 & 2
3 & 4
5 & 6

```

Of course, this is awkward: I wish I had some code to do something like:

```
let nums = [1,2,3,4,5,6,7];

for nums.in_groups |i, j| {
  println(fmt!("%d & %d", i, j));
}
```

But I think this is just out of my abilities. The issue is that the closure needs to take the same number of arguments as the step, and I’m not sure that I have the Rust-fu to make it work yet.

After a discussion in the IRC room, Rust doesn’t have the Rust-fu yet either; varargs aren’t there, so this style is a no-go for now.

---

Oh, and since there were no examples of this yet, [I added some to the docs](https://github.com/mozilla/rust/pull/6841).
