class ArrayWatcher extends Array {

	watch(method, callback) {

		if(!this.notify) {
			this.notify = {};
		}

		let eventName = `${method}-notify`;
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

		Object.getOwnPropertyNames(Array.prototype).forEach(key => {
			this.watch(key, callback);
		});

	}

	unwatch(method) {
		if(this.notify && this.notify[method]) {
			window.removeEventListener(this.notify[method].eventName, this.notify[method].callback);
		}
	}

	unWatchAll() {
		Object.getOwnPropertyNames(Array.prototype).forEach(key => this.unwatch(key));
	}

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

export function AoArray (...args) {
	let watcher = Object.create(ArrayWatcher.prototype);
	watcher.push.apply(watcher, args);
	return watcher;
} 