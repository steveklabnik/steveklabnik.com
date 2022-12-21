---
layout: ../../layouts/MarkdownPostLayout.astro
title: "A sad day for Rust"
pubDate: 2020-01-17
blog: words
---

`actix-web` is dead.

This situation is bad, from all sides. When Rust was a tiny, tiny community, I thought to myself, “wow, I wonder how long this will last? Probably 1.0 will kill it.” Sort of playing off of [Eternal September](https://en.wikipedia.org/wiki/Eternal_September), I assumed that over time, the community would grow, and we’d encounter problems.

Today is the first day where I say to myself, okay, has that happened?

This story is not super clear-cut. I’m not going to link to a dozen citations, or try to prove that I’m some sort of neutral party here. I’m going to give you account of this story as I remember it and as I felt it. Because this isn’t really about playing judge. This is about thinking about the future.

It’s been very clear from the beginning that the Rust project saw Rust as more than just the language. The community and the people mattered. From the earliest days, leadership explicitly took the position that it wasn’t just the code, but the people around the project were important. Of course, people are also people, and so this wasn’t perfect; we’ve made several fairly large mis-steps here over the years. But Rust has been an experiment in community building as much as an experiment in language building. Can we reject the idea of a BDFL? Can we include as many people as possible? Can we be welcoming to folks who historically have not had great representation in open source? Can we reject [contempt culture](https://blog.aurynn.com/2015/12/16-contempt-culture)? Can we be inclusive of beginners?

Rust has a necessary feature, `unsafe`, that allows you to escape Rust’s guarantees. This is a really important part of Rust, but also a very dangerous one, hence the name. But one of the things that’s important about it is that, since `unsafe` means “I have checked this code, and it upholds all of the guarantees the compiler cannot check,” you can build a safe interface with unsafe guts.

Interacting with anything outside of the language, for example, using the operating system to print to the screen, or write a file, has to be `unsafe`, and so without this property, all programs would be `unsafe`. This premise is treated skeptically by many, but has generally been demonstrated to have worked out. Several folks are in the process of providing tooling to prove that your `unsafe` code is correct, and provided proofs for a bunch of the standard library’s `unsafe` code. It not only found a few places where there were bugs, but also a few places where the restrictions were too tight!

But “generally” is doing a lot of work in that previous sentence. This setup creates a gnawing fear in the back of people’s minds: what if some foundational package uses `unsafe`, but uses it incorrectly? What happens when this causes problems for every package that uses that package? This relationship between safe and unsafe is also a bit hard to understand, and so, when bugs are found around unsafe, people *outside* of Rust often use it to suggest that all of Rust is a house of cards. While Rust has “made it” in many senses, it has not quite yet in many others, and so I think this produces a fundamental anxiety in the community.

Speaking of making it, actix-web is a good web framework. It came onto the scene, and people generally liked it. It also performed extremely well. Its score on [Techempower](https://www.techempower.com/benchmarks/) in particular was impressive, and got more impressive over time. Its author also works at Microsoft, and suggested that Microsoft is using actix-web in production. This was really exciting to people. This was the second project using Rust at Microsoft, and so this seemed really fantastic.

But then, the anxiety.

Before we get into that, though, there’s also the matter of Reddit. The team has basically rejected Reddit for said social reasons. We provide alternate forums for folks, but Reddit is a huge place. The Rust subreddit has ~87,000 subscribers, partially thanks to this. And, for a while, the Rust reddit was a decent place. I still think it’s better than most reddits, but it’s degraded much more quickly than the community at large. “Why Reddit is like this” is a whole other essay; I think it’s built into reddit’s structure itself. But the point is, while Reddit is not official, and so not linked to by any official resources, it’s still a very large group of people, and so to suggest it’s “not the Rust community” in some way is both true and very not true. For the purposes of this story, I think it has to be included in the broader community, and I think that this situation has brought new questions about the relationship of the project and Reddit, though this is already far too long.

So, someone takes a peek under the covers, and it turns out actix-web is using a *lot* of unsafe code. That’s not inherently a problem. The problem is, a lot of that unsafe code is not actually needed. This is where things start to go wrong.

The author of actix-web basically says “nah it’s fine.” This is basically the perfect storm of unsafe anxiety: a big, important, visible library, a bunch of `unsafe`, and an unresponsive author.

Now, it’s important to mention that people were not just complaining: they were writing code. It is easy to frame this as a case of open source entitlement, and it still very may well be, but this isn’t just empty complaints. Patches were included, they just weren’t welcome. And that’s also not inherently wrong either; a project maintainer shouldn’t be required to accept a patch just because it exists…

Reddit whips itself into a frenzy. Lots of ugly things are said. More issues are opened, and closed, and locked. Eventually, the author accepts some code that drops the total unsafe count significantly and has more sound usage of what’s left.

People were not happy about how all this played out, for a variety of reasons and in a variety of ways. I haven’t spoken to actix-web’s author, but I can’t imagine that he was very happy about it either.

And then it happens all over again. More unsafe, more patches rejected, more Reddit, more bad blood. I thought that at this point, the author said he was quitting, but that may be faulty memory, or maybe he changed his mind. Regardless, how responsive would you be, if you were the maintainer, after the shit-show of last time?

People were not happy about how all this played out, for a variety of reasons and in a variety of ways.

All was quiet for a while, and actix-web kept climbing the Techempower benchmarks, reaching the top of most of them by a *lot*. It is wicked fast.

And then, yesterday, a post titled [Smoke-testing Rust HTTP clients](https://medium.com/@shnatsel/smoke-testing-rust-http-clients-b8f2ee5db4e6) gets published. It focuses on a, well, smoke test of Rust HTTP clients, but it also comments a lot on the complexity of each project, and the amount of `unsafe`. The author found and filed a lot of bugs.

But:

> A quick glance at the dependencies reveals that it relies on actix-service, which underpins all of Actix and has a bespoke and unsound Cell implementation. For example, this method violates memory safety by handing out multiple mutable references to the same data, which can lead to e.g. a use-after-free vulnerability. I have reported the issue to the maintainers, but they have refused to investigate it.
> 

This causes the now-usual Reddit uproar. It’s extra nasty this time. Some people go far, far, far over the line.

And now the maintainer has quit.

This means, on some level, this situation is over: there will not be a fourth huge actix-web drama. But it’s really left a bad taste in my mouth. It’s unfortunate that a well-known project had soundness issues. It’s unfortunate that the maintainer wasn’t receptive to fixing them. At the same time, I’ve been there: being a maintainer is tough. It’s also unfortunate that there’s this *style* of response, and kind, and volume. It *is* true that the situation was dangerous. But did it have to be handled this way? You have to understand a lot of nuance here to even know the main points of the story. One version of this story that will certainly be told is “The Rust community says they’re nice but they will harass you if you use unsafe wrong.” Is that what we want? I, for one, do not. If you’re a part of Rust, you gotta ask yourself: are you happy with this outcome? How did your actions (or lack thereof) contribute to it? Could you have done something better?

I’m not sure where we go from here, and I’m not sure what we could have done to prevent this from happening. But I feel like this is a failure, and it’s set Rust back a bit, and I’m just plain sad.

EPILOGUE

actix-web has new maintainers, and will now live on: https://github.com/actix/actix-web/issues/1289
