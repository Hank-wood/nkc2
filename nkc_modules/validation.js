//validation module
module.paths.push('./nkc_modules'); //enable require-ment for this path

//decide whether a submitted post is legal
exports.validatePost = function(p){
  if(!p.c)return 'content not exist';
  if(p.c.length<10)return 'content too short';
  return true;
};
