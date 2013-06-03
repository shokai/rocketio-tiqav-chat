require 'rubygems'
require 'bundler/setup'
Bundler.require
require 'sinatra'
if development?
  $stdout.sync = true
  require 'sinatra/reloader'
end
require 'sinatra/rocketio'
require 'digest/md5'

require File.expand_path 'helper', File.dirname(__FILE__)
require File.expand_path 'main', File.dirname(__FILE__)

set :haml, :escape_html => true
set :cometio, :timeout => 120, :post_interval => 1

run Sinatra::Application
