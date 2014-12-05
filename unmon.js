var http=require("http");
var fs=require("fs");

var caching=require("./lib/cache.js");

var cors=require("./lib/cors.js");

var fixed=require("./lib/fixed.js")(process.env.PWD+"/static");

var blag=require("./lib/blag.js")({
  path:process.env.PWD+"/md/"
  ,title:" "
  ,home:"index"
  ,debug:false
  ,pattern:'{\\w+}'
});

var nope=require("./lib/nope.js");

var f404=require("./lib/parcel.js")(process.env.PWD+"/static/html/404.html");

/* Support Functions */
var routes=[];

var route=function(patt,f){
  routes.push(function(req,res,next){
    if(req.url.match(patt)){
      f(req,res,next);
    }else{
      next(req,res);
    }
  });
};

/* Check filetype and cache */
route(/.*/,caching);

/* Enable CORS */
route(/.*/,cors);

/* Logger */
route(/.*/,function(req,res,next){
  console.log(req.url);
  next(req,res);
});

/* Route static files */
route(/.*/,fixed);

/* teh blag */
route(/.*/,blag);

route(/.*/,f404);

/* 404 Route */
route(/.*/,nope);

var router=routes
  .reduceRight(function(b,a,i,z){
    return function(req,res){
      a(req,res,b);
    };
  });

var port=8083;
var addresses=[""]; // the array of addresses on which to listen

var servers=addresses.map(function(addy){
  var server=http.createServer(router);
  server.listen(port,addy,function(){
    console.log("unmon is running on %s:%s",addy,port);
  });
  return server;
});
