# My Blog

This is the source code for [my blog](http://blog.avd.io). Its main ingredients are NodeJS and markdown, and all the posts are stored using the latter. Comments are exchangesd on issues. The build.js file creates a whole bunch of static files from the markdown posts, and these are served using Apache, although the only Apache feature used is RewriteEngine to serve .html files without the extension.
