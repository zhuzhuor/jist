# jist.in

[jist.in](http://jist.in) is a JavaScript experiment/showcase that renders the contents of GitHub Gists entirely by client-side JavaScript.

The idea originates from [gist.io](http://gist.io) and [bl.ocks.org](http://bl.ocks.org).

## Usage

### URL Patterns

* `http://jist.in/5855373` displays the contents of the gist with id `5855373`
* `http://username.jist.in/5855373` verifies the owner of the gist
* `http://username.jist.in/tagname/` shows a list about all gists with `[tagname]` as the beginnings of gist descriptions
* `http://username.jist.in/` will be redirected to `http://username.jist.in/blog/`

### Local Usage

You can download the source code and open it from local file paths without web server support.

* `file:///path/jist.html?id=5855373` is the same as `http://jist.in/5855373`
* `file:///path/jist.html?user=username&tag=blog` displays user's blog post list

### Markdown Files

You can have multiple Markdown files in one gist. They are sorted according to their file names, so you can add numeric prefixes to file names to make them displayed in order.

### Custom CSS

Add a CSS file `custom.css`, and it will be automatically append to head before gist contents are loaded.

### Custom JavaScript

*Please use at your own risk.*

The custom JavaScript only works on users' sub-domains, such as `http://zhuzhuor.jist.in/5855373`.

Add a JavaScript file `custom.js`, and it will be executed after other files are loaded.

### HTML Files

*Please use at your own risk as well.*

The HTML files are put into seamless iframes, and they are sorted together with Markdown files.

HTML files are also only parsed under users' sub-domains.

### LaTeX

Enclose your LaTeX contents by `$...$` and they will be processed automatically.

### Custom Domain Names

1. Change the CNAME setting of your custom domain to `cname.jist.in`.
2. Modify the TXT record of your custom domain to the forms like `id=5855373` or `user=username&tag=blog`.

The corresponding DNS records will be automatically retrieved via [jsondns](http://json.org), and the targeted gist contents will be displayed accordingly.

This barely serves as an experiment. Please do not rely on it for long-term usage, since this functionality requires a self-hosted reverse proxy server (currently running on a tiny VPS host of $15/year).

It is recommended to upload jist.html and necessary files to your own servers, such as [AWS S3](http://aws.amazon.com/s3/) or [GitHub Pages](http://pages.github.com/). You can modify the variables in the header of jist.html to pass the jsondns look-up process.


## Disadvantage

The biggest drawback of this AJAX-based web app might be it is bad for SEO, which means the contents of web pages may not be indexed by search engines.

Unless you want to hide some of your contents from search engines, it is not recommended to use jist.in as your own websites, including personal blogs.


## Dependencies

* [Bootswatch Readable](http://bootswatch.com/readable/) -- CSS style for legibility
* [head.js](http://headjs.com/)  -- loading JavaScript libs faster
* [marked.js](https://github.com/chjj/marked)  -- parsing Markdown files
* [URI.js](http://medialize.github.io/URI.js/)  -- processing URIs
* [moment.js](http://momentjs.com/)  -- friendly time strings
* [highlight.js](http://softwaremaniacs.org/soft/highlight/en/)  -- highlighting code blocks
* [MathJax.js](http://www.mathjax.org/)  -- displaying LaTeX formulas
* [PhantomJS](http://phantomjs.org/)  -- headless tests

## License

MIT