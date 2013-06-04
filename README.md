RocketTiqav Chat
================
RocketTiqav Chat is a Image-chat using Sinatra::RocketIO and Tiqav.com.

- https://github.com/shokai/sinatra-rocketio


Demo
----
- http://chat.shokai.org
  - WebSocket and Comet
- http://rocketio-chat.herokuapp.com
  - comet only, because Heroku doesn't support websocket


Requirements
------------
- Ruby 1.8.7 ~ 2.0.0
- memcached
- [Tiqav.com](http://tiqav.com)


Install Dependencies
--------------------

    % gem install bundler foreman
    % bundle install


Run
---

start memcache

    % memcached -vv -p 11211 -U 11211

run app

    % export PORT=5000
    % export WS_PORT=9000
    % export MAX_LOG_SIZE=1000
    % foreman start

=> http://localhost:5000


Deploy
------

    % heroku create --stack cedar
    % heroku config:set WEBSOCKET=false
    % heroku config:set MAX_LOG_SIZE=1000
    % heroku addons:add memcachier:dev
    % git push heroku master
    % heroku open
