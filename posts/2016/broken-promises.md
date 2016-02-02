    title: Broken Promises
    date: 2016-02-02
    tags: javascript es2015 promises async

### Pretext

Around 2012 I found out about Promises. I realized that they solve a lot of the pain points I have with async JavaScript, namely pushing error handling to the edges, elegantly making sure only one completion is allowed (preventing numerous accidental race conditions) and allowing composition of async operations in a unified interface. I was convinced and became a fanboy and advocate. Since then I've become disillusioned.

### Error Handling

Promises allow for a simple error handling pattern:

```javascript
function fetchProcessedAndRevisedPrayer() {
    // this can throw
    return fetchPrayer()
        // this handler can throw as well
        .then(revise)
        // and this
        .then(process)
        // and all the errors go here!
        .catch(handleError);
}
```

This is great. Superb in fact. However, the reality is not all unicorns and rainbows. Let's start with the often blasted fact that promises swallow errors. This has recently become better, and for example the latest Chrome logs most unhandled errors in promises. But node doesn't, by default. And even Chrome's reporting is not always reliable. I wish I had a reduced test case to show you, but usually the problems happen in proprietary code with more or less complex logic involved.

Consider the following snippet from a production application:

```javascript
authorization.initialize()
    .catch(error => { /* this only errors if the user is logged in, so it's safe to proceed */ })
    .then(() => {
        ReactDOM.render(app, root);
    });
```

Now I get a blank screen and an empty console. Why? Let's change this as follows:

```javascript
authorization.initialize()
    .catch(error => { /* this only errors if the user is logged in, so it's safe to proceed */ })
    .then(() => {
        // Wrap in setTimeout to escape the promise error swallowing.
        setTimeout(() => {
            ReactDOM.render(app, root);
        }, 1);
    });
```

Now I get the rendering error in the console. Note that the promise was not assigned to anything so by all rules the error should be logged as an unhandled promise rejection, but no. Apparently this just happens to be a case where the heuristics for unhandled exception detection with ES6 promises in Chrome fail.

### Flow Control

Let's go back to our first example and consider how we'd write the same code synchronously. We'd first consider what can lead to an exception, and then wrap only that in a try-catch block:

```javascript
function fetchProcessedAndRevisedPrayer() {
    let prayer;

    try {
        prayer = fetchPrayer();
    } catch (error) {
        return handleError(error);
    }

    const revisedPrayer = revise(prayer);
    const processedPrayer = process(prayer);

    return processedPrayer;
}
```

But this is JavaScript, so even if `revise` and `process` aren't expected to throw an error, they might throw `ReferenceError`s etc. With the synchronous version this isn't a problem because our error handler doesn't swallow those, it only expects errors from `fetchPrayer` and thus errors are uncaught and shown in the console as should be. With our Promise-based version though, this is not the case and even the exceptions that weren't expected go to our error handler.

Consider the following scenario:

```javascript
fetchSomething()
    .then(renderUI)
    .catch(createNotification);
```

Looks about right, and to be expecting that the data fetching may fail. However, our data fetching might go fine, but what if the data is not what the UI expects? If `renderUI` throws, the error goes to our `createNotification`, thus we lose the stack trace and have to add temporary hacks to our code to work around this (e.g. wrap in a `setTimeout` or remove the `catch`). Not a very nice debugging experience.

There are alternative ways to write this code, though. We could rethrow in `createNotification` and reorder as follows:

```javascript
fetchSomething()
    .catch(createNotification)
    .then(renderUI);
```

but that would mean that the error handler says that it didn't handle the errors and even the expected errors would go to console! Not what we wanted.

Alternatively, we could use the second argument of `.then(successCallback, errorCallback)` which doesn't pass the errors in `successCallback` to `errorCallback`:

```javascript
fetchSomething()
    .then(renderUI, createNotification);
```

This gets us the results we wanted, as in data fetching errors cause a notification and UI errors go to console. However, this goes against being able to push our exception handling to the edges. Also, like the original case, in lieu of rethrowing from the error handler, we can't know if this whole operation succeeded or not. We can just observe that it finished. This forces the promise producer to be aware of whether the consumer discards the resulting promise or not, or the consumer to add a no-op error handler to a promise it otherwise ignores. Otherwise our console gets flooded with unhandled promise rejections.

### Promises are not at fault, though

The main problem of Promises is not actually a fault in Promises per se. Disregarding the issue of unpredictable unhandled exception reporting on different platforms, the main problem is that the model Promises have for errors is hugely incompatible with JavaScript's dynamic nature. In JavaScript, aside from syntax errors, you hardly get any compile time errors for errors you have made in your code. This means that errors like `typoFucntion()` raise a runtime exception instead, so any part of your code might throw unexpectedly.

Promises by design allow for elegant handling of **expected** exceptions. However, they don't fix the issue of differentiating between unexpected runtime exceptions and expected exceptions such as network failure.

### Summary

I wanted to write this post as a response to people on Twitter claiming that people who don't like Promises have never used them, etc. demeaning. There is completely valid criticism for Promises, even in the use case they're intended for, and I wanted to write that, as someone who's been using Promises extensively.

I don't like writing about problems unless I can offer solutions, but unfortunately in this case I don't have any that people want to hear. There are two potential solutions to the problem and the other is compile time errors, which leads us to another language such as Elm. The other is just use callbacks. This solves the problem of **unexpected** runtime exceptions being treated as equals of expected exceptions:

```javascript
fetchSomething((error, result) => {
    if ( error ) { return callback(error); }
    // if this fails, the program crashes, as it should
    renderUI(result);
    callback();
});
```

This however goes back to the problems described in the pretext of this - just consider debugging the result of what happens if I forget that `return`.

All hope is not lost though! There are alternatives to native ES6 promises that are more mature and rich in features, such as [Bluebird]. [Bluebird] offers a significantly better debugging experience with long stack traces and reporting unhandled exceptions at the next tick of the event loop (instead of upon GC like ES6 promises). However, even [Bluebird] doesn't fix the core problem: the excess of unexpected runtime errors.

*Thanks to Riku Tiira and Jari Rantala for reviewing this article!*

[Bluebird]: https://github.com/petkaantonov/bluebird
