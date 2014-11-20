var express=require("express");
var stationary=require("./lib/plug/stationary.js");
var app=express();

var pwd=process.env.PWD;

stationary(app,{
  "/index.html":pwd+"/blag/static/index.html"
  ,"/favicon.ico":pwd
  ,"/robots.txt":pwd
  ,"/nodeinfo.json":pwd
  ,"/feed.xml":pwd
  ,"/rss.xml":pwd
});

app.listen(8081);
