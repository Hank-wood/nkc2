exports.server={
  name:"nkc Development Server",
  port:1086,
  address:'',
  github:'https://github.com/ctmakro/nkc2',
};

exports.jadeoptions= {
  pretty:true,cache:false,
  //cache:true,pretty:false,
  //globals:[]
  server:exports.server,
};

exports.arango={
  address:'http://127.0.0.1:8529'
};

exports.couchdb={
  address:"127.0.0.1",
  port:5984
};

exports.root_serve_static =
[
  //clientside js file serving
  {to:'nkc_modules/chat'},
  {to:'nkc_modules/jquery'},
  {to:'nkc_modules/angular'},
  {to:'node_modules/marked/lib'},
  {to:'node_modules/commonmark/dist'},
  {to:'nkc_modules/vue'},
  {to:'nkc_modules/jade'},
  {to:'nkc_modules/xbbcode'},
  {map:'/bootstrap',to:'bootstrap-3.3.6-dist'},
];
