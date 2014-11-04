/* This module enables CORS
  (Cross Origin Resource Sharing)
  That means that anything you serve will explicitly inform clients
  that the resources served are safe to use on other domains
  use this module if you want to set up some kind of API */

module.exports=function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");// check that this is right..
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
};
