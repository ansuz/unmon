var fs=require("fs");

var log;

var allLogs=fs.readdirSync(".")
  .filter(function(filename){
    return filename.match(/\.txt$/);
  }).map(function(filename){
    return fs.readFileSync(filename,"utf8").split("\n");
  }).reduce(function(A,B){
    return A.concat(B);
  }).filter(function(line){
    return line;
  });

var unique={};

['referer','xfwd','url','user-agent','address'].map(function(k){
  unique[k]={};
});

var countUnique=function(val,obj){
  var t=obj[val];
  if(t)
    unique[val][t]=(unique[val][t]||0)+1;
};

var parsed=allLogs.map(function(line){
  return JSON.parse(line);
}).map(function(obj){
  Object.keys(unique)
    .map(function(key){
      countUnique(key,obj);
    });
});

console.log(unique);
