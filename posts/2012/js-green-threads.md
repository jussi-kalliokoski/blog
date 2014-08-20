    title: JavaScript Green Threads
    date: 2012-07-05
    tags: javascript ecmascript harmony concurrency generators threads coros coroutines
    issue: 5
    hackernews: 4203749

### What on Earth are they?

For an introduction to green threads, I suggest reading this [Wikipedia article](http://en.wikipedia.org/wiki/Green_threads). What they mean in this context is however a bit different, as in JS there is normally no threads at all, and because callbacks in JS are quite easy and event loops are usually controlled by things outside your control, you might feel that there's not much need for scheduling control.

Before we start, I want to make clear why I think it's important that you know of all this. The only case where this isn't relevant to you is when you never plan to touch browser technologies, and my hope is that you won't make that decision, at least because of what I'm going to show you. This is because green threads can make your program go [FUBAR](http://en.wikipedia.org/wiki/List_of_military_slang_terms#FUBAR), in the exact meaning of the word; There would seem to be no reason why all has failed, and what I'm trying to do here is equip you with the knowledge that might save countless hours of debugging something that might get reproduced only randomly.

### The short history of blocking JavaScript.

You might already be familiar with all the built-in blocking operations in JavaScript. `alert()`, `confirm()` and friends. All of these stop the execution of your code until what they're doing is complete. For example:

```javascript
var a = 123;
alert(a);
a = 2;
```

Here, `a` becomes `2` only after the user has closed the alert box. Another blocker is JavaScript itself, of course. For example:

```javascript
while (true);
```

This usually blocks execution, at least until an unresponsive page popup comes up and asks you if you want to continue running the script or not.

These built-in blockers are considered a mistake these days, however. Browser makers still struggle with getting good performance on pages where there are too many blocking calls, making the user interface unresponsive and harder to optimize (from the browsers' side). It also makes all the other pages in the same thread unresponsive and may even break their logic. There are attempts to fix the problem, but more on that later.

### Let's Get Coding

Now we are going to walk through a few code examples. When you read them, I want you to think about in what order events will occur. I can guarantee you'll be surprised. Please note though, that this behaviour is currently applicable only to Firefox, but other browsers are likely to follow. More on that later, too.

Let's start with something simple (warning: running this will freeze your browser):

```javascript
var forever = true;

setTimeout(function () {
    forever = false;    
}, 1000);

while (forever);

console.log('wat. Y WE HERE?');
```

This one is logical, we have a timeout that will never occur because the thread is blocked by an infinite loop. Also, the logging operation on the last line will never happen.

The next one is quite similar:

```javascript
var forever = true;

window.onmessage = function () {
    console.log('message');
    forever = false;    
};

window.postMessage('*', '*');

console.log('posted message');

while (forever);

console.log('wat. Y WE HERE?');
```

This will also freeze your browser with an infinite loop, until the browser decides it's time to issue a slow script warning. But this is where it gets different. If you press continue and look at your console, you will have the following output:

```
posted message
message
wat. Y WE HERE?
```

You will also notice that the endless loop didn't continue, contrary to what you told the browser to do.

I know that right about now you're thinking that this guy is lying, but feel free to fire up your Firefox and paste the code in the console, and freeze your browser for a bit.

### What? Why?! HOW?!?

As you can see, the window.onmessage fired in the place where we should be having the endless loop. What follows, is that forever becomes false and suddenly we're out of that endless loop. This, my friends, is a failed [race condition](http://en.wikipedia.org/wiki/Race_condition). Events occured out of order.

Why is this happening? Earlier, I told you that there are attempts to fix the problems caused by these synchronous calls in JavaScript, one of them is by the [HTML5 WebApp APIs Spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/webappapis.html#synchronous-section). What it essentially does is allow browsers to make these blocking calls non-blocking, i.e. allowing the browser to pause just that *stack* while continuing to do other work, until the blocking call is finished, when the browser would continue the stack that had the blocking call.

This is a very smart move, as it allows other pages running in the same thread continue normally, while one page is doing a blocking operation, as well as keep the user interface responsive. The responsiveness of the user interface does come with a price, though. You can't see it in the example, as the blocking call is a semi-modal dialog (it blocks the page, not the thread), so the user interface can't be interacted with. But there are blocking calls that don't expose a dialog, hence the user interface will remain interactive. This means pretty much that if you have one of these calls in your code, you can no longer expect anything to happen in the order you wanted it to, a previous function call can be unfinished while the next one is already happening.

Even in the previous example, we can see this being a slight problem, we blocked the thread for too long, and things started happening in an unexpected order. This is why you should *never* block the main thread for a long time (by a long time I mean a time in which the user has enough time to double-click somewhere). This is why we have [Web Workers](http://www.whatwg.org/specs/web-apps/current-work/multipage/workers.html) these days. They allow you to block all you want without worrying about the consequences (please do mind that people have finite batteries in their computers/phones though). That's lesson number one on how to avoid green threads from spawning. More to come later on.

### The Kernel of All Things Evil: XMLHttpRequest

XHR is a nice piece of technology, really, it's a nice interface to work with, especially given that it's asynchronous. It has only one outstanding wart: it's not just asynchronous.

You might be thinking, "nah, it's not that bad, if it happens really fast and it makes things so convenient since you don't need callbacks and all that spaghetti, and you don't have to use it". If you were, you were *WRONG*. First of all, it happening fast, not to mention really fast, is an edge case. It hardly ever does happen fast. So what's the problem? It's not like it makes your computer die or something like that. Once again, wrong.

Consider this, a user is browsing the internet with her phone (the future of internet? So they say, but that's another subject) that has a single core. She has opened a web page that is now loaded, and is reading a blog post. She scrolls to the end of the page which triggers showing the comments on the page. The comments are fetched synchronously. What happens is that her (let's be optimistic) 3G antenna starts up, seeks signal and connects to it. This will take a few seconds. After that, a connection to the server is made and the data is fetched. This might take a few seconds as well. During all this time, her phone was completely unusable, she couldn't switch tabs or close the program and didn't know what hit it. Pre-emptive threading makes sure that she has at least some control over the phone, but the browser is frozen.

Now let's look at the less optimistic scenario, where she has bad coverage which results in the request taking up to the time after which the server closes the connection. This is usually 15 seconds or so, which is not a very short time to wait for your browser to do something. Not to mention if another operation like this fires right after.

Earlier, I mentioned that there are blocking calls that don't present a dialog that blocks the UI interaction with the page. There is actually only one I know and that is synchronous XHR. And as I hope you've understood from the post so far, it's also the worst kind. So doing a blocking XHR in Firefox will actually not be blocking, instead it pauses the callstack and resumes it after the response is received.

### How to avoid it?

It's quite simple: _don't block_. Whatever you do, _don't block_. Now that that's underway, you might end up using a third party script that does block. There are a few things you can do:

1. You can change the third-party script to not do any blocking operations, i.e. write your own. This is for the good of mankind.
2. If you can't do that, think about getting the script to run in a worker instead.
3. If you can't do that, you should ask if you actually need what the script is offering.
4. If you do:

There are a few precautionary measures you can take to try to avoid the logic of your program breaking. I should warn you though, I don't recommend using these under any circumstances as they are extremely cumbersome and aren't foolproof.

So let's say you have a state that needs to essentially be locked (yes, as in mutex/lock) so that two stacks can't modify the state at the same time (well they won't be running the same time, but the other one might run in the middle of the other) as it might corrupt the state, exposing the user/server to potential data loss / security issues or such. What you need to do is make that state unreachable when it's being manipulated. This is easier than it sounds:

```javascript
function MyClass () {
    this.state = {
        stuff: 1
    };
}

MyClass.prototype = {
    manipulate: function () {
        var state = this.state;

        if (!state) {
            throw ReferenceError('Race condition failure!');
        }

        this.state = null;

        // Do some potentially blocking manipulation here

        this.state = state;
    }
};
```

This prevents the function from being called before the previous call was finished. It has an obvious wart though, as the state is reassigned at the end of the function. So if the function results in an error somewhere, even if you catch it, the function can't be called again, unless you manually reset the state. The state essentially becomes lost whenever there is an error.

### How to abuse it?

I'm a curious hacker by nature, so the first thing I thought when I encountered this was "how can I take advantage of this?". In anything serious, you really can't, especially as this behaviour is currently confined to Firefox. But there are some interesting experiments you can do with this.

As you may know, ES6 is going to have [generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators), which simplify making long series of asynchronous calls while "preserving" the "nature of JS" as a language where nothing unexpected should happen while doing synchronous stuff. More thoughts on this [here](http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/).

But as we've already established, things happening in an expected order is not even the status quo. A lot of people have asked for deep coroutines, which is essentially that it would be ok to for example have a keyword that tells the JS engine to pause the current stack and complete outstanding tasks, and then continue the stack it was in. As you can see, the blog post I linked to suggests this might not even be possible, but I will show you that it is. Note that this is for educational purposes only, please do not use this in production. As a safety precaution, I'm not going to use semicolons in the code example to scare off the language newbies &lt;/sarcasm&gt;.

Let's create a custom keyword `wait` that would complete all the outstanding tasks. "A new keyword?" you say, "impossible", you say. But not really, because the keyword doesn't have to act as an operator and should be used as a standalone expression. How we do this is by assigning a property getter to the global object:

```javascript
Object.defineProperty(window, 'wait', {get: function () {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', 'data:text/plain;base64,YQ==', false)

    try {
        xhr.send(null)
    } catch (e) {}
}})
```

There we have it. What it does is send a simple blocking XHR to force the JS engine to pause the stack. <del>If you can think of a quicker address than '#', please let me know</del>. EDIT: Devon Govett suggested using a Data URI, thanks Devon! Now let's try it out:

```javascript
window.onmessage = function (e) {
    console.log(e.data);
};

console.log('1');
window.postMessage('3', '*');
console.log('2');
window.postMessage('4', '*');
wait;
console.log('5')
```

It works! The result is as follows:

```
1
2
3
4
5
```

Amazing, huh?
