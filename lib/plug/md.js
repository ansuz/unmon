/*  This plugin contains the bulk of my site's functionality
    I generate content quickly and easily using markdown (github flavoured)
    and this module provides the mdserve for the app that serves it.

    It requires:
      the path to a directory containing markdown
      a default filename to serve as the directory's 'index'
      the 'route' which will direct users to this module */

/*  What does it do?

    The portion of the URL after the given route is parsed
    The appropriate response is inferred from the remaining URL stub

    The url stub is split into a file name, and an extension..
    if <filename>.md does not exist in the target directory, this route fails
    'next()' is called, and the server moves on.
    if the file does exist, then the extension is used to infer how it should be formatted

    stubs lacking a filetype extension result in the default action:
      the markdown is converted into HTML on the server
      the resulting HTML is morf.swapped into a template
      the template is also formatted such that the appropriate tags are also inserted
        This includes: a title, relevant assets (scripts, css, w/e)

    stubs with the .json extension are served as JSON objects
      the Object will also contain statistics about the file (ctime, atime, mtime)
      the content is served as unrendered markdown
      this extension should only be used if you have a clientside markdown renderer
      thusly it is appropriate for single page apps

    stubs with the .md extension are served as unformatted markdown
      this is the easiest extension ;)

    stubs with the html extension are served as formatted HTML, but not morf.swapped into a template
      if you intend for other people to be able to use this as an API
        you must have enabled the CORS module

*/

var fs = require("fs");
var md = require("marked");
var morf=require("../../ansuzjs/lib/morf.js");
var mdserve={};

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

mdserve.spawnHandler=function(dir,title){
  // return a function which will parse urls and serve markdown accordingly
  return function(req,res,next){
    // parse the url
    var purl=mdserve.parseURL(req.url);
    // check if the file exists within the target directory
    var target=dir+purl.file+'.md';
    fs.exists(target,function(e){
      if(e){
        // it exists, load the file and serve appropriately
        fs.readFile(target,'utf8',function(err,markdown){
          if(err)console.log(err)&&next();
          switch(purl.ext){

            case ".json":
              fs.stat(target,function(err,stats){
                if(err)console.log(err);
                res.send({
                  txt:markdown
                  ,title:req.url.slice(1)
                  ,mtime:stats&&stats.mtime||""
                  ,ctime:stats&&stats.ctime||""
                  ,atime:stats&&stats.atime||""
                });
              });
              break;

            case ".md":
              res.writeHead(200,{"Content-Type":"text/plain"});        
              res.end(markdown);
              break;

            case ".html":
              res.end(md(markdown));
              break;

            default:
              try{
                fs.readFile(dir+'template.html','utf8',function(err,str){
                  if(err)console.log("no template found");
                  res.send(morf.swap(str,{"{TITLE}":title+"::"+purl.file,"{CONTENT}":md(markdown)}));
                });
              }catch(err){
                console.log(err);
                next();
              }
          }
        });
      }else{
        next();
      }
    });
  };
};

module.exports = mdserve;
