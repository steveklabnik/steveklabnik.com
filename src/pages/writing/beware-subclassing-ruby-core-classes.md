---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Beware subclassing Ruby core classes"
pubDate: 2013-07-24
blog: words
---


TL;DR: Subclassing core classes in Ruby can lead to unexpected side effects. I suggest composition over inheritance in all these cases.

## Subclassing Review

If you’re familiar with the concept of subclassing, skip down to “The Problem.”

In Ruby, you can make your own classes:

```ruby
class List
end
```

You can also make subclasses of those classes:

```ruby
class OrderedList < List
end

puts OrderedList.new.kind_of?(List) # => true
```

Now, subclassing represents an “is a” relationship. This means that our `OrderedList` should be a `List` in every respect, but with some added behavior. The [Liskov Substitution Principle](http://en.wikipedia.org/wiki/Liskov_substitution_principle) is one formulation of this idea.

## The Problem

Ruby has two major bits of code that it provides for your use: the core library and the standard library. [The core library can be found here](http://www.ruby-doc.org/core-2.0/), and contains cllasses that you know and love, like `String`, `Hash`, and `Array`. [The standard library can be found here](http://www.ruby-doc.org/stdlib-2.0/), and contains your favorite hits, like `CSV`, `JSON`, and `Logger`.

One way to think about the difference between core and the standard library is that core is written in C, while the standard library is written in Ruby. Core are the classes that are used the most, so they’re implemented in as low-level a fashion as possible. They’ll be in every single Ruby program, so might as well make them fast! The standard library only gets pulled in by bits and pieces; another way of thinking about the difference is that you need to `require` everything in the standard library, but nothing in core.

What do you think this code should do?

```ruby
class List < Array
end

puts List.new.to_a.class
```

If you said “it prints `Array`,” you’d be right. This behavior really confuses me, though, because `List` is already an `Array`; in my mind, this operation shouldn’t suddenly change the class.

Why does this happen? Let’s check out the implementation of `[Array#to_a](https://github.com/ruby/ruby/blob/trunk/array.c#L2064-L2082)`:

```c
static VALUE
rb_ary_to_a(VALUE ary)
{
    if (rb_obj_class(ary) != rb_cArray) {
        VALUE dup = rb_ary_new2(RARRAY_LEN(ary));
        rb_ary_replace(dup, ary);
        return dup;
    }
    return ary;
}
```

If the class is not an `Array`, (represented by `rb_cArray`), then we make a new array of the same length, call `replace` on it, and then return the new array. If this C scares you, here’s a direct port to pure Ruby:

```ruby
def array_to_a(ary)
  if ary.class != Array
    dup = []
    dup.replace(ary)
    return dup
  end
  return ary
end

array_to_a(List.new).class # => Array
```

So why do this? Well, again, this class will be used all over the place. For example, I made a brand new Rails 4 application, generated a controller and view, and put this in it:

```ruby
ObjectSpace.count_objects[:T_ARRAY]: <%= ObjectSpace.count_objects[:T_ARRAY] %>
```

ObjectSpace allows you to inspect all of the objects that exist in the system. Here’s the output:

![http://i.imgur.com/PVwdvyY.png](http://i.imgur.com/PVwdvyY.png)

rails arrays

That’s a lot of arrays! This kind of shortcut is generally worth it: 99.99% of the time, this code is perfect.

That last 0.01% is the problem. If you don’t know exactly how these classes operate at the C level, you’re gonna have a bad time. In this case, this behavior is odd enough that someone was kind enough to document it.

Here’s the Ruby version of what I’d expect to happen:

```ruby
def array_to_a2(ary)
  return ary if ary.is_a?(Array)
  dup = []
  dup.replace(ary)
  dup
end

array_to_a2(List.new).class # => List
```

This has the exact same behavior except when we’re already dealing with an Array, which is what I’d expect.

Let’s take another example: reverse.

```ruby
l = List.new
l << 1
l << 2
puts l.reverse.class # => Array
```

I would not expect that calling `#reverse` on my custom `Array` would change its class. Let’s [look at the C](https://github.com/ruby/ruby/blob/trunk/array.c#L2138-L2161) again:

```c
static VALUE
rb_ary_reverse_m(VALUE ary)
{
    long len = RARRAY_LEN(ary);
    VALUE dup = rb_ary_new2(len);

    if (len > 0) {
        const VALUE *p1 = RARRAY_RAWPTR(ary);
        VALUE *p2 = (VALUE *)RARRAY_RAWPTR(dup) + len - 1;
        do *p2-- = *p1++; while (--len > 0);
    }
    ARY_SET_LEN(dup, RARRAY_LEN(ary));
    return dup;
}
```

We get the length of the array, make a new blank array of the same length, then do some pointer stuff to copy everything over, and return the new copy. Unlike `#to_a`, this behavior is *not* currently documented.

Now: you could make the case that this behavior is expected, in both cases: after all, the point of the non-bang methods is to make a copy. However, there’s a difference to me between “make a new array with this stuff in it” and “make a new copy with this stuff in it”. Most of the time, I get the same class back, so I expect the same class back in these circumstances.

Let’s talk about a more pernicious issue: Strings.

As you know, the difference between interpolation and concatenation is that interpolation calls `#to_s` implicitly on the object it’s interpolating:

```
irb(main):001:0> "foo" + 2
TypeError: no implicit conversion of Fixnum into String
    from (irb):1:in `+'
    from (irb):1
    from /opt/rubies/ruby-2.0.0-p195/bin/irb:12:in `<main>'
irb(main):002:0> "foo#{2}"
=> "foo2"
irb(main):001:0> class MyClass
irb(main):002:1> def to_s
irb(main):003:2> "yup"
irb(main):004:2> end
irb(main):005:1> end
=> nil
irb(main):006:0> "foo#{MyClass.new}"
=> "fooyup"
```

So what about a custom `String`?

```ruby
class MyString < String
  def to_s
    "lol"
  end
end

s = MyString.new
s.concat "Hey"

puts s
puts s.to_s
puts "#{s}"
```

What does this print?

```
$ ruby ~/tmp/tmp.rb HeylolHey
```

That’s right! With `String`s, Ruby doesn’t call `#to_s`: it puts the value in directly. How does this happen?

Well, dealing with string interpolation deals with the parser, so let’s check out the bytecode that Ruby generates. Thanks to [Aaron Patterson](http://twitter.com/tenderlove) for suggesting this approach. <3

```
irb(main):013:0> x = RubyVM::InstructionSequence.new(%q{puts "hello #{'hey'}"})
=> <RubyVM::InstructionSequence:<compiled>@<compiled>>
irb(main):014:0> puts x.disasm
== disasm: <RubyVM::InstructionSequence:<compiled>@<compiled>>==========
0000 trace            1                                               (   1)
0002 putself          
0003 putstring        "hello hey"
0005 opt_send_simple  <callinfo!mid:puts, argc:1, FCALL|ARGS_SKIP>
0007 leave            
=> nil
irb(main):015:0> x = RubyVM::InstructionSequence.new(%q{puts "hello #{Object.new}"})
=> <RubyVM::InstructionSequence:<compiled>@<compiled>>
irb(main):016:0> puts x.disasm
== disasm: <RubyVM::InstructionSequence:<compiled>@<compiled>>==========
0000 trace            1                                               (   1)
0002 putself          
0003 putobject        "hello "
0005 getinlinecache   12, <ic:0>
0008 getconstant      :Object
0010 setinlinecache   <ic:0>
0012 opt_send_simple  <callinfo!mid:new, argc:0, ARGS_SKIP>
0014 tostring         
0015 concatstrings    2
0017 opt_send_simple  <callinfo!mid:puts, argc:1, FCALL|ARGS_SKIP>
0019 leave            
=> nil
```

You can see with a string, the bytecode actually puts the final concatenated string. But with an object. it ends up calling `tostring`, and then `concatstrings`.

Again, 99% of the time, this is totally fine, and much faster. But if you don’t know this trivia, you’re going to get bit.

[Here](https://rails.lighthouseapp.com/projects/8994/tickets/6023-unable-to-find-by-subclasses-of-string-in-activerecord#ticket-6023-5) is an example from an older version of Rails. Yes, you might think “Hey idiot, there’s no way it will store your custom `String` class,” but the whole idea of subclassing is that it’s a drop-in replacement.

I know that there’s some case where Ruby will not call your own implementation of `#initialize` on a custom subclass of `String`, but I can’t find it right now. This is why this problem is so tricky: most of the time, things are fine, but then occasionally, something strange happens and you wonder what’s wrong. I don’t know about you, but my brain needs to focus on more important things than the details of the implementation.

Since I first wrote this post, [James Edward Gray II](http://twitter.com/jeg2) helped me remember what this example is. One of the early exercises in [http://exercism.io/](http://exercism.io/) is based on making a DNA type, and then doing some substitution operations on it. Many people inherited from `String` when doing their answers, and while the simple case that passes the tests works, this case won't:

```ruby
class Dna < String
  def initialize(*)
    super
    puts "Building Dna:  #{inspect}"
  end
end

result = Dna.new("CATG").tr(Dna.new("T"), Dna.new("U"))
p result.class
p result
```

This prints:

```
Building Dna:  "CATG"
Building Dna:  "T"
Building Dna:  "U"
Dna
"CAUG"
```

It never called our initializer for the new string. Let's check [the source of `#tr`](https://github.com/ruby/ruby/blob/trunk/string.c#L5484-L5525):

```c
static VALUE
rb_str_tr(VALUE str, VALUE src, VALUE repl)
{
    str = rb_str_dup(str);
    tr_trans(str, src, repl, 0);
    return str;
}
```

`rb_str_dup` has a pretty simple definition:

```c
VALUE
rb_str_dup(VALUE str)
{
    return str_duplicate(rb_obj_class(str), str);
}
```

and so does `str_duplicate`:

```c
static VALUE
str_duplicate(VALUE klass, VALUE str)
{
    VALUE dup = str_alloc(klass);
    str_replace(dup, str);
    return dup;
}
```

So there you have it: MRI doesn't go through the whole initialization process when duplicating a string: it just allocates the memory and then replaces the contents.

If you re-open `String`, it's also weird:

```ruby
class String
  alias_method :string_initialize, :initialize

  def initialize(*args, &block)
    string_initialize(*args, &block)
    puts "Building MyString:  #{inspect}"
  end
end

result = String.new("CATG").tr("T", "U") # => Building MyString: "CATG"
p result.class # => String
p result # => "CAUG"
```

Again, unless you know exactly how this works at a low level, surprising things happen.

## The Solution

Generally speaking, subclassing isn’t the right idea here. You want a data structure that *uses* one of these core classes internally, but isn’t exactly like one. Rather than this:

```ruby
class Name < String
end
```

do this:

```ruby
require 'delegate'

class Name < SimpleDelegator
  def initialize
    super("")
  end
end
```

This allows you to do the same thing, but without all of the pain:

```ruby
class Name
  def to_s
    "hey"
  end
end

"#{Name.new}" # => "hey"
```

However, this won’t solve all problems:

```ruby
require 'delegate'

class List < SimpleDelegator
  def initialize
    super([])
  end
end

l = List.new
l << 1
l << 2
puts l.reverse.class # => Array
```

In general, I’d prefer to delegate things manually, anyway: a `Name` is not actually a drop-in for a `String` it’s something different that happens to be a lot like one:

```ruby
class List 
  def initialize(list = [])
    @list = list 
  end 
 
  def <<(item) 
    @list << item 
  end 
 
  def reverse 
    List.new(@list.reverse)
  end 
end 
 
l = List.new 
l << 1 
l << 2 
puts l.reverse.class  # => List
```

You can clean this up by using `Forwardable` to only forward the messages you want to forward:

```ruby
require 'forwardable'

class List
  extend Forwardable
  def_delegators :@list, :<<, :length # and anything else

  def initialize(list = [])
    @list = list
  end

  def reverse
    List.new(@list.reverse)
  end
end

l = List.new
l << 1
l << 2
puts l.reverse.class # => List
```

Now you know! Be careful out there!
