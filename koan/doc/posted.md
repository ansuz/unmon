## posted

`posted.js` parses post data, such as you might expect from a form.

It optionally takes an object, with attributes for configuration.

* exportAs
  + used to determine what variable will be used to store the uploaded information
* methods
  + an array containing HTTP methods (case-sensitive)

### Initialization

Without arguments:

```Javascript
/* Process post requests and export them as req.postdata */
route(/.*/,require("./lib/posted.js")());
```

With arguments

```Javascript
/* Process post requests and export them as req.postdata */
route(/.*/,require("./lib/posted.js")({
  // if you want to allow more upload methods
  methods:['POST','GET','PUT']
  // this lets you access the data via req.aDifferentKey
  ,exportAs:'aDifferentKey'
}));
```

The ability to specify different methods and keys means you can have multiple such routes with different discriminators, and process them independently.
