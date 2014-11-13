var app=require("./lib/unmon.js");

app.launch({
  port:10000
  ,address:""
  ,alert:"listening on port 10000"
  ,main:function(req,res,next){
    res.send("pewpew");
  }
});
