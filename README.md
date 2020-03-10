# Typescript port
I was looking for an embeddable commenting solution and found schnack. Unfortunately, it only offers support for SQLite, which is a personal no-go for production environments.
As a non JavaScript developer I found no better solution then porting schnackjs to Typescript and implement other database connections myself. I tried to stick to the original js implementation where possible. BTW: I am pretty new to TS also, so don't expect this to be the best code you ever saw.

## the three biggest differences:
- I did not implement Mastodon as authentication provider, as I don't have the need
- I implemented a sort of dynamic configuration giving an easy way to configure differently for different environments and an easy way to pass environment variables
- There is no array of administrators in the configuration files anymore. If you have to go into the database to find out id's, you can go into your database to write an administrator flag in a record as well.

## Additional feature:
It is possible to post comments anonymously.

#### A lot of the code has not been tested, some features currently don't work and there is a still a lot of clean-up to be done also. I will definitely not do this on this branch.

# schnack.js

[Schnack](https://dict.leo.org/englisch-deutsch/schnack) is a simple Disqus-like drop-in commenting system written in JavaScript.

* [Documentation](https://schnack.cool/)
* [Say hello to Schnack.js](https://www.vis4.net/blog/2017/10/hello-schnack/)
* Follow [@schnackjs](https://twitter.com/schnackjs) on Twitter

## What the schnack?

Features:
- Tiny! It takes only ~**8 KB!!!** to embed Schnack.
- **Open source** and **self-hosted**.
- Ad-free and Tracking-free. Schnack will **not disturb your users**.
- It's simpy to moderate, with a **minimal** and **slick UI** to allow/reject comments or trust/block users.
- **[webpush protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol-12) to notify the site owner** about new comments awaiting for moderation.
- **Third party providers for authentication** like Github, Twitter, Google and Facebook. Users are not required to register a new account on your system and you don't need to manage a user management system.

### Quickstart

This is the fastest way to setup *schnack*.

**Requirements**:
- Node.js (>= v6)
- npm (>= v5)

Clone or download schnack:

```bash
git clone https://github.com/schn4ck/schnack
```

Go to the schnack directory:
```bash
cd schnack
```

Install dependencies:
```bash
npm install
```

Copy and edit the config file according to [configuration](https://schnack.cool/#configuration) section:

```bash
cp config.tpl.json config.json
vim config.json                 # or open with any editor of your choice
```

Run the server:
```bash
npm start
```

Embed in your HTML page:

```html
<div class="comments-go-here"></div>
<script src="https://comments.example.com/embed.js"
    data-schnack-slug="post-slug"
    data-schnack-target=".comments-go-here">
</script>
```

**or** initialize *schnack* programmatically:

```html
<div class="comments-go-here"></div>

<script src="http://comments.example.com/client.js"></script>
<script>
    new Schnack({
        target: '.comments-go-here',
        slug: 'post-slug',
        host: 'http://comments.example.com'
    });
</script>
```

You will find further information on the [schnack page](https://schnack.cool/).

### Configuration

**Notify Providers:**

* pushover
* webpush
* slack
* rss
* sendmail

### Who is behind Schnack?

Schnack is [yet another](https://github.com/gka/canvid/) happy collaboration between [Webkid](https://webkid.io/) and [Gregor Aisch](https://www.vis4.net).

### Who is using Schnack?

Schnack will never track who is using it, so we don't know! If you are a Schnack user, [let us know](https://twitter.com/schnackjs) and we'll add your website here. So far Schnack is being used on:

* https://schnack.cool (scroll all the day down)
* https://vis4.net/blog
* https://blog.datawrapper.de
* https://blog.webkid.io

### Related projects

This is not a new idea, so there are a few projects that are doing almost the same thing:

* [CoralProject Talk](https://github.com/coralproject/talk) - Node + MongoDB + Redis
* [Discourse](https://github.com/discourse/discourse) - Ruby on Rails + PostgreSQL + Redis
* [Commento](https://github.com/adtac/commento) - Go + Node
* [Isso](https://github.com/posativ/isso/) - Python + SQLite3
* [Mouthful](https://mouthful.dizzy.zone) – Go + Preact
