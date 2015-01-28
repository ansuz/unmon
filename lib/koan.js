var koan={};

var ansuz=require("ansuz");
var marked=require("marked");
var fs=require("fs");

koan.main=function(opt){
  opt=opt||{};
  opt.home=opt.home||"index";

  opt.path=opt.path||(process.env.PWD+"/koan");
  opt.debug=opt.debug||false;
  opt.template=opt.template||'template';
  opt.wait=opt.wait||false;
  var parseURL=function(url){
    var parts={
      url:url
    };
    parts.root=url.replace(/\/[^\/]*$/,function(file){
      parts.file=file.slice(1)||opt.home;
      return "/";
    });
    if(opt.debug)console.log(JSON.stringify(parts,undefined,1));
    return parts;
  };

  return function(req,res,next){
    // look in opt.path+Koan.url.root for your template
      // if does not exist, look back a directory or next(req,res)
    // look in opt.path+Koan.url.root for Koan.url.file
      // if does not exist, next(req,res)

    var Koan={};
    Koan.url=parseURL(req.url);

    (function(){
      var race=2;
      var ifDone=function(){
        // once you've found both, swap the file into the template
        // then replace <?js js?> tags
        // then replace <?md md?> tags
        // then send it
        var content=ansuz.swap(Koan.template,{
          '{CONTENT}':Koan.file
        });

/* evaluate scripts */

        (function(){
          var php={
            wait:opt.wait
            ,count:0
            ,body:''
            ,response:{}
            ,end:function(){
              php.body=ansuz.swap(php.body,php.response);
              res.end(php.body.replace(/<\?md(.|\s)*?md\?>/mg,function(x){
                return marked(x.slice(4,-5));
              }));
            }
          };
          php.body+=content.replace(/<\?js(.|\s)*?js\?>/mg,
            function(x){
              var id='{PHPJS'+(php.count++)+'}';
              php.response[id]='';
              var echo=function(x){
                php.response[id]+=x;
                if(opt.debug)console.log(x);
                return x;
              };
              try{
                eval(x.slice(4,-5));
              }catch(err){
                console.log('ERR: '+err);
              }
              return id;
            });
          if(!php.wait){
            php.end();
          }
        })();
      };

      var doStuff=function(path,target,recurse){
        var root=Koan.url.root;

        var getIt=function(){
          fs.readFile(opt.path+root+path,'utf-8',function(err,str){
            if(err){
              console.log(err);
              return next(req,res);
            }else{
              Koan[target]=str;
              race--;
              if(race===0){
                ifDone();
              }
            }
          });
        };

        var checkIt=function(){
          fs.exists(opt.path+root+path,function(e){
            // if the file does not exist
            if(!e){
              // if you're looking for the template
              // and you're not at the base path yet...
              if(recurse&&(root!=='/')){
                // look back a directory
                root=root.replace(/\/[^\/]*\/$/,'/')
                return checkIt(); // check again
              }else{
                // if you still don't find a template..
                return next(req,res);
              }
            }else{
              getIt();
            }
          });
        };
        checkIt();
      };
      doStuff('template','template','true');
      doStuff(Koan.url.file,'file');
    })();
  };
};

module.exports=koan.main;
