document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        left();
    }
    else if(event.keyCode == 39) {
        right();
    }
	else if(event.keyCode == 38) {
        up();
    }
	else if(event.keyCode == 40) {
        down();
    }
	else if(event.keyCode == 78) {
		if(!moveLock)
		{
			init();
		}
    }
});