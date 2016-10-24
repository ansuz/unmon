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
    opt.def=opt.def||'index.html';
    opt.debug=opt.debug||false;
    var error=opt.error||console.error;

    /* if no type can be inferred, say that it's utf-8 html */
    var defaultType=(typeof opt.defaultType === 'undefined'? 'text/html;charset=utf-8':opt.defaultType);
    // opt.path is required

    var BIN='otf ttf woff ico gif png jpeg jpg pdf exe ogv mp4 webm'.split(' ');

    var DICT={
        otf:'application/font-sfnt',
        html:'text/html',
        htm:'text/html',
        ttf:'application/x-font-ttf',
        woff:'application/x-font-woff',
        svg:'image/svg+xml',
        css:'text/css',
        json:'application/json',
        js:'text/javascript;charset=UTF-8',
        ico:'image/x-icon',
        gif:'image/gif',
        png:'image/png',
        jpeg:'image/jpeg',
        jpg:'image/jpeg',
        pdf:'application/pdf',
        exe:'application/x-msdownload',
        ogv:'video/ogg',
        mp4:'video/mp4',
        webm:'video/webm',
        xml:'application/rss+xml',
        txt:'text/plain;charset=UTF-8',
        text:'text/plain;charset=UTF-8',
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

    return function (req, res, next) {
        var path = statpath + decodeURIComponent(req.url);
        var bin;

        var response = function (path) {
            var ext;
            path.replace(/\.[^.]*$/, function (e) {
                ext = e.slice(1);
            });
            var type;

            type = DICT[ext]; //||'text/plain;charset=UTF-8';
            bin = BIN.indexOf(ext);

            fs.readFile(path, (!bin) ? "utf8" :null, function (err,data) {
                if(err) error(err), next();
                else
                    res.statusCode=200,
                    res.setHeader("Content-Type", type || defaultType),
                    // TODO don't buffer then send, pipe
                    res.end(data);
            });
        };

        fs.stat(path,function(err,stats){
            if(err) return error(err),next();

            // is it a directory?
            if(stats.isDirectory()){
                response(path+def);
            }else if (stats.isFile()){
                response(path);
            }else{
                next()
            }
        });
    };
};
