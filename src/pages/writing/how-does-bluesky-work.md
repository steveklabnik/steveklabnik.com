---
layout: ../../layouts/MarkdownPostLayout.astro
title: "How Does BlueSky Work?"
pubDate: 2024-02-24
---

One of the reasons I am enthusiastic about BlueSky is because of the way that
it works. So in this post, I am going to lay out some of the design and the
principles behind this design, as I understand them. I am not on the BlueSky
team, so these are my takes only.

Let's begin.

## Why does BlueSky exist?

Here's what [the BlueSky Website](https://bsky.social) says right now:

> Social media is too important to be controlled by a few corporations. We’re
> building an open foundation for the social internet so that we can all shape
> its future.

This is the big picture.

Okay so that's a great idea, but like, what does that *mean*? Currently,
BlueSky is a microblogging application, similar to Twitter and Mastodon. How
does that fit into the big picture? Well, while it's true that BlueSky is a
microblogging application, that's not the whole story: BlueSky is an initial
application to prove out the viability of [the Authenicated Transfer
Protocol][at-protocol], known as AT, ATP, or "atproto" for short. BlueSky is the
"building" and atproto is the "open foundation for the social internet."

An important thing to note: BlueSky is also a company. Some people look at a
company saying "hey we're building something that's too big to be controlled
by companies!" with skepticism. I think that's a healthy starting point, but
the answer for me is atproto. 

The interplay between these two things is important, but we're going to start
by exploring atproto, and then talk about how BlueSky is built on top of it.

## Is this a cryptocurrency?

The first thing we have to get out of the way: If you hear "oh it's a
distributed network called 'something protocol'" you may have a "is this
a cryptocurrency?" alarm bell going off in your head.

Don't worry, it's not a cryptocurrency. It does use some technologies that
originated in the cryptocurrency space, but this isn't a blockchain, or a DAO,
or NFTs, or any of that. Just some cryptography and merkle trees and the like.

## What is the big picture with atproto?

Here's what [the AT Protocol Overview][atp-overview] says:

> The Authenticated Transfer Protocol, aka atproto, is a federated protocol for
> large-scale distributed social applications. 

Let's break that down:

> a federated protocol

atproto is federated. This means that the various parts of the system can have
multiple people running them, and that they communicate with each other.

Choosing federation is a big part of how atproto delivers on the "can't be
controlled by one organization" promise. There are other parts too, but this
is an important aspect of solving this.

> for large-scale

If you want to scale, you have to design with scale in mind. atproto makes
several interesting choices in order to distribute the load of running the
system more onto the actors that can handle load, and less on those that can't.
This way, applications running on top of atproto can scale up to large userbases
without issue.

That's the hope, at least. Earlier this week, BlueSky hit five million users,
and is far more stable than Twitter was in the early days. That's not as big
as many social applications, but it's not nothing either. We'll see how this
works out in practice.

> distributed social applications

atproto is for connecting to others, so it's focused on social applications.
It also is currently 100% public, there are no private messages or similar. The
reasons for this is that achieving private things in a federated system is
very tricky, and they would rather get it right than ship something with serious
caveats. Best for now to only use this stuff for things you want to be public.

These applications are "distributed" because running them involves running them
on the network directly. There's no "BlueSky server," there's just servers
running atproto distributing messages to each other, both BlueSky messages and
whatever other messages from whatever other applications people create.

So that's the high level, but what does that mean concretely?

In atproto, *users* create *records* that are cryptographically signed to
demonstrate authorship. Records have a schema called a *Lexicon*.

Records are stored in *repositories*. Repositories run as a *service*, exposing
HTTP and WebSockets. They then can then talk to each other and federate the
records. These are often called PDSes, for "Personal Data Server." Users
either run their own PDS, or use one that someone else hosts for them.

Applications can be built by looking at the various records stored in the
network, and doing things with them. These services all called *App Views*,
because they are exposing a particular view of the information stored in the
network. This view is created via the Lexicon system: building an application
means that you define a Lexicon, structuring the data that you want to deal with,
and then look at records that use your lexicon, ignoring the rest.

