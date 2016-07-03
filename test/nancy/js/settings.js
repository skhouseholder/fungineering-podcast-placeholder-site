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
    var userData = loadUserData();
    var globalData = loadGlobalData();
    // var surveyQuestionString = "Thanks for taking the time to give your opinion! Feel free to answer or skip as many of these as you'd like.\n\n- What parts of this app are confusing or irritating?\n\n- On the Scores page, would you prefer the Overall Score column to be the average or sum total of the other rounds' scores?\n\n- Would you be interested in helping test the new version of the app next year?\n\n- Are there any other thoughts you'd like to share?";
    var surveyQuestionString = "";

    updateColors();
    // $( ".mailto_link" ).attr("href", "mailto:%20?subject=Barbershop%20Data%20Backup%202015&body=" + encodeURIComponent(JSON.stringify(globalData)));
    // $( ".mailto_link" ).attr("href", "mailto:%20?subject=Barbershop%20Data%20Backup%202015&body=" + encodeURIComponent(JSON.stringify(userData)));
    $( ".feedback_mailto_link" ).attr("href", "mailto:skhouseholder@gmail.com?subject=App%20Feedback&body=" + encodeURIComponent(surveyQuestionString));


    // $( ".up_level_button" ).attr("href", "index.html");
    // $( ".up_level_text" ).text("Schedule");

    if (globalData.prefs.backButtonUrl == "") {
        $( ".up_level_button" ).attr("href", "index.html");
        $( ".up_level_text" ).text("Schedule");
    } else {
        $( ".up_level_button" ).attr("href", globalData.prefs.backButtonUrl);
        $( ".up_level_text" ).text("Back");
    }

    $( ".toggle_theme_button" ).click( function(event){
        toggleBrightness();
    });

    if (window.isphone){
        $( ".send_data_button_warning").text("Backup files are stored in " + "Android/data/com.sarahhouseholder.musicnotes/files" + ".");
        $( ".mailto_link" ).click( function(event){
            saveToFile();   
        });
    } else {
        $( ".mailto_link" ).click( function(event){
            console.log("If this were clicked on a phone, I'd save a file now!");
        });
    }
    
    if (window.isphone) {
        if (cordova.platformId == 'ios'){
           hideNonIosContent();
        }
    }

    

    displayYearSpecificContent();

    $(".set_scoring_method_button").click(function( event ) {
        event.preventDefault();
        var scoringString;

        if (userData.usesSingleScore) {
            userData.usesSingleScore = false;
            scoringString = "Now scoring with BHS scores.";
        } else {
            userData.usesSingleScore = true;
            scoringString = "Now scoring with simple scores.";
        }
        
        save(userData);
        alert(scoringString);

    });

    $(".clear_data_button").click(function (event) {
        event.preventDefault();

        $(".clear_data_button").toggleClass("expanded");
        $(".delete_button").toggleClass("hidden")
        $(".delete_button_warning").toggleClass("hidden")
    });

    $(".send_data_button").click(function (event) {
        event.preventDefault();

        iosFileMessage = "Saved backups can be accessed via iTunes File Sharing.";
        notSupportedFileMessage = "Backing up files is not supported on this device. Sorry. =(";
        androidFileMessage = "Backup files are stored in Android/data/com. sarahhouseholder. musicnotes/files.";

        // update warning text
        if (window.isphone) {
            if (cordova.platformId == 'ios') {
                $(".send_data_button_warning").text(iosFileMessage);
            } else if (cordova.platformId == 'android') {
                $(".send_data_button_warning").text(androidFileMessage);
            }
        } else { // not supported
            $(".send_data_button_warning").text(notSupportedFileMessage);
        }

        $(".send_data_button").toggleClass("expanded");
        $(".mailto_link").toggleClass("hidden")
        $(".send_data_button_warning").toggleClass("hidden")
    });
    
    $(".mailto_link, .feedback_mailto_link, .report-bug-mailto-link, .stop-prop").click(function( event ) {
        // event.preventDefault();
        event.stopPropagation();
    });
    
    $(".choose_scoring_method_button").click(function (event) {
        event.preventDefault();

        $(".choose_scoring_method_button").toggleClass("expanded");
        $(".set_scoring_method_button").toggleClass("hidden");
        $(".scoring_method_explanation").toggleClass("hidden");
    });

    $(".choose_dark_colors_button").click(function (event) {
        event.preventDefault();

        if (window.isphone){
            if (cordova.platformId == "ios") {
                toggleColors();
            } else {
                $(".dark_color_explanation").toggleClass("expanded");
                $(".set_dark_colors_button").toggleClass("hidden");
                $(".dark_color_explanation").toggleClass("hidden");
            }
        } else { //Chrome
            toggleColors();
        }
    });

    $(".set_dark_colors_button").click(function (event) {
        event.preventDefault();
        toggleColors();
    });

    $(".choose_light_colors_button").click(function (event) {
        event.preventDefault();
        toggleColors();
    });

    

    

    $(".delete_button").click(function( event ) {
        event.preventDefault();
        event.stopPropagation();
        localStorage.clear();
        console.log("Cleared local storage!");
        alert("Data deleted!");
    });

    $(".year_toggle_button").click(function( event ) {
        event.preventDefault();
        var yearToggleString;
        toggleYear();
    });

    $(".year_switcher_button.2014").click(function( event ) {
        event.preventDefault();
        setYear("2014");
    });

    $(".year_switcher_button.2015").click(function( event ) {
        event.preventDefault();
        setYear("2015");
    });

    $(".year_switcher_button.2016").click(function( event ) {
        event.preventDefault();
        setYear("2016");
    });

    

    $(".import_button").click(function( event ) {
        event.preventDefault();
        
        $( ".import_button" ).toggleClass("expanded");
        $( ".import_data_form" ).toggleClass("hidden");
        $( ".import_instructions").toggleClass("hidden");

    });

    $("#import_data_textarea").click(function(event) {
        event.stopPropagation();
    });

    $(".import_data_submit_button").click(function(event) {
        
        globalData = loadGlobalData();
        saveBackUp(globalData);
        userData = JSON.parse($.trim($("#import_data_textarea").val()));
        if (!userData.prefs) {
            save2014Data(userData);
        } else if (globalData['2016']) { // it's a file from this year
            saveGlobalState(userData);
        } else { // then it must be a 2015 export
            saveSingleYearData(userData['2015'], '2015');
            saveSingleYearData(userData['2014'], '2014');
        }
        
        alert("Data imported.");
        $("#import_data_textarea").val("");
        $( ".undo_import_button").toggleClass("hidden");
        $( ".import_data_submit_button").toggleClass("hidden");
        event.stopPropagation();
    });

    $( ".undo_import_button").click(function(event){
        userData = JSON.parse(localStorage.getItem("backUpData"));
        // console.log(userData);
        save(userData);
        alert("Data reverted!");

        event.stopPropagation();
    });

    $(".set_quartet_details_button").click(function(event) {
        event.preventDefault();
        var quartetDetailsString;

        if (userData.showQuartetDetailsOnEventPage) {
            userData.showQuartetDetailsOnEventPage = false;
            quartetDetailsString = "Now using concise mode:\n\nQuartet member names and chorus details will NOT be shown in singing lists.\n\nThese details will still appear on each singers' page.";
        } else {
            userData.showQuartetDetailsOnEventPage = true;
            quartetDetailsString = "Now using detailed mode:\n\nQuartet members names and chorus details WILL be shown in singing lists and on each singers' page.";
        }
        
        save(userData);
        alert(quartetDetailsString);
    });

    if (window.isphone){
        $(".app-version").text(AppVersion.version);
        // console.log("(settings) app version is " + appVersion);
    } else {
        $(".app-version").text("[not phone]");
    }

    onUILoaded();

};