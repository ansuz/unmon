var http=require("http");
var proxy=require("http-proxy").createProxyServer({});

module.exports=function(opt,common){
  return http.createServer(function(req,res){
    common(req,res);
    var host=req.headers.host;
    proxy.web(req,res,{target:opt[host]||opt.default});
  });
};