Now, if this were all there is, there would be pretty serious scaling issues.
For example, if every time I post a new update on BlueSky, if I had to send
my post to every single one of my followers' repositories, that would be
extremely inefficent, and make running a popular repository very expensive to
run. To fix this, there's an additional kind of service, called a *relay*, that
aggregates information in the network, and exposes it as a firehose to others.
So in practice, App Views don't look at Repositories, but instead, look at
Relays. When I make a post, my respository won't notify my followers'
repositories individually. My repository will notify a Relay, and my followers
will use an App View that filters the ouput of the Relay to show only the posts
of people they're following. This does imply that Relays are often huge and
expensive to run, however you could imagine running a smaller relay that only
propogates posts from a smaller subset of users too. They don't *have* to show
everything on the network, though bigger ones will, of course.

Here this is in ASCII art:

```text
  ┌─────┐                    ┌──────────┐ 
  │ PDS ├───────┐            │ App View │ 
  └─────┘       │            └──────────┘ 
               ┌▼────────┐       ▲        
  ┌─────┐      │         ├───────┘        
  │ PDS ├──────►  Relay  │                
  └─────┘      │         ├───────┐        
               └▲────────┘       ▼        
  ┌─────┐       │            ┌──────────┐ 
  │ PDS ├───────┘            │ App View │ 
  └─────┘                    └──────────┘ 
```

This is all you really need to know to understand the core of atproto: people
create data, it's shared in the network, and applications can interact with
that data.

However, there are additional service types being introduced, with the
possibility of more in the future. But before we talk about those, we have to
explain some ideological commitments to understand why things are shaped the way
they are.

## What is "speech vs reach"?

Given that atproto is deliberately created to enable social applications, it
needs to consider not just connecting people, but also disconnecting people.
Moderation is a core component of any social application: "no moderation" is
still a moderation strategy. BlueSky handles these sorts of questions by
acknowledging that different people will have different preferences when it
comes to moderation, and also that moderation at scale is difficult.

As such, the protocol takes a "speech vs reach" approach to moderation. The
stuff we've described so far falls under the "speech" layer. It is purely
concerned with replicating your content across the network, without caring
what the semantic contents of that content is. Moderation tools fall under the
"reach" layer: you take all of that speech, but provide a way to limit the
reach of stuff you don't care to see yourself.

Sometimes, people say that BlueSky is "all about free speech" or "doesn't do
moderation." This is simply inaccurate. Moderation tooling is encoded into the
protocol itself, so that it can work with all content on the network, even
non-BlueSky applications. Moreover, it gives you the ability to choose your own
moderators, so that you aren't beholden to anyone else's choice of moderation or
lack thereof. But I'm getting ahead of myself: let's talk about feed generators
and labelers.

## What are feed generators?

Most social applications have the concept of a "feed" of content. This is broken
out into its own kind of service in atproto, called a *feed generator*. A classic
example of a feed is "computer, show me the posts of the people I follow in
reverse chronological order." Lately, algorithmic feeds have become popular with
social networks, to the point of where some non-technical users refer to them
as "algorithms."

Feed generators take the firehose produced by a relay, and then show you a list
of content, filtered and ordered by whatever metric the feed generator desires.
You can then share these feeds with other users.

