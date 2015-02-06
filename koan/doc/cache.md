
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
