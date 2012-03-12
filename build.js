#!/usr/bin/env node

var fs = require('fs');
var md = require('github-flavored-markdown').parse;

function _path () {
	return [].slice.call(arguments).map(function(a){return/^(.+)\/?$/.exec(a)[1]}).join('/');
}

function ls (path, r) {
	path	= path instanceof Array ? _path.apply(null, path) : path;
	path	= fs.readdirSync(path);
	if (r) {
		for (var i=0; i<path.length; i++) {
			if (!r.exec(path[i])) {
				path.splice(i--, 1);
			}
		}
	}
	return path;
}

function read (path, encoding) {
	path		= path instanceof Array ? _path.apply(null, path) : path;
	encoding	= encoding || 'UTF-8';
	return fs.readFileSync(path, encoding);
}

function save (path, data, encoding) {
	path		= path instanceof Array ? _path.apply(null, path) : path;
	encoding	= encoding || 'UTF-8';
	return fs.writeFileSync(path, data, encoding);
}

function simpleTemplate (template, data) {
	return templates[template].replace(/<%\s*\$([^\s%]+)\s*%>/g, function (t, i) {
		return data[i];
	});
}

function ARTICLE (p) {
	return p.articleHTML;
}

function Post (body, filename) {
	var l;
	while (l = /    ([^:]+)\s*:\s*([^\n\r]+)[\n\r]+/.exec(body)) {
		body = body.substr(l[0].length);
		this[l[1]] = l[2];
	}

	this.filename = filename;

	this.body = body;
	this.bodyHTML = md(body);

	this.tagList = this.tags.split(' ');
	this.tagsHTML = this.tagList.map(function (t) {
		return simpleTemplate('tag', {name: t});
	}).join('\n');

	comments.forEach((function (c) {
		if (({}).hasOwnProperty.call(this, c)) {
			this.commentsHTML += simpleTemplate('comments-' + c, this);
		}
	}).bind(this));

	this.articleHTML = simpleTemplate('article', this);

	posts.push(this);
}

Post.prototype = {
	commentsHTML: '',

	toString: function () {
		return this.date;
	},
};

var posts = [];
var templates = {};
var tags = {
	add: function (name, post) {
		if (!this.get(name)) {
			this.set(name, []);
			this.list.push(name);
		}

		this.get(name).push(post);
	},

	get: function (key) {
		return this['@' + key];
	},

	set: function (key, value) {
		return this['@' + key] = value;
	},

	list: [],
};
var comments = [];

ls('templates', /\.html$/i).forEach(function (p) {
	var name = p.substr(0, p.length - 5);
	templates[name] = read(['templates', p]);

	if (/^comments-.+$/.test(name)) {
		comments.push(name.substr(9));
	}
});

Post.prototype.navHeader = templates['nav-header'];

ls('posts').forEach(function (year) {
	ls(['posts', year], /\.md$/i).forEach(function (post) {
		new Post(read(['posts', year, post]), post.substr(0, post.length - 3));
	});
});

posts.sort();
posts.reverse();

save('public_html/index.html', simpleTemplate('index', {
	navHeader: templates['nav-header'],
	articlesHTML: posts.map(ARTICLE).join('\n'),
}));

posts.forEach(function (p) {
	p.tagList.forEach(function (t) {
		tags.add(t, p);
	});

	save(['public_html', 'posts', p.filename + '.html'], simpleTemplate('article-page', p));
});

tags.list.forEach(function (t) {
	save(['public_html', 'tags', t + '.html'], simpleTemplate('tag-page', {
		name: t,
		navHeader: templates['nav-header'],
		articlesHTML: tags.get(t).map(ARTICLE).join('\n'),
	}));
});
