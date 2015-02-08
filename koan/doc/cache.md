
## cache

`cache.js` is a passive plugin that sets response headers, telling the client to cache files for a duration which is inferred from its URL.

It optionally accepts a single variable, opt, which is an object consisting (optionally) of the following attributes:

* def
  + the default duration (in seconds) which will be assigned to the types defined in std
  + can be a number or a string
* std
  + an array of filetype extensions which you'd like to be cached for `def` seconds
* dict
  + an object, consisting of filetype extensions as keys, and cache durations (as strings or numbers) as values
  + these definitions, if included, will override those in `std`
* implicit
  + a regular expression against which the url will be tested
  + if it evaluates as true, the duration will be set to `implicitDuration`
* implicitDuration
  + a number, see above

### Adding caching functionality to your unmon instance

`cache.js` works without any launchtime parameters, if you're okay with the default setup:

```Javascript
/* infer appropriate caching behaviour from requested urls */
route(/.*/,require("./lib/cache")());
```

Otherwise, pass it an object containing the parameters which you would like to override the default behaviour:


```Javascript
/* infer appropriate caching behaviour from requested urls */
route(/.*/,require("./lib/cache")({
  def:0 // The default behaviour for the following types will be zero seconds
  ,std:"html js css md".split(' ') // split turns this string into an array
  // URLs ending with .html, .js, .css, and .md will not be cached at all
  // this is appropriate if you intend to make frequent changes to your content
  ,dict:{ // for filetypes which require explicit caching directives
    svg:420 // cache SVG files for 420 seconds
    ,png:247 // cache pngs for 247 seconds
  }
  ,implicit:/^\/STATIC/ // implicitly cache any file in a subdirectory of '/STATIC/'
  ,implicitDuration:1000000 // cache such files for 1 million seconds
}));
```
