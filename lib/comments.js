module.exports=function(opt){
    opt=opt||{};
    var debug=opt.debug||false;
    var pattern=/\{\-\-[\s\S]+?\-\-\}/g;
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            res.body=res.body.replace(pattern,function(comment){
                if(debug)
                    console.log(comment);
                return '';   
            });
        }
        next();
    };
};
