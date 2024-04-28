---
title: "An introduction to economics under capitalism"
pubDate: 2015-03-10
blog: words
---


The dismal science a difficult one. Many people have strong opinions about economics, and it determines many of their other political beliefs. As someone who has significantly different thoughts on this topic than many of my peers, I’m writing this post out to give a basic explanation as I see it. That doesn’t mean I’m *inventing* something here, just explaining the model that I currently prefer. I’ll give sources at the end, if you want to dig deeper. Speaking of ‘deeper,’ this is also an *introduction*, one could easily write a book or three on this topic. I’ll try to be clear where I’m making an assumption, and why I’m making it.

Finally, this is very much a draft, I may make small, or even maybe major errors. Nobody’s perfect. My spelling is terrible, and there’s a bug where my browser spellcheck isn’t working… anyway.

---

Let’s start from the beginning. And that beginning starts with stuff. People trade things between them. Let’s be a bit more precise: people trade commodities. They trade commodities becuase they want something they do not currently have. In other words, if I’m hungry, and you have some $FOOD, and you’re cold, and see I have a coat, you might trade me your food for my coat and we’d both be better off. This ‘commodity’ is distinct from any useful thing because we trade for it, and because it satisfies some sort of need.

But how do we know how much food we should trade for a coat? What does that even mean? To make this trade equal, we need to settle on a value for food, and a value for coats. That value has two different parts to it. The first: that value represents how much something satisfies our needs. Something that’s really useful will have a lot of value to us. Something that’s not may have less value. We call this component of value ‘use value.’

The second component is more complicated. It’s called ‘exchange value,’ and it’s called that becuase this is the actual value that we trade each other for. These two kinds of value are distinct, but the distinction is important. While I may find a coat midly useful, and therefore, its use value is low to me, that doesn’t mean that if I trade it to someone else, they will agree in how useful it is. We might have to sell this coat for more or less than we expected to. While the usefulness affects the exchange value in a sense, it doesn’t mandate it.

Let’s give a more concrete example of this. If I can trade my single coat for four $UNITs of $FOOD, then the exchange value of one coat is four $FOODs, and the exchange value of a $FOOD is one quarter of a coat.

So if the exchange value of a commodity determines how we trade, and that’s based on a subjective preference for usefulness. So if I told you there was some underlying constant that did determine exchange value, you probably wouldn’t believe me. This is, in fact, one of the root areas in which economists disagree with me. Their first mistake. They claim that this exchange is entirely based on preference, with no underlying reasoning. I (and others) disagree. Consider the equation,

```
4 * c = 1 * f
```

where `c` is coats and `f` is food. If we wanted to reduce these equations, we could end up with two variants:

```
(4 * c) / 1 = f

c = (1 * f) / 4
```

Because `c` and `f` are defined in terms of each other, it’s hard to get at an underlying property of both things.

Now, remember why we’re trading food for coats: they satisfy some sort of need. Therefore, these equations make sense only in a certian scope, if you will: when we’re considering how to turn some sort of commodity into the satisfaction of our need. This is what produces this relationship between food and coats. But we have a layer of abstraction here: as we said, the exchange value isn’t the actual, underlying use values. Like all abstractions, this one leaks. We’ll get to the leak later.

But in order to turn some food into a satisfied need, you need to do some kind of labor. First of all, this food had to actually be produced by someone. We’re not ordering raw materials, we’re ordering a finished product. Someone, somewhere, had to obtain these raw materials, and then apply themselves. And if you’re buying raw materials, someone had to do the labor to cut down the trees, or mine the ore.

This is an area where I’m going to make a slight hand-wave for now, and argue that this aspect, the labor that’s needed to make and consume a commodity, is the underlying aspect missing from the equation. It might be a little bit of labor, it might be a lot of labor, but somewhere, someone is doing some kind of labor. We can make a better argument here, but for now, I’m just going to leave it as is, because I think it makes intutive sense. Many, many people go to work, and labor to produce things that get exchanged for many other things. The common thread is that we all work. We can dig into a more rigorous argument over this point later.

In other words, we’re trading an abstraction over people’s labor. When I say “I’ll trade you a coat for four food,” I’m making that estimate on how much labor I would need to aquire a coat, and estimating how much to get four food, and deeming them equal. But we’re not trading the hours directly: we’re trading objects. We objectify our labor, and then trade that.

Now, you might have a problem with this. And many economists do. However, their arguments are usually based on a misunderstanding of this point, which is a very important one: If value is based on how many hours of labor someone puts into something, than isn’t a slow worker making more valuable stuff than a fast worker? How does that make any sense? And if I were to do some labor that’s useless, like for example, I dig around in my backyard and make a bunch of pies out of the mud, I did some labor, and therefore, shouldn’t I get paid?

Early economists such as Adam Smith often had this problem with their models. And it’s indeed a problem. But there’s a solution: we’re not talking about just any old labor. We’re only talking about labor that produces something useful. “Useful” in this case is decided by the particular society in which this person is doing this labor. A carriage maker in 1890 does a lot of productive labor, but a carriage maker in 2015 does significantly less.

Our revised statement: the common thread between all of the commodities that get exchanged is that somewhere, sometime, someone had to do some sort of labor that was socially useful to produce that commodity. We exchange commodities so that we can gain the commodities we need to fulfill our desires. We exchange them at a ratio where they’re equal in terms of how much labor went into making them, a fair trade.

This leads to another problem: how do we qualify ‘how much labor’? What is this unit and magnitude? Well, many people have a 40 hour week, so naturally, we gravitate towards ‘hours’ as an answer for this question. Hours are a unit of time, so we can quantify our exchange values as ‘socially neccesary labor time.’ Time, becuse we work in hours. Labor, because that’s what we’re doing. “Socially neccesary” to explain the context of only labor that’s doing something society deems useful.

But back to one of the original problems: If I’m bad at making coats, and I take a hundred hours to make a coat, and you’re good at making coats, so it takes you an hour, is my coat worth one hundred times yours? That doesn’t make any sense. So we’re going to make an assumption. When we use ‘socially neccesary labor time’ in this way, we mean that it’s an average hour, by an average skilled worker, across all of society. Because averages are all you can really reason about here, it’s impossible to compare each individual worker. It’s an approximation. And understanding that it’s just an approximation has led to many successful businesses, as they’re more efficient than the average, and therefore, make more money. For now, we’re going to set that aside, however. We’ll get there.

So! To recap, we have needs and desires, and to fulfill those, we need certain commodities, which we can aquire through exchanging commodities we have with others in our society who have the commodities we want. We make equal trades, in a ratio roughly determined by the average amount of time it would take an average worker in our society to make the thing.

---

Exchange values are a bit unweildy, though. For one thing, there’s a ton of them: they explode in a `O(n^2)` fashion. If we have coats and food, each commodity has a single exchange value, but if we add just one more item, each commodity can be traded for two others, and therefore has two exchange values, times the three commoddities, meaning our system has six exchange values, five more than before. Adding a fourth means each of our four commodities has three possible trades, meaning twelve exchange values, six more than before. So what’s a society that’s trying to produce use-value to do?

We can add more things to our equation. We have coats and food in our economy, let’s add a third, and call it ‘coins.’ We’ve established that one coat is worth four food, and let’s say that one coin is worth two food. This means that four food is worth two coins is worth one coat:

```
4 * food = 2 * coins = 1 * coat
```

In another sense, one coat is worth two coins is worth four food:

```
1 * coat = 2 * coins = 4 * food
```

We have coins in the middle of both of these equations, which means that we can express the two halves in one system:

```
1 * coat = 2 * coins
4 * food = 2 * coins
```

And when we add another commodity to our equation, we can just say what it’s worth in coins, rather than what it’s worth in both coats and food. This makes it significantly easier to conduct trade, as we only have to know what our commodities are worth in terms of this particular commodity. This commodity plays a special role in our little society: it’s the commodity that we use to determine the rates of all the other commodities. The vocabulary term for this is ‘the money commodity.’ And we call the exchange value of a commodity to the money commodity a ‘price.’

