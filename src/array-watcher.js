class Watcher extends Array {

	watch(method, callback) {

		if(!this.notify) {
			this.notify = {};
		}

		let eventName = `${method}-notify-${createHash()}`;
		let pureArray = getPureArray(this);

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
		getArrayProps().forEach(prop => this.watch(prop, callback));
		return getPureArray(this);
	}

	unWatch(method) {
		if(this.notify && this.notify[method]) {
			window.removeEventListener(this.notify[method].eventName, this.notify[method].callback);
		}
		return getPureArray(this);
	}

	unWatchAll() {
		getArrayProps().forEach(key => this.unWatch(key));
		return getPureArray(this);
	}

}

function getArrayProps() {
	let ignore = ['length', 'constructor'];
	return Object.getOwnPropertyNames(Array.prototype).filter(prop => ignore.indexOf(prop) === -1);
}

function getPureArray(context) {
	return Object.keys(context).filter(key => !isNaN(Number(key))).map(key => context[key]);
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

export function ArrayWatcher(...args) {
	let watcher = Object.create(Watcher.prototype);
	watcher.push.apply(watcher, args);
	return watcher;
} 