---
title: "A eulogy for my 20s"
pubDate: 2016-01-24
blog: words
---

Today is the last day of my 29th year of existence. I’ve been thinking about it a lot, which is extra strange because I don’t generally care about birthdays. I’m not much of one for holidays in general. So why do I care about this one?

My 20s have been an extreme period of growth. At the start of it, I thought that I was going to live in my little farming town, get married to The Girl, go to mass every Sunday, and pretty much do exactly what everyone else I knew had done. If you’re reading this, well, you know a very different me. Before my 20s, I had only left the country once, a short trip to Toronto. I had barely even left my state. I was smart, but cocky, and incredibly sheltered. I was the very embodiment of a stereotype.

I’ve come a long way.

The root of my anxiety about being 30 comes from something that my brain is constantly whispering into my ear: “You don’t have enough time.” There’s sort of two sides to this; I think: the first is how much I’ve changed in this decade, and the second is a particularly toxic attitude of the industry I’ve immersed myself in.

I feel pretty dumb about this post overall, but whatever. Please just take this as a brain dump from this morning, not some sort of grand, planned essay about how I know all the things or something.

## Identity is a function

Have you ever played around with [lambda calculus](http://www.utdallas.edu/~gupta/courses/apl/lambda.pdf)? I myself only know the basics, I’m not a particularly math-y person. Here’s a short introduction: say we have a function. This function is very simple, it returns its single argument. In other words, the identify function:

```
fn id(x) {
    return x;
}
```

(Making this syntax up, though it will look sort of like Rust without types.)

We can write another function, `zero'()`, like this:

```
fn zero'(f, g) {
  return g();
}
```

In other words, `zero'()` takes two functions, `f` and `g`. It then calls `g()`, ignoring `f()`. This will make sense in a moment, we just need one more function: `succ()`

```
fn succ(f, g) {
    return f(g());
}
```

This function, short for “successor”, applies `f()` to `g()`, one time.

With these tools, we can represent all of the natural numbers. This is called [Church numerals](https://en.wikipedia.org/wiki/Church_encoding#Church_numerals), and here’s how it works:

```

let zero = zero'(succ, id); // zero any function applied to id zero times.
let one = succ(succ, zero); // one is succ() applied to zero
let two = succ(succ, one); // two is succ() applied to one
let three = succ(succ, two); // three is succ() applied to two
```

And so on. Now I have this crippling fear that I’ve messed up the notation, trying to transform it into something that looks more like “normal” programming. I’m sure that someone on the Internet is going to find some kind of flaw and call me an idiot over it.

Ahem.

Anyway, this is the core idea: you can count the number of times you’ve applied a function to identity, and that encodes the number you’re trying to represent. We don’t need state to represent numbers and counting, we can do it all through functions.

The concept of “identity” is a really important one in philosophy. You can take all kinds of approaches here. One classic approach is called “Platonic idealism”, also known as “essentialism.” Essentialism states that you can tell the identity of something by the properties it has. For example, a chair is a chair because it has a platform for you to sit, it has four legs, and a back.

The problem with essentialism is that well, there are things that you or I would reasonably call a chair that has three legs, or five or six. Not all things that have a place to sit can be called a chair, either. In other words, while it sounds reasonable at first, the real world absolutely destroys this kind of categorization, in my opinion.

So what do you do? Another solution to this question is posed by a really broad family called ‘process philosophy.’ The solution to identity there is based around movement, change, becoming. Function application. A “chair” is a particular kind of object that participates in a world like other things that we call “chairs”. In other words, identity is something that comes out of *doing*, not *being*.

I am not the person I was ten years ago, quite literally. My body is made up of various kinds of cells, and they die at different rates. At a cellular level, I am quite literally dying all the time, in various microscopic places, and I am also regenerating. New cells are being produced. I am quite literally not my past self at a cellular level. And once I finally die, it’s not like my cells also instantly die either. Some of them will live for a period of time after I’m dead, though not for long. Bits of my body will actually out-live me.

Life is full of growth and change. But at this point, the function has been applied so many times that I barely even recognize my past self. It makes me feel like I’m starting *now*, so late into the game! I’ve wasted the earlier years of my life on all kinds of dumb and bad things.

I constantly feel that I am running out of time, that I have not done enough, that I will be a failure. That my work will not be meaningful enough to be remembered, or worse, will be remembered as bad. When I express this kind of feeling, people often point this out:

![https://svbtleusercontent.com/yteofannex78va_small.png](https://svbtleusercontent.com/yteofannex78va_small.png)

This doesn’t make me feel better, it makes me feel worse. There are so many things that I want to do that I’m *not* working on. That hypermedia book still isn’t done. I have been a bad maintainer of Resque and all my other Ruby stuff. I didn’t listen to my friends in Greece, who told me to relax, and then the exact situation they predicted happened. I just hope I’m around long enough to make an impact on people and be a positive change in the world. We’ll see if I make it.

There’s a whole ’nother rant here about Camus and Heidegger and absurd-ism and being-towards-death too. I will save that sophomoric rant for my “I’m turning 40” post.

## Youth Cults

The second thing that’s making me feel terrible about turning 30 is the goddamn computer industry. It’s extra worse because historically, I have benefited from this particular terrible attitude. And that’s the worship of youth.

I used to teach new programmers, and often give talks to classrooms full of them. They always want to know how I got started, and I always preface it with something like

> My story is one I don’t like to share, because I’m the living embodiment of a stereotype that I think is harmful to new programmers.
> 

I started with computers when I was seven. That shouldn’t matter. I’ve learned more about software in the last five years than I did from seven till I was 18. But we hold up these young genius whiz-kids (and let’s be serious, it’s not ‘kids’, it’s ‘boys’) as the epitome of what our industry can do. The heroic youth who understands computers better than those silly old people. What do they know, anyway?

Age discrimination is real. It’s stupid, but it’s real. And even when you know that it’s stupid, it can still slip into your brain in a really terrible way. If I’m 30 and this is all I’ve done by now, well, why even bother?

This is dumb. The attitude is dumb. That I disagree with it, yet still feel it at times, is dumb. Ideology is a motherfucker.

So yeah, that’s it. My 20s are almost over. And I wasted some of the last bits of them writing this silly blog post. There’s no stopping it, just watching the clock tick forward, and doing my best as hard as I can until it’s all over. How many of these decades will I even get? My dad certainly thought he had a few more until that night he collapsed and found out that he had stage four, terminal cancer.

Let’s see what I can do in the next ten years.
