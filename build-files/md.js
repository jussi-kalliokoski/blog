var parsemd = require('github-flavored-markdown').parse
var lowlite = require('lowlite')
var highlight = lowlite.highlight

function createLineNumbers (str) {
        var n = str.split('\n').length

	if (n === 1) return '';

	var w = ~~(n / 10) + 1

	return Array.apply(null, Array(n)).map(function (_, i) {
		var s = i + 1 + ''

		return Array(w - s.length + 1).join(' ') + s + ' '
	}).join('\n')
}

module.exports = function (str) {
	var r, i, p, s, m, n, l, b, c

	r = []
	i = p = 0
	s = ''

	while ((i = str.indexOf('```', p)) !== -1) {
		b = str[i-1] === '\n' || str[i-1] === '\r'

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

		c = highlight(m.substr(l.length).trim(), {
			lexer: l,
			aliases: lowlite.shorthands
		})

		if (b) {
			s +=	'<div class="code"><div class="ln">$' +
				r.length +
				';</div><code class="' + l + '">$' +
				(r.length + 1) + ';</code>' +
				'<br class="clear" /></div>'
			r.push(createLineNumbers(c), c)
		} else {
			s += '<code class="' + l + '">$' + r.length + ';</code>'
			r.push(c)
		}


		p = n + 3
	}

	s += str.substr(p)

	return parsemd(s).replace(/\$(\d+);/g, function (block, number) {
		return r[~~number]
	})
}
