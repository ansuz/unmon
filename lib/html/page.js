var fs=require("fs");
var page={};

page.load=function(path){
  return fs.readFileSync(path,"utf8");
};

page.uncomment=function(html){
  return html.replace(/<!\-\-.*?\-\->/g," ");
};

page.components=function(html){
  var tags=[];
  var outerTags=function(outer){
    var num=0;
    var local=outer
    .replace(/<.*?>/g,
      function(tag){
        tags.push(tag);
        num++;
        return " ";
      })
    .replace(/\s+/g," ");// trim extraneous whitespace
    if(num>0){
      return outerTags(local);
    }else{
      return local;
    }
  };
  var remainder=outerTags(html);
  return {
    source:html
    ,rem:remainder
    ,tags:tags
  };
};

page.findParts=function(tag){
  var result={};
  var parts=["class","id","href","src","rel"
    ,"name","content","charset","lang","type"
    ,"alt","width","height","border","style","http-equiv"
    ,"title","prefix","property","target","data-.*?"
    ].map(function(part){
      // escape for regex
      return part.replace(/\-/g,"-");
    });
  var processor=parts
    .map(function(attr){
      return function(t){
        var temp=t
          .replace(new RegExp(attr+'\\s*=\\s*["\\\'].*?["\\\']'),function(s){
            result[attr]=s.slice(attr.length+2,-1);
            return " ";
          });
        return temp;
      };
    })
    .reduce(function(x,y){
      return function(z){
        return x(y(z));
      };
    });
  var temp=processor(tag)
    .replace(/^(<|<\/)\s*/,"")
    .replace(/\s*\/{0,1}>/,"").split(/\s+/);
  result.tag=temp[0];
  if(temp.length>1)
    result.extra=temp.slice(1);
  return result;
};

page.parseTags=function(tags){
  return tags.map(page.findParts);
};

page.usedSelectors=function(tags){
  var sels={};
  tags.map(function(t){
    sels[t.tag.replace(/^\//,"")]=true;
  });
  return sels;
};

module.exports=page;
