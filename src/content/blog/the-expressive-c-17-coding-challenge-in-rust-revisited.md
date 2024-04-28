---
title: "\"The Expressive C++17 Coding Challenge (in Rust)\" revisited"
pubDate: 2018-02-14
blog: words
---


In October of last year, I wrote a post, [“The Expressive C++17 Coding Challenge (in Rust)”](http://words.steveklabnik.com/the-expressive-c-17-coding-challenge-in-rust). For various reasons, it got brought up again in the D world, and [seb has written a new post](https://seb.wilzba.ch/b/2018/02/the-expressive-c17-coding-challenge-in-d/). It’s good, you should check it out!

However, it links to my gist, not my blog post. As I said back then:

> I held myself to the same constraints as the original contest; no external packages is a bit painful in Rust, but it’s not too bad. Mostly it would let me eliminate boilerplate while also improving correctness, and making the code a bit shorter.
> 

So, that got me thinking: What *would* this look like if I could use external packages? I took about an hour, and knocked it out. I have two versions to show you today, one where I pay no attention to allocations, and one where it’s zero-allocation.

First, the “whatever just allocate” version:

```
extern crate csv;
#[macro_use]
extern crate serde_derive;
extern crate serde;
#[macro_use]
extern crate structopt;

use std::error::Error;
use std::fs::File;
use structopt::StructOpt;

#[derive(Debug,Serialize,Deserialize)]
struct Record {
    name: String,
    surname: String,
    city: String,
    country: String,
}

#[derive(StructOpt, Debug)]
#[structopt(name = "basic")]
struct Opt {
    filename: String,
    column_name: String,
    replacement: String,
    output_filename: String,
}

fn run(args: &Opt) -> Result<(), Box<Error>> {
    let input = File::open(&args.filename)?;
    let output = File::create(&args.output_filename)?;

    let mut rdr = csv::Reader::from_reader(input);
    let mut wtr = csv::Writer::from_writer(output);

    for result in rdr.deserialize() {
        let mut record: Record = result?;

        let replacement = args.replacement.clone();

        match &*args.column_name {
            "name" => record.name = replacement,
            "surname" => record.surname = replacement,
            "city" => record.city = replacement,
            "country" => record.country = replacement,
            _ => panic!("incorrect column name"),
        }

        wtr.serialize(record)?;
    }

    wtr.flush()?;

    Ok(())
}

fn main() {
    let opt = Opt::from_args();

    if let Err(err) = run(&opt) {
        eprintln!("error: {}", err);
        std::process::exit(1);
    }
}
```

This uses the `[csv` crate](https://crates.io/crates/csv/1.0.0-beta.5) to do the heavy lifting with regards to the CSV stuff, and the `[strucopt` crate](https://crates.io/crates/structopt) for argument parsing. Not only is this code much shorter than my “no crates” version, but it’s also got more features!

There’s a few things that aren’t the best here: first, the `match`. Rust doesn’t have reflection, exactly, so saying “hey I have this string and I want to index it in this struct” is not as nice. I’m just panic-ing here, but it’d be nicer to validate it up front, and possibly even do some custom derive shenanigans so that I don’t have to write it myself, but I wanted to present a fairly *realistic* version of what I’d write today. This is good enough.

Second, there’s that one `clone`. We need it because we’ve said that our `Record` type holds `String`s, and so has ownership over the string. We end up copying `London` each iteration of the loop. Is copying a city name a problem? Not *really*, in the context of this example. But what if it *was*? Fundamentally, there’s no reason to do any allocation here: We’re reading from a file, and we’re writing the same string over and over again.

Enter version 2:

```
extern crate csv;
#[macro_use]
extern crate serde_derive;
extern crate serde;
#[macro_use]
extern crate structopt;

use std::error::Error;
use std::fs::File;
use structopt::StructOpt;

#[derive(Debug,Serialize,Deserialize)]
struct Record<'a> {
    name: &'a str,
    surname: &'a str,
    city: &'a str,
    country: &'a str,
}

#[derive(StructOpt, Debug)]
#[structopt(name = "basic")]
struct Opt {
    filename: String,
    column_name: String,
    replacement: String,
    output_filename: String,
}

fn run(args: &Opt) -> Result<(), Box<Error>> {
    let input = File::open(&args.filename)?;
    let output = File::create(&args.output_filename)?;

    let mut rdr = csv::Reader::from_reader(input);
    let mut wtr = csv::Writer::from_writer(output);

    let mut raw_record = csv::StringRecord::new();
    let headers = rdr.headers()?.clone();

    while rdr.read_record(&mut raw_record)? {
        let mut record: Record = raw_record.deserialize(Some(&headers))?;

        match &*args.column_name {
            "name" => record.name = &args.replacement,
            "surname" => record.surname = &args.replacement,
            "city" => record.city = &args.replacement,
            "country" => record.country = &args.replacement,
            _ => panic!("incorrect column name"),
        }

        wtr.serialize(record)?;
    }

    wtr.flush()?;

    Ok(())
}

fn main() {
    let opt = Opt::from_args();

    if let Err(err) = run(&opt) {
        eprintln!("error: {}", err);
        std::process::exit(1);
    }
}
```

This is *slightly* more involved, as you no longer get access to the nice iterator, and have to do things a little more manually. But it took me about five minutes to port this bit over, so it’s not *too* onerous.

So, as you can see, once you let people use external packages, the Rust gets *significantly* nicer. The code pretty much mirrors the task: open the two files, iterate over them, replace the column, write it out. Nice.

I’m not going to do any performance comparisons here because that’s not really what the contest was about. I am mildly curious… if I really wanted to optimize performance, I’d also skip the string stuff and go for bytes directly. This isn’t a super tough transformation, but moves things to be slightly lower level.

If you manipulate CSVs often, you should check out `[xsv](https://crates.io/crates/xsv)`, a command-line tool in Rust that lets you slice and dice these files with speed and ease.

---

I should also mention that several people have been working on `quicli`, a package to make making CLIs super easy. One of its authors [posted a gist of what this looks like with quicli](https://gist.github.com/killercup/049d759118e3b5029737eb77e157ea42), you should check that out too!
