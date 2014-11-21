var path="./lib/";

var here=process.env.PWD;
console.log(here);

var unmon=function(O){ 
  var app=require("express")();
  O=O||{};

  O.mdpath=O.mdpath||here+"/blag/md/";
  O.staticpath=O.staticpath||here+"/blag/static/";
  O.f404=function(req,res){res.end("404");};

  console.log(O.mdpath);
  console.log(O.staticpath);

  app.get("*",require(path+"cors.js"));
  app.get("*",require(path+"analytics.js"));

/* the old way of doing it */
//  app.get("*",require(path+"md.js")(O.mdpath));

/* The new way will be more flexible */
  app.get("*",require(path+"md.js")({path:O.mdpath}));
  require(path+"stationary.js")(app,{
    "/":O.staticpath  
  });
  app.get("*",O.f404);
  return app;
};

module.exports=unmon;
