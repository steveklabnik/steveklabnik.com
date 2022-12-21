---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Protocol and language"
pubDate: 2012-09-03
blog: words
---


This is the second part of my series on protocol. The [first part](http://words.steveklabnik.com/protological-control-an-introduction) contained a lot of background information, but now we’re ready to get into what Protocol actually *is*.

---

I live in a pretty unique place, [the Farmhouse](http://farmhouse.la/). It’s a psuedo-public space in which we live, others work, and everybody has a good time. We do have [some rules](http://farmhouse.la/rules), though:

![http://farmhouse.s3.amazonaws.com/images/home/farmhouse-rules-chalkboard-wall-by-heather-peterson.jpg](http://farmhouse.s3.amazonaws.com/images/home/farmhouse-rules-chalkboard-wall-by-heather-peterson.jpg)

They’re written up on the wall in chalk. Since we have lots of visitors to the house, and these are hard and fast rules, it’s important that we communicate them in a clear way. These rules form the protocol of our house. Phrased another way, they’re the rules that govern the way that we interact with each other and the house itself while at the house.

Ultimately, this is what protocol is: a language. To Galloway, protocol is a very specific kind of language:

> Protocol is a language that regulates flow, directs netspace, codes relationships, and connects life-forms.
> 

Some of these properties are contradictory. Stated more accurately, there exists a tension between opposing forces within protocol itself. Let’s expand on these meanings.

## ‘regulates flow’

If you’ve ever read *1984*, you’re familiar with linguistic relativity, more commonly known as the Sapir-Whorf hypothesis.

> How could you have a slogan like “freedom is slavery” when the concept of freedom has been abolished?
> 

What’s truly interesting is that Orwell himself actually advocated for simplifying language in [Politics and the English Language](http://www.resort.com/~prime8/Orwell/patee.html), but specifically because he felt more complicated language was *obfuscatory*, not illuminating.

In any case, language enumerates the possible, and while [some languages can have really long words](http://en.wikipedia.org/wiki/Longest_words#German), ultimately, any language will have some things that are not expressible. [This often happens with translations](http://byfat.xxx/rien-ne-tient-en-place).

If you are the proud recipient of a computer science degree, you may have run into the [Chomsky hierarchy](http://en.wikipedia.org/wiki/Chomsky_hierarchy) in your compilers class. If you weren’t required to take a compilers class, please call up your alma mater and demand a refund. Here is the hierarchy:

1. unrestricted grammars
2. context-sensitive grammars
3. context-free grammars
4. regular grammars

As you go up the hierarchy, each language type is enclosed by the type above it. All context-sensitive grammars are unrestricted grammars, and all context-free grammars are context-sensitive.

Regular expressions are one area where a language was forced to move up the hierarchy in order to express more things. Strictly speaking, a regular expression cannot match nested parenthesis. If you are interested in the math, the [Pumping Lemma](http://en.wikipedia.org/wiki/Pumping_lemma_for_regular_languages) demonstrates why. However, this kind of thing is useful, and so extensions were developed that move them up the chain. [Now you can write this](http://perldoc.perl.org/perlfaq6.html#Can-I-use-Perl-regular-expressions-to-match-balanced-text%3f):

> qr/(<(?:[^<>]++|(?1))*>)/
> 

Maybe Orwell was on to something.

Others have speculated that linguistic relativity would also apply to software. Two notable examples are Kenneth E. Iverson, who created APL, and Paul Graham, Lisp enthusiast and investor extraordinaire. Iverson wrote a paper titled [“Notation as a tool of thought”](http://www.jsoftware.com/papers/tot.htm), which begins:

> The importance of nomenclature, notation, and language as tools of thought has long been recognized.
> 

Graham authored an essay called [“Beating the Averages”](http://www.paulgraham.com/avg.html) in which describes the ‘Blub paradox’. The paradox relies on linguistic relativity:

> You can’t trust the opinions of the others, because of the Blub paradox: they’re satisfied with whatever language they happen to use, because it dictates the way they think about programs.
> 

I don’t mean to rain on the relativity parade, but there’s one small detail that we haven’t considered: Turing completeness. At the end of the day, most programming languages are Turing complete. This means that COBOL can do everything Lisp can, and PHP can do everything that Ruby can.

So are Graham and Iverson wrong?

Turns out there are two variations of linguistic relativity: *strong* relativity states that language **determines** thought, and *weak* relativity that states language **influences** thought. This was coined later, as it would seem that current research has found little evidence to support strong relativity, but some to support the notion of weak relativity. Graham notes this, and confines the paradox to the realm of weak:

> All languages are equally powerful in the sense of being Turing equivalent, but that’s not the sense of the word programmers care about. (No one wants to program a Turing machine.)
> 

To put it another way, language features create friction that encourages or discourages certain modes of thinking.

Python and Ruby are two very similar languages, yet they engender very different styles. One area in which this division is sharp is first-class functions. Both languages have them, but Python’s are simply expressions rather than fully-featured . [Guido van Rossum likes them this way](http://www.artima.com/weblogs/viewpost.jsp?thread=147358):

> But such solutions often lack “Pythonicity” – that elusive trait of a good Python feature. It’s impossible to express Pythonicity as a hard constraint. Even the Zen of Python doesn’t translate into a simple test of Pythonicity.
> 

Guido specifically wants to limit the scope of language in order to encourage a particular style of thinking about problems: a Pythonic one.

Galloway is very explicit about this regulation.

> Protocol is synonymous with possibility. From the perspective of protocol, if you can do it, it can’t be bad, because if it were bad, then it would have been outlawed years ago by protocol.
> 

## ‘directs netspace’

After that massive first part, I’m basically going to punt on the second. I don’t find it very interesting or worth elaborating on: languages and protocols direct the direction of the Internet. I don’t think anyone disputes this.

## ‘codes relationships’

Communication has an intimate connection to relationships. The act of communicating is what creates the relationship in the first place. And language is the encoding of that particular relationship.

In “A user’s guide to Capitalism and Schizophrenia: Deviations from Deleuze and Guattari,” Brian Massumi discusses an example of marriage vows:

> A particular man and a particular woman say “I do.” Their words undoubtedly have personal meaning for them in their heart of hearts. But their personal intention is not in itself responsible for the magical transformation that has touched their lives. What has brought them to say these words and what makes those words effectively transformative is too big to fit into a single mid. It is a complex interplay of laws, customs, social pressure, and tax law.
> 

Marriage is a social protocol that encodes a particular relationship. Once that relationship has been encoded, it’s made legible to others who weren’t privy to the details of that relationship. A wedding ring is only one form of relationship encoding; a couple holding hands is a similar example, whose bond is weaker both in symbol as well as in reality.

In the software world, HTTP encodes relationships as well. The client/server relationship is integral to the protocol’s design, as Roy Fielding [describes in section 3 of his dissertation](http://www.ics.uci.edu/~fielding/pubs/dissertation/net_arch_styles.htm#sec_3_4_1):

> A client is a triggering process; a server is a reactive process. Clients make requests that trigger reactions from servers. Thus, a client initiates activity at times of its choosing; it often then delays until its request has been serviced. On the other hand, a server waits for requests to be made and then reacts to them. A server is usually a non-terminating process and often provides service to more than one client.
> 

He further goes on to describe why this relationship is important:

> Separation of concerns is the principle behind the client-server constraints. A proper separation of functionality should simplify the server component in order to improve scalability. This simplification usually takes the form of moving all of the user interface functionality into the client component. The separation also allows the two types of components to evolve independently, provided that the interface doesn’t change.
> 

In other words, the protocol encodes the relationship so that others know what a client should do, and what a server should do.

If you remember our good friend Saussure, you’ll remember that he made this encoding explicit, and in fact central to language itself. While Saussure’s work isn’t directly useful to linguists in the present, much of his work is foundational to the ways that we approach language today.

One of the most fundamental concepts in structural linguistics is the ‘sign,’ and its component parts, the ‘signifier’ and the ‘signified.’ The signified is a particular concept, and the signifier is the way the signified is expressed. A sign is a combination of a signifier and a signified. Seems pretty simple, but Saussure also posited that a sign can only gain [meaning](http://en.wikipedia.org/wiki/Meaning_(semiotics)) and [value](http://en.wikipedia.org/wiki/Meaning_(semiotics)) within their relationship to other signs, which means that you cannot consider an idea outside of the way in which the idea is expressed.

The study of signs is called [semiotics](http://en.wikipedia.org/wiki/Semiotics). In Semiotics, a particular set of conventions used to convey meaning are called [codes](http://en.wikipedia.org/wiki/Code_(semiotics)). Hence ‘encoding’ can also refer to this kind of code, as well.

Hence, if we combine Fielding, Galloway, and Saussure, the word ‘client’ is a signifier that holds a relationship to the signified concept ‘a triggering process’ (among other things), that forms the sign ‘client.’ This is encoded by the protocol HTTP.

## ‘connects life-forms’

From the Massumi marriage example:

> Say “I do,” and your life will never be the same. Your legal, social, and familial status instantly changes, along with your entire sexual, psychological, and financial economy. You have been pronounced man and wife. You may file a joint tax return.
> 

This connection is related to the previous coded relationship. In this case, ‘connects’ is an active verb rather than a passive noun. It not only *creates* a connection, but it ‘connects’. It not only relates two objects, it *is* the relation.

We spent most of the last section discussing connections, though, so let’s get to the interesting part: life. Galloway is very explicit about the role protocol plays with life:

> …protocol is an affective, aesthetic force that has control over “life itself.”
> 

In [the Exploit](http://www.amazon.com/The-Exploit-Networks-Electronic-Mediations/dp/0816650446), Galloway discusses the relationship between life and protocol as well:

> While the first type of network (Internet protocols) is silicon based and may use biological concepts (intelligent agents, artificial life, genetic algorithms), the second (DNA algorithms) is fully biological and yet recodes itself in computational terms (biology as computation, as opposed to evolution)
> 

The relationship between life and software is an interesting one.

![http://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif](http://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif)

In Conway’s game of life, one builds cellular automata and lets them go. There are a few simple rules that govern their reproduction, death, and life. This protocol governs all that happens within the game. Someone playing the game is an impotent god, as there is no room in the protocol for communicating with creations. Likewise, creations have no way of perceiving an ‘outside’ of the game.

Galloway references this quote by Frederick Cohen from [A Short Course on Computer Viruses](http://www.amazon.com/Course-Computer-Viruses-Professional-Computing/dp/0471007684):

> I personally believe that reproducing programs are living beings in the information environment.
> 

Viruses, Conway cells, [Sims](http://thesims.com/en_us/home), and all other kinds of ‘artificial life’ exist inside of computers. They’re native to protocol. But what about actual, real life?

Galloway reaches to Norbert Wiener, a mathematician who was the originator of cybernetics, for this:

> if one views the world in terms of information, then there is little instrumental difference between man and machine since both are able to affect dynamic systems via feedback loops. In this way the cybernetic system of man and machine are born. Its virtues are balance, self-regulation, circularity, and control. In a word, protocol.
> 

Deleuze also forms a connection between life and information in [“Postscript on the Societies of Control”](http://www.n5m.org/n5m2/media/texts/deleuze.htm):

> The numerical language of control is made of codes that mark access to information, or reject it. We no longer find ourselves dealing with the mass/individual pair. Individuals have become “dividuals,” and masses, samples, data, markets, or “banks.”
> 

A *dividual* is a play on the process of [individuation](http://en.wikipedia.org/wiki/Individuation). Galloway elaborates:

> Deleuze’s neologism comes from the word ‘individuate.’ Dividuation would thus be the opposite: the dissolving of the individual entity into distributed networks of information.
> 

Let’s use a personal example to demonstrate life submitting itself to dividuation in order to interface with protocol: me. [This is my personal website](http://steveklabnik.com/). In it, my public face on the Internet, I’ve split myself up into five broad categories, and link out to all of the various sub-components. Examining the last category, you can see how if you just follow me on twitter [;)](https://twitter.com/steveklabnik), you will not get the whole picture. You could also [check out my code on GitHub](https://github.com/steveklabnik), but that wouldn’t be me, either. Even the sum of these two components would not tell you everything about me. Yet I can’t possibly put *me* on the network. I must break ‘me’ into a form that conforms with protocol.

Finally, there’s an important relationship with Foucault’s concept of ‘biopolitics.’

> Foucault defines biopolitics as “the endeavor, begun in the eighteenth century, to rationalize the problems presented to governmental practice by the phenomena characteristic of a group of living human beings constituted as a population: health, sanitation, birthrate, longevity, race.”
> 

Obviously, dividuating a population into informational components would be relevant to protocol. And, in fact, life provides a path to resist protocol. Deleuze in his book *Foucault* (because that’s not confusing…):

> When power becomes bio-power resistance becomes the power of life, a vital power that cannot be confined within species, environment or the paths of a particular diagram.
> 

Galloway expands:

> Is life resistance a way of engaging with distributed forms of protological management? Part III of this book, “Protocol Futures,” answers yes. While the new networked technologies have forced an ever more reticent public to adapt to the control structures of global capital, there has emerged a new set of social practices that inflects or otherwise diverts these protological flows toward the goal of a utopian form of unalienated social life.
> 

## To conclude

Protocol has an intimate and complex relationship with language. In many ways, it is a particular language, with all of the expressive power and limiting abilities that that brings.

The implications of this language, though, will have to wait for another time.
