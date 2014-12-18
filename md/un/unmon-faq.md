## Is it any good?

[yes!](https://news.ycombinator.com/item?id=3067434)

## Do I need to relaunch unmon to update its sidebar?

No, you do not. `static/nav.json` is not cached by the server. It's sent as is each time it's requested.

## Can I include nested sections in my sidebar navigation?

I've kept **unmon**'s front and back end as distinct as possible, but the code I've provided has only been tested with the default HTML. 

## Can I nest folders in my markdown directory?

~~Not yet, **unmon** only searches a flat directory. This is under development.~~

Yes! Each folder can have its own **template.html**, and should probably have its own **index.md** as well. If it makes your life easier, you can always just use **symlinks** to point to a common template as well.

If a folder does not have a template, the template in the default directory will be used.

## Can unmon listen on multiple addresses?

Yes! Just but you'll have to make multiple servers using the same router.

```Javascript
var port=8083;
var addresses=["","fc00:0000:0000:0000:0000:0000:0000:0000"];

var servers=addresses.map(function(addy){
  var server=http.createServer(router);
  server.listen(port,addy,function(){
    console.log("unmon is running on %s:%s",addy,port);
  });
  return server;
});
```

## Can I style my website differently than your crappy template?

Of course, assuming you know how. The default server is really just meant to be an example. You can add in or take out plugins fairly easily, and the template itself is just that. The back end doesn't know or care about it.

The **blag** plugin serves Markdown as json, which is rendered by the template, but you could certainly choose not to use that, and rely entirely on serverside rendering if you wanted to.

## Is there an admin interface I can use?

Not as of yet. I'm planning to implement one as a plugin (or a set of plugins), since a few people have expressed interest. It **will not** be included in the core, though, as it will likely be fairly large by **unmon** standards.

## Can I federate unmon instances?

That depends entirely on how they are configured. There is a [CORS](https://github.com/ansuz/unmon/blob/master/lib/cors.js) (Cross Origin Resource Sharing) plugin. 

Assuming everything works correctly, other servers should be able to serve up html/js which will make ajax calls against your **blag** plugin's json files. I haven't really tested this too much, though.

Even if a server **doesn't** have CORS enabled, if it's using **blag**, you should be able to just use **wget** to grab a page's Markdown source file and save it into your **md** directory.

## Can I see any other examples of unmon in the wild?

Yes, there are a few:

1. [Minatour's blag](http://luz.transitiontech.ca/index)
2. [cSmith's blag](http://h.cynical.us/index)
3. [willeponk's blag](http://hype.willeponken.me/home)

## What do I need to know to write a plugin?

Ultimately that depends on what you expect it to do, but you can find more info about how unmon manages plugins [here](init).
