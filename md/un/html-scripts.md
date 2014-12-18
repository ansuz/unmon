# HTML


## Generating Static Pages

All you need is:

1. Markdown
2. A template

### Using the script

```Javascript
node static.js path/to/markdown.md path/to/template.html
```

Thusly, calling `node static.js example.md template.html` produces the following output:

```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>example</title>
  </head>
  <body>
  <h1 id="this-is-an-example">This is an example</h1>
<p>pew</p>
<p>pew</p>
<p>pew</p>

  
  <!--1418579642357 (2014-12-14T17:54:02.357Z)-->
  </body>
</html>
```

## Analyzing HTML

Ummon Zenji said: 

"Men of immeasurable greatness are tossed about in the ebb and flow of words."

It isn't enough to have an efficient server. If you want your pages to load quickly, they ought to be small. I wrote **page.js** to analyze static HTML and kill page bloat.

It's fairly simple to use:

```Javascript
var page=require("./page")

var html=page.components( // split html into its components
  page.uncomment( // trim comments
    page.load("index.html") // load files
));

// html is an object with three attributes

// the text source of the page
console.log(html.source)

// all the tags that could be extracted (an array)
console.log(html.tags)

// the remainder of the page (everything that isn't a tag)
console.log(html.rem)
```

You can then parse your tags, and filter them based on which attributes they contain:

```Javascript
var parsed=page.parseTags(html.tags);

// parsed is an array of objects
// review its output to see what tags it parsed
console.log(parsed);

// Try filtering the array for particular types of tags

// find all the links in the page (not to be confused with anchors)
var links=parsed
  .filter(function(t){
    return t.tag==="link";
  });

// find all the anchors in the page
var anchors=parsed
  .filter(function(t){
    return t.tag==="a";
  });

// find all the selectors that were used
var used=(function(){
  var usedSels={};
  parsed.map(function(t){
    usedSels[t.tag.replace(/^\//,"")]=true;
  });
  return Object.keys(usedSels);
})();

// list all tags that have a class or id attribute
var classOrId=parsed
  .filter(function(t){
    return t.class||t.id;
  });
```
