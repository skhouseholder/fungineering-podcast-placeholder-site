$( document ).ready( function() {
    window.isphone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        window.isphone = true;
    };

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});


function onDeviceReady(){
    updateAppData();
    var userData = loadUserData();
    updateColors();
	var scoreList = {};
	var quarterfinalsIndex1 = 2,
		quarterfinalsIndex2 = 3,
		semifinalsIndex = 4, 
		finalsIndex = 10;

	var quarterfinalsScoreIndex = 1,
		semifinalsScoreIndex = 2,
		finalsScoreIndex = 3,
		overallScoreIndex = 4;

	// $( ".up_level_button" ).attr("href", "index.html");
 //    $( ".up_level_text" ).text("Schedule");

    if (globalData.prefs.backButtonUrl == "") {
    	$( ".up_level_button" ).attr("href", "index.html");
    	$( ".up_level_text" ).text("Schedule");
    } else {
    	$( ".up_level_button" ).attr("href", globalData.prefs.backButtonUrl);
    	$( ".up_level_text" ).text("Back");
    }

    displayYearSpecificContent();

	function addUpSongScores(universalScoreArray) {

		return parseInt(universalScoreArray[song1ScoreIndex + 0]) + 
		parseInt(universalScoreArray[song1ScoreIndex + 1]) + 
		parseInt(universalScoreArray[song1ScoreIndex + 2]) +
		parseInt(universalScoreArray[song2ScoreIndex + 0]) + 
		parseInt(universalScoreArray[song2ScoreIndex + 1]) + 
		parseInt(universalScoreArray[song2ScoreIndex + 2]);

	}

	function gatherEventScores ( eventIndex, eventScoreIndex ) {

		for (var performanceIndex in userData.eventList[eventIndex].performanceList) {
			if (!hasNoName(userData.eventList[eventIndex].performanceList[performanceIndex])) {

				var encodedSingingGroup = encodeURIComponent(userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup);

				// assign singingGroup to scoreList
				if (!scoreList[encodedSingingGroup]) {
					scoreList[encodedSingingGroup] = [];
				}

				if (userData.usesSingleScore) { // fredscores
					scoreList[encodedSingingGroup][eventScoreIndex] =
						userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex];
				} else { // bhs scores
					scoreList[encodedSingingGroup][eventScoreIndex] = addUpSongScores(userData.eventList[eventIndex].performanceList[performanceIndex].score);
				}
			}
		}
	}

	function convertScoreToPercentage (scoreArray) {
		
		var returnArray = [];

		for (var scoreIndex in scoreArray) {	
			
			if (userData.usesSingleScore) {
				returnArray[scoreIndex] = (scoreArray[scoreIndex] / fredScoreMax * 100).toFixed(1);
			} else {
				// using bhs scores
				returnArray[scoreIndex] = (scoreArray[scoreIndex] / songScoreMax * 100).toFixed(1);
			}
		}

		return returnArray;
	}

	function calculateOverallScore (scoreArray) {

		var overallScore = 0;
		var scoreDivisor = 0;

		for (var scoreIndex in scoreArray) {
			if (scoreArray[scoreIndex]) {
				if (userData.usesSingleScore){
					overallScore += parseInt(scoreArray[scoreIndex]);
					scoreDivisor += fredScoreMax;
				} else {
					// using bhs scores
					overallScore += parseInt(scoreArray[scoreIndex]);
					scoreDivisor += songScoreMax;
				}
			}
		}

		// if (userData.usesSingleScore){
		// 	scoreArray[overallScoreIndex] = overallScore;
		// } else {
			scoreArray[overallScoreIndex] = (overallScore / scoreDivisor * 100).toFixed(1);
		// }
	}

	// Traverse through the userData to find and aggregate all scores

	gatherEventScores(quarterfinalsIndex1, quarterfinalsScoreIndex);
	gatherEventScores(quarterfinalsIndex2, quarterfinalsScoreIndex);
	gatherEventScores(semifinalsIndex, semifinalsScoreIndex);
	gatherEventScores(finalsIndex, finalsScoreIndex);

	// create the table

	var tableRowTemplate = $( ".table_row_template" );

	for (var singingGroup in scoreList) {

		var scoreInPercentage = scoreList[singingGroup];

		// Convert to percentages
		scoreInPercentage = convertScoreToPercentage(scoreInPercentage);

		// Calculate overall scores
		calculateOverallScore(scoreList[singingGroup]);
		// console.log("scoreList[", decodeURIComponent(singingGroup), "]: ", scoreList[singingGroup]);

		// Create table row
		var newTableRow = tableRowTemplate.clone();

		newTableRow.find( ".table_singing_group" ).text(decodeURIComponent(singingGroup));
		newTableRow.find( ".table_quarterfinals_score" ).text(parseFloat(scoreInPercentage[quarterfinalsScoreIndex]) || "");
		newTableRow.find( ".table_semifinals_score" ).text(parseFloat(scoreInPercentage[semifinalsScoreIndex]) || "");
		newTableRow.find( ".table_finals_score" ).text(parseFloat(scoreInPercentage[finalsScoreIndex]) || "");
		newTableRow.find( ".table_overall_score" ).text(parseFloat(scoreList[singingGroup][overallScoreIndex]) || "");

		$( ".table_content" ).append( newTableRow );
	}

	tableRowTemplate.remove();
    $( "#scoresTable" ).tablesorter( {sortList: [[3,1], [2,1], [1,1], [4,1]] } ); 

