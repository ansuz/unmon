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
module.exports=function(opt){
    opt=opt||{};
    opt.def=opt.def||'/index.html';
    opt.debug=opt.debug||false;
    // opt.path is required

    var BIN='otf ttf woff ico gif png jpeg jpg pdf exe ogv mp4 webm'.split(' ');

    var DICT={
        otf:'application/x-font-otf'
        ,html:'text/html'
        ,htm:'text/html'
        ,ttf:'application/x-font-ttf'
        ,woff:'application/x-font-woff'
        ,svg:'image/svg+xml'
        ,css:'text/css'
        ,json:'application/json'
        ,js:'text/javascript;charset=UTF-8'
        ,ico:'image/x-icon'
        ,gif:'image/gif'
        ,png:'image/png'
        ,jpeg:'image/jpeg'
        ,jpg:'image/jpeg'
        ,pdf:'application/pdf'
        ,exe:'application/x-msdownload'
        ,ogv:'video/ogg'
        ,mp4:'video/mp4'
        ,webm:'video/webm'
    };

    // override the dictionary with your own headers, if you want
    if(opt.dict){
        Object.keys(opt.dict)
            .map(function(k){
                DICT[k]=opt.dict[k];
            });
    }
     
    // backwards compatibility
    var statpath=opt.path;    
    var def=opt.def;

    return function(req,res,next){
        var path=statpath+decodeURIComponent(req.url);
//        console.log(JSON.stringify({            url:req.url            ,path:path        }));
        var bin;

        var response=function(path){
            var ext;
            path.replace(/\.[^.]*$/,function(e){
                ext=e.slice(1);
            });
            var type;
            console.log("extension: "+ext)

            type=DICT[ext]||'text/plain;charset=UTF-8';
            bin=BIN.indexOf(ext);

            fs.readFile(path,(!bin)?"utf8":null,function(err,data){
 //             console.log(path);
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
