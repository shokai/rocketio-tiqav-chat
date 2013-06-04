Sinatra Rocket I/O Sample Chat
==============================
- sample chat app for Sinatra Rocket I/O
  - https://github.com/shokai/sinatra-rocketio
- http://rocketio-chat.herokuapp.com
  - comet only, because Heroku doesn't support websocket
- http://chat.shokai.org
  - WebSocket and Comet


Requirements
------------
- Ruby 1.8.7 ~ 2.0.0
- memcached


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
    % foreman start

=> http://localhost:5000


Deploy
------

    % heroku create --stack cedar
    % heroku config:set WEBSOCKET=false
    % heroku addons:add memcachier:dev
    % git push heroku master
    % heroku open
