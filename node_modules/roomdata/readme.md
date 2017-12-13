[![](https://nodei.co/npm/roomdata.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/roomdata)  
[![](https://david-dm.org/michaeldegroot/roomdata.svg "deps") ](https://david-dm.org/michaeldegroot/roomdata "david-dm")
[![](https://travis-ci.org/michaeldegroot/roomdata.svg?branch=master "testing") ](https://travis-ci.org/michaeldegroot/roomdata "travis-ci")
[![](https://coveralls.io/repos/michaeldegroot/roomdata/badge.svg?branch=master&service=github)](https://coveralls.io/github/michaeldegroot/roomdata?branch=master)
![](https://img.shields.io/badge/Node-%3E%3D0.10-green.svg)
![](https://img.shields.io/npm/dt/roomdata.svg)
![](https://img.shields.io/npm/l/roomdata.svg)

___
# What it does
Ability to create room variables for [socket.io](https://www.npmjs.com/package/socket.io).  
It was kind of strange to see that there was no room variable solution out of the box.

[You can find a demo on how it looks here](https://bitbucket.org/repo/EaxM4K/images/4033599328-roomdata.gif)
___
# Changelog
[https://github.com/michaeldegroot/roomdata/commits/master](https://github.com/michaeldegroot/roomdata/commits/master)

___
#  Getting Started

##### 1. Start by installing the package:

    npm install roomdata

##### 2. Do awesome stuff
````js
var roomdata = require('roomdata');

// When you want a user to join a room
roomdata.joinRoom(socket, "testroom"); // You will have to replace your socket.join with this line

// Creates a room variable called 'gamedata'
roomdata.set(socket, "gamedata", {x:4, y:20});

// Gets the room variable called 'gamedata'
console.log(roomdata.get(socket, "gamedata"));      // Prints: { x: 4, y: 20 }
console.log(roomdata.get(socket, "gamedata").y);    // Prints: 20

// When you want a user to leave a room
roomdata.leaveRoom(socket); // you will have to replace your socket.leave with this line
````
___
## API

###  .joinRoom(socket, roomid)
```js
socket:     Object      // The user socket variable
roomid:     String      // Chosen room name
```
_Joines a room_  
__IMPORTANT__: _You have to use roomdata.joinRoom instead of socket.join or the module will __FAIL___

__Example__

````js
io.sockets.on('connection', function (socket) {
    roomdata.joinRoom(socket, "testroom"); // You do not have to create a room before joining it
});
````
___
###  .leaveRoom(socket)
```js
socket:     Object      // The user socket variable
```
_Leaves a room_  
__IMPORTANT__: _You have to use roomdata.leaveRoom instead of socket.leave or the module will __FAIL___

__Example__

````js
io.sockets.on('connection', function (socket) {
    socket.on('disconnect', function() {
    		roomdata.leaveRoom(socket);
	});
});
````
___
###  .set(socket, name, value)
```js
socket:     Object      // The user socket variable
name:       String      // The name for the variable you want to set
value:      Value       // The variable you want to set
```

_Sets a room variable_

__Example__

````js
io.sockets.on('connection', function (socket) {
	roomdata.set(socket, "gamedata", {x:4, y:20}); // Creates a room variable called 'gamedata'
	roomdata.set(socket, "timesdied", 5); // Can also be a number, string, boolean, object etc
});
````
___
###  .get(socket, name)
```js
socket:     Object      // The user socket variable
name:       String      // The name for the variable you want to get
```

_Gets a room variable_

__Example__

````js
io.sockets.on('connection', function (socket) {
	console.log(roomdata.get(socket, "gamedata")); // Prints: { x: 4, y: 20 }
	console.log(roomdata.get(socket, "gamedata").y); // Prints: 20
});
````



___
# Contact

You can contact me at specamps@gmail.com