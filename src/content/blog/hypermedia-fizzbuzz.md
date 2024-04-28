---
title: "Hypermedia FizzBuzz"
pubDate: 2014-05-02
blog: words
---


I read a really great blog post last week: [Solving FizzBuzz with Hypermedia](http://smizell.com/weblog/2014/solving-fizzbuzz-with-hypermedia). In it, Stephen Mizell builds a FizzBuzz service using [Siren](https://github.com/kevinswiber/siren), and then shows how client code evolves. I wanted to explain exactly why I think this example is amazing, because I’m not sure it’s exactly obvious.

## FizzBuzz? Really?

The first thing that makes this post brilliant is that it uses FizzBuzz. While FizzBuzz has historically been a simple interview question to make sure that you can actually write some basic code, in this case, it works well because it’s a very, very simple programming problem. When writing examples, there’s always tension between real-world and straw-man examples. If you make it too real-world, all sorts of incidental details creep in and distract from your main point. If you make a trivial example, it can be claimed that it works for your simple example, but not for ‘real’ examples. Now, this may be true of FizzBuzz, but what I like about it is that it’s an example that everyone is already familiar with. It has *just enough* actual computing that it straddles that line.

## Haters gonna HATEOAS

The real insight of this post, however, is demonstrating one of the hardest concepts to grok about the hypermedia approach: the way in which hypermedia reduces duplication, by moving application entirely to the server. This is the core of that dreaded “HATEOAS” concept, and it’s where people get tripped up. Here’s the sample client in the hypermedia style:

```
from siren import SirenResource as Hyperclient

BASE_URL = "http://fizzbuzzaas.herokuapp.com"

def fizzbuzz(resource):
    """
    Prints the fizzbuzz value and follows "next" links
    """
    print resource.properties["value"]

    if resource.has_link("next"):
        fizzbuzz(resource.follow_link("next"))

def begin_fizzbuzz(resource):
    """
    Follows the first link, then hands off to fizzbuzz
    """
    if resource.has_link("first"):
        fizzbuzz(resource.follow_link("first"))

root_resource = Hyperclient(BASE_URL, path="/")
begin_fizzbuzz(root_resource)
```

Let’s talk about what this client’s goal is: to print a list of numbers. This is a classic recursive list traversal algorithm: we start at the head of the list (`first`), and then follow the links until we get to the end. (`next`) This client *does not actually calculate fizzbuzz*. It just so happens that the service we’re pointing it at calculates FizzBuzz. If we pointed it at, say, a list of search results, where the same link relations and Siren were used, it would still work!

Compare this to the non-hypermedia client:

```
import requests

BASE_URL = "http://fizzbuzzaas.herokuapp.com"

def fizzbuzz(params):
    url = BASE_URL + "/fizzbuzz"
    response = requests.get(url, params=params)
    response_json = response.json()
    return response_json["properties"]["value"]

for number in range(1, 101):
    print fizzbuzz({"number": number })
```

This client doesn’t fully calculate FizzBuzz on its own, but it does have some of the logic for doing so embedded inside. We explicitly loop over the range FizzBuzz needs, and we print out each value.

Why does this matter? It seems like a pretty subtle distinction. Well, this logic already exists on the server. We’re duplicating that logic here. This duplication creates coupling across the client/server boundary. For example, if we pointed this client at a “search results” resource, we would get 100 search results, even if there are less. We’re not letting the server guide our interactions, and we’re coding business logic into the client.

This comes back to bite us when we try to change the client. As Stephen’s next example shows:

```
import requests

BASE_URL = "http://fizzbuzzaas.herokuapp.com"
STARTS_AT = 4
ENDS_AT = 20
ADD = 2

def fizzbuzz(params):
    url = BASE_URL + "/fizzbuzz"
    response = requests.get(url, params=params)
    response_json = response.json()
    print response_json["properties"]["value"]

    params["number"] += ADD

    if params["number"] <= ENDS_AT:
        fizzbuzz(params)

fizzbuzz({ "number": STARTS_AT })
```

This version uses different start, end, and skip parameters. And so we had to throw out our entire old client, because it was too tightly coupled to the notion of how to calculate FizzBuzz. We’re now manually doing the skip and end calculations, even further coupling this client. Our fundamental algorithm even changed: the last client was iterative, but this client is recursive. We could have still made it iterative, but that still would have been a lot of change.

Now , the hypermedia version:

```
from siren import SirenResource as Hyperclient

BASE_URL = "http://fizzbuzzaas.herokuapp.com"

def fizzbuzz(resource):
    """
    Prints the fizzbuzz value and follows "next" links
    """
    print resource.properties["value"]

    if resource.has_link("next"):
        fizzbuzz(resource.follow_link("next"))

def begin_fizzbuzz(resource):
    """
    Follows the first link, then hands off to fizzbuzz
    """
    if resource.has_link("first"):
        fizzbuzz(resource.follow_link("first"))

def custom_fizzbuzz(root_resource, params):
    """
    Submits actions for custom fizzbuzz
    """
    resource = root_resource.take_action("custom-fizzbuzz", params)
    begin_fizzbuzz(resource)

root_resource = Hyperclient(BASE_URL, path="/")
params = { "startsAt": 4, "endsAt": 20, "add": 2 }
custom_fizzbuzz(root_resource, params)
```

Very little has changed between the last client and this one. We just added an extra method to submit our custom start point, but the rest of the code is all identical: we’re still traversing the list, with the same code. This worked because we chose the right behavior for our client, and let the server handle all of the business logic.

## Traversal from the root

The last thing this post does is demonstrate how an actual hypermedia API starts from the API root and progresses from there. Lots of people hear this, and assume that there will be way more API calls than in an API in a different style. That’s because they assume that the client will be written in the same way as they’re used to: function calls over HTTP. As you can see here, we don’t start each call from the root of the API, we start *our initial interaction with the service* from the root of the API. Each step is just one more call after that, just like in any other API.

This is the other part of the hypermedia constraint that trips people up. Navigating a state machine of your API’s business process has a very different feel than making function calls over HTTP. It requires a different kind of mindset and approach to building clients. This is the area of hypermedia research that’s been least published about. The server-side story has been fleshed out, but the real frontier in hypermedia theory and practice is client building guidelines, and that’s why I like this example so much.
