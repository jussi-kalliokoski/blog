"use strict";

var React = require("react");
var Page = require("../Page");
var Cite = require("../Cite");

module.exports = React.createClass({
    renderPosts: function () {
        return this.props.posts.map(function renderPost (post) {
            return Cite({
                post: post,
                key: post.id,
            });
        });
    },

    render: function () {
        return Page({
        },
            React.DOM.h1({}, "Jussi Kalliokoski's Blog"),
            this.renderPosts()
        );
    },
});
