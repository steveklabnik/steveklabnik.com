---
title: "Announcing Rust Contributors"
pubDate: 2017-01-12
blog: words
---


When I was working with Ruby on Rails, someone once sent me this link:

http://contributors.rubyonrails.org/

In some ways, this link changed my life. You see, I respond *really* strongly to integers going upwards. I am a sucker for points, hits, whatever. That web page, however, puts that integer towards something useful: open source contributions. It’s fairly well known that open source contribution is a long tail, but that’s also *perfect* for this kind of gamification. One contribution, as of today, will put you in 2461th place. Your second? 1473! That’s almost a thousand places! Just *one* more contribution puts you at number 1114. Still three hundred spots. Your forth commit will let you get in the top 900, #893. You get the idea. (I ended up at #47.)

Today, I’m working on Rust. And one of the things that I do is write the release announcements, or at least, their first draft. And one of my favorite things to do is the last bit: thanking all of the people who have put in work toward this release. It’s one of my favorite things because I really do appreciate all of the patches, but also because I remember how hooked I was when people gave me a little bit of credit for my contribution. Thanking people is powerful.

So to write those blog posts, I have to run some `git` commands. And I always forget *exactly* what I have to write, given our branching strategy. So I wrote a little `Rakefile` almost a year ago that will generate a new post with the appropriate thank yous and statistics. But I never made it general enough; I have to tweak the numbers every release. It’s annoying. I’ve always wanted to fix it up. There’s one more way in which I don’t like this setup: we only thank people who contribute to `rust-lang/rust`. Even those with a commit to Cargo don’t make it in there. It’s a historical artifact of the release process, but I don’t like it. We should be thanking those people too.

While all of this has been rolling around in the back of my brain, I’ve been thinking about contributors.rubyonrails.org. I’ve said for a while I wanted it in Rust. So, over the last few days, I hacked one together.

https://rust-contributors.herokuapp.com/

Right now, it only replicates what we say in the blog posts. It doesn’t show commit counts, or order by it, or anything. But the foundation is there. Also, since this is a fun hack, I didn’t take too much care when writing it: there’s a number of low-hanging fruit kinds of things to do. I didn’t use a fancy web framework. I didn’t focus on refactoring relentlessly. I didn’t write any tests. The error handling is basically non-existent. I just knocked it out as fast as I can. But it’s a web app, written in Rust, and that’s fun.

If you’d like to help me hack on this, head over to https://github.com/steveklabnik/contributors and take a look at the issues. I’ve already identified a number of things, and if you do web work but have been meaning to mess with Rust, this might be a good chance to give it a shot.

Thank you to everyone who submits patches to Rust; you’re all great, and I’m lucky to be able to work with you all.
