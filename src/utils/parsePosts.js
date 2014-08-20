"use strict";

var path = require("path");
var through = require("through2");
var marked = require("marked");

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
});

function extractCite (post) {
    var content = post.content.toString();
    post.cite = content.substr(0, content.indexOf("</p>") + 4);
}

function convert (post) {
    post.content = new Buffer(marked(post.content.toString()));
}

function processTags (metadata) {
    metadata.tags = metadata.tags || "";
    metadata.tags = metadata.tags.split(/\s+/g);
}

function processDate (metadata) {
    if ( /^\d{4}-\d{2}-\d{2}$/.test(metadata.date) ) {
        // EST gives us 7AM/8AM Finnish time depending on ST.
        metadata.date += " EST";
    }

    metadata.date = new Date(metadata.date);
}

function extractMetadata (post) {
    while ( /^(    ([^:]+)\s*:\s*([^\n\r]+)[\n\r]+)/.test(post.content) ) {
        post.metadata[RegExp.$2] = RegExp.$3;
        post.content = post.content.substr(RegExp.$1.length);
    }
}

module.exports = function parsePost () {
    return through.obj(function processFile (file, encoding, callback) {
        var post = {
            id: path.basename(file.relative).replace(/\.md$/, ""),
            content: file.contents.toString(),
            metadata: {},
        };

        extractMetadata(post);
        processDate(post.metadata);
        processTags(post.metadata);
        convert(post);
        extractCite(post);

        this.push(post);
        callback();
    });
};
