## Generate Static HTML

All you need is:

1. Markdown
2. A template

## Using the script

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