As a practical example, one of my favorite feeds is the [Quiet
Posters][quiet-posters] feed. This feed shows posts by people who don't post
very often. This makes it so much easier to keep up with people who get drowned
out of my main feed. There are feeds like [the 'Gram][the-gram], which shows
only posts that have pictures attatched. Or [My Bangers][bangers], which shows
your most popular posts.

This to me is one of the killer features of BlueSky over other microblogging
tools: total user choice. If I want to make my own algorithm, I can do so.
And I can share them easily with others. If you use BlueSky, you can visit
any of those feeds and follow them too.

Feeds are a recent addition to atproto, and therefore, while they do exist,
they may not be feature complete just yet, and may undergo some change in the
future. We'll see. They're working just fine from my perspective, but I haven't
been following the lower level technical details.

## What are labelers?

A *Labeler* is a service that applies *labels* to content or accounts. As a user,
you can subscribe to a particular labeler, and then have your experience change
based on the labels on posts.

A labeler can do this via whatever method it pleases: automatically by running
some sort of algorithm on posts, manually by having some human give a thumbs
up or thumbs down, whatever method the person running the labeling service
wants.

An example of a labeling service would be a blocklist: a label on the posts
authored by people whose content you don't want to see. Another example is
an NSFW filter, which may run some sort of algorithm over pictures in posts,
and labeling them if they believe they contain NSFW content.


Labeling exists, but I do not believe you can run your own labeler yet. BlueSky
runs their own, but there hasn't been an external release that I am aware of.
But once they do, you can imagine communities running their own services, adding
whatever kind of labels they'd like.

## How does moderation work in atproto?

Putting this all together, we can see how moderation works: Feeds may choose to
transform the feed based on labels, or App Views may take feeds and apply
transformations based on asking a Labeler about it. These can
be mixed and matched based on preference.

This means you can choose your moderation experience, not just in applications,
but also within it. Want a SFW feed, but allow NSFW content in another? You
can do that. Want to produce a blocklist of people and share it with the
world? You can do that.

Because these moderation tools work at the network level, rather than at the
application level, they actually go *further* than in other systems. If someone
builds an Instagram clone on atproto, that could also use your blocklist
labeller, since your blocklist labeller works at the protocol level. Block
someone in one place, and they can be blocked on every place, if you so choose.
Maybe you subscribe to different moderation decisions in different applications.
It is 100% up to you.

This model is significantly different from other federated systems, because
you don't really have an "account" on an "instance," like in Mastodon. So a lot
of people ask questions like "what happens when my instance gets defederated"
which don't exactly make sense as stated. You can achieve the same goal, by
blocking a set of users based on some criteria, maybe you dislike a certain
PDS and want to ignore posts that come from a certain one, but that is *your*
choice and yours alone, it is not dictated by some "server owner" that your
account resides on.

So if you don't have a home server, how does identity work?

## How does identity and account portability work?

There are a LOT of details to how identity works, so I'm going to focus on the
parts that I find important. I am also going to focus on the part that is
controversial, because that is important to talk about.

At its core, users have an identity number, called a "Decentralized Identifier,"
or *[DID][did]*. My DID looks like this: `did:plc:3danwc67lo7obz2fmdg6jxcr`.
Feel free to follow me! Lol, of course that's not the interface that you'll see
most of the time. Identity also involves a *handle*, which is a domain name.
My handle is `steveklabnik.com`, unsurprisingly. You'll see my posts on BlueSky
as coming from `@steveklabnik.com`. This system also works well for people who
don't own a domain; if you sign up for BlueSky, it'll give you the ability to
choose a name, and then your handle is `@username.bsky.social`. I started off
making posts as `@steveklabnik.bsky.social`, and then moved to
`@steveklabnik.com`. But because the DID is stable, there was no disruption to
my followers. They just saw the handle update in the UI.

You can use a domain as your handle by getting the DID your PDS generated for
you, and then adding a `TXT` record in the DNS you use for that domain. If
you're not the kind of person who uses or even knows what DNS is, I envy you,
but you can also use BlueSky's partnership with NameCheap to register a domain
and configure it to use as a handle without any technical knowledge neccesary.
You can then log into applications with your domain as the handle, and
everything works nicely.

This is also how BlueSky delivers true "account portability," partially because,
well, there isn't really a concept of an account. The person who uses a given
DID uses cryptography to sign the content they create, and then that content
is replicated across the network. "Your account" can't really be terminated,
because that would mean someone forcibly stopping you from using keys that they
don't even have access to. If your PDS goes down, and you want to migrate to
a new one, there's a way to backfill the contents of the PDS from the network
itself, and inform the network that your PDS has moved. It is real, meaningful
account portability, and that is radically different from any similar service
running today.[^1]

But.

The devil is in the details, and I think this is one of the more meaningful
criticisms of BlueSky and atproto.

You see, there are different "methods" of creating a DID. BlueSky supports
two methods: `did:web`, which is based on domain names. There are some drawbacks
with this method that I don't personally fully understand well enough to describe,
I'm sure I'll write something in-depth about DIDs in the future.

So because of that weakness, BlueSky has implemented their own DID method,
called `did:plc`. The `plc` stands for "placeholder," because even though
they plan on supporting it indefinitely, it too has its weaknesses. And that
weakness is that it involves asking a service that BlueSky runs in order to
resolve the proper information. For example, [here is my lookup][plc-dir].
This means that BlueSky can ban you in a more serious way than is otherwise
possible thanks to the network design, which some people take to be a very
serious issue.

So, is the flaw fatal? I don't think so. The first reason is, if you really don't
want to engage with it, you can use `did:web`. Yes that isn't great for other
reasons; that's why `did:plc` was created. But you do get around this issue.

Another is that the BlueSky team has demonstrated, in my personal opinion,
enough understanding and uncomfortableness with being in control here, and it's
designed in such a way that if other, better systems develop, you can move
to them. They've also indicated that moving governance of `did:plc` to some sort
of consensus model in the future is possible. There are options. Also, others
could run a `did:plc` service and use that instead if they prefer, too.

I personally see this as an example of pragmatically shipping something, others
see it as a nefarious plot. You'll have to decide for yourself.

## How is BlueSky built on top of atproto?

So, now that we understand atproto, we can understand BlueSky. BlueSky is
an application built on top of the atproto network. They run an App View, and
[a web application][bsky] that uses that App View to work. They also run a PDS
for users that sign up through the web app, as well as a relay that those PDSes
communicate with.

They publish two Lexicons, one as `com.atproto.*` and one as `app.bsky.*`. The
former are low level operations that any application on the network will need,
and the ones specific to BlueSky are in the latter.

But one nice thing about BlueSky in particular is that they've taken the product
goals that nobody should know any of this nerd shit to be able to use BlueSky.
The lack of instances means there's no "I need to pick an instance to create an
account" flow, and the portability means that if my host goes down, I can move,
and my followers are none the wiser.

## How will others build applications on top of atproto?

You can create an atproto app by creating a Lexicon. You'll then want to run
an App View that does things with data on the network involving your lexicon,
and your application will want to give people the ability to write data to their
PDS using your lexicon.

I myself am considering doing so. We'll see.

## Concluding thoughts

So yeah, on the technical side of things, that's an overview of how atproto and
BlueSky work. I think this design is very clever. Furthermore, I think the
separation of concerns between atproto and BlueSky are very meaningful, as having
a "killer app" for the network gives a reason to use it. It also is a form of
dogfooding, making sure that atproto is good enough to be able to build real
applications on.

I'm sure I'll have more to say about all of this in the future.

[at-protocol]: https://atproto.com/
[atp-overview]: https://atproto.com/guides/overview
[quiet-posters]: https://bsky.app/profile/did:plc:vpkhqolt662uhesyj6nxm7ys/feed/infreq
[the-gram]: https://bsky.app/profile/did:plc:vpkhqolt662uhesyj6nxm7ys/feed/followpics
[bangers]: https://bsky.app/profile/did:plc:q6gjnaw2blty4crticxkmujt/feed/bangers
[did]: https://www.w3.org/TR/did-core/
[plc-dir]: https://plc.directory/did:plc:3danwc67lo7obz2fmdg6jxcr
[bsky]: https://bsky.app/
[^1]: A commentor points out https://book.peergos.org/, which I had not heard of,
      but apparently was known to the creators of BlueSky before they made it. Neat.
