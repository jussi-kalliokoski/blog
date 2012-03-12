    title: HTML5 as a gaming platform
    date: 2012/03/12
    tags: html5 games mandreel emscripten nacl
    issue: 2

### Hype The Markup Language

HTML5 is the new shiny thing, and there's a lot of evangelism going on about it. The improvement process is rapid (too much so? that's another blog post), and browser vendors are trying to get the game makers in bed with them, some with means of money, some with fame. The web is evolving, so is the documentation of related technologies, but it's hard to keep up with everything that's going on, and developer tools for JS are still a bit in their infancy. However, HTML5 games keep popping out like mushrooms on rain. Not.

### Games so far

So quite recently we've seen a few big name games published, as a collaboration between a browser vendor and a known game maker. The first one was no other than Finland's own Rovio, with [Angry Birds for Chrome](http://chrome.angrybirds.com/). You can guess which company collaborated on this. Let's look at this more closely, it's quite interesting.

When it came out, it aroused a lot of debate and controversy, because of two things: it was only for Chrome via Chrome Web Store (it's now available for other browsers as well) and it used Flash. Only for Chrome? Not surprising, they were in the middle of a big marketing campaign for Chrome Web Store, but business reasons aren't usually presented to angry developers, and instead we were given technical reasons resolved since then. Ok, let's not care about that. What about this Flash thing? What happened to HTML5 games killing Flash? A browser vendor is supporting in making a game that requires Flash for sound while touting on about plugin-free web. Again, a lot of angry people around. We developers are sensitive about other people's choices of technology, and like to stick our noses in other people's businesses, because having a business is evil.

### Hanging Flash

Another similar occasion was when Microsoft released [Cut the Rope](http://www.cuttherope.ie/) with ZeptoLabs. Like Angry Birds, this was a sure bet, the game already had a lot of users on mobile devices. Microsoft helped to make the game to evangelize the web and the upcoming IE10. Unlike Angry Birds, this game works in other browsers, but with one funny aspect: other browsers require Flash for the audio (just like Angry Birds, except that IE does not have this requirement). This was claimed to be because audio performance was claimed to be so unpredictable on other browsers. A funny thing to say, since IE doesn't have an advanced audio API like Chrome and Firefox do, both of which allow low-level audio access, so essentially you can do much less with IE's audio tag than you can do with these APIs, but let's play. Of course, a lot of people didn't find this funny at all, and hatemail followed.

### Mobile Games

So what's in common with these two games? They're both originally mobile games. Even more, they're *casual* games, as opposed to complex games such as Mass Effect, Alan Wake, and other blockbusters these days. The development process and technologies needed are MUCH simpler, cheaper and faster. Let's think about this for a while. Even with native stack, you need to optimize a lot to make these games look good at least on the hardcore gamer's computer. Also, when you're making native games like this, you have a vast amount of resources to tap into, there's a lot of data for learning, existing game engine libraries, IDEs and whatnot, and it's still a very resource-consuming process.

### Moving the Stack

So, you're almost finished with your big game that took years in the making, now you're thinking of reach and all those other boring marketing things. Your friends are talking about this cool new thing called HTML5 and games made for it. You start thinking: "ok, we've got a whole world of people that already have a browser out there, should we tap into this?" The answer is obvious: YES. So how do we do that? Should we start the game over in HTML5, you ask of your programmers: "HELL NO". Well then, let's port the game to HTML5. Let's do a few calculations, we need to hire extremely capable web developers, who are up to date with the the latest of the cutting edge technologies. Riiight. Let's hire people to hire them, looks like there aren't that many of them. Oh, the recruiting consultants say this is going to cost about the same as the original game and take twice as long. OK, this won't fly let's explore alternatives, and ask the community. Nice, there's this new thing called [emscripten](https://github.com/kripken/emscripten) that automatically ports your native code to JavaScript, awesome, let's try that!

### A few days later

OK, it looks like it's a lot more work than we'd anticipated and we still need to hire JS experts. In addition, the APIs (let's be optimistic, OpenGL and OpenAL) we're using don't exist in HTML5, so we need to create some kind of interfaces for them. Oh man. It also seems like the performance isn't that nice even on our best testing machine. OK, an easy port for free didn't work out so well, what else is out there?

### Mandreel

Earlier today, I [tweeted](https://twitter.com/#!/quinnirill/status/179111177794756608) about [mandreel](http://www.mandreel.com/), and it sparked up a nice discussion. mandreel is a service, that takes your source code and makes a web version of it. These guys seem to be doing a remarkable job, and their portfolio is quite impressive with games that you don't really see hand coded to HTML5. They say their prices are relatively low and the references say that they usually finish the job ahead of schedule. Nice. Seems like a very viable option for a game studio, hire external experts to do the porting, quick and cheap. So, what's wrong with this then? Well, the first thing we web developers don't like is that it's not open source nor free. I personally understand this completely, they've put a lot of work behind this and people are willing to pay big bucks for it. Putting it out there for free and selling just the expert service is a whole different business model, and if you don't want to go with that, fine.

That said, I'd be interested in seeing these guys write a few blog posts of the difficulties they've experienced and how they worked around them, sort of like giving back to the community. To be fair, an adapted quote that fits here (MM7): "I lost it" - "You never had it".

However, another thing that bothers web developers is that it's using flash as a fallback for example for audio. I personally find this argument a bit boring, HTML5 may be ready for a lot of stuff, but audio isn't one of them. If you want elaboration on that, you should probably read [this](http://ofmlabs.org/articles/dublin.html).

### Salt and Pepper

So, is there another way, to make the porting as easy as it porting C to another platform is, avoiding the whole process of hiring external services, etc? There is, it's called NaCl. NaCl is a platform developed by Google on top of their Pepper API in Chrome. It comes with an SDK library that allows you to directly use a lot of the native APIs as you normally would. Audio APIs, OpenGL, the most important aspects are supported. Another important aspect is that it's sandboxed native code. The code is supposedly secure (not doing anything harmful to your computer) and only a bit slower than normal native code. One comparable platform is the JVM. So it sort of allows you to run native code on the web. Except that Chrome is not the web and other browser vendors are unlikely to spend resources on getting an implementation of NaCl in the near future. However, I don't see much wrong with this. Technologically, NaCl is quite impressive, and I can see it as a very tempting solution for game studios. Minimal porting cost in exchange for a big userbase, cross platform and all that. What I find disturbing that it's going to cause lock-in. Obviously games using NaCl will be targeted for Chrome only. While this is not necessary evil in intentions, lock-in is inevitable. Imagine you're an average user, you go about your business, and buy a few games. They run only in Chrome. Ok, later on you want to go back to using Firefox, but it becomes more and more a productivity fail to be using multiple browsers if you're a casual user. This is somewhat similar to some Linux users giving up on Linux, because they have games on Windows.

The funny paradigm here is that games using NaCl are tagged with the HTML5 buzzword. I wonder if these people are intentionally trying to wake up the trolls. To see examples of NaCl in use, see [this](http://www.html5gamedevs.com/tag/nacl/). The Chrome Web Store also has a lot of them.

### The Silver Lining

I'm an optimist by nature, and I really can't help but see the silver lining here. Nevermind it's easier to port games to NaCl than HTML5 and it's always going to be, the interesting thing here is that it's finally possible to do so. The fact that you can use a platform as a compilation target for games says a lot about how much the platform has evolved recently and is evoling all the time. The web was never meant for making games, it was meant for making hypertext documents. That doesn't reduce the fact that game making for the web platform is extremely hot. We're maturing the web, and frameworks like [three.js](https://github.com/mrdoob/three.js) and [CubicVR](http://www.cubicvr.org/) pave the way forward. We still need better tooling, documentation and communities, but if you build it, they will come.

### Disclaimer

A few statements to avoid trolls. No, I do not think JS is a part of HTML5, nor do I think all the APIs here are HTML5. It just simplifies the matter to put them under a common name for the sake of this post.
