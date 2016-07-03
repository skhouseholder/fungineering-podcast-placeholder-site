$( document ).ready(function() {

    window.isphone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        window.isphone = false;
    };

    // if( window.isphone ) {
    //     document.addEventListener("deviceready", onDeviceReady, false);
    //     // console.log("is phone; event listener is set");
    // } else {
    //     onDeviceReady();
    // }

    updateAppData();
    var userData = loadUserData();
    var globalData = loadGlobalData();
    updateColors();

    // window.isFormFieldFocusedTest = false;
    // setInterval(function() {
    //     // alert("howdy ho!");    
    //     if (isFormFieldFocusedTest) {
    //         document.getElementById('song_1_text_box').blur();
    //     } else {
    //         document.getElementById('song_1_text_box').focus();
    //     }
    //     isFormFieldFocusedTest = !isFormFieldFocusedTest;
    //     // alert("hi!");
    // }, 1000);

	var eventIndex = getQueryVariable("event");
    var singingGroup = decodeURIComponent(getQueryVariable("singingGroup"));
    var colorIndex = getQueryVariable("color");    
    var performanceIndex;    

    $( ".performance_content" ).addClass("color" + colorIndex);

    if (userData.eventList[eventIndex].hasUnscheduledPerformers && getQueryVariable("performanceIndex") ){
        performanceIndex = parseInt(getQueryVariable("performanceIndex"));
        $(".add_song_button").removeClass("hidden");
    } else {
        performanceIndex = parseInt(findIndexWithAttr(userData.eventList[eventIndex].performanceList, 'singingGroup', singingGroup));
        $(".add_song_button").hide();
    }

    var performingNumber = performanceIndex;

    function addSongTextBox(songIndex) {

        console.log("songIndex: ", songIndex);
        console.log("songList: ", userData.eventList[eventIndex].performanceList[performanceIndex].songList);

        var song_template = $( ".song_template" ).clone();

        // Add song-specific classes
        song_template.addClass("song" + (songIndex + 1));

        song_template.find("#song_x_text_box").attr("placeholder", "Song title #" + (songIndex + 1));
        song_template.find("#song_x_text_box").attr("songIndex", (songIndex));
        song_template.find("#song_x_text_box").addClass("song_input");
        var textBoxID = "song_" + (songIndex+1) + "_text_box";
        song_template.find("#song_x_text_box").attr("id", textBoxID);
        
        song_template.attr("id", "song_" + (songIndex + 1) + "_text_box_jump");

        // Remove template-only classes
        song_template.removeClass("song_template");
        song_template.removeClass("hidden");
        song_template.removeClass("song_x");

        // song_template.find("#song_x_text_box").

        $( ".songs_form" ).append(song_template);

        $( ".song_autocomplete" ).autocomplete({
            source: availableTags, minLength: 3
        });

        $( "input, textarea" ).on( "blur", savePerformanceData );
        $( window ).on( "unload", savePerformanceData );

        return textBoxID;
    }

    function savePerformanceData (event) {

        $(".song_input").each(function (i,element) {
            // console.log($(element).attr("songIndex"));
            userData.eventList[eventIndex].performanceList[performanceIndex].songList[i] = $.trim($(element).val());
            
            // console.log("");
            // console.log("*******************");
            // console.log("saved song: " + userData.eventList[eventIndex].performanceList[performanceIndex].songList[i] );
            // console.log("   in position " + i);
            // console.log("   current state of the song list:")
            // console.log(userData.eventList[eventIndex].performanceList[performanceIndex].songList);
            // console.log("*******************");
            // console.log(userData.eventList[eventIndex].performanceList[performanceIndex].songList[i] = $.trim($(element).val()));
            // console.log($.trim($(element).val()));
        });

        // userData.eventList[eventIndex].performanceList[performanceIndex].songList[0] = $.trim($("#song_1_text_box").val());
        // userData.eventList[eventIndex].performanceList[performanceIndex].songList[1] = $.trim($("#song_2_text_box").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex] = $.trim($("#fred_score_text_box").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 0] = $.trim($("#song_1_score_mus").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 1] = $.trim($("#song_1_score_pre").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 2] = $.trim($("#song_1_score_sng").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 0] = $.trim($("#song_2_score_mus").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 1] = $.trim($("#song_2_score_pre").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 2] = $.trim($("#song_2_score_sng").val());
        userData.eventList[eventIndex].performanceList[performanceIndex].notes = $.trim($("#notes_textarea").val());

        if (!userData.eventList[eventIndex].performanceList[performanceIndex].scorable) {
            userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup = $.trim($("#singing_group_text_box").val());
        }

        save(userData);
        // console.log("song 1: " + userData.eventList[eventIndex].performanceList[performanceIndex].songList[0]);
        // console.log("song 2: " + userData.eventList[eventIndex].performanceList[performanceIndex].songList[1]);
        // console.log("fredscore: " + userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex]);
        // console.log("notes: " + userData.eventList[eventIndex].performanceList[performanceIndex].notes);

        // setTimeout(savePerformanceData, 1000);
    }

    // function retry(element){
        // console.log(document.getElementById("song_1_text_box").offsetHeight);
        // console.log(elt.offsetHeight);
        // document.getElementById("song_1_text_box").blur();
        // document.getElementById("song_1_text_box").focus();
        // element.disabled = true;
        // element.disabled = false;
    // }

    if (!navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {

        $('input, textarea').on( "click", function(event){

            // if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            //     event.preventDefault();
            // };
            
            var contentTop = $(".performance_content").scrollTop();

            // if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            //     // setTimeout(retry.bind(null, event.target), 425);
            //     event.target.disabled = true;
            //     // element.disabled = false;
            // };

            $(".performance_content").scrollTo($(event.target).offset().top + contentTop - 65);

            // if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            //     // setTimeout(retry.bind(null, event.target), 425);
            //     // element.disabled = true;
            //     event.target.disabled = false;
            // };

            // if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            //     event.preventDefault();
            //     setTimeout( (function(element){ element.focus(); }).bind(null, event.target), 425);
            // }

        });
    }



    // Populate data

    $( ".up_level_button" ).attr("href", "event.html?event=" + eventIndex + "&color=" + colorIndex);
    $( ".up_level_text" ).text("Singing list");
    globalData.prefs.backButtonUrl = "performance.html" + window.location.search;
    console.log(globalData.prefs.backButtonUrl);
    saveGlobalState(globalData);

    $(".add_song_button").click(function( event ) {
        event.preventDefault();
        var newSongIndex = firstEmptySong(userData.eventList[eventIndex].performanceList[performanceIndex].songList);
        addSongTextBox(newSongIndex);
        
    });

    displayYearSpecificContent();

    // Only show quartet info if we can find quartet info; otherwise hide it.
    var quartetDetailsIndex = findIndexWithAttr(userData.quartetDetails, 'name', singingGroup);
    if (quartetDetailsIndex >= 0) {
        $( ".quartet_members" ).text(userData.quartetDetails[quartetDetailsIndex].memberNames);
        $( ".quartet_sources" ).text(userData.quartetDetails[quartetDetailsIndex].sources);
    } else {
        $( ".quartet_members, .quartet_sources").hide();
    }

    // make numbering nice if there are two sessions for one contest
    if (eventIndex == 8) {
        performingNumber += 15;
    } else if (eventIndex == 3) {
        performingNumber += 26;
    }
   

   // console.log(userData.eventList[eventIndex].performanceList[performanceIndex]);

    // If not scorable, make singingGroup editable. Otherwise hide it.
    if (!userData.eventList[eventIndex].performanceList[performanceIndex].scorable) {
        $( ".singing_group_form" ).removeClass("hidden");
        $( "#singing_group_text_box" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].singingGroup);
        $( ".singing_group_name, .singing_order_number").hide();
    } else {
        $( ".singing_group_name" ).text(singingGroup);
        $( ".singing_order_number" ).text(performingNumber + ".");
    }
    

    $( "#song_1_text_box" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].songList[0]);
    $( "#song_2_text_box" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].songList[1]);

    if (firstEmptySong(userData.eventList[eventIndex].performanceList[performanceIndex].songList) > 2) {
        console.log("populating from saved data...");
        for (var songIndex = 2; songIndex < firstEmptySong(userData.eventList[eventIndex].performanceList[performanceIndex].songList); songIndex++) {
            
            console.log("   songIndex " + songIndex + ": " + userData.eventList[eventIndex].performanceList[performanceIndex].songList[songIndex]);
            addSongTextBox(songIndex);
            var textBoxID = "song_" + (songIndex+1) + "_text_box";
            console.log("textBoxID: " + textBoxID);

            $( "#" + textBoxID ).val(userData.eventList[eventIndex].performanceList[performanceIndex].songList[songIndex]);
        }
    }

    $( "#fred_score_text_box" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[fredScoreIndex]);
    $( "#song_1_score_mus" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 0]);
    $( "#song_1_score_pre" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 1]);
    $( "#song_1_score_sng" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song1ScoreIndex + 2]);
    $( "#song_2_score_mus" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 0]);
    $( "#song_2_score_pre" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 1]);
    $( "#song_2_score_sng" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].score[song2ScoreIndex + 2]);
    $( "#notes_textarea" ).val(userData.eventList[eventIndex].performanceList[performanceIndex].notes);

    // set next/previous buttons
    // console.log("performanceIndex: ", performanceIndex);
    // console.log("performanceList.length: ", userData.eventList[eventIndex].performanceList.length);
    // console.log("difference: ", (userData.eventList[eventIndex].performanceList.length - parseInt(performanceIndex)));
    if ((userData.eventList[eventIndex].performanceList.length - parseInt(performanceIndex) > 1) &&
        !hasNoName(userData.eventList[eventIndex].performanceList[parseInt(performanceIndex + 1)])) {
        $( ".next_performance_button" ).attr("href", "performance.html?event="
                                                + eventIndex
                                                + "&singingGroup="
                                                + encodeURIComponent(userData.eventList[eventIndex].
                                                    performanceList[performanceIndex + 1].singingGroup)
                                                + "&performanceIndex=" + (performanceIndex+1) 
                                                + "&color=" + colorIndex);
    } else if (userData.eventList[eventIndex].hasUnscheduledPerformers) {
        $( ".next_performance_button" ).attr("href", "performance.html?event="
                                                + eventIndex
                                                + "&performanceIndex="
                                                + (performanceIndex + 1)
                                                + "&color=" + colorIndex);
    } else {
        $ ( ".next_performance_button" ).addClass("disabled");
    }

    if (performanceIndex > 1 || ((performanceIndex == 1 && userData.eventList[eventIndex].hasMicTester))) {
        $( ".previous_performance_button" ).attr("href", "performance.html?event="
                                                + eventIndex
                                                + "&singingGroup="
                                                + encodeURIComponent(userData.eventList[eventIndex].performanceList[performanceIndex -1].singingGroup)
                                                + "&performanceIndex="
                                                + (performanceIndex-1)
                                                + "&color=" + colorIndex);
    } else {
        // $( ".previous_performance_button").css("display", "none");
        $ ( ".previous_performance_button" ).addClass("disabled");
    }


    // populate previous performance data

    var previous_performance_template = $( ".previous_performance" );
    var song_template = $( ".song" );

    for (var iEvent = 0; iEvent < eventIndex; iEvent++) {
        
        var previousPerformanceIndex = findIndexWithAttr(userData.eventList[iEvent].performanceList, 'singingGroup', singingGroup);
        
        // if there's a previous performance by this group at event iEvent
        if (previousPerformanceIndex >= 0){

            // only show heading if there are indeed other performances
            $( ".section_heading_previous_performances" ).css("display", "block");

            var new_previous_performance = previous_performance_template.clone();

            new_previous_performance.children( ".event_name" ).text( "Event: " + userData.eventList[iEvent].name);

            // if scorable
            if (userData.eventList[iEvent].performanceList[previousPerformanceIndex].scorable) {
                new_previous_performance.children( ".my_score" ).text( "Score: " + userData.eventList[iEvent].performanceList[previousPerformanceIndex].score[fredScoreIndex]);
            }

            // iterate through songs and append
            for (var jSong = 0; jSong < userData.eventList[iEvent].performanceList[previousPerformanceIndex].songList.length; jSong++) {
                var new_song = song_template.clone();
                new_song.text( "Song " + (jSong + 1) + ": " + userData.eventList[iEvent].performanceList[previousPerformanceIndex].songList[jSong]);
                new_previous_performance.children( ".songs" ).append( new_song );
            }

            new_previous_performance.children( ".my_notes" ).text("Notes: " + userData.eventList[iEvent].performanceList[previousPerformanceIndex].notes);

            $( ".previous_performances_by_this_singing_group" ).append( new_previous_performance );
        }

    }
    previous_performance_template.remove();
    song_template.remove();

    // set metadata for use in on()
    $(".metadata").attr( { event:eventIndex, performance:performanceIndex } );

    // honor scoring preferences
    if (userData.usesSingleScore) {
        $(" .bhs_score" ).hide();
    } else {
        $(" .fred_score" ).hide();
    }

    // if it's a mic tester, don't show scoring data
    if (userData.eventList[eventIndex].hasMicTester && performanceIndex == 0) {
        $( ".bhs_score, .fred_score" ).hide(); 
    }

    // if it's not scorable, don't show scoring data
    if (!userData.eventList[eventIndex].performanceList[performanceIndex].scorable) {
        $( ".bhs_score, .fred_score" ).hide();
    }

    $( ".singing_group_autocomplete" ).autocomplete({
            source: singing_group_names
        });

    if ($( ".quartet_members" ).text == "") {
        $( ".quartet_members" ).hide();
    }

    if ($( ".quartet_sources" ).text == "") {
        $( ".quartet_sources" ).hide();
    }

    // make all the forms record data
    $( "input, textarea" ).on( "blur", savePerformanceData );
    $( window ).on( "unload", savePerformanceData );

    savePerformanceData();
    // $( "body" ).show();

    onUILoaded();

});