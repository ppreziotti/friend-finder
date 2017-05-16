$("#submit").on("click", function() {
	var answers = document.getElementsByName("answer");
	var userScores = [];
	for (var i = 0; i < answers.length; i++) {
		if (answers[i].checked) {
			userScores.push(answers[i].value);
		}
	}

	var newFriend = {
		name: $("#name").val().trim(),
		photo: $("#photo").val().trim(),
		scores: userScores
	}

	console.log(newFriend);

	var currentURL = window.location.origin;
	$.ajax({
		url: currentURL + "/api/friends", 
		method: "GET"
	}).done(function(data) {
		var scoreDifArray = [];
		for (var i = 0; i < data.length; i++) {
			var scoreDif = 0;
			for (var j = 0; j < data[i].scores.length; j++) {
				scoreDif += Math.abs(parseInt(userScores[j]) - parseInt(data[i].scores[j]));
			}
			console.log(scoreDif);
			scoreDifArray.push(scoreDif);
		}
		console.log(scoreDifArray);
		var minScoreDif = Math.min.apply(null, scoreDifArray);
		console.log(minScoreDif);
		var matchIndex = scoreDifArray.indexOf(minScoreDif);
		var match = data[matchIndex];
		console.log(match.name);
		showModal();

		$.post("/api/friends", newFriend, function(data) {
			friends.push(newFriend);
		});

		function showModal() {
			var modal = document.getElementById('myModal');
			$("#modalPar").html("You matched with " + match.name + "!");
			$("#matchImg").attr("src", match.photo);
			$("#matchImg").attr("alt", match.name);
			modal.style.display = "block";	
			// When the user clicks on <span> (x), close the modal
			$("#close").on("click", function() {
			    modal.style.display = "none";
			});

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}
	});
});