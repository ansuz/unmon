module.exports=function(opt){
    opt=opt||{};
    var error=opt.error||console.error;
    var pattern=/<\?js[\s\S]*js\?>/g,
        idPattern=/\{js\d+?\}/g;
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            // common variables
            var JS={},
                results={},
                total=0,
                count,
                whenDone=function(){
                    if(--count === 0 && !res.api.async){
                        res.api.finish();
                    }
                };
            res.api=res.api||{};
            res.api.finish=function(){
                res.body=res.body.replace(idPattern,function(id){
                    return results[id];
                });
                next();
            };

            res.body=res.body.replace(pattern,function(block){
                var id='{js'+(total++)+'}';
                JS[id]=block.slice(4,-4);
                return id;
            });

            count=total;

            for(var block in JS){
                (function(){
                    var id=block,
                        echo=function(value){
                            results[id]=(results[id]||'')+value;
                        };
                    try{
                        eval(JS[id]);
                    }catch(err){
                        error(err);
                    }
                    whenDone();
                }());
            }

        }else{
            next();
        }        
    };
};
