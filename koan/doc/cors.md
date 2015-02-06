## cors

`cors.js` is a passive plugin for unmon. It is meant to be placed at the top of your stack, above any routes that are meant to be accessible from the browser on another domain.

It needs no configuration, but optionally accepts an object with the following attributes:

* methods
  + an array of HTTP methods for which you would like to permit Cross Origin Resource Sharing
  + defaults to ['GET']
* origin
  + the origins for which you would like to enable CORS
  + defaults to '*'
* headers
  + defaults to 'X-Requested-With'

### Adding cors.js to your unmon instance

It works without any parameters, if you're okay with the default setup.

```Javascript
/* Enable CORS headers for api access */
  route(/.*/,require("./lib/cors.js")());
```

Otherwise, pass it an object:

```Javascript
route(/.*/,require("./lib/cors.js")({
  // allow remote users to post and put
  methods:['GET','POST','PUT']
  // but only if they're navigating from example.io
  ,origin:'https://example.io'
});
```

If you only want certain urls to support cors, specify that in your regex:

```Javascript
/* only if the url contains CORS (case insensitive) */
route(/.*CORS.*/i,require("./lib/cors.js")());
```
