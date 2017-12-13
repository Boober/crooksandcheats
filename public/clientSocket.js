
//Sticking to the default namespace.
var socket = io.connect('/');


//all user events
socket.on('users', function (data) {
  console.log(data);
  if (data.player)
  {
  	$("#players").text("There is currently a player online.");
  } else
  {
  	$("#players").text("There is currently no player online.");
  }
  $("#viewers").text("There are currently " + (data.number - data.player) + " viewers watching.");
});




//Player events
socket.on('playing', function () {
  //Need to install gesture handler, and dispatcher.
	  createShiftGesture(document);

	  document.addEventListener('shiftGesture', function(e) {
	    //Do something code.
	    console.log("Event fired");
	    // document.body.innerHTML += e.shift;
	    if (e.shift == "upright") {
	      $("#picture").attr("align","right");
	    } else if (e.shift == "upleft") {
	      $("#picture").attr("align","left");
	    } else {
	      $("#picture").attr("align","center");
	    }
	  });

	  document.addEventListener('shiftGesture',function(e) {
	  	socket.emit('pshift',{shift: e.shift});
	  });
  });

//Initialize watcher gesture listener.
socket.on('watching', function() {
	createShiftGesture(document);
	document.addEventListener('shiftGesture', function(e) {
	    console.log("Event fired");
	    console.log(e);
	    if (e.detail.shift == "upright") {
	      $("#picture").attr("align","right");
	    } else if (e.detail.shift == "upleft") {
	      $("#picture").attr("align","left");
	    } else {
	      $("#picture").attr("align","center");
	    }
	});
});

//Spectator events.
socket.on('shift', function(data) {
	console.log(data);
	let event = new CustomEvent("shiftGesture", {detail: {"shift": data.shift} });
	document.dispatchEvent(event);
});
