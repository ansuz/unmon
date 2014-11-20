module.exports=function(req,res,next,debug){
  if(debug){
    console.log("%s %s",req.connection.remoteAddress,req.url);
    console.log(req.body);
  }
  next();
};
