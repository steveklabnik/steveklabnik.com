---
title: "What's next for SemVer"
pubDate: 2019-02-11
blog: words
---


On December 18, 2009[1](about:blank#fn1), the Semantic Versioning specification was announced. More commonly known as SemVer, it provided guidance for developers regarding software versions:

> I propose a simple set of rules and requirements that dictate how version numbers are assigned and incremented. For this system to work, you first need to declare a public API. This may consist of documentation or be enforced by the code itself. Regardless, it is important that this API be clear and precise. Once you identify your public API, you communicate changes to it with specific increments to your version number. Consider a version format of X.Y.Z (Major.Minor.Patch). Bug fixes not affecting the API increment the patch version, backwards compatible API additions/changes increment the minor version, and backwards incompatible API changes increment the major version.I call this system “Semantic Versioning.” Under this scheme, version numbers and the way they change convey meaning about the underlying code and what has been modified from one version to the next.
> 

The author came from the Ruby world, and around the same time, some big things were brewing. [Bundler](https://bundler.io/) was being brought into the world. Bundler brought a few new things, but the most important features involved specifying dependencies for your projects. Normally, you’d specify which version of a gem your project needed. Instead, Bundler allowed you to specify a range of versions you’d accept, and it would help figure out which version you should use, according to the SemVer rules.

In January of 2010, npm, a similar program for the shiny new Node.js, also shipped, and also used SemVer.

Thanks to these tools, Ruby and Node enjoyed (and still do, to this day) a vibrant open source ecosystem. SemVer is the underlying concept that made this possible.

However, SemVer is not perfect. In some ways, I think of SemVer as the `gofmt` of versioning:

> Gofmt’s style is no one’s favorite, yet gofmt is everyone’s favorite.Go Proverbs
> 

SemVer has its flaws, but it empirically works better than previous attempts at such a thing. That such a thing exists is far more important than how perfect it is. Fundamentally, version numbers are a communication tool, and SemVer provides a framework for said communication.

That said, SemVer *does* have flaws. Bundler, `npm`, Rust’s Cargo, NuGet, and a variety of tools have implemented the specification. But there are edge cases, as well as gaping holes, in the spec, and so in some ways, these tools are incompatible.

Over the last few months, several of us[2](about:blank#fn2) have been talking, and today, we have an announcement to make. We’ve formed a semver team, and we intend to start work on producing a new version of the spec.

Who is “we”? The team roster will be [in a GitHub team](https://github.com/orgs/semver/teams/maintainers/members)[3](about:blank#fn3), but for posterity’s sake, here’s the initial list of members, in the same order GitHub lists them:

- Anand Gaurav, NuGet
- Dave Herman, Notion
- André Arko, Bundler
- isaacs, npm
- Samuel Giddins, CocoaPods
- Steve Klabnik, Cargo

(I’m putting myself as “Cargo,” because Cargo is the main client of my SemVer implementation. In most of these projects, the person who maintains the SemVer implementation is the same as the project, but in Rust, they’re separate. Cargo is the higher-order bit here, though.)

We have not yet started the work on the next iteration of the specification, but we have agreed on a governance model for SemVer. Described in the new `[CONTRIBUTING.md](https://github.com/semver/semver/blob/master/CONTRIBUTING.md)`, we’re going with an RFC process, similar to the Rust programming language and many other projects. In short, “substantial” changes to the SemVer spec need to go through a process by which a written description of the changes are proposed, and the team reaches consensus on acceptance.

It also contains some principles we have for the future of SemVer. I’ve copied the important ones for the specification itself here:

- No RFC will be approved if it is deemed to cause significant breakage to any of the SemVer-using communities represented by the SemVer Maintainers group.
- RFCs will be considered formally adopted only when they are approved by the SemVer Maintainers group, and implemented in a simple majority of represented implementations.
- Implementations may add functionality in advance of an approved RFC but all such functionality must be flagged as “experimental”, so that users understand it may change in the future.

In essence, we don’t intend to re-write the spec, but instead, fill in holes in the spec, find out where our implementations differ, and unify all of our implementations as much as is feasible. We believe that this will not only help all of us, but also help new tools as well. Being compatible with each other is an important part of the value of these tools.

I look forward to letting you know when our work is done! If you’d like to get involved, please watch that governance repository, and submit RFCs! While we’re all excited about the future of SemVer, it’s nobody’s job to do this work. As such, we’ll be moving fairly slowly. Please be patient. Thanks :)

---

You may also want to read [Phil’s post](https://haacked.com/archive/2019/02/11/semver-collective/), reflecting on this transition from the other side. Thanks for being so much of a good steward of SemVer so far, Phil!

---

1. At least [according to the WayBack Machine](https://web.archive.org/web/20091218170740/http://semver.org/)[↩](about:blank#fnref1)
2. [I maintain Cargo’s `semver` implementation](https://crates.io/crates/semver).[↩](about:blank#fnref2)
3. Ugh, I’m told apparently this can’t be made public? Even better that I put the list here, then.[↩](about:blank#fnref3)
