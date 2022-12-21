---
layout: ../../layouts/MarkdownPostLayout.astro
title: "The profile link relation and you"
pubDate: 2013-05-06
blog: words
---


I was quite pleased when [RFC 6906](http://tools.ietf.org/html/rfc6906) was finalized. It’s a really useful pattern that people are using to enhance documentation of their APIs.

Let’s start with an example. I tweet something like this:

> “Oh man, the example.com API is super awesome. You should check it out!” - [@steveklabnik](https://twitter.com/steveklabnik) seconds ago from web
> 

You don’t know anything about this API or what it offers. So you fire up `curl`:

```
$ curl -i http://example.com
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 273

{
  "wtl": "MjAxMy0wNS0wNiAxMjo1Nzo1MyAtMDcwMA==\n",
  "grobb34s": [
    {
      "flog": "Top 100 foobars",
      "zilch": "http://example.com/foo/bar?baz=qux"
    },
    {
      "flog": "Mega Troll Title",
      "zilch": "http://example.com/exploit.exe/foobar"
    }
  ]
}
```

To be blunt, this makes absolutely no sense. You tell me so, and the next day, I tell you to check it out again. You grumble, and get back to the `curl`:

```
$ curl -i http://example.com
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 273
 Link: <http://example.com/profile>; rel="profile"

{
  "wtl": "MjAxMy0wNS0wNiAxMjo1Nzo1MyAtMDcwMA==\n",
  "grobb34s": [
    {
      "flog": "Top 100 foobars",
      "zilch": "http://example.com/foo/bar?baz=qux"
    },
    {
      "flog": "Mega Troll Title",
      "zilch": "http://example.com/exploit.exe/foobar"
    }
  ]
}
```

Oh, wait. “Profile”. Let’s see what that’s about:

```
$ curl -i http://example.com/profile
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 548

The Example.com API
===================

Example.com provides access to our blog through an API.

In the API, you'll see two major things of interest: `wtl` and `grobb34s`.

## wtl

The value provided under the `wtl` key is the time the latest blog post
was posted, in "%Y-%m-%d %H:%M:%S %z" format. This value is then Base64
encoded.

## grobb34s

The `grobb34s` key will hold an array of blog posts. These posts are
represented by a JSON object with two keys. `flog` has the title, suitable for
display, and `zilch` contains a link to the post.
```

Oh. You don’t care about some blog with such terrible titles, so you go about your day.

## self-descriptive-ness

You may consider this a highly contrived example, but it’s not as contrived as you think. In Fielding’s thesis, he describes a ‘self-described messages’ constraint, which means that any API call should be able to be understood alone, without additional context.

In HTTP, this information is generally provided via the `Content-Type` header. It describes a media type (such as `application/json` in this example) that describes the rules for processing the response. When writing a HTTP client, you fetch the response, check the `Content-Type`, and then invoke the correct parser based on the type provided.

But many times are very general. Take `application/json`, for example. It says nothing about blog posts. A user-agent that only knows about `application/json` is very much like you as a human seeing gibberish keys and values; it’s not smart enough to make assumptions based on the text of keys and values it may see in JSON. However, with the added context of a profile, we have enough information to make sense of this strange API. And any user-agent that sees a profile that it recognizes can act on those new semantics, too.

## JSON API

This is one of the reasons that we’re working on [JSON API](http://jsonapi.org/), a standard media type for APIs that use JSON. Generic JSON has no standard semantics that are useful to API authors, since it’s a very generic format. By declaring a new media type with common features to many APIs, we can write generic tools that handle the 80% of cases that come up during API development.

And if the generic case doesn’t suit your requirements, you can always extend it with profiles. In fact, it’d be nice if many people just added a `Link` header to their existing API documentation; that’d start alleviating this problem.

---

If you enjoyed this article, you might want to check out my in-progress book on building APIs that respect standards and HTTP, [Designing Hypermedia APIs](http://www.designinghypermediaapis.com/). This post also serves as [its first blog post](http://www.designinghypermediaapis.com/blog/the-profile-link-relation-and-you.html).
