"use strict";

var React = require("react");

module.exports = React.createClass({
    render: function () {
        return React.DOM.a({
            className: "NavLink NavLink--" + this.props.key,
            href: this.props.href,
            title: this.props.tooltip,
        },
            React.DOM.i({
                className: "NavLink__icon--" + this.props.key,
            }),
            React.DOM.label({},
                this.props.caption
            )
        );
    },
});
