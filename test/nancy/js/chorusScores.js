$(document).ready(function() { 
        
    var userData = loadUserData();
	var chorusScoreList = {};
	var chorusIndex1 = 7,
		chorusIndex2 = 8;

	var chorusScoreIndex = 1;

	function addUpSongScores(universalScoreArray) {

		return parseInt(universalScoreArray[song1ScoreIndex + 0]) + 
		parseInt(universalScoreArray[song1ScoreIndex + 1]) + 
		parseInt(universalScoreArray[song1ScoreIndex + 2]) +
		parseInt(universalScoreArray[song2ScoreIndex + 0]) + 
		parseInt(universalScoreArray[song2ScoreIndex + 1]) + 
		parseInt(universalScoreArray[song2ScoreIndex + 2]);

	}

	function gatherChorusEventScores ( eventIndex, eventScoreIndex ) {

		for (var performanceIndex in userData.eventList[eventIndex].performanceList) {
			if (!hasNoName(userData.eventList[eventIndex].performanceList[performanceIndex])) {

				var encodedSingingGroup = encodeURIComponent(userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup);

				// assign singingGroup to chorusScoreList
				if (! chorusScoreList[encodedSingingGroup]) {
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
			if (userData.usesSingleScore) {
				overallScore += parseInt(scoreArray[scoreIndex]);
				scoreDivisor += fredScoreMax;
			} else {
				// using bhs scores
				overallScore += parseInt(scoreArray[scoreIndex]);
				scoreDivisor += songScoreMax;
			}
		}

		scoreArray[overallScoreIndex] = (overallScore / scoreDivisor * 100).toFixed(1);
	}

	// Traverse through the userData to find and aggregate all scores

	gatherEventScores(chorusIndex1, chorusScoreIndex);
	gatherEventScores(chorusIndex2, chorusScoreIndex);

	// create the table

	var chorusTableRowTemplate = $( ".table_chorus_row_template" );

	for (var singingGroup in  chorusScoreList) {

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
    // $( "#chorusScoresTable" ).tablesorter( {sortList: [[2,1], [1,1]]}  ); 
}); 