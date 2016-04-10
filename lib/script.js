module.exports=function(opt){
    opt=opt||{};
    var error=opt.error||console.error;
    var pattern=/<\?js([\s\S]*?)js\?>/g,
        idPattern=/\{js\d+?\}/g;
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            // common variables
            var _JS={},
                _RESULTS={},
                _TOTAL=0,
                _COUNT,
                _DONE=function(){ --_COUNT === 0 && res.api.finish(); };
            res.api=res.api||{};
            res.api.finish=function(){
                res.body=res.body.replace(idPattern,function(id){
                    return _RESULTS[id];
                });
                next();
            };
            res.api.wait=function(n){
                _COUNT+=(typeof n==='number'?Math.floor(n):1);
                return _DONE;
            };

            res.body=res.body.replace(pattern,function(all, block){
                var id='{js'+(_TOTAL++)+'}';
                _JS[id]=block;
                return id;
            });

            _COUNT=_TOTAL;

            for(var _BLOCK in _JS){
                (function(){
                    var _ID=_BLOCK,
                        echo=function(value){
                            _RESULTS[_ID]=(_RESULTS[_ID]||'')+value;
                        };
                    try{
                        eval(_JS[_ID]);
                    }catch(err){
                        error(err);
                    }
                    _DONE();
                }());
            }
        }else{
            next();
        }
    };
};
