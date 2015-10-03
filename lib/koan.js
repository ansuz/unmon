var ansuz=require("ansuz");
var marked=require("./marked");
var fs=require("fs");

module.exports=function(opt){
    opt=opt||{};
    opt.home=opt.home||"index";

    opt.path=opt.path||(process.env.PWD+"/koan");
    opt.debug=opt.debug||true;
    opt.template=opt.template||'template';
    opt.wait=opt.wait||false;
    opt.error=opt.error||console.log;
    opt.verbose=opt.verbose||false;

    var parseURL=function(url){
        var parts={
            url:url
        };
        parts.root=url
            .replace(/\?.*$/,function(frag){
                parts.fragment=frag;
                return '';
            })
            .replace(/\/[^\/]*$/,function(file){
                parts.file=file.slice(1)||opt.home;
                return "/";
            });
        if(opt.verbose&&opt.debug)opt.error(JSON.stringify(parts,undefined,1));
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
            Koan.meta={
                
            }; 
            Koan.meta['{CONTENT}']=(function(text){
                /*
                        parse a section of text
                        filter out bits contained in '---' blocks
                        extract the data, return the text
                */
                return text.replace(/\-{3}(.|\s)*?\-{3}/m,function(head){
                    var head=head.replace(/\-{3}/,'')
                        .split("\n")
                        .map(function(x){
                            if(/:/.test(x)){
                                var key,val;
                                val=x.replace(/.*?:/,function(k){
                                    key=k.slice(0,-1);
                                    return '';
                                });
                                Koan.meta['{'+key.trim()+'}']=val.trim();
                            }
                            return '';
                        });
                    return '';
                });
            }(Koan.file));

            var content=ansuz.swap(Koan.template,Koan.meta,/\{\-{0,2}\s*[\w\s]+\s*\-{0,2}\}/g);

/* evaluate scripts */

                (function(){
                    // deprecate php object
                    var php=Koan;
                    Koan.wait=opt.wait;
                    Koan.count=0;
                    Koan.body='';
                    Koan.response={};
                    Koan.opt=opt;
                    Koan.end=function(){
                        Koan.body=ansuz.swap(Koan.body,Koan.response);
                        res.end(Koan.body.replace(/<\?md(.|\s)*?md\?>/mg,function(x){
                            return marked(x.slice(4,-5));
                            })
                            .replace(/\{\-{2}([.\s\S]*?)\-{2}\}/g,'') // koan comments
                        );
                    };

                    Koan.body+=content.replace(/<\?js(.|\s)*?js\?>/mg,
                        function(x){
                            var id='{PHPJS'+(Koan.count++)+'}';
                            Koan.response[id]='';
                            var echo=function(x){
                                Koan.response[id]+=x;
                                if(opt.verbose&&opt.debug)opt.error('VERBOSE: '+x);
                                return x;
                            };
                            try{
                                eval(x.slice(4,-5));
                            }catch(err){
                                if(opt.debug)
                                    opt.error('EVAL ERR: '+err);
                            }
                            return id;
                        });
                    if(!Koan.wait){
                        Koan.end();
                    }
                })();
            };

            var doStuff=function(path,target,recurse){
                var root=Koan.url.root;

                var getIt=function(){
                    fs.readFile(opt.path+root+path,'utf-8',function(err,str){
                        if(err){
                            if(opt.debug)
                                opt.error(err);
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
