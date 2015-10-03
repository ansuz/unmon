var fs=require("fs");

module.exports=function(opt){
    opt=opt||{};
    opt.path=opt.path||process.env.PWD+'/log/';
    opt.logname=opt.logname||'error.'+new Date().getTime()+'.txt';

    var errStream=fs.createWriteStream(opt.path+opt.logname,{flags:'a'});

    var logError=function(e){
        console.log('Error: '+e);
        var E={};
        E.time=new Date().toISOString();
        E.msg='ERR: '+e;
        errStream.write(JSON.stringify(E)+'\n');
    };

    process.on('uncaughtException',function(err){
        // this is a really dirty way to keep your server alive
        // but it's preferable to letting it die
        // in the future there will be a domain based solution
        logError(err);
    });
    return logError;
};
