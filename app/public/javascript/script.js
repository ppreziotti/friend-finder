

$("#submit").on("click", function() {
	event.preventDefault();
	var answers = document.getElementsByName("answer");
	var userScores = [];
	for (var i = 0; i < answers.length; i++) {
		if (answers[i].checked) {
			userScores.push(answers[i].value);
		}
	}

	// Validation for name, photo link, and answers
	if ($("#name").val() === "") {
		alert("Please enter your name.");
	}
	else if ($("#photo").val() === "") {
		alert("Please enter the link to your photo.");
	}
	else if (userScores.length < 10) {
		alert("Please answer all questions.");
	}
	else {
		var newFriend = {
			name: $("#name").val().trim(),
			photo: $("#photo").val().trim(),
			scores: userScores
		}
	}

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
			scoreDifArray.push(scoreDif);
		}
		var minScoreDif = Math.min.apply(null, scoreDifArray);
		var matchIndex = scoreDifArray.indexOf(minScoreDif);
		var match = data[matchIndex];

		$.ajax({
			url: currentURL + "/api/friends",
			method: "POST",
			data: newFriend
		}).done(function(data) {
			console.log(data);
		});

		showModal();

		// Function for displaying the modal with match information after the user submits the form
		function showModal() {
			$("#name").val("");
			$("#photo").val("");
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].checked) {
					answers[i].checked = false;
				}
			}
			var modal = document.getElementById("matchModal");
			$("#modalPar").html("You matched with " + match.name + "!");
			$("#matchImg").attr("src", match.photo);
			$("#matchImg").attr("alt", match.name);
			modal.style.display = "block";	
			// Modal will close when the x span, or anywhere outside the modal, is clicked
			$("#close").on("click", function() {
			    modal.style.display = "none";
			});
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}
	});
});