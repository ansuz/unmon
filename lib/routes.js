//var van=require("../ansuzjs/lib/gen.js");
//var gen=require("../ansuzjs/lib/gen.js");

var routes={};

routes.top=function(req,res,next){
  console.log({
    ip:req.connection.remoteAddress
    ,url:req.url
    ,time:new Date().getTime()
  });
  next();
};

routes.CORS=function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");// check that this is right..
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
};

routes.bottom=function(req,res,next){
  res.send("pewpew");
};

module.exports=routes;
