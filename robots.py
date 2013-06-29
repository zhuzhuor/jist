# Copyright (C) 2013 Bo Zhu http://zhuzhu.org
# MIT License

# there should be no need to crawl the pages except index.html
# since these AJAX based pages are usually not SEO friendly

import webapp2

# http://goo.gl/gwU3I
allow_only_root = """User-agent: *
Allow: /index.html
Disallow: /0
Disallow: /1
Disallow: /2
Disallow: /3
Disallow: /4
Disallow: /5
Disallow: /6
Disallow: /7
Disallow: /8
Disallow: /9
Disallow: /a
Disallow: /b
Disallow: /c
Disallow: /d
Disallow: /e
Disallow: /f
Disallow: /j
Disallow: /*/
"""

disallow_all = """User-agent: *
Disallow: /
"""

robots_url = frozenset([
    'http://jist-in.appspot.com/robots.txt',
    'http://jist.in/robots.txt',
    'http://127.0.0.1.xip.io:8080/robots.txt'
])


class RobotsHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.headers['Cache-Control'] = 'public, max-age=172800'
        if self.request.url in robots_url:
            self.response.out.write(allow_only_root)
        else:
            self.response.out.write(disallow_all)


app = webapp2.WSGIApplication([
    ("/robots.txt", RobotsHandler)
], debug=True)
