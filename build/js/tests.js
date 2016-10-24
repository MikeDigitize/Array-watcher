
/*
	Click
*/

let container = document.querySelector('.container');
let start = document.querySelector('#start');
let stop = document.querySelector('#stop');

let count = 0;
let isListening = false;

let listener = {
  next: (value, target) => {
    console.log('hi', value, target);
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

start.addEventListener('click', producer.start);
stop.addEventListener('click', producer.stop);

let stream = xs.create(producer);

/*
	Promise
*/

let listener2 = {
  next: (value) => {
    console.log(value);
  },
  error: function(err) {
    console.warn('Number below 5: ', err);
    if(err >= 3) {
    	console.log('try again')
    	this.complete();
    }
    else {
    	console.log('it\'s all over');
    }
  },
  complete: function() {
    console.log('Done');
    stream2 = xs.from(timer());
    stream2.addListener(listener2);
  }
};

function timer() {
	return new Promise(function(res, rej) {
		setTimeout(() => {
			let random = Math.floor(Math.random() * 10) + 1;
			if(random > 5) {
				res({ 'greet' : 'yo', 'target' : 'mama'});
			}
			else {
				rej(random);
			}			
		}, 1000);
	});
}

let stream2 = xs.from(timer());
stream2.addListener(listener2);