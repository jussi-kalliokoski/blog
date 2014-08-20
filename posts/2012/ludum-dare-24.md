    title: Ludum Dare 24
    date: 2012-08-26
    tags: games html5 javascript ludum dare ld24
    issue: 7

### Yay I'm finally participating!

Yes, after observing for a few times I decided to participate in [Ludum Dare](http://www.ludumdare.com) myself this time. I had quite a few ideas based on the themes up for voting when I went to bed last night, I just kept wishing that the theme would not be "Companion". I woke up in terror seeing that the theme was "Evolution". My first few ideas weren't even ideas, they were just memories. "Oh, right, that's [Osmos](http://www.hemispheregames.com/osmos/)... Yeah that's [Spore](http://www.spore.com/), dammit...". No original / plausible ideas whatsoever.


Of course there's also the aspect that I'd prefer avoiding making a game that insults someone.

### Trying Stuff Out

I decided to start working anyway, to see if I can figure something out on the fly. I experimented doing some ragdoll characters with Box2D in JS. 6 hours of coding in, I finally got the idea!

### A God Simulator of a Kind

Know how kids do silly stuff, like stomp on ants to see what happens, or maybe plant an aphid in their nest? Ever watched ants in those small terrariums? My game idea is something like that, the idea is to "give evolution a hand - by wiping out everyone but the fittest". The game (is supposed to) have a terrarium, full of caves and everything, and those caves are inhabited by humans. One of these humans is the "alpha male". Your job as the player is to make sure that this alpha male gets to carry on his genetic footprint forward to following generations. What better way to do that than to wipe out everyone else, right?

The gameplay mechanics are pretty simple, you can throw rocks in the caves, or pour water in the tunnels, smash houses etc. to get to your goal, but you need to be careful, the humans are pretty fragile and you want to keep the alpha male alive (else you lose).

### Tools

 * The Web (HTML5, JS, Canvas, buzzword, buzzword)
 * [Box2DWeb](http://code.google.com/p/box2dweb/) (I plan on switching to the emscripten version, if there's time)
 * [html5Preloader](https://github.com/jussi-kalliokoski/html5Preloader.js) for preloading assets

### WIP

As of writing this, I've implemented most of the physics and damage mechanisms. I'll try to keep this post up to date about my progress, but here's my roadmap on what's missing:

 * Level generation and features (e.g. <s>caves</s>, houses).
 * AI. Currently the dudes are just standing still waiting for their deaths.
 * Water.
 * Maybe fire?
 * Art? It's just circles and rectangles now.
 * <s>Music and sounds</s>. I have a temptation to port [sfxr](http://www.drpetter.se/project_sfxr.html) to JS, but it'll have to wait.

I'll keep the latest working version in [this address](http://labs.avd.io/evolution/).

Now it's probably a good idea to get a little sleep. Oh yeah, my food today: pizza from yesterday and... Well, that was it.

### Update 1

YES! Now there's some cave generation. Not sure if it even makes sense to have houses in caves. The dudes should probably spawn somewhere not in the air though...

### Update 2

Woo, there's music and sounds now, courtesy of my very good friend Janne Huhta. One of the SFX is a public domain classic, the others are created for the occasion. I also added some background story and level changing, yay!
