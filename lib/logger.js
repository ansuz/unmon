var fs=require("fs");

module.exports=function(opt){
    opt=opt||{};
    opt.path=opt.path||process.env.PWD+"/log/";
    opt.logname=opt.logname||opt.name||new Date().getTime()+".txt";
    var lstream = fs.createWriteStream(opt.path+opt.logname,{flags:'a'});

    return function(req,res,next){
        typeof opt.each == 'function' && opt.each(req);
        var l={
            url:req.url,
            referer:req.headers.referer,
            date:new Date().toISOString(),
            'user-agent': req.headers["user-agent"],
            from:req.headers.from,
            host:req.headers.host,
            method:req.method,
            address:req.connection.remoteAddress,
        };
        if(req.headers['x-forwarded-for'])
            l.xfwd=req.headers['x-forwarded-for'];
        lstream.write(JSON.stringify(l)+"\n");
        next();
    };
};
