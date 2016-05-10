//api content request handlers
module.paths.push(__projectroot + 'nkc_modules'); //enable require-ment for this path

var moment = require('moment')
var path = require('path')
var fs = require('fs.extra')
var settings = require('server_settings.js');
var helper_mod = require('helper.js')();
var queryfunc = require('query_functions')
var validation = require('validation')
var AQL = queryfunc.AQL
var apifunc = require('api_functions')

var table = {};
module.exports = table;

//post to a given thread.
var postToThread = function(post,tid,user){
  //check existence
  return queryfunc.doc_load(tid,'threads')
  .catch((err)=>{
    throw 'target thread not found'
  })
  .then((th)=>{
    //th is the thread object now

    //apply for a new pid
    return apifunc.get_new_pid();
  })
  .then((newpid) =>{
    //create a new post
    var timestamp = Date.now();
    var newpost = { //accept only listed attribute
      _key:newpid,
      tid,
      toc:timestamp,
      tlm:timestamp,
      c:post.c,
      t:post.t,
      l:post.l,
      uid:user._key,
      username:user.username,
    };

    //insert the new post into posts collection
    return queryfunc.doc_save(newpost,'posts')
  })
  .then(saveResult=>{
    //update thread object to make sync
    queryfunc.update_thread(tid);
    saveResult.tid = tid;
    saveResult.redirect = 'thread/' + tid.toString()
    return saveResult;
    //okay to respond the user
  })
};

var postToForum = function(post,fid,user){
  post.t = post.t.trim();
  if(post.t.length<3)throw 'title too short. write something would you?'

  var newtid;
  var forum;

  //check existence
  return queryfunc.doc_load(fid,'forums')
  .catch(err=>{
    throw 'specified forum not found'
  })
  .then(function(gotforum){
    //the forum object
    forum = gotforum;

    //obtain new tid
    return apifunc.get_new_tid()
  })
  .then((gottid)=>{
    newtid = gottid;
    //now we got brand new tid.

    //construct a new thread
    var timestamp = Date.now();
    var newthread =
    {
      _key:newtid.toString(),//key must be string.
      fid:fid.toString(),
      toc:timestamp,
      tlm:timestamp,
    };

    //save this new thread
    return queryfunc.doc_save(newthread,'threads')
  })
  .then((result)=>{
    return postToThread(post,result._key,user);
  })
}

var postToPost = function(post,pid,user){ //modification.
  var timestamp,newpost={},original_key,tid;

  return queryfunc.doc_load(pid,'posts')
  .catch(err=>{
    throw 'target post does not exist.'
  })
  .then(original_post=>{
    original_key = original_post._key
    tid = original_post.tid

    timestamp = Date.now();

    newpost.tlm = timestamp
    newpost.c = post.c
    newpost.t = post.t
    newpost.l = post.l

    //modification to the original
    original_post.pid = original_key;
    original_post._key = undefined;

    //now save original to history;
    return queryfunc.doc_save(original_post,'histories')
  })
  .then((back)=>{
    //now update the existing with the newly created:
    return queryfunc.doc_update(original_key,'posts',newpost);
  })
  .then(result=>{
    //update thread as needed.
    return queryfunc.update_thread(tid)
    .then(updateresult=>{
      result.tid = tid;
      result.redirect = 'thread/' + tid +'?post=' + result._key
      return result;
    })
  })
}

table.postTo = {
  operation:function(params){
    //0. object extraction
    var user = params.user
    var post = params.post

    //1. validation
    validation.validatePost(post);

    //2. target extraction
    var target = params.target.split('/')
    if(target.length!=2)throw 'Bad target format, expect "targetType/targetKey"'
    var targetType = target[0]; var targetKey = target[1];

    //3. switch according to targetType
    switch (targetType) {
      case 'forum':
      return postToForum(post,targetKey,user) //throws if notexist
      case 'thread':
      return postToThread(post,targetKey,user)
      case 'post':
      return postToPost(post,targetKey,user)
      default:
      throw 'target type not implemented'
    }
  },
  requiredParams:{
    target:String,
    post:Object,
  },
  testPermission:function(params){
    

  }
}
