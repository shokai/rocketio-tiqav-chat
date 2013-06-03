$(function(){
  $("#chat #btn_send").click(post);
  $("#chat #message").keydown(function(e){
    if(e.keyCode == 13) post();
  });
});

var io = new RocketIO({channel: channel}).connect();

io.on("chat", function(data){
  var m = $("<li>").text(data.name + " : " +data.message);
  $("#chat #logs").prepend(m);
});

io.on("client_count", function(count){
  $("#client_count").text("users:"+count);
});

io.on("connect", function(){
  $("#connection").text("connect("+io.type+")");
});

io.on("disconnect", function(){
  $("#connection").text(io.type+" disconnect");
});

io.on("error", function(err){
  if(typeof console !== "undefined") console.error(err);
});

var post = function(){
  var name = $("#chat #name").val();
  var message = $("#chat #message").val();
  if(message.length < 1) return;
  io.push("chat", {name: name, message: message});
  $("#chat #message").val("");
};
