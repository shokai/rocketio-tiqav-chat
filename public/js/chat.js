$(function(){
  $("#btn_send").click(post);
  $("#message").keydown(function(e){
    if(e.keyCode == 13) post();
  });
});

var io = new RocketIO({channel: channel}).connect();

io.on("chat", function(data){
  var line = $("<li>");
  line.append($("<span>").text(data.name));
  line.append($("<span>").text(" : "));
  line.append($("<span>").html(data.message.markup()));
  $("#logs").prepend(line);
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
  var name = $("#name").val();
  var message = $("#message").val();
  if(message.length < 1) return;
  io.push("chat", {name: name, message: message});
  $("#message").val("");
};

String.prototype.markup = function(){
  return this.escape_html().split(/(\s+)/).map(function(i){
    if(i.match(/^\s+$/)) return i;
    if(i.match(/^https?\:\/\/[^\s]+\.(jpe?g|gif|png)$/i)){
      return i.replace(/^(https?\:\/\/[^\s]+)\.(jpe?g|gif|png)$/igm, '<img src="$1.$2">');
    }
    return i.replace(/^(https?\:\/\/[^\s]+)$/igm, '<a href="$1">$1</a>');
  }).join('');
};

String.prototype.escape_html = function(){
  var span = document.createElement('span');
  var txt =  document.createTextNode('');
  span.appendChild(txt);
  txt.data = this;
  return span.innerHTML;
};
