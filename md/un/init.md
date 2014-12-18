## What is unmon?

I've called it different things depending on the context. Most generally, it's a minimalist webserver framework. I use it for my blog, but if I remove the [blag plugin](https://github.com/ansuz/unmon/blob/master/lib/blag.js) it becomes something different.

The main idea is that **everything is a plugin**. As such, you can **unplug** all of its constituents. Of course, this would leave you with a program that accomplished absolutely nothing.

## Why is it notable?

The **unmon** _"framework"_ basically fits in one file: **unmon.js**. As such, it's more of an init script than anything. If you are familiar with other scriptable configuration and init systems, like **.bashrc**, then you should have an easy time understanding this model.

**unmon.js** is really just meant to be an example to get you started. It's a good idea to make a copy and edit it to suit your tastes.

## Decomposing unmon.js

**unmon** makes direct use of the Nodejs HTTP API. The basic idea is that you launch a server on some address/port combination, and when somebody makes a request using that address/port, the HTTP API calls a function.

The API only allows you to pass a single function to each server. If you want your server to respond to requests in a complicated way, you have to bundle up several functions into one function. That function must then be able to determine which of its different responses are appropriate based on the headers it receives with the request.

**unmon.js** contains an example of one way you could accomplish this task, but doesn't enforce it in any way. Feel free to change it, but if you do, please share the results!

## The anatomy of a connection

Whenever a client connects to your server, the HTTP reacts by calling the function you passed with two arguments:

1. A request object
2. A response object

The **request object** contains all of the data sent by the client, including its connection information and its headers. You'll want to familiarize yourself with the headers typically included in an HTTP request, but you'll probably be most concerned with the request URL.

**unmon.js** uses the request URL to determine how it should respond to the request, by comparing it against an ordered sequence of **routes**. We'll come back to that, though.

The **response object** contains methods that you can use to configure the content and metadata which you will return to the client that made the request. You can use it to set the response headers, append to the value which will be returned to the client, or send the response and close the connection.

## The anatomy of a plugin

A plugin mirrors the structure of a connection, but also takes into account the possibility that it isn't necessarily the only function used to craft the server's response.

As such, each plugin is a function which takes three arguments, a request object, a response object, and a callback: **next**. Since you already know about the other two arguments, I'll focus on what the callback is responsible for:

Suppose one decides to go shopping, and while in a retail shop, they have some question or complaint which the floor-level employee is unable to address. When such a situation arises, it's common for either the customer or the employee to seek out the assistance of their manager. The callback (**next**) is responsible for implementing this kind of behaviour within your server. When a particular function encounters an error it cannot handle, it calls the **next** function for help.

In situations where the manager themself is unable to help the customer, it may escalate further, to the manager's manager, and so on. How far it goes depends on the structure of the company, of course, and this is also true of your server.

You could have just a single function, or you could have a long chain of them. Each particular function is also called a **route**, since it is responsible for determining how the request navigates through the **statespace** of the server's possible responses.

An employee need not only pass on control of the situation in a heirarchical way, or in the case of an error. Many functions only serve one purpose, and then pass on the results of their work to a **co-worker**. We can conceive of this as being equivalent to the employment structure in a box-office store like Wal-Mart™. 

1. You enter the door, and there is a greeter. 
2. On the floor, there are various sales-associates. 
3. There is a cashier, which finalizes your transaction and prepares you to exit the store. 
4. At the doors, you encounter the greeter once more, and they ensure that your transaction was handled, and redirect you to the cashier or security if you try to leave without paying.

In this model, no one function is responsible for your entire experience. Parts can be swapped out. Your experience can vary, depending on your needs. As long as the format of your control flow is well thought out, everything proceeds smoothly without requiring a complicated structure.

A plugin doesn't need to take this into account, as there may be no circumstances under which it will ever call **next()**. It may be that it is meant to be the function which catches all other plugins' errors, or it may be guaranteed to return a response no matter its input. In such situations you can omit the third argument from the function definition and body.

## Plugins I've included in the default unmon.js

So far I've just assumed that anyone looking to run this software became interested after using my website. With that in mind, I've tried to include a startup script that gets you almost an exact copy of it, to start.

That includes:

1. A caching plugin, which saves your server a little bit of load by telling clients to keep files which are likely to stay the same.
2. A logging plugin, because as much as I respect your privacy, it's helpful to look through logs and find out what exploits people are trying to use against my server.
3. A CORS plugin, which tells clients that they can include parts of my site in remote web pages via ajax calls.
4. A directory serving plugin, from which all my css, js, and assets are retrieved.
5. A markdown rendering and templating plugin, which makes it easy for me to produce content, and serve it in an attractive format.
6. A single fileserving plugin, for one off routes like a 404 page.

## Stitching plugins together

There are really just three significant functions involved in producing a working server. Depending on your intentions, you may not even need all of them.

### route

```Javascript
/* Support Functions */
var routes=[];

var route=function(patt,f){
  routes.push(function(req,res,next){
    if(req.url.match(patt)){
      f(req,res,next);
    }else{
      next(req,res);
    }
  });
};
```

**route** requires that there exist an array named **routes**. It takes two arguments, a pattern, and a function. The function should be a plugin which adheres to the structure defined above.

When you call `route`, it creates a new function which takes the same three arguments as your plugin should. When that function is called, it checks whether the request URL matches the passed pattern. If it does, the plugin function is executed with the passed arguments (request, response, next). If the pattern does not match, the **next** function is called with the first two arguments. Finally, the produced function is pushed to the array `routes`.

Assuming you've imported the plugin (in the usual node way: `var plugin=require("./plugin.js");`), you can then push it to the stack like so:

```Javascript
route(/^\/someURLRegExp/,plugin);
```

### Reduction

```Javascript
var router=routes
  .reduceRight(function(b,a,i,z){
    return function(req,res){
      a(req,res,b);
    };
  });
```

With those `routes` all prepared, we need to compose them into a single function which we can pass to our server. To do that, we use the array method `reduceRight` on `routes`. `reduceRight` is identical to another array method [reduce](/lambda#crunching-data-with-reduce-), with the exception that it applies the passed function to the array elements in reverse order.

We pass a higher order function to `reduceRight`, and it iterates over the function array, producing a new function at each step which has the previous function _baked in_ as a callback. The result is a single function which takes the required two arguments, and proceeds through a stack of routes at each call.

### Launching the server

```Javascript
var servers=addresses.map(function(addy){
  var server=http.createServer(router);
  server.listen(port,addy,function(){
    console.log("unmon is running on %s:%s",addy,port);
  });
  return server;
});
```

Lastly, we launch our server. I wanted to run a single **dual-stacked** server which responded to both clearnet and Hyperboria, so I produced an array of addresses, and used the array method `map` to process each array element and launch a server listening on that address.

I used a script to automatically find the addresses I would bind to, but you can always do it manually via `var addresses=["127.0.0.1","192.168.0.5"];`.

## What next?

Now that you know how unmon works, you should know enough to start looking in `unmon/lib`, where I've been keeping all of my plugins. The majority of them are only a few lines, and it shouldn't be hard to figure out what they're doing.

If you want to know more, you can always contact me directly, preferably on [irc](/contact). Tell me what you want unmon to do, and I'll either:

1. Show you that it already does that
2. Help you make it do that
