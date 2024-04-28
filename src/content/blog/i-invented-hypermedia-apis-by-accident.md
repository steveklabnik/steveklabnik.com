---
title: "I invented hypermedia APIs by accident"
pubDate: 2012-12-21
blog: words
---


Long long ago, I got an internship in college. Back then, I didn’t know anything about web development. My college professor said “GET and POST are the same thing, it’s just that GET requests show parameters in the URL bar.” But a friend of mine was working at this post-acquisition startup. They still operated as an autonomous unit within the parent company, so they were still pretty fun to work for. People would upload us MP3s and we’d give them a podcast. They’d get a blog, the necessary RSS, we’d help get them listed in iTunes, all that jazz.

Then the iPhone came out, and you could make apps for it.

Bizdev decided that we should sell apps to our clients, who could then sell them to their audience and help finance the show. We’d do all the dev work, we’d all make money, it’d be a good time. So they asked me to write an iPhone app generator. We picked a big feature set, and people could give us some images, pick their individual features, and set some other config options. We’d take that file, and compile in them as defaults. All seemed good.

Then the first app got rejected: it turns out that Apple has some restrictions on the bitrate of MP3s that you could download. I suspected that AT&T wasn’t very happy with you using lots of data back then. Anyway, we had to get around this issue: we wanted to serve up quality audio. What to do?

I don’t remember who came up with it, but we decided that the first thing the app would do would be to fetch the config file from the server, to see if any of the defaults were changed. It was just XML, so the iPhone could parse it easily, and then change whatever was different. So we’d have something like this:

```
<?xml version="1.0" encoding="UTF-8"?><config>  <link href="http://example.com/low.rss" rel="podcast_url" /></config>
```

I don’t remember the exact schema, but you get the idea.

Anyway, so we’d link to the low quality feed while the app was in review, and then later, we’d change the response to this:

```
<?xml version="1.0" encoding="UTF-8"?><config>  <link href="http://example.com/high.rss" rel="podcast_url" /></config>
```

Now the client would fetch the high quality feed. No client code needed to change! We’d managed to sneak around a restriction in the review process.

But why stop here? Once we saw this flexibility, we started taking full advantage. People could set up a bunch of different configuration options, and that would change the UI based on their choices. So, for example, they could choose to be contacted by email, they could put in a website or two, and the page would change. Here’s a mockup of the web page:

![https://svbtleusercontent.com/inline_steveklabnik_24409213486218_raw.png](https://svbtleusercontent.com/inline_steveklabnik_24409213486218_raw.png)

This would cause our app to serve up the following XML:

```
<?xml version="1.0" encoding="UTF-8"?><config>  <link href="http://example.com/high.rss" rel="podcast_url" />  <about>    <links>      <link href="http://example.com">Homepage</link>      <link href="http://example.com/about">About Us</link>    </links>    <phone>5558675309</phone>    <email>foo@example.com</email>  </about></config>
```

And that would make this appear in the “about” section of the app:

![https://svbtleusercontent.com/inline_steveklabnik_24409223801964_raw.png](https://svbtleusercontent.com/inline_steveklabnik_24409223801964_raw.png)

Neat, eh? We’d turn the email into a `mailto:` link and the phone into a `tel:` one, as well.

Anyway, maybe later they’d go back and unset their phone number, and the about us link. So then we’d generate this XML:

```
<?xml version="1.0" encoding="UTF-8"?><config>  <link href="http://example.com/high.rss" rel="podcast_url" />  <about>    <links>      <link href="http://example.com">Homepage</link>    </links>    <email>foo@example.com</email>  </about></config>
```

But check out what the app would do:

![https://svbtleusercontent.com/inline_steveklabnik_24409247735934_raw.png](https://svbtleusercontent.com/inline_steveklabnik_24409247735934_raw.png)

Whoah! Isn’t that rad? The UI would change based on the config.

Here’s what’s even rad-er: because the app would read the config on each load, changes would get propagated very quickly. If you took your email away, everyone’s apps would no longer have it, as if by magic. Next time they loaded up the app, it just wouldn’t be there any more.

Here’s what’s **even rad-er**: You wouldn’t need to go through the App Store approval process to push this change out to the users. It Just Worked. If you’re an app developer, and you’ve been forced to sit through long waits to push out a release, you know how painful it can be. I don’t know how fast it is these days, but back then, it could take a month. With this approach, we could, say, remove a feature, and it’d be gone immediately. No oversight. If we added a new feature, older apps would still work, because they’d just ignore the new part of the config, and people who got the new version would get the newest features.

Years later, after doing tons of research on Hypermedia APIs, I realized that that thing I did long ago was a form of it, and it provided us with a pretty massive benefit. So of course I wasn’t the first one to come up with it; my point is that I implemented a system in line with hypermedia principles because it made sense to do so, even though I had no idea that Roy Fielding was a PhD candidate. And I certainly had no way of articulating it as a ‘style,’ it was just a neat hack.

---

If you liked this story, you may care to learn about what else I’ve learned along the way with Hypermedia APIs. I wrote an e-‘book’ about it called [Designing Hypermedia APIs](http://designinghypermediaapis.com/). It’s only $20, and you get updates forever! I’m actively working on adding new content, and I’ll be doing a total redux in the new year.
