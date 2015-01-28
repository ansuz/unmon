var fs=require("fs");
var md=require("../../lib/marked.js");

module.exports=function(opt){
  if(!(opt&&opt.template&&opt.md))
    console.log("Invalid options")||process.exit();

  var template=fs.readFileSync(opt.template,"utf8");
  var markdown=fs.readFileSync(opt.md,"utf8");

  opt.pattern=new RegExp(opt.pattern||"{\\w+}","g");
  opt.open=opt.open||"{";
  opt.close=opt.close||"}";

  var swap=function(s,o){
    return s.replace(opt.pattern,function(k){
      return o[k]||k;
    });
  };

  var tokens={};
  ["TITLE","CONTENT","MTIME"]
    .map(function(tok){
      tokens[tok]=opt.open+tok+opt.close;
    });

  var comp={};
  comp[tokens.TITLE]=opt.md.replace(".md","");
  comp[tokens.CONTENT]=md(markdown);
  comp[tokens.MTIME]=(function(d){
    return d.getTime()+" ("+d.toISOString()+")";
  })(new Date());
  return swap(template,comp);
};
