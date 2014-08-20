"use strict";

var React = require("react");
var NavLink = require("../NavLink");

var links = [{
    key: "about",
    href: "/",
    tooltip: "About Me",
    caption: "About Me",
}, {
    key: "blog",
    href: "/blog/",
    tooltip: "My Blog",
    caption: "Blog",
}, {
    key: "github",
    href: "/;",
    tooltip: "My Github Profile",
    caption: "Github",
}, {
    key: "twitter",
    href: "/@",
    tooltip: "My Twitter Profile",
    caption: "Twitter",
}, {
    key: "google-plus",
    href: "/+",
    tooltip: "My Google+ Page",
    caption: "Google+",
}, {
    key: "linkedin",
    href: "/$",
    tooltip: "My LinkedIn Profile",
    caption: "LinkedIn",
}, {
    key: "music",
    href: "/q^",
    tooltip: "My Music",
    caption: "Music",
}];

module.exports = React.createClass({
    renderLinks: function () {
        return links.map(NavLink);
    },

    render: function () {
        return React.DOM.nav({ className: "Nav" },
            this.renderLinks(),
            React.DOM.div({ className: "Clear" })
        );
    },
});
