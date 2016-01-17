//api request handlers
module.paths.push('./nkc_modules'); //enable require-ment for this path

var moment = require('moment');

var settings = require('server_settings.js');
var helper_mod = require('helper.js')();

var request = require('request');
var jade = require('jade');
var express = require('express');
var handler = express.Router();

///------------
///to be executed before all handlers below
handler.use(function(req,res,next){
  next();
});

handler.use('/jade/',express.static('nkc_modules/jade')); //file serving

var jadeoptions= {
  pretty:true,
  cache:false,
  globals:[]
};

//var hellojade = jade.compileFile('./nkc_modules/jade/hello.jade',jadeoptions)

handler.get('/jade/:fn',(req,res)=>{
  var opt = jadeoptions;
  opt.address = req.ip.toString();
  res.send(
    jade.renderFile('nkc_modules/jade/'+req.params.fn+'.jade',opt)
  );
});

//unhandled error handler
handler.use((err,req,res,next)=>{
  report('error in /html',err.stack);
  res.json({error:err.message});
});

exports.route_handler = handler;
