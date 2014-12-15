// max-age=28800 // 8 hours
// max-age=3600  // one hour
// Cache-Control: private // never cache or share

// "max-age=290304000, public" //480 weeks
// private // public
//  Expires: Thu, 01 Dec 1994 16:00:00 GMT
// Server: CERN/3.0 libwww/2.17

module.exports=function(req,res,next){
  // cache files whose names begin with 'static'
  if(req.url.match(/\/static[^\/]+$/)){
    res.setHeader("Cache-Control","max-age=604800,public");
  }else{
    var ext;
    req.url.replace(/\.[a-z]+$/,function(e){
      ext=e;
      return e;
    });
    if(ext){
      switch(ext){
        // fonts are good for a loooong time
        case '.ttf':
          // 480 weeks is a little over 9 years
          res.setHeader("Cache-Control","max-age=290304000,public");
          break;
        // if it's a picture
        case '.jpeg':
        case '.jpg':
        case '.png':
        case '.ico':
          // cache it for the next week
          res.setHeader("Cache-Control","max-age=604800,public");
          break;
        default:
          break;
      }
    }
  }
  next(req,res);
};
