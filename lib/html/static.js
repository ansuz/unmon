var html=require("./html.js");

console.log(html({
  md:process.argv[2]
  ,template:process.argv[3]
}));
