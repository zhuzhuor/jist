var page = require('webpage').create();

var test_url = 'http://cname.127.0.0.1.xip.io:8080/5855373';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            if (page.content.indexOf('Galois') !== -1) {
                console.error('Permission check went wrong...');
                phantom.exit(2);
            } else {
                phantom.exit(0);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
