var handlebars = require('handlebars')

var templates = {}
var comments = []

ls('templates', /\.html$/i).forEach(function (p) {
	var name = p.substr(0, p.length - 5)
	templates[name] = handlebars.compile(read(['templates', p]))

	if (/^comments-.+$/.test(name)) {
		comments.push(name.substr(9))
	}
})

module.exports = function (name, context) {
	return templates[name](context)
}

module.exports.comments = comments
