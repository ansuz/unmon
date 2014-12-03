var http=require("http");
var fs=require("fs");
var blag=require("./lib/blag.js")({
  path:process.env.PWD+"/md/"
  ,title:""
});

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

/* Static route */
var Static=function(statpath){
  return function(req,res,next){
    var path=statpath+req.url;
    fs.exists(path,function(e){
      if(e){
        fs.readFile(path,"utf8",function(err,data){
          if(err){
            console.log(err);
            next(req,res);
          }else{
            if(path.match(/\.json$/))
              res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
            res.end(data);
            res.end();
          }
        });
      }else{
        next(req,res);
      }
    });
  };
}(process.env.PWD+"/static");

/* Enable CORS */
route(/.*/,function(req,res,next){
//  console.log("Enabling CORS");
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET");
  res.setHeader("Access-Control-Allow-Headers","X-Requested-With");
  next(req,res);
});

/* Logger */
route(/.*/,function(req,res,next){
  console.log(req.url);
  next(req,res);
});

/* teh blag */
route(/.*/,blag);

/* Route static files */
route(/.*/,Static);

/* 404 Route */
route(/.*/,function(req,res){
  res.write("<p>404");
  res.end();
});

var router=routes
  .reduceRight(function(b,a,i,z){
    return function(req,res){
      a(req,res,b);
    };
  });

var server=http.createServer(router);

server.listen(8083);
