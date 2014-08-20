"use strict";

var React = require("react");
var Page = require("../Page");
var TagList = require("../TagList");

module.exports = React.createClass({
    render: function () {
        return Page({
        },
            React.DOM.h1({}, "Tags"),
            TagList({ tags: this.props.tags })
        );
    },
});
