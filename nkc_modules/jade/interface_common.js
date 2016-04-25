//helper
function geid(id){return document.getElementById(id);}
function gv(id){return geid(id).value;}
function ga(id,attr){return geid(id).getAttribute(attr);}
function hset(id,content){geid(id).innerHTML=content;}
function display(id){geid(id).style = 'display:inherit;'}

function post_api(target,body,callback)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function()
  {
    if (xhr.readyState==4)
    {
      if(xhr.status==200){
        callback(null,xhr.responseText);
      }else {
        callback(xhr.status.toString()+' '+xhr.responseText);
      }
    }
  }
  xhr.open("POST","/api/"+target.toString().toLowerCase(),true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.send(JSON.stringify(body));
};

function generalRequest(obj,opt,callback){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function()
  {
    if (xhr.readyState==4)
    {
      try{
        var res;
        res = JSON.parse(xhr.responseText);
        if(xhr.status<200||xhr.status>=400)throw res;
        if(res.error)throw res;

        callback(null,res);
      }catch(err){
        callback(err);
      }
    }
  }

  try{
    xhr.open(opt.method,opt.url,true);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(JSON.stringify(obj));
  }catch(err){
    callback(err);
  }
}

function managementRequest(obj,callback){
  generalRequest(obj,{
    method:'POST',
    url:'/api/management',
  },callback);
}

function viewRequest(obj,callback){
  generalRequest(obj,{
    method:'GET',
    url:'/api/view',
  },callback);
}

function exampleRequest(){
  managementRequest({
    methodName:'what',
    object:'ever',
    param1:'okay',
  },function(err,back){
    if(err)return alert(err);
    alert(back);
  })
}

function get_api(target,callback)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function()
  {
    if (xhr.readyState==4)
    {
      if(xhr.status>=200||xhr.status<400){
        callback(null,xhr.responseText);
      }else {
        callback(xhr.status.toString()+' '+xhr.responseText);
      }
    }
  }
  xhr.open("GET",target.toString().toLowerCase(),true);
  xhr.send();
};

function delete_api(target,callback)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function()
  {
    if (xhr.readyState==4)
    {
      if(xhr.status>=200||xhr.status<400){
        callback(null,xhr.responseText);
      }else {
        callback(xhr.status.toString()+' '+xhr.responseText);
      }
    }
  }
  xhr.open("DELETE",target.toString().toLowerCase(),true);
  xhr.send();
};

function redirect(url){
  window.location=url;
}

//in memory of alex king
// JS QuickTags version 1.3.1
//
// Copyright (c) 2002-2008 Alex King
// http://alexking.org/projects/js-quicktags
function edInsertContent(which, myValue) {
  myField = document.getElementById(which);

  //MOZILLA/NETSCAPE support
  if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    var scrollTop = myField.scrollTop;
    myField.value = myField.value.substring(0, startPos)
    + myValue
    + myField.value.substring(endPos, myField.value.length);
    //myField.focus();

    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
    myField.scrollTop = scrollTop;
  }
  //IE support
  else if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
    myField.focus();
  }
  else
  {
    myField.value += myValue;
    //myField.focus();
  }
}
