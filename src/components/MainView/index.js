"use strict";

var React = require("react");

module.exports = React.createClass({
    render: function () {
        return React.DOM.div({
            className: "MainView",
            role: "main",
        }, this.props.children);
    },
});
