function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function findIndexWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function onUILoaded() {
    $("#loading-overlay").slideUp(250);
};

function initializeHeap() {
    // window.plugins.DeviceAccounts.getEmail(function(primaryEmail){
    //       // heap.identify({email: primaryEmail});
    //       alert(primaryEmail);
    //     }, function(error){
    //       console.log('Fail to retrieve accounts, details on exception:', error);
    //     });

    // window.plugins.DeviceAccounts.getEmail(function(account){
    //   // accounts is an array with objects containing name and type attributes
    //   console.log('account registered on this device:', account);
    // }, function(error){
    //   console.log('Fail to retrieve accounts, details on exception:', error);
    // });

    var heapId = device.manufacturer + " " + device.model + " " + device.uuid;
    heap.identify(heapId);

    // number of characters, two bytes per character
    var dataUsageInBytes = 2*JSON.stringify(localStorage).length;


    var deviceInfoTags = {
        appVersion: AppVersion.version,
        deviceModel: device.model,
        devicePlatform: device.platform,
        deviceUuid: device.uuid,
        deviceVersion: device.version,
        deviceManufacturer: device.manufacturer,
        deviceSerial: device.serial,
        localStorageUsage: formatBytes(dataUsageInBytes),
        conventionYear: globalData.prefs.year,
        usesSingleScore: globalData[globalData.prefs.year].usesSingleScore,
    };

    heap.addUserProperties(deviceInfoTags);
};

