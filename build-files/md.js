var parsemd = require('github-flavored-markdown').parse
var lowlite = require('lowlite')
var highlight = lowlite.highlight

module.exports = function (str) {
	var r, i, p, s, m, n, l, b

	r = []
	i = p = 0
	s = ''

	while ((i = str.indexOf('```', p)) !== -1) {
		b = str[i-1] === '\n' || str[i-1] === '\r' ? 'block ' : ''

		s += str.substr(p, i - p)

		n = str.indexOf('```', i + 3)
		if (n === -1) {
			p += str.substr(i)
			break
		}

		m = str.substr(i + 3, n - i - 3)

		l = /^\w+/.exec(m)
		l = l && l[0]
		if (!lowlite.lexers[l]) l = ''

		s += '<code class="' + b + l + '">$' + r.length + ';</code>'

		r.push(highlight(m.substr(l.length).trim(), {
			lexer: l,
			aliases: lowlite.shorthands
		}))

		p = n + 3
	}

	s += str.substr(p)

	return parsemd(s).replace(/\$(\d+);/g, function (block, number) {
		return r[~~number]
	})
}
