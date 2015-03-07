var fs=require("fs");

module.exports=function(opt){
  // parse opt
  opt=opt||{};
  opt.ignore=opt.ignore||[];
  opt.hideDots=opt.hideDots||true;
  opt.path=opt.path||global.__dirname+'/static';
  opt.error=opt.logError||console.log;

  var filters=[];
  
  // build a crappy regexp
  if(opt.hideDots){
    filters.push('^\\.');
  }
  opt.ignore.forEach(function(i){
    filters.push(i+'$');
  });

  var fileFilter=new RegExp('('+filters.join('|')+')','i');

  return function(req,res,next){
    // parse the requested url and convert to a path
    var relPath=req.url.split('/')
      .slice(1)
      .filter(function(dir){
        return ! (/^\.{1,2}$/.test(dir));
      })
      .join('/');
    var path=opt.path+relPath;
//    var httpPath='';

/*
    console.log(JSON.stringify({
      filePath:path
      ,httpPath:httpPath
      ,relativePath:relPath
    },undefined,2));  */

    fs.stat(path,function(err,stats){
      if(err){
        opt.error('directiveError_1: '+err);
        next();
      }
      // check if the path is a valid directory
      if(stats.isDirectory()){
          // if so, index it
            // but filter out unwanted filetypes by extension
        fs.readdir(path,function(err,files){
          if(err){
            opt.error('directiveError_2: '+err);
            next();
          }
          var list=files.filter(function(file){
            // remove files that you mean to hide.
            return ! (fileFilter.test(file));
          }); 
          res.setHeader('Content-Type','text/html');
          res.statusCode=200;

          res.end('<ul>'+['..'].concat(list)
            .map(function(i){
              return '<li><a href="/'+relPath+'/'+i+'">'+i+'</a></li>';
            }).join("\n")+"</ul>");
        });
      }else{
        next();
      }
    });
  };
};
