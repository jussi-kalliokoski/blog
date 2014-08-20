"use strict";

var React = require("react");
var Nav = require("../Nav");
var MainView = require("../MainView");
var TrackingCode = require("../TrackingCode");

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            lang: "en_US",
            title: require("../../../package.json").title,
            author: require("../../../package.json").author,
            description: require("../../../package.json").description,
            keywords: require("../../../package.json").keywords,
        };
    },

    render: function () {
        return React.DOM.html({ lang: this.props.lang, className: "Page" },
            React.DOM.head({},
                React.DOM.meta({ charSet: "UTF-8" }),
                React.DOM.meta({ httpEquiv: "Content-Type", content: "text/html; charset=UTF-8" }),
                React.DOM.meta({ httpEquiv: "X-UA-Compatible", content: "IE=Edge,chrome=1" }),
                React.DOM.title({}, this.props.title),
                React.DOM.meta({ name: "author", content: this.props.author }),
                React.DOM.meta({ name: "description", content: this.props.description }),
                React.DOM.meta({ name: "keywords", content: this.props.keywords.join() }),
                React.DOM.meta({ name: "viewport", content: "width=device-width" }),
                React.DOM.link({ rel: "alternate", type: "application/rss+xml", title: "/rss.xml", href: "/rss.xml" }),
                TrackingCode({}),
                React.DOM.link({ rel: "stylesheet", href: "/assets/css/jussin.css" })
            ),
            React.DOM.body({},
                Nav({}),
                MainView({}, this.props.children),
                React.DOM.script({ src: "//cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.min.js", async: "" })
            )
        );
    },
});
