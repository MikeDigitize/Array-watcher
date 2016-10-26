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

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.AoArray = AoArray;

	__webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ArrayWatcher = function (_Array) {
		_inherits(ArrayWatcher, _Array);

		function ArrayWatcher() {
			_classCallCheck(this, ArrayWatcher);

			return _possibleConstructorReturn(this, (ArrayWatcher.__proto__ || Object.getPrototypeOf(ArrayWatcher)).apply(this, arguments));
		}

		_createClass(ArrayWatcher, [{
			key: 'watch',
			value: function watch(method, callback) {
				var _this2 = this;

				if (!this.notify) {
					this.notify = {};
				}

				var eventName = method + '-notify';
				var pureArray = Object.keys(this).filter(function (key) {
					return !isNaN(Number(key));
				}).map(function (key) {
					return _this2[key];
				});

				this.notify[method] = createArrayEvent(eventName);
				this[method] = function () {

					if (this.notify && this.notify[method]) {
						window.dispatchEvent(this.notify[method]);
					}

					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					return Object.create(Array.prototype)[method].apply(this, args);
				};

				window.addEventListener(eventName, callback.bind(pureArray, method));

				return pureArray;
			}
		}]);

		return ArrayWatcher;
	}(Array);

	function createArrayEvent(customType) {

		if (document.createEvent) {

			var event = document.createEvent('CustomEvent');
			event.initEvent(customType, true, true);
			return event;
		} else {
			return new Event(customType);
		}
	}

	function AoArray() {

		var watcher = Object.create(ArrayWatcher.prototype);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		watcher.push.apply(watcher, args);
		return watcher;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.assign != 'function') {
	  (function () {
	    Object.assign = function (target) {
	      'use strict';
	      // We must check against these specific cases.

	      if (target === undefined || target === null) {
	        throw new TypeError('Cannot convert undefined or null to object');
	      }

	      var output = Object(target);
	      for (var index = 1; index < arguments.length; index++) {
	        var source = arguments[index];
	        if (source !== undefined && source !== null) {
	          for (var nextKey in source) {
	            if (source.hasOwnProperty(nextKey)) {
	              output[nextKey] = source[nextKey];
	            }
	          }
	        }
	      }
	      return output;
	    };
	  })();
	}

/***/ }
/******/ ])
});
;