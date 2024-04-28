---
title: "Why is Clojure so stable?"
pubDate: 2018-12-18
blog: words
---


There’s been some Programming Language Discourse lately, and I have some thoughts. It’s mostly centered around [a comment on the orange website](https://news.ycombinator.com/item?id=18702802):

> I would put it simply: Clojure was designed by a thinker, who creates when he is away from the keyboard, not in front of it. When one releases and breaks the code in his head first, very few breaking changes are left for the public releases.
> 

I think, regardless of this person being right or wrong, there’s an interesting question here. Let’s look at [the comment this is ultimately responding to](https://news.ycombinator.com/item?id=18701834):

> From the perspective of a (fairly large-scale at this point) app developer: I find it great that Clojure places such emphasis on backwards compatibility. In general, migration to newer Clojure versions is completely painless.The language has been designed by experienced and mature people and doesn’t go through “let’s throw everything out and start again” phases like so many other languages do.
> 

Clojure has a well-deserved reputation for stability. The argument is not about that, but about *why* Clojure is so stable.

## Individuals and their greatness

A lot of people, like the original commentator, believe that Rich, the BDFL of Clojure, is responsible. I think Rich deserves a lot of credit, but at the same time, this explanation is a little bit too close to the “great man theory of history.” The Great Man theory was originally proposed in the mid 1800s by Thomas Carlyle, and goes something like this: "“the history of the world is but the biography of great men.”

> Don’t get me started about Carlyle, who was a pretty terrible guy even in his own day. A lot of the alt-right, “Dark Englightenment”, and Neo-reactionary folks consider him a really important thinker, and that’s all I’ll say about that.
> 

What this *means* is that Important Men make big decisions, and that the lives of the rest of us are irrelevant in the scheme of things. He cited people like Shakespeare, Martin Luther, and Napoleon. In Carlyle’s mind, history was changed by these men and them alone. The French Army didn’t win wars, Napoleon won wars.

I tend to subscribe to the opposite, that is, “history from below,” or “a people’s history,” which emphasizes the army over Napoleon, the worker over the CEO. A critic of Carlyle’s, Herbert Spencer, said this:

> You must admit that the genesis of a great man depends on the long series of complex influences which has produced the race in which he appears, and the social state into which that race has slowly grown. … Before he can remake his society, his society must make him.
> 

That is, we have to look at historical context to see what created these changes, not just a few famous individuals.

> Two sidebars here: first, Spencer is the person who coined the phrase “survival of the fittest.” Second, there is an irony in framing this particular philosophical debate about if individuals or history cause historical change by citing well-known opinions of two individual men. This idea was so popular, and still is, that it’s something many of us latch onto, sometimes subconsciously, even those who don’t believe it!
> 

So, beyond Rich, who as I said before, does deserve a lot of credit… why might Clojure be so stable? I can think of three reasons. There may be more, but these are what comes to my mind.

## Clojure is a Lisp

First of all, Clojure is a Lisp. This has a wide array of reasons why stability is a bit easier than in other languages.

The first is Lisps’ lack of syntax. Most languages have updates that introduces new syntax. As this grows larger and larger, the design space gets more and more constrained, making updates harder and harder. Lisps, on the other hand, rarely grow syntactically. Clojure has more syntax than most Lisps, but it still has far less syntax than non-Lisp languages.

Another perspective of this is homoiconicity. This property means that “new syntax” for Lisps can be introduced through macros, and not through the base language. In most other languages, users cannot extend the language to provide new syntax, but in Clojure, they can.

Lesson: the smaller your core language, the more stable you can be.

## Clojure is dynamically typed

There are many, many, many ways to debate the virtues of static typing against those of dynamic typing. However, one area in which dynamically typed languages clearly win out, in my mind, is that they have a wider set of tools at their disposal to make changes without breaking code. This cuts both ways; they also make it much, much harder to know if you’ve broken code as well. Those are able to be mitigated through a variety of techniques, and we can argue about the tradeoffs here, but I think the possibility of advantage is plainly clear.

Lesson: it can be easier to change a dynamic system than a static one. This is both good and bad, but for now we’re focused on the good.

## Clojure’s development is pretty slow

Clojure famously optimizes contributions around Rich and his process, at the expense of others. Debating this has been a real sore spot lately, and I don’t mean to pile onto this part of the discussion. I’m not interested in suggesting, in this blog post, if this is good or bad. I’m interested in the effects it has.

If we ask [GitHub how many commits were between 1.0 and `master`](https://github.com/clojure/clojure/compare/1.0...master), the answer is 1,957. If we look at [commits between 1.9.0 and 1.10.0](https://github.com/clojure/clojure/compare/clojure-1.9.0...clojure-1.10.0), we get 138 commits. Clojure 1.9 was released December 8, 2017. Clojure 1.10 was released December 17, 2018. That’s 138 commits for that release, for a year.

In contrast, [between 1.30 and 1.31](https://github.com/rust-lang/rust/compare/1.30.0...1.31.0), six weeks of development, Rust had 1,694 commits. that’s almost as many as Clojure has had in the last nine and a half years.

Lesson: It’s much easier to keep things stable when you don’t change as often.

---

All of these factors tie into each other. Clojure doesn’t need to change as much, since the core language is a Lisp. When it does need to change, it has good tools at its disposal to change. Also, note that Rich was the one who made a lot of these decisions! He absolutely deserves credit for a job well done, even if I think that there are many other factors at play.

Furthermore, ascribing this entirely to Rich makes it harder for other languages to learn good lessons from Clojure’s successes; they can’t just get a Rich. By digging in a bit deeper, we can apply these lessons a bit more broadly. Good language design requires taking a sober look at various tradeoffs, and making the best decision you can make, regardless if you’re a BDFL or part of a language design team.
