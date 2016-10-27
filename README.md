# Array-watcher

This is a completely experimental bit of JavaScript inspired by all the observable type libraries that react to data changes. It's a small wrapper around `Array.prototype` that looks like an array, behaves like an array but has four extra methods used to observe usage of all non-read only array properties (methods).

## Wut?!

Normal array usage looks might look something like this.

```javascript
// mutation
var arr = [1,2,3,4];
arr.push(5);
console.log(arr); 
// logs: [1,2,3,4,5]

// non-mutation
arr.map(num => num += 10); // [11,12,13,14,15]
```

## So what is ArrayWrapper?

A modified array that can react to array method access.

* watch
* watchAll
* unWatch
* unWatchAll

## Usage

Constructing an array from `ArrayWrapper` is easy.

```javascript
var arr = ArrayWatcher(); // [] (empty array)
var arr2  = ArrayWatcher(1,2,3,4); // [1,2,3,4] 
```
The difference between a standard array and an `ArrayWrapper` is it has the ability to react to specific array method usage.

```javascript
var arr  = ArrayWatcher(1,2,3,4); // [1,2,3,4] 
arr.watch('push', function() {
    console.log('accessed!');
});
arr.push(5);
// logs: accessed!
```

## A Watcher

An array is observed by passing two arguments to the `watch` method - the method to watch and a callback. The callback `context` is set to the array. The callback gets passed two parameters - the method that was accessed (String) and the event (Object).

```javascript
var arr  = ArrayWatcher(1,2,3,4); // [1,2,3,4] 
arr.watch('push', function(method, evt) {
    console.log(method, evt, this);
});
arr.push(5);
// logs: 'push', { Object } [1,2,3,4,5]
```

## Unwatch

To unwatch a watched method of the array, pass its name to the `unWatch` method.

```javascript
var arr  = ArrayWatcher(1,2,3,4); // [1,2,3,4] 
arr.watch('push', function(method, evt) {
    console.log(method, evt, this);
});
arr.push(5);
// logs: 'push', { event object } [1,2,3,4,5]
arr.unWatch('push');
arr.push(6); // behaves like the standard array push method i.e. returns the array length (6)
```

## Watch all

Similarly, to watch all array method usage use the `watchAll` method and pass in a single callback which gets called whenever any of those array properties are used.

```javascript
var arr  = ArrayWatcher({ name : 'Mike' }, { name : 'Bob' }); // [{ name : 'Mike' }, { name : 'Bob' }] 
arr.watchAll(function(method, evt) {
    console.log(method, evt, this);
});
arr.map(dude => dude.name); // ['Mike', 'Bob']
// logs: 'map', { Object } ['Mike', 'Bob']
arr.push({ name : 'Dave' }); // ['Mike', 'Bob', 'Dave']
// logs: 'push', { Object } ['Mike', 'Bob', 'Dave']
```

## Unwatch all

Unwatching all array method usage is done by using the `unWatchAll` method.

```javascript
// from the example above
arr.unWatchAll();
arr.push({ name : 'Clive' }); // behaves like the standard array push method i.e. returns the array length (4) 
arr.map(dude => dude.name); // ['Mike', 'Bob', 'Dave', 'Clive']
```

## API

```javascript
// watch
@type {Function}
@param {String} method - the array method to watch
@param {Function} callback- the function that fires upon access of the specified method
@returns {Array} the array created with ArrayWrapper
arr.watch(method, callback);

// unWatch
@type {Function}
@param {String} method - the array method to unwatch
@returns {Array} the array created with ArrayWrapper
arr.unWatch(method);

// watchAll
@type {Function}
@param {Function} callback - the function that fires upon any array property access
@returns {Array} the array created with ArrayWrapper
arr.watchAll(callback);

// unWatchAll
@type {Function}
@returns {Array} the array created with ArrayWrapper
arr.unWatchAll();

// callback
@type {Function}
@parameter1 {String} the array method that was accessed
@parameter2 {Object} the custom event that fires
@context {Array} the array created with ArrayWrapper
function log(method, evt) {
    console.log(`${method} property accessed`, evt, this);
}
```

## Notes

This is just purely experimentation! I have no idea of any genuinely practical use cases for this but similarly I struggle to find real world usages for observable type libraries when there are less verbose ways of achieving the same thing. I'm going to try and follow this pattern with other constructs both from the JavaScript and DOM APIs and see where it takes me. Probably nowhere but hey ho it was fun creating it!
