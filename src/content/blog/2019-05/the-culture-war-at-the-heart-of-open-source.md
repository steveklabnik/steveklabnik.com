---
title: "The culture war at the heart of open source"
pubDate: 2019-05-26
blog: words
---


There’s a war going on. When isn’t there a war going on? But I’m not talking about a physical war here: I’m talking about a war over meaning. This particular war is a fight over what “open source” means.

Let’s take a few steps back.

## The Free Software Foundation

People organize into groups for many reasons. This story starts with the story of an organization called the “GNU Project.” It was started in 1983, and [here’s the initial announcement on USENET](https://groups.google.com/forum/#!msg/net.unix-wizards/8twfRPM79u0/1xlglzrWrU0J). I’ve pulled out four important paragraphs:

> Starting this Thanksgiving I am going to write a complete Unix-compatible software system called GNU (for Gnu’s Not Unix), and give it away free to everyone who can use it. Contributions of time, money, programs and equipment are greatly needed.I consider that the golden rule requires that if I like a program I must share it with other people who like it. I cannot in good conscience sign a nondisclosure agreement or a software license agreement.So that I can continue to use computers without violating my principles, I have decided to put together a sufficient body of free software so that I will be able to get along without any software that is not free.If I get donations of money, I may be able to hire a few people full or part time. The salary won’t be high, but I’m looking for people for whom knowing they are helping humanity is as important as money. I view this as a way of enabling dedicated people to devote their full energies to working on GNU by sparing them the need to make a living in another way.
> 

There’s a lot of different ways to talk about this post: it contains all sorts of interesting things. But for right now, I want to talk about the motivations here. There were two main ones: first, to produce a software artifact. The second one is the big one: the artifact needs to be produced because existing ones were not compatible with a particular set of values.

The word “ideology” is a tricky one, but let’s go with this definition, which is [from Wikipedia](https://en.wikipedia.org/wiki/Ideology):

> An ideology is a collection of normative beliefs and values that an individual or group holds for other than purely epistemic reasons.
> 

The GNU project was formed to produce software according to a particular ideology: one of sharing software. I’m not here to argue if the project has accomplished this goal, or if this goal is good or not. My point is that the origins of the GNU project were specifically motivated by a collection of normative beliefs and values.

Two years later, the Free Software Foundation would be formed to support the GNU project, and promote the concept of Free Software. Free Software was software that aligns with the ideology of the GNU project, and a definition of Free Software was created and published in Feburary of 1986. Here is that definition:

> The word “free” in our name does not refer to price; it refers to freedom. First, the freedom to copy a program and redistribute it to your neighbors, so that they can use it as well as you. Second, the freedom to change a program, so that you can control it instead of it controlling you; for this, the source code must be made available to you.
> 

Since then, the Free Software Definition has expanded to four points. You can read the current definition [here](https://www.gnu.org/philosophy/free-sw.en.html).

## Open Source appears

A decade passes, and trouble is brewing. I’ll [quote wikipedia again](https://en.wikipedia.org/wiki/Open_source#Origins):

> [T]he modern meaning of the term “open source” was first proposed by a group of people in the free software movement who were critical of the political agenda and moral philosophy implied in the term “free software” and sought to reframe the discourse to reflect a more commercially minded position. In addition, the ambiguity of the term “free software” was seen as discouraging business adoption. The group included Christine Peterson, Todd Anderson, Larry Augustin, Jon Hall, Sam Ockman, Michael Tiemann and Eric S. Raymond. Peterson suggested “open source” at a meeting held at Palo Alto, California, in reaction to Netscape’s announcement in January 1998 of a source code release for Navigator. Linus Torvalds gave his support the following day, and Phil Hughes backed the term in Linux Journal.
> 

Here we see the creation of the open source movement. If you’d prefer a primary source, here’s [Eric S. Raymond](http://www.catb.org/~esr/open-source.html):

> Specifically, we have a problem with the term “free software”, itself, not the concept. I’ve become convinced that the term has to go.The problem with it is twofold. First, it’s confusing; the term “free” is very ambiguous (something the Free Software Foundation’s propaganda has to wrestle with constantly). Does “free” mean “no money charged?” or does it mean “free to be modified by anyone”, or something else?Second, the term makes a lot of corporate types nervous. While this does not intrinsically bother me in the least, we now have a pragmatic interest in converting these people rather than thumbing our noses at them. There’s now a chance we can make serious gains in the mainstream business world without compromising our ideals and commitment to technical excellence – so it’s time to reposition. We need a new and better label.
> 

Shortly after, the [Open Source Initiative](http://opensource.org/) was founded. A sort of mirror of the FSF, the OSI would support the promotion of the term “open source,” and the ideology behind it. Like the Free Software Definition, the [Open Source Definition](https://opensource.org/osd) was created, derived from Debian’s guidelines for producing Free Software.

Again, we have an organization that’s created along ideological lines. But in this case, slightly different ones. [An older version of the OSI website says](https://web.archive.org/web/20090413035630/https://opensource.org/history):

> The conferees decided it was time to dump the moralizing and confrontational attitude that had been associated with “free software” in the past and sell the idea strictly on the same pragmatic, business-case grounds that had motivated Netscape.
> 

[Today’s version says](https://opensource.org/history):

> The conferees believed the pragmatic, business-case grounds that had motivated Netscape to release their code illustrated a valuable way to engage with potential software users and developers, and convince them to create and improve source code by participating in an engaged community. The conferees also believed that it would be useful to have a single label that identified this approach and distinguished it from the philosophically- and politically-focused label “free software.”
> 

The idea here is plain: Free Software, but for business.

For more on this topic, I recommend [The Meme Hustler](https://thebaffler.com/salvos/the-meme-hustler).

## Moving forward

Twenty years have passed, and a lot has changed.

For ideological movements to persist, they need to re-produce their values in new membership. And for a while, the FSF and OSI did a good job of that. These two movements, Free Software and Open Source, produced a lot of software, and gained a lot of new converts. But then… something happened.

I’m not sure exactly how it happened. I think the lazy answer is “GitHub!!!!”. I do think GitHub played a role, but I think the answer is more complex than that. I personally think that gender plays a huge role. But that’s a different essay. Regardless of *why* it happened, something did happen.

Somewhere along the way, Open Source ran into a problem that many movements face: the members of the movement no longer understood the ideology that created the movement in the first place.

If you ask a random developer what “open source” means to them, you won’t often hear “software that follows the Open Source Definition.” If you ask them “what’s the difference between free software and open source software,” you’ll often hear “aren’t those the same thing?” or “you can charge money for open source software, it’s not always free.” You may even hear “it’s on GitHub.”

In talking to developers about open source, you’ll also hear something else. Something that’s been itching in the back of my brain for a while, and the thing that led me to write this. You’ll often hear developers talk about how the relationship between businesses and open source developers is messy. Complicated. Businesses don’t “give back enough,” won’t pay people to work on open source. That it’s all take and no give. I’ve said a lot of that stuff myself.

But here’s the thing: that’s why the concept of open source was created in the first place. It’s there, plain as day, if you ask the folks who actually created it. Open source was a way to make free software better for businesses. This doesn’t mean that it’s beyond critique, of course. The relationship can improve. I don’t think these developers are stupid, or hypocrites.

This is where we’re at today. The Free Software movement was created, and then Open Source was created as a reaction to that. Today’s developers have never learned about this history, or don’t care about it, or actively think it’s irrelevant. And so we have a war. A war for the meaning of open source. A war fought with tweets, and blog posts, and discussions. A war between the old guard, those who created the idea originally, and the new generation, the developers who have taken the base idea and run with it.

I think history will repeat itself. In the same way that the open source movement said “we’re like free software, but with these changes,” I think we’ll end up with a new movement. For the same reasons that “open source” came up with a new name, I think the movement that will arise from today’s developers will also need a new name. I’m not sure what that movement will look like, and I’ll explore why in another post. To give you a teaser: the problem is in the way that both Free Software and Open Source are formulated. The rot is in the roots, and I’m not yet sure what will replace it.
