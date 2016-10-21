import xs from 'xstream';

let container = document.querySelector('.container');
let start = document.querySelector('#start');
let stop = document.querySelector('#stop');
let count = 0;
let isListening = false;

let listener = {
  next: (value, target) => {
    console.log(value, target);
  },
  error: err => {
    console.warn('Error: ', err);
  },
  complete: () => {
    console.log('Done');
  }
};

function increment(evt) {
	listener.next(++count, evt.target);
}

function startListening() {
	if(!isListening) {
		container.addEventListener('click', increment);
		stream.addListener(listener);
		isListening = true;
	}
	else {
		listener.error('listener already initialised');
	}
}

function stopListening() {
	if(isListening) {
		container.removeEventListener('click', increment);
		listener.complete();
		stream.removeListener(listener);
		isListening = false;
	}
	else {
		listener.error('listener not yet initialised');
	}	
}

let producer = {
  start : startListening,
  stop : stopListening
};

let stream = xs.create(producer);

start.addEventListener('click', producer.start);
stop.addEventListener('click', producer.stop);