/** String utilities **/
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


// request image-search to server with RocketIO
// emit "result" event on receive image-url-array
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
  var last_word = null;
  this.search = function(word){
    if(!!eid) clearTimeout(eid);
    if(typeof word !== "string") return;
    if(word.length < 1){
      self.emit("result", {imgs: [], word: ""});
      return;
    }
    if(cache[word] instanceof Array && cache[word].length > 0){
      self.emit("result", {imgs: cache[word], word: ""});
      return;
    }
    eid = setTimeout(function(){
      eid = null;
      cache[word] = [];
      io.push("img_search", word);
    }, 300);
  };
};


// watch text-input and emit event on "change"
var InputWatcher = function(target){
  var self = this;
  new EventEmitter().apply(this);
  this.target = (target instanceof jQuery) ? target : $(target);
  var last_val = null;
  var watch = function(){
    var val = self.target.val();
    if(!!last_val && last_val !== val) self.emit("change", val);
    last_val = val;
  };
  setInterval(watch, 100);
  this.target.keyup(watch);
};
