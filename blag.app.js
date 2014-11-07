var unmon=require("./lib/unmon.js");
var mds=require("./lib/plug/md.js");

unmon.launch({
  main:mds(process.env.PWD+"/md/","unmon")
});
