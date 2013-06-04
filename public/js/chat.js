var ImageSearch = function(io){
  var self = this;
  if(!(io instanceof RocketIO)) throw new Error("Argument must be instance of RocketIO");
  var cache = {};
  new EventEmitter().apply(this);
  io.on("img_search", function(data){
    if(!data || typeof data.word !== "string" || !(data.imgs instanceof Array)) return;
    cache[data.word] = data.imgs;
    self.emit("result", data);
  });
  var eid = null;
  this.search = function(word){
    if(typeof word !== "string" || word.length < 1) return;
    if(!!cache[word]){
      self.emit("result", cache[word]);
      return;
    }
    if(!!eid) clearTimeout(eid);
    eid = setTimeout(function(){
      eid = null;
      cache[word] = [];
      io.push("img_search", word);
    }, 300);
  };
};

$(function(){
  $("#btn_send").click(post);
  $("#message").keydown(function(e){
    if(e.keyCode == 13) post();
  });
  $("#message").keyup(function(e){
    if(e.keyCode == 13) return;
    img_search.search($("#message").val());
  });
});

var io = new RocketIO({channel: channel}).connect();
var img_search = new ImageSearch(io);

img_search.on("result", function(imgs){
  $("#img_select").html("");
  for(var i = 0; i < imgs.length; i++){
    (function(){
      var img_url = imgs[i];
      var img_tag = $("<img>").attr("src", img_url).click(function(e){
        post(img_url);
        $("#img_select").html("");
      });
      $("#img_select").append( $("<li>").html(img_tag) );
    })();
  }
});

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

var post = function(str){
  var name = $("#name").val();
  var message = str || $("#message").val();
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
