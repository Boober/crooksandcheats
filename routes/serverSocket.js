exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players
	var activePlayer = 0;


  // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
	//	++currentPlayers;
//		let player = false; //Checking if this socket is the player.
		if (!activePlayer)
		{
			//If there is no active player, make this new connection the user.
			socket.join('player');
			socket.emit('playing'); //Tell the socket it is playing.
			console.log("Player joined.");
			activePlayer = 1;
			player = true;
		}
		else
		{
			socket.join('spectator');
			socket.emit('watching');
			console.log("Spectator joined");
		}
		socket.emit('users', {number: currentPlayers, player: activePlayer});
		socket.broadcast.emit('users', {number: currentPlayers, player: activePlayer});


		socket.on('pshift', function(data) {
			console.log("Shift detected from player.");
			console.log(data);
			io.to('spectator').emit('shift',data);
		});

		

		socket.on('disconnect', function () {
			--currentPlayers;
			if (player)
			{
				activePlayer = false;
				console.log("Player left.");
			} else console.log("Spectator left.");
		    socket.broadcast.emit('users', {number: currentPlayers, player: activePlayer});
		});
	});

	
}