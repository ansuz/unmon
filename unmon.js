var http=require("http");
var unmon={};

/* Your default stack */
var routes=unmon.routes=[];

/* route produces new routes, and pushes them to a stack */
var route=unmon.route=function(patt,f,opts){
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
      next();
    }
  });
};

/*  makeRouter accepts a stack of routes and collapses it into a single function
    which is compatible with the NodeJS http api
    of the form function(request,response)  */
var makeRouter=unmon.makeRouter=function(stack){
  return stack.reduceRight(function(b,a,i,z){
    return function(req,res){
      a(req,res,b);
    };
  });
};

/* If being run as a standalone server, load routes and launch a server */

if(require.main === module){
  console.log("Running unmon as standalone script");

  /* instantiate error logging behaviour
    this catches ALL uncaught exceptions
    which is possibly a security risk if your server SHOULD crash */
  global.logError=require("./lib/error.js")();

  /* This is where you add your routes */

  /* infer appropriate caching behaviour from requested urls */
  route(/.*/,require("./lib/cache")());

  /* Enable CORS headers for api access */
  route(/.*/,require("./lib/cors.js")());

  /* Log all requests to file */
  route(/.*/,require("./lib/logger.js")({path:process.env.PWD+'/log/'}));

  /* Process post requests and export them as req.postdata */
  route(/.*/,require("./lib/posted.js")());

  /* Templating and serverside scripting */
  route(/.*/,require("./lib/koan.js")({
    error:logError
  }));

  /* find and serve static files */
  route(/.*/,require("./lib/fixed")(process.env.PWD+"/static","index.html"));

  /* load the blag plugin for serving templated markdown files */
  route(/.*/,require("./lib/blag.js")({path:process.env.PWD+"/md/",title:" "}));

  /* 404 as a last resort */
  route(/.*/,require("./lib/parcel.js")(process.env.PWD+"/static/html/404.html"));

  // produce a new router
  var router=makeRouter(routes)

  // make the port known globally for other scripts
  global.thisServersPort=8083;

  // bind to all ipv4 addresses by default
  var addresses=[''];

  // check if you have a unique local ipv6 address
  (function(){
    global.thisServersIPV6=require("./lib/fc.js")();
    if(thisServersIPV6)
      addresses.push(thisServersIPV6[0]);
  })();

  // instantiate and launch a server for each address in addresses
  var servers=addresses.map(function(addy){
    var server=http.createServer(router);
    server.listen(thisServersPort,addy,function(){
      console.log("unmon is running on %s:%s",addy,thisServersPort);
    });
    return server;
  });

}else{
  /*  If this module is being loaded as a library by another file
      just export the router functions */
  console.log("Exporting unmon as a library.");
  module.exports=unmon;
}
