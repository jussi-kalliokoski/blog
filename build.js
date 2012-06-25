#!/usr/bin/env node

require('./build-files/files')

var md = require('./build-files/md')
var template = require('./build-files/templates')

function ARTICLE (p) {
	return p.firstParagraphHTML
}

function Post (body, filename) {
	var l
	while (l = /    ([^:]+)\s*:\s*([^\n\r]+)[\n\r]+/.exec(body)) {
		body = body.substr(l[0].length)
		this[l[1]] = l[2]
	}

	this.filename = filename

	this.body = body
	this.bodyHTML = md(body)
	this.firstParagraph = this.bodyHTML.split('</p>')[0] + '</p>'

	this.tagList = this.tags.split(' ')
	this.tagsHTML = this.tagList.map(function (t) {
		return template('tag', {name: t})
	}).join('\n')

	template.comments.forEach((function (c) {
		if (({}).hasOwnProperty.call(this, c)) {
			this.commentsHTML += template('comments-' + c, this)
		}
	}).bind(this))

	this.articleHTML = template('article', this)

	this.firstParagraphHTML = template('article-paragraph', this)

	posts.push(this)
}

Post.prototype = {
	commentsHTML: '',

	toString: function () {
		return this.date
	},
}

var posts = []
var tags = {
	add: function (name, post) {
		if (!this.get(name)) {
			this.set(name, [])
			this.list.push(name)
		}

		this.get(name).push(post)
	},

	get: function (key) {
		return this['@' + key]
	},

	set: function (key, value) {
		return this['@' + key] = value
	},

	list: [],
}

Post.prototype.navHeader = template('nav-header', {})

ls('posts').forEach(function (year) {
	ls(['posts', year], /\.md$/i).forEach(function (post) {
		new Post(read(['posts', year, post]), post.substr(0, post.length - 3))
	})
})

posts.sort()
posts.reverse()

save('public_html/index.html', template('index', {
	navHeader: Post.prototype.navHeader,
	articlesHTML: posts.map(ARTICLE).join('\n'),
}))

posts.forEach(function (p) {
	p.tagList.forEach(function (t) {
		tags.add(t, p)
	})

	save(['public_html', 'posts', p.filename + '.html'],
		template('article-page', p))
})

tags.list.forEach(function (t) {
	save(['public_html', 'tags', t + '.html'], template('tag-page', {
		name: t,
		navHeader: Post.prototype.navHeader,
		articlesHTML: tags.get(t).map(ARTICLE).join('\n'),
	}))
})
