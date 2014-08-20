"use strict";

var React = require("react");
var TagList = require("../TagList");

module.exports = React.createClass({
    getPostUrl: function () {
        return "/blog/posts/" + this.props.post.id;
    },

    render: function () {
        return React.DOM.article({ itemScope: "" },
            React.DOM.h2({},
                React.DOM.a({ href: this.getPostUrl() }, this.props.post.metadata.title)
            ),
            React.DOM.blockquote({
                cite: this.getPostUrl(),
                dangerouslySetInnerHTML: { "__html": this.props.post.cite },
            }),
            React.DOM.p({},
                React.DOM.a({
                    href: this.getPostUrl(),
                }, "Read more...")
            ),
            React.DOM.p({}, "Posted " + this.props.post.metadata.date.toISOString() + "."),
            TagList({ tags: this.props.post.metadata.tags })
        );
    },
});
