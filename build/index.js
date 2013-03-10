#!/usr/bin/env node

require('./files')

var md = require('./md')
var template = require('./templates')
var less = require('less').render

function dateToXMLDate (date) {
	date = String(date).split(' ')
	date[0] += ','
	return date.join(' ')
}

function ARTICLE (p) {
	return p.firstParagraphHTML
}

function ARTICLERSS (p) {
	return p.rss
}

function Post (body, filename) {
	var l
	while (l = /^    ([^:]+)\s*:\s*([^\n\r]+)[\n\r]+/.exec(body)) {
		body = body.substr(l[0].length)
		this[l[1]] = l[2]
	}

	this.filename = filename
	this.link = 'http://blog.avd.io/posts/' + this.filename

	if (this.date) {
		this.pubDate = this.date.split('/')
		this.pubDate = new Date(
			~~this.pubDate[0],
			~~this.pubDate[1],
			~~this.pubDate[2]
		)
	} else {
		this.pubDate = new Date()
	}

	this.pubDate = dateToXMLDate(this.pubDate)

	this.datetime = this.date.replace(/\//g, '-')

	this.body = body
	this.bodyHTML = md(body)
	this.bodyXML = md(body, false)
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

	this.rss = template('article-rss', this)

	posts.push(this)
}

Post.prototype = {
	commentsHTML: '',
	author: 'Jussi Kalliokoski',
	language: 'en',

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
	author: 'Jussi Kalliokoski',
	title: 'Jussi Kalliokoski\'s Blog',
	date: dateToXMLDate(new Date()),
	language: 'en',
	navHeader: Post.prototype.navHeader,
	articlesHTML: posts.map(ARTICLE).join('\n'),
}))

save('public_html/rss.xml', template('rss', {
	author: 'Jussi Kalliokoski',
	title: 'Jussi Kalliokoski\'s Blog',
	link: 'http://blog.avd.io/rss.xml',
	language: 'en',
	date: dateToXMLDate(new Date()),
	navHeader: Post.prototype.navHeader,
	items: posts.map(ARTICLERSS).join('\n'),
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
		author: 'Jussi Kalliokoski',
		title: 'Jussi Kalliokoski\'s Blog',
		date: dateToXMLDate(new Date()),
		name: t,
		navHeader: Post.prototype.navHeader,
		articlesHTML: tags.get(t).map(ARTICLE).join('\n'),
	}))
})

try {
	require('fs').mkdirSync('public_html/css')
} catch (ignore) {}

ls('stylesheets').forEach(function (sheet) {
	less(read(['stylesheets', sheet]), function (e, css) {
		save(['public_html', 'css', sheet.replace(/\.less$/, '.css')], css)
	})
})
