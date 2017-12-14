var socket = io.connect('/');

socket.on('players', function (data) {
  console.log(data);

  $("#numPlayers").text(data.number);
  if (data.number == 1) //Only player becomes the host.
  {
  	$("#startgame").empty();
  	$("#startgame").html("<p align='center'><input id='startbutt' type='button' value='Start Game' onclick='startGame()'></p><br/>");
  }
});

socket.on('room', function(data) {
	$("#roomname").text("Your room is " + data.name);
});


socket.on('new', function(data) {
	console.log("A new player has entered your room.");
})

function getRoom()
{
	//Render lobby view before attempting to make a new room.
	$.ajax({
		type: 'GET',
		url: '/lobby',
		success: function(result) {
		//	$("#content").clear();
			console.log($("#content").text());
			$("#content").html(result);
			socket.emit("makeRoom");
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + e);
		}
	});	
}

function joinRoom()
{
	let rm = $("#joinroom").val();
	$.ajax({
		type: 'GET',
		url: '/lobby',
		success: function(result) {
			$("#content").html(result);
			socket.emit("joinRoom", {name: rm});
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + e);
		}
	});

}


function leaveRoom()
{
	//Render lobby view before attempting to make a new room.
	$.ajax({
		type: 'GET',
		url: '/start',
		success: function(result) {
		//	$("#content").clear();
			console.log($("#content").text());
			$("#content").html(result);
			socket.emit("leaveRoom");
		},
		error: function(err) {
	//		$("#error").text("Making room failed. Error: " + e);
			console.log(err);
		}
	});	
}

function StartGame()
{
	let rm = $("#joinroom").val();
	$.ajax({
		type: 'GET',
		url: '/lobby',
		success: function(result) {
			$("#content").html(result);
			socket.emit("joinRoom", {name: rm});
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + e);
		}
	});

}
















//Grabs a random question to display.

function getQuestion()
{
	$.ajax({
		url: "https://opentdb.com/api.php?amount=1",
		type: "GET",
		success: function(resp) {
			let res = resp.results;
			console.log(res);
			let question = res[0].question;
			console.log(question);
			$("#question").text(question);
		}
	});
}


