var http=require("http");
var vis={};

vis.scrape=function(f,opt){
  f=f||function(res){
    res.on("data",function(chunk){
      console.log(""+chunk);
    });
  };

  opt=opt||{};
  opt.host=opt.host||"google.ca";
  opt.port=opt.port||80;
  opt.path=opt.path||"/index.html";

  http.get(options,callback)
    .on('error',function(e){
      console.log("Got error: "+e.message);
    });
};
