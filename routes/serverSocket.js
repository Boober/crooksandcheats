exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players

	var rd = require('roomdata'); //Used to store variables related to specific game rooms.

  // When a new connection is initiated
	io.sockets.on('connection', function (socket) {

		var currentRoom;

		socket.on('makeRoom', function(data) {
			//Create random string: based on https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
			let room = Math.random().toString(36).slice(8);
			let players = 1;
//			socket.join(room);
			rd.joinRoom(socket,room);
			rd.set(socket,"players", players);
			rd.set(socket,"inprogress",false); //Track whether the game has started.
			console.log("Player joined room " + room);
			socket.emit('room', {name: room});
			socket.emit('players', { number: players});

			currentRoom = room;
		});

		socket.on('joinRoom', function(data) {
			let room = data.name;
	//		socket.join(room);
			rd.joinRoom(socket,room);
			

			//Update player count
		/*	let players = io.nsps['/'].adapter.rooms[room].length;
			socket.to(room).emit('players', { number: players});
			socket.emit('players', { number: players});
			socket.emit(room);
*/
			currentRoom = room; 
			let players = rd.get(socket,"players");
			console.log("Players: " + players);
			let newnum = (players) ? players + 1 : 1;
			rd.set(socket,"players",newnum);

			console.log("Player joined room " + data.name);
			socket.to(room).emit('players', { number: newnum});
			socket.emit('players', { number: newnum});
			socket.emit('room', {name: room});
		});

		socket.on('leaveRoom', function(data) {
	//		let room = data.name;
			let players;
			try{
				players = rd.get(socket,"players");
			} catch (e) {
				players = null;
			}
		//	let players = rd.get(socket,"players");
			console.log("Players: " + players);
			let newnum = (players) ? players - 1 : 0;
			rd.set(socket,"players",newnum);
			rd.leaveRoom(socket);
		//	socket.leave(room);
		//	console.log("Player left room" + data.name);

			//Update Player count
		//	let players = io.nsps['/'].adapter.rooms[room].length;
			socket.to(currentRoom).emit('players', { number: newnum});
			socket.emit('players', { number: newnum});
//			socket.emit(room);

			currentRoom = null; 
		});

		socket.on('startGame', function(data) {
			console.log("Starting Data: " + data.info);
		});
		
		/*
		 * Upon this connection disconnecting (sending a disconnect event)
		 * decrement the number of players and emit an event to all other
		 * sockets.  Notice it would be nonsensical to emit the event back to the
		 * disconnected socket.
		 */
		socket.on('disconnect', function () {
			//If this socket was connected to a room
			let players;
			try{
				players = rd.get(socket,"players");
				let newnum = (players) ? players - 1 : 0;
				rd.set(socket,"players",newnum);
				rd.leaveRoom(socket);
			} catch (e) {
				players = null;
			}
		    
			if (currentRoom)
			{
		//		let players = io.nsps['/'].adapter.rooms[currentRoom].length;
				socket.to(currentRoom).emit('players', { number: newnum});
			} 
		});
	});
}












/************* Ajax Functions ****************************/


