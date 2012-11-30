    title: Multiple Inheritance in ES6 with Proxies
    date: 2012/11/28
    tags: javascript ecmascript harmony proxy prototype inheritance
    issue: 8

### Inheritance in JavaScript

As you probably know, JavaScript features an inheritance pattern called [prototypal inheritance](http://en.wikipedia.org/wiki/Prototype-based_programming). In simplified terms, it means that objects have a prototype, and when a property of an object is accessed, it's first checked if the object itself has the property, and if not, the same is done for its prototype and so on. This is a very powerful model, not least because of its flexibility. You can even use it to simulate classical inheritance.

There's a limitation, however. Each object can only have one prototype, which means that the prototype chain cannot have branches, so multiple inheritance is not possible. There are patterns out there that add the necessary features to the object on construction, so you can just call the constructor on an object to make it "inherit" from that class (also called mix-in), but it beats the purpose of prototypal inheritance.

### Enter Proxies

[Proxies](http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies) are a new type of objects introduced in ES6 that let you customize the behavior of your objects, sort of a middle man that can be used to e.g. protect an object from direct access. One feature of the proxies is that you can create a custom getter that redirects any attempts to get a feature.

So why do you need multiple inheritance? Well, maybe you don't, some say it's bad, your call. But let's say you have a "class" named "Monkey". You also have a class named "EventEmitter", that is your generic favorite Event Emitter. Now, you want to make a monkey that can emit events, but you don't want the basic Monkey class to inherit from EventEmitter (it may already inherit from something that can't inherit from the EventEmitter), neither do you want the EventEmitter to inherit from the Monkey (right?????). The Monkey class handles events with onEvent function handles, but you want to use a sub/pub model. With proxies, here's what you can do:

```javascript

function EventedMonkey () {
  /* call the inheritables' constructors */
  Monkey.call(this)
  EventEmitter.call(this)
}

EventedMonkey.prototype = function () {
  /* create instances of the inheritables */
  var protoA = Object.create(Monkey.prototype)
  var protoB = Object.create(EventEmitter.prototype)
  /* create a plain object as the proxy target */
  var obj = {}

  return new Proxy(obj, {
    get: function (target, name) {
      /* scan through the inheritance list to find a match */
      if (name in obj) return obj[name]
      if (name in protoA) return protoA[name]
      if (name in protoB) return protoB[name]
    },

    has: function (target, name) {
      return name in obj ||
        name in protoA ||
        name in protoB
    }
  })
}()

EventedMonkey.prototype.onEat = function () {
  /* access from protoB */
  this.emit('eat', arguments)
}

var monkey = new EventedMonkey()

/* access from protoB */
monkey.on('eat', function (what) {
  console.log('Monkey is eating', what)
})

/* access from protoA */
monkey.eat('bananas') // "Monkey is eating bananas"

```

Simple enough, huh? The gist of it is to create a proxy that redirects property access to look through a list of objects, and boom, multiple prototypes. Of course, if we were silly, we could prematurely abstract this pattern into this:

```javascript

function MultiplePrototype (...prototypes) {
  var chain = [{}, ...prototypes]

  return new Proxy(chain[0], {
    get: function (target, name) {
      for (var obj of chain) {
        if (name in obj) return obj[name]
      }
    },

    has: function (target, name) {
      for (var obj of chain) {
        if (name in obj) return true
      }

      return false
    }
  })
}

EventedMonkey.prototype = MultiplePrototype(
  Object.create(Monkey.prototype),
  Object.create(EventEmitter.prototype)
)

```

### Words of Caution

As you probably realize, at the very least, using an inheritance pattern like this won't at least make your application faster. Traversing a single prototype pattern can be (relatively) expensive, let alone traversing multiple ones. Use your judgement on this one. Also, this may reduce the ease of comprehension for your code, especially because we aren't talking about an established pattern here (at least yet). Anyway, I hope this was helpful in understanding how you can really do anything with ES6 objects.
