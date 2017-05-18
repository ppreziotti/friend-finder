// Function for displaying the modal with match information after the user submits the form
function showModal() {
	var modal = document.getElementById("matchModal");
	$("#modalPar").html("You matched with " + matchName + "!");
	$("#matchImg").attr("src", matchPhoto);
	$("#matchImg").attr("alt", matchName);
	modal.style.display = "block";	
	// Modal will close when the x span, or anywhere outside the modal, is clicked
	$("#close").on("click", function() {
	    modal.style.display = "none";
	});
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	        $("#name").val("");
			$("#photo").val("");
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].checked) {
					answers[i].checked = false;
				}
			}
		}
	}
}

function findFriend() {
	// Get the friends array from the API route in order to match the user with his/her
	// most compatible friend
	var currentURL = window.location.origin;
	$.ajax({
		url: currentURL + "/api/friends", 
		method: "GET"
	}).done(function(data) {
		var answers = document.getElementsByName("answer");
		var userScores = [];
		for (var i = 0; i < answers.length; i++) {
			if (answers[i].checked) {
				userScores.push(answers[i].value);
			}
		}
		// Loops through the scores for each person in the friends array and determines
		// the score difference for the user question by question
		var scoreDifArray = [];
		for (var i = 0; i < data.length; i++) {
			var scoreDif = 0;
			for (var j = 0; j < data[i].scores.length; j++) {
				scoreDif += Math.abs(parseInt(userScores[j]) - parseInt(data[i].scores[j]));
			}
			scoreDifArray.push(scoreDif);
		}
		// Determines the user's friend match by pulling the minimum value from the
		// score differences
		var minScoreDif = Math.min.apply(null, scoreDifArray);
		var matchIndex = scoreDifArray.indexOf(minScoreDif);
		var match = data[matchIndex];
		matchName = match.name;
		matchPhoto = match.photo;

		// Creates newFriend to be used in post call
		var newFriend = {
			name: $("#name").val().trim(),
			photo: $("#photo").val().trim(),
			scores: userScores
		};

		// Adds newFriend to the friends array via API post call
		$.ajax({
			url: currentURL + "/api/friends",
			method: "POST",
			data: newFriend
		}).done(function(data) {
			console.log(data);
		});

	// Shows the modal with match information once the ajax call is complete
	showModal();

	});
}

$("#submit").on("click", function() {
	event.preventDefault();
	// Validation for name, photo link, and answers
	var name = $("#name").val();
	var photo = $("#photo").val();
	// Name must container only letters and have a length of 3 to 20 characters
	var checkName = /^[A-Za-z\s]{3,20}$/;
	// Photo can container letters and numbers but must end in jpg, jpeg, png, or gif
	var checkPhoto = /([A-Za-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/;
	var answers = document.getElementsByName("answer");
	// All 10 questions must be answered in order to proceed
	var answerCheck = [];
	for (var i = 0; i < answers.length; i++) {
		if (answers[i].checked) {
			answerCheck.push(answers[i].value);
		}
	}
	if (!checkName.test(name)) {
      alert("Please double check your name to make sure it is valid.");
	}
	else if (!checkPhoto.test(photo)) {
		alert("Please enter a valid photo file.");
	}
	else if (answerCheck.length < 10) {
		alert("Please answer all questions.");
	}
	else {
		findFriend();
	}
});



