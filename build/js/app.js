(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _xstream = __webpack_require__(1);

	var _xstream2 = _interopRequireDefault(_xstream);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
		Click
	*/

	var container = document.querySelector('.container');
	var start = document.querySelector('#start');
	var stop = document.querySelector('#stop');

	var count = 0;
	var isListening = false;

	var listener = {
		next: function next(value, target) {
			console.log('hi', value, target);
		},
		error: function error(err) {
			console.warn('Error: ', err);
		},
		complete: function complete() {
			console.log('Done');
		}
	};

	function increment(evt) {
		listener.next(++count, evt.target);
	}

	function startListening() {
		if (!isListening) {
			container.addEventListener('click', increment);
			stream.addListener(listener);
			isListening = true;
		} else {
			listener.error('listener already initialised');
		}
	}

	function stopListening() {
		if (isListening) {
			container.removeEventListener('click', increment);
			listener.complete();
			stream.removeListener(listener);
			isListening = false;
		} else {
			listener.error('listener not yet initialised');
		}
	}

	var producer = {
		start: startListening,
		stop: stopListening
	};

	start.addEventListener('click', producer.start);
	stop.addEventListener('click', producer.stop);

	var stream = _xstream2.default.create(producer);

	/*
		Promise
	*/

	var listener2 = {
		next: function next(value) {
			console.log(value);
		},
		error: function error(err) {
			console.warn('Number below 5: ', err);
			if (err >= 3) {
				console.log('try again');
				this.complete();
			} else {
				console.log('it\'s all over');
			}
		},
		complete: function complete() {
			console.log('Done');
			stream2 = _xstream2.default.from(timer());
			stream2.addListener(listener2);
		}
	};

	function timer() {
		return new Promise(function (res, rej) {
			setTimeout(function () {
				var random = Math.floor(Math.random() * 10) + 1;
				if (random > 5) {
					res({ 'greet': 'yo', 'target': 'mama' });
				} else {
					rej(random);
				}
			}, 1000);
		});
	}

	var stream2 = _xstream2.default.from(timer());
	stream2.addListener(listener2);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(2);
	exports.Stream = core_1.Stream;
	exports.MemoryStream = core_1.MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = core_1.Stream;
	//# sourceMappingURL=index.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var symbol_observable_1 = __webpack_require__(3);
	var NO = {};
	function noop() { }
	function copy(a) {
	    var l = a.length;
	    var b = Array(l);
	    for (var i = 0; i < l; ++i) {
	        b[i] = a[i];
	    }
	    return b;
	}
	exports.NO_IL = {
	    _n: noop,
	    _e: noop,
	    _c: noop,
	};
	// mutates the input
	function internalizeProducer(producer) {
	    producer._start =
	        function _start(il) {
	            il.next = il._n;
	            il.error = il._e;
	            il.complete = il._c;
	            this.start(il);
	        };
	    producer._stop = producer.stop;
	}
	function compose2(f1, f2) {
	    return function composedFn(arg) {
	        return f1(f2(arg));
	    };
	}
	function and(f1, f2) {
	    return function andFn(t) {
	        return f1(t) && f2(t);
	    };
	}
	var Subscription = (function () {
	    function Subscription(_stream, _listener) {
	        this._stream = _stream;
	        this._listener = _listener;
	    }
	    Subscription.prototype.unsubscribe = function () {
	        this._stream.removeListener(this._listener);
	    };
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	var ObservableProducer = (function () {
	    function ObservableProducer(observable) {
	        this.type = 'fromObservable';
	        this.ins = observable;
	    }
	    ObservableProducer.prototype._start = function (out) {
	        this.out = out;
	        this._subscription = this.ins.subscribe(new ObservableListener(out));
	    };
	    ObservableProducer.prototype._stop = function () {
	        this._subscription.unsubscribe();
	    };
	    return ObservableProducer;
	}());
	var ObservableListener = (function () {
	    function ObservableListener(_listener) {
	        this._listener = _listener;
	    }
	    ObservableListener.prototype.next = function (value) {
	        this._listener._n(value);
	    };
	    ObservableListener.prototype.error = function (err) {
	        this._listener._e(err);
	    };
	    ObservableListener.prototype.complete = function () {
	        this._listener._c();
	    };
	    return ObservableListener;
	}());
	var MergeProducer = (function () {
	    function MergeProducer(insArr) {
	        this.type = 'merge';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ac = 0;
	    }
	    MergeProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var L = s.length;
	        this.ac = L;
	        for (var i = 0; i < L; i++) {
	            s[i]._add(this);
	        }
	    };
	    MergeProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var L = s.length;
	        for (var i = 0; i < L; i++) {
	            s[i]._remove(this);
	        }
	        this.out = NO;
	    };
	    MergeProducer.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    MergeProducer.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MergeProducer.prototype._c = function () {
	        if (--this.ac <= 0) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    return MergeProducer;
	}());
	exports.MergeProducer = MergeProducer;
	var CombineListener = (function () {
	    function CombineListener(i, out, p) {
	        this.i = i;
	        this.out = out;
	        this.p = p;
	        p.ils.push(this);
	    }
	    CombineListener.prototype._n = function (t) {
	        var p = this.p, out = this.out;
	        if (out === NO)
	            return;
	        if (p.up(t, this.i)) {
	            out._n(p.vals);
	        }
	    };
	    CombineListener.prototype._e = function (err) {
	        var out = this.out;
	        if (out === NO)
	            return;
	        out._e(err);
	    };
	    CombineListener.prototype._c = function () {
	        var p = this.p;
	        if (p.out === NO)
	            return;
	        if (--p.Nc === 0) {
	            p.out._c();
	        }
	    };
	    return CombineListener;
	}());
	exports.CombineListener = CombineListener;
	var CombineProducer = (function () {
	    function CombineProducer(insArr) {
	        this.type = 'combine';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ils = [];
	        this.Nc = this.Nn = 0;
	        this.vals = [];
	    }
	    CombineProducer.prototype.up = function (t, i) {
	        var v = this.vals[i];
	        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
	        this.vals[i] = t;
	        return Nn === 0;
	    };
	    CombineProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var n = this.Nc = this.Nn = s.length;
	        var vals = this.vals = new Array(n);
	        if (n === 0) {
	            out._n([]);
	            out._c();
	        }
	        else {
	            for (var i = 0; i < n; i++) {
	                vals[i] = NO;
	                s[i]._add(new CombineListener(i, out, this));
	            }
	        }
	    };
	    CombineProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var n = s.length;
	        var ils = this.ils;
	        for (var i = 0; i < n; i++) {
	            s[i]._remove(ils[i]);
	        }
	        this.out = NO;
	        this.ils = [];
	        this.vals = [];
	    };
	    return CombineProducer;
	}());
	exports.CombineProducer = CombineProducer;
	var FromArrayProducer = (function () {
	    function FromArrayProducer(a) {
	        this.type = 'fromArray';
	        this.a = a;
	    }
	    FromArrayProducer.prototype._start = function (out) {
	        var a = this.a;
	        for (var i = 0, l = a.length; i < l; i++) {
	            out._n(a[i]);
	        }
	        out._c();
	    };
	    FromArrayProducer.prototype._stop = function () {
	    };
	    return FromArrayProducer;
	}());
	exports.FromArrayProducer = FromArrayProducer;
	var FromPromiseProducer = (function () {
	    function FromPromiseProducer(p) {
	        this.type = 'fromPromise';
	        this.on = false;
	        this.p = p;
	    }
	    FromPromiseProducer.prototype._start = function (out) {
	        var prod = this;
	        this.on = true;
	        this.p.then(function (v) {
	            if (prod.on) {
	                out._n(v);
	                out._c();
	            }
	        }, function (e) {
	            out._e(e);
	        }).then(noop, function (err) {
	            setTimeout(function () { throw err; });
	        });
	    };
	    FromPromiseProducer.prototype._stop = function () {
	        this.on = false;
	    };
	    return FromPromiseProducer;
	}());
	exports.FromPromiseProducer = FromPromiseProducer;
	var PeriodicProducer = (function () {
	    function PeriodicProducer(period) {
	        this.type = 'periodic';
	        this.period = period;
	        this.intervalID = -1;
	        this.i = 0;
	    }
	    PeriodicProducer.prototype._start = function (stream) {
	        var self = this;
	        function intervalHandler() { stream._n(self.i++); }
	        this.intervalID = setInterval(intervalHandler, this.period);
	    };
	    PeriodicProducer.prototype._stop = function () {
	        if (this.intervalID !== -1)
	            clearInterval(this.intervalID);
	        this.intervalID = -1;
	        this.i = 0;
	    };
	    return PeriodicProducer;
	}());
	exports.PeriodicProducer = PeriodicProducer;
	var DebugOperator = (function () {
	    function DebugOperator(ins, arg) {
	        this.type = 'debug';
	        this.ins = ins;
	        this.out = NO;
	        this.s = noop;
	        this.l = '';
	        if (typeof arg === 'string') {
	            this.l = arg;
	        }
	        else if (typeof arg === 'function') {
	            this.s = arg;
	        }
	    }
	    DebugOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    DebugOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DebugOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var s = this.s, l = this.l;
	        if (s !== noop) {
	            try {
	                s(t);
	            }
	            catch (e) {
	                u._e(e);
	            }
	        }
	        else if (l) {
	            console.log(l + ':', t);
	        }
	        else {
	            console.log(t);
	        }
	        u._n(t);
	    };
	    DebugOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DebugOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DebugOperator;
	}());
	exports.DebugOperator = DebugOperator;
	var DropOperator = (function () {
	    function DropOperator(max, ins) {
	        this.type = 'drop';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.dropped = 0;
	    }
	    DropOperator.prototype._start = function (out) {
	        this.out = out;
	        this.dropped = 0;
	        this.ins._add(this);
	    };
	    DropOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DropOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.dropped++ >= this.max)
	            u._n(t);
	    };
	    DropOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DropOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DropOperator;
	}());
	exports.DropOperator = DropOperator;
	var OtherIL = (function () {
	    function OtherIL(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    OtherIL.prototype._n = function (t) {
	        this.op.end();
	    };
	    OtherIL.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    OtherIL.prototype._c = function () {
	        this.op.end();
	    };
	    return OtherIL;
	}());
	var EndWhenOperator = (function () {
	    function EndWhenOperator(o, ins) {
	        this.type = 'endWhen';
	        this.ins = ins;
	        this.out = NO;
	        this.o = o;
	        this.oil = exports.NO_IL;
	    }
	    EndWhenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.o._add(this.oil = new OtherIL(out, this));
	        this.ins._add(this);
	    };
	    EndWhenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.o._remove(this.oil);
	        this.out = NO;
	        this.oil = exports.NO_IL;
	    };
	    EndWhenOperator.prototype.end = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    EndWhenOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    EndWhenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    EndWhenOperator.prototype._c = function () {
	        this.end();
	    };
	    return EndWhenOperator;
	}());
	exports.EndWhenOperator = EndWhenOperator;
	var FilterOperator = (function () {
	    function FilterOperator(passes, ins) {
	        this.type = 'filter';
	        this.ins = ins;
	        this.out = NO;
	        this.passes = passes;
	    }
	    FilterOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    FilterOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    FilterOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            if (this.passes(t))
	                u._n(t);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FilterOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FilterOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FilterOperator;
	}());
	exports.FilterOperator = FilterOperator;
	var FlattenListener = (function () {
	    function FlattenListener(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    FlattenListener.prototype._n = function (t) {
	        this.out._n(t);
	    };
	    FlattenListener.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    FlattenListener.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return FlattenListener;
	}());
	var FlattenOperator = (function () {
	    function FlattenOperator(ins) {
	        this.type = 'flatten';
	        this.ins = ins;
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    }
	    FlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.ins._add(this);
	    };
	    FlattenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    FlattenOperator.prototype.less = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (!this.open && this.inner === NO)
	            u._c();
	    };
	    FlattenOperator.prototype._n = function (s) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new FlattenListener(u, this));
	    };
	    FlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return FlattenOperator;
	}());
	exports.FlattenOperator = FlattenOperator;
	var FoldOperator = (function () {
	    function FoldOperator(f, seed, ins) {
	        this.type = 'fold';
	        this.ins = ins;
	        this.out = NO;
	        this.f = f;
	        this.acc = this.seed = seed;
	    }
	    FoldOperator.prototype._start = function (out) {
	        this.out = out;
	        this.acc = this.seed;
	        out._n(this.acc);
	        this.ins._add(this);
	    };
	    FoldOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.acc = this.seed;
	    };
	    FoldOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.acc = this.f(this.acc, t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FoldOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FoldOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FoldOperator;
	}());
	exports.FoldOperator = FoldOperator;
	var LastOperator = (function () {
	    function LastOperator(ins) {
	        this.type = 'last';
	        this.ins = ins;
	        this.out = NO;
	        this.has = false;
	        this.val = NO;
	    }
	    LastOperator.prototype._start = function (out) {
	        this.out = out;
	        this.has = false;
	        this.ins._add(this);
	    };
	    LastOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.val = NO;
	    };
	    LastOperator.prototype._n = function (t) {
	        this.has = true;
	        this.val = t;
	    };
	    LastOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    LastOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.has) {
	            u._n(this.val);
	            u._c();
	        }
	        else {
	            u._e('TODO show proper error');
	        }
	    };
	    return LastOperator;
	}());
	exports.LastOperator = LastOperator;
	var MapFlattenInner = (function () {
	    function MapFlattenInner(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    MapFlattenInner.prototype._n = function (r) {
	        this.out._n(r);
	    };
	    MapFlattenInner.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    MapFlattenInner.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return MapFlattenInner;
	}());
	var MapFlattenOperator = (function () {
	    function MapFlattenOperator(mapOp) {
	        this.type = mapOp.type + "+flatten";
	        this.ins = mapOp.ins;
	        this.out = NO;
	        this.mapOp = mapOp;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	    }
	    MapFlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	        this.mapOp.ins._add(this);
	    };
	    MapFlattenOperator.prototype._stop = function () {
	        this.mapOp.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    MapFlattenOperator.prototype.less = function () {
	        if (!this.open && this.inner === NO) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    MapFlattenOperator.prototype._n = function (v) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        var s;
	        try {
	            s = this.mapOp.project(v);
	        }
	        catch (e) {
	            u._e(e);
	            return;
	        }
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new MapFlattenInner(u, this));
	    };
	    MapFlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapFlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return MapFlattenOperator;
	}());
	exports.MapFlattenOperator = MapFlattenOperator;
	var MapOperator = (function () {
	    function MapOperator(project, ins) {
	        this.type = 'map';
	        this.ins = ins;
	        this.out = NO;
	        this.project = project;
	    }
	    MapOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    MapOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    MapOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.project(t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    MapOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return MapOperator;
	}());
	exports.MapOperator = MapOperator;
	var FilterMapOperator = (function (_super) {
	    __extends(FilterMapOperator, _super);
	    function FilterMapOperator(passes, project, ins) {
	        _super.call(this, project, ins);
	        this.type = 'filter+map';
	        this.passes = passes;
	    }
	    FilterMapOperator.prototype._n = function (v) {
	        if (this.passes(v)) {
	            _super.prototype._n.call(this, v);
	        }
	        ;
	    };
	    return FilterMapOperator;
	}(MapOperator));
	exports.FilterMapOperator = FilterMapOperator;
	var RememberOperator = (function () {
	    function RememberOperator(ins) {
	        this.type = 'remember';
	        this.ins = ins;
	        this.out = NO;
	    }
	    RememberOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(out);
	    };
	    RememberOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return RememberOperator;
	}());
	exports.RememberOperator = RememberOperator;
	var ReplaceErrorOperator = (function () {
	    function ReplaceErrorOperator(fn, ins) {
	        this.type = 'replaceError';
	        this.ins = ins;
	        this.out = NO;
	        this.fn = fn;
	    }
	    ReplaceErrorOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    ReplaceErrorOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    ReplaceErrorOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    ReplaceErrorOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            this.ins._remove(this);
	            (this.ins = this.fn(err))._add(this);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    ReplaceErrorOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return ReplaceErrorOperator;
	}());
	exports.ReplaceErrorOperator = ReplaceErrorOperator;
	var StartWithOperator = (function () {
	    function StartWithOperator(ins, val) {
	        this.type = 'startWith';
	        this.ins = ins;
	        this.out = NO;
	        this.val = val;
	    }
	    StartWithOperator.prototype._start = function (out) {
	        this.out = out;
	        this.out._n(this.val);
	        this.ins._add(out);
	    };
	    StartWithOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return StartWithOperator;
	}());
	exports.StartWithOperator = StartWithOperator;
	var TakeOperator = (function () {
	    function TakeOperator(max, ins) {
	        this.type = 'take';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.taken = 0;
	    }
	    TakeOperator.prototype._start = function (out) {
	        this.out = out;
	        this.taken = 0;
	        if (this.max <= 0) {
	            out._c();
	        }
	        else {
	            this.ins._add(this);
	        }
	    };
	    TakeOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    TakeOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.taken++ < this.max - 1) {
	            u._n(t);
	        }
	        else {
	            u._n(t);
	            u._c();
	        }
	    };
	    TakeOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    TakeOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return TakeOperator;
	}());
	exports.TakeOperator = TakeOperator;
	var Stream = (function () {
	    function Stream(producer) {
	        this._prod = producer || NO;
	        this._ils = [];
	        this._stopID = NO;
	        this._dl = NO;
	        this._d = false;
	        this._target = NO;
	        this._err = NO;
	    }
	    Stream.prototype._n = function (t) {
	        var a = this._ils;
	        var L = a.length;
	        if (this._d)
	            this._dl._n(t);
	        if (L == 1)
	            a[0]._n(t);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._n(t);
	        }
	    };
	    Stream.prototype._e = function (err) {
	        if (this._err !== NO)
	            return;
	        this._err = err;
	        var a = this._ils;
	        var L = a.length;
	        this._x();
	        if (this._d)
	            this._dl._e(err);
	        if (L == 1)
	            a[0]._e(err);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._e(err);
	        }
	    };
	    Stream.prototype._c = function () {
	        var a = this._ils;
	        var L = a.length;
	        this._x();
	        if (this._d)
	            this._dl._c();
	        if (L == 1)
	            a[0]._c();
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._c();
	        }
	    };
	    Stream.prototype._x = function () {
	        if (this._ils.length === 0)
	            return;
	        if (this._prod !== NO)
	            this._prod._stop();
	        this._err = NO;
	        this._ils = [];
	    };
	    Stream.prototype._stopNow = function () {
	        // WARNING: code that calls this method should
	        // first check if this._prod is valid (not `NO`)
	        this._prod._stop();
	        this._err = NO;
	        this._stopID = NO;
	    };
	    Stream.prototype._add = function (il) {
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._add(il);
	        var a = this._ils;
	        a.push(il);
	        if (a.length > 1)
	            return;
	        if (this._stopID !== NO) {
	            clearTimeout(this._stopID);
	            this._stopID = NO;
	        }
	        else {
	            var p = this._prod;
	            if (p !== NO)
	                p._start(this);
	        }
	    };
	    Stream.prototype._remove = function (il) {
	        var _this = this;
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._remove(il);
	        var a = this._ils;
	        var i = a.indexOf(il);
	        if (i > -1) {
	            a.splice(i, 1);
	            if (this._prod !== NO && a.length <= 0) {
	                this._err = NO;
	                this._stopID = setTimeout(function () { return _this._stopNow(); });
	            }
	            else if (a.length === 1) {
	                this._pruneCycles();
	            }
	        }
	    };
	    // If all paths stemming from `this` stream eventually end at `this`
	    // stream, then we remove the single listener of `this` stream, to
	    // force it to end its execution and dispose resources. This method
	    // assumes as a precondition that this._ils has just one listener.
	    Stream.prototype._pruneCycles = function () {
	        if (this._hasNoSinks(this, [])) {
	            this._remove(this._ils[0]);
	        }
	    };
	    // Checks whether *there is no* path starting from `x` that leads to an end
	    // listener (sink) in the stream graph, following edges A->B where B is a
	    // listener of A. This means these paths constitute a cycle somehow. Is given
	    // a trace of all visited nodes so far.
	    Stream.prototype._hasNoSinks = function (x, trace) {
	        if (trace.indexOf(x) !== -1) {
	            return true;
	        }
	        else if (x.out === this) {
	            return true;
	        }
	        else if (x.out && x.out !== NO) {
	            return this._hasNoSinks(x.out, trace.concat(x));
	        }
	        else if (x._ils) {
	            for (var i = 0, N = x._ils.length; i < N; i++) {
	                if (!this._hasNoSinks(x._ils[i], trace.concat(x))) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        else {
	            return false;
	        }
	    };
	    Stream.prototype.ctor = function () {
	        return this instanceof MemoryStream ? MemoryStream : Stream;
	    };
	    /**
	     * Adds a Listener to the Stream.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.addListener = function (listener) {
	        listener._n = listener.next || noop;
	        listener._e = listener.error || noop;
	        listener._c = listener.complete || noop;
	        this._add(listener);
	    };
	    /**
	     * Removes a Listener from the Stream, assuming the Listener was added to it.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.removeListener = function (listener) {
	        this._remove(listener);
	    };
	    /**
	     * Adds a Listener to the Stream returning a Subscription to remove that
	     * listener.
	     *
	     * @param {Listener} listener
	     * @returns {Subscription}
	     */
	    Stream.prototype.subscribe = function (listener) {
	        this.addListener(listener);
	        return new Subscription(this, listener);
	    };
	    /**
	     * Add interop between most.js and RxJS 5
	     *
	     * @returns {Stream}
	     */
	    Stream.prototype[symbol_observable_1.default] = function () {
	        return this;
	    };
	    /**
	     * Creates a new Stream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {Stream}
	     */
	    Stream.create = function (producer) {
	        if (producer) {
	            if (typeof producer.start !== 'function'
	                || typeof producer.stop !== 'function') {
	                throw new Error('producer requires both start and stop functions');
	            }
	            internalizeProducer(producer); // mutates the input
	        }
	        return new Stream(producer);
	    };
	    /**
	     * Creates a new MemoryStream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {MemoryStream}
	     */
	    Stream.createWithMemory = function (producer) {
	        if (producer) {
	            internalizeProducer(producer); // mutates the input
	        }
	        return new MemoryStream(producer);
	    };
	    /**
	     * Creates a Stream that does nothing when started. It never emits any event.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *          never
	     * -----------------------
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.never = function () {
	        return new Stream({ _start: noop, _stop: noop });
	    };
	    /**
	     * Creates a Stream that immediately emits the "complete" notification when
	     * started, and that's it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * empty
	     * -|
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.empty = function () {
	        return new Stream({
	            _start: function (il) { il._c(); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a Stream that immediately emits an "error" notification with the
	     * value you passed as the `error` argument when the stream starts, and that's
	     * it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * throw(X)
	     * -X
	     * ```
	     *
	     * @factory true
	     * @param error The error event to emit on the created stream.
	     * @return {Stream}
	     */
	    Stream.throw = function (error) {
	        return new Stream({
	            _start: function (il) { il._e(error); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a stream from an Array, Promise, or an Observable.
	     *
	     * @factory true
	     * @param {Array|Promise|Observable} input The input to make a stream from.
	     * @return {Stream}
	     */
	    Stream.from = function (input) {
	        if (typeof input[symbol_observable_1.default] === 'function') {
	            return Stream.fromObservable(input);
	        }
	        else if (typeof input.then === 'function') {
	            return Stream.fromPromise(input);
	        }
	        else if (Array.isArray(input)) {
	            return Stream.fromArray(input);
	        }
	        throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
	    };
	    /**
	     * Creates a Stream that immediately emits the arguments that you give to
	     * *of*, then completes.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * of(1,2,3)
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param a The first value you want to emit as an event on the stream.
	     * @param b The second value you want to emit as an event on the stream. One
	     * or more of these values may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.of = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        return Stream.fromArray(items);
	    };
	    /**
	     * Converts an array to a stream. The returned stream will emit synchronously
	     * all the items in the array, and then complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromArray([1,2,3])
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param {Array} array The array to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromArray = function (array) {
	        return new Stream(new FromArrayProducer(array));
	    };
	    /**
	     * Converts a promise to a stream. The returned stream will emit the resolved
	     * value of the promise, and then complete. However, if the promise is
	     * rejected, the stream will emit the corresponding error.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromPromise( ----42 )
	     * -----------------42|
	     * ```
	     *
	     * @factory true
	     * @param {Promise} promise The promise to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromPromise = function (promise) {
	        return new Stream(new FromPromiseProducer(promise));
	    };
	    /**
	     * Converts an Observable into a Stream.
	     *
	     * @factory true
	     * @param {any} observable The observable to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromObservable = function (observable) {
	        return new Stream(new ObservableProducer(observable));
	    };
	    /**
	     * Creates a stream that periodically emits incremental numbers, every
	     * `period` milliseconds.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *     periodic(1000)
	     * ---0---1---2---3---4---...
	     * ```
	     *
	     * @factory true
	     * @param {number} period The interval in milliseconds to use as a rate of
	     * emission.
	     * @return {Stream}
	     */
	    Stream.periodic = function (period) {
	        return new Stream(new PeriodicProducer(period));
	    };
	    Stream.prototype._map = function (project) {
	        var p = this._prod;
	        var ctor = this.ctor();
	        if (p instanceof FilterOperator) {
	            return new ctor(new FilterMapOperator(p.passes, project, p.ins));
	        }
	        if (p instanceof FilterMapOperator) {
	            return new ctor(new FilterMapOperator(p.passes, compose2(project, p.project), p.ins));
	        }
	        if (p instanceof MapOperator) {
	            return new ctor(new MapOperator(compose2(project, p.project), p.ins));
	        }
	        return new ctor(new MapOperator(project, this));
	    };
	    /**
	     * Transforms each event from the input Stream through a `project` function,
	     * to get a Stream that emits those transformed events.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7------
	     *    map(i => i * 10)
	     * --10--30-50----70-----
	     * ```
	     *
	     * @param {Function} project A function of type `(t: T) => U` that takes event
	     * `t` of type `T` from the input Stream and produces an event of type `U`, to
	     * be emitted on the output Stream.
	     * @return {Stream}
	     */
	    Stream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    /**
	     * It's like `map`, but transforms each input event to always the same
	     * constant value on the output Stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7-----
	     *       mapTo(10)
	     * --10--10-10----10----
	     * ```
	     *
	     * @param projectedValue A value to emit on the output Stream whenever the
	     * input Stream emits any value.
	     * @return {Stream}
	     */
	    Stream.prototype.mapTo = function (projectedValue) {
	        var s = this.map(function () { return projectedValue; });
	        var op = s._prod;
	        op.type = op.type.replace('map', 'mapTo');
	        return s;
	    };
	    /**
	     * Only allows events that pass the test given by the `passes` argument.
	     *
	     * Each event from the input stream is given to the `passes` function. If the
	     * function returns `true`, the event is forwarded to the output stream,
	     * otherwise it is ignored and not forwarded.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2--3-----4-----5---6--7-8--
	     *     filter(i => i % 2 === 0)
	     * ------2--------4---------6----8--
	     * ```
	     *
	     * @param {Function} passes A function of type `(t: T) +> boolean` that takes
	     * an event from the input stream and checks if it passes, by returning a
	     * boolean.
	     * @return {Stream}
	     */
	    Stream.prototype.filter = function (passes) {
	        var p = this._prod;
	        if (p instanceof FilterOperator) {
	            return new Stream(new FilterOperator(and(p.passes, passes), p.ins));
	        }
	        return new Stream(new FilterOperator(passes, this));
	    };
	    /**
	     * Lets the first `amount` many events from the input stream pass to the
	     * output stream, then makes the output stream complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *    take(3)
	     * --a---b--c|
	     * ```
	     *
	     * @param {number} amount How many events to allow from the input stream
	     * before completing the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.take = function (amount) {
	        return new (this.ctor())(new TakeOperator(amount, this));
	    };
	    /**
	     * Ignores the first `amount` many events from the input stream, and then
	     * after that starts forwarding events from the input stream to the output
	     * stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *       drop(3)
	     * --------------d---e--
	     * ```
	     *
	     * @param {number} amount How many events to ignore from the input stream
	     * before forwarding all events from the input stream to the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.drop = function (amount) {
	        return new Stream(new DropOperator(amount, this));
	    };
	    /**
	     * When the input stream completes, the output stream will emit the last event
	     * emitted by the input stream, and then will also complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c--d----|
	     *       last()
	     * -----------------d|
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.last = function () {
	        return new Stream(new LastOperator(this));
	    };
	    /**
	     * Prepends the given `initial` value to the sequence of events emitted by the
	     * input stream. The returned stream is a MemoryStream, which means it is
	     * already `remember()`'d.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3---
	     *   startWith(0)
	     * 0--1---2-----3---
	     * ```
	     *
	     * @param initial The value or event to prepend.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.startWith = function (initial) {
	        return new MemoryStream(new StartWithOperator(this, initial));
	    };
	    /**
	     * Uses another stream to determine when to complete the current stream.
	     *
	     * When the given `other` stream emits an event or completes, the output
	     * stream will complete. Before that happens, the output stream will behaves
	     * like the input stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3--4----5----6---
	     *   endWhen( --------a--b--| )
	     * ---1---2-----3--4--|
	     * ```
	     *
	     * @param other Some other stream that is used to know when should the output
	     * stream of this operator complete.
	     * @return {Stream}
	     */
	    Stream.prototype.endWhen = function (other) {
	        return new (this.ctor())(new EndWhenOperator(other, this));
	    };
	    /**
	     * "Folds" the stream onto itself.
	     *
	     * Combines events from the past throughout
	     * the entire execution of the input stream, allowing you to accumulate them
	     * together. It's essentially like `Array.prototype.reduce`. The returned
	     * stream is a MemoryStream, which means it is already `remember()`'d.
	     *
	     * The output stream starts by emitting the `seed` which you give as argument.
	     * Then, when an event happens on the input stream, it is combined with that
	     * seed value through the `accumulate` function, and the output value is
	     * emitted on the output stream. `fold` remembers that output value as `acc`
	     * ("accumulator"), and then when a new input event `t` happens, `acc` will be
	     * combined with that to produce the new `acc` and so forth.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ------1-----1--2----1----1------
	     *   fold((acc, x) => acc + x, 3)
	     * 3-----4-----5--7----8----9------
	     * ```
	     *
	     * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
	     * takes the previous accumulated value `acc` and the incoming event from the
	     * input stream and produces the new accumulated value.
	     * @param seed The initial accumulated value, of type `R`.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.fold = function (accumulate, seed) {
	        return new MemoryStream(new FoldOperator(accumulate, seed, this));
	    };
	    /**
	     * Replaces an error with another stream.
	     *
	     * When (and if) an error happens on the input stream, instead of forwarding
	     * that error to the output stream, *replaceError* will call the `replace`
	     * function which returns the stream that the output stream will replicate.
	     * And, in case that new stream also emits an error, `replace` will be called
	     * again to get another stream to start replicating.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2-----3--4-----X
	     *   replaceError( () => --10--| )
	     * --1---2-----3--4--------10--|
	     * ```
	     *
	     * @param {Function} replace A function of type `(err) => Stream` that takes
	     * the error that occurred on the input stream or on the previous replacement
	     * stream and returns a new stream. The output stream will behave like the
	     * stream that this function returns.
	     * @return {Stream}
	     */
	    Stream.prototype.replaceError = function (replace) {
	        return new (this.ctor())(new ReplaceErrorOperator(replace, this));
	    };
	    /**
	     * Flattens a "stream of streams", handling only one nested stream at a time
	     * (no concurrency).
	     *
	     * If the input stream is a stream that emits streams, then this operator will
	     * return an output stream which is a flat stream: emits regular events. The
	     * flattening happens without concurrency. It works like this: when the input
	     * stream emits a nested stream, *flatten* will start imitating that nested
	     * one. However, as soon as the next nested stream is emitted on the input
	     * stream, *flatten* will forget the previous nested one it was imitating, and
	     * will start imitating the new nested one.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --+--------+---------------
	     *   \        \
	     *    \       ----1----2---3--
	     *    --a--b----c----d--------
	     *           flatten
	     * -----a--b------1----2---3--
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.flatten = function () {
	        var p = this._prod;
	        return new Stream(p instanceof MapOperator && !(p instanceof FilterMapOperator) ?
	            new MapFlattenOperator(p) :
	            new FlattenOperator(this));
	    };
	    /**
	     * Passes the input stream to a custom operator, to produce an output stream.
	     *
	     * *compose* is a handy way of using an existing function in a chained style.
	     * Instead of writing `outStream = f(inStream)` you can write
	     * `outStream = inStream.compose(f)`.
	     *
	     * @param {function} operator A function that takes a stream as input and
	     * returns a stream as well.
	     * @return {Stream}
	     */
	    Stream.prototype.compose = function (operator) {
	        return operator(this);
	    };
	    /**
	     * Returns an output stream that behaves like the input stream, but also
	     * remembers the most recent event that happens on the input stream, so that a
	     * newly added listener will immediately receive that memorised event.
	     *
	     * @return {MemoryStream}
	     */
	    Stream.prototype.remember = function () {
	        return new MemoryStream(new RememberOperator(this));
	    };
	    /**
	     * Returns an output stream that identically behaves like the input stream,
	     * but also runs a `spy` function fo each event, to help you debug your app.
	     *
	     * *debug* takes a `spy` function as argument, and runs that for each event
	     * happening on the input stream. If you don't provide the `spy` argument,
	     * then *debug* will just `console.log` each event. This helps you to
	     * understand the flow of events through some operator chain.
	     *
	     * Please note that if the output stream has no listeners, then it will not
	     * start, which means `spy` will never run because no actual event happens in
	     * that case.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3-----4--
	     *         debug
	     * --1----2-----3-----4--
	     * ```
	     *
	     * @param {function} labelOrSpy A string to use as the label when printing
	     * debug information on the console, or a 'spy' function that takes an event
	     * as argument, and does not need to return anything.
	     * @return {Stream}
	     */
	    Stream.prototype.debug = function (labelOrSpy) {
	        return new (this.ctor())(new DebugOperator(this, labelOrSpy));
	    };
	    /**
	     * *imitate* changes this current Stream to emit the same events that the
	     * `other` given Stream does. This method returns nothing.
	     *
	     * This method exists to allow one thing: **circular dependency of streams**.
	     * For instance, let's imagine that for some reason you need to create a
	     * circular dependency where stream `first$` depends on stream `second$`
	     * which in turn depends on `first$`:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var first$ = second$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * ```
	     *
	     * However, that is invalid JavaScript, because `second$` is undefined
	     * on the first line. This is how *imitate* can help solve it:
	     *
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var secondProxy$ = xs.create();
	     * var first$ = secondProxy$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * secondProxy$.imitate(second$);
	     * ```
	     *
	     * We create `secondProxy$` before the others, so it can be used in the
	     * declaration of `first$`. Then, after both `first$` and `second$` are
	     * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
	     * that they are "the same". `imitate` will not trigger the start of any
	     * stream, it just binds `secondProxy$` and `second$` together.
	     *
	     * The following is an example where `imitate()` is important in Cycle.js
	     * applications. A parent component contains some child components. A child
	     * has an action stream which is given to the parent to define its state:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * const childActionProxy$ = xs.create();
	     * const parent = Parent({...sources, childAction$: childActionProxy$});
	     * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
	     * childActionProxy$.imitate(childAction$);
	     * ```
	     *
	     * Note, though, that **`imitate()` does not support MemoryStreams**. If we
	     * would attempt to imitate a MemoryStream in a circular dependency, we would
	     * either get a race condition (where the symptom would be "nothing happens")
	     * or an infinite cyclic emission of values. It's useful to think about
	     * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
	     * define a spreadsheet cell `A1` with a formula that depends on `B1` and
	     * cell `B1` defined with a formula that depends on `A1`.
	     *
	     * If you find yourself wanting to use `imitate()` with a
	     * MemoryStream, you should rework your code around `imitate()` to use a
	     * Stream instead. Look for the stream in the circular dependency that
	     * represents an event stream, and that would be a candidate for creating a
	     * proxy Stream which then imitates the target Stream.
	     *
	     * @param {Stream} target The other stream to imitate on the current one. Must
	     * not be a MemoryStream.
	     */
	    Stream.prototype.imitate = function (target) {
	        if (target instanceof MemoryStream) {
	            throw new Error('A MemoryStream was given to imitate(), but it only ' +
	                'supports a Stream. Read more about this restriction here: ' +
	                'https://github.com/staltz/xstream#faq');
	        }
	        this._target = target;
	        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++) {
	            target._add(ils[i]);
	        }
	        this._ils = [];
	    };
	    /**
	     * Forces the Stream to emit the given value to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param value The "next" value you want to broadcast to all listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendNext = function (value) {
	        this._n(value);
	    };
	    /**
	     * Forces the Stream to emit the given error to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param {any} error The error you want to broadcast to all the listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendError = function (error) {
	        this._e(error);
	    };
	    /**
	     * Forces the Stream to emit the "completed" event to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     */
	    Stream.prototype.shamefullySendComplete = function () {
	        this._c();
	    };
	    /**
	     * Adds a "debug" listener to the stream. There can only be one debug
	     * listener, that's why this is 'setDebugListener'. To remove the debug
	     * listener, just call setDebugListener(null).
	     *
	     * A debug listener is like any other listener. The only difference is that a
	     * debug listener is "stealthy": its presence/absence does not trigger the
	     * start/stop of the stream (or the producer inside the stream). This is
	     * useful so you can inspect what is going on without changing the behavior
	     * of the program. If you have an idle stream and you add a normal listener to
	     * it, the stream will start executing. But if you set a debug listener on an
	     * idle stream, it won't start executing (not until the first normal listener
	     * is added).
	     *
	     * As the name indicates, we don't recommend using this method to build app
	     * logic. In fact, in most cases the debug operator works just fine. Only use
	     * this one if you know what you're doing.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.setDebugListener = function (listener) {
	        if (!listener) {
	            this._d = false;
	            this._dl = NO;
	        }
	        else {
	            this._d = true;
	            listener._n = listener.next;
	            listener._e = listener.error;
	            listener._c = listener.complete;
	            this._dl = listener;
	        }
	    };
	    /**
	     * Blends multiple streams together, emitting events from all of them
	     * concurrently.
	     *
	     * *merge* takes multiple streams as arguments, and creates a stream that
	     * behaves like each of the argument streams, in parallel.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b----c---d------
	     *            merge
	     * --1-a--2--b--3-c---d--4---
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to merge together with other streams.
	     * @param {Stream} stream2 A stream to merge together with other streams. Two
	     * or more streams may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.merge = function merge() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new MergeProducer(streams));
	    };
	    /**
	     * Combines multiple input streams together to return a stream whose events
	     * are arrays that collect the latest events from each input stream.
	     *
	     * *combine* internally remembers the most recent event from each of the input
	     * streams. When any of the input streams emits an event, that event together
	     * with all the other saved events are combined into an array. That array will
	     * be emitted on the output stream. It's essentially a way of joining together
	     * the events from multiple streams.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b-----c--d------
	     *          combine
	     * ----1a-2a-2b-3b-3c-3d-4d--
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to combine together with other streams.
	     * @param {Stream} stream2 A stream to combine together with other streams.
	     * Multiple streams, not just two, may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.combine = function combine() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new CombineProducer(streams));
	    };
	    return Stream;
	}());
	exports.Stream = Stream;
	var MemoryStream = (function (_super) {
	    __extends(MemoryStream, _super);
	    function MemoryStream(producer) {
	        _super.call(this, producer);
	        this._has = false;
	    }
	    MemoryStream.prototype._n = function (x) {
	        this._v = x;
	        this._has = true;
	        _super.prototype._n.call(this, x);
	    };
	    MemoryStream.prototype._add = function (il) {
	        if (this._has) {
	            il._n(this._v);
	        }
	        _super.prototype._add.call(this, il);
	    };
	    MemoryStream.prototype._stopNow = function () {
	        this._has = false;
	        _super.prototype._stopNow.call(this);
	    };
	    MemoryStream.prototype._x = function () {
	        this._has = false;
	        _super.prototype._x.call(this);
	    };
	    MemoryStream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    MemoryStream.prototype.mapTo = function (projectedValue) {
	        return _super.prototype.mapTo.call(this, projectedValue);
	    };
	    MemoryStream.prototype.take = function (amount) {
	        return _super.prototype.take.call(this, amount);
	    };
	    MemoryStream.prototype.endWhen = function (other) {
	        return _super.prototype.endWhen.call(this, other);
	    };
	    MemoryStream.prototype.replaceError = function (replace) {
	        return _super.prototype.replaceError.call(this, replace);
	    };
	    MemoryStream.prototype.remember = function () {
	        return this;
	    };
	    MemoryStream.prototype.debug = function (labelOrSpy) {
	        return _super.prototype.debug.call(this, labelOrSpy);
	    };
	    return MemoryStream;
	}(Stream));
	exports.MemoryStream = MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Stream;
	//# sourceMappingURL=core.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ponyfill = __webpack_require__(6);

	var _ponyfill2 = _interopRequireDefault(_ponyfill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var root; /* global window */


	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (true) {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};

/***/ }
/******/ ])
});
;