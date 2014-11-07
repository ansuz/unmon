# unmon

```text
Said Ummon to his disciples,
  "However wonderful a thing is,
   it may be that it is better
   not to have it at all."
```

unmon is the small javascript server that powers my web sites.

## The philosophy behind unmon

Launching a webserver shouldn't be a grand affair. In fact, it should be so simple that you can just do it directly from the node REPL.

## How can I get started?

### Install it

```bash
git clone https://github.com/ansuz/unmon.git
cd unmon
git submodule init
npm install
```

### Launch it

```bash
node app.js
```

That should do it! This server isn't much use, though.

To enhance its behaviour, you can try interacting directly directly from the REPL.

> $ node  
> var app=require("./lib/unmon.js");  
> app.launch({  
... address:"fcbf:8145:9f55:202:908f:bcce:c01e:caf2"  
... ,main:function(req,res){  
..... res.send("hey buddy");  
..... }});  
> undefined  
> ohai!  



As shown above, you can just `require` the library, then pass it an object for configuration.

So far it accepts a JSON object with the following properties:

* port
* address
* alert
* main

All of these are optional.

unmon is built on top of expressjs, so for an idea of what kinds of functions you can pass, just look at its documentation.

## Plugin Architecture

Unmon features a flexible plugin architecture which you can use in one of several ways.
