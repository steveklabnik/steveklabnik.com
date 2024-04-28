---
title: "Rescuing Resque (again)"
pubDate: 2015-10-28
blog: words
---


A long time ago, there was a big open source project, which was a huge part of the Rails world, but had almost no maintenance. This project was Resque, the go-to way to write background jobs for your Rails application. I attended a talk where the current maintainer was clearly getting burned out, and so, [offered to help](http://blog.steveklabnik.com/posts/2012-09-22-resque--let-s-do-this). The problem is, things have changed.

It wasn’t just me. It was a bunch of people. We all used Resque, and loved it, and wanted to make it better. We made plans for a big 2.0 to pay off a bunch of technical debt, simplify the codebase, and add more features. A ton of people chipped in, I had some awesome remote pairing sessions. Things were good.

But slowly, we all started to drift away. One contributor changed jobs. Another decided to spend more time with family. I got discouraged, and then, there was a strange situation in which I accidentally released an entirely straight-up broken version. So I got scared, released a fix, and basically never touched Resque again.

Resque is used by a *lot* of people:

![https://svbtleusercontent.com/rsoq8peusw08q_small.png](https://svbtleusercontent.com/rsoq8peusw08q_small.png)

Yet, it hasn’t seen a release in 18 months. The PRs are piling up. 2.0 is basically dead in the water. I’m not much of a fan of 2.0s anymore myself, at least, ones that don’t follow the “stability without stagnation” principles. I don’t use Resque myself anymore, and barely have enough time for my work, let alone my personal projects, let alone a project that I care about but only work on out of the goodness of my heart.

I’m here to tell you that that’s changing a little bit. I’ve been chatting with [Chris Hoffman](https://github.com/hoffmanc/), who’s interested in starting up on work again. I asked him what his intentions were, and what he answered with was exactly what I wanted to hear, as it turns out. So, I’m going to be doing some work again, this time, with the explicit intention of handing off maintenance to Chris and anyone else who wants to chip in. If you use Resque commercially, this is a great time to give some of your people the opportunity to give back. If you’ve never worked on an open source project before, but want to, I’d be more than happy to help mentor you with this. Resque is a big, real project, with a lot of impact. You can do a lot of good. That’s why I started working on it.

Without further ado, here is The Plan, from Chris and I:

## TL;DR

- change `master` from unreleased 2.0 back to `1-x-stable`
- clean up tests - make the development experience enjoyable
- integrate pending Pull Requests
- 2.0? Never heard of it. At least, not for a while.

## Make `1-x-stable` master again

[Many](https://github.com/resque/resque/issues/1175) [have](https://github.com/resque/resque/issues/976) stated that the README on the master branch has led them astray, because the published gem is still at 1.25.2.

We will plan on making this switch in the next couple of weeks. If you feel this is the wrong move, please let us know. But since active development will in fact happen on 1.x, this feels like the correct thing.

## Fix up the test suite

Tests need to be fast, and clean, so that there is more incentive to contribute.

One possible approach is using one of the available Redis mocking libraries (mock_redis, fakeredis) in non-forking tests, which could speed suite execution up considerably.

## Review Pending `1-x-stable` PRs

This is the lion’s share of the work, as there are currently 56 (that’s *[fifty six](https://github.com/resque/resque/pulls)*) open pull requests…

*And that’s an awesome problem!* Let’s make use of them! These PRs need to be evaluated and closed, so that the project can benefit from the community.

## Decide What to do with 2.0

The focus of Resque should be on stability, with an eye towards legacy support. 2.0 is off the table, at least in the near term.

If there is a 2.0, it will be a “garbage collection”-style release, where only deprecated functionality is removed, and the upgrade path is clear.
