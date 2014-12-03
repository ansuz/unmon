var fs = require("fs");
var md = require("./marked");
var mdserve={};

var swap=function(s,o,r){
  return s.replace(/{\w+}/g, function(k) {
    return o[k]||k;
  });
};

mdserve.parseURL=function(url){
  var parts={
    url:url,
    ext:""
  };
  parts.root=url.replace(/\.(json|html|md)$/,function(str){
    parts.ext=str;
    return "";
  }).replace(/[^\/]*$/,function(str){
    parts.file=str;
    return "";
  });
  parts.file=parts.file||"index";
  return parts;
}

/*  spawnHandler accepts the absolute path to a directory containing:
    markdown files (.md), at least one of which is named 'index.md'
    a template file (template.html) which should contain the tokens:
      {TITLE} and {CONTENT}
    which will be swapped for the function's second argument (title)
      and the contents of the file that users browse to (if it exists) 
 */

mdserve.spawnHandler=function(opt){
//  opt=opt||{};

  /*  opt requires several attributes
        a default path
        a default title
  */

  // return a function which will parse urls and serve markdown accordingly
  return function(req,res,next){
    // store the parsed url
    var purl=mdserve.parseURL(req.url);

    // create the absolute path to the target file.
    var target=opt.path+purl.file+'.md';

    fs.exists(target,function(e){ // check if the file exists
      if(e){ // it exists, load the file and serve appropriately
        fs.readFile(target,'utf8',function(err,markdown){ // load the file
          if(err){
            console.log(err);
            next(req,res);
          } // problem? say so, then 404
          // this is the part where we decide what to do based on extension
          switch(purl.ext){
            case ".json": // it's json
              fs.stat(target,function(err,stats){ // grab some file metadata
                if(err)console.log(err);
                res.writeHead(200,{"Content-Type":"application/javascript"});
                res.end(JSON.stringify({ // send them some JSON
                  txt:markdown // yay closures, send the file contents
                  ,title:req.url.slice(1) // send the file title
                  // stats from the file system
                  ,mtime:stats&&stats.mtime||"" // last modified time
                  ,ctime:stats&&stats.ctime||"" // created time?
                  ,atime:stats&&stats.atime||"" // access time
                }));
              });
              break;

            case ".md": // they want the pure markdown
              res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"}); // serve as text
              res.end(markdown); // the exact file contents, nothing fancy
              break;

            case ".html": // they want formatted html
              res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
              res.end(md(markdown)); // render and send the markdown
              break;

            default:
              try{ // you should have created a template.html file
                fs.readFile(opt.path+'template.html','utf8',function(err,str){
                  if(err)console.log("no template found"); // make one!
                  // I included a sample in unmon/md/ ...
                  res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                  res.end(swap(str,{
                    "{TITLE}":opt.title+purl.file,
                    "{CONTENT}":md(markdown)
                  }));
                });
              }catch(err){ // there was a problem..
                console.log(err);
                next(req,res);
              }
          }
        });
      }else{ // the file doesn't exist, carry on
        next(req,res);
      }
    });
  };
};

module.exports = mdserve.spawnHandler; // provide spawnHandler
