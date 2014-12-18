```text
'Said Ummon to his disciples,
 "However wonderful a thing is,
 it may be that it is better
 not to have it at all."
```

Introducing [unmon](http://en.wikipedia.org/wiki/Yunmen_Wenyan)!

**unmon** is a minimalist blogging framework.

```text
A monk once asked Ummon,
  "What is this place where knowledge is useless?"
Ummon answered him: 
  "Knowledge and emotion cannot fathom it!"
```

**unmon** only depends on the nodejs runtime. 

That means:

* You don't need any external js modules
* You don't need to install a database
* You don't need to remember any new passwords

```text
Monk: "What is the one road of Ummon?"
Ummon: "Personal Experience!"
Monk: "What is the Way?"
Ummon: "Go!"
Monk: "What is the road, where is the Way?"
Ummon: "Begin walking it!"
```

The central philosophy behind **unmon** is that software should simplify repetitive tasks without obfuscating their details.

## Installation

```
git clone https://github.com/ansuz/unmon.git
```

## Execution

```
node unmon.js
```

## Architecture

If you're going to use **unmon**, you're going to need to understand its filesystem structure. Luckily, its structure is very simple.

### ./md/

This is where most of your content will go. There are two required files: `index.md` and `template.html`.

`index.md` is a [Markdown](/markdown) file. It contains the content of your home page.

`template.html` defines the look of your site. URLs that match the name of a Markdown file (like `/index`) cause the server to render the Markdown file with a matching name and swap it into the template.

Parts of the template that are meant to be replaced are delimited by curly braces. You'll notice `{TITLE}` and `{CONTENT}` tags within. Assuming the server works correctly, the user will never see these.

#### ./static/

If you're at all familiar with web programming, you'll know that most web pages are not monolithic structures. They reference external assets, Javascript, CSS, and other links. 

The default **unmon** template is written to be entirely autonomous. It does not rely on external CDNs to provide fonts or backgrounds (though it can easily be made to do so).

All of its local assets are kept in `./static/`.

#### ./static/nav.json

`nav.json` contains the data used to populate your site's sidebar. At present, it contains a single key: "nav", which corresponds to an array of the pages to be listed. When your page loads, this file is fetched, and the sidebar is filled. This assumes your users have Javascript enabled.

#### ./static/css/

Unsurprisingly, this is where your `CSS` is kept. CSS defines how your website looks. I've included my CSS: `ansuz.css`, which is based on [pure](http://purecss.io) with lots of the guts torn out.

#### ./static/js/

This is where your Javascript is kept. There are three important files here:

##### ki.custom.js

This contains parts of [ki.js](https://github.com/dciccale/ki.js) and [ki.extend.js](https://github.com/james2doyle/ki.extend.js/), which provide some jQuery-like functionality without adding too much bulk.

##### marked.js

Taken from [my favourite Markdown parser](https://github.com/chjj/marked). This library is used to render pages clientside **and** serverside.

##### hapax.js

This replaces the basic Javascript that came with [the PureCSS template I built from](http://purecss.io/layouts/side-menu/). That's not all, though. It also replaces regular link behaviour (for local links) with an ajax function which caches and renders content without triggering a page reload. This behaviour is the main reason why these pages are so fast: most of the assets are only loaded once.

### ./lib/

This is where plugins are stored, so far the only plugin is `blag.js`, which parses URLs and responds by serving Markdown in the appropriate file format.

### ./log/

This is where your logs go, assuming you have logging enabled.

## Plugins

**unmon**'s code base was originally written to use [expressjs](http://expressjs.com/). As such, plugins are written in a similar format to those in Express, a design pattern known as [Message-Oriented Middleware](http://en.wikipedia.org/wiki/Message-oriented_middleware). 

Here is a sample plugin, it logs the requested URL to the console, then calls the next function in the stack.

```
/* Logger */
route(/.*/,function(req,res,next){
  console.log(req.url);
  next(req,res);
});
```

So far there are a few plugins you can use with unmon. Plugins for expressjs may be compatible, but I haven't really tested any. You can find them in `./lib/`:

* blag.js : parses urls and serves markdown in a number of formats.
* cache.js : enables caching for certain filetypes.
* cors.js : enables Cross Origin Resource Sharing
* fc.js : checks for cjdns ipv6s.
* logger.js : logs client requests to a text file.
* marked.js : courtesy of [chjj](https://github.com/chjj), a markdown parser. Used for serverside **and** clientside md rendering.
* nope.js : 404 handling
* parcel.js : for sending single files.

## Customizing your blag

I've tried to make **unmon** as unassuming as possible. You'll probably want to fancy up your blag a bit. 

To start, there are a bunch of common files that webservers usually keep in their root directory. If you're using the default **unmon** setup, you can just put these files in `unmon/static/`, and as long as they don't conflict with a Markdown URL, they'll be easily accessible.

Here are some examples:

1. [A favicon](http://en.wikipedia.org/wiki/Favicon). The web has many sources for [free favicons](http://www.freefavicon.com/). You can even grab another site's favicon by simple browing to their-url.tld/favicon.ico.
2. [robots.txt](http://www.robotstxt.org/) informs web crawlers how you'd prefer they treated your webserver.
3. [nodeinfo.json](http://h.docs.meshwith.me/en/cjdns/nodeinfo.json.html) is an emerging standard on Hyperboria which informs Hyperborian web crawlers of information specifically related to Hyperborian web services.
4. Add an [RSS feed](http://en.wikipedia.org/wiki/RSS) using [unmon's rss generator](https://github.com/ansuz/unmon/tree/master/scripts).

You can always change the look of your blag by editing `unmon/md/template.html`, or `unmon/static/css/`. Of course, you can change the clientside Javascript as well. If you do, please blag about it, and consider packing it up in such a way that others can mimic your changes. 

I won't be offended if you fork unmon. If your changes are significant enough to warrant it, please do. Otherwise, if you haven't changed any of the core behaviour in a breaking way, submit a pull request and it might get merged into the default blag format. Just keep in mind that unmon is meant to be **really really small**. Avoid dependencies wherever possible.

You'll probably want to just package up your template.html and static directory, and provide some examples of how to install your theme.

Beyond that, you can always write new plugins for your server. If you intend to keep pulling from the github repo, I'd recommend that you make a copy of whatever file you mean to edit, and edit the copy. Otherwise, subsequent `pull`s will conflict with your changes.

## FAQ

See [unmon-faq](unmon-faq).
