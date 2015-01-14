module.exports=function(f){
  return function(req,res,next){
    if(req.method!=='POST')
      return next(req,res);
    req.postdata={};
    req.on('data', function(data) {
      data.toString()
        .split('&')
        .map(function(dat){
          var d=dat.split('=');
          req.postdata[decodeURIComponent(d[0])]=decodeURIComponent(d[1]);
        });
      next(req,res);
    });
  };
};
