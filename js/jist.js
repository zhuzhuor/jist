/*jslint browser: true */
/*global marked: false, moment: false, $: false, URI: false, hljs: false, head: false */

"use strict";

var jist = jist || {};


function change_title(title_str) {
    if (title_str) {
        document.title = title_str + ' - jist.in';
    } else {
        document.title = 'jist.in';
    }
}


function show_message(msg) {
    $('#status').html('<small><em>' + msg + '</em></small>');
}


function show_error(err_msg) {
    change_title('Oops');
    $('#header').html('We got an error.');
    $('#content').html("<div class='text-center'>" + err_msg + "</div>");

    show_message(''); // clear status message
}


function format_time(created, updated) {
    created = moment(created).fromNow();
    updated = moment(updated).fromNow();
    return '<abbr title="created ' + created + ', and updated ' + updated + '">' +
           created + '</abbr>';
}


function display_header(desc, web_link, created, updated) {
/*
    if (desc && jist.tag && '[' + jist.tag + ']' === desc.slice(0, jist.tag.length + 2)) {
        desc = $.trim(desc.slice(jist.tag.length + 2));  // remove the tag in title
    }
*/
    var link_html = '<a href="' + web_link + '">';
    link_html += 'gist #' + jist.id + '</a>';
    if (jist.user) {
        link_html += ' &middot; ' + jist.user;
    }
    var time_html = format_time(created, updated);

    var header_html = desc;
    if (header_html === '') {
        header_html = link_html + ' &middot; ' + time_html;
    } else {
        header_html += '<span class="pull-right"><small>' +
                        link_html + ' &middot; ' + time_html +
                        '</small></span>';
    }

    $('#header').html(header_html);

    change_title(desc);
}


function append_markdown(markdown_content) {
    var s = document.createElement('div');
    s.innerHTML = marked(markdown_content);
    s.className = 'section';
    $('#content').append(s);
}


function append_html(html_content) {
    var i = document.createElement('iframe');
    i.seamless = 'seamless';
    // i.sandbox = 'allow-scripts';
    // i.srcdoc = html_content;
    i.scrolling = 'no';
    $('#content').append(i);

    i.frameborder = '0';
    i.marginwidth = '0';
    i.marginheight = '0';

    // http://goo.gl/ai6ZC
    var doc = i.document;
    if (i.contentWindow) {
        doc = i.contentWindow.document;
    }
    doc.open();
    doc.write(html_content);
    doc.close();
}


function add_css(css_content) {
    var s = document.createElement('style');
    s.type = 'text/css';
    // http://goo.gl/X8Qnr
    if (s.styleSheet){
        s.styleSheet.cssText = css_content;
    } else {
        s.appendChild(document.createTextNode(css_content));
    }
    $('head').append(s);
}


function add_js(js_content) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.appendChild(document.createTextNode(js_content));
    $('body').append(s);
}


function display_one_gist(gist_json) {
    if (typeof gist_json.data.message === 'string' && gist_json.data.message === 'Not Found') {
        show_error('Gist is not found.');
        return;
    }

    var desc = gist_json.data.description,
        gist_id = gist_json.data.id,
        link = gist_json.data.html_url,
        created = gist_json.data.created_at,
        updated = gist_json.data.updated_at,
        is_public = gist_json.data.public;
    console.assert(jist.id === gist_id);

    // first check the owner of the gist
    var new_link = null;
    if (jist.user && gist_json.data.user.login !== jist.user) {
        new_link = 'jist.in/' + gist_id;
        show_error('It seems this gist is not owned by <em>' + jist.user + '</em>.<br><br>' +
                   'Maybe you can try <a href="http://' + new_link + '">' + new_link + '</a>.');
        return;
    }

    // check the correctness of the given tag
    if (desc && jist.tag && desc.slice(0, jist.tag.length + 2) !== '[' + jist.tag + ']') {
        new_link = 'jist.in/' + gist_id;
        if (jist.user) {
            new_link = jist.user + '.' + new_link;
        }
        show_error('It seems this given tag <em>[' + jist.tag + ']</em> is not correct.<br><br>' +
                   'Maybe you can try <a href="http://' + new_link + '">' + new_link + '</a>.');
        return;
    }

    // add title, description, dates, and links
    display_header(desc, link, created, updated);

    var list_files = [], // list of .md and .html files
        disable_html = false,
        disable_js = false,
        custom_css = false,
        custom_js = false;

    // loop once to get file list
    var all_files = gist_json.data.files;
    var file_name;
    for (file_name in all_files) {
        if (all_files.hasOwnProperty(file_name)) {
            if (file_name.slice(-3) === '.md') {
                list_files.push(file_name);
            } else if (file_name.slice(-5) === '.html') {
                if (jist.user) {
                    list_files.push(file_name);
                } else {
                    disable_html = true;
                }
            } else if (file_name === 'custom.css') {
                custom_css = true;
            } else if (file_name === 'custom.js') {
                if (jist.user) {
                    custom_js = true;
                } else {
                    disable_js = true;
                }
            }
            show_message('Loading more content...');
        }
    }

    if (list_files.length === 0) {
        show_error('The content of this gist cannot be shown.<br><br>' +
                   'Please use <a href="http://daringfireball.net/projects/markdown/">Markdown</a> format for writing.');
        return;
    }

    if (custom_css) {
        add_css(all_files['custom.css'].content);
    }

    list_files.sort();
    var i;
    for (i = 0; i < list_files.length; i++) {
        if (i !== 0) {
            $('#content').append('<hr>');
        }
        if (list_files[i].slice(-3) === '.md') {
            append_markdown(all_files[list_files[i]].content);
        } else {
            append_html(all_files[list_files[i]].content);
        }
    }

    hljs.tabReplace = '    '; // replace tabs with 4 spaces
    hljs.initHighlighting();  // highlight source code
    MathJax.Hub.Typeset();  // display latex content

    // only track pages for public gists
    if (is_public) {
        head.js('/js/analytics.js');
    }

    if (custom_js && !disable_js) {
        add_js(all_files['custom.js'].content);
    }

    if ((disable_js || disable_html) && gist_json.data.user) {
        new_link = gist_json.data.user.login + '.jist.in/' + gist_id;
        show_message('Custom JavaScript and HTML are disallowed on this page. ' +
                     'You may instead try <a href="http://' + new_link + '">' + new_link + '</a>.');
    } else {
        show_message('');  // clear the message
    }
}


