var fs = require('fs');

function _path () {
	return [].slice.call(arguments).map(function (a) {
		return/^(.+)\/?$/.exec(a)[1]
	}).join('/')
}

function ls (path, r) {
	path = path instanceof Array ? _path.apply(null, path) : path
	path = fs.readdirSync(path)

	if (r) {
		for (var i=0; i<path.length; i++) {
			if (!r.exec(path[i])) {
				path.splice(i--, 1)
			}
		}
	}

	return path
}

function read (path, encoding) {
	path = path instanceof Array ? _path.apply(null, path) : path
	encoding = encoding || 'utf8'

	return fs.readFileSync(path, encoding)
}

function save (path, data, encoding) {
	path = path instanceof Array ? _path.apply(null, path) : path
	encoding = encoding || 'utf8'

	return fs.writeFileSync(path, data, encoding)
}

global.ls = ls
global.read = read
global.save = save
