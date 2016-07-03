$( document ).ready( function() {
    window.isphone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        window.isphone = false;
    };

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});


function onDeviceReady(){
	updateAppData();
	var eventIndex = getQueryVariable("event");
	var colorIndex = getQueryVariable("color");
	var firstEmptyPerformanceIndex = 1;
	var score_url_suffix;
	var blankScoreArray = ["", "", "", "", "", "", ""];

	var userData = loadUserData();
	updateColors();

	switch (parseInt(eventIndex)) {
		case 0:
			score_url_suffix = "cbqcTable";
			console.log("case 0");
			break;
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 9:
		case 10:
			score_url_suffix = "";
			break;
		case 7:
		case 8:
			score_url_suffix = "chorusTable";
			break;
	}
	// console.log("in event.js – userData: " + userData);
    $( ".event_name" ).text(userData.eventList[eventIndex].name);
    $( ".event_time" ).text(userData.eventList[eventIndex].time);
    $( ".up_level_button" ).attr("href", "index.html");
    $( ".up_level_text" ).text("Schedule");
    console.log(score_url_suffix);
    $( ".my_scores_button").attr("href", "scores.html#" + score_url_suffix);


    // back button assignment
    globalData.prefs.backButtonUrl = "event.html" + window.location.search;
    // console.log(globalData.prefs.backButtonUrl);
    saveGlobalState(globalData);

    // set background color
    $( ".event_content" ).addClass("color" + colorIndex);    

	$( ".toggle_theme_button" ).click( function(event){
    	toggleBrightness();
    });

    $(".final_scores_button").click(function( event ) {
        // event.preventDefault();
        event.stopPropagation();
    });

    displayYearSpecificContent();

	var performance_button_template = $( ".performance_button_wrapper" );
	var numberOfPerformers = userData.eventList[eventIndex].performanceList.length;

	// i = 0 is saved for mic testers only (whether or not they exist)
    for (var i = 0; i < numberOfPerformers; i++) {

    	var performingNumber = i;

    	if (userData.eventList[eventIndex].performanceList[i].singingGroup != "" ||
    		(i == 0  && userData.eventList[eventIndex].hasMicTester)) {
	        var new_performance = performance_button_template.clone();

	    	new_performance.find( "a" ).attr("href", "performance.html?event=" + eventIndex 
	    										+ "&singingGroup="
	    										+ encodeURIComponent(userData.eventList[eventIndex].performanceList[i].singingGroup)
	    										+ "&performanceIndex="
	    										+ i
	    										+ "&color=" + colorIndex);

	    	// make numbering nice if there are two sessions for one contest
	   		if (eventIndex == 8) {
	   			performingNumber += 15;
	   		} else if (eventIndex == 3) {
	   			performingNumber += 29;
	   		}

	        new_performance.find( ".singing_group_name" ).text( (performingNumber) + ". " + userData.eventList[eventIndex].performanceList[i].singingGroup);
	        // new_performance.find( "singing_group_details" ).text
	        // var quartetDetailsIndex = findIndexWithAttr(userData.quartetDetails, 'name', singingGroup);

    		if (userData.showQuartetDetailsOnEventPage){

	    		var quartetDetailsIndex = findIndexWithAttr(userData.quartetDetails, 'name', userData.eventList[eventIndex].performanceList[i].singingGroup);

	    		if (quartetDetailsIndex >= 0) {
			        new_performance.find( ".singing_group_members" ).text(userData.quartetDetails[quartetDetailsIndex].memberNames);
			        new_performance.find( ".singing_group_sources" ).text(userData.quartetDetails[quartetDetailsIndex].sources);

			        // if performance has a stageTime field and it's not empty
			        if (userData.eventList[eventIndex].performanceList[i].stageTime && userData.eventList[eventIndex].performanceList[i].stageTime != "") {
			        	var stage_time_string = "Estimated " + userData.eventList[eventIndex].performanceList[i].stageTime;
			        	new_performance.find( ".stage_time" ).text(stage_time_string);
			        } else {
			        	new_performance.find( ".stage_time" ).remove();
			        }
			    
			        new_performance.find( "li" ).addClass("showing_details")
			    } else {
			    	new_performance.find( ".singing_group_members" ).hide();
			    	new_performance.find( ".singing_group_sources" ).hide()
			    }

			}


	        // Show "Mic Tester" if there is no name filled in; otherwise show "MT"
	        var micTesterString = "Mic Tester ";
	        if (userData.eventList[eventIndex].performanceList[i].singingGroup != "") {
	        	micTesterString = "MT: ";
	        }

	        // hide the mic tester button if there isn't a mic tester
	        if (userData.eventList[eventIndex].hasMicTester && i == 0) {
				new_performance.find( ".singing_group_name" ).text( micTesterString + userData.eventList[eventIndex].performanceList[i].singingGroup);
			} else {
				// $( ".mic_tester_link" ).hide();
			}

			// show which performances have been scored
			if (shouldShowScoredBadge(userData.eventList[eventIndex].performanceList[i])) {
	        	new_performance.find( "li" ).addClass("scored")
	        }
	        else {
	        	new_performance.find( "li" ).removeClass("scored");
	        }

	        $( ".contestable_performances" ).append( new_performance );

	        firstEmptyPerformanceIndex = i+1;
    	}
	}

	$( ".create_new_performance_button" ).find( "a" ).attr("href", "performance.html?event=" + eventIndex + "&performanceIndex=" + firstEmptyPerformanceIndex + "&color=" + colorIndex);

	if (!userData.eventList[eventIndex].hasUnscheduledPerformers) {
		$( ".create_new_performance_button").hide();
	}


	if (!userData.showQuartetDetailsOnEventPage){ 
		$( ".singing_group_members, .singing_group_sources" ).hide();
	}

	performance_button_template.remove();

	if (eventIndex == 4 || eventIndex == 10){

		// if no singing order has been entered, hide mic tester button and show message
		if(userData.eventList[eventIndex].performanceList[1].singingGroup == "") {
			$( ".update_app_message" ).removeClass("hidden");
			$( ".contestable_performances" ).hide(); 
		}

		// if there are scores for performers #1 and #2, they can't change the order
		console.log(arraysAreSame(userData.eventList[eventIndex].performanceList[1].score, blankScoreArray));
		if((arraysAreSame(userData.eventList[eventIndex].performanceList[1].score, blankScoreArray) ||
				arraysAreSame(userData.eventList[eventIndex].performanceList[1].score, [])) ||
			(arraysAreSame(userData.eventList[eventIndex].performanceList[2].score, blankScoreArray) ||
				arraysAreSame(userData.eventList[eventIndex].performanceList[2].score, []))) {
			$( ".set_singing_order_button" ).css("display", "block");
			$( ".singing_order_link" ).attr("href", "singing_order.html?event=" + eventIndex + "&color=" + colorIndex);
		}
	}

	onUILoaded();

	// if (eventIndex == 3 || eventIndex == 4) {
	// 	$( ".set_singing_order_button" ).css("display", "block");
	// 	$( ".singing_order_link" ).attr("href", "singing_order.html?event=" + eventIndex + "&color=" + colorIndex);
	// }

	// $( "body" ).show();
};