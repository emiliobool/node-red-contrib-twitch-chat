# node-red-contrib-twitch-chat
[![Build Status](https://travis-ci.org/emiliobool/node-red-contrib-twitch-chat.svg?branch=master)](https://travis-ci.org/emiliobool/node-red-contrib-twitch-chat)

Wrapper nodes for tmi.js v1.4.2

A connection is automatically established during configuration load.
Options to disable this will be added in a future release.

All inputs and outputs are 1:1 with tmi.js. 

Event outputs have the same names as the tmi.js documentation.
Commands receive the same named properties as documented in tmi.js

[TMI.js docs](https://docs.tmijs.org/)

### Nodes

#### Config (Client)

#### Commands

-   action
-   ban
-   clear
-   color
-   commercial
-   connect
-   deletemessage
-   disconnect
-   emoteonly
-   emoteonlyoff
-   followersonly
-   followersonlyoff
-   host
-   join
-   mod
-   mods
-   part
-   ping
-   r9kbeta
-   r9kbetaoff
-   raw
-   say
-   slow
-   slowoff
-   subscribers
-   subscribersoff
-   timeout
-   unban
-   unhost
-   unmod
-   unvip
-   vip
-   vips
-   whisper

#### Events

-   action
-   anongiftpaidupgrade
-   ban
-   chat
-   cheer
-   clearchat
-   connected
-   connecting
-   disconnected
-   emoteonly
-   emotesets
-   followersonly
-   giftpaidupgrade
-   hosted
-   hosting
-   join
-   logon
-   message
-   messagedeleted
-   mod
-   mods
-   notice
-   part
-   ping
-   pong
-   r9kbeta
-   raided
-   raw_message
-   reconnect
-   resub
-   roomstate
-   serverchange
-   slowmode
-   subgift
-   submysterygift
-   subscribers
-   subscription
-   timeout
-   unhost
-   unmod
-   vips
-   whisper