function display_gist_list(list_json) {
    $('#header').html(jist.user + "'s " + jist.tag + ' posts');

    var list_gists = list_json.data;
    var i, num_posts = 0;
    for (i = 0; i < list_gists.length; i++) {
        var gist = list_gists[i];
        if (gist.description && gist.description.slice(0, jist.tag.length + 2) === '[' + jist.tag + ']') {
            var title = $.trim(gist.description);
            var link = '<a href="http://' + jist.user + '.jist.in/' + jist.tag + '/' + gist.id + '">' + title + '</a>';
            var time = format_time(gist.created_at, gist.updated_at);
            var section = '<div class="section"><strong>' + link + '</strong>' + 
                          '<span class="pull-right">' + time + '</span></div>';
            $('#content').append(section);
            show_message('Loading more content...');

            num_posts++;
        }
    }

    if (!num_posts) {
        $('#content').html('<div class="text-center">It seems ' + jist.user + 
                           " doesn't have posts tagged with <em>" + jist.tag + '</em>.</div>');
    }

    change_title(jist.user + "'s " + jist.tag + ' posts');

    show_message('');  // clear message

    head.js('/js/analytics.js');  // this page should always be public
}


function display(user, tag, id) {
    if (user === 'anonymous') {  // will this ever happen?
        user = null;
    }
/*
    if (!id && user && !tag) {  // should consider both null and empty string
        tag = 'blog';
    }
*/
    // so no default tag for any users
    // fixed: default tag is achieved in index.html

    jist.user = user;
    jist.tag = tag;
    jist.id = id;

    if (id) {
        $.getJSON('https://api.github.com/gists/' + id + '?callback=?', display_one_gist);
        show_message('Accessing gist content...');
    } else if (user && tag) {
        $.getJSON('https://api.github.com/users/' + user + '/gists?callback=?', display_gist_list);
        show_message('Accessing content from GitHub...');
    } else {
        show_error("No gist ID or tag is provided.<br><br>This might be caused by invalid URL or DNS config.");
    }
}


function jist_main() {  // will be invoked in head.ready()
    if (jist.id !== null || (jist.user !== null && jist.tag !== null)) {
        // for the case that users modify the variables in jist.html
        // in order to use under their own domain names
        display(jist.user, jist.tag, jist.id);
        return;
    }

    var user = null,
        tag = null,
        id = null;

    var uri = URI(document.URL);

    var query = uri.query();
    if (query !== '') {
        var parsed_query = URI.parseQuery(query);
        user = parsed_query.user || null;
        tag = parsed_query.tag || null;
        id = parsed_query.id || null;

    } else if (uri.path() !== '/') {
        if (uri.directory() !== '/') {
            tag = uri.segment()[0];
        }
        if (uri.filename() !== '') {
            id = uri.filename();
        }
    }

    var hostname = uri.hostname();
    // var localhost = '9zlhb.xip.io';
    var localhost = '127.0.0.1.xip.io';
    var localhost_len = localhost.length;
    if (hostname.slice(-7) === 'jist.in') {
        // overwrite the user parameter from query
        if (hostname.slice(-8) === '.jist.in') {
            user = hostname.slice(0, -8);
        }
        display(user, tag, id);

    } else if (hostname.slice(-localhost_len) === localhost) {
        if (hostname.slice(-localhost_len - 1) === '.' + localhost) {
            user = hostname.slice(0, -localhost_len - 1);
        }
        display(user, tag, id);

    } else if (uri.scheme() === 'file' && (!id || !user)) {
        display(user, tag, id);

    } else if (uri.scheme() === 'http' || uri.scheme() === 'https') {
        if (id || user) {
            display(user, tag, id);

        } else {
            // look up TXT record of custom domain via jsondns.org
            $.getJSON('http://dig.jsondns.org/IN/' + hostname + '/TXT?callback=?', function(data) {
                var parsed_txt = URI.parseQuery(data.answer[0].rdata[0]);
                user = parsed_txt.user || null;
                tag = parsed_txt.tag || null;
                id = parsed_txt.id || null;

                display(user, tag, id);
            });
        }
    }
}
