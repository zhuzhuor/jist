/*
 * Copyright (C) 2013 Bo Zhu http://zhuzhu.org
 * MIT License
 */

"use strict";
/*global chrome: false */


var re = /^https:\/\/gist\.github\.com\/([^\/]+)\/([^\/]+)/im;


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && re.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    var user = tab.url.match(re)[1];
    var id = tab.url.match(re)[2];
    chrome.tabs.update(tab.id, {url: 'http://' + user + '.jist.in/' + id}); 
});
