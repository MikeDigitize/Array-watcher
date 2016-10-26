import 'object-assign-polyfill';

class ArrayWatcher extends Array {

	watch(method, callback) {

		if(!this.notify) {
			this.notify = {};
		}

		let eventName = `${method}-notify`;
		let pureArray = Object.keys(this).filter(key => !isNaN(Number(key))).map(key => this[key]);
		
		this.notify[method] = createArrayEvent(eventName);
		this[method] = function(...args) {

			if(this.notify && this.notify[method]) {
				window.dispatchEvent(this.notify[method]);
			}

			return Object.create(Array.prototype)[method].apply(this, args);

		}

		window.addEventListener(eventName, callback.bind(pureArray, method));

		return pureArray;

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