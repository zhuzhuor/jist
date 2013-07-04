var page = require('webpage').create();

var test_url = 'http://127.0.0.1.xip.io:8080/5843799';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            var val = page.evaluate(function() {
                if (typeof for_test !== 'undefined') {
                    return for_test;
                }
                return 'undefined';
            });
            
            if (val !== true) {
                phantom.exit(0);
            } else {
                console.error("custom js shouldn't be loaded in anonymous pages");
                phantom.exit(2);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
