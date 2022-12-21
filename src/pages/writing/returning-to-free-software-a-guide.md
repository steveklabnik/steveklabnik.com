---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Returning to Free Software, a guide"
pubDate: 2013-06-15
blog: words
---


A month or two ago, I made a conscious decision that I would return to using as much Free Software as possible. The PRISM debacle of the last week confirmed my fears and reasoning, and so I made the decision to accelerate the schedule.

Here’s what I did, and how you can, too.

## My GNU/Linux Background

The first computer I ever used was an Apple machine, and at various times in my life I’ve used GNU/Linux as my main OS. So I’m already pretty familiar with what’s involved.

That said, it’s only gotten better over the years. Especially if you buy hardware that is known to work well, using GNU/Linux as your main OS shouldn’t be a big deal. One of the nice things about the rise of OS X in the developer community is that they’ve come to rely on the standard GNU tools, and so much of what you’re already working with will probably translate straight over. Of course, if you work on iOS or something, this won’t be the case, but for your run-of-the-mill web developer, there isn’t a whole lot of difference.

Well, other than that whole ‘knowing exactly what’s on your machine’ thing.

## Hardware: X1 Carbon

IBM’s ThinkPad series of laptops have always enjoyed fantastic Linux support. When they were purchased by Lenovo, some were worried that they’d ruin this fantastic hardware line. That didn’t really happen, though, and they’re still fantastic computers to this day. When asking my Twitter followers what they thought, everyone who owned a ThinkPad loved it, whichever model they had.

I happened to get an [X1 Carbon](http://shop.lenovo.com/us/en/laptops/thinkpad/x-series/x1-carbon/index.html). I was coming from a 13" MacBook Air 13“, and the Carbon is very similar. It’s 14” though, which is a really nice size; it still fits in the same pocket in my bag as the MBA did, but I get a little more screen real estate. A note for those who give presentations: the X1 Carbon uses a MiniDisplay port, so save your Apple connectors!

All of the hardware I use has Just Worked; I hear that the thumbprint reader may not, but I don’t plan on using it, so that doesn’t bother me.

If you’re not in the market for new hardware, you can generally run GNU/Linux on your Apple hardware as well, which is a starting point, at least.

## Operating System: Crunchbang GNU/Linux

I’ve used a lot of different GNU/Linux distros, and have been a happy Arch Linux user for years. However, this time around, I decided to go with [CrunchBang](http://crunchbang.org/). Crunchbang is a Debian derivative, but includes [OpenBox](http://openbox.org/) as the default window manager. The result is an OS that’s lightweight, yet very, very functional. I’ve been really happy so far with Crunchbang’s level of polish.

Okay, so actually *installing* Crunchbang: the X1 Carbon comes with Windows by default, and so we need to get Crunchbang on there somehow. Luckily, you can just use USB. `dd` is your friend here, which you can use on your Mac, of course. You can grab a copy of Crunchbang [from their download page](http://crunchbang.org/download/), and they have a link to making the USB stick right on that page.

After you’ve made the USB stick, just reboot your computer with it on, and press down all of your F keys. I was simply too lazy to look up which one would actually let me choose a boot device. ;) The Crunchbang installer was very straightforward, just follow the prompts and you’ll be good to go.

One thing that I did choose was the ‘encrypted lvm’ option. Basically, your entire disk is encrypted except a small boot partition. On boot, it asks you for a passphrase to decrypt the disk. It’s just a matter of choosing the right option, in practice, this has worked and worked well for me.

EDIT: One of the reasons I chose Crunchbang was because I thought that it was solely configuration on top of Debian, which includes 100% Free Software. Checking my `sources.list`, there is a Crunchbang-specific repository, and I haven’t evaluated it for Free-ness. So if you’re trying for 100% purity, straight-up Debian may be better.

## Software

Most of the tools that I use every day are already either Free Software or open source, and so my core experience hasn’t changed: `bash`, `vim`, `git`, and friends aren’t any different.

I did, however, install [tor](https://www.torproject.org/). Tor is not a privacy panacea, however, it does help in many cases.

I’ve added [Ghostery](http://www.ghostery.com/), [NoScript](http://noscript.net/), and [AdBlock Plus](http://adblockplus.org/) to the built-in Iceweasel browser, which is for all intents and purposes Firefox without the Mozilla branding. These allow me to control exactly what information leaks out a little bit more. They also have the nice side effect of making pages load a bit faster, since a lot of the usual bullshit doesn’t even get loaded. (EDIT: it’s been brought to my attention that Ghostery isn’t actually free. Oops!)

I plan on setting up backups with [Tarsnap](http://www.tarsnap.com/) later in the week, which is an excellent backup service that encrypts all of your data locally before saving it off in The Cloud. It has some pretty good (I hear) de-duplication features, and you only pay for the bytes used, so it’s pretty inexpensive. The author, Colin Percival, has said that he has some customers doing a muti-gig daily backup of their home directories, and they’re paying ~$10/month. (I should mention that [Tarsnap is not Free](http://www.tarsnap.com/legal.html), but it is shared source. I don’t plan on using it for anything else, so I’m okay with this tradeoff at this time.)

Most of my development work at the moment is in Ruby, and getting it set up was a breeze. I use the [ruby-build](https://github.com/sstephenson/ruby-build) tool to compile my Rubies, and the most excellent [chruby](https://github.com/postmodern/chruby) to switch between them.

One thing that I have yet to explore (but I’d like to) is to use a tool like Chef to set up my personal machine, so that I can periodically wipe everything and re-build from scratch. That’s still on the to-do list, though.

I personally re-map my caps lock key to control. To do this, make a `.Xmodmap` file in your home directory, and put this in it:

```
keycode 66 = Control_L
clear Lock
add control = Control_L
```

I figured this out via a few simple searches. There’s a small chance that your caps lock is not code 66, and if it’s not, you can run the `xev` command to check it out. Just press your caps lock and make note of the number that shows up in the console.

I had to install `grandr` in order to share my screen to give a presentation. It’s easy enough to get: `sudo apt-get install grandr`.

I started giving presentations with [rabbit](http://rabbit-shocker.org/), which is what many Japanese Rubyists use. It’s pretty fun; you write plain text files and it makes your presentation for you, as cairo/pango application. You can also use it to generate PDFs of slides. It’s not for everyone, but I’m enjoying it so far.

Oh, and *incredibly* important: I typed `sudo apt-get install ttf-ancient-fonts` to get Emoji support. They’re not as pretty as the Apple ones, but they’re not empty boxes either.

## Conclusion

I’m really, really happy with this setup. Very little of my day-to-day has changed, but I have a bit more privacy, and can feel good that I know exactly what software is on my machine. No NSA backdoors here!

I still have improvements to make, but what I have works well so far. Please let me know what you think, and suggest ways to make this setup even better.
