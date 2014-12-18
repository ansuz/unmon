# css

less and sass seem to do some useful stuff, but they require learning how to do it the sass or less way.

Rather than learn an entirely new language, I'd rather just write up some simple functions in js, and expose them as a library, like I would for any other task.

# How do I use it?

## Loading the library and target file

First import the library:

```Javascript
var mo=require("./mo.js");
```

Then load the css file you want to work with:

```Javascript
var input=mo.toJSON("style.css");
```

The resulting JSON object will have the following structure:

* main (an object)
  + selector => rules
    * attribute => value
* queries (an array of objects)
  + expr (the media-query expression)
  + rules (an object)
    * selector => rules
      + attributes => value

Here's an explicit example:

```JSON
{
  "main":{
    "body":{
      "background":"#444"
    }
    ,"a":{
      "color":"red"
    }
  }
  ,"queries":[
    {
      "rules":{
        "body":{
          "background":"#666"
        }
      }
      ,"expr":"@media (max-width:480px)"
    }
  ]
}
```

## Make your changes

Maybe you've decided you don't want to use any media queries for a particular site. It's easy to get rid of them!

```Javascript
input.queries=[];
```

## Output your new CSS

Write it directly to file:

```Javascript
require("fs").writeFileSync("newstyle.css",mo.toCSS(input));
```

...or just print it to the console:

```Javascript
console.log(mo.toCSS(input));
```

...and redirect the output to a file:

```Bash
node mo-use-case.js > newstyle.css
```
