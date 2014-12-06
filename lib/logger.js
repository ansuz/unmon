var fs=require("fs");

module.exports=function(opt){
  opt=opt||{};
  opt.path=opt.path||process.env.PWD+"/log/";
  opt.logname=opt.logname||new Date().getTime()+".txt";
  var lstream = fs.createWriteStream(opt.path+opt.logname,{flags:'a'});

  return function(req,res,next){
    console.log(req.url);
    var l={};
    l.date=new Date().toISOString()
      ,l.url=req.url
      ,headers=req.headers
      ,method=req.method;
    if(req.headers['x-forwarded-for'])
      l.xfwd=req.headers['x-forwarded-for'];
    l.address=req.connection.remoteAddress;
    lstream.write(JSON.stringify(l)+"\n");
    next(req,res);
  };
};
