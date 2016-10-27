class ArrayWatcher extends Array {

	watch(method, callback) {

		if(!this.notify) {
			this.notify = {};
		}

		let eventName = `${method}-notify-${createHash()}`;
		let pureArray = Object.keys(this).filter(key => !isNaN(Number(key))).map(key => this[key]);
		
		this.notify[method] = {
			eventName,
			evt : createArrayEvent(eventName),
			callback : callback.bind(pureArray, method)
		};

		this[method] = function(...args) {

			if(this.notify && this.notify[method]) {
				window.dispatchEvent(this.notify[method].evt);
			}
			return Object.create(Array.prototype)[method].apply(this, args);

		}

		window.addEventListener(eventName, this.notify[method].callback);
		return pureArray;

	}

	watchAll(callback) {
		return getArrayProps().reduce((arr, prop) => {
			arr = this.watch(prop, callback);
			return arr;
		});
	}

	unwatch(method) {
		if(this.notify && this.notify[method]) {
			window.removeEventListener(this.notify[method].eventName, this.notify[method].callback);
		}
	}

	unWatchAll() {
		getArrayProps().forEach(key => this.unwatch(key));
		return Object.keys(this).filter(key => !isNaN(Number(key))).map(key => this[key]);
	}

}

function getArrayProps() {
	let ignore = ['length', 'constructor'];
	return Object.getOwnPropertyNames(Array.prototype).filter(prop => ignore.indexOf(prop) === -1);
}

function createArrayEvent(customType) {

	if(document.createEvent) {
		let event = document.createEvent('CustomEvent');
		event.initEvent(customType, true, true);
		return event;
	}
	else {
		return new Event(customType);		
	}

}

function createHash() {
    return Math.random().toString(16).substr(2, 9);
}

export function AoArray (...args) {
	let watcher = Object.create(ArrayWatcher.prototype);
	watcher.push.apply(watcher, args);
	return watcher;
} 