---
title: "Seriously: numbers: use them!"
pubDate: 2012-09-27
blog: literate-programming
---


[Turbolinks test](http://vimeo.com/50340416) from [Steve Klabnik](http://vimeo.com/steveklabnik) on [Vimeo](http://vimeo.com/).

If you don’t feel like watching…

[https://github.com/steveklabnik/turbolinks_test](https://github.com/steveklabnik/turbolinks_test)

Results with 1000 pages:

Blank Rails app:

```
$ rspec
       user     system      total        real
 no turbolinks 11.170000   0.980000  12.460000 (138.656728)
yes turbolinks 10.800000   0.870000  11.670000 ( 80.436286)
```

With Basecamp Next’s CSS file:

```
$ rspec
       user     system      total        real
 no turbolinks 14.470000   1.540000  16.320000 (235.404727)
yes turbolinks 10.730000   0.870000  11.600000 ( 82.176967)
```

With Basecamp Next’s JS file:

```
$ rspec
       user     system      total        real
 no turbolinks 15.300000   1.700000  17.270000 (433.880904)
yes turbolinks 10.540000   0.890000  11.430000 (170.545663)
```

With Both:

```
$ rspec
       user     system      total        real
 no turbolinks 21.990000   2.890000  25.150000 (581.822206)
yes turbolinks 10.970000   0.910000  11.880000 (196.481247)
```

## TL;DR

Turbolinks seems to speed up apps.