At this point, we’re going to take a small detour. Because our commodity is an abstraction of socially neccsary abstract labor time, I want to talk for a moment about how that abstraction leaks. Becuase objects fulfill our needs, and trading them is such an important part of society, we place a ton of emphasis on this abstraction. In other words, we love to buy things. Why does this happen? What’s the weird obsession, or some might say, fetish, with commodities?

Let’s say you’re a cobbler, and you make shoes. Hopefully, you’re proud of the shoes you make, and so, to some degree, because you’ve put hard labor into those shoes, you see them as a reflection of your own self. And when every commodity is priced equivalant to the money commodity, it’s really easy to see that your shoes trade at $50, but mine may trade at $45. This means you make better shoes, and so you have a higher social standing than I do. Your labor is more socially useful. This sort of collective desire we all have that sets the price of commodities, and can make us quite obsessed. And not just in the classical materialist way, but in a way that shapes our worldview.

You can’t take a microscope to a coat and observe that the coat costs $2. There’s no ‘money atom.’ It’s not some inherent property of coats. It’s something that our society has created as a basic assumption. But it doesn’t have to be that way, we’ve just chosen it.

---

Let’s talk a bit more about exchanging stuff. Let’s use the previous exchange as an example, I have a coat, you have four food. But now, we don’t know each other. What do we do? Well, I can take my coat to a market, and sell it for two money. You can take your food to market, and sell it for two money. I can then buy your food for two money, and you can buy my coat for two money. We’ve exchanged our food and coats succesfully. We both completed a trade in the same way:

```
commodity -> money -> commodity
```

or

```
C -> M -> C'
```

We both had a commodity, we traded it for the money commodity, and then we traded that money commodity for a different commodity. There’s two sides to these trades: a commodity for the money commodity, and then money commodity for the commodity.

It’s important we’re making an assumption here, but it’s one that virtually all economists make: we’re assuming that both of us know the value, and that the intermediary who is holding the money agrees. This simplifying assumption is also a place where many business opportunities are formed, charging a fee to facilitate transactions like this. See the pattern yet?

That’s also something new: there’s an intermediate here, ‘the market.’ We don’t have to know each other, we just have to know the market exists. Software engineers would say that by lowering coupling, we enable scale. When everyone doesn’t need to know each other, we can trade a lot more things. This is another reason why the money commodity is so damn useful.

Anyway, it’s important to recognize that this is four total exchanges, which form two little circuts, which form our overall economy here. It’s a system, like any other. And so we can model it like a system. This is something that we virtually all agree upon. But this assumption is treacherous too: we assume that both ends of the trade always happen. But there are four trades here, and only some of them may occur. This causes disruption in the system, which throws it into crisis. We’ll talk about this case more later.

A moment ago, I mentioned a business model for charging for transactions. This is a very natural reaction to systems like these: by intervening in each trade, by being the mediator, you can argue that you are doing socially neccesary work, and therefore, should be paid in compensation.

Furthermore, since the money commodity mediates all exchange, there’s lots of good reasons to control said mediation. This is why states print currency and then ensure that transactions occur in said currency, as it gives them control over all exchange, and therefore, of what is ‘socially neccesary.’

To summarize up to this point: people have needs. To satisfy those needs, some people do labor to make commodities, which have the ability to satisfy those needs. We call one of these commodities ‘money’, and people trade commodities for it, and it for other commodities. This gets them the things they want. The rate that all of this is exchanged at is based in how much time it takes to make, and how important it is to the society overall.

I have yet to say what any of this has to do with *capitalism*, however. This is just people trading things. Money, and exchange, have been around longer than capitalism. It’s something a bit different. Before we can get into that, though, we have to define the ‘capital’ in ‘capitalism.’

---

There is a distinction between ‘money’ and ‘capital.’ Capital is a special kind of money. In other words, it holds a special, social distinction about how it’s used. Let’s examine our little trade again:

```
commodity -> money -> commodity
```

