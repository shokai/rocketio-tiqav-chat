require 'rubygems'
require 'bundler/setup'
Bundler.require
require 'sinatra'
if development?
  $stdout.sync = true
  require 'sinatra/reloader'
end
require 'sinatra/rocketio'

require File.dirname(__FILE__)+'/main'

set :haml, :escape_html => true
set :websocketio, :port => (ENV['WS_PORT'] || 8080).to_i
set :cometio, :timeout => 120, :post_interval => 1
set :rocketio, :websocket => true, :comet => true

run Sinatra::Application
