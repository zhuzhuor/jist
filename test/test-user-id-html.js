var page = require('webpage').create();

var test_url = 'http://mbostock.127.0.0.1.xip.io:8080/1353700';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            if (page.content.indexOf('iframe') === -1) {
                console.error("custom html isn't loaded well...");
                phantom.exit(2);
            } else {
                phantom.exit(0);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
