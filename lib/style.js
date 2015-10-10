var fs=require("fs");
/*
    less is an optional dependency that you'll need to install
    if you want to use this middleware
        `npm install less`
*/
var less=require("less");

module.exports=function(opt){

    /*
        this plugin replaces blocks like 
            <?less pre{ code{ font-family:monospace; } } less?>
        with rendered less

        if there are multiple blocks of less, the rendered less will be hoisted
        into the position of the first less block.

        You probably don't want to use this in production
        because of the overhead involved in compiling less all the time

        but it's nice for when you're constantly hacking on a page
    */

    opt=opt||{};
    var debug=opt.debug||false;
    var error=opt.error||console.error;
    var pattern=/<\?less[\s\S]+less\?>/g;
    
    return function(req,res,next){
        if(res.body && pattern.test(res.body)){
            var hoist="",
                count=0;
            res.body=res.body.replace(pattern,function(block){
                hoist+=block.slice(6,-6);
                return (count++ == 0)?'{less}':'';
            });
            less.render(hoist,{compress:true},function(e,out){
                if(e){
                    error(e);
                }else{
                    res.body=res.body.replace(/\{less\}/,out.css);
                }                
                next();
            });
        }else{
            next();
        }
    };
};
