var routes=require("./routes.js");

var express=require("express");
var app=express();

app.launch=function(opts){
  opts=opts||{};
  app.get("*",routes.top); // analytics
  app.get("*",opts.main||routes.bottom); // 404 response

  app.listen(
    opts.port||10000
    ,opts.address||""
    ,function(){
      console.log(opts.alert||"ohai!");
    }
  );
}

module.exports=app;
