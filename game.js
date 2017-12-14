//Class for holding all the game logic for each game room session.

//Class to handle all aspects of the game, including: Ajax calls to receive information,
//Restructuring the page and updating elements appropriately, and tracking game information.


class Game {
	//No need to setup variables, handled at each game start.
	constructor() {}

	/***************************************************************************************/
	/***************       Game Logic       *******************************************/
	/**************************************************************************************/

	/*
	* Starts the game, resetting all game variables, and setting up the display to properly show the game
	* View.
	*/
	startGame() {
		//**Initializing Game Variables.**//
	//	this.getRuleSet(); //Get settings for each round from local server.
//		this.wordset = this.getWordSet(); //Gather words for current game.
/*		this.p1points = 0;
		this.p2points = 0;
		this.waiting= 1;
		this.round = 0;
		this.currentplayer = 0;
		this.roundgifs = [];
		this.roundwords = [];
		this.p1guess;
		this.p2guess;
		this.button = $("#startbutt").clone(); //Cloning play button for future use. */

	//	this.questionSet = null;
		this.getQuestionSet();
		

		//**Changing HTML Content.**//
		let content = $("#content");
		let header = $("#header");
		content.empty();
		header.empty();
	
	}

	/*
	* Starts the next round of the game, gathering a random group of words from the wordset, and preparing
	* sets of gifs based on those words.
	*/
	startRound(roundnum) {
		this.p1guess = 0;
		this.p2guess = 0;
		this.currentplayer = 0;

		let currround = this.roundrules[roundnum]; //Get a list of number of gifs per word.
		let randomwords = this.wordset.sort(() => .5 - Math.random()).slice(0,7); //Getting random word list. Based off https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
		this.roundgifs = [];
		this.wordpoints = {};

		//Changing html to reflect new round.
		$("#scoreboard > h1").text("Round " + Number(this.round + 1)); //Setting current round.

		for (let i = 0; i < 7; i++) {
			let word = randomwords[i];
			if (i < currround.length) { //Still have gifsets to prepare.
				let num = currround[i]; //Number of gifs to retrieve.
				
				this.findGifSet(word,num); //Makes a synchronous call to find a set of gifs to display.
				this.wordpoints[word] = num; //Assign points (number of related gifs) to word.
			}
			else {
				this.wordpoints[word] = 0; //No related gifs, so zero points.
			}
		}
		let wordpairs = this.buildWordPairString(currround);

		$("#header > h2").text(wordpairs);
		$("#header > h3").text("Player " + Number(this.currentplayer + 1) + "'s Turn!");
		this.roundgifs = this.roundgifs.sort(() => .5 - Math.random()); //Randomize the gifs so it's not easy to tell.
		this.roundwords = randomwords;
		this.placeGifsAndWords(); //Setup gifs and words in their proper places.
	}

	/*
	* Builds the string which indicates to the player how much of each quantity gif-word pair exist in the current round.
	*/
	buildWordPairString(roundrules) {
		var counts = {};
		for (var i = 0; i < roundrules.length; i++) {
		  var num = roundrules[i];
		  counts[num] = counts[num] ? counts[num] + 1 : 1;
		}
		let wordpair = "There are";
		for (var key in counts) {
			if (!counts.hasOwnProperty(key)) continue;
			var count = counts[key];
			wordpair = wordpair + " " + count + " " + key + "-to-1,";
		}
		wordpair = wordpair.replace(/.$/," gif to word pairs.");
		return wordpair;
	}

	/*
	* Place Gifs and words within their respective iframes and buttons.
	*/
	placeGifsAndWords() {
		for (let i = 0; i < 8; i++) {
			$("#img-" + i).attr("src","https://giphy.com/embed/" + this.roundgifs[i]);
			if (i < 7) {
				$("#word-" + i).attr("value",this.roundwords[i]);
			}	
		}
	}

	/*
	* Add points to a player's score.
	*/
	addPoints(player,points) {
		if (player) { //Player is player2.
			this.p2points += points;
		} else this.p1points += points;
	}

