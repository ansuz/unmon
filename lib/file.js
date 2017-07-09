var fs=require("fs");
module.exports=function(opt){
    opt=opt||{};
    var error=opt.error||console.error;
    var debug=opt.debug||false;
    var path=opt.path||'./';
    var pattern=/<\?fs[\s\S]*?fs\?>/g;
    
    /*
        this plugin assumes that another plugin has loaded a template
        and assigned its value to res.body
        
        if that's not the case, then it falls through to the next plugin
        if that is the case, it looks for sections that look like
            <?fs path/to/a/file path/to/any/number/of/fallback/files fs?>
        if a file fails, it falls through to the next

        once all files in the template have been loaded, such tags are replaced
        with their intended contents

        the plugin then falls through to the next middleware
    */

    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            var total=0,
                count=0,
                files={},
                results={},
                done=function(){
                    --count; // can make this a one-liner
                    if(count == 0){
                        // swap things back in!
                        res.body=res.body.replace(/\{file\d+?\}/g,function(id){
                            return results[id] || '';
                        });
                        next();
                    }
                };

                // parse out the files you should grab
                // replace them with {file?}
                res.body=res.body.replace(pattern,function(block){
                    //console.log("Replacing %s",block);
                    var id='{file'+(total++)+'}';
                    var targets=block.slice(4,-4)
                        .split(/\s+/)
                        .map(function(x){return x.trim();})
                        .filter(function(x){return x;});
                    files[id]=targets;
                    return id;
                });

                count=total;

                for(var file in files){
                    //console.log(file);
                    (function(){
                        var id=file,
                            howMany=files[file].length,
                            current=0,
                            again=function(){
                                var lookingFor=path+files[id][current];
                                fs.readFile(lookingFor,'utf-8',function(e,out){
                                    if(e){
                                        error(e);
                                        if(files[id][++current]){
                                            // there are fallback to try
                                            again();
                                        }else if(debug){
                                            // set the return value to the error message
                                            results[id]=e;
                                        }else{
                                            // return nothing
                                            results[id]='';
                                            done();
                                        }
                                    }else if(out){
                                        results[id]=out;
                                        done();
                                    }else{
                                        done();
                                    }
                                });
                            };
                        again();
                    }());
                }
        }else{
            next();
        }
    };
};
