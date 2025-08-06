---
title: "Is npm worth 26MM?"
pubDate: 2014-02-12
blog: words
---


Yesterday, npm, Inc. announced that it had [closed a $2.6MM round of funding](http://blog.npmjs.org/post/76320673650/funding). This was met with a bunch of derision on Twitter. I feel this is not only unwarranted, but backwards: I think this investment signals a nascent trend within the VC community, and a more honest view of how open source actually works.

> Further disclaimer: I work for a company which has received investment from people mentioned in this article. I have never talked to those firms directly either, and I have no privileged information as to why they invested in us, either. It all happened before I came on board.
> 

Let’s talk about VC, and then about some odd investments, and then we’ll get around to npm. I apologize for the length of this post, I didn’t have time to make a shorter one.

## How VC investment works

First, a quick refresher on the actual mechanics of VC investment: [the answer to this headline is ‘no.’](http://en.wikipedia.org/wiki/Betteridge's_law_of_headlines). npm, Inc (‘npm’ for the rest of this post) received an investment of $2.6MM, which means that their company is ‘worth’ some multiple of that. At least, it is to [True Ventures](http://www.trueventures.com/) and friends.

As the saying goes, “follow the money.” A VC firm is, in many ways, a marketplace: they take money from investors (“limited partners,” or “lp’s”) and give it to entrepreneurs, and take a cut off the top. Let’s go through an example:

The Vulture Capital company is a venture capital firm. They announce a new fund. This fund, like many, has a mission statement: to invest in new SaaS technologies. They go to various wealthy individuals, insurance companies, funds-of-funds, endowments, and other companies, and pitch them on this investment: “The VC firm is going to invest $100MM into new SaaS technologies. Our last fund turned $10MM into $20MM. We think we can turn this $100MM into $300MM in the next ten years. We just need your money.” This motley band of the 1% scrapes together $100MM total out of their couch, and this new fund is good to go! The fund is now ‘closed.’ The VC firm now goes to work: the individuals who work for the firm now figure out who to actually give the money to. This generally takes three to five years. In this story, to make the math easy, VC invests in ten companies, $9.75MM each. For this, they get some stake in each company: we’ll call it 30% here. Since they purchased 30% of the company for $9.75MM, each company is ‘worth’ $29.25MM. In order to actually monetize this stake, generally, these companies need to experience a liquidity event: someone has to purchase them, or they need to go public. Because early-stage investing is exceedingly risky, when we check in on Vulture Capital ten years later, six companies have gone bankrupt, three sold for $67MM, and one went public and investors sold off $100MM. 3 * 67MM + 100MM = 300MM: success! The firm has turned $100MM into $300MM. The firm takes a chunk of this money, and the rest is given to those individuals that put up the money in the first place. A new fund is announced, and the cycle repeats itself.

There are variations at all points in this story, but that’s basically how it works. I’ve also ignored that VC firms generally have multiple funds going at once, that there are different kinds of employees in VC funds with different roles, and a whole ton of other things. This is a simplification, but a representative one.

Two big things matter here: It’s a numbers game. Over half of our example companies bit the dust, but the firm still made their money. Things have been successful overall. Secondly, companies *must* exit. A business that’s making $1MM a year in profit off of our $9.75MM investment will still make money eventually, but it won’t in our ten year period, which is when our limited partners want their money back. In another context, a million dollars of profit a year is a success, but for us, it’s a failure.

We’ll come back to these economics in a bit.

## Open Source and $$$

It’s time for some #realtalk about open source. Open Source is big business. And it’s always been that way. Someday I will write more about this, but for now, I’ll just make that statement and not really back it up. For now, let’s trace the flow of labor in the open source world, and how it relates to businesses.

Open Source is pretty much the de-facto way to run a startup company these days. Even people on the Microsoft stack are increasingly utilizing open source. And there’s a good reason: the initial monetary cost of open source is zero. It’s also a form of DRY: a bug fixed in an open source component fixes a bug in every firm that uses that particular component.

Here’s a (sorta kinda) real world example:

A company, “[Adequate HQ](http://adequatehq.com/)” builds a web application ([RecruiterSpam](http://www.recruiterspam.com/)) in a hot new language, “[Phuby](https://github.com/tenderlove/phuby).” They decide to release a bunch of the code from this application as open source, and call it “[Phuby on Phails](http://www.youtube.com/watch?v=lsWKjS6Vufw).” There are a number of reasons to do this, but here’s a big one: bugs fixed in Phails will be fixed in RecruiterSpam, at no cost to Adequate! Furthermore, there’s a market opportunity here: by controlling Phuby on Phails, Adequate secures its reputation as a leader in the space, which leads to an invaluable amount of publicity, book deals, and eventually, pro subscriptions to RecruiterSpam. Adequate’s CEO, [Gorbachev “Puff Puff” Thunderhorse](https://twitter.com/gorbypuff), can just lay around all day and post photos of himself to Instagram. Other companies see the success of Adequate, and also decide to build their application on Phails. After all, Phails is pretty awesome, and is (truly) significantly better than all the other frameworks out there. Their new use exposes bugs in Phails, so they fix them and submit patches. Eventually, there’s an entire Phails ecosystem, with conferences, books, ninjas, and rockstars. Tons of gravy for everyone, and everyone rides their sports cars into their various sunsets.

![pagani zonda hh](/img/2014-02-12/zonda-hh.jpg)

This is a great story. Everyone wins. Everyone helps each other out. Costs go down, quality goes up. But there’s something that needs to be acknowledged here: Adequate had to exist. Someone had to do the initial work of actually building Phails (and all the other related tools I didn’t explicitly mention: deployment tools, testing tools, dependency management tools, the list goes on and on). In this case, it was because they had a kick-ass product and made boatloads of cash.

But fundamentally, programmers must pay rent and eat. Yes, they may not *directly* work on open source for free. But someone is paying them, and it has to come from *somewhere*. There is no such thing as a free lunch.

There are, however, different ways to get the money to buy lunch.

## Infrastructure investment

So we have this trend of open source in general, and that for each language, we need an ecosystem to support building software. That ecosystem has to be bootstrapped somehow. Previous communities effectively got lucky, or put in long, long hours, only to be forgotten. I still cry tears for CPAN every once in a while. But I digress. The real question is this:

I’m a VC. I need a large number of companies to exist to make my money. I also need them to get as big as possible to make my money. I need costs to be low and profits to be high. I need a healthy open source ecosystem to make this happen. So what do I do?

So here’s what I’m seeing slowly happen: VCs are realizing this story, and are starting to invest in infrastructure. Remember, failure is built into their model. If you had to make ten investments, and I told you that I would take one of them, and you’d lose money on me, but I’d build an ecosystem that would help be a multiplier on all your other investments, would you take it? Remember, you just need one really, really big payday. And a bunch of your investments *will* already fail.

This is what I see happening with npm. And it’s not just npm: there’s a number of investments in the last few years which fit this pattern. I’m pretty sure that [a16z](http://en.wikipedia.org/wiki/Andreessen_Horowitz) is the only VC firm that explicitly understands this model, and True Ventures may have stumbled upon it by accident.

Because Rails (If the sarcasm wasn’t heavy enough, Phails is Rails) isn’t exactly repeatable. It’s a fluke. A wonderful fluke that’s changed my life (I have a Ruby tattoo), but I wouldn’t bet on it happening that way again. If I told you, “I have a design firm. No programming skill. We’re going to hire an offshore contractor to build an application and let them do whatever they want.” Would you invest? I wouldn’t.

If you want to repeatably manufacture an open source ecosystem, you need capital to do so. And a firm that’s progressive enough to understand the indirect payoffs of investing in infrastructure is poised to have a huge advantage.

While my VC story above is a generic, average one, there are also oddball investments. Before we get to NPM exactly, I want to talk about a few others. The first one is not actually a VC investment itself, but it is a total curveball that caused a lot of waves. Let’s talk about 37signals and Jeff Bezos. In many ways, 37signals is the anti-VC. A boostrapped, incredibly profitable company. So why take money from an investor? Well, money isn’t the only things investors have to offer. From [the announcement](http://signalvnoise.com/archives2/bezos_expeditions_invests_in_37signals.php):

> Since we launched Basecamp we’ve been contacted by nearly 30 different VC firms. We’ve never been interested in the typical traditional VC deal. With a few exceptions, all the VCs could offer us was cash and connections. We’re fine on both of those fronts. We don’t need their money to run the business and our little black book is full. We’re looking for something else.What we’ve been looking for is the wisdom of a very special entrepreneur who’s been through what we’re going through. Someone who sees things a little differently and makes us feel right at home. Someone with a long term outlook, not a build-to-flip mentality. We found a perfect match in Jeff. Jeff is our kinda guy.
> 

37signals themselves have said many, many times that they would never sell the company. So where’s Bezos going to get his liquidity event from? Jeff doesn’t actually need Basecamp (which 37signals abruptly re-branded to last week, so let’s abruptly re-brand them here) to experience a liquidity event to get what he wants out of this investment. Bezos [invests in all kinds of things](http://www.crunchbase.com/financial-organization/bezos-expeditions). And, as Basecamp mentions, his advice and connections are invaluable.

The next two investments that fall in this category of “force multiplier for other things I’m doing that I don’t have to worry about getting my money back directly” are both from Andreessen Horowitz. a16z is in my opinion the most progressive and interesting VC firm in the valley. They make a lot of weird, oddball, long-shot investments, and they tend to pay off. There are two (and a half) that directly fall into the category of investment I’m talking about in this post, and that’s GitHub and Meteor (and CoinBase). Let’s talk Meteor first.

[Meteor Development Group got $11.2MM in a round led by a16z](https://www.meteor.com/blog/2012/07/25/meteors-new-112-million-development-budget). While MDG claims they’ll eventually release some sort of commercial product, I don’t think that’s what really matters. If Meteor is the new Rails, then a16z gets the most inside track possible to that entire new ecosystem. And given that most VC investments fail anyway, this is a really good deal for a16z. They’re purchasing a lottery ticket, but it’s more than that: it’s a lottery ticket that makes future lottery tickets worth more money. They can invest in future Meteor-based startups, knowing that Meteor development will continue for a long time. They’ll always have their nose to the ground on any promising companies built around Meteor, earlier than everyone else. Knowledge and information is power.

Secondly is GitHub. [GitHub raised $100MM from a16z, and a16z alone](http://peter.a16z.com/2012/07/09/software-eats-software-development/). At the time, I was super mad, because I said exactly what everyone has been saying about the NPM investment. As time goes on, though, I don’t think that GitHub *needs* to experience a liquidity event. While we don’t know the valuation of GitHub, I *do* know that an acquisition doesn’t make any sense, and I’m increasingly of the opinion that an IPO doesn’t either. This is based primarily on subjective opinions that I’ve gleaned from being friends with so many GitHubbers over the years, and I don’t think an IPO is *impossible*, but unlikely. So why invest?

[a16z famously believes that software is eating the world](http://online.wsj.com/news/articles/SB10001424053111903480904576512250915629460). They even reference this article in the title of the GitHub announcement. Investing in GitHub makes a ton of sense when viewed through this lens. In fact, if I had to guess, I’d bet that a16z got a small enough chunk that GitHub’s valuation is *insane*. (And I try not to use that word.) This means that a16z and GitHub management are protected from a acquisition, and can retain control of GitHub. Why does that matter? Well:

“Scumbag Steve image saying”Open source infrastructure should be free" / “pushes all code to GitHub”" Apparently memegenerator got hacked, and it was giving this page a warning.

Increasingly, GitHub is where all the open source code is hosted. And open source is the way business is going. And GitHub makes money off of the code that’s not open. In many ways, the open source stuff is a loss leader, so that you get hooked on the GitHub interface and then use it for everything, even your closed source code. This is a great business strategy, but it also places GitHub at the center of this new universe. So for similar reasons, a16z needs GitHub to be awesome to bootstrap *every* open source ecosystem that will exist into the future. It’s the infrastructure for the infrastructure. The primordial ooze of the 10x return. And a16z has the money to ‘throw away’ on something they won’t get a direct return out of, because they’re smart enough to invest some of their fund in ecosystem development.

The extra half-investment I’m talking about is CoinBase. [They got $25MM from a16z and others](http://techcrunch.com/2013/12/12/coinbase-raises-25m-from-andreessen-horowitz-to-build-its-bitcoin-wallet-and-merchant-services/), and [Andreesen himself has written about BitCoin](http://dealbook.nytimes.com/2014/01/21/why-bitcoin-matters/). By way of analogy:

“Software will eat the world” : GitHub :: “Why Bitcoin Matters” : CoinBase

I only give them a half in this case because it’s not clear to me that CoinBase will be dominant in the way that GitHub is dominant, and that Bitcoin will build a new payments ecosystem the way that open source has built a new ecosystem. But *some* entity like CoinBase is necessary for Bitcoin to succeed. More on that in a future post, someday.

## npm?

So by now, I hope it’s clear how I view this NPM investment: True Ventures puts in money because the ecosystem around Node.js is still young, and a package manager is one of the biggest parts that *requires* money. Someone has to pay that S3 (I guess CouchDB) and EC2 bills. So they bootstrap the ecosystem, and also give a multiplier on their future investments. They get insight and access at unprecedented levels into the future of Node, at the cost of something they can already afford to lose.

We’ll see if I’m right in ten years.
