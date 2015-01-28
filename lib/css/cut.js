var mo=require("./mo.js");

var input=mo.toJSON("ansuz.css");

// filter out input and grid rules

Object.keys(input.main)
  .map(function(key){
    if(key.match(/pure-u|input\[/)){
//      console.log("removing %s",key);
      delete input.main[key];
    }
  });

input.queries
  .map(function(query,index){
    Object.keys(query.rules)
      .map(function(sel){
        if(sel.match(/pure-group|pure-form/)){
//          console.log("removing %s",sel);
          delete input.queries[index].rules[sel];
        }
      });
  });

console.log(mo.toCSS(input));
