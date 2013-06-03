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

get '/' do
  haml :index
end

get '/:source.css' do
  scss params[:source].to_sym
end

get '/*' do |channel|
  @channel = channel
  haml :chat
end
