var io = new RocketIO({channel: channel}).connect();
var img_search = new ImageSearch(io);
var chat_input = null;

var post = function(str){
  var name = $("#name").val();
  var message = (typeof str === "string") ? str : $("#message").val();
  if(message.length < 1) return;
  io.push("chat", {name: name, message: message});
  $("#message").val("").focus();
};

$(function(){
  chat_input = new InputWatcher("#message");
  chat_input.on("change", function(val){
    img_search.search(val);
  });

  $("#btn_send").click(post);
  $("#message").keydown(function(e){
    if(e.keyCode == 13) post();
  });
  $("#btn_reset_log").click(function(){
    io.push("reset_log");
  });
});

// on receive "image search event"
img_search.on("result", function(res){
  $("#img_select").html("");
  $("#img_select_status").text( res.imgs.length > 0 ? 'search : "'+res.word+'"' : "" );
  if($("#message").val().length < 1) return;

  // display images to select
  for(var i = 0; i < res.imgs.length; i++){
    (function(){
      var img_url = res.imgs[i];
      var img_tag = $("<img>").attr("src", img_url).click(function(e){
        post(img_url);
        $("#img_select").html("");
        $("#img_select_status").html("");
      });
      $("#img_select").append( $("<li>").html(img_tag) );
    })();
  }
});


// on receive "reset_log" event from server
io.on("reset_log", function(){
  $("#logs").html("");
});


// on receive "chat" event from server
io.on("chat", function(data){
  var line = $("<li>");
  line.append($("<span>").text(data.name));
  line.append($("<span>").text(" : "));
  line.append($("<span>").html(data.message.markup()));
  $("#logs").prepend(line); // display chat message
});


// on receive "client_count" event from server
io.on("client_count", function(count){
  $("#client_count").text(count+" users");
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
