---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Ember.js and accessibility"
pubDate: 2013-02-07
blog: words
---


Hey everyone! I made a video today about Ember.js and accessibility. I had always been repeating what I’d heard about screen readers: they can’t work with JavaScript. Turns out that’s not exactly true. The video is the best way to show you:

[VoiceOver, Ember.js, and WAI-ARIA](http://vimeo.com/59124303) from [Steve Klabnik](http://vimeo.com/steveklabnik) on [Vimeo](http://vimeo.com/).

Here’s a rough transcript, if you don’t want to watch it:

---

Hey everyone. I recently was checking out [Ember.js](http://emberjs.com/), and more specifically, [Discourse](http://discourse.org/). Discourse is supposed to be a next-generation discussion platform, and it’s an Ember app backed by a Rails-based JSON API. I mentioned to Ember co-creator [Yehuda Katz](http://twitter.com/wycats) that I wished Ember had ‘a better accessibility story’. He asked me to elaborate, and I mentioned how my friends on Twitter were saying that Discourse wouldn’t able to be inclusive because JavaScript-heavy apps can’t be used by screenreaders. So he said, “Hit ⌘-F5.”

Whoah.

Hitting that key combination activates [VoiceOver](http://www.apple.com/accessibility/voiceover/), a feature of OS X I didn’t know existed. Basically, VoiceOver is able to interact with applications and allow keyboard navigation for those who are blind or sight-impaired. Neat! But what about in-browser? Turns out VoiceOver handles JavaScript heavy pages just fine.

I tried it out on [http://try.discourse.org/](http://try.discourse.org/), and it works pretty well! Not perfect, but you can manage. Yehuda also pointed me at [WAI-ARIA](http://www.w3.org/WAI/intro/aria.php), which is a W3C initiative. I’ll let the site explain:

> WAI-ARIA, the Accessible Rich Internet Applications Suite, defines a way to make Web content and Web applications more accessible to people with disabilities. It especially helps with dynamic content and advanced user interface controls developed with Ajax, HTML, JavaScript, and related technologies.
> 

Neat! Basically, you can add markup to your HTML, and it will help applications like VoiceOver allow people to use your site more easily, even if it uses a lot of Ajax. This is super cool, and for me, mitigates one of my main complaints against using SPAs. Of course, WAI-ARIA isn’t really Ember’s job; you’ll have to make the HTML be output in the right way yourself. But it makes me really happy to know that people with disabilities don’t need to be left out of the rich-client portion of the web.
