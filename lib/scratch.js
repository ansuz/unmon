var fs=require("fs");

module.exports=function(opt){
    opt=opt||{};
    path=opt.path||'./dynamic/index.js',
    error=opt.error||console.log;

    return function(req,res,next){
        fs.readFile(path,'utf-8',function(e,out){
            if(e)
                error(e),next();
            else
                try{
                    eval(out);
                }catch(err){
                    error(err),next();
                }
        });
    };
};
