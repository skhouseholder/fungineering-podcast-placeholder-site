$( document ).ready(function() {


    function format12Hour(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'p.m.' : 'a.m.';
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes;
		return strTime;
	}

    function updateClock() {
	    var now = new Date();
	    time = format12Hour(now);
	    $( ".menu_item.time" ).text(time);

	    // call this function again in 1000ms
	    setTimeout(updateClock, 1000);
	}

	updateClock();
});