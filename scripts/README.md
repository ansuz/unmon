# Scripts

## RSS

`rss.js` is a simple script which reads from a JSON file, and prints an rss feed to the console. An example RSS feed is available in this folder (`rss.json`).

It must contain all the keys shown in the example below. Items with empty title attributes will be ignored, so you can keep them around and copy-paste them instead of writing them out new each time.

```JSON
{"items":[
   {"title":"","link":"","description":""}
  ,{"title":"","link":"","description":""}
  }
 ,"TITLE":""
 ,"LINK":""
 ,"DESCRIPTION":""
 ,"LANGUAGE":""
}
```

To use it, just call it from the command line, and redirect its output to your rss feed, like so:

```Bash
rss.js > ../path/to/feed.xml
```
