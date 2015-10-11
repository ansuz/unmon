module.exports=function(opt){
    opt=opt||{};
    var error=opt.error||console.error;
    var debug=opt.debug||false;
    var pattern=/\{{2}[\s\S]+?\}{2}/g;
    
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            res.body=res.body.replace(pattern,function(block){
                try{
                    return eval(block);
                }catch(err){
                    error(err);
                    return debug?block:'';
                }
            });
            next();
        }else{
            next();
        }
    };
};
