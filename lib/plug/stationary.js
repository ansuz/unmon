/*  Stationary makes it easy to quickly serve a bunch of directories.
    It takes a single object, the keys for which should all be valid url stubs
    The value of each key should be an absolute path the intended directory.

    stationary takes your express app
    and an object which maps arbitrary urls to absolute paths
    which it indexes and serves.
    
    usage:

stationary(app,{
  "/static":"/home/ansuz/un/static"
  ,"/gifs":"/home/ansuz/Pictures/ridiculouslyHilariousGifs"
});

*/

var static=require("serve-static");
var index=require("serve-index");

module.exports=function(a,o){
  Object.keys(o).map(function(k){
    app.use(k,static(o[k]));
    app.use(k,index(o[k]));
  });
};
