var socket = io.connect('/');

socket.on('players', function (data) {
  console.log(data);
  $("#numPlayers").text(data.number);
});

socket.on('room', function(data) {
	$("#roomname").text("Your room is " + data.name);
});


socket.on('new', function(data) {
	console.log("A new player has entered your room.");
})

function getRoom()
{
	socket.emit("makeRoom");
}

function joinRoom()
{
	let rm = $("#joinroom").val();
	socket.emit("joinRoom", {name: rm});
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


