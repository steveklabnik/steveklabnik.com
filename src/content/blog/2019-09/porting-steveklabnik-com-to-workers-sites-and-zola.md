---
title: "Porting steveklabnik.com to Workers Sites and Zola"
pubDate: 2019-09-26
blog: words
---


One fun thing about having a personal domain is that you can keep the contents the same forever, but take a few days every so often to port it to some new stack you want to try out.

A while back, I had my site on [GitHub Pages](https://pages.github.com/) using [Jekyll](https://jekyllrb.com/). This has long been the sort of default, go-to stack for me. At some point, I decided to simplify even further, and wrote a small script to take the few Markdown files I have and just make HTML out of them. I then used [Netlify](https://www.netlify.com/) to do the hosting. I wanted to try out their legendary ease of use, and it was indeed super simple.

Earlier this year, I [took a job at Cloudflare](https://words.steveklabnik.com/i-m-joining-cloudflare) to work on part of [Cloudflare Workers](https://workers.cloudflare.com/). To get more familiar with the project I’d be working on, [Workers KV](https://www.cloudflare.com/products/workers-kv/), I came up with a plan: I’d put the Markdown files into KV, and then write a worker in Rust and WebAssembly that would generate the HTML on the fly, and run that in a Worker. This worked really well, even though it was *incredibly* overkill for a simple static site.

Today we’re launching a new product, [Workers Sites](https://blog.cloudflare.com/workers-sites/). You see, I wasn’t the only one who was interested in using Workers for static site hosting; I’d see tweets every so often where others were doing the same. But doing so was a completely manual process, you had to write the code on your own, you had to do all the setup yourself, and there was no assistance in doing so. Workers Sites changes this, and makes it easy to host your own site, if you’d like.

The rest of this post is going to walk you through my porting process for [steveklabnik.com](https://www.steveklabnik.com/).

---

I decided to go with [Zola](https://www.getzola.org/) for my static site generator, as it’s written in Rust. I’d been wanting to give Zola a try for a while, and this was a good excuse to do so.

I needed these pre-requisites:

- Zola, instructions [here](https://www.getzola.org/documentation/getting-started/installation/).
- Wrangler, instructions [here](https://github.com/cloudflare/wrangler)
- A Cloudflare Workers account, [here](https://workers.cloudflare.com/) if you don’t have a Cloudflare account already, and if you do, you can click the Workers tab in your dashboard to set it up.

Additionally, you need to have a $5/month subscription to Workers, to get access to Workers KV. I want us to offer a free tier of KV in the future, but we’re not there yet. That $5/month gets you a lot more than one site, to be clear, but this isn’t a completely free solution today.

From there, it was time to make a new site with Zola:

```
> zola init steveklabnik.com
> cd steveklabnik.com
```

Zola places the contents of your site in the `contents` directory. I only have one level for my site, so I dumped my two pages in there, as well as re-named `index.md` to `_index.md` to follow Zola convention.

I had a few YAML headers on pages, I had to convert those to Zola’s TOML format:

```
+++
title = "Deleuzional"
+++
I really like the writing of [Gilles Deleuze]. I need
```

The `+++`s are like `---` in Jekyll, and the metadata is in TOML instead of YAML. I only needed `title` because I am keeping things very simple.

I then needed to set up templates. Like most static site generators, the template forms the outer contents of the HTML on a page, and renders the Markdown into the middle somewhere. I have a slightly different template for my root than the other two pages, and Zola handles this pretty well.

```
> ls .\templates\

    Directory: C:\Users\Steve Klabnik\src\steveklabnik.com\templates

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/25/2019   5:28 PM           1288 index.html
-a----        9/25/2019   5:28 PM           1234 page.html
```

`index.html` is for the root page, and `page.html` is for the other pages. This is a Zola convention.

Zola templates are written in [Tera](https://tera.netlify.com/docs/templates/), which is sorta like [Liquid](https://shopify.github.io/liquid/) or [Jinja2](https://jinja.palletsprojects.com/en/2.10.x/). Here’s a snippit of my template:

```
  <body>
      <h2>{{ page.title }}</h2>
      {{page.content | safe}}
  </body>
```

The `| safe` bit says that it shouldn’t escape the HTML produced by `page.content`, which is the rendered contents of the Markdown pages.

Finally, I have some static assets for the site: a CSS file, some JS, and the favicon, etc. These get dumped in the `static` directory, and Zola will copy them over when I build the site.

Previewing during this process is very useful:

```
> zola serve
```

It took me a bit to figure out the conventions and get everything in place, and being able to change the contents and watch my browser refresh was invaluable.

Once I had my site ported to Zola, it’s time to deploy it to Workers Sites!

Wrangler is the command-line tool for Cloudflare Workers. If you haven’t used it before, you’ll have to log in:

```
> wrangler config
```

To check that your auth is set up correctly, you should run this command:

```
> wrangler whoami
  You are logged in with the email 'steve@steveklabnik.com'.
```

Of course, this should show your own email, not mine.

Let’s add Workers Sites to our project:

```
> wrangler init --site website
```

This creates two main things: `wrangler.toml`, used to configure Wrangler, and `workers-sites`, a directory with your worker in it. I used the extra `website` parameter to wrangler becuase it defaults to the name of the subdirectory, and the period in `steveklabnik.com` is invalid in a worker name, so I chose `website`. You can put whatever you’d like.

We need to set up `wrangler.toml`:

```
> code wrangler.toml
```

Mine looks like this:

```
account_id = "f5518bfbf88c230551a64797c221c7da"
name = "website"
type = "webpack"
route = "www.steveklabnik.com/*"
zone_id = "9359b254c46ff9f5c546203686794862"
workers_dev = false

[site]
bucket = "./public"
entry-point = "workers-site"
```

All of these IDs are fine to be public; `wrangler` stores your sensitive stuff in `~/.wrangler`.

Important bits:

The `route` needs to be set up properly; this one means that the worker will serve everything on `www.steveklabnik.com`. My account and zone IDs are needed; you can find these on the Cloudflare dashboard on the bottom right of the main page for it. `workers_dev` is false; I’m deploying to my site, not to a subdomain of `workers.dev`. If we did, we wouldn’t need the `zone_id`, or `route`. Finally, the `bucket` setting needs to be set to whatever your site generator’s output directory is, which for Zola is `public`.

And that’s it! You can test out what this looks like:

```
> wrangler preview
```

If that all looks good, we can deploy:

```
> zola build
> wrangler publish
```

And that’s it! And wow is it fast:

![https://svbtleusercontent.com/hS1xpZgYuQ9sRhUxP1iqq20xspap_small.png](https://svbtleusercontent.com/hS1xpZgYuQ9sRhUxP1iqq20xspap_small.png)

---

… well, we’re *almost* done. Right now, this means I can only publish from my laptop. I’d prefer to have GitHub deploy this. We don’t have that as a built-in feature today, so I’d have to write an Action to do so. I haven’t yet, so I can’t blog about that. Maybe next time.

Additionally, there’s one more twist. Zola generates different URLs than my previous ones. I had previously had `.html` on the ends of my pages, but Zola does not do this.

- old: https://www.steveklabnik.com/deleuzional.html
- new: https://www.steveklabnik.com/deleuzional/

I think I’d prefer the new style anyway, so rather than figure out how to get Zola to do this, let’s set up some redirects. This is one cool thing about using Workers for this kind of task; while it’s slightly more manual, we can also make customizations very easily. The contents of the Worker that serves up the site lives in `workers-sites/index.js`. It’s very short.

```
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
```

Given that I only have two URLs, rather than doing something big and fancy, I did something dumb and straightforward:

```
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {

  // redirect some old URLs
  let pathname = new URL(event.request.url).pathname;

  if (pathname === "/security.html") {
    return Response.redirect("https://www.steveklabnik.com/security/", 301);
  } else if (pathname === "/deleuzional.html") {
    return Response.redirect("https://www.steveklabnik.com/deleuzional/", 301);
  }

  try {
    return await getAssetFromKV(event);
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
```

I’m constructing `pathname` twice here, but I just don’t care enough to bother to refactor this out. Additionally, it’s nice to purely add, rather than customize what was generated too much.

But with that, and another `zola build && wrangler publish`, I have the redirects set up for my site.
