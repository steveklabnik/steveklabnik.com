---
title: You're probably learning a technology in its seventh season, not its pilot
pubDate: 2023-01-27
blog: words
---

I first heard this adage in the Rails space. I don't know who to attribute this
to, but I also never wrote it down. So, time to write it down, and if you know
of the origin of this aphorism, let me know and I'd love to put it here!

I *think* that the first formulation of this sentiment goes something like this:

> Rails is like a soap opera. You're getting started with it in a later season.
> The cast of characters has already been established, there's a lot of history.
> You kinda just gotta dive in and go with the flow and catch up on older stuff
> at your leasure.

That's obviously a bit long, so I think I'll be using something like this
in the future:

> You're probably learning a technology in its seventh season, not its pilot.

I was thinking about this today because I happened to come across [this reddit post from a few months ago][reddit-post].

> > In fact, there is hardly any analysis of the downsides of Rust’s error model in the first place, which is quite disheartening.
> 
> Not really planning to add much to the convo, but back in mid 2019 when I first
> started learning and writing Rust, about half the posts I saw here in the
> subreddit were related to errors, how to do them right, how to minimize the
> boilerplate, and so on and so forth...
> 
> Over the last couple years, the convo has died down because we've all more or
> less agreed that the major pain points around error handling have been solved
> with a simple rule: thiserror for library code, anyhow for application code.
> 
> There's obvs still more things that can be done around error handling. try is
> one such example, along with standardizing thiserror and anyhow so its part of
> the stdlib.
> 
> But to say there is no discussion about Rust and it's error handling story is
> very dishonest imo as that discussion was raged for years before I saw it and
> only recently came to a proper conclusion for the majority of cases, and thus
> theres now much less talk about it. I even learned 3 different "defacto standard
> error libs" (that are all now defunct and no one cares about) out of a much
> longer list of them that came and went before them due to better and better
> patterns being being found over the years!
> 
> There was plenty of healthy and constructive discussion on this topic for an
> insanely long time and just because you didn't see it doesn't mean everyone was
> satisfied with the error handling story as it is in std from the 1.0 of Rust.
> Rust users actually engage with the system constantly, so ofc they'd discuss the
> problems with it and work towards fixing it! Hell, there's still people that
> prefer things other than thiserror and anyhow and thats part of why those havent
> been standardized yet too, and why there still might seem to be "no progress" on
> fixing things.
> 
> TL;DR: Rust developers use Rust's error handling literally all the time. Your
> assertion that they do not understand its shortcomings and pain points and
> refuse to even discuss them is weird given that there's been a multi-years long
> battle between all kinds of error handling crates that only recently resulted in
> a proper and clear winner.

[reddit-post]: https://www.reddit.com/r/rust/comments/xj2a23/comment/ipd6tcv/

Now, I don't want to take a position on the original thread, or what they have
to say, or if they actually *are* falling afoul of this aphorism. But I think
that this particular text shows the meaning of what I mean by "you're in the
seventh season" beautifully. Sometimes, when we learn a new technology, we go
"wtf, why is this like this?" And sometimes, that outside perspective is good!
But sometimes, it just means that you weren't there for the discussion, you either
don't know or aren't in the same contexts, or a variety of other reasons why
something is the way that it is, even if that way is surprising to you at first.

In that sense, I think this idea is pretty closely related to Chesterton's Fence.
It may even just be the same thing, formulated in a slightly different way.
