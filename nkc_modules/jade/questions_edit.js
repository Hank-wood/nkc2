var box = geid('content');

function validate_and_submit(){
  var q = box.value.trim().replace(/\n/g,'');
  box.value=q;
  q=q.split('$');
  
  if(q.indexOf('')>=0){
    //如果各列中有空字符串
    alert('格式可能不符，检查输入。')
    return;
  }

  var question_object = null;
  switch (q.length) {
    case 2://问答题
    var question = q[0];
    var answer = q[1];
    question_object = {
      question:question,
      answer:answer,
      type:'ans',
    }
    break;

    case 5://四项单选题
    var question = q[0];
    var answer =[q[1],q[2],q[3],q[4]];
    question_object={
      question:question,
      answer:answer,
      type:'ch4',
    }
    break;


    default:
    alert('格式可能不符，检查输入。')
    break;
  }

  if(question_object)//if not null
  {
    post_api('questions',question_object,function(err,back){
      if(err)return alert(err.toString());
      //alert(back.toString());
      location.reload();
    })
  }
}

function content_keypress(){
  e = event ? event :(window.event ? window.event : null);
  if(e.keyCode===13||e.which===13)
  validate_and_submit();
}

geid('post').addEventListener('click', validate_and_submit);
geid('content').addEventListener('keyup', content_keypress);
