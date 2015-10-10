var marked=require("marked");

module.exports=function(opt){
    opt=opt||{};
    var pattern=/<\?md[\s\S]+?md\?>/g;

    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            res.body=res.body.replace(pattern,function(block){
                return marked(block.slice(4,-4));
            });
            next();
        }else{
            next();
        }
    };
};
