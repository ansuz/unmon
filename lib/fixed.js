var fs=require("fs");

/*
  check if exists
  check if is directory
    if is directory
      check if default filename exists
        if exists respond
        else next
    else is file
      respond
*/

/* Static route */
module.exports=function(statpath,def){
  def=def||"/index.html";
  return function(req,res,next){
    var path=statpath+req.url;
//    console.log(JSON.stringify({      url:req.url      ,path:path    }));

    var response=function(path){
      fs.readFile(path,"utf8",function(err,data){
        console.log(path);
        if(err)
          console.log(err)||
          next(req,res);
        else{
          if(path.match(/\.json$/)){
            res.statusCode=200;
            // this should really be somewhere else
            res.setHeader("Content-Type","text/plain;charset=utf-8");
          }
          res.end(data);
        }
      });
    };

    // check if there is something there
    fs.exists(path,function(e){
      if(e){ // there is! what is it?
        fs.stat(path,function(err,stats){
          if(err) // problem?
            console.log(err)||next(req,res);

          // is it a directory?
          if(stats.isDirectory()){
            fs.exists(path+def,function(e){
              if(e){ // it exists!
                response(path+def);
              }else{ // it does not
                next(req,res);
              }
            });
          }else if (stats.isFile()){
            response(path);  
          }else{
            next(req,res)
          }
        });
      }else
        next(req,res);
    });
  };
};
