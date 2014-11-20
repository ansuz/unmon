/*  This plugin provides a function which serves the a directory full of markdown
    It serves it in a variety of formats, based on the request url
    Just pass the absolute path to the directory you wish to serve,
    it will return a typical handler function for expressjs...
      function(request,response,nextMiddleware)...
    
    You may optionally provide a second argument (the page title)

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
        you must have enabled the CORS module */

var fs = require("fs");
var md = require("marked");
var morf=require("ansuz").morf;
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
  // the default title is 'unmon', a shameless plug.
  title=title||"unmon";

  // return a function which will parse urls and serve markdown accordingly
  return function(req,res,next){
    // store the parsed url
    var purl=mdserve.parseURL(req.url);

    // create the absolute path to the target file.
    var target=dir+purl.file+'.md';

    fs.exists(target,function(e){ // check if the file exists
      if(e){ // it exists, load the file and serve appropriately
        fs.readFile(target,'utf8',function(err,markdown){ // load the file
          if(err)console.log(err)&&next(); // problem? say so, then 404
          // this is the part where we decide what to do based on extension
          switch(purl.ext){
            case ".json": // it's json
              fs.stat(target,function(err,stats){ // grab some file metadata
                if(err)console.log(err);
                res.send({ // send them some JSON
                  txt:markdown // yay closures, send the file contents
                  ,title:req.url.slice(1) // send the file title
                  // stats from the file system
                  ,mtime:stats&&stats.mtime||"" // last modified time
                  ,ctime:stats&&stats.ctime||"" // created time?
                  ,atime:stats&&stats.atime||"" // access time
                });
              });
              break;

            case ".md": // they want the pure markdown
              res.writeHead(200,{"Content-Type":"text/plain"}); // serve as text
              res.end(markdown); // the exact file contents, nothing fancy
              break;

            case ".html": // they want formatted html
              res.end(md(markdown)); // render and send the markdown
              break;

            default:
              try{ // you should have created a template.html file
                fs.readFile(dir+'template.html','utf8',function(err,str){
                  if(err)console.log("no template found"); // make one!
                  // I included a sample in unmon/md/ ...
                  res.send(morf.swap(str,{
                    "{TITLE}":title+"::"+purl.file,
                    "{CONTENT}":md(markdown)
                  }));
                });
              }catch(err){ // there was a problem..
                console.log(err);
                next();
              }
          }
        });
      }else{ // the file doesn't exist, carry on
        next();
      }
    });
  };
};

module.exports = mdserve.spawnHandler; // provide spawnHandler
