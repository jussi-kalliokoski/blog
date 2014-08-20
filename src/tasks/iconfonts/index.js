"use strict";

var gulp = require("gulp");
var iconfont = require("gulp-iconfont");
var consolidate = require("gulp-consolidate");
var rename = require("gulp-rename");
var rev = require("gulp-rev");
var through = require("through2");
var path = require("path");
var svgPath = require("svg-path");

function scale (factor) {
    return through.obj(function (file, encoding, callback) {
        var svg = file.contents.toString();
        var width = parseFloat(/width="([^"]+)"/.exec(svg)[1]);
        var height = parseFloat(/height="([^"]+)"/.exec(svg)[1]);

        width *= factor;
        height *= factor;

        svg = svg.replace(/width="[^"]+"/, "width=\"" + width + "\"");
        svg = svg.replace(/height="[^"]+"/, "height=\"" + height + "\"");
        svg = svg.replace(/d="([^"]+)"/g, function (ignore, d) {
            var path = svgPath(d);
            path.scale(factor, factor);
            return "d=\"" + path.toString() + "\"";
        });

        file.contents = new Buffer(svg);
        this.push(file);
        callback();
    });
}

function generateStylesheets (fontName, stream) {
    var output = through.obj();

    stream.on("data", function (file) {
        output.push(file);
    });

    stream.on("codepoints", function (codepoints) {
        gulp.src(path.join(__dirname, "template.styl"))
            .pipe(consolidate("lodash", {
                glyphs: codepoints,
                fontName: fontName,
            }))
            .pipe(rename(fontName + ".styl"))
            .pipe(output);
    });

    return output.pipe(rev());
}

module.exports = function buildIconFonts () {
    var FONT_NAME = "icons";

    return generateStylesheets(FONT_NAME, gulp.src("./src/components/*/icons/*.svg")
        .pipe(scale(32))
        .pipe(iconfont({
            fontName: FONT_NAME,
            normalize: true,
        }))
    );
};
