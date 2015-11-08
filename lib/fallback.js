var fs=require("fs");
module.exports=function(opt){
    opt=opt||{};
    var segment=/\/[^\/]+?\/$/;
    var path=opt.path||'./dynamic';
    var target=opt.target||'template';
    // TODO prefix stuff here...

    var again=function(leading){
        return segment.test(leading)?leading.replace(segment,'/'):false;
    };

    var fetch=function(leading,req,res,next){
        fs.readFile(path+leading+target,'utf-8',function(e,out){
            if(e){
                var temp=again(leading);
//                console.log(leading,temp);
                if(temp){
                    return fetch(temp,req,res,next);
                }else{
                    return next();
                }
            }else{
                res.body=out;
                next();
            }
        });
    };

    return function(req,res,next){
        fetch(req.url.replace(/[^\/]*$/,''),req,res,next);
    };
};
