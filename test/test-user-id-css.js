var page = require('webpage').create();

var test_url = 'http://zhuzhuor.127.0.0.1.xip.io:8080/5855664';

page.open(test_url, function(status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        console.log('Wait for 10s for AJAX...');
        setTimeout(function() {
            var color = page.evaluate(function() {
                return $('body').css('background-color');
            });
            console.log('background color: ' + color);
            
            if (color !== 'rgb(39, 43, 48)') {
                console.error("custom css isn't loaded well...");
                phantom.exit(2);
            } else {
                phantom.exit(0);
            }
        }, 10000);  // wait for 10s for AJAX
    }
});
