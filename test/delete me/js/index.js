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

    
    // localStorage.clear();
    // console.log("Cleared local storage!");

    updateAppData();
    var userData = loadUserData();
    updateColors();
    var fileDirectory;

    if (window.isphone) {
        if (cordova.platformId == 'android') {
            console.log("platform: android");
            // StatusBar.backgroundColorByHexString("#303F9F");
            // fileDirectory = cordova.file.externalRootDirectory;

        } else if (cordova.platformId == 'ios') {
            console.log("platform: ios");
            // console.log(StatusBar);
            // StatusBar.styleLightContent();
            // StatusBar.styleBlackTranslucent();
            // StatusBar.overlaysWebView(false);
            // StatusBar.backgroundColorByHexString("#3F51B5");
            // StatusBar.backgroundColorByHexString("#303F9F");
            // fileDirectory = cordova.file.syncedDataDirectory;
        }
    }
    
    // localStorage.clear();
    // console.log("Cleared local storage!");
    // alert("Cleared local storage!");

    if (window.isphone) {
        initializeHeap();
    }
    console.log("localStorage length: " + JSON.stringify(localStorage).length);
    console.log("Number of characters, 2 bytes per character");
    console.log(formatBytes(2*JSON.stringify(localStorage).length));

    if (globalData.prefs.year == "2015") {
        $( ".up_level_text" ).text("Pittsburgh '15");
    } else if (globalData.prefs.year == "2014") {
        $( ".up_level_text" ).text("Vegas 2014");
    } else {
        $( ".up_level_text" ).text(appName);
    }
        
    $( ".up_level_text" ).addClass("title");
    $( ".up_level_text" ).addClass("heading");
    $( ".arrow" ).hide();

    globalData.prefs.backButtonUrl = "";
    // globalData.prefs.backButtonUrl = "index.html"
    // console.log(globalData.prefs.backButtonUrl);
    saveGlobalState(globalData);

    displayYearSpecificContent();

    console.log("year set to " + globalData.prefs.year);

    $( ".toggle_theme_button" ).click( function(event){
        toggleBrightness();
    });

    onUILoaded();

};