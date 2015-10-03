module.exports=function(opt){
    opt=opt||{};
    opt.methods=(opt.methods&&opt.methods.length?opt.methods:['GET']).join(',');
    opt.origin=opt.origin||'*';
    opt.headers=opt.headers||'X-Requested-With';

    return function(req,res,next){
        res.setHeader("Access-Control-Allow-Origin",opt.origin);
        res.setHeader("Access-Control-Allow-Methods",opt.methods);
        res.setHeader("Access-Control-Allow-Headers",opt.headers);
        next();
    };
};
