---
title: "What comes after open source"
pubDate: 2019-04-02
blog: words
---


In [a previous post](https://words.steveklabnik.com/the-culture-war-at-the-heart-of-open-source), I discussed the history of open source, and ended with this claim:

> Today’s developers have never learned about this history, or don’t care about it, or actively think it’s irrelevant. … For the same reasons that “open source” came up with a new name, I think the movement that will arise from today’s developers will also need a new name.
> 

We talked about the ideological history of open source, but that’s not what developers object to, really. I don’t think developers are moving back towards a world of making source code private. Instead, it’s something related to a very old discussion in free software. To quote [the FSF](https://www.gnu.org/philosophy/free-sw.en.html):

> “Free software” means software that respects users’ freedom and community. Roughly, it means that the users have the freedom to run, copy, distribute, study, change and improve the software. Thus, “free software” is a matter of liberty, not price. To understand the concept, you should think of “free” as in “free speech,” not as in “free beer”. We sometimes call it “libre software,” borrowing the French or Spanish word for “free” as in freedom, to show we do not mean the software is gratis.
> 

In a similar fashion, I don’t think that developers are turning against the concept of “free as in free speech”. I think that they don’t believe that the current definitions of free software and open source actually produce software that is “free as in speech.”

## What does “freedom” mean anyway?

What “free as in speech” means is itself, yet another schism between different camps in the Free Software/Open Source camp. At the root of this schism is a difference of *strategy*. The specific tactic is straightforward: there are two kinds of licenses, and which do you choose? The two kinds are:

- *permissive* licenses
- *viral* licenses if you don’t like them, *copyleft* licenses if you do

Open Source advocates prefer permissive licenses, and Free Software advocates prefer viral/copyleft licenses. What’s the difference? Well, that’s the topic for a different essay. Because here’s the thing: the jig is up. We’ve already hit the root problem. And you probably didn’t even notice. It took me a long, long time to notice.

Before I expose the trick, a personal interlude.

## Losing my religion

I used to be a card-carrying, passionate advocate of Free Software. I used to see Stallman lecture. I only installed Free Software on my personal computer to the fullest extent possible. I was considering buying a coreboot-compatible laptop to get rid of the rest.

But then, slowly, I stopped caring. It felt really similar to when I decided to leave Catholicism. I started noticing that these beliefs weren’t really actually helpful, and were frankly, mostly harmful. Now, I’m not saying Free Software is harmful. What I am saying is that refusing to use a wifi connection on your laptop because there aren’t free drivers helps basically nobody, and only harms yourself. Even if you are the kind of person who thinks boycotts work, there just aren’t enough free software diehards to form a large enough boycott. And even then, you’d want to do the boycott *together*, *simultaneously*, to send the message.

I realized that a lot of software I used was under a permissive license, and even though I’d prefer if it was GPL’d, the only way to actually realize the dream of improving the software thanks to the source I’d been given was to contribute back, under those terms. So I started to.

And at that point, the permissive licenses were becoming more and more popular. So I found myself in a strange position: even though I was a passionate Free Software advocate, I found myself near-exclusively building Open Source software. All around me, I saw the assault on copyleft, from all sides. And copyleft was losing.

At some point, I just stopped caring.

## Free Software and Open Source are about licenses

With that out of the way, here’s the problem: note that I seamlessly switched above from talking about what Free Software and Open Source *are*, to immediately talking about *licenses.* This is because these two things are effectively synonymous. Quoting [the FSF again](https://www.gnu.org/licenses/licenses.html):

> Published software should be free software. To make it free software, you need to release it under a free software license.
> 

The [OSI](https://opensource.org/osd):

> Open source doesn’t just mean access to the source code. The distribution terms of open-source software must comply with the following criteria:
> 

Both Free Software and Open Source are, almost by definition, specific design constraints on software licenses. While this started with the FSF, the OSI inherited it.

I think a quote from [further down the FSF’s page](https://www.gnu.org/licenses/licenses.html#WhatIsCopyleft) really drives this home:

> To copyleft a program, we first state that it is copyrighted; then we add distribution terms, which are a legal instrument that gives everyone the rights to use, modify, and redistribute the program’s code or any program derived from it but only if the distribution terms are unchanged. Thus, the code and the freedoms become legally inseparable.
> 

The FSF sees copyleft, and therefore copyright, as a legal tool to enforce software freedom. This sometimes puts Free Software advocates in a strange position. For example, they will [campaign passionately against Digital Rights Management](https://www.fsf.org/campaigns/drm.html), a software tool to protect copyrighted works, yet also [support expanding copyright in some cases](https://fsfe.org/news/2019/news-20190326-01.en.html) when it can further the aims of the GPL. (Due to controversy, they’ve stepped back a bit since, as you can see.)

## Licenses are not sufficient

So why is it a problem that the concepts of free software and open source are intrinsically tied to licenses? It’s that the aims and goals of both of these movements are about *distribution* and therefore *consumption*, but what people care about most today is about the *production* of software. Software licences regulate *distribution*, but cannot regulate *production*. (technically they can, but practically, they can’t. I get into this below.) This is also the main challenge of whatever comes after open source; they cannot rely on the legal tactics of the last generation. I don’t have solutions here.

Let’s talk about what developers want first, and then we’ll get into why licenses can’t accomplish this.

## Developers care about production

In [my previous post](https://words.steveklabnik.com/the-culture-war-at-the-heart-of-open-source), I claimed that developers are mostly confused about open source. Here’s two concrete examples of what I mean.

- Imagine a company wants to take some open source software using a permissive license and use it in their product. In the course of using it in their product, they improve it. Are they required to give anything back to the parent project, at all?
- Imagine a company wants to take some free software using a copyleft license and use it in their product. In the course of using it in their product, they improve it. In order to comply with the license, they include a line in their 250 page “software license agreement” that says “Certain components of the software, and third party open source programs included with the software, have been or may be made available by $COMPANY on its Open Source web site (http://www.opensource.mycompany.com/”. That web site contains zip files with the contents of the (heavily modified) source. Are they required to do anything more than that?

When presenting these questions to most developers today, I suspect you’d get these answers to these two questions, in order:

- Yes, and that’s why open source is such a mess; companies take and don’t give back.
- … that sounds extremely shady.

Those of you who have been around the block a few times may recognize situation number two: it’s what Apple did with WebKit. There was a project called KHTML, which was licensed under the GPL. Apple forked it, and in order to comply with the GPL, did exactly the above. They were completely within their rights to do so. Yet, many recognized, even at this time, that this “wasn’t in the spirit of open source.” These tactics are sometimes called “source dumps” or “code bombs.”

But that attitude, that this may be following the letter, *but not the spirit*, is the crux of it here. Most developers don’t understand open source to be a particular license that certain software artifacts are in compliance with, but an attitude, an ideology. And that ideology isn’t just about the consumption of the software, but also its production. An open source project should have a public bug tracker. There should be a mailing list, for discussion. You should be able to observe, and ideally participate in, the development of the software. Focusing on the code being open is putting the cart before the horse. In fact, this is one of the reasons why there’s such derision for “source available” licenses; it’s not about the source being open. It’s that the source being open is a necessary, but not sufficient, component of being open source. Now, this is normally framed as a problem of distribution, but I think that many also understand it as a problem of production.

I believe that this focus on process is why the GNU project has fallen out of favor as well. The tools that the GNU project uses to develop its Free Software are arcane, ugly, and unique to them. It’s the same with many of the old-school Open Source projects as well. If I never have to look at a Bugzilla instance again, I will die happy. This is why GitHub took off; it provided a significantly nicer developer experience for building software. You may not personally agree, but the numbers speak for themselves. The FSF didn’t move to GitHub because GitHub is proprietary, and they see that as inconsistent with their values. Most developers see that you can use it for no money, and that the software produced with it is open source. They see this as consistent with their values.

When developers talk about problems they see in open source, it’s often that there are production problems. Companies don’t “give back” money or developer hours. Programmers today don’t seem to be upset that, if they’ve developed any proprietary extensions to their open source software, that those extensions are not shared back with the community. They care that the production process is impeded by additional pressure, without providing resources. If a company were to add a proprietary feature to an open source project, yet pays five employees to develop the open source part further, the FSF sees this as a tragedy. The commons has not been enriched. The new generation of open source developers sees this as a responsible company that thankfully is contributing to the development of something they use and care about.

Software licenses can only restrict what people can do when they distribute the source code, and that’s it. It cannot force someone to have a bug tracker, or a code of conduct, or accept your patch. Copyleft can force an absolute minimal “contribution” back to your project, but it can’t force a good-faith one. This makes it an inadequate tool towards building something with the kinds of values that many developers care about.

## The challenges

How would one go about building a software movement around the open *production* of software? There are a number of challenges.

First of all, do you even want the legal system to enforce such a thing? There are pros and cons. Without legal teeth, companies are unlikely to comply. That’s part of why we’re in this mess to begin with!

Okay, so you want the legal system to somehow enforce this kind of control over the production of software. But how? If we look closer at the strategy used by Free Software and Open Source, they use licenses, which are a form of intellectual property law, which is modeled after property law. Earlier, I said that you can’t use licenses to regulate production, and that’s *technically* not true. For example, say that I own a brand, like McDonalds. I own the intellectual property surrounding that brand. I can licence that intellectual property to others, contingent on them producing hamburgers (and whatever else) in a certain way, according to my specification.

This doesn’t really work with the way that open source is set up. The entities are in reverse here; it’s the software developers that want to be able to dictate things, but it’s the project that sets the license terms.

That got me thinking about a different pattern for doing this kind of thing. Have you ever seen one of these?

![https://svbtleusercontent.com/wWhQCoC3mGGKwQ1nS6CC9H0xspap_small.gif](https://svbtleusercontent.com/wWhQCoC3mGGKwQ1nS6CC9H0xspap_small.gif)

This image on a product is part of a process called “certification.” The image itself is referred to as a “certification mark.” In order to use this image on your product, you apply to a “certification body”, in this case, the [USDA](https://www.usda.gov/). This body has set up some kind of tests, and if your product passes them, you gain the ability to say that you’ve passed the certification. I chose organic food on purpose here; most aspects of this certification are about the process by which the food is produced.

Technology is no stranger to these kinds of processes:

![https://svbtleusercontent.com/fMstP8GhZwpMhHxNdZ3aTn0xspap_small.png](https://svbtleusercontent.com/fMstP8GhZwpMhHxNdZ3aTn0xspap_small.png)

So in theory, one could imagine an organization that produces a different kind of document. Instead of a license for the source code, they would provide a way to say uh, let’s go with “Open Development Certified.” Projects could then submit for certification, they’d get accepted or rejected.

I’m not confident this solution would work, however.

For one, even though some parts of our industry have accepted certifications, I feel like software developers have a pretty big bias against them. Beyond that, there’s two other major questions: who would do this certification, and how would they determine the criteria? It’s not clear who has the moral authority to suggest that they are the arbiter of what is correct here, and that a majority of people would agree. And then they would have a big job of actually determining what those sets of rules would be. It does have a nice property of a built-in business model; you can charge for application for the certification. But that also has a host of issues. And even if you sort all of that out, it runs afoul of the same “boycott” problems that I talked about above with Free Software. This certification only makes sense if people demand that the software they use is Open Development Certified. I’m not sure that this would be the case.

Another option is some sort of “Developer Union,” which would put pressure on the companies that those developers work at to contribute back to open source projects. Many developers seem *rabidly* anti-union, and tech companies are as well. I’m not sure this is a viable path, today.

## So where do we go from here?

I’m still, ultimately, left with more questions than answers. But I do think I’ve properly identified the problem: many developers conceive of software freedom as something larger than purely a license that kinds in on redistribution. This is the new frontier for those who are thinking about furthering the goals of the free software and open source movements. Our old tools are inadequate, and I’m not sure that the needed replacements work, or even exist.

Something to think about, though.
