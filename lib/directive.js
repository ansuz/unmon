var fs=require("fs");

module.exports=function(opt){
    // parse opt
    opt=opt||{};
    opt.ignore=opt.ignore||[];
    opt.hideDots=opt.hideDots||true;
    opt.path=opt.path||global.__dirname+'/static';
    opt.error=opt.logError|| opt.error ||console.error;

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
        relPath=relPath.replace(/\/\//g,'/');
        var path=opt.path+relPath;

        fs.stat(path,function(err,stats){
            if(err){
                opt.error('directiveError_1: '+err);
                next();
                return;
            }

            // check if the path is a valid directory
            if(stats.isDirectory()){
                    // if so, index it
                        // but filter out unwanted filetypes by extension
                fs.readdir(path,function(err,files){
                    if(err){
                        opt.error('directiveError_2: '+err);
                        next();
                        return;
                    }
                    var list=files.filter(function(file){
                        // remove files that you mean to hide.
                        return ! (fileFilter.test(file));
                    }); 
                    res.setHeader('Content-Type','text/html');
                    res.statusCode=200;

                    var count=0;
                    var keys=['..'];
                    var results={'..':'..'};

                    var done=function(){
                        count-=1;
                        if(count == 0){
                            res.end('<ul>'+
                            (keys.map(function(k){
                                return '<li><a href="'+results[k]+'">'+k+'</a></li>';
                            }).join(''))+'</ul>');;
                        }
                    };

                    list.forEach(function(l){
                        count+=1;
                        var p='/'+([relPath,l].join('/').replace(/\/\/+/g,'/'));
                        keys.push(l);
                        fs.stat(path+'/'+l,function(err,stats){
                            if(err){
                                console.log(err);
                                done();
                            }else{
                                if(stats.isDirectory()){
                                    results[l]=p+'/';
                                }else{
                                    results[l]=p;
                                }
                                done();
                            }
                        });
                    });
                });
            }else{
                next();
            }
        });
    };
};
