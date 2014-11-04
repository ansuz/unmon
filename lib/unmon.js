var analytics=require("./plug/analytics.js");

var express=require("express");
var app=express();

var Default = function(req,res){
  res.send("no routes loaded");
};

app.launch=function(opts){
  opts=opts||{};
  app.get("*",analytics); // analytics
  app.get("*",opts.main||Default); // 404 response
  app.get("*",function(req,res,next){
    res.send("404 bro");
  });
  app.listen(
    opts.port||10000
    ,opts.address||""
    ,function(){
      console.log(opts.alert||"ohai!");
    }
  );
  return app;
}

module.exports=app;
