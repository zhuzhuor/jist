var page = require('webpage').create();

var test_url = 'http://cname.127.0.0.1.xip.io:8080/jist.html?id=5843799&user=zhuzhuor';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            if (page.content.indexOf('not owned') === -1) {
                console.error("username in domain name should overwrite the one in queries");
                phantom.exit(2);
            } else {
                phantom.exit(0);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
