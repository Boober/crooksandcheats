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

function startGame()
{
	let gameinfo = {};
	GetMonsters(gameinfo);
	GetAbilities(gameinfo);
	GetTraps(gameinfo);
	getQuestionSet(gameinfo);
	console.log(gameinfo);
	socket.emit("startGame", {info: gameinfo});
}




//Grabs a random question to display.

function getQuestionSet(arr)
{
		$.ajax({
			url: "https://opentdb.com/api.php?amount=50",
			type: "GET",
			async: false,
			success: function(resp) {
				let res = resp.results;
				arr["questions"] = res;
			},
			error: function(resp) {
				console.log("error");
			}
		});
}


function GetMonsters(arr)
{
	console.log("Getting Monsters...");
	$.ajax({
		type: 'GET',
		url: '/all/monsters',
		async: false,
		success: function(result) {
			console.log(result);
			arr["monsters"] = result;
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + e);
		}
	});
}

function GetAbilities(arr)
{
	console.log("Getting Abilitiess...");
	$.ajax({
		type: 'GET',
		url: '/all/abilities',
		async: false,
		success: function(result) {
			console.log(result);
			//arr.push(result);
			arr["abilities"] = result;
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + err);
		}
	});
}

function GetTraps(arr)
{
	console.log("Getting Traps...");
	$.ajax({
		type: 'GET',
		url: '/all/traps',
		aync: false,
		success: function(result) {
			console.log(result);
		//	arr.push(result);
			arr["traps"] = result;
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + err);
		}
	});
}




