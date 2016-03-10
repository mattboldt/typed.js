$(function () {
	$('#oldTyped').oldTyped({
        strings: ['Typed.js is a <strong>jQuery</strong> plugin.', 'It <em>types</em> out sentences.', 'And then deletes them.', 'Try it out!'],
        typeSpeed: 30,
        backDelay: 500,
        loop: false,
        contentType: 'html',
        // defaults to false for infinite loop
        loopCount: false
    });

    $('#newTyped').typed({
        strings: ['Typed.js is a <strong>jQuery</strong> plugin.', 'It <em>types</em> out sentences.', 'And then deletes them.', 'Try it out!'],
        typeSpeed: 30,
        backDelay: 500,
        loop: false,
        contentType: 'html',
        // defaults to false for infinite loop
        loopCount: false
    });

	var firstCall = true;

    $('#stopBtn').on('click', function(){
    	if (firstCall) {
	    	$('#oldTyped').oldTyped({
	    		strings: ['Looks like you started a new typing animation!', 'This should display nicely now.'],
	    		typeSpeed: 10,
	    		contentType: 'text'
	    	});
	    	$('#newTyped').typed({
	    		strings: ['Looks like you started a new typing animation!', 'This should display nicely now.', 'The old brother above me will not display the new message.', 'No problem I got you covered!'],
	    		typeSpeed: 10,
	    		contentType: 'text'
	    	});
	    	firstCall = false;
	    } else {
	    	$('#oldTyped').oldTyped({
	    		strings: ['Typed.js is a <strong>jQuery</strong> plugin.', 'It <em>types</em> out sentences.', 'And then deletes them.', 'Try it out!'],
	    	});
	    	$('#newTyped').typed({
	    		strings: ['Typed.js is a <strong>jQuery</strong> plugin.', 'It <em>types</em> out sentences.', 'And then deletes them.', 'Try it out!']
	    	});
	    	firstCall = true;
	    }
    });
});