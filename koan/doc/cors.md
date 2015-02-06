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