	/*
	* Sets the word guess (and corresponding points) for the current player.
	*/
	setGuess(points) {
		let player = this.currentplayer;
		//Set guess
		if (player) { //Player is player2.
			this.p2guess = points;
		} else this.p1guess = points;

		//If the player was player 2, need to determine winner and distribute points.
		if (player) {
			this.endRound();
		} else {
			this.currentplayer = 1;
			$("#header > h3").text("Player " + Number(this.currentplayer + 1) + "'s Turn!");
		}
	}

	/*
	* Ends the round, distributing points and starting the next round.
	*/
	endRound() {
		let header = $("#header");
		let winner = "";

		//Determine who wins the round, or if there's a tie.
		if (this.p1guess > this.p2guess) {
			winner = "p1";
		} else if (this.p1guess == this.p2guess) {
			winner = "";
		} else {
			winner = "p2";
		}
		//Distribute points, and highlight winner.
		if (winner) {
			let pt = (winner == "p1") ? this.p1guess : this.p2guess;
			let play = (winner =="p1") ? 0 : 1;
			this.addPoints(play,pt);
			let divid = winner + "score";
			$("#" + divid).css("background-color","red");
			$("#" + divid).css("border","10px solid black");
			$("#header > h2").text("Player 1's Pick had: " + this.p1guess + " gifs, Player's 2 Pick had: " + this.p2guess + " gifs. " + winner + "Wins!");
		} else { //winner = ""
			//Give each player a point.
			this.addPoints(0,1);
			this.addPoints(1,1);
			$("#header > h2").text("Player 1's Pick had: " + this.p1guess + " gifs" + ", Player's 2 Pick had: " + this.p2guess + " gifs." + " It's a tie!");
		}
		$("#p1score h3").text(this.p1points);
		$("#p2score h3").text(this.p2points);
		let g = this; //Passing copy for timeout function.
		$(".wordbutton").toggleClass("disabled"); //Disabling click events while viewing scores.
		setTimeout(function() {
			$(".wordbutton").toggleClass("disabled"); //Re-enabling click events for these button.
			if (g.round + 1 < g.roundrules.length) { //If we have another round.
				if (winner) {
					//Have to reset highlight.
					$("#p1score").css("background-color","#3B5998");
					$("#p1score").css("border","none");
					$("#p2score").css("background-color","#3B5998");
					$("#p2score").css("border","none");
				}
				g.round += 1;
				g.startRound(g.round); //Start the next round.
			} else {
				g.endGame();
			}
		}, 4000); //Gives the player 4 seconds to see who won the round.
	}

	/*
	* Ends the current game, determing the result, (tie, or player win), and reporting it to the players.
	*/
	endGame() {
		$("#content").empty();
		let winner = "";
		//Determine the overall winner.

		$("#p1score").css("background-color","#3B5998");
		$("#p1score").css("border","none");
		$("#p2score").css("background-color","#3B5998");
		$("#p2score").css("border","none");

		if (this.p1points > this.p2points) {
			winner = "Player 1 Wins!";
			$("#p1score").css("background-color","green");
			$("#p1score").css("border","10px solid black");
		} else if (this.p1points == this.p2points) {
			$("#p1score").css("background-color","yellow");
			$("#p1score").css("border","10px solid black");
			$("#p2score").css("background-color","yellow");
			$("#p2score").css("border","10px solid black");
			winner = "It's A Tie! (Tiebreaker Coming Soon. (Maybe. (Possibly. (Probably Not.)))."
		} else {
			$("#p2score").css("background-color","green");
			$("#p2score").css("border","10px solid black");
			winner = "Player 2 Wins!";
		}

		//Modify HTML to display winner.
		let center = document.createElement("p");
		center.setAttribute("align","center");
		let windecl = document.createElement("h1");
		let wintext = document.createTextNode(winner);
		windecl.appendChild(wintext);
		windecl.setAttribute("align","center");

		$("#header > h2").text("GAME OVER.");
		$("#header > h3").text("");
		this.button.attr("value","Play Again");
		$(center).append(this.button);
		$("#content").append(windecl);
		$("#content").append(center);
	}

	/***************************************************************************************/
	/***************       AJAX Logic       *******************************************/
	/**************************************************************************************/


	//Grabs a random question to display.

	
}