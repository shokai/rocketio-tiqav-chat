io = Sinatra::RocketIO
logs = Hash.new{|h,k| h[k] = [] }

## on EventMachine start
io.on :start do
  max_log = (ENV['MAX_LOG_SIZE']||1000).to_i
  EM::add_periodic_timer 60 do   ## delete old chat-logs every minutes
    logs.each do |channel, log|
      logs[channel] = log[(-1*max_log)..(-1)] if log.size > max_log
    end
  end
end

## on receive "reset_log" event
io.on :reset_log do |data, client|
  logs.delete client.channel
  io.push :reset_log, nil, :channel => client.channel
end

## on receive "chat" message
io.on :chat do |data, client|
  puts "#{data['name']} : #{data['message']}  (from:#{client.session}, type:#{client.type})"
  logs[client.channel] << data
  io.push :chat, data, :channel => client.channel
end

## on new client
io.on :connect do |client|
  puts "new client <#{client.session}> (type:#{client.type} channel:#{client.channel})"
  logs[client.channel].each do |log|
    io.push :chat, log, :to => client.session
  end
  io.push :chat, {:name => "system", :message => "new #{client.type} client <#{client.session}>"}, :channel => client.channel
  io.push :chat, {:name => "system", :message => "welcome <#{client.session}>"}, :to => client.session
  io.push :client_count, io.channels.values.select{|c| c == client.channel}.size, :channel => client.channel
end

## on client disconnect
io.on :disconnect do |client|
  puts "disconnect client <#{client.session}> (type:#{client.type} channel:#{client.channel})"
  io.push :chat, {:name => "system", :message => "bye <#{client.session}>"}, :channel => client.channel
  io.push :client_count, io.channels.values.select{|c| c == client.channel.to_s}.size, :channel => client.channel
end

## on receive "img_search" message
io.on :img_search do |word, client|
  next if !word.kind_of? String or word.size < 1
  begin
    EM::defer do
      imgs = Cache.get word
      unless imgs
        puts "tiqav search : #{word}"
        imgs = Tiqav.search(word)[0...10].map{|i| i.thumbnail.to_s }
        Cache.set word, imgs
      end
      io.push :img_search, {:imgs => imgs, :word => word}, :to => client.session
    end
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
