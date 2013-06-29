(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-27264995-4', 'jist.in');
ga('send', 'pageview');


window.onerror = function(message, file, line) {
    var msg = file + '(' + line + '): ' + message;
    console.error(msg);
    ga('send', 'event', 'Errors', 'Unknown Error', msg, 1);
};
