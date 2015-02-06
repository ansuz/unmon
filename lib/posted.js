module.exports=function(opt){
  opt=opt||{};
  opt.exportAs=opt.exportAs||'postdata';
  opt.methods=opt.methods||['POST'];

  return function(req,res,next){
    if(opt.methods.indexOf(req.method)===-1)
      return next();
    req[opt.exportAs]={};
    req.on('data', function(data) {
      decodeURIComponent(data.toString())
        .split('&')
        .map(function(dat){
          var d=dat.split('=');
          req[opt.exportAs][d[0]]=d[1];
        });
      next();
    });
  };
};
