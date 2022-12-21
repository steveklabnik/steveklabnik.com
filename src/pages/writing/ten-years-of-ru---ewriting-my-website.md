---
layout: ../../layouts/MarkdownPostLayout.astro
title: Ten Years of Ru...ewriting my website
pubDate: 2022-12-21
---

December 21 is the anniversary of when I first heard about Rust way back in
2012. I used to write yearly posts about it; the last time I did was [in
2018](../six-years-with-rust). That makes today ten years. I thought I'd have
something big to say here, but... I just don't.

Part of that is because I haven't written a blog post since late 2020.
Part of *that* is well, *gestures wildly at everything*, but another part of it
is that the way I had set up my website was cool, but fragile, and I didn't have
the time or energy to keep up with it.

You see, last time I had basically taken a starter project for a new framework
I had never used before, and just kinda wrote code until it works. That's one
of the joys of having your own website; you can do whatever you want with it,
including things you wouldn't do in a professional context. The downside is that
you can do whatever you want with it, including things you wouldn't do in a
professional context. My RSS feed has been broken for who knows how long, and
I just couldn't muster up the effort to fix it.

So last night, I did something new: I did the tutorial for a new framework I
had never used before, and wrote code until it works.

Yeah yeah that's funny and all, but I actually feel much better about things
this time. We'll see how I feel in six months. The framework this time is
[Astro](https://astro.build/), and I think it's really neat. At some point after
I do some more with it and digest some more of the way that it works, I'll give
a more thorough writeup, but I find the [Why Astro?][why-astro] page on their
site does a good job of explaining.

[why-astro]: https://docs.astro.build/en/concepts/why-astro/

Why not a Rust based framework? I want to do more in that space too, but the goal
here is to stretch my legs, and using a language (TypeScript, in this case) that
I don't use often is more interesting than the thing I use daily.

However, one little thing did come up during the development of this project
that I thought was kind of amusing, in a 'compare and contrast' kind of way.

I like for my blog to have entries grouped by year. There's no database in this
project, so I have to sort things myself. Here's the relevant code as it stands
today, with some small omissions for clarity:

```astro
import type { MarkdownInstance } from "astro";
const allPosts = await Astro.glob('../pages/writing/*.md');

let allPostsByDate = (() => {
    let posts: { [key: string]: MarkdownInstance<Record<string, any>>[] } = {};
    allPosts.map((post) => {
        let year = new Date(post.frontmatter.pubDate).getFullYear();
        let array = posts[year.toString()];

        // if this is the first post of this year, we have to create the inner array
        if (!array || !array.length) {
            posts[year.toString()] = [];
        }

        posts[year.toString()].push(post);
    })

    return posts;
})();

const years = Object.keys(allPostsByDate).reverse();
---
<BaseLayout>
    <p>This is my blog.</p>
    {years.map((year) => (
      <h3>{year}</h3>
        <ul>
            {allPostsByDate[year].map((post) => <BlogPost url={post.url} title={post.frontmatter.title} />)}
        </ul>
    ))}
</BaseLayout>
```

I'm sure there's like, ten thousand things wrong with this code; like I said,
TypeScript beginner over here. I figured this stuff out myself, there's
probably a better way to do these things, but this works. (Okay, actually while
writing this I realized I didn't sort *within* the years, so the real code now
handles that too, but I left it out because it's not super relevant to the issue
at hand here.)

This is a pretty classic "I'm doing something in a scripting language" style
setup: you make some sort of data structure out of maps (or objects in this
case, of course) and arrays, and then spit it out in some form. But TypeScript
prefers types, it's right there in the name! And I had configured TypeScript
to be in its strictest mode, becuase I like types too. Here's the one big type
annotation I had to use: 

```typescript
let posts: { [key: string]: MarkdownInstance<Record<string, any>>[] } = {};
```

If I didn't put a type on `posts`, it complains later in the program:

```text
`Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  No index signature with a parameter of type 'string' was found on type '{}'.
```

It needs a bit of help to figure out the type here. Figuring out how to say
"hey this is on object with string keys and arrays of `MarkdownInstance` as
values" took me a second, but it's not too bad. But I did struggle with it a bit,
first to figure out why I was getting the error in the first place, and second
so that I could fix it. I kinda laughed at struggling with types in this dymanic
feeling context.

So anyway, I also had to do a bit of translating markdown files; I had exported
all of my old posts from Notion, but I couldn't just plop them in and expect
them to work; Notion doesn't give you the metadata in a frontmatter block, for
starters. I have something like 200 posts, so doing this by hand is *just*
annoying enough that I said "I bet I can code this up faster than if I did it
all by hand, even with a vim macro."

But by now, I was in "get stuff done" mode, so I decided to switch back to Rust.
The program I wrote needed to:

1. Open each markdown file in the directory.
2. Try to parse out the metadata.
3. use that metadata to write out a new file, with a new filename, and the
   metadata in a more friendly format.
4. Delete the old file.

This is a classic scripting task! But at this point, I know how to do it in Rust
easier than in a scripting language. I started like this:

```console
> cargo new migrate
> cd migrate
> cargo add anyhow
> cargo add walkdir
> code .
```

And ended up writing this:

```rust
use anyhow::Result;
use std::io::Write;
use std::{
    fs::{self, File},
    path::PathBuf,
};
use walkdir::WalkDir;

fn main() -> Result<()> {
    let from = std::env::args().skip(1).next().unwrap();
    println!("from: {}", from);
    for entry in WalkDir::new(from) {
        let entry = entry.unwrap();
        println!("Processing: '{}'", entry.path().display());

        if entry.file_type().is_dir() {
            continue;
        }

        let contents = fs::read_to_string(entry.path())?;

        if &contents[0..3] == "---" {
            println!("already migrated, skipping");
            continue;
        }

        let header: Vec<_> = contents.lines().take(7).collect();
        if &header[0][0..2] != "# " {
            eprintln!("couldn't read title, skipping");
            continue;
        }
        let title = &header[0][2..];

        if &header[3][0..6] != "Blog: " {
            eprintln!("couldn't read blog, skipping");
            continue;
        }
        let blog = &header[3][6..].to_ascii_lowercase().replace(' ', "-");

        if &header[4][0..6] != "Date: " {
            eprintln!("couldn't read date, skipping");
            continue;
        }
        let date = &header[4][6..];

        if &header[6][0..6] != "Slug: " {
            eprintln!("couldn't read slug, skipping");
            continue;
        }
        let slug = &header[6][6..];
        dbg!(slug);
        let mut slug = PathBuf::from(slug);
        slug.set_extension("md");

        let output = entry.path().parent().unwrap();
        let output_path = output.join(slug);
        println!("writing to: {}", output_path.display());

        let mut output = File::create(&output_path)?;
        write!(
            output,
            "---
layout: ../../layouts/MarkdownPostLayout.astro
title: \"{}\"
pubDate: {}
blog: {}
---\n\n",
            title, date, blog
        )?;
        for line in contents.lines().skip(7) {
            writeln!(output, "{}", line)?;
        }
        fs::remove_file(entry.path())?;
    }

    Ok(())
}
```

76 lines. Not too bad. This is *quick and dirty*, it is not perfect. For
example, like ten of my posts had no 'blog' metadata (that tells me which of
my old blogs the post was originally written for), and so it didn't work on
them. I still needed to do some small cleanup, but I wanted to double check
every post anyway, so that was fine.

But there's a few other things that are kind of amusing to me about this code:

1. I struggled with types in the scripty scenario above, but I did not here. I
   am more experienced with Rust so that's probably it, but I needed to annotate
   one type, just like in the TypeScript.
2. I didn't deal with lifetimes at all. Owned values, baby! And passing references
   to some functions.
3. I didn't deal with memory at all. No borrow checker complaints, none of that.
   It didn't take me any extra time to "think about ownership and borrowing."
4. It didn't take me that long to write this. You can actually see a vestigial
   thing of how it was implemented, can you spot the `dbg!` statement? I wrote
   each part in sequence, printing out the information to manually validate that
   it looked correct, and then eventually adding the "write new file" and
   "delete old file" stuff when I was sure the process would complete correctly.
   Lots of copy/paste there too, as you can see. I don't care. I'm never using
   this code again now that the migration is done. That's also why I didn't try
   to do some sort of struct and "deserialize" the contents, instead just
   parsing it out like I'd never heard of the term "parsing" before. It's fine.

So yeah, I had too many type problems in my 'real' JavaScript program, and no
type problems in my script-y Rust. Kinda funny.

I guess I have ended up making this a post about Rust anyway, even though I
didn't think I had much to say when I started. Now that Rust has grown so much,
people who love it are using it for all kinds of things, and sometimes that
seems to piss some people off. "You can't use a systems language for scripting
tasks, nooo!!" they cry. If you had asked me ten years ago if I should write web
backends in Rust or replace shell scripts with Rust, I'd have said the same
thing. But now that I've used Rust enough, a lot of those sort of generic
complaints about Rust don't speak to my actual experience: I had a problem, I
wrote ~70 lines of code in not very much time, problem solved. Seems like Rust
worked just as well as anything else would have. Yes, it's true that maybe if
you've just picked up the language, you'd have written that code much more
slowly than in another language you're more familiar with, or maybe you'd have
hit some sort of error that was confusing and took up a bunch of time, just like
I did with my TypeScript. But just because you may have those problems, doesn't
mean that everyone does. And, it also means that in the future, if you stick with
it, you won't have those problems either! Or at least, it's possible not to. Not
every tool clicks with every person.

Here's to another ten years.
