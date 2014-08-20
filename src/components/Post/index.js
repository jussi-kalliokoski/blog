"use strict";

var React = require("react");
var Page = require("../Page");
var TagList = require("../TagList");

module.exports = React.createClass({
    render: function () {
        return Page({
            title: this.props.metadata.title + " :: " + require("../../../package.json").title,
            keywords: this.props.metadata.tags,
        },
            React.DOM.article({ itemScope: "" },
                React.DOM.h1({}, this.props.metadata.title),
                React.DOM.div({ dangerouslySetInnerHTML: { "__html": this.props.content } }),
                React.DOM.p({}, "Posted " + this.props.metadata.date.toISOString() + "."),
                TagList({ tags: this.props.metadata.tags })
            )
        );
    },
});
