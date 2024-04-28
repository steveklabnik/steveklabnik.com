---
title: "Community Versions for Rust"
pubDate: 2015-08-23
blog: words
---


[Rust](http://www.rust-lang.org/) has been through a *lot* of changes in recent years. As such, tutorials get out of date. We’ve occasionally said that including `rustc -v` in your blog posts would be helpful, but today, I saw this tweet go by:

> Tired of guessing what versions of Ember work with a given blog post? Check out http://t.co/6joJiNdJQ5 #feedbackplz pic.twitter.com/YToBduBVtx
— mixonic (@mixonic) August 23, 2015
> 

After some quick hacking, I’ve modified it to work with Rust. You can find the project here: [https://github.com/steveklabnik/rust-community-versions](https://github.com/steveklabnik/rust-community-versions)

TL;DR: Put this into your blog post, substituting the appropriate date and title:

```
<iframe
  width="178" height="24" style="border:0px"
  src="http://steveklabnik.github.io/rust-community-versions/2013/10/18/pointers-in-rust-a-guide.html">
</iframe>
```

Then, make a [pull request](https://github.com/steveklabnik/rust-community-versions/pulls) adding a new post with some front-matter:

```
---
layout: post
url: http://words.steveklabnik.com/pointers-in-rust-a-guide
title: "Pointers in Rust: a Guide"
date: 2013-10-18
start_version: 0.8
end_version: 0.9
---
```

(`end_version` is optional)

And bam! You get a nice looking badge. Check out out on this blog post of mine: http://words.steveklabnik.com/pointers-in-rust-a-guide

What’s nice about this approach is that, if your post ever gets out of date, someone else can modify the YAML in the repo, and your badge will automatically update to include the end date. No remembering to go back and fix it.

Let’s see how this goes!
