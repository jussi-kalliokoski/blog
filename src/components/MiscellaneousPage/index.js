"use strict";

var React = require("react");
var Page = require("../Page");

module.exports = React.createClass({
    render: function () {
        return Page({},
            React.DOM.h1({}, this.props.metadata.title),
            React.DOM.div({
                dangerouslySetInnerHTML: { "__html": this.props.content },
            })
        );
    },
});
