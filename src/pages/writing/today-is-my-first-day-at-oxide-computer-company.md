---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Today is my first day at Oxide Computer Company"
pubDate: 2020-06-15
---

![Oxide Logo](/img/2020-06-15/oxide.png)

Today is my first day at [Oxide Computer Company](https://oxide.computer/), where I will be doing engineering work.

---

When Oxide introduced themselves to the world, I saw a lot of folks who were pretty confused. At its core, what Oxide is doing is very straightforward: you give Oxide money, and Oxide gives you a computer. This company sells goods, for money. That raises the issue of what kind of computer, and why would you want one?

In the late 90s and early 2000s, if you were running a web service of some kind, you'd have a server sitting in a rack in a data center somewhere. Got a lot of traffic? You'd buy a bigger, beefier server. This was the era of "vertical scaling." Servers were big, expensive, and hard to manage, so you didn't buy more servers, you bought bigger servers.

That started changing. In 2006, you saw a bunch of articles like [this one](https://www.networkworld.com/article/2304459/google-builds-own-servers-for-efficiency.html):

> Google, typically tight-lipped about the technology behind its data centers, builds its own servers to save costs and because standard products don't exactly meet its needs, Google's senior vice president of operations said on Thursday.
> 

This era saw companies like Google start to reject the notion of "Server grade" hardware, and rely purely on cheaper, consumer-grade hardware. As the quote said, this required building a bunch of software that would make the cluster of servers more reliable.

But eventually, there were downsides to this approach, as well. As these companies grew, so did a new generation of companies building "the cloud" as we know it today. And once you start managing that many computers, possibilities open up to gain certain efficiencies and cut costs. Years later, we see stuff [like this](https://www.geekwire.com/2017/amazon-web-services-secret-weapon-custom-made-hardware-network/): 

> It’s not unusual for internet and software giants to design and even make their own hardware, to increase efficiency and build a competitive advantage. Google custom-designs its own servers, filling them with millions of chips from Intel, and announced in May that it has designed its own application-specific integrated circuit (ASIC) for use on neural networks. Facebook uses its own switches in its data centers. But market-leading public-cloud company Amazon Web Services may have gone farthest down this path — designing not only its own routers, chips, storage servers and compute servers but also its own high-speed network.
> 

The cloud was printing money, and folks were running into scaling issues. The solution was pretty straightforward: hire some people to build amazing infrastructure. Why not just buy it? Well, it simply didn't exist for purchase in the first place. The current crop of computer companies really grew up in the vertical scaling era. But beyond that, you also have to remember that this stuff was pretty *new* at that time. The Cloud was still cutting-edge, and so the requirements weren't really known. There was a lot of R&D work to figure out what things would actually work in these environments. It turns out that a lot of it was not just hardware, but the software too. There is a ton of junk and waste in off-the-shelf server systems today, in all parts of the system. 

Because these developments were proprietary, it also meant that if you weren't willing to build your own hardware, the only way you could get access to this new tech was by renting it. The public cloud's usage-based billing model is pretty standard, and pretty lucrative. Custom hardware helped dig an even deeper moat around cloud providers. If you want to actually own computers, your options are to use previous-generation tech, or hire a team and try to catch up to the big players. So the world kind of split in two: the hyperscalers and everyone else. 

There is a **ton** more to say here, but this is the short of it: what Oxide is doing is building computers that are suitable for hyperscalers, but selling them, rather than building another public cloud. These computers will have hardware and software designed together to create excellent systems. Or I should say "will be selling them," it is still early days.

---

I do not come from a hardware background. But there's a lot more to a system than hardware. And as you might guess from the name of the company, Oxide will be building a lot of software in Rust. I also have known two of the three founders of the company for a while, and they are folks I respect and whose work I admire.

I am also looking forward to doing engineering work again. I still love doing product work, but I think I prefer it in a small company setting. In a new company, engineers can still have a lot of ownership over product, so I won't be giving that up completely. But I'm excited to finally have a job where I get to write Rust code as a direct responsibility. It's not like I've not written any Rust over the past few years, but I'm looking forward to writing more of it, regardless.

Finally, I'm excited to continue to help others as well; Oxide cannot only hire folks who are already Rust experts. There just aren't enough of them yet, and there's folks who do fantastic work who don't yet write Rust. I'll be helping to bridge that gap.

There is so much work to do. It's almost 9am. Time to get started.
