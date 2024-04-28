---
title: "Thoughts on Rust in 2019"
pubDate: 2018-12-27
blog: words
---


Each year, [we ask the community to write blog posts about what they want to see on Rust’s roadmap for the next year](https://blog.rust-lang.org/2018/12/06/call-for-rust-2019-roadmap-blogposts.html). This is my post for Rust in 2019.

## Rust 2021: Maturity

This year is also a bit special; in 2018, we introduced “editions” to Rust, on a roughly three-year schedule. So now is not just a good time to think about 2019, but about 2020 and 2021 as well. Rust 2015 was about “stability”. Rust 2018 was about “productivity.” I’d like Rust 2021 to be about “maturity.”

In order to get there, here’s what we need in 2019.

## No *new* features

Emphasis on “new” here. What do I mean by this? Well, there are a few features that are in the pipeline that I *do* think should land:

- `async`/`await`
- GATs
- `const` generics

And *possibly*

- Specialization

None of these features are new; we’ve got their basic designs in place. These features are also *significant* and *foundational*; we need `async`/`await` (and to some degree, GATs) for a great networking story, we need `const` generics for an excellent numerics story.

But after that? I’d like to see a moratorium on major features until 2020, and I’d prefer if we limited 2020 to two or three, if any.

We’ve hit a sweet spot. We’ve always said that Rust 1.0 was about stability, not completeness. I think we’re fast approaching completeness.

That said, I don’t think that the language team should be disbanded or anything; I think their work should transition to working on *specifying* what we already have, in more detail. I’m not sure if we can have the reference be done in 2019 (more on that later), but I’d like it to be much further along. That can only happen with the help of the language team, and they can only do that work if they have the time.

## Refine the RFC process

The RFC process needs to be significantly re-vamped. Niko wrote a great post on this [back in June](http://smallcultfollowing.com/babysteps/blog/2018/06/20/proposal-for-a-staged-rfc-process/), and I think it’s really, really, really important. I’d like to work on an RFC to propose this, so if you’re interested, we should talk.

Niko already makes the case and lays out some foundations, so I won’t say more there.

## Pay down organizational debt

Consider this section an endorsement of [everything boats said](https://boats.gitlab.io/blog/post/rust-2019/). I cannot say it better, so I will just leave it at that.

## Figure out documentation sustainability

This year was a bad year for the docs team. The book got shipped, and that was great. We had some people pitch in on the reference, and their work was amazing. Some of the other documentation writers moved on to work on `rustdoc`, which was important.

But a lot of the goals we wanted to do about writing more docs themselves never came to fruition. For example, contributing to major ecosystem crates? Never happened. The cookbook isn’t done. Rust by Example still languishes. The standard library could use a lot of love.

We just don’t have the people to make this happen. We’ve tried, but nothing has worked. It’s possible that this is simply unfixable, after all, most programmers don’t like writing docs. But I also don’t want to give up on it either. I’m not sure what to do here, but I do know that it is a major problem.

## Conclusion

There’s a lot of work to do, and I’m very excited to do it. I think Rust is in an *excellent* place, and with some work, we can make Rust even more amazing in a year’s time.