Someone has to actually have that money in the middle. To simplify our story, let’s say this shop both buys and sells various commodities. I sell my coat to the shopkeeper, you sell your food to the shopkeeper, then I buy food from the shopkeeper, and you buy a coat from the shopkeeper. From the shopkeeper’s perspective, these trades are backwards:

```
money -> commodity -> money
```

The keeper has four dollars. They give two to me in exchange for the coat, and then they sell the coat for two dollars on the other side. Their circut here is the opposite of yours and mine: they start and end with money, rather than with another kind of commodity.

It’s important to note that this difference is significant. While you are attempting to exchange a commodity for another to gain some kind of use, with the `M -> C -> M` variant, you’re attempting to gain more exchange value. This underlying need is at odds with yours and mine. No concern is given for use here, just how much something can be exchanged for.

However, as we know, a shopkeeper isn’t exactly happy when they start off with four dollars and end up with four dollars. While this system is balanced, they’re not being compensated for this social function, one of shopkeeper. And in the real world, shopkeers do make money, so something is missing from our model of equal exchanges. But before we get into that, consider the implications of this point: the shopkeeper has no concern for what is useful, just for what can be exchanged. If we optimize for the needs of shopkeepers, we may not be optimizing for the usefullness of society, but instead for the pursuit of exchanging the money commodity.

So, if we can engineer a situation in which we have some money, we exchange it for a commodity, and then we exchange that commodity for money, and we get *more* money out of it in the end, that extra money is called ‘capital’. In line with our earlier equations:

```
M -> C -> M'
```

The difference between `M'` and `M` is how much money we’re making. This is very close to our `M -> C -> M` circut, and very different than our `C -> M -> C` circut. Only shopkeepers produce capital, not those who are simply exchanging a commodity in the hopes of attaining another.

But we’ve already established that all trades here are equal. So how can we get `M'`? Shoudn’t that be impossible?

This is where the mistake we mentioned before rears its ugly head. If all value is subjective, and exchanges are between equals, where can this extra money come from? And if all of these exchanges are equal, then why do both people feel like they’ve won?

---

In order to make this happen, our prospective capitalist shopkeeper needs to find a commodity whose use-value, the act of consuming the commodity, produces value. If they can, they can purchase that commodity, and then use it to get more value than it was exchanged for, due to the extra production. In other words, they don’t need to purchase an object, but something more abstract: a potential source of value.

Previously, we mentioned that the common thread behind exchanges was labor, and so, that labor was the common element of value. Labor, when placed on a market, is called ‘labor power,’ and is a commodity that produces value. We call someone who possesses labor power a worker. They enter into the market, selling their labor power. This is colloquially known as ‘getting a job.’ In order to be willing to sell your labor on the market, though, you need to have some sort of need that is fulfilled. If you don’t need anything, there’s no reason to get a job. Furthermore, you can’t just do work yourself, you need objects to do your work, that will allow you to produce something. We call these objects the ‘means of production.’ A worker also needs enough commodities to keep themselves alive, to work another day. We call this the ‘means of subsistence.’ It’s also important to note that if a worker has other commodities, they could sell those to fulfill their needs, rather than selling their labor power. So someone selling their labor-power in the market needs something, but doesn’t have anything. The only thing they have is the labor-power their body possesses.

It’s important to note that “person with a pile of money” and “person possessing nothing but their ability to work” is not the state of nature. In other words, this stuation arises due to the way we’ve organized society. We like to think that this existance is somehow ‘natural’ or inevitable, but that’s not true. This doesn’t mean older forms of organization are better than what we have now, but the possiblity for change exists. Some people try to paint a picture that those who have the piles of money are virtuous, and those who have only their labor are at fault for their predicament. But the predicament wouldn’t even exist in the first place if not for certian historical developments.

So, if you’re trading labor-power in a market, how do you determine how much to sell it for? Like any other commodity, its value comes down to a socially neccesary labor time. In this case, it’s the amount of money you need for subsistence, the money to pay your rent, to eat food, to stay alive. Having some more is nice, but if you don’t go to work, you can’t pay your bills, and then bad things happen.

One odd thing about labor-power as a commodity is that you don’t just hand it over in the way that you hand over a coat. You put the work in first, and then, eventually, the thing you made gets sold at a totally different time. There’s a gap. Often, you don’t actually get to see the fruits of your labor, as someone else is actually doing the sales. This can lead to some angst, but I just want to make mention of this, we’ll talk more about it later.

---

This commodity, labor-power, allows us to create the trick. Here’s how the story goes:

Let’s change our example slightly: a coat costs two coins, and four spindles of thread costs two coins:

```
1 * coat = 2 * coin
4 * thread = 2 * coin
```

It takes two spindles of thread and an hour to make a coat. By this measure, given that a coat costs two coins, you’d imagine that cost of materials is a coin, so labor must be a coin. Which means an hour of work is worth a coin. if this is true, then the exchange looks like this:

Someone wants a coat. They’re willing to pay two coins. A prospective capitalist sees that the cost of materials is a coin, so they set the price of labor-power to one hour per coin:

```
1 * coat = 2 * coin
2 * thread = 1 * coin
1 * hour of work = 1 * coin
```

I spend my one hour of labor and two threads to make a coat, which costs two coins and is sold for two coins. We’re back at an equilibrium. There’s still no capital being created here.

Now the capitalist is upset. “I provided the job, I provided the thread, yet I made no money. This worker couldn’t have made that coat without me. I deserve to be paid for having the initial capital to set up this business. That’s work!”

But here’s the thing: if I worked for half a coin instead of a full coin for an hour, and I worked eight of those hours a day, I’m still making more than enough money to pay my bills. Because that’s the outcome I’m shooting for, I’m happy to exchange my labor on the market for less than the labor time would be: I’m making a good salary, I can live a good life. So the *exchange value* of my labor-power is less than the value I create from it. It’s not that I’m being cheated with my wages, it’s just that the exchange value of my labor is worth less than the labor I create. With this set of equations:

```
1 * coat = 2 * coin
2 * thread = 1 * coin
2 * hour of work = 1 * coin
```

the capitalist can extract that difference. He takes his initial four coins, invests two of them in four threads. He then invests a coin in two hours of a worker’s labor. That worker then uses the threads and their labor-power to make two coats. The capitalist then sells the two coats for four dollars. Looking back, he’s seemingly played a trick: he invested three coins, two in threads and one in labor, but gained four coins at the end, for the two coats.

We haven’t broken any rules of exchange here. The capitalist has paid full market price for all commodities, there’s no inherent need to pay less. Each exchange is between understanding, consenting parties. There’s no trickery. Yet an extra coin has moved from one party to another, the worker to the capitalist, just by following the rules.

Once you have a machine that you can put three dollars in and get four dollars out, you can live off of this extra, rather than doing labor yourself. By having the initial capital of three dollars, and by using it in this way, a capitalist can just make money out of thin air. As they say, it takes money to make money. This is why every worker isn’t a capitalist, you need to create this capital somehow, to be able to afford to use the machine. A machine that makes four dollars out of three isn’t much use if you dont have the inital three dollars.

---

In summary: people come together at a market to exchange commodities to fulfill their needs. They exchange these commodities with each other in equal values. One of the commodities which can be exchanged is labor-power, which is a special commodity, because it creates more value. Capitalists purchase this commodity, and then use it to create capital, which they can re-invest to continue to accumulate money. Those who sell their labor-power on the market must because they don’t have the capital to do this themselves.

Now that we’ve established that this system is off-balance, we can figure out how that will eventually become its undoing.

---

Anyway, this is the beginning. There’s obviously much more detail to go into here. If you’d like to read more, this post is basically my own little summary of [Capital, Volume I](https://www.marxists.org/archive/marx/works/1867-c1/), chapters 1-7, by Karl Marx. These basic building blocks of understanding are not without their own problems, but hopefully, I’ve given you a foothold into the topic. I may or may not do this for additional chapters, we’ll see….