//////////






	var chorusScoreList = {};
	var chorusIndex1 = 7,
		chorusIndex2 = 8;

	var chorusScoreIndex = 1;


	function gatherChorusEventScores ( eventIndex, eventScoreIndex ) {

		for (var performanceIndex in userData.eventList[eventIndex].performanceList) {
			if (!hasNoName(userData.eventList[eventIndex].performanceList[performanceIndex])) {

				var encodedSingingGroup = encodeURIComponent(userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup);

				// assign singingGroup to chorusScoreList
				if (!chorusScoreList[encodedSingingGroup]) {
					chorusScoreList[encodedSingingGroup] = [];
				}

				if (userData.usesSingleScore) { // fredscores
					chorusScoreList[encodedSingingGroup][eventScoreIndex] =
						userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex];
				} else { // bhs scores
					chorusScoreList[encodedSingingGroup][eventScoreIndex] = addUpSongScores(userData.eventList[eventIndex].performanceList[performanceIndex].score);
				}
			}
		}
	}

	


	// Traverse through the userData to find and aggregate all scores

	gatherChorusEventScores(chorusIndex1, chorusScoreIndex);
	gatherChorusEventScores(chorusIndex2, chorusScoreIndex);

	// create the table

	var chorusTableRowTemplate = $( ".table_chorus_row_template" );

	for (var singingGroup in chorusScoreList) {
	
		var chorusScoreInPercentage =  chorusScoreList[singingGroup];

		// Convert to percentages
		chorusScoreInPercentage = convertScoreToPercentage(chorusScoreInPercentage);

		// Calculate overall scores
		calculateOverallScore( chorusScoreList[singingGroup]);

		// Create table row
		var newChorusTableRow = chorusTableRowTemplate.clone();

		newChorusTableRow.find( ".table_chorus_singing_group" ).text(decodeURIComponent(singingGroup));
		newChorusTableRow.find( ".table_chorus_score" ).text(parseFloat(chorusScoreInPercentage[chorusScoreIndex]) || "");
		

		$( ".table_chorus_content" ).append( newChorusTableRow );
	}

	chorusTableRowTemplate.remove();
    $( "#chorusScoresTable" ).tablesorter( {sortList: [ [1,1], [0,1] ]}  );


    //////////

// College!




	var cbqcScoreList = {};
	var cbqcIndex1 = 0;

	var cbqcScoreIndex = 1;


	function gatherCBQCEventScores ( eventIndex, eventScoreIndex ) {

		for (var performanceIndex in userData.eventList[eventIndex].performanceList) {
			if (!hasNoName(userData.eventList[eventIndex].performanceList[performanceIndex])) {

				var encodedSingingGroup = encodeURIComponent(userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup);

				// assign singingGroup to chorusScoreList
				if (!cbqcScoreList[encodedSingingGroup]) {
					cbqcScoreList[encodedSingingGroup] = [];
				}

				if (userData.usesSingleScore) { // fredscores
					cbqcScoreList[encodedSingingGroup][eventScoreIndex] =
						userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex];
				} else { // bhs scores
					cbqcScoreList[encodedSingingGroup][eventScoreIndex] = addUpSongScores(userData.eventList[eventIndex].performanceList[performanceIndex].score);
				}
			}
		}
	}

	


	// Traverse through the userData to find and aggregate all scores

	gatherCBQCEventScores(cbqcIndex1, cbqcScoreIndex);

	// create the table

	var cbqcTableRowTemplate = $( ".table_cbqc_row_template" );

	for (var singingGroup in cbqcScoreList) {
	
		var cbqcScoreInPercentage =  cbqcScoreList[singingGroup];

		// Convert to percentages
		cbqcScoreInPercentage = convertScoreToPercentage(cbqcScoreInPercentage);

		// Calculate overall scores
		calculateOverallScore( cbqcScoreList[singingGroup]);

		// Create table row
		var newCBQCTableRow = cbqcTableRowTemplate.clone();

		newCBQCTableRow.find( ".table_cbqc_singing_group" ).text(decodeURIComponent(singingGroup));
		newCBQCTableRow.find( ".table_cbqc_score" ).text(parseFloat(cbqcScoreInPercentage[cbqcScoreIndex]) || "");
		

		$( ".table_cbqc_content" ).append( newCBQCTableRow );
	}

	cbqcTableRowTemplate.remove();
    $( "#cbqcScoresTable" ).tablesorter( {sortList: [ [1,1], [0,1] ]}  ); 
    onUILoaded();

};