RocketTiqav Chat
================
RocketTiqav Chat is a Image-chat using [Sinatra::RocketIO](https://github.com/shokai/rocketio-chat-sample) and [Tiqav.com](http://tiqav.com).

- https://github.com/shokai/rocketio-chat-sample


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
