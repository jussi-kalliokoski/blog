    title: Proposal - CSS Namespaces
    date: 2012/06/19
    tags: css namespaces style
    issue: 4

### CSS has no proper namespaces

The other day I was thinking about CSS and the practices that come with it. It's a good idea to have a lot of shared elements on your website; this means you can use a common CSS file for all pages and more specific stylesheets that load on top of that if necessary. However, as these specific styles may have overlap, you have to either keep these in separate files (and not concatenate them: an extra request) or have different classes on different pages to differentiate them from each other. That's quite tedious, considering the specificity might be a large chunk of CSS, prepending every selector with the class selector for that page is few extra precious bytes and keystrokes.

In all seriousness though, those bytes don't matter that much, gzipping fixes most of it. Extra requests can be expensive though, especially if they are equipped with cookies. But what matters more is that the lack of nice namespacing makes your CSS harder to create, organize and maintain. These are big bucks that we are talking here.

### CSS Preprocessors

One solution to the problem is to go with the class approach and use a CSS Preprocessor of your choice. That will help with the keystrokes. One option would be to standardize something like this, and to polyfill with preprocessors:

```css

h1, h2 {
	color: black;
}

@nest .main-page {
	h1 {
		color: red;
	}

	h2 {
		color: blue;
	}
}

```

Which would desugar to:

```css

h1, h2 {
	color: black;
}

.main-page h1 {
	color: red;
}

.main-page h2 {
	color: blue;
}

```

It might even not require a special @-instruction, which would mean you could do:

```css

.main-page {
	h1 {
		color: red;
	}

	h2 {
		color: blue;
	}

	background-color: cyan;
}

```

Desugaring to:

```css
.main-page {
	background-color: cyan;
}

.main-page h1 {
	color: red;
}

.main-page h2 {
	color: blue;
}
```

Or even:

```css

.main-page, .promo-page {
	h1 {
		color: red;
	}

	background-color: cyan;
}

```

Again, desugaring to:

```css

.main-page, .promo-page {
	background-color: cyan;
}

.main-page h1, .promo-page h1 {
	color: red;
}

```

### Adding proper namespaces

All of this is actually available already via CSS preprocessors such as [LESS](http://lesscss.org/) and [SASS](http://sass-lang.com/), it's very cool and I'd like to see this standardized, as CSS sugar is already being standardized (such as [CSS Variables](http://dev.w3.org/csswg/css-variables/)). Another idea I had is namespaces. I'm just going to use the ``` @namespace ``` instruction, which is unfortunately already taken by [another specification](http://www.w3.org/TR/css3-namespace/), dealing with I'm not sure what, really. If the idea catches wind, maybe someone can think of a better instruction name.

However, what I'd like to see is being able to have HTML like this:

```html

<link rel="stylesheet" namespaces="front-page" />

```

With CSS like this:

```css

body {
	background-color: blue;
}

@namespace front-page {
	body {
		background-color: cyan;
	}
}

```

The idea is that you could make namespaces in your CSS and they would be ignored unless you specifically want to use them. This would be pretty handy for having a single concatenated file with all of your CSS in it, then just have special cases that are required only on certain pages as namespaces, applied on-demand. What do you think?
