var fs=require("fs");

var top=function(){/*<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel >
    <!-- Dynamic Content -->
    <title><!--TITLE--></title>
    <link><!--LINK--></link>
    <description><!--DESCRIPTION--></description>
    <language><!--LANGUAGE--></language>

    <!-- Static Content  -->
    <generator>part of the unmon.js framework</generator>
    <category><!--CATEGORY--></category>

<!--CONTENT-->
  </channel>
</rss>
*/}.toString().slice(14,-3); // lolhax

var item=function(){/*
  <item>
    <title><!--TITLE--></title>
    <link><!--LINK--></link>
    <description><!--DESCRIPTION--></description>
  </item>
*/}.toString().slice(14,-3);

var plate=function(s,o){
  return s.replace(/<!--\w+-->/g,function(k){
    return o[k]||k;
  });
};

var parts=require("./rss.json");

var newItem=function(title,link,description){
  return plate(item,{
    "<!--TITLE-->":title
    ,"<!--LINK-->":link
    ,"<!--DESCRIPTION-->":description
  });
};

/* {
  TITLE:"TransitionTech"
  ,LINK:"ansuz.transitiontech.ca"
  ,DESCRIPTION:""
  ,LANGUAGE:"English"
  ,CATEGORY:"Technology"
  ,CONTENT: ....
}
*/

var newFeed=function(parts){
  return plate(top,{
    "<!--TITLE-->":parts.TITLE
    ,"<!--LINK-->":parts.LINK
    ,"<!--DESCRIPTION-->":parts.DESCRIPTION
    ,"<!--LANGUAGE-->":"English"
    ,"<!--CATEGORY-->":""
    ,"<!--CONTENT-->":parts.items
      .filter(function(i){
        return i.title!=="";  
      })
      .map(function(i){
        return newItem(i.title,i.link,i.description);
      }).join("")+"<!--CONTENT-->"
  });
};

console.log(newFeed(parts));
