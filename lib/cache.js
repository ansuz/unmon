// max-age=28800 // 8 hours
// max-age=3600    // one hour
// Cache-Control: private // never cache or share

// "max-age=290304000, public" //480 weeks
// private // public
//    Expires: Thu, 01 Dec 1994 16:00:00 GMT
// Server: CERN/3.0 libwww/2.17

module.exports=function(opt){
    opt=opt||{};

    // default caching time for declared extensions
    opt.def=opt.def||604800;

    // you can pass an array of extensions
    // they will be initialized to use the default caching time
    opt.std=opt.std||'jpg jpeg png ico'.split(' ');

    // for any more definitions, you can use an object
    // in which the keys correspond to extensions    
    opt.dict=opt.dict||{
        ttf:290304000
        ,otf:290304000
    };

    // you also have the option of caching files implicitly based on their url
    // this uses a regex
    opt.implicit=opt.implicit|| /\/static[^\/]+$/;
    opt.implicitDuration=opt.implicitDuration||604800;

    // the final set of cache time definitions
    var DICT={};

    // define cache duration for all types considered standard
    // use the default cache duration
    opt.std
        .map(function(ext){
            DICT[ext]=opt.def;
        });

    // merge in the types from the dictionary
    Object.keys(opt.dict)
        .map(function(ext){
            DICT[ext]=opt.dict[ext];
        });

    return function(req,res,next){
        // cache files whose names begin with 'static'
        if(opt.implicit.test(req.url)){
            res.setHeader("Cache-Control","max-age="+opt.implicitDuration+",public");
        }else{
            var ext;
            req.url.replace(/\.[a-z]+$/,function(e){
                ext=e.slice(1);
                return e;
            });
            if(ext){
                res.setHeader("Cache-Control","max-age="+(DICT[ext]||0)+",public");
            }
        }
        next();
    };
};
