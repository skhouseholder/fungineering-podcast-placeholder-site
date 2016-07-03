$( document ).ready(function() {

	window.isphone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        window.isphone = true;
    };

	updateAppData();
	var userData = loadUserData();
	updateColors();
	var performer_template = $( "#performer_template" );
	var eventIndex = getQueryVariable("event");
	var numberOfPerformers, nextEventIndex;
	var welcomeText = "Set singing order for ";
	var colorIndex = getQueryVariable("color");

	$( ".toggle_theme_button" ).click( function(event){
        toggleBrightness();
    });

	function getOrdinalOf(number) {
		switch (number) {
			case 1:
				return "first"
			case 2:
				return "second"
			case 3:
				return "third"
			case 4:
				return "fourth"
			case 5:
				return "fifth"
			case 6:
				return "sixth"
			case 7:
				return "seventh"
			case 8:
				return "eighth"
			case 9:
				return "ninth"
			case 10:
				return "tenth"
			case 11:
				return "eleventh"
			case 12:
				return "twelfth"
			case 13:
				return "thirteenth"
			case 14:
				return "fourteenth"
			case 15:
				return "fifteenth"
			case 16:
				return "sixteenth"
			case 17:
				return "seventeenth"
			case 18:
				return "eighteenth"
			case 19:
				return "nineteenth"
			case 20:
				return "twentieth"
			default:
				return ""
		}
	}

	function saveSingingOrder(event) {
		
    	$(".performer_form_textbox").each(function (i,element) {

    		console.log(element);
            if ( i + 1 != numberOfPerformers) {
				userData.eventList[nextEventIndex].performanceList[i + 1].singingGroup = $.trim($(element).val());
				// console.log("Not a mic tester");
				// if ($(element).val() != "") {
				// 	console.log("saved: " + $.trim($(element).val()) + " in position " + (i + 1));
				// }

			} else { //is a mic tester
				userData.eventList[nextEventIndex].performanceList[0].singingGroup = $.trim($(element).val());
				// console.log("IS a mic tester");
				// if ($(element).val() != "") {
				// 	console.log("saved: " + $.trim($(element).val()) + " in position " + (i + 1) + "(mic tester)");
				// }
			}
            
        });

		save(userData);
	}

	switch(parseInt(eventIndex)) {
		case 4:
			numberOfPerformers = 21;
			nextEventIndex = 4;
			$(".event_name").text(welcomeText + userData.eventList[nextEventIndex].name.toLowerCase());
			break;

		case 10:
			numberOfPerformers = 11;
			nextEventIndex = 10;
			$(".event_name").text(welcomeText + userData.eventList[nextEventIndex].name.toLowerCase());
			break;

		default:
			numberOfPerformers = 0;
			nextEventIndex = 99;
			$(".event_name").text("Event didn't load. =(");
			break;
	}

	$( ".up_level_button" ).attr("href", "event.html?event=" + eventIndex + "&color=" + colorIndex);
    $( ".up_level_text" ).text("Back");
    $( ".singing_order_content" ).addClass("color" + colorIndex);

	// create text boxes
    for (var i = 1; i < numberOfPerformers+1; i++) {
  		// console.log("i: " + i);
        var new_performer = performer_template.clone();
        
        new_performer.find( ".performer_label" ).attr("id", "performer_" + i + "_label");
        new_performer.find( ".performer_label" ).attr("for", "performer_" + i);

        new_performer.find( ".performer_label" ).text( (i) + ". ");
        new_performer.find( "input" ).addClass("performer_form_textbox");

        new_performer.find( ".performer_form_textbox" ).attr("id", "performer_" + i);
        new_performer.find( ".performer_form_textbox" ).attr("placeholder", "Singing " + getOrdinalOf(i));
        new_performer.find( ".performer_form_textbox" ).attr("inputId", i); 

        new_performer.find( ".performer_form_textbox" ).attr("nextEventIndex", nextEventIndex); 
        new_performer.find( ".performer_form_textbox" ).attr("numberOfPerformers", numberOfPerformers); 

 		new_performer.removeAttr("id");
 		$( "#performer_template" ).removeClass(".performer_form_textbox");

 		// console.log("position " + i + " has name: " + userData.eventList[nextEventIndex].performanceList[i].singingGroup);
 		if (!hasNoName(userData.eventList[nextEventIndex].performanceList[i])) {
        	new_performer.find( ".performer_form_textbox" ).val(userData.eventList[nextEventIndex].performanceList[i].singingGroup);
        	// new_performer.find( ".performer_form_textbox" ).val("1");
        }

 		// note the mic tester
        if (i == numberOfPerformers) {
			new_performer.find( ".performer_form_textbox" ).attr("placeholder", "Mic tester");
			new_performer.find( ".performer_form_textbox" ).val(userData.eventList[nextEventIndex].performanceList[0].singingGroup);        	
			// new_performer.find( ".performer_form_textbox" ).val("2");        	
        }
        
        $( ".list_of_performers" ).append( new_performer );
        new_performer.children( ".performer_form_textbox" ).autocomplete({
			source: singing_group_names, minLength: 3
		});

	}

	$( ".performer_form_textbox" ).on( "blur", saveSingingOrder );
	$( window ).on( "unload", saveSingingOrder );

	if (!navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
		$('input, textarea').on( "click", function(event){

	        var contentTop = $(".singing_order_content").scrollTop();

	        $(".singing_order_content").scrollTo($(event.target).offset().top + contentTop - 65);
	    });
	}

	// performer_template.remove();
	performer_template.hide();
	onUILoaded();
	// saveSingingOrder();

});