"use strict";

var path = require("path");
var gulp = require("gulp");
var consolidate = require("gulp-consolidate");
var rename = require("gulp-rename");
var through = require("through2");

module.exports = function () {
    var posts = [];

    return through.obj(function (post, encoding, callback) {
        this.push(post);

        if ( post.metadata ) {
            posts.push(post);
        }

        callback();
    }, function flush () {
        gulp.src(path.join(__dirname, "template.xml"))
            .pipe(consolidate("lodash", {
                package: require("../../../package.json"),
                posts: posts,
            }))
            .pipe(rename("rss.xml"))
            .on("data", this.push.bind(this))
            .on("error", this.emit.bind(this, "error"))
            .on("end", this.emit.bind(this, "end"));
    });
};
