exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players

  // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
//		++currentPlayers;
		// Send ("emit") a 'players' event back to the socket that just connected.
	//	socket.emit('players', { number: currentPlayers});
//		socket.emit('welcome', { playernum: currentPlayers});
		/*
		 * Emit players events also to all (i.e. broadcast) other connected sockets.
		 * Broadcast is not emitted back to the current (i.e. "this") connection
     */
	//	socket.broadcast.emit('players', { number: currentPlayers});

		socket.on('makeRoom', function(data) {
			//Create random string: based on https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
			let room = Math.random().toString(36).slice(8);
			let players = 1;
			socket.join(room);
			console.log("Player joined room " + room);
			socket.emit('room', {name: room});
			socket.emit('players', { number: players});
		});

		socket.on('joinRoom', function(data) {
			let room = data.name;
			socket.join(room);
			console.log("Player joined room " + data.name);
			socket.emit('room', {name: room});

			let players = io.nsps['/'].adapter.rooms[room].length;
			socket.to(room).emit('players', { number: players});
			socket.emit('players', { number: players});
			socket.emit(room);
		});
		
		/*
		 * Upon this connection disconnecting (sending a disconnect event)
		 * decrement the number of players and emit an event to all other
		 * sockets.  Notice it would be nonsensical to emit the event back to the
		 * disconnected socket.
		 */
		socket.on('disconnect', function () {
		//	--currentPlayers;
		//	socket.broadcast.emit('players', { number: currentPlayers});
		});
	});
}
