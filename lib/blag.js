var fs = require("fs");
var md = require("./marked");

/*  blag.js returns a function which:

  accepts an object which can be used for configuration
    title:
      the default title of a templated page
    home:
      the name of the markdown file it should use as a home page
      defaults to 'index' (do not pass the .md extension)
    pattern:
      a string to be used to construct a regular expression
      used to swap content into your template
      "{\\w+}" // note that you'll have to escape special characters
    path:
      an absolute path to your markdown directory
    template:
      the name of the file to be used as your template
      defaults to 'template.html'
      it should contain the tokens:
        TITLE
        CONTENT
        which will be matched by 'pattern':
          ie. {TITLE},{CONTENT}
 */

module.exports=function(opt){
  opt=opt||{};
  opt.title=opt.title||"unmon";
  opt.home=opt.home||"index";
  opt.pattern=new RegExp(opt.pattern||"{\\w+}","g");
  opt.path=opt.path||(process.env.PWD+"/md/");
  opt.debug=opt.debug||false;
  opt.template=opt.template||'template.html';

  var swap=function(s,o,r){
    return s.replace(opt.pattern, function(k) {
      return o[k]||k;
    });
  };

  var parseURL=function(url){
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
    parts.file=parts.file||opt.home;
    if(opt.debug)console.log(parts);
    return parts;
  };

  // return a function which will parse urls and serve markdown accordingly
  return function(req,res,next){
    // store the parsed url
    var purl=parseURL(req.url);

    // create the absolute path to the target file.
    var target=opt.path+purl.file+'.md';
    console.log(target);

    fs.exists(target,function(e){ // check if the file exists
      if(e){ // it exists, load the file and serve appropriately
        fs.readFile(target,'utf8',function(err,markdown){ // load the file
          if(err){
            console.log(err);
            next(req,res);
          } // problem? say so, then 404
          // this is the part where we decide what to do based on extension

          fs.stat(target,function(err,stats){ // get file metadata
            if(err)console.log(err);
            var atime=stats&&stats.atime
              ,ctime=stats&&stats.ctime
              ,mtime=stats&&stats.mtime;

            switch(purl.ext){
              case ".json": // it's json
                  res.writeHead(200,{"Content-Type":"application/javascript"});
                  res.end(JSON.stringify({ // send them some JSON
                    txt:markdown // yay closures, send the file contents
                    ,title:req.url.slice(1) // send the file title
                    // stats from the file system
                    ,mtime:mtime||"" // last modified time
                    ,ctime:ctime||"" // created time?
                    ,atime:atime||"" // access time
                  }));
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
                  fs.readFile(opt.path+opt.template,'utf8',function(err,str){
                    if(err)console.log("no template found"); // make one!
                    // I included a sample in unmon/md/ ...
                    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    res.end(swap(str,{
                      "{TITLE}":opt.title+purl.file
                      ,"{CONTENT}":md(markdown)
                      ,"{CTIME}":ctime
                      ,"{ATIME}":atime
                      ,"{MTIME}":mtime
                    }));
                  });
                }catch(err){ // there was a problem..
                  console.log(err);
                  next(req,res);
                }
            }
        });
      });
    }else{ // the file doesn't exist, carry on
        next(req,res);
      }
    });
  };
};
