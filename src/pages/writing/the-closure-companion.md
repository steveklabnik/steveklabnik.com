---
layout: ../../layouts/MarkdownPostLayout.astro
title: "The CLOSURE companion"
pubDate: 2013-09-19
blog: words
---


Today is the fourth [_why day](http://whyday.org/). So I thought I’d say a few words about his final gift to the rest of us, [CLOSURE](http://words.steveklabnik.com/closure).

## Be Skeptical

First, a few words about the words I’m about to write. Software developers (though you don’t have to be one to read this) love meta, so surely you’ll indulge me for these next few paragraphs. Don’t worry, it’s only a little bit of meta-data.

> And if you don’t understand some of my language, things like “Open GL” and “fighting NULL” and so on, you can skip it and be fine I think. - _why, CLOSURE
> 

> Nowadays people are actually somewhat jaded by the term ``postmodern’’. Well, perhaps jaded is an understatement. Nauseated might be more like it. - Larry Wall, “Perl, the first post-modern programming language”
> 

> I define postmodern as incredulity toward meta-narratives, - Lyotard, “The Postmodern Condition: a report on knowledge”
> 

_why’s work has always taken on a strong element of the postmodern, and CLOSURE is no different. So in order to really get CLOSURE, you need to get a little postmodern. So let’s breifly examine this statement by Lyotard.

A ‘narrative’, to Lyotard, is a story that organizes tribal knowledge, the structure of our life and society. Therefore, a meta-narrative is a narrative about a narrative. As an example, let’s say you want to make sense of programming languages. A meta-narrative about programming languages would be that in the beginning, we started off with assembly language. Then we moved forward to structured programming, with Pascal and C and such. Next came object oriented languages, which is where we’re mostly at today. We’re starting to finally lean functional.

Now, this narrative works. It’s not *wrong*. But it also isn’t really *true*, either. After all, Lisp existed waaaay before the contemporary moment, yet it’s often functional. Actually, presenting Lisp as functional is in of itself not exactly true. So this meta-narrative, while it helps us understand a bit about programming languages and their history, also has a bunch of lies. It’s not black and white, it’s quite gray.

> "Well, it doesn’t matter – no one’s going to listen to either of us. I can say whatever I want at this point. You can tell the truth and no one would care.“That’s amazing.”“I’m going to change my story weekly – the more confusion the better. The Jonathan story is locked.”_why, CLOSURE, HELLOYES (p56)
> 

So what I’m saying is this: I’m about to present you with a meta-narrative about CLOSURE. So be skeptical of me! What I’m about to tell you is a lie, I swear. Don’t take what’s about to come as the final word, some sort of actual truth. It’s just my own little anti-memory that I’d like to share with you.

## What CLOSURE is

CLOSURE is a few different things. 90% of what you need to know is located in [DISCLAIMER](https://github.com/steveklabnik/CLOSURE/blob/master/PDF/DISCLAIMER.pdf), which is page 13 of CLOSURE. In it, _why mentions a few things:

1. It’s ‘perilous to communicate this way’
2. Everything he’s done belongs to us
3. He likes what we’ve done so far
4. This will be the last thing from him.

#4 is a big deal. No more waiting for _why to come back. That’s it. No more questions, no more wondering, no more guesses. This is all we have.

For me, #3 was the most important. It brought me to tears, to be honest. That’s what I personally really needed to hear. It’s very strange to take up the work of someone you’ve never met, and make their life’s work your own. I spent quite a bit of time really wondering if keeping some of his stuff alive was the correct thing to do, and so this was a big relief. It was all gravy after that. #2 is related, it’s all public domain. That’s good to know.

## Identity

#1 is interesting. It could just be flavor, but I think it’s something more than that. One of the major themes of CLOSURE is identity, and _why / Jonathan ’s struggles with it. On page 19:

> Now, could you please tell me the point of this ridiculous anonymity exercise, hmm?As it turns out, oddly enough, your real self is just an unknown programmer from Utah. The myth is that easily dispelled. Why not making something of your real self? (Of course I know why and can tell you: Because your fear of the world has clouded your ability to do things to improve your situation. You are stuck there in Draper, Utah, until you can cut through the paranoia!)Please, Mr. Gillette, come on in. The water’s fine. ;)Emery Pestus, CLOSURE
> 

While many hold _why as some kind of superhero, it’s really important to remember that he’s human. We, the Ruby community, placed an indescribable amount of pressure on a human being to play a character for us, without consideration for his feelings. Think about this for a moment: could Jonathan ever write Ruby code? As Jonathan? What if it had unit tests? If it was just some old, normal, boring gem that added a little feature to Rails?

Could we let him just be him? I’m not sure. I’m not sure he could let him just be him, either.

Once, I met someone for dinner in Chicago. This was the first time we’d met, and so we were asking each other a lot of questions. One of my answers yielded an interesting response: “Oh, you’re like actually for-real. All that twitter stuff isn’t an act. That’s really you.”

## Impermanance

Impermanence is possibly the biggest question raised in CLOSURE.

> kafka would be a lot harder to get into if the trial only ran on a power pc. - one of _why’s last tweets
> 

This tweet was really confusing, until CLOSURE. _why reveals that one of his biggest problems is what we call ‘bitrot’: you can’t just write a program, it must be updated. I have one of the first C programs I ever wrote, from when I was 12, and it wouldn’t compile on a modern system, due to a ‘clear screen’ function I wrote that interacted with the hardware that I owned at the time. I don’t have any of the GW-BASIC programs that I wrote as a child, because there was no way to transfer the source off of the computer: I didn’t have a disk drive, they were too expensive.

And so it is with Kafka. Right before he died, Kafka asked his friend Max Brod to burn everything he ever wrote. Brod published it instead. _why brings up that if The Trial was written for the PowerPC, he wouldn’t have needed Brod to burn it: it would have just naturally gone away.

Our industry is constantly changing, and that’s great. But we have no institutional memory. We keep making the same mistakes, over and over again. _why talks about fighting NULL, and how that was his biggest struggle as a programmer. The guy who invented null pointers, Tony Hoare, calls it [“my billion dollar mistake”](http://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare). Yet Go has null pointers.

It’s really easy to burn out. I won’t lie, when _why deleted himself, I thought it was a terribly silly idea. But the more stuff I do, the bigger my projects and responsibilities get, and the more of a public person I am, the more it sounds appealing.

When I had a shitty band in high school, I wrote a dumb song after a girl dumped me called “The Only Constant is Change.” I thought it was clever at the time.

## The Software Industry

Speaking of the industry, and burnout, that’s the last part of CLOSURE, and the hardest. The entire end of the book is about it, and it’s a very obvious, very ridiculous allegory.

There is a cult of Steve Jobs, and they speak incorrect French. They obsess over these flutes, and the flutes can make more flutes, and when one of them gets old and dies, they forget him immediately. When a new person is born, they start worshipping him, and induct him into the cult as quickly as possible, by clothing him in blue jeans and a black turtleneck. The cult members never eat any food.

The cult is programmers, the flutes are programming. It all falls out of that. Songs on the flute always start with C#, which I found amusing.

> It occured to me that they could use the flutes to describe a whole landscape, to transfer a map from one man’s mind to another._why, CLOSURE, page 84: SPAWN
> 

There’s also a really fantastic comparison between Steve Jobs and Bill Gates, as well as an angel investor who wants to invest in _why: I highly recommend that part.

> For instance, many people struggle with acceptance, feeling like they aren’t accepted by other people. But what I deal with is primarily hatred of entrepreneurs. But it’s something that I’m always working on and I’ve gotten much better.
> 

I’ve come to realize that I’m starting to become a grumpy old man. These damn kids never learn from their elders, we solved all the world’s problems back in the 60s and 70s, and they don’t know anything. I wish we had a better way to transfer institutional knowledge and stop repeating ourselves.

## Some final thoughts

There is so much more that’s enjoyable in CLOSURE. Please check out the full thing, even if you don’t get all of it. For example, the part on Neil Gaiman is amazing.

I hope these jumping off points helps you in your journey. Let’s all have some fun with programming, okay?
