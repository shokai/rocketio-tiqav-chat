io = Sinatra::RocketIO

io.on :chat do |data, client|
  puts "#{data['name']} : #{data['message']}  (from:#{client.session}, type:#{client.type})"
  io.push :chat, data, :channel => client.channel
end

io.on :connect do |client|
  puts "new client <#{client.session}> (type:#{client.type} channel:#{client.channel})"
  io.push :chat, {:name => "system", :message => "new #{client.type} client <#{client.session}>"}, :channel => client.channel
  io.push :chat, {:name => "system", :message => "welcome <#{client.session}>"}, :to => client.session
  io.push :client_count, io.channels.values.select{|c| c == client.channel}.size, :channel => client.channel
end

io.on :disconnect do |client|
  puts "disconnect client <#{client.session}> (type:#{client.type} channel:#{client.channel})"
  io.push :chat, {:name => "system", :message => "bye <#{client.session}>"}, :channel => client.channel
  io.push :client_info, {:websocket => io.sessions[:websocket].size, :comet => io.sessions[:comet].size}, :channel => client.channel
end

io.on :img_search do |word, client|
  next if !word.kind_of? String or word.size < 1
  puts "tiqav search : #{word}"
  begin
    imgs = Cache.get word
    unless imgs
      imgs = Tiqav.search(word)[0...10].map{|i| i.thumbnail.to_s }
      Cache.set word, imgs
    end
    io.push :img_search, {:imgs => imgs, :word => word}, :to => client.session
  rescue StandardError, Timeout::Error => e
    STDERR.puts e
  end
end

get '/' do
  @channels = Hash.new{|h,k| h[k] = 0}
  io.channels.each do |k,v|
    @channels[v] += 1
  end
  haml :index
end

get '/:source.css' do
  scss params[:source].to_sym
end

get '/*' do |channel|
  @channel = channel
  @title = %Q{"#{@channel}" - #{app_name}}
  @bg_color = Digest::MD5.hexdigest(@channel)[0...6]
  haml :chat
end
