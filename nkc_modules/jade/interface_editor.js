var nkc_editor = function(){
  var editor = {};

  editor.assemblePostObject = function(){
    var post = {
      t:gv('title').trim(),
      c:gv('content').trim(),
      l:gv('lang').toLowerCase().trim(),
    }

    if(post.t=='')post.t=undefined

    return post
  }

  editor.submit = function(){
    var post = editor.assemblePostObject()

    var target = gv('target').trim();

    if(post.c==''){screenTopWarning('请填写内容。');return;}
    if(target==''){screenTopWarning('请填写发表至的目标。');return;}

    geid('post').disabled = true
    return nkcAPI('postTo',{
      target:target,
      post:post,
    })
    .then(function(result){
      var redirectTarget = result.redirect;
      redirect(redirectTarget?redirectTarget:'/'+target)
    })
    .catch(function(err){
      jwarning(err)
      geid('post').disabled = false
    })
  }

  var debounce_timer;

  editor.trigger = function(e){
    if(debounce_timer){
      clearTimeout(debounce_timer)
    }
    debounce_timer = setTimeout(function(){
      editor.update()
    },300)
  }

  editor.update = function(){

    var post = editor.assemblePostObject()
    var title = post.t||""
    hset('parsedtitle',title); //XSS prone.

    var content = post.c
    var parsedcontent = '';

    parsedcontent = render.experimental_render(post)

    hset('parsedcontent',parsedcontent); //XSS prone

    ReHighlightEverything() //interface_common code highlight

  }

  //enable click
  geid('title').addEventListener('keyup', editor.trigger);
  //enable click
  geid('content').addEventListener('keyup', editor.trigger);

  geid('post').addEventListener('click', editor.submit);
  geid('lang').addEventListener('change',editor.update);

  return editor;
}

function mathfresh(){
  if(MathJax){
    MathJax.Hub.PreProcess(geid('parsedcontent'),function(){MathJax.Hub.Process(geid('parsedcontent'))})
  }
}

var editor = nkc_editor();
editor.update();
