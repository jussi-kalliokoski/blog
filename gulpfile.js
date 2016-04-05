"use strict";

var _ = require("lodash");
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var resolver = require("gulp-resolver");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var through = require("through2");
var merge = require("event-stream").merge;
var File = require("vinyl");
var React = require("react");
var parsePosts = require("./src/utils/parsePosts");
var Post = require("./src/components/Post");
var TagPage = require("./src/components/TagPage");
var TagIndexPage = require("./src/components/TagIndexPage");
var PostIndexPage = require("./src/components/PostIndexPage");
var MiscellaneousPage = require("./src/components/MiscellaneousPage");
var createRssFeed = require("./src/tasks/createRssFeed");
var iconfonts = require("./src/tasks/iconfonts");

var files = [
    "./src/**/*.js",
    "./gulpfile.js",
];

function handleError (error) {
    throw error;
}

function filterPosts () {
    return through.obj(function (file, encoding, callback) {
        if ( !file.metadata ) {
            this.push(file);
        }

        callback();
    });
}

function sortPosts () {
    var posts = [];

    return through.obj(function collectPost (post, encoding, callback) {
        posts.push(post);
        callback();
    }, function flush () {
        _.sortBy(posts, function (post) {
            return post.metadata.date.toISOString();
        }).reverse().forEach(function (post) {
            this.push(post);
        }.bind(this));

        this.emit("end");
    });
}

function createPage (path, component) {
    var content = "<!DOCTYPE html>" + React.renderComponentToStaticMarkup(component);

    return new File({
        path: path,
        contents: new Buffer(content),
    });
}

function buildPosts () {
    return through.obj(function buildPost (post, encoding, callback) {
        this.push(post);

        if ( !post.metadata ) {
            callback();
            return;
        }

        var component = Post(post);
        this.push(createPage("blog/posts/" + post.id + "/index.html", component));
        callback();
    });
}

function buildTagPages () {
    var postsByTag = {};

    return through.obj(function collectTags (post, encoding, callback) {
        this.push(post);

        if ( post.metadata ) {
            _.each(post.metadata.tags, function associatePostToTag (tag) {
                postsByTag["tag:" + tag] = postsByTag["tag:" + tag] || [];
                postsByTag["tag:" + tag].push(post);
            });
        }

        callback();

    }, function flush () {
        var tags = _.uniq(_.keys(postsByTag).sort()).map(function (tag) {
            return tag.substr(4);
        });

        tags.forEach(function buildTagPage (tag) {
            var component = TagPage({
                tag: tag,
                posts: postsByTag["tag:" + tag],
            });

            this.push(createPage("blog/tags/" + tag + "/index.html", component));
        }.bind(this));

        var component = TagIndexPage({
            tags: tags,
        });

        this.push(createPage("blog/tags/index.html", component));

        this.emit("end");
    });
}

function buildPostIndexPage () {
    var posts = [];

    return through.obj(function collectPosts (post, encoding, callback) {
        this.push(post);

        if ( post.metadata ) {
            posts.push(post);
        }

        callback();

    }, function flush () {
        var component = PostIndexPage({
            posts: posts,
        });

        this.push(createPage("blog/index.html", component));

        this.emit("end");
    });
}

function buildMiscellaneousPages () {
    return gulp.src("./posts/index.md")
        .pipe(parsePosts())
        .pipe(through.obj(function buildMiscellaneousPage (post, encoding, callback) {
            var component = MiscellaneousPage(post);
            this.push(createPage(post.id, component));
        }))
        .pipe(rename({ extname: ".html" }));
}

gulp.task("jscs", function jscsTask () {
    return gulp.src(files)
        .pipe(jscs("./.jscs.json"))
        .on("error", handleError);
});

gulp.task("jshint", function jshintTask () {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
        .on("error", handleError);
});

gulp.task("clean", function cleanBuild () {
    return gulp.src("./public", { read: false })
        .pipe(clean());
});

gulp.task("iconfonts", ["clean"], function buildIconFonts () {
    return iconfonts()
        .pipe(gulp.dest("./public/assets/fonts/"));
});

gulp.task("stylesheets", ["iconfonts"], function buildStylesheets () {
    return gulp.src([
        "./src/stylesheets/reset.styl",
        "./src/stylesheets/prism-thayer.styl",
        "./public/assets/fonts/*.styl",
        "./src/components/*/index.styl",
    ])
        .pipe(stylus())
        .pipe(concat("jussin.css"))
        .pipe(autoprefixer())
        .pipe(resolver.css({ assetsDir: "./public/assets/" }))
        .pipe(gulp.dest("./public/assets/css/"));
});

function generatePosts () {
    return gulp.src("./posts/*/*.md")
        .pipe(parsePosts())
        .pipe(sortPosts())
        .pipe(buildPosts())
        .pipe(buildTagPages())
        .pipe(buildPostIndexPage())
        .pipe(createRssFeed())
        .pipe(filterPosts());
}

gulp.task("build", ["stylesheets"], function buildTask () {
    return merge(generatePosts(), buildMiscellaneousPages())
        .pipe(resolver.html({ assetsDir: "./public/assets/" }))
        .pipe(gulp.dest("./public/"));
});

gulp.task("test", ["jscs", "jshint"]);
