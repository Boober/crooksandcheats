var socket = io.connect('/');

socket.on('players', function (data) {
  console.log(data);

  $("#numPlayers").text(data.number);
  if (data.number == 1) //Only player becomes the host.
  {
  	$("#startgame").empty();
  	$("#startgame").html("<p align='center'><input id='startbutt' type='button' value='Start Game' onclick='startGame()'></p><br/>");
  }

  if (data.joined)
  {
  	$("#name").val("Player " + data.number);
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
			  $("#name").val("Player " + 1);
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








/************** Game Socket events ********************************/

var playerStats;
var challenges;

socket.on('beginGame', function(data) {
	enterGame();
});


function enterGame()
{
	//Render lobby view before attempting to make a new room.
	playerStats = {"name": $("#name").text(), "coins": 20};

	$.ajax({
		type: 'GET',
		url: '/game/game',
		success: function(result) {
		//	$("#content").clear();
			console.log($("#content").text());
			$("#content").html(result);
		},
		error: function(err) {
			$("#error").text("Making room failed. Error: " + e);
		}
	});	
}


socket.on('distributeChallenges', function(data) {
	console.log(data);
	console.log(data.c);
	challenges = shuffleArray(data.c);
});


socket.on('startRound', function(data) {
	let challenge = challenges.pop();
	displayChallenge(challenge);
	//console.log(challenge);
});




// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/******* Handle Challenges **********/

function displayChallenge(challenge)
{
	let type = challenge.type;
	switch (type) {
		case 'question':
			let options = [];
			options.push(challenge.data.correct_answer);
			options = options.concat(challenge.data.incorrect_answers);
			options = shuffleArray(options);

			let question = challenge.data.question;
			console.log(question);
			let encounter = "The Sphinx, and it asks:\n" + question;
			let data = { list: options, name: encounter };
			ajaxChallenge(data);
			break;
		case 'monster':
			break;
		case 'trap':
			break;
		default:
			break;
	}
}




function ajaxChallenge(data)
{
	console.log(data);
//	let d = JSON.stringify(data);
//	console.log(d);
	$.ajax({
		type: 'POST',
		url: '/game/challenge',
		data: data,
		success: function(result) {
		//	$("#content").clear();
			console.log("Success");
			console.log($("#content").text());
			$("#content").html(result);
		},
		error: function(err) {
			console.log(err);
			$("#error").text("Making room failed. Error: " + err);
		}
	});		
}

