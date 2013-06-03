$(function(){
  $("#btn_create_chat").click(function(){
    var channel = $("#text_chat_name").val();
    if(channel.length < 1) return;
    location.href = location.protocol+"//"+location.host+"/"+channel;
  });
});
