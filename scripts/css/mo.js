var mo={};
var fs=require("fs");
var util=require("util");

/*  uncomment does exactly what we expect
    we don't need to use it directly, it's just for support */

mo.uncomment=function(css){
  return css.split("\n")
      /* Strip line comments */
    .map(function(line){
      return line.replace(/\/\/.*$/,"");
    })
    .filter(function(line){
      return !line.match(/^\s*$/);
    }).join(" ")
    .replace(/\s+/g," ")
    .replace(/\/\*([\s\S]*?)\*\//g,"");
};

/* readCSS takes a relative path and returns uncommented CSS */

mo.readCSS=function(path){
  return mo.uncomment(fs.readFileSync(path,"utf8"));
};

/* readJSON loads a JSON file and returns an object */

mo.readJSON=function(path){
  return JSON.parse(fs.readFileSync(fn,'utf8'));
};

/*  findMQ return an object containing your main css
    and an array of media queries */

mo.findMQ=function(css){
  var MQ=[];
  return {
    main:css.replace(/@media[^{]+\{([\s\S]+?})\s*}/g
    ,function(m){
      MQ.push(m);
      return "";
    })
    ,queries:MQ
  };
};

/* Return an array of strings
    Each string contains a selector-rule combo  */

mo.splitByRule=function(trimmed){
  var temp=[];
  trimmed.replace(/[^\{]*\{[^\}]*}/g,
    function(rule){
      temp.push(rule.replace(/^\s+/,""));
      return "";
    });
  return temp;
};

/* parseRule converts a rule string into an object
    with the selector as the key, and an object of rules */

mo.parseRule=function(rule){ 
  var O={
    rules:{}
  };
  var temp;
  var sel=rule.replace(/\{[^\}]+\}/
    ,function(attr){ 
      temp=attr.slice(1,-1);
      return "";
    }); 
  O.sel=sel
    .replace(/^\s*/,"")
    .replace(/\s*/,"");
  temp
    .split(";")
    .filter(function(rules){
      return rules.match(/:/);
    })
    .map(function(r){
      var key,val;
      r.replace(/\S+\:/,function(k){
        key=k.slice(0,-1);
        return "";
      }).replace(/[\s\S]+$/,function(v){
        val=v.replace(/^\s+/,"");
        return "";
      });
      O.rules[key]=val;
    });
  return O;
};

/* parseQuery turns the text of a media query into an object
    which contains the query expression
    and an object containing the selectors and rules */

mo.parseQuery=function(q){
  var expr;
  var Q={
    rules:{}
  };

  var body=q.replace(/^@[^\{]*/,function(e){
      Q.expr=e;
      return "";
    });

  mo.splitByRule(body.slice(1,-1))
    .map(mo.parseRule)
    .map(function(R){
      var sel=R.sel;
      if(!Q.rules[sel])
        Q.rules[sel]={};
      Object.keys(R.rules)
        .map(function(r){
          Q.rules[sel][r]=R.rules[r];
        });
    }); 
  return Q;
};

mo.not=function(key){ // just another battle
  return function(k){ // in the never ending war
    return !k.match(new RegExp(key)); // against boilerplate
  }; // lest we forget
};

mo.objectify=function(rules){
  var CSS={}; // the object we'll be populating
  rules.map(function(R){ // for every rule object 'R'
    var sel=R.sel;

    if(!CSS[sel]){ // if the CSS selector does not exit
      CSS[sel]={}; // instantiate it
    }

    Object.keys(R.rules).map(function(r){ // for every sub-rule
      CSS[sel][r]=R.rules[r];
    });

  }); // that's it!
  return CSS;
};

mo.toJSON=function(path){
  var css=mo.findMQ(mo.readCSS(path));
  // css is an object with two properties:
    // main and queries

  // this transforms main into an object
  // and remove redundant rules
  css.main=mo.objectify(
    mo.splitByRule(css.main)
      .map(mo.parseRule)
    );

  // this replaces replaces the raw text of each array element
  // with a nicely parsed object
  css.queries=css.queries
    .map(mo.parseQuery);

  return css;
};

/* Everything above is for parsing
    we need more functions to convert the JSON back into CSS */

mo.ruleToText=function(obj,sel){
  var rules=obj[sel];
  var res=[sel+" {"];
  Object.keys(rules).map(function(r){
    res.push("  "+r+":"+rules[r]+";");
  });
  res.push("}");
  return res.join("\n");
};

mo.queryToText=function(mq){
  var text="\n"+mq.expr+" {\n";

  text+=Object.keys(mq.rules)
    .map(function(r){
      return mo.ruleToText(mq.rules,r)
        .split("\n")
        .map(function(line){
          return "  "+line;
        })
        .join("\n");
    })
    .join("\n");
  return text+"\n}";
};

mo.print=function(json){
  console.log(util.inspect(json,false,null));
};

mo.toCSS=function(json){
  var text="";
  var main=json.main;
  var queries=json.queries;

  text+=Object.keys(main)
    .map(function(sel){
      return mo.ruleToText(main,sel)
    }).join("\n");

  text+=queries
    .map(mo.queryToText)
    .join("\n");
  
  return text;
};

module.exports=mo;
