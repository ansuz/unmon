var http=require("http");

global.logError=require("./lib/error.js")();

/* Your default stack */
var routes=[];

/* route produces new routes, and pushes them to a stack */
var route=function(patt,f,opts){
  opts=opts||{}; // you don't have to provide options
  // make sure the discriminator is defined
  opts.disc=opts.disc||'url'; // your router parses by url by default
  opts.stack=opts.stack||routes; // you can provide an alternate stack

  // push your new route to the stack in question
  opts.stack.push(function(req,res,Next){
    // encapsulate Next so that we don't always have to pass req and res
    var next=function(){Next(req,res);};
    if(patt.test(req[opts.disc])){
      f(req,res,next);
    }else{
      next(req,res);
    }
  });
};

// now push some routes!

/* Cache static files */
route(/.*/,require("./lib/cache"));

/* Enable CORS */
route(/.*/,require("./lib/cors.js"));

/* Logger */
route(/.*/,require("./lib/logger.js")({path:process.env.PWD+'/log/'}));

/* Accept post requests */
route(/.*/,require("./lib/posted.js")());

/* koan */
route(/.*/,require("./lib/koan.js")({
  error:logError
}));

/* Route static files */
route(/.*/,require("./lib/fixed")(process.env.PWD+"/static","index.html"));

/* blag */
route(/.*/,require("./lib/blag.js")({path:process.env.PWD+"/md/",title:" "}));

/* last resort */
route(/.*/,require("./lib/parcel.js")(process.env.PWD+"/static/html/404.html"));

var makeRouter=function(stack){
  return stack.reduceRight(function(b,a,i,z){
    return function(req,res){
      a(req,res,b);
    };
  });
};

var router=makeRouter(routes)

global.thisServersPort=8083;
var addresses=[''];

(function(){
  global.thisServersIPV6=require("./lib/fc.js")();
  if(thisServersIPV6)
    addresses.push(thisServersIPV6[0]);
})();

var servers=addresses.map(function(addy){
  var server=http.createServer(router);
  server.listen(thisServersPort,addy,function(){
    console.log("unmon is running on %s:%s",addy,thisServersPort);
  });
  return server;
});
