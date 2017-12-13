function getRandomQuestion()
{
	$.ajax({
		url: "https://opentdb.com/api.php?amount=1",
		type: "GET",
		success: function(resp) {
			console.log(output);
		}
	});
}