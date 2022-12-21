---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Emoji licensing"
pubDate: 2013-08-06
blog: words
---


I recently decided to make an emoji gem. Of course, as with any project, I first look into the relevant licensing issues. What I found made me `:cry:`. Here’s the low-down on emoji and intellectual property law.

## A history

So what *are* emoji, anyway? The Japanese spelling is 絵文字: 絵 (e) means ‘picture’ and 文字 (moji) means ‘letter.’ Picture letters. Simple.

Back in the day, three different Japanese phone carriers created their own versions of these smilies: docomo, au, and SoftBank. Codes would be sent down the (nonexistant) wire, which would then be turned into the final character. However, the three carriers used different characters and different codes.

Google and Apple petitioned the Unicode Consortium to include a number of these characters, and version 6.0 of the Unicode Standard ended up with 722 emoji.

## The font

Apple ended up implementing a font named Apple Color Emoji that included these symbols. It came first with OS X Lion and iOS 5. These are the characters that you’re probably familliar with. Apple actually implements the font with a proprietary extension to OpenType, but that’s not particularly important. What *is* important is two things: typing a character that’s not on a normal keyboard, and displaying custom fonts on the web. These two problems have led to the current emoji IP situation.

### Typing extended characters

On an iPhone, you can type emoji easily by enabling the extra keyboard. That’s not hard. But what about on a computer? Web sites that wanted to use emoji needed an easy way for you to type these characters in an input box.

I’m not sure who was first, but the first I remember is GitHub: with their [announcement post](https://github.com/blog/816-emoji), showed off a slick way to input emojis: use a set of characters that would get replaced with the emoji. So `:heart:` becomes a heart. Easy!

### Custom fonts in browsers

That takes care of input, but what about output? If you don’t have the proper font installed, you’ll get those terrible boxes. That’s not very useable. Also, even if you do, [Chrome won’t display them](http://code.google.com/p/chromium/issues/detail?id=90177).

So what do you do? You use your good buddy `<img>`.

If you’re building a web application, you are already telling users to type `:heart:` rather than the character, you can just make `:heart:` be rendered as `<img src="/assets/heart.png">`. So that’s easy…. but where do you get the PNGs?

## Apple Color Emoji

Remember that extension? [The spec was published](https://color-emoji.googlecode.com/git/specification/v1.html), and is being worked in to [FreeType](http://google-opensource.blogspot.de/2013/05/open-standard-color-font-fun-for.html).

Anyway, the extension works by embedding PNGs into the font. I think that you can see where this is going… just rip the images out of the font, and you’re golden. Well, other than that pesky IP law…

## Extensions

Furthermore, now that you’re not constrained by the unicode standard, you can make anything between two colons an emoji. Like `:shipit:`. Several services do this. [http://emoji-cheat-sheet.com lists the licenses as such](https://github.com/arvida/emoji-cheat-sheet.com/blob/master/LICENSE):

```
octocat, squirrel, shipit
Copyright (c) 2012 GitHub Inc. All rights reserved.

bowtie
Copyright (c) 2012 37signals, LLC. All rights reserved.

neckbeard
Copyright (c) 2012 Jamie Dihiansan. Creative Commons Attribution 3.0 Unported

feelsgood, finnadie, goberserk, godmode, hurtrealbad, rage 1-4, suspect
Copyright (c) 2012 id Software. All rights reserved.

trollface
Copyright (c) 2012 whynne@deviantart. All rights reserved.

All other emoji images
Copyright (c) 2012 Apple Inc. All rights reserved.
```

I made some inquries into all of these extended emoji, and GitHub said they’d get back to me, but didn’t. Therefore, their three are All Rights Reserved.

37Signals had said `:neckbeard:` is CC licensed, and in an email, said they’d be happy to license `:bowtie:` the same way.

The inventor of Trollface has yet to return my email. Go figure. Also All Rights Reserved.

Finally, while DOOM had its code released under the GPL, the assets were very clearly not. All Rights Reserved there too.

I didn’t even bother emailing Apple.

## What’s this mean for me?

Basically, **if you’re distributing the images from Apple Color emoji, you are violating copyright law**. And if you’re not one of the above mentioned entities, you’re violating their licenses, as well.

So that’s a big downer. What to do?

## Phantom Open Emoji

At some point, there was a kickstarter for an open emoji set. And it worked! And so [Phantom Open Emoji](https://github.com/Genshin/PhantomOpenEmoji) was born.

Phantom Open Emoji basically gives you images to use as all of the glyphs used in Apple Open Emoji, but you have a license to use them however you’d like. So that’s pretty awesome.

---

I wrote this post because I was writing a [Ruby gem for emoji](http://rubygems.org/gems/emoji), and needed to know if I could distribute the emoji with the gem. It’s not done yet (it’s barely started), but if you want to use emoji with your app, it will be the simplest and safest way to make sure you don’t run afoul of this kind of thing.
