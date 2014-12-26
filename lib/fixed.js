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
    var bin;

    var response=function(path){
      var ext;
      path.replace(/\.[^.]*$/,function(e){
        ext=e;
      });
      var type;
      console.log("extension: "+ext)
      switch (ext){
        case '.ttf':
          type='application/x-font-ttf';
          bin=true;
          break;
        case '.woff':
          type='application/x-font-woff';
          bin=true;
          break;
        case '.svg':
          type='image/svg+xml';
          break;
        case '.css':
          type='text/css';
          break;
        case '.json':
          type='application/json';
          break;
        case '.js':
          type='text/javascript';
          break;
        case '.ico':
          bin=true;
          type='image/x-icon';
          break;
        case '.gif':
          bin=true;
          type='image/gif';
          break;
        case '.png':
          bin=true;
          type='image/png'
          break;
        case '.jpeg':
        case '.jpg':
          bin=true;
          type='image/jpeg';
          break;
        case '.pdf':
          bin=true;
          type='application/pdf';
          break;
        case '.html':
          type='text/html';
          break;
        default:
          type='text/plain;charset=utf8';
          break;
      }
      fs.readFile(path,(!bin)?"utf8":null,function(err,data){
 //       console.log(path);
        if(err)
          console.log(err)||
          next(req,res);
        else{
          res.statusCode=200;
          res.setHeader("Content-Type",type);
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
