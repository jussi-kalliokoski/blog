"use strict";

var React = require("react");

module.exports = React.createClass({
    renderTags: function () {
        return this.props.tags.map(function renderTag (tag) {
            return React.DOM.li({
                key: tag,
                className: "TagList__tag",
            },
                React.DOM.a({ href: "/blog/tags/" + tag }, tag)
            );
        });
    },

    render: function () {
        return React.DOM.ul({ className: "TagList" },
            this.renderTags()
        );
    },
});
