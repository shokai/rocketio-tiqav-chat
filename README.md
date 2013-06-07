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

<img src="http://shokai.org/archive/file/cf16be2d576ea548e92a3c1fc812fb66.gif">

- incremental image search
- post image by mouse click
- post text by Enter-key press

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
