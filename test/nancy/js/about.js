$( document ).ready( function() {
    window.isphone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        // document.addEventListener("deviceready", onDeviceReady, false);
        window.isphone = false;
    };

    updateAppData()
    var userData = loadUserData();
    updateColors();
    
    // localStorage.clear();
    // console.log("Cleared local storage!");
    console.log("localStorage length: " + JSON.stringify(localStorage).length);
    console.log("Number of characters, 2 bytes per character");

    $( ".up_level_text" ).text("Settings");
    // $( ".up_level_text" ).addClass("title");
    // $( ".up_level_text" ).addClass("heading");
    $( ".up_level_button" ).attr("href", "settings.html");
    // $( ".arrow" ).hide();

    $(".about-mailto-link").click(function( event ) {
        // event.preventDefault();
        event.stopPropagation();
    });
    onUILoaded();
    
});