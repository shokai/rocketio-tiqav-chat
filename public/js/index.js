$(function(){
  $("#btn_create_chat").click(create_chat);
  $("#text_chat_name").keydown(function(e){
    if(e.keyCode == 13) create_chat();
  });
});

var create_chat = function(){
  var channel = $("#text_chat_name").val();
  if(typeof channel !== "string" || channel.length < 1) return;
  location.href = location.protocol+"//"+location.host+"/"+channel;
};
