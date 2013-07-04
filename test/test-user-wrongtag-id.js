var page = require('webpage').create();

var test_url = 'http://zhuzhuor.127.0.0.1.xip.io:8080/wrongtag/5794695';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            if (page.content.indexOf('not correct') === -1) {
                console.error("tag verification failed...");
                phantom.exit(2);
            } else {
                phantom.exit(0);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
