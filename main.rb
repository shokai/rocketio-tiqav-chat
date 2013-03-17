io = Sinatra::RocketIO

io.on :chat do |data, from, type|
  puts "#{data['name']} : #{data['message']}  (from:#{from}, type:#{type})"
  io.push :chat, data
end

io.on :connect do |session, type|
  puts "new client <#{session}> (type:#{type})"
  io.push :chat, {:name => "system", :message => "new #{type} client <#{session}>"}
  io.push :chat, {:name => "system", :message => "welcome <#{session}>"}, {:to => session}
end

io.on :disconnect do |session, type|
  puts "disconnect client <#{session}> (type:#{type})"
  io.push :chat, {:name => "system", :message => "bye <#{session}>"}
end

get '/' do
  haml :index
end

get '/:source.css' do
  scss params[:source].to_sym
end
