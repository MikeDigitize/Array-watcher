import xs from 'xstream';

// export function AoEventListener(el, evt, callback) {

// 	el = typeof el === 'string' ? document.querySelector(el) : el;

// 	let isListening = false;

// 	let listener = {
// 	  next: evt => callback.call(el, evt),
// 	  error: err => console.warn('Error: ', err),
// 	  complete: () => el.removeEventListener(evt, listener.next)
// 	};

// 	let producer = {
// 	  start : startListening,
// 	  stop : stopListening
// 	};

// 	function startListening() {
// 		if(!isListening) {
// 			el.addEventListener(evt, listener.next);
// 			stream.addListener(listener);
// 			isListening = true;
// 		}
// 		else {
// 			listener.error('AoClick is already listening');
// 		}
// 	}

// 	function stopListening() {
// 		if(isListening) {
// 			stream.removeListener(listener);
// 			listener.complete();
// 			isListening = false;
// 		}
// 		else {
// 			listener.error('AoClick is not yet listening');
// 		}
// 	}

// 	if(!(el instanceof HTMLElement)) {
// 		listener.error('The first argument should be a CSS selector or HTML Element');
// 	}

// 	if(typeof evt !== 'string') {
// 		listener.error('The second argument should be a DOM event');
// 	}

// 	if(typeof callback !== 'function') {
// 		listener.error('The third argument should be a callback function');
// 	}

// 	let { start, stop } = producer;
// 	let stream = xs.create(producer);

// 	return { start, stop };

// }

export function primitiveAddListener(el, evt, fn) {

	el = typeof el === 'string' ? document.querySelector(el) : el;

	let isListening = false;

	function start() {
		if(!isListening) {
			isListening = true;
			el.addEventListener(evt, fn);	
		}		
		else {
			error('Listener already initiliased');
		}
	}

	function stop() {
		if(isListening) {
			isListening = false;
			el.removeEventListener(evt, fn);	
		}		
		else{
			error('Listener not yet initiliased');
		}
	}

	function error(err) {
		return console.warn(err);
	}

	if(!(el instanceof HTMLElement)) {
		error('The first argument should be a CSS selector or HTML Element');
	}

	if(typeof evt !== 'string') {
		error('The second argument should be a DOM event');
	}

	if(typeof fn !== 'function') {
		error('The third argument should be a callback function');
	}

	return { start, stop };

}