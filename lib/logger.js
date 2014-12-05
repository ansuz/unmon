var fs=require("fs");

module.exports=function(opt){
  opt=opt||{};
  opt.path=opt.path||process.env.PWD+"/log/";
  opt.logname=opt.logname||new Date().getTime()+".txt";
  var lstream = fs.createWriteStream(opt.path+opt.logname,{flags:'a'});
  

  return function(req,res,next){
    console.log(req.url);
    lstream.write(JSON.stringify({
      url:req.url
      ,headers:req.headers
      ,method:req.method
    })+"\n");
    next(req,res);
  };
}