function arraysAreSame(array1, array2) {
    return (array1.length == array2.length) && array1.every(function(element, index) {
        return element === array2[index]; 
    });
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000; // or 1024 for binary
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function eventHasNoUserData(eventIndex){
    userData = loadUserData();
    var numberOfPerformers = userData.eventList[eventIndex].performanceList.length;

    for (var i = 0; i < numberOfPerformers; i++) {
        // console.log("For " + userData.eventList[eventIndex].performanceList[i].singingGroup + ":");

        // console.log("   checking singingGroup...");
        if (userData.eventList[eventIndex].performanceList[i].singingGroup != '') {
            // console.log("      found one: " + userData.eventList[eventIndex].performanceList[i].singingGroup);
            return false;
        }
        
        // console.log("   checking notes...");
        if (userData.eventList[eventIndex].performanceList[i].notes != '') {
            // console.log("      found one: " + userData.eventList[eventIndex].performanceList[i].notes);
            return false;
        }

        // console.log("   checking scores...");
        for (var scoreIndex = 0; scoreIndex < userData.eventList[eventIndex].performanceList[i].score.length; scoreIndex++) {
            if (userData.eventList[eventIndex].performanceList[i].score[scoreIndex] != "") {
                // console.log("      found one: " + userData.eventList[eventIndex].performanceList[i].score[scoreIndex]);
                return false;
            }
        }

        // console.log("   checking songs...");
        for (var songIndex = 0; songIndex < userData.eventList[eventIndex].performanceList[i].songList.length; songIndex++) {
            if (userData.eventList[eventIndex].performanceList[i].songList[songIndex] != "")
                // console.log("      found one: " + userData.eventList[eventIndex].performanceList[i].songList[songIndex]);
                return false;
        }
    }

    return true;
}

function updateAppData() {
    updateToMultiYearDataFormat();
    globalData = loadGlobalData();
    console.log("version: " + globalData.prefs.version);

    // version 11
    if(!globalData.prefs.version){
        
        // new singing order; adding AIC show
        globalData['2015'] = initialData['2015'];
        globalData.prefs.version = 11;
        saveGlobalState(globalData);
        console.log("updating to version 11");
    }

    // version 12
    if(globalData.prefs.version < 12) {
    
        // ColdSnap new cities
        var ColdSnapIndex = findIndexWithAttr(globalData['2015'].quartetDetails, 'name', "ColdSnap (SLD)");
        globalData['2015'].quartetDetails[ColdSnapIndex].sources = initialData['2015'].quartetDetails[ColdSnapIndex].sources;

        // World Harmony Jamboree singing order
        globalData['2015'].eventList[5].performanceList = initialData['2015'].eventList[5].performanceList;
        
        // Singing List
        globalData['2015'].eventList[2].performanceList = initialData['2015'].eventList[2].performanceList;

        // CBQC ending at 9:30
        globalData['2015'].eventList[0].time = initialData['2015'].eventList[0].time;

        globalData.prefs.version = 12;
        console.log("updating to version 12");
    }

    // version 13 was static data only

    // version 14
    if(globalData.prefs.version < 14) {

        // Detail changes for Trocadero, Late Shift, Prelude, Flightline
        globalData['2015'].quartetDetails = initialData['2015'].quartetDetails;
        globalData.prefs.version = 14;
        console.log("updating to version 14");
    }

    // Semifinals version
    // initialData line ~5100
    if(globalData.prefs.version < 15) {
        if (eventHasNoUserData(4)) {
            console.log(globalData['2015'].eventList[4].performanceList);
            globalData['2015'].eventList[4].performanceList = initialData['2015'].eventList[4].performanceList;
            console.log(globalData['2015'].eventList[4].performanceList);
        }

        var TheEmeraldGuardIndex = findIndexWithAttr(globalData['2015'].quartetDetails, 'name', "The Emerald Guard (BABS)");
        globalData['2015'].quartetDetails[TheEmeraldGuardIndex].sources = initialData['2015'].quartetDetails[TheEmeraldGuardIndex].sources;
        
        globalData.prefs.version = 15;
    }

    // Finals version
    // initialData line ~6340
    if(globalData.prefs.version < 16) {
        if (eventHasNoUserData(10)) {
            console.log(globalData['2015'].eventList[10].performanceList);
            globalData['2015'].eventList[10].performanceList = initialData['2015'].eventList[10].performanceList;
            console.log(globalData['2015'].eventList[10].performanceList);
        }

        var TheEmeraldGuardIndex = findIndexWithAttr(globalData['2015'].quartetDetails, 'name', "The Emerald Guard (BABS)");
        globalData['2015'].quartetDetails[TheEmeraldGuardIndex].sources = initialData['2015'].quartetDetails[TheEmeraldGuardIndex].sources;
        globalData.prefs.version = 16;
    }

    // updating to add 2016 data structure
    // initialData line ~6743
    if(globalData.prefs.version < 17) {
        globalData['2016'] = initialData['2016'];
        globalData.prefs.version = 17;

        // new location for day mode setting
        globalData.prefs.dayMode = true;

        console.log("updating to version 17");
        
        // set to the new year    
        globalData.prefs.year = "2016";
    }

    // adding choruses 
    if(globalData.prefs.version < 19) {
        
        // update chorus details
        globalData['2016'] = initialData['2016'];

        // new location for brightness setting (splitting from color setting)
        globalData.prefs.brightnessDimmed = false;

        globalData.prefs.version = 19;
        console.log("updating to version 19");
    }

    // fixing bug with Youth contest mic tester
    if(globalData.prefs.version < 20) {
        
        // update youth contest details
        globalData['2016'].eventList[0].performanceList = initialData['2016'].eventList[0].performanceList;

        globalData.prefs.version = 20;
        console.log("updating to version 20");
    }

    // adding lastBrightness to support iOS
    if(globalData.prefs.version < 21) {
        
        globalData.prefs.lastBrightness = -1;

        globalData.prefs.version = 21;
        console.log("updating to version 21");
    }

    // adding quartet/order errata
    if(globalData.prefs.version < 22) {

        // group errata
        globalData['2016'].quartetDetails = initialData['2016'].quartetDetails;

        // youth mic tester and singing order
        globalData['2016'].eventList[0].performanceList = initialData['2016'].eventList[0].performanceList;

        // support for back button
        globalData.prefs.backButtonUrl = "";
        
        globalData.prefs.version = 22;
        console.log("updating to version 22");
    }

    if (globalData.prefs.version < 23) {

        // updating Instant Classic quartet data to reflect 2015 win
        globalData['2016'].quartetDetails = initialData['2016'].quartetDetails;
        
        globalData.prefs.version = 23;
        console.log("updating to version 23");
    }

    if (globalData.prefs.version < 24) {
        
        // add stageTime in quarter I and II, youth, and choruses
        for (var i = 0; i < globalData['2016'].eventList[2].performanceList.length; i++) {
            globalData['2016'].eventList[2].performanceList[i].stageTime = initialData['2016'].eventList[2].performanceList[i].stageTime;
        }

        for (var i = 0; i < globalData['2016'].eventList[3].performanceList.length; i++) {
            globalData['2016'].eventList[3].performanceList[i].stageTime = initialData['2016'].eventList[3].performanceList[i].stageTime;
        }

        for (var i = 0; i < globalData['2016'].eventList[7].performanceList.length; i++) {
            globalData['2016'].eventList[7].performanceList[i].stageTime = initialData['2016'].eventList[7].performanceList[i].stageTime;
        }

        for (var i = 0; i < globalData['2016'].eventList[8].performanceList.length; i++) {
            globalData['2016'].eventList[8].performanceList[i].stageTime = initialData['2016'].eventList[8].performanceList[i].stageTime;
        }

        for (var i = 0; i < globalData['2016'].eventList[0].performanceList.length; i++) {
            globalData['2016'].eventList[0].performanceList[i].stageTime = initialData['2016'].eventList[0].performanceList[i].stageTime;
        }

        // mic tester in quarter I and II
        globalData['2016'].eventList[3].hasMicTester = initialData['2016'].eventList[3].hasMicTester;
        globalData['2016'].eventList[2].performanceList[0] = initialData['2016'].eventList[2].performanceList[0];
        globalData['2016'].eventList[3].performanceList[0] = initialData['2016'].eventList[3].performanceList[0];
        
        globalData.prefs.version = 24;
        console.log("updating to version 24");
    }

    // Semifinals 2016
    // if (globalData.prefs.version < ****************) {
    //     if (eventHasNoUserData(4)) {
    //         console.log(globalData['2016'].eventList[4].performanceList);
    //         globalData['2016'].eventList[4].performanceList = initialData['2016'].eventList[4].performanceList;
    //         console.log(globalData['2016'].eventList[4].performanceList);
    //     }
        
    //     globalData.prefs.version = ****************;
            // console.log("updating to version ****************;");
    // }

    // Finals 2016
    // if (globalData.prefs.version < ****************) {
    //     if (eventHasNoUserData(10)) {
    //         console.log(globalData['2016'].eventList[10].performanceList);
    //         globalData['2016'].eventList[10].performanceList = initialData['2016'].eventList[10].performanceList;
    //         console.log(globalData['2016'].eventList[10].performanceList);
    //     }

    //     globalData.prefs.version = ****************;
        // console.log("updating to version ****************;");
    // }

    saveGlobalState(globalData);
}

function updateToMultiYearDataFormat() {
    
    // console.log("in updateToMultiYearDataFormat()");
    globalData = loadGlobalData();
    // console.log("   globalData:");
    // console.log(globalData);

    var tempGlobalData = {}
    if (!globalData.prefs) { //then you're using the old format
        tempGlobalData = initialData;
        tempGlobalData['2014'] = globalData;
        tempGlobalData.prefs = {
            year: '2015'
        };
        globalData = tempGlobalData;
        localStorage.setItem("userData", JSON.stringify(globalData));
        // console.log("   globalData:");
        // console.log(globalData);
    }
    // console.log("   globalData:");
    // console.log(globalData);
}

function toggleYear(globalData) {
        var yearToggleString;
        globalData = loadGlobalData();

        // console.log("   globalData in year switcher:");
        // console.log(globalData);
        
        if (globalData.prefs.year == "2014") {
            globalData.prefs.year = "2015";
            yearToggleString = "2015 data!";
            // console.log("year switcher: prefs.year set to 2015");
            $( ".2014" ).toggleClass("hidden");
            $( ".2015" ).toggleClass("hidden");


        } else {
            globalData.prefs.year = "2014";
            yearToggleString = "2014 data!";
            // console.log("year switcher: prefs.year set to 2014");
            $( ".2014" ).toggleClass("hidden");
            $( ".2015" ).toggleClass("hidden");
            $( ".warning_bar .heading" ).text(warningTextString);
        }
        
        saveGlobalState(globalData);
        // alert(yearToggleString);
}

function setYear(yearString) {
    var yearToggleString;
    globalData = loadGlobalData();

    // console.log("   globalData in year switcher:");
    // console.log(globalData);

    oldYearString = globalData.prefs.year;
    globalData.prefs.year = yearString;

    yearStringClassSelector = "." + yearString;
    oldYearStringClassSelector = "." + oldYearString;

    $( ".setting_button" + yearStringClassSelector ).toggleClass("hidden");
    $( ".setting_button" + oldYearStringClassSelector ).toggleClass("hidden");


    if (yearString == currentYear) {
        $( ".warning_bar" ).addClass("hidden");    
    } else {
        $( ".warning_bar .warning-year" ).text(yearString);
        $( ".warning_bar" ).removeClass("hidden");    
    }
    
    saveGlobalState(globalData);
    // alert(yearToggleString);
};

function displayYearSpecificContent() {
    // this function is no longer called anywhere, I think
    // skh 2016

    var setYearString = globalData.prefs.year;

    if (setYearString == "2016") {
        $( ".dated-2014" ).addClass("hidden");
        $( ".dated-2015" ).addClass("hidden");
        $( ".dated-2016" ).removeClass("hidden");
        $( ".year_switcher_button.2016" ).addClass("hidden");
    } else {
        console.log("selected year: " + setYearString);
        $( ".warning_bar .warning-year" ).text(setYearString);
        $( ".warning_bar" ).removeClass("hidden");  
    }

    $( ".year_switcher_button." + setYearString ).addClass("hidden");
}

function loadGlobalData() {

    // userData is now the global container.
    var globalDataString = localStorage.getItem('userData');
    if (globalDataString === null) {
        console.log("Can't find any user data. Returning initialData.");
        return initialData;
    } else {
        var globalData = JSON.parse(globalDataString);
        // console.log(globalData);
        return globalData;
    }
}

function loadUserData() {
    var globalData = loadGlobalData();

    // console.log("in loadUserData() – globalData: ")
    // console.log(globalData);
    
    var userData = globalData[globalData.prefs.year];
    
    // console.log("in loadUserData() – userData: ")
    // console.log(userData);
    
    return userData;
}

function save(data) {
    var globalData = loadGlobalData();
    globalData[globalData.prefs.year] = data;
    localStorage.setItem("userData", JSON.stringify(globalData));
}

function save2014Data(data) {
    var globalData = loadGlobalData();
    globalData['2014'] = data;
    localStorage.setItem("userData", JSON.stringify(globalData));
}

function saveSingleYearData(data, yearString) {
    var globalData = loadGlobalData();
    globalData[yearString] = data;
    localStorage.setItem("userData", JSON.stringify(globalData));
}

function saveGlobalState(data) {
    localStorage.setItem("userData", JSON.stringify(data));
}

function saveBackUp(data) {
    localStorage.setItem("backUpData", JSON.stringify(data));
}

function getPrettyDate() {
    var m = new Date();
    var dateString =
      m.getFullYear() +""+
      ("0" + (m.getMonth()+1)).slice(-2) +""+
      ("0" + m.getDate()).slice(-2) + "-" +
      ("0" + m.getHours()).slice(-2) + "" +
      ("0" + m.getMinutes()).slice(-2) + "" +
      ("0" + m.getSeconds()).slice(-2);
    return dateString;
};

function saveToFile() {
    if (window.isphone) {
        if (cordova.platformId == 'android') {
                
            // Sarah says: if you change this directory, also change the text in settings.js
            // that tells where the file is saved!
            directory = cordova.file.externalDataDirectory;    
        } else {
            directory = cordova.file.documentsDirectory;    
        }

        var timestamp_filename = "MusicNotes-backup- " + (getPrettyDate()) + ".txt";

        if (cordova.platformId == 'android' || cordova.platformId == 'ios') {
            appDataString = JSON.stringify(globalData, null, '\t');

            window.resolveLocalFileSystemURL(directory, function (dir) {
                dir.getFile(timestamp_filename, { create: true }, function (file) {
                    if(!file) return;
                    file.createWriter(function (fileWriter) {

                        // if (cordova.platformId == 'ios') {
                            // var blob = new Blob([appDataString], { type: 'text/plain' });
                         //    console.log("in save() length: " + fileWriter.length);
                         //    fileWriter.write(blob);
                        // } else {
                            fileWriter.write(appDataString);
                        // }

                        // var blob = new Blob([appDataString], { type: 'text/plain' });
                        // alert("in save() length: " + fileWriter.length);
                        // fileWriter.write(blob);

                        // fileWriter.write(appDataString);

                        // console.log("appData: ", appData);
                        // console.log("Saved appData.");
                        // window.plugins.toast.showLongCenter("Saved " + appData.toString(), function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                        // alert("Saved backup file " + timestamp_filename + ".");
                        navigator.notification.alert("Saved backup file " + timestamp_filename + ".", null, "Success!", "Okay")
                    }, function(e) {alert(e)});
                }, function(e) {alert(e)});
            }); 
        } else {
            alert("not implemented for " + cordova.platformId + " yet");
        }
    }
};

function hideNonIosContent() {
    $(".previous_contest_years").hide();
    $(".year_switcher_button").hide();
}

function createNewPerformance(eventIndex) {
    var scorable;
    var newPerformance = {
                notes: '',
                scorable: true,
                score: [],
                singingGroup: '',
                songList: [],
            }

    if ((eventIndex == 1) ||
        (eventIndex == 5) ||
        (eventIndex == 6) ||
        (eventIndex == 9)) {
        newPerformance.scorable = false;
    } else {
        newPerformance.scorable = true;
    }

    return newPerformance;
}

function hasNoName(performance) {
    if (performance.singingGroup == "") {
        return true;
    } else {
        return false;
    }
}

function shouldShowScoredBadge (performance) {

    for (var i = 0; i < performance.score.length; i++ ) {
        if (performance.score[i] != "") {
            return true;
        }
    }
    return false;
}

function firstEmptySong(array) {
    for (var i = 0; i < array.length; i++ ) {
        if (array[i] == "") {
            return i
        }
    }
    return array.length;
}

function updateColors() {
    // var userData = loadUserData();
    var globalData = loadGlobalData();
     // $( 'html' ).addClass("light");
     // $( 'html' ).addClass("dark");
    // if (userData.dayMode) {

    if (globalData.prefs.dayMode) {
        // $('link[href="css/night_colors.css"]').attr('href','css/day_colors.css');
        $( 'html' ).addClass("light");
        $( 'html' ).removeClass("dark");
    } else {
    //     // $('link[href="css/day_colors.css"]').attr('href','css/night_colors.css');
        $( 'html' ).addClass("dark");
        $( 'html' ).removeClass("light");
    }
}

function toggleBrightness(){
    // var userData = loadUserData();
    // console.log("dayMode was: " + globalData.prefs.dayMode);

    // var globalData = loadGlobalData();

    console.log("toggleBrightness is running!!");

    if (window.isphone){
        var brightness = cordova.plugins.brightness;
        
        function win(status) {
            console.log('Brightness win! Message: ' + status);
            globalData.prefs.lastBrightness = status;
            saveGlobalState(globalData);

        }
        function fail(status) {
            console.log('Brightness fail! Error: ' + status);
            globalData.prefs.lastBrightness = 0.5;
            saveGlobalState(globalData);
        }

        if (cordova.platformId == 'ios' &&
            globalData.prefs.brightnessDimmed == false) {
            brightness.getBrightness(win, fail);
        }
    }

    if (globalData.prefs.brightnessDimmed) {
        console.log("brightness is dimmed");
        if (window.isphone){

            // if iOS, restore previous brightness
            if (cordova.platformId == 'ios') {
                console.log("running on iOS. lastBrightness is " + globalData.prefs.lastBrightness);
                brightness.setBrightness(globalData.prefs.lastBrightness);
            } else { // android
                brightness.setBrightness(-1);    
            }
        }
        globalData.prefs.brightnessDimmed = false;

    } else {
        console.log("brightness is NOT dimmed");
        // if iOS, keep track of last brightness
        if (cordova.platformId == 'ios') {
            brightness.getBrightness(win, fail);
        }
        
        if (window.isphone){
            brightness.setBrightness(0);
        
        }
        globalData.prefs.brightnessDimmed = true;
    }

    // // save(userData); 
    saveGlobalState(globalData);
    // console.log("dayMode is now: " + globalData.prefs.dayMode);
}

function toggleColors() {

    if (globalData.prefs.dayMode) {
    // if (userData.dayMode) {
        $( 'html' ).addClass("dark");
        $( 'html' ).removeClass("light");

        globalData.prefs.dayMode = false;
    } else {
        $( 'html' ).addClass("light");
        $( 'html' ).removeClass("dark");
        
        globalData.prefs.dayMode = true;
    }

    // // save(userData); 
    saveGlobalState(globalData);
}



$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

// window.isphone = false;
//     if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
//         // document.addEventListener("deviceready", onDeviceReady, false);
//         window.isphone = true;
//     };

var micTesterIndex = 0;
var fredScoreIndex = 6;
var song1ScoreIndex = 0;
var song2ScoreIndex = 3;
var fredScoreMax = 100;
// var songScoreMax = 3000;
var songScoreMax = 600;
var appName = "Nashville '16";
var warningTextString = "Viewing Las Vegas 2014 contest";
var userBrightness;
var currentYear = "2016";

// var appVersion = "";

// if (window.isphone) {
//   appVersion = AppVersion.version;
//   console.log("app version is " + appVersion);
// } else {
//     appVersion = "[not phone]";
// }


// $( "a" ).on( "click", function( event ) {

//     // Prevent the usual navigation behavior
//     event.preventDefault();

//     // Alter the url according to the anchor's href attribute, and
//     // store the data-foo attribute information with the url
//     $.mobile.navigate( $(this).attr( "href" ), {
//         foo: $(this).attr("data-foo")
//     });

//     console.log("running!");

//     // Hypothetical content alteration based on the url. E.g, make
//     // an Ajax request for JSON data and render a template into the page.
//     alterContent( $(this).attr("href") );
// });

// $("a").attr("data-transition", "none");

// $(function() {
//     FastClick.attach(document.body);
// });

// $( document ).ready(function() {

//     // if (localStorage.getItem("userData") === null)
//     //     console.log("No user data found.");
//     //     localStorage.setItem("userdata", initialData);
//     // else 
//     //     console.log("Yay! Found some userData!");

// });