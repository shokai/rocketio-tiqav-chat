io = Sinatra::RocketIO

io.on :chat do |data, client|
  puts "#{data['name']} : #{data['message']}  (from:#{client.session}, type:#{client.type})"
  io.push :chat, data
end

io.on :connect do |client|
  puts "new client <#{client.session}> (type:#{client.type})"
  io.push :chat, {:name => "system", :message => "new #{client.type} client <#{client.session}>"}
  io.push :chat, {:name => "system", :message => "welcome <#{client.session}>"}, {:to => client.session}
end

io.on :disconnect do |client|
  puts "disconnect client <#{client.session}> (type:#{client.type})"
  io.push :chat, {:name => "system", :message => "bye <#{client.session}>"}
end

get '/' do
  haml :index
end

get '/:source.css' do
  scss params[:source].to_sym
end
