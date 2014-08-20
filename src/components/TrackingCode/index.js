"use strict";

var path = require("path");
var fs = require("fs");
var React = require("react");

var trackingId = "UA-45425949-2";
var trackingCode = fs.readFileSync(path.join(__dirname, "template"), "utf8").replace("TRACKING_ID", trackingId);

module.exports = React.createClass({
    render: function () {
        return React.DOM.script({
            dangerouslySetInnerHTML: { "__html": trackingCode },
        });
    },
});
