module.exports=function(opt){
    opt=opt||{};
    var pattern=/\{\-\-[\s\S]*?\-\-\}/g;
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            res.body=res.body.replace(pattern,'');
        }else{
            next();
        }
    };
};
