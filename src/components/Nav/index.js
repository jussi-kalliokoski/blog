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
    href: "https://github.com/jussi-kalliokoski",
    tooltip: "My Github Profile",
    caption: "Github",
}, {
    key: "twitter",
    href: "https://twitter.com/quinnirill",
    tooltip: "My Twitter Profile",
    caption: "Twitter",
}, {
    key: "google-plus",
    href: "https://plus.google.com/110037879191283883410",
    tooltip: "My Google+ Page",
    caption: "Google+",
}, {
    key: "linkedin",
    href: "https://fi.linkedin.com/pub/jussi-kalliokoski/29/39b/948",
    tooltip: "My LinkedIn Profile",
    caption: "LinkedIn",
}, {
    key: "music",
    href: "https://soundcloud.com/quinnirill",
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
