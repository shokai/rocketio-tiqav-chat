require 'rubygems'
require 'bundler/setup'
Bundler.require
require 'sinatra'
if development?
  $stdout.sync = true
  require 'sinatra/reloader'
end
require 'sinatra/content_for'
require 'sinatra/rocketio'
require 'digest/md5'

require File.expand_path 'libs/cache', File.dirname(__FILE__)
require File.expand_path 'helper', File.dirname(__FILE__)
require File.expand_path 'main', File.dirname(__FILE__)

set :haml, :escape_html => true
set :cometio, :timeout => 120, :post_interval => 1

case RUBY_PLATFORM
when /linux/i then EM.epoll
when /bsd/i then EM.kqueue
end
EM.set_descriptor_table_size 20000

run Sinatra::Application
