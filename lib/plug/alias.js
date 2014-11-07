/*
Maps urls to files, useful if you want to quickly and safely
share only a few files...

usage:

require("./alias.js")({
  "/favicon.ico":"/path/to/favicon.ico"
  ,"/robots.txt":"/path/to/robots.txt"
  ,"nodeinfo.json":"/path/to/nodeinfo.json"
  ,"feed.xml":"/path/to/rss.xml" // an alias
  ,"rss.xml":"/path/to/rss.xml"
});

*/

module.exports=function(o){
  Object.keys(o).map(function(k){
    app.get(f,function(req,res,next){
      res.sendFile(o[k]);
    });
  });
};
