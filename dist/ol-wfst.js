(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol'), require('ol/format'), require('ol/source'), require('ol/layer'), require('ol/interaction'), require('ol/Observable'), require('ol/geom'), require('ol/loadingstrategy'), require('ol/extent'), require('ol/style'), require('ol/control'), require('ol/TileState'), require('ol/proj')) :
    typeof define === 'function' && define.amd ? define(['ol', 'ol/format', 'ol/source', 'ol/layer', 'ol/interaction', 'ol/Observable', 'ol/geom', 'ol/loadingstrategy', 'ol/extent', 'ol/style', 'ol/control', 'ol/TileState', 'ol/proj'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(global.ol, global.ol.format, global.ol.source, global.ol.layer, global.ol.interaction, global.ol.Observable, global.ol.geom, global.ol.loadingstrategy, global.ol.extent, global.ol.style, global.ol.control, global.TileState, global.ol.proj));
}(this, (function (ol, format, source, layer, interaction, Observable$1, geom, loadingstrategy, extent, style, control, TileState, proj) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var TileState__default = /*#__PURE__*/_interopDefaultLegacy(TileState);

    /**
     * @module ol/events/EventType
     */
    /**
     * @enum {string}
     * @const
     */
    var EventType = {
        /**
         * Generic change event. Triggered when the revision counter is increased.
         * @event module:ol/events/Event~BaseEvent#change
         * @api
         */
        CHANGE: 'change',
        /**
         * Generic error event. Triggered when an error occurs.
         * @event module:ol/events/Event~BaseEvent#error
         * @api
         */
        ERROR: 'error',
        BLUR: 'blur',
        CLEAR: 'clear',
        CONTEXTMENU: 'contextmenu',
        CLICK: 'click',
        DBLCLICK: 'dblclick',
        DRAGENTER: 'dragenter',
        DRAGOVER: 'dragover',
        DROP: 'drop',
        FOCUS: 'focus',
        KEYDOWN: 'keydown',
        KEYPRESS: 'keypress',
        LOAD: 'load',
        RESIZE: 'resize',
        TOUCHMOVE: 'touchmove',
        WHEEL: 'wheel',
    };

    /**
     * @module ol/array
     */
    /**
     * Compare function for array sort that is safe for numbers.
     * @param {*} a The first object to be compared.
     * @param {*} b The second object to be compared.
     * @return {number} A negative number, zero, or a positive number as the first
     *     argument is less than, equal to, or greater than the second.
     */
    function numberSafeCompareFunction(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
    }
    /**
     * @param {Array<VALUE>} arr The array to modify.
     * @param {!Array<VALUE>|VALUE} data The elements or arrays of elements to add to arr.
     * @template VALUE
     */
    function extend(arr, data) {
        var extension = Array.isArray(data) ? data : [data];
        var length = extension.length;
        for (var i = 0; i < length; i++) {
            arr[arr.length] = extension[i];
        }
    }
    /**
     * @param {Array|Uint8ClampedArray} arr1 The first array to compare.
     * @param {Array|Uint8ClampedArray} arr2 The second array to compare.
     * @return {boolean} Whether the two arrays are equal.
     */
    function equals(arr1, arr2) {
        var len1 = arr1.length;
        if (len1 !== arr2.length) {
            return false;
        }
        for (var i = 0; i < len1; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @module ol/functions
     */
    /**
     * Always returns false.
     * @returns {boolean} false.
     */
    function FALSE() {
        return false;
    }
    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {void} Nothing.
     */
    function VOID() { }
    /**
     * Wrap a function in another function that remembers the last return.  If the
     * returned function is called twice in a row with the same arguments and the same
     * this object, it will return the value from the first call in the second call.
     *
     * @param {function(...any): ReturnType} fn The function to memoize.
     * @return {function(...any): ReturnType} The memoized function.
     * @template ReturnType
     */
    function memoizeOne(fn) {
        var called = false;
        /** @type {ReturnType} */
        var lastResult;
        /** @type {Array<any>} */
        var lastArgs;
        var lastThis;
        return function () {
            var nextArgs = Array.prototype.slice.call(arguments);
            if (!called || this !== lastThis || !equals(nextArgs, lastArgs)) {
                called = true;
                lastThis = this;
                lastArgs = nextArgs;
                lastResult = fn.apply(this, arguments);
            }
            return lastResult;
        };
    }

    /**
     * @module ol/util
     */
    /**
     * @return {?} Any return.
     */
    function abstract() {
        return /** @type {?} */ ((function () {
            throw new Error('Unimplemented abstract method.');
        })());
    }
    /**
     * Counter for getUid.
     * @type {number}
     * @private
     */
    var uidCounter_ = 0;
    /**
     * Gets a unique ID for an object. This mutates the object so that further calls
     * with the same object as a parameter returns the same value. Unique IDs are generated
     * as a strictly increasing sequence. Adapted from goog.getUid.
     *
     * @param {Object} obj The object to get the unique ID for.
     * @return {string} The unique ID for the object.
     * @api
     */
    function getUid(obj) {
        return obj.ol_uid || (obj.ol_uid = String(++uidCounter_));
    }
    /**
     * OpenLayers version.
     * @type {string}
     */
    var VERSION = '6.5.0';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Error object thrown when an assertion failed. This is an ECMA-262 Error,
     * extended with a `code` property.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
     */
    var AssertionError = /** @class */ (function (_super) {
        __extends(AssertionError, _super);
        /**
         * @param {number} code Error code.
         */
        function AssertionError(code) {
            var _this = this;
            var path =  'v' + VERSION.split('-')[0];
            var message = 'Assertion failed. See https://openlayers.org/en/' +
                path +
                '/doc/errors/#' +
                code +
                ' for details.';
            _this = _super.call(this, message) || this;
            /**
             * Error code. The meaning of the code can be found on
             * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
             * the version found in the OpenLayers script's header comment if a version
             * other than the latest is used).
             * @type {number}
             * @api
             */
            _this.code = code;
            /**
             * @type {string}
             */
            _this.name = 'AssertionError';
            // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
            _this.message = message;
            return _this;
        }
        return AssertionError;
    }(Error));

    /**
     * @module ol/asserts
     */
    /**
     * @param {*} assertion Assertion we expected to be truthy.
     * @param {number} errorCode Error code.
     */
    function assert(assertion, errorCode) {
        if (!assertion) {
            throw new AssertionError(errorCode);
        }
    }

    /**
     * @module ol/events/condition
     */
    /**
     * Return always false.
     *
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} False.
     * @api
     */
    var never = FALSE;
    /**
     * Return `true` if the event originates from a primary pointer in
     * contact with the surface or if the left mouse button is pressed.
     * See http://www.w3.org/TR/pointerevents/#button-states.
     *
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
     * @return {boolean} True if the event originates from a primary pointer.
     * @api
     */
    var primaryAction = function (mapBrowserEvent) {
        var pointerEvent = /** @type {import("../MapBrowserEvent").default} */ (mapBrowserEvent)
            .originalEvent;
        assert(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
        return pointerEvent.isPrimary && pointerEvent.button === 0;
    };

    /**
     * @module ol/OverlayPositioning
     */
    /**
     * Overlay position: `'bottom-left'`, `'bottom-center'`,  `'bottom-right'`,
     * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
     * `'top-center'`, `'top-right'`
     * @enum {string}
     */
    var OverlayPositioning = {
        BOTTOM_LEFT: 'bottom-left',
        BOTTOM_CENTER: 'bottom-center',
        BOTTOM_RIGHT: 'bottom-right',
        CENTER_LEFT: 'center-left',
        CENTER_CENTER: 'center-center',
        CENTER_RIGHT: 'center-right',
        TOP_LEFT: 'top-left',
        TOP_CENTER: 'top-center',
        TOP_RIGHT: 'top-right',
    };

    var domain;

    // This constructor is used to store event handlers. Instantiating this is
    // faster than explicitly calling `Object.create(null)` to get a "clean" empty
    // object (tested with v8 v4.9).
    function EventHandlers() {}
    EventHandlers.prototype = Object.create(null);

    function EventEmitter() {
      EventEmitter.init.call(this);
    }

    // nodejs oddity
    // require('events') === require('events').EventEmitter
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.usingDomains = false;

    EventEmitter.prototype.domain = undefined;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    EventEmitter.init = function() {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        // if there is an active domain, then attach to it.
        if (domain.active ) ;
      }

      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };

    function $getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };

    // These standalone emit* functions are used to optimize calling of event
    // handlers for fast cases because emit() itself often has a variable number of
    // arguments and can be deoptimized because of that. These functions always have
    // the same number of arguments and thus do not get deoptimized, so the code
    // inside them can execute faster.
    function emitNone(handler, isFn, self) {
      if (isFn)
        handler.call(self);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self);
      }
    }
    function emitOne(handler, isFn, self, arg1) {
      if (isFn)
        handler.call(self, arg1);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1);
      }
    }
    function emitTwo(handler, isFn, self, arg1, arg2) {
      if (isFn)
        handler.call(self, arg1, arg2);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2);
      }
    }
    function emitThree(handler, isFn, self, arg1, arg2, arg3) {
      if (isFn)
        handler.call(self, arg1, arg2, arg3);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2, arg3);
      }
    }

    function emitMany(handler, isFn, self, args) {
      if (isFn)
        handler.apply(self, args);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].apply(self, args);
      }
    }

    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain;
      var doError = (type === 'error');

      events = this._events;
      if (events)
        doError = (doError && events.error == null);
      else if (!doError)
        return false;

      domain = this.domain;

      // If there is no 'error' event listener then throw.
      if (doError) {
        er = arguments[1];
        if (domain) {
          if (!er)
            er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain;
          er.domainThrown = false;
          domain.emit('error', er);
        } else if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
        return false;
      }

      handler = events[type];

      if (!handler)
        return false;

      var isFn = typeof handler === 'function';
      len = arguments.length;
      switch (len) {
        // fast cases
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        // slower
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = target._events;
      if (!events) {
        events = target._events = new EventHandlers();
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (!existing) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] :
                                              [existing, listener];
        } else {
          // If we've already got an array, just append.
          if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
        }

        // Check for listener leak
        if (!existing.warned) {
          m = $getMaxListeners(target);
          if (m && m > 0 && existing.length > m) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' +
                                existing.length + ' ' + type + ' listeners added. ' +
                                'Use emitter.setMaxListeners() to increase limit');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            emitWarning(w);
          }
        }
      }

      return target;
    }
    function emitWarning(e) {
      typeof console.warn === 'function' ? console.warn(e) : console.log(e);
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };

    function _onceWrap(target, type, listener) {
      var fired = false;
      function g() {
        target.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(target, arguments);
        }
      }
      g.listener = listener;
      return g;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;

          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');

          events = this._events;
          if (!events)
            return this;

          list = events[type];
          if (!list)
            return this;

          if (list === listener || (list.listener && list.listener === listener)) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;

            for (i = list.length; i-- > 0;) {
              if (list[i] === listener ||
                  (list[i].listener && list[i].listener === listener)) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }

            if (position < 0)
              return this;

            if (list.length === 1) {
              list[0] = undefined;
              if (--this._eventsCount === 0) {
                this._events = new EventHandlers();
                return this;
              } else {
                delete events[type];
              }
            } else {
              spliceOne(list, position);
            }

            if (events.removeListener)
              this.emit('removeListener', type, originalListener || listener);
          }

          return this;
        };

    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events;

          events = this._events;
          if (!events)
            return this;

          // not listening for removeListener, no need to emit
          if (!events.removeListener) {
            if (arguments.length === 0) {
              this._events = new EventHandlers();
              this._eventsCount = 0;
            } else if (events[type]) {
              if (--this._eventsCount === 0)
                this._events = new EventHandlers();
              else
                delete events[type];
            }
            return this;
          }

          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            for (var i = 0, key; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = new EventHandlers();
            this._eventsCount = 0;
            return this;
          }

          listeners = events[type];

          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners) {
            // LIFO order
            do {
              this.removeListener(type, listeners[listeners.length - 1]);
            } while (listeners[0]);
          }

          return this;
        };

    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;

      if (!events)
        ret = [];
      else {
        evlistener = events[type];
        if (!evlistener)
          ret = [];
        else if (typeof evlistener === 'function')
          ret = [evlistener.listener || evlistener];
        else
          ret = unwrapListeners(evlistener);
      }

      return ret;
    };

    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;

      if (events) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };

    // About 1.5x faster than the two-arg version of Array#splice().
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
        list[i] = list[k];
      list.pop();
    }

    function arrayClone(arr, i) {
      var copy = new Array(i);
      while (i--)
        copy[i] = arr[i];
      return copy;
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    /**
     * Vanilla JS Modal compatible with Bootstrap
     * modal-vanilla 0.9.0 <https://github.com/KaneCohen/modal-vanilla>
     * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
     * Available under BSD-3-Clause license
     */

    const _factory = document.createElement('div');

    const _defaults = Object.freeze({
      el: null,               // Existing DOM element that will be 'Modal-ized'.
      animate: true,          // Show Modal using animation.
      animateClass: 'fade',   //
      animateInClass: 'show', //
      appendTo: 'body',       // DOM element to which constructed Modal will be appended.
      backdrop: true,         // Boolean or 'static', Show Modal backdrop blocking content.
      keyboard: true,         // Close modal on esc key.
      title: false,           // Content of the title in the constructed dialog.
      header: true,           // Show header content.
      content: false,         // Either string or an HTML element.
      footer: true,           // Footer content. By default will use buttons.
      buttons: null,          //
      headerClose: true,      // Show close button in the header.
      construct: false,       // Creates new HTML with a given content.
      transition: 300,        //
      backdropTransition: 150 //
    });

    const _buttons = deepFreeze({
      dialog: [
        {text: 'Cancel',
          value: false,
          attr: {
            'class': 'btn btn-default',
            'data-dismiss': 'modal'
          }
        },
        {text: 'OK',
          value: true,
          attr: {
            'class': 'btn btn-primary',
            'data-dismiss': 'modal'
          }
        }
      ],
      alert: [
        {text: 'OK',
          attr: {
            'class': 'btn btn-primary',
            'data-dismiss': 'modal'
          }
        }
      ],
      confirm: [
        {text: 'Cancel',
          value: false,
          attr: {
            'class': 'btn btn-default',
            'data-dismiss': 'modal'
          }
        },
        {text: 'OK',
          value: true,
          attr: {
            'class': 'btn btn-primary',
            'data-dismiss': 'modal'
          }
        }
      ]
    });

    const _templates = {
      container: '<div class="modal"></div>',
      dialog: '<div class="modal-dialog"></div>',
      content: '<div class="modal-content"></div>',
      header: '<div class="modal-header"></div>',
      headerClose: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>',
      body: '<div class="modal-body"></div>',
      footer: '<div class="modal-footer"></div>',
      backdrop: '<div class="modal-backdrop"></div>'
    };

    function deepFreeze(obj) {
      for (let k in obj) {
        if (Array.isArray(obj[k])) {
          obj[k].forEach(v => {
            deepFreeze(v);
          });
        } else if (obj[k] !== null && typeof obj[k] === 'object') {
          Object.freeze(obj[k]);
        }
      }
      return Object.freeze(obj);
    }

    function guid() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16);
    }

    function data(el, prop, value) {
     let prefix = 'data';
     let elData = el[prefix] || {};
     if (typeof value === 'undefined') {
       if (el[prefix] && el[prefix][prop]) {
         return el[prefix][prop];
       } else {
         var dataAttr = el.getAttribute(`${prefix}-${prop}`);
         if (typeof dataAttr !== 'undefined') {
           return dataAttr;
         }
         return null;
       }
     } else {
       elData[prop] = value;
       el[prefix] = elData;
       return el;
     }
    }

    function build(html, all) {
      if (html.nodeName) return html;
      html = html.replace(/(\t|\n$)/g, '');

      _factory.innerHTML = '';
      _factory.innerHTML = html;
      if (all === true) {
        return _factory.childNodes;
      } else {
        return _factory.childNodes[0];
      }
    }

    function calcScrollbarWidth() {
      let inner;
      let width;
      let outerWidth;
      let outer = document.createElement('div');
      Object.assign(outer.style, {
        visibility: 'hidden',
        width: '100px'
      });
      document.body.appendChild(outer);

      outerWidth = outer.offsetWidth;
      outer.style.overflow = 'scroll';

      inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);

      width = outerWidth - inner.offsetWidth;
      document.body.removeChild(outer);

      return width;
    }

    function getPath(node) {
      let nodes = [node];
      while (node.parentNode) {
        node = node.parentNode;
        nodes.push(node);
      }
      return nodes;
    }

    class Modal extends EventEmitter {
      static set templates(templates) {
        this._baseTemplates = templates;
      }

      static get templates() {
        return Object.assign({}, _templates, Modal._baseTemplates || {});
      }

      static set buttons(buttons) {
        this._baseButtons = buttons;
      }

      static get buttons() {
        return Object.assign({}, _buttons, Modal._baseButtons || {});
      }

      static set options(options) {
        this._baseOptions = options;
      }

      static get options() {
        return Object.assign({}, _defaults, Modal._baseOptions || {});
      }

      static get version() {
        return '0.9.0';
      }

      static alert(message, _options = {}) {
        let options = Object.assign({},
          _defaults,
          {
            title:  message,
            content: false,
            construct: true,
            headerClose: false,
            buttons: Modal.buttons.alert
          },
          _options
        );

        return new Modal(options);
      }

      static confirm(question, _options = {}) {
        let options = Object.assign({},
          _defaults,
          {
            title:  question,
            content: false,
            construct: true,
            headerClose: false,
            buttons: Modal.buttons.confirm
          },
          _options
        );

        return new Modal(options);
      }

      constructor(options = {}) {
        super();

        this.id = guid();
        this.el = null;
        this._html = {};
        this._events = {};
        this._visible = false;
        this._options = Object.assign({}, Modal.options, options);
        this._templates = Object.assign({}, Modal.templates, options.templates || {});
        this._html.appendTo = document.querySelector(this._options.appendTo);
        this._scrollbarWidth = calcScrollbarWidth();

        if (this._options.buttons === null) {
          this._options.buttons = Modal.buttons.dialog;
        }

        if (this._options.el) {
          let el = this._options.el;
          if (typeof this._options.el == 'string') {
            el = document.querySelector(this._options.el);
            if (! el) {
              throw new Error(`Selector: DOM Element ${this._options.el} not found.`);
            }
          }
          data(el, 'modal', this);
          this.el = el;
        } else {
          this._options.construct = true;
        }

        if (this._options.construct) {
          this._render();
        } else {
          this._mapDom();
        }
      }

      _render() {
        let html = this._html;
        let o = this._options;
        let t = this._templates;
        let animate = o.animate ? o.animateClass : false;

        html.container = build(t.container);
        html.dialog = build(t.dialog);
        html.content = build(t.content);
        html.header = build(t.header);
        html.headerClose = build(t.headerClose);
        html.body = build(t.body);
        html.footer = build(t.footer);
        if (animate) html.container.classList.add(animate);

        this._setHeader();
        this._setContent();
        this._setFooter();

        this.el = html.container;

        html.dialog.appendChild(html.content);
        html.container.appendChild(html.dialog);

        return this;
      }

      _mapDom() {
        let html = this._html;
        let o = this._options;

        if (this.el.classList.contains(o.animateClass)) {
          o.animate = true;
        }

        html.container = this.el;
        html.dialog = this.el.querySelector('.modal-dialog');
        html.content = this.el.querySelector('.modal-content');
        html.header = this.el.querySelector('.modal-header');
        html.headerClose = this.el.querySelector('.modal-header .close');
        html.body = this.el.querySelector('.modal-body');
        html.footer = this.el.querySelector('.modal-footer');

        this._setHeader();
        this._setContent();
        this._setFooter();

        return this;
      }

      _setHeader() {
        let html = this._html;
        let o = this._options;

        if (o.header && html.header) {
          if (o.title.nodeName) {
            html.header.innerHTML = o.title.outerHTML;
          } else if (typeof o.title === 'string') {
            html.header.innerHTML = `<h4 class="modal-title">${o.title}</h4>`;
          }
          // Add header close button only to constructed modals.
          if (this.el === null && html.headerClose && o.headerClose) {
            html.header.appendChild(html.headerClose);
          }
          if (o.construct) {
            html.content.appendChild(html.header);
          }
        }
      }

      _setContent() {
        let html = this._html;
        let o = this._options;

        if (o.content && html.body) {
          if (typeof o.content === 'string') {
            html.body.innerHTML = o.content;
          } else {
            html.body.innerHTML = o.content.outerHTML;
          }
          if (o.construct) {
            html.content.appendChild(html.body);
          }
        }
      }

      _setFooter() {
        let html = this._html;
        let o = this._options;

        if (o.footer && html.footer) {
          if (o.footer.nodeName) {
            html.footer.ineerHTML = o.footer.outerHTML;
          } else if (typeof o.footer === 'string') {
            html.footer.innerHTML = o.footer;
          } else if (! html.footer.children.length) {
            o.buttons.forEach((button) => {
              let el = document.createElement('button');
              data(el, 'button', button);
              el.innerHTML = button.text;
              el.setAttribute('type', 'button');
              for (let j in button.attr) {
                el.setAttribute(j, button.attr[j]);
              }
              html.footer.appendChild(el);
            });
          }
          if (o.construct) {
            html.content.appendChild(html.footer);
          }
        }

      }

      _setEvents() {
        let o = this._options;
        let html = this._html;

        this._events.keydownHandler = this._handleKeydownEvent.bind(this);
        document.body.addEventListener('keydown',
          this._events.keydownHandler
        );

        this._events.clickHandler = this._handleClickEvent.bind(this);
        html.container.addEventListener('click',
          this._events.clickHandler
        );

        this._events.resizeHandler = this._handleResizeEvent.bind(this);
        window.addEventListener('resize',
          this._events.resizeHandler
        );
      }

      _handleClickEvent(e) {
        let path = getPath(e.target);
        path.every(node => {
          if (node.tagName === 'HTML') {
            return false;
          }
          if (this._options.backdrop !== true && node.classList.contains('modal')) {
            return false;
          }
          if (node.classList.contains('modal-content')) {
            return false;
          }
          if (node.getAttribute('data-dismiss') === 'modal') {
            this.emit('dismiss', this, e, data(e.target, 'button'));
            this.hide();
            return false;
          }
          if (node.classList.contains('modal')) {
            this.emit('dismiss', this, e, null);
            this.hide();
            return false;
          }
          return true;
        });
      }

      _handleKeydownEvent(e) {
        if (e.which === 27 && this._options.keyboard) {
          this.emit('dismiss', this, e, null);
          this.hide();
        }
      }

      _handleResizeEvent(e) {
        this._resize();
      }

      show() {
        let o = this._options;
        let html = this._html;
        this.emit('show', this);

        this._checkScrollbar();
        this._setScrollbar();
        document.body.classList.add('modal-open');

        if (o.construct) {
          html.appendTo.appendChild(html.container);
        }

        html.container.style.display = 'block';
        html.container.scrollTop = 0;

        if (o.backdrop !== false) {
          this.once('showBackdrop', () => {
            this._setEvents();

            if (o.animate) html.container.offsetWidth; // Force reflow

            html.container.classList.add(o.animateInClass);

            setTimeout(() => {
              this._visible = true;
              this.emit('shown', this);
            }, o.transition);
          });
          this._backdrop();
        } else {
          this._setEvents();

          if (o.animate) html.container.offsetWidth; // Force reflow

          html.container.classList.add(o.animateInClass);

          setTimeout(() => {
            this._visible = true;
            this.emit('shown', this);
          }, o.transition);
        }
        this._resize();

        return this;
      }

      toggle() {
        if (this._visible) {
          this.hide();
        } else {
          this.show();
        }
      }

      _resize() {
        var modalIsOverflowing =
          this._html.container.scrollHeight > document.documentElement.clientHeight;

        this._html.container.style.paddingLeft =
          ! this.bodyIsOverflowing && modalIsOverflowing ? this._scrollbarWidth + 'px' : '';

        this._html.container.style.paddingRight =
          this.bodyIsOverflowing && ! modalIsOverflowing ? this._scrollbarWidth + 'px' : '';
      }

      _backdrop() {
        let html = this._html;
        let t = this._templates;
        let o = this._options;
        let animate = o.animate ? o.animateClass : false;

        html.backdrop = build(t.backdrop);
        if (animate) html.backdrop.classList.add(animate);
        html.appendTo.appendChild(html.backdrop);

        if (animate) html.backdrop.offsetWidth;

        html.backdrop.classList.add(o.animateInClass);

        setTimeout(() => {
          this.emit('showBackdrop', this);
        }, this._options.backdropTransition);
      }

      hide() {
        let html = this._html;
        let o = this._options;
        let contCList = html.container.classList;
        this.emit('hide', this);

        contCList.remove(o.animateInClass);

        if (o.backdrop) {
          let backCList = html.backdrop.classList;
          backCList.remove(o.animateInClass);
        }

        this._removeEvents();

        setTimeout(() => {
          document.body.classList.remove('modal-open');
          document.body.style.paddingRight = this.originalBodyPad;
        }, o.backdropTransition);

        setTimeout(() => {
          if (o.backdrop) {
            html.backdrop.parentNode.removeChild(html.backdrop);
          }
          html.container.style.display = 'none';

          if (o.construct) {
            html.container.parentNode.removeChild(html.container);
          }

          this._visible = false;
          this.emit('hidden', this);
        }, o.transition);

        return this;
      }

      _removeEvents() {
        if (this._events.keydownHandler) {
          document.body.removeEventListener('keydown',
            this._events.keydownHandler
          );
        }

        this._html.container.removeEventListener('click',
          this._events.clickHandler
        );

        window.removeEventListener('resize',
          this._events.resizeHandler
        );
      }

      _checkScrollbar() {
        this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
      }

      _setScrollbar() {
        this.originalBodyPad = document.body.style.paddingRight || '';
        if (this.bodyIsOverflowing) {
          let basePadding = parseInt(this.originalBodyPad || 0, 10);
          document.body.style.paddingRight = basePadding + this._scrollbarWidth + 'px';
        }
      }
    }

    var modal = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Modal
    });

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(modal);

    var modalVanilla = require$$0.default;

    var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

    var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='289' height='448' viewBox='0 0 289 448'%3e %3cpath d='M283.25 260.75c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-95.5l50.25 119c3.5 8.25-0.5 17.5-8.5 21l-44.25 18.75c-8.25 3.5-17.5-0.5-21-8.5l-47.75-113-78 78c-3 3-7 4.75-11.25 4.75-2 0-4.25-0.5-6-1.25-6-2.5-10-8.25-10-14.75v-376c0-6.5 4-12.25 10-14.75 1.75-0.75 4-1.25 6-1.25 4.25 0 8.25 1.5 11.25 4.75z'%3e%3c/path%3e%3c/svg%3e";

    var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

    var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

    var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

    var es = {
      labels: {
        select: 'Seleccionar',
        addElement: 'Añadir elemento',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        upload: 'Subir',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        uploadToLayer: 'Subir archivo a la capa seleccionada',
        uploadFeatures: 'Subida de elementos a',
        validFeatures: 'Válidas',
        invalidFeatures: 'Invalidas'
      },
      errors: {
        capabilities: 'No se pudieron obtener las Capabilidades del GeoServer',
        wfst: 'El GeoServer no tiene soporte a Transacciones',
        layer: 'No se pudieron obtener datos de la capa',
        noValidGeometry: 'No se encontraron geometrías válidas para agregar a esta capa',
        geoserver: 'No se pudieron obtener datos desde el GeoServer',
        badFormat: 'Formato no soportado',
        badFile: 'Error al leer elementos del archivo',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer.',
        transaction: 'Error al hacer transacción con el GeoServer. HTTP status:',
        getFeatures: 'Error al obtener elemento desde el GeoServer. HTTP status:'
      }
    };

    var en = {
      labels: {
        select: 'Select',
        addElement: 'Add feature',
        editElement: 'Edit feature',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        apply: 'Apply changes',
        upload: 'Upload',
        editMode: 'Edit Mode',
        confirmDelete: 'Are you sure to delete the feature?',
        editFields: 'Edit fields',
        editGeom: 'Edit geometry',
        uploadToLayer: 'Upload file to selected layer',
        uploadFeatures: 'Uploaded features to',
        validFeatures: 'Valid',
        invalidFeatures: 'Invalid'
      },
      errors: {
        capabilities: 'GeoServer Capabilities could not be downloaded.',
        wfst: 'The GeoServer does not support Transactions',
        layer: 'Could not get data from layer',
        noValidGeometry: 'No valid geometries found to add to this layer',
        geoserver: 'Could not get data from the GeoServer',
        badFormat: 'Unsupported format',
        badFile: 'Error reading items from file',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer. HTTP status:',
        transaction: 'Error when doing Transaction with GeoServer. HTTP status:',
        getFeatures: 'Error getting elements from GeoServer. HTTP status:'
      }
    };

    var languages = /*#__PURE__*/Object.freeze({
        __proto__: null,
        es: es,
        en: en
    });

    /**
     * @module ol/geom/GeometryType
     */
    /**
     * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`,
     * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
     * `'GeometryCollection'`, `'Circle'`.
     * @enum {string}
     */
    var GeometryType = {
        POINT: 'Point',
        LINE_STRING: 'LineString',
        LINEAR_RING: 'LinearRing',
        POLYGON: 'Polygon',
        MULTI_POINT: 'MultiPoint',
        MULTI_LINE_STRING: 'MultiLineString',
        MULTI_POLYGON: 'MultiPolygon',
        GEOMETRY_COLLECTION: 'GeometryCollection',
        CIRCLE: 'Circle',
    };

    /**
     * @module ol/geom/GeometryLayout
     */
    /**
     * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
     * or measure ('M') coordinate is available. Supported values are `'XY'`,
     * `'XYZ'`, `'XYM'`, `'XYZM'`.
     * @enum {string}
     */
    var GeometryLayout = {
        XY: 'XY',
        XYZ: 'XYZ',
        XYM: 'XYM',
        XYZM: 'XYZM',
    };

    /**
     * @module ol/events/Event
     */
    /**
     * @classdesc
     * Stripped down implementation of the W3C DOM Level 2 Event interface.
     * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
     *
     * This implementation only provides `type` and `target` properties, and
     * `stopPropagation` and `preventDefault` methods. It is meant as base class
     * for higher level events defined in the library, and works with
     * {@link module:ol/events/Target~Target}.
     */
    var BaseEvent = /** @class */ (function () {
        /**
         * @param {string} type Type.
         */
        function BaseEvent(type) {
            /**
             * @type {boolean}
             */
            this.propagationStopped;
            /**
             * The event type.
             * @type {string}
             * @api
             */
            this.type = type;
            /**
             * The event target.
             * @type {Object}
             * @api
             */
            this.target = null;
        }
        /**
         * Stop event propagation.
         * @api
         */
        BaseEvent.prototype.preventDefault = function () {
            this.propagationStopped = true;
        };
        /**
         * Stop event propagation.
         * @api
         */
        BaseEvent.prototype.stopPropagation = function () {
            this.propagationStopped = true;
        };
        return BaseEvent;
    }());

    /**
     * @module ol/ObjectEventType
     */
    /**
     * @enum {string}
     */
    var ObjectEventType = {
        /**
         * Triggered when a property is changed.
         * @event module:ol/Object.ObjectEvent#propertychange
         * @api
         */
        PROPERTYCHANGE: 'propertychange',
    };

    /**
     * @module ol/Disposable
     */
    /**
     * @classdesc
     * Objects that need to clean up after themselves.
     */
    var Disposable = /** @class */ (function () {
        function Disposable() {
            /**
             * The object has already been disposed.
             * @type {boolean}
             * @protected
             */
            this.disposed = false;
        }
        /**
         * Clean up.
         */
        Disposable.prototype.dispose = function () {
            if (!this.disposed) {
                this.disposed = true;
                this.disposeInternal();
            }
        };
        /**
         * Extension point for disposable objects.
         * @protected
         */
        Disposable.prototype.disposeInternal = function () { };
        return Disposable;
    }());

    /**
     * @module ol/obj
     */
    /**
     * Polyfill for Object.assign().  Assigns enumerable and own properties from
     * one or more source objects to a target object.
     * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
     *
     * @param {!Object} target The target object.
     * @param {...Object} var_sources The source object(s).
     * @return {!Object} The modified target object.
     */
    var assign = typeof Object.assign === 'function'
        ? Object.assign
        : function (target, var_sources) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var i = 1, ii = arguments.length; i < ii; ++i) {
                var source = arguments[i];
                if (source !== undefined && source !== null) {
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            output[key] = source[key];
                        }
                    }
                }
            }
            return output;
        };
    /**
     * Removes all properties from an object.
     * @param {Object} object The object to clear.
     */
    function clear(object) {
        for (var property in object) {
            delete object[property];
        }
    }
    /**
     * Determine if an object has any properties.
     * @param {Object} object The object to check.
     * @return {boolean} The object is empty.
     */
    function isEmpty(object) {
        var property;
        for (property in object) {
            return false;
        }
        return !property;
    }

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {EventTarget|Target} EventTargetLike
     */
    /**
     * @classdesc
     * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
     * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
     *
     * There are two important simplifications compared to the specification:
     *
     * 1. The handling of `useCapture` in `addEventListener` and
     *    `removeEventListener`. There is no real capture model.
     * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
     *    There is no event target hierarchy. When a listener calls
     *    `stopPropagation` or `preventDefault` on an event object, it means that no
     *    more listeners after this one will be called. Same as when the listener
     *    returns false.
     */
    var Target = /** @class */ (function (_super) {
        __extends$1(Target, _super);
        /**
         * @param {*=} opt_target Default event target for dispatched events.
         */
        function Target(opt_target) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {*}
             */
            _this.eventTarget_ = opt_target;
            /**
             * @private
             * @type {Object<string, number>}
             */
            _this.pendingRemovals_ = null;
            /**
             * @private
             * @type {Object<string, number>}
             */
            _this.dispatching_ = null;
            /**
             * @private
             * @type {Object<string, Array<import("../events.js").Listener>>}
             */
            _this.listeners_ = null;
            return _this;
        }
        /**
         * @param {string} type Type.
         * @param {import("../events.js").Listener} listener Listener.
         */
        Target.prototype.addEventListener = function (type, listener) {
            if (!type || !listener) {
                return;
            }
            var listeners = this.listeners_ || (this.listeners_ = {});
            var listenersForType = listeners[type] || (listeners[type] = []);
            if (listenersForType.indexOf(listener) === -1) {
                listenersForType.push(listener);
            }
        };
        /**
         * Dispatches an event and calls all listeners listening for events
         * of this type. The event parameter can either be a string or an
         * Object with a `type` property.
         *
         * @param {import("./Event.js").default|string} event Event object.
         * @return {boolean|undefined} `false` if anyone called preventDefault on the
         *     event object or if any of the listeners returned false.
         * @api
         */
        Target.prototype.dispatchEvent = function (event) {
            /** @type {import("./Event.js").default|Event} */
            var evt = typeof event === 'string' ? new BaseEvent(event) : event;
            var type = evt.type;
            if (!evt.target) {
                evt.target = this.eventTarget_ || this;
            }
            var listeners = this.listeners_ && this.listeners_[type];
            var propagate;
            if (listeners) {
                var dispatching = this.dispatching_ || (this.dispatching_ = {});
                var pendingRemovals = this.pendingRemovals_ || (this.pendingRemovals_ = {});
                if (!(type in dispatching)) {
                    dispatching[type] = 0;
                    pendingRemovals[type] = 0;
                }
                ++dispatching[type];
                for (var i = 0, ii = listeners.length; i < ii; ++i) {
                    if ('handleEvent' in listeners[i]) {
                        propagate = /** @type {import("../events.js").ListenerObject} */ (listeners[i]).handleEvent(evt);
                    }
                    else {
                        propagate = /** @type {import("../events.js").ListenerFunction} */ (listeners[i]).call(this, evt);
                    }
                    if (propagate === false || evt.propagationStopped) {
                        propagate = false;
                        break;
                    }
                }
                --dispatching[type];
                if (dispatching[type] === 0) {
                    var pr = pendingRemovals[type];
                    delete pendingRemovals[type];
                    while (pr--) {
                        this.removeEventListener(type, VOID);
                    }
                    delete dispatching[type];
                }
                return propagate;
            }
        };
        /**
         * Clean up.
         */
        Target.prototype.disposeInternal = function () {
            this.listeners_ && clear(this.listeners_);
        };
        /**
         * Get the listeners for a specified event type. Listeners are returned in the
         * order that they will be called in.
         *
         * @param {string} type Type.
         * @return {Array<import("../events.js").Listener>|undefined} Listeners.
         */
        Target.prototype.getListeners = function (type) {
            return (this.listeners_ && this.listeners_[type]) || undefined;
        };
        /**
         * @param {string=} opt_type Type. If not provided,
         *     `true` will be returned if this event target has any listeners.
         * @return {boolean} Has listeners.
         */
        Target.prototype.hasListener = function (opt_type) {
            if (!this.listeners_) {
                return false;
            }
            return opt_type
                ? opt_type in this.listeners_
                : Object.keys(this.listeners_).length > 0;
        };
        /**
         * @param {string} type Type.
         * @param {import("../events.js").Listener} listener Listener.
         */
        Target.prototype.removeEventListener = function (type, listener) {
            var listeners = this.listeners_ && this.listeners_[type];
            if (listeners) {
                var index = listeners.indexOf(listener);
                if (index !== -1) {
                    if (this.pendingRemovals_ && type in this.pendingRemovals_) {
                        // make listener a no-op, and remove later in #dispatchEvent()
                        listeners[index] = VOID;
                        ++this.pendingRemovals_[type];
                    }
                    else {
                        listeners.splice(index, 1);
                        if (listeners.length === 0) {
                            delete this.listeners_[type];
                        }
                    }
                }
            }
        };
        return Target;
    }(Disposable));

    /**
     * @module ol/events
     */
    /**
     * Key to use with {@link module:ol/Observable~Observable#unByKey}.
     * @typedef {Object} EventsKey
     * @property {ListenerFunction} listener
     * @property {import("./events/Target.js").EventTargetLike} target
     * @property {string} type
     * @api
     */
    /**
     * Listener function. This function is called with an event object as argument.
     * When the function returns `false`, event propagation will stop.
     *
     * @typedef {function((Event|import("./events/Event.js").default)): (void|boolean)} ListenerFunction
     * @api
     */
    /**
     * @typedef {Object} ListenerObject
     * @property {ListenerFunction} handleEvent
     */
    /**
     * @typedef {ListenerFunction|ListenerObject} Listener
     */
    /**
     * Registers an event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` to a `this` object, and returns
     * a key for use with {@link module:ol/events~unlistenByKey}.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object=} opt_this Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @param {boolean=} opt_once If true, add the listener as one-off listener.
     * @return {EventsKey} Unique key for the listener.
     */
    function listen(target, type, listener, opt_this, opt_once) {
        if (opt_this && opt_this !== target) {
            listener = listener.bind(opt_this);
        }
        if (opt_once) {
            var originalListener_1 = listener;
            listener = function () {
                target.removeEventListener(type, listener);
                originalListener_1.apply(this, arguments);
            };
        }
        var eventsKey = {
            target: target,
            type: type,
            listener: listener,
        };
        target.addEventListener(type, listener);
        return eventsKey;
    }
    /**
     * Registers a one-off event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` as self-unregistering listener
     * to a `this` object, and returns a key for use with
     * {@link module:ol/events~unlistenByKey} in case the listener needs to be
     * unregistered before it is called.
     *
     * When {@link module:ol/events~listen} is called with the same arguments after this
     * function, the self-unregistering listener will be turned into a permanent
     * listener.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object=} opt_this Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @return {EventsKey} Key for unlistenByKey.
     */
    function listenOnce(target, type, listener, opt_this) {
        return listen(target, type, listener, opt_this, true);
    }
    /**
     * Unregisters event listeners on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * The argument passed to this function is the key returned from
     * {@link module:ol/events~listen} or {@link module:ol/events~listenOnce}.
     *
     * @param {EventsKey} key The key.
     */
    function unlistenByKey(key) {
        if (key && key.target) {
            key.target.removeEventListener(key.type, key.listener);
            clear(key);
        }
    }

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * An event target providing convenient methods for listener registration
     * and unregistration. A generic `change` event is always available through
     * {@link module:ol/Observable~Observable#changed}.
     *
     * @fires import("./events/Event.js").default
     * @api
     */
    var Observable = /** @class */ (function (_super) {
        __extends$2(Observable, _super);
        function Observable() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {number}
             */
            _this.revision_ = 0;
            return _this;
        }
        /**
         * Increases the revision counter and dispatches a 'change' event.
         * @api
         */
        Observable.prototype.changed = function () {
            ++this.revision_;
            this.dispatchEvent(EventType.CHANGE);
        };
        /**
         * Get the version number for this object.  Each time the object is modified,
         * its version number will be incremented.
         * @return {number} Revision.
         * @api
         */
        Observable.prototype.getRevision = function () {
            return this.revision_;
        };
        /**
         * Listen for a certain type of event.
         * @param {string|Array<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
         *     called with an array of event types as the first argument, the return
         *     will be an array of keys.
         * @api
         */
        Observable.prototype.on = function (type, listener) {
            if (Array.isArray(type)) {
                var len = type.length;
                var keys = new Array(len);
                for (var i = 0; i < len; ++i) {
                    keys[i] = listen(this, type[i], listener);
                }
                return keys;
            }
            else {
                return listen(this, /** @type {string} */ (type), listener);
            }
        };
        /**
         * Listen once for a certain type of event.
         * @param {string|Array<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
         *     called with an array of event types as the first argument, the return
         *     will be an array of keys.
         * @api
         */
        Observable.prototype.once = function (type, listener) {
            var key;
            if (Array.isArray(type)) {
                var len = type.length;
                key = new Array(len);
                for (var i = 0; i < len; ++i) {
                    key[i] = listenOnce(this, type[i], listener);
                }
            }
            else {
                key = listenOnce(this, /** @type {string} */ (type), listener);
            }
            /** @type {Object} */ (listener).ol_key = key;
            return key;
        };
        /**
         * Unlisten for a certain type of event.
         * @param {string|Array<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @api
         */
        Observable.prototype.un = function (type, listener) {
            var key = /** @type {Object} */ (listener).ol_key;
            if (key) {
                unByKey(key);
            }
            else if (Array.isArray(type)) {
                for (var i = 0, ii = type.length; i < ii; ++i) {
                    this.removeEventListener(type[i], listener);
                }
            }
            else {
                this.removeEventListener(type, listener);
            }
        };
        return Observable;
    }(Target));
    /**
     * Removes an event listener using the key returned by `on()` or `once()`.
     * @param {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} key The key returned by `on()`
     *     or `once()` (or an array of keys).
     * @api
     */
    function unByKey(key) {
        if (Array.isArray(key)) {
            for (var i = 0, ii = key.length; i < ii; ++i) {
                unlistenByKey(key[i]);
            }
        }
        else {
            unlistenByKey(/** @type {import("./events.js").EventsKey} */ (key));
        }
    }

    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
     */
    var ObjectEvent = /** @class */ (function (_super) {
        __extends$3(ObjectEvent, _super);
        /**
         * @param {string} type The event type.
         * @param {string} key The property name.
         * @param {*} oldValue The old value for `key`.
         */
        function ObjectEvent(type, key, oldValue) {
            var _this = _super.call(this, type) || this;
            /**
             * The name of the property whose value is changing.
             * @type {string}
             * @api
             */
            _this.key = key;
            /**
             * The old value. To get the new value use `e.target.get(e.key)` where
             * `e` is the event object.
             * @type {*}
             * @api
             */
            _this.oldValue = oldValue;
            return _this;
        }
        return ObjectEvent;
    }(BaseEvent));
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Most non-trivial classes inherit from this.
     *
     * This extends {@link module:ol/Observable} with observable
     * properties, where each property is observable as well as the object as a
     * whole.
     *
     * Classes that inherit from this have pre-defined properties, to which you can
     * add your owns. The pre-defined properties are listed in this documentation as
     * 'Observable Properties', and have their own accessors; for example,
     * {@link module:ol/Map~Map} has a `target` property, accessed with
     * `getTarget()` and changed with `setTarget()`. Not all properties are however
     * settable. There are also general-purpose accessors `get()` and `set()`. For
     * example, `get('target')` is equivalent to `getTarget()`.
     *
     * The `set` accessors trigger a change event, and you can monitor this by
     * registering a listener. For example, {@link module:ol/View~View} has a
     * `center` property, so `view.on('change:center', function(evt) {...});` would
     * call the function whenever the value of the center property changes. Within
     * the function, `evt.target` would be the view, so `evt.target.getCenter()`
     * would return the new center.
     *
     * You can add your own observable properties with
     * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
     * You can listen for changes on that property value with
     * `object.on('change:prop', listener)`. You can get a list of all
     * properties with {@link module:ol/Object~BaseObject#getProperties}.
     *
     * Note that the observable properties are separate from standard JS properties.
     * You can, for example, give your map object a title with
     * `map.title='New title'` and with `map.set('title', 'Another title')`. The
     * first will be a `hasOwnProperty`; the second will appear in
     * `getProperties()`. Only the second is observable.
     *
     * Properties can be deleted by using the unset method. E.g.
     * object.unset('foo').
     *
     * @fires ObjectEvent
     * @api
     */
    var BaseObject = /** @class */ (function (_super) {
        __extends$3(BaseObject, _super);
        /**
         * @param {Object<string, *>=} opt_values An object with key-value pairs.
         */
        function BaseObject(opt_values) {
            var _this = _super.call(this) || this;
            // Call {@link module:ol/util~getUid} to ensure that the order of objects' ids is
            // the same as the order in which they were created.  This also helps to
            // ensure that object properties are always added in the same order, which
            // helps many JavaScript engines generate faster code.
            getUid(_this);
            /**
             * @private
             * @type {Object<string, *>}
             */
            _this.values_ = null;
            if (opt_values !== undefined) {
                _this.setProperties(opt_values);
            }
            return _this;
        }
        /**
         * Gets a value.
         * @param {string} key Key name.
         * @return {*} Value.
         * @api
         */
        BaseObject.prototype.get = function (key) {
            var value;
            if (this.values_ && this.values_.hasOwnProperty(key)) {
                value = this.values_[key];
            }
            return value;
        };
        /**
         * Get a list of object property names.
         * @return {Array<string>} List of property names.
         * @api
         */
        BaseObject.prototype.getKeys = function () {
            return (this.values_ && Object.keys(this.values_)) || [];
        };
        /**
         * Get an object of all property names and values.
         * @return {Object<string, *>} Object.
         * @api
         */
        BaseObject.prototype.getProperties = function () {
            return (this.values_ && assign({}, this.values_)) || {};
        };
        /**
         * @return {boolean} The object has properties.
         */
        BaseObject.prototype.hasProperties = function () {
            return !!this.values_;
        };
        /**
         * @param {string} key Key name.
         * @param {*} oldValue Old value.
         */
        BaseObject.prototype.notify = function (key, oldValue) {
            var eventType;
            eventType = getChangeEventType(key);
            this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
            eventType = ObjectEventType.PROPERTYCHANGE;
            this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
        };
        /**
         * Sets a value.
         * @param {string} key Key name.
         * @param {*} value Value.
         * @param {boolean=} opt_silent Update without triggering an event.
         * @api
         */
        BaseObject.prototype.set = function (key, value, opt_silent) {
            var values = this.values_ || (this.values_ = {});
            if (opt_silent) {
                values[key] = value;
            }
            else {
                var oldValue = values[key];
                values[key] = value;
                if (oldValue !== value) {
                    this.notify(key, oldValue);
                }
            }
        };
        /**
         * Sets a collection of key-value pairs.  Note that this changes any existing
         * properties and adds new ones (it does not remove any existing properties).
         * @param {Object<string, *>} values Values.
         * @param {boolean=} opt_silent Update without triggering an event.
         * @api
         */
        BaseObject.prototype.setProperties = function (values, opt_silent) {
            for (var key in values) {
                this.set(key, values[key], opt_silent);
            }
        };
        /**
         * Apply any properties from another object without triggering events.
         * @param {BaseObject} source The source object.
         * @protected
         */
        BaseObject.prototype.applyProperties = function (source) {
            if (!source.values_) {
                return;
            }
            assign(this.values_ || (this.values_ = {}), source.values_);
        };
        /**
         * Unsets a property.
         * @param {string} key Key name.
         * @param {boolean=} opt_silent Unset without triggering an event.
         * @api
         */
        BaseObject.prototype.unset = function (key, opt_silent) {
            if (this.values_ && key in this.values_) {
                var oldValue = this.values_[key];
                delete this.values_[key];
                if (isEmpty(this.values_)) {
                    this.values_ = null;
                }
                if (!opt_silent) {
                    this.notify(key, oldValue);
                }
            }
        };
        return BaseObject;
    }(Observable));
    /**
     * @type {Object<string, string>}
     */
    var changeEventTypeCache = {};
    /**
     * @param {string} key Key name.
     * @return {string} Change name.
     */
    function getChangeEventType(key) {
        return changeEventTypeCache.hasOwnProperty(key)
            ? changeEventTypeCache[key]
            : (changeEventTypeCache[key] = 'change:' + key);
    }

    /**
     * @module ol/proj/Units
     */
    /**
     * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
     * `'us-ft'`.
     * @enum {string}
     */
    var Units = {
        /**
         * Degrees
         * @api
         */
        DEGREES: 'degrees',
        /**
         * Feet
         * @api
         */
        FEET: 'ft',
        /**
         * Meters
         * @api
         */
        METERS: 'm',
        /**
         * Pixels
         * @api
         */
        PIXELS: 'pixels',
        /**
         * Tile Pixels
         * @api
         */
        TILE_PIXELS: 'tile-pixels',
        /**
         * US Feet
         * @api
         */
        USFEET: 'us-ft',
    };
    /**
     * Meters per unit lookup table.
     * @const
     * @type {Object<Units, number>}
     * @api
     */
    var METERS_PER_UNIT = {};
    // use the radius of the Normal sphere
    METERS_PER_UNIT[Units.DEGREES] = (2 * Math.PI * 6370997) / 360;
    METERS_PER_UNIT[Units.FEET] = 0.3048;
    METERS_PER_UNIT[Units.METERS] = 1;
    METERS_PER_UNIT[Units.USFEET] = 1200 / 3937;

    /**
     * @module ol/transform
     */
    /**
     * An array representing an affine 2d transformation for use with
     * {@link module:ol/transform} functions. The array has 6 elements.
     * @typedef {!Array<number>} Transform
     * @api
     */
    /**
     * Collection of affine 2d transformation functions. The functions work on an
     * array of 6 elements. The element order is compatible with the [SVGMatrix
     * interface](https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix) and is
     * a subset (elements a to f) of a 3×3 matrix:
     * ```
     * [ a c e ]
     * [ b d f ]
     * [ 0 0 1 ]
     * ```
     */
    /**
     * @private
     * @type {Transform}
     */
    var tmp_ = new Array(6);
    /**
     * Create an identity transform.
     * @return {!Transform} Identity transform.
     */
    function create() {
        return [1, 0, 0, 1, 0, 0];
    }
    /**
     * Creates a composite transform given an initial translation, scale, rotation, and
     * final translation (in that order only, not commutative).
     * @param {!Transform} transform The transform (will be modified in place).
     * @param {number} dx1 Initial translation x.
     * @param {number} dy1 Initial translation y.
     * @param {number} sx Scale factor x.
     * @param {number} sy Scale factor y.
     * @param {number} angle Rotation (in counter-clockwise radians).
     * @param {number} dx2 Final translation x.
     * @param {number} dy2 Final translation y.
     * @return {!Transform} The composite transform.
     */
    function compose(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        transform[0] = sx * cos;
        transform[1] = sy * sin;
        transform[2] = -sx * sin;
        transform[3] = sy * cos;
        transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
        transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
        return transform;
    }

    /**
     * @module ol/extent/Relationship
     */
    /**
     * Relationship to an extent.
     * @enum {number}
     */
    var Relationship = {
        UNKNOWN: 0,
        INTERSECTING: 1,
        ABOVE: 2,
        RIGHT: 4,
        BELOW: 8,
        LEFT: 16,
    };

    /**
     * @module ol/extent
     */
    /**
     * @param {Extent} extent Extent.
     * @param {number} x X.
     * @param {number} y Y.
     * @return {number} Closest squared distance.
     */
    function closestSquaredDistanceXY(extent, x, y) {
        var dx, dy;
        if (x < extent[0]) {
            dx = extent[0] - x;
        }
        else if (extent[2] < x) {
            dx = x - extent[2];
        }
        else {
            dx = 0;
        }
        if (y < extent[1]) {
            dy = extent[1] - y;
        }
        else if (extent[3] < y) {
            dy = y - extent[3];
        }
        else {
            dy = 0;
        }
        return dx * dx + dy * dy;
    }
    /**
     * Check if one extent contains another.
     *
     * An extent is deemed contained if it lies completely within the other extent,
     * including if they share one or more edges.
     *
     * @param {Extent} extent1 Extent 1.
     * @param {Extent} extent2 Extent 2.
     * @return {boolean} The second extent is contained by or on the edge of the
     *     first.
     * @api
     */
    function containsExtent(extent1, extent2) {
        return (extent1[0] <= extent2[0] &&
            extent2[2] <= extent1[2] &&
            extent1[1] <= extent2[1] &&
            extent2[3] <= extent1[3]);
    }
    /**
     * Check if the passed coordinate is contained or on the edge of the extent.
     *
     * @param {Extent} extent Extent.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @return {boolean} The x, y values are contained in the extent.
     * @api
     */
    function containsXY(extent, x, y) {
        return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
    }
    /**
     * Get the relationship between a coordinate and extent.
     * @param {Extent} extent The extent.
     * @param {import("./coordinate.js").Coordinate} coordinate The coordinate.
     * @return {import("./extent/Relationship.js").default} The relationship (bitwise compare with
     *     import("./extent/Relationship.js").Relationship).
     */
    function coordinateRelationship(extent, coordinate) {
        var minX = extent[0];
        var minY = extent[1];
        var maxX = extent[2];
        var maxY = extent[3];
        var x = coordinate[0];
        var y = coordinate[1];
        var relationship = Relationship.UNKNOWN;
        if (x < minX) {
            relationship = relationship | Relationship.LEFT;
        }
        else if (x > maxX) {
            relationship = relationship | Relationship.RIGHT;
        }
        if (y < minY) {
            relationship = relationship | Relationship.BELOW;
        }
        else if (y > maxY) {
            relationship = relationship | Relationship.ABOVE;
        }
        if (relationship === Relationship.UNKNOWN) {
            relationship = Relationship.INTERSECTING;
        }
        return relationship;
    }
    /**
     * Create an empty extent.
     * @return {Extent} Empty extent.
     * @api
     */
    function createEmpty() {
        return [Infinity, Infinity, -Infinity, -Infinity];
    }
    /**
     * Create a new extent or update the provided extent.
     * @param {number} minX Minimum X.
     * @param {number} minY Minimum Y.
     * @param {number} maxX Maximum X.
     * @param {number} maxY Maximum Y.
     * @param {Extent=} opt_extent Destination extent.
     * @return {Extent} Extent.
     */
    function createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = minX;
            opt_extent[1] = minY;
            opt_extent[2] = maxX;
            opt_extent[3] = maxY;
            return opt_extent;
        }
        else {
            return [minX, minY, maxX, maxY];
        }
    }
    /**
     * Create a new empty extent or make the provided one empty.
     * @param {Extent=} opt_extent Extent.
     * @return {Extent} Extent.
     */
    function createOrUpdateEmpty(opt_extent) {
        return createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, opt_extent);
    }
    /**
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     * @param {Extent=} opt_extent Extent.
     * @return {Extent} Extent.
     */
    function createOrUpdateFromCoordinate(coordinate, opt_extent) {
        var x = coordinate[0];
        var y = coordinate[1];
        return createOrUpdate(x, y, x, y, opt_extent);
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {Extent=} opt_extent Extent.
     * @return {Extent} Extent.
     */
    function createOrUpdateFromFlatCoordinates(flatCoordinates, offset, end, stride, opt_extent) {
        var extent = createOrUpdateEmpty(opt_extent);
        return extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
    }
    /**
     * @param {Extent} extent Extent.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {Extent} Extent.
     */
    function extendFlatCoordinates(extent, flatCoordinates, offset, end, stride) {
        for (; offset < end; offset += stride) {
            extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
        }
        return extent;
    }
    /**
     * @param {Extent} extent Extent.
     * @param {number} x X.
     * @param {number} y Y.
     */
    function extendXY(extent, x, y) {
        extent[0] = Math.min(extent[0], x);
        extent[1] = Math.min(extent[1], y);
        extent[2] = Math.max(extent[2], x);
        extent[3] = Math.max(extent[3], y);
    }
    /**
     * This function calls `callback` for each corner of the extent. If the
     * callback returns a truthy value the function returns that value
     * immediately. Otherwise the function returns `false`.
     * @param {Extent} extent Extent.
     * @param {function(import("./coordinate.js").Coordinate): S} callback Callback.
     * @return {S|boolean} Value.
     * @template S
     */
    function forEachCorner(extent, callback) {
        var val;
        val = callback(getBottomLeft(extent));
        if (val) {
            return val;
        }
        val = callback(getBottomRight(extent));
        if (val) {
            return val;
        }
        val = callback(getTopRight(extent));
        if (val) {
            return val;
        }
        val = callback(getTopLeft(extent));
        if (val) {
            return val;
        }
        return false;
    }
    /**
     * Get the bottom left coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Bottom left coordinate.
     * @api
     */
    function getBottomLeft(extent) {
        return [extent[0], extent[1]];
    }
    /**
     * Get the bottom right coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Bottom right coordinate.
     * @api
     */
    function getBottomRight(extent) {
        return [extent[2], extent[1]];
    }
    /**
     * Get the center coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Center.
     * @api
     */
    function getCenter(extent) {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    }
    /**
     * Get the height of an extent.
     * @param {Extent} extent Extent.
     * @return {number} Height.
     * @api
     */
    function getHeight(extent) {
        return extent[3] - extent[1];
    }
    /**
     * Get the top left coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Top left coordinate.
     * @api
     */
    function getTopLeft(extent) {
        return [extent[0], extent[3]];
    }
    /**
     * Get the top right coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Top right coordinate.
     * @api
     */
    function getTopRight(extent) {
        return [extent[2], extent[3]];
    }
    /**
     * Determine if one extent intersects another.
     * @param {Extent} extent1 Extent 1.
     * @param {Extent} extent2 Extent.
     * @return {boolean} The two extents intersect.
     * @api
     */
    function intersects(extent1, extent2) {
        return (extent1[0] <= extent2[2] &&
            extent1[2] >= extent2[0] &&
            extent1[1] <= extent2[3] &&
            extent1[3] >= extent2[1]);
    }
    /**
     * @param {Extent} extent Extent.
     * @param {Extent=} opt_extent Extent.
     * @return {Extent} Extent.
     */
    function returnOrUpdate(extent, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = extent[0];
            opt_extent[1] = extent[1];
            opt_extent[2] = extent[2];
            opt_extent[3] = extent[3];
            return opt_extent;
        }
        else {
            return extent;
        }
    }
    /**
     * Determine if the segment between two coordinates intersects (crosses,
     * touches, or is contained by) the provided extent.
     * @param {Extent} extent The extent.
     * @param {import("./coordinate.js").Coordinate} start Segment start coordinate.
     * @param {import("./coordinate.js").Coordinate} end Segment end coordinate.
     * @return {boolean} The segment intersects the extent.
     */
    function intersectsSegment(extent, start, end) {
        var intersects = false;
        var startRel = coordinateRelationship(extent, start);
        var endRel = coordinateRelationship(extent, end);
        if (startRel === Relationship.INTERSECTING ||
            endRel === Relationship.INTERSECTING) {
            intersects = true;
        }
        else {
            var minX = extent[0];
            var minY = extent[1];
            var maxX = extent[2];
            var maxY = extent[3];
            var startX = start[0];
            var startY = start[1];
            var endX = end[0];
            var endY = end[1];
            var slope = (endY - startY) / (endX - startX);
            var x = void 0, y = void 0;
            if (!!(endRel & Relationship.ABOVE) && !(startRel & Relationship.ABOVE)) {
                // potentially intersects top
                x = endX - (endY - maxY) / slope;
                intersects = x >= minX && x <= maxX;
            }
            if (!intersects &&
                !!(endRel & Relationship.RIGHT) &&
                !(startRel & Relationship.RIGHT)) {
                // potentially intersects right
                y = endY - (endX - maxX) * slope;
                intersects = y >= minY && y <= maxY;
            }
            if (!intersects &&
                !!(endRel & Relationship.BELOW) &&
                !(startRel & Relationship.BELOW)) {
                // potentially intersects bottom
                x = endX - (endY - minY) / slope;
                intersects = x >= minX && x <= maxX;
            }
            if (!intersects &&
                !!(endRel & Relationship.LEFT) &&
                !(startRel & Relationship.LEFT)) {
                // potentially intersects left
                y = endY - (endX - minX) * slope;
                intersects = y >= minY && y <= maxY;
            }
        }
        return intersects;
    }

    /**
     * @module ol/proj/Projection
     */
    /**
     * @typedef {Object} Options
     * @property {string} code The SRS identifier code, e.g. `EPSG:4326`.
     * @property {import("./Units.js").default|string} [units] Units. Required unless a
     * proj4 projection is defined for `code`.
     * @property {import("../extent.js").Extent} [extent] The validity extent for the SRS.
     * @property {string} [axisOrientation='enu'] The axis orientation as specified in Proj4.
     * @property {boolean} [global=false] Whether the projection is valid for the whole globe.
     * @property {number} [metersPerUnit] The meters per unit for the SRS.
     * If not provided, the `units` are used to get the meters per unit from the {@link module:ol/proj/Units~METERS_PER_UNIT}
     * lookup table.
     * @property {import("../extent.js").Extent} [worldExtent] The world extent for the SRS.
     * @property {function(number, import("../coordinate.js").Coordinate):number} [getPointResolution]
     * Function to determine resolution at a point. The function is called with a
     * `{number}` view resolution and an `{import("../coordinate.js").Coordinate}` as arguments, and returns
     * the `{number}` resolution in projection units at the passed coordinate. If this is `undefined`,
     * the default {@link module:ol/proj#getPointResolution} function will be used.
     */
    /**
     * @classdesc
     * Projection definition class. One of these is created for each projection
     * supported in the application and stored in the {@link module:ol/proj} namespace.
     * You can use these in applications, but this is not required, as API params
     * and options use {@link module:ol/proj~ProjectionLike} which means the simple string
     * code will suffice.
     *
     * You can use {@link module:ol/proj~get} to retrieve the object for a particular
     * projection.
     *
     * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
     * with the following aliases:
     * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
     *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
     *     http://www.opengis.net/gml/srs/epsg.xml#4326,
     *     urn:x-ogc:def:crs:EPSG:4326
     * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
     *     urn:ogc:def:crs:EPSG:6.18:3:3857,
     *     http://www.opengis.net/gml/srs/epsg.xml#3857
     *
     * If you use [proj4js](https://github.com/proj4js/proj4js), aliases can
     * be added using `proj4.defs()`. After all required projection definitions are
     * added, call the {@link module:ol/proj/proj4~register} function.
     *
     * @api
     */
    var Projection = /** @class */ (function () {
        /**
         * @param {Options} options Projection options.
         */
        function Projection(options) {
            /**
             * @private
             * @type {string}
             */
            this.code_ = options.code;
            /**
             * Units of projected coordinates. When set to `TILE_PIXELS`, a
             * `this.extent_` and `this.worldExtent_` must be configured properly for each
             * tile.
             * @private
             * @type {import("./Units.js").default}
             */
            this.units_ = /** @type {import("./Units.js").default} */ (options.units);
            /**
             * Validity extent of the projection in projected coordinates. For projections
             * with `TILE_PIXELS` units, this is the extent of the tile in
             * tile pixel space.
             * @private
             * @type {import("../extent.js").Extent}
             */
            this.extent_ = options.extent !== undefined ? options.extent : null;
            /**
             * Extent of the world in EPSG:4326. For projections with
             * `TILE_PIXELS` units, this is the extent of the tile in
             * projected coordinate space.
             * @private
             * @type {import("../extent.js").Extent}
             */
            this.worldExtent_ =
                options.worldExtent !== undefined ? options.worldExtent : null;
            /**
             * @private
             * @type {string}
             */
            this.axisOrientation_ =
                options.axisOrientation !== undefined ? options.axisOrientation : 'enu';
            /**
             * @private
             * @type {boolean}
             */
            this.global_ = options.global !== undefined ? options.global : false;
            /**
             * @private
             * @type {boolean}
             */
            this.canWrapX_ = !!(this.global_ && this.extent_);
            /**
             * @private
             * @type {function(number, import("../coordinate.js").Coordinate):number|undefined}
             */
            this.getPointResolutionFunc_ = options.getPointResolution;
            /**
             * @private
             * @type {import("../tilegrid/TileGrid.js").default}
             */
            this.defaultTileGrid_ = null;
            /**
             * @private
             * @type {number|undefined}
             */
            this.metersPerUnit_ = options.metersPerUnit;
        }
        /**
         * @return {boolean} The projection is suitable for wrapping the x-axis
         */
        Projection.prototype.canWrapX = function () {
            return this.canWrapX_;
        };
        /**
         * Get the code for this projection, e.g. 'EPSG:4326'.
         * @return {string} Code.
         * @api
         */
        Projection.prototype.getCode = function () {
            return this.code_;
        };
        /**
         * Get the validity extent for this projection.
         * @return {import("../extent.js").Extent} Extent.
         * @api
         */
        Projection.prototype.getExtent = function () {
            return this.extent_;
        };
        /**
         * Get the units of this projection.
         * @return {import("./Units.js").default} Units.
         * @api
         */
        Projection.prototype.getUnits = function () {
            return this.units_;
        };
        /**
         * Get the amount of meters per unit of this projection.  If the projection is
         * not configured with `metersPerUnit` or a units identifier, the return is
         * `undefined`.
         * @return {number|undefined} Meters.
         * @api
         */
        Projection.prototype.getMetersPerUnit = function () {
            return this.metersPerUnit_ || METERS_PER_UNIT[this.units_];
        };
        /**
         * Get the world extent for this projection.
         * @return {import("../extent.js").Extent} Extent.
         * @api
         */
        Projection.prototype.getWorldExtent = function () {
            return this.worldExtent_;
        };
        /**
         * Get the axis orientation of this projection.
         * Example values are:
         * enu - the default easting, northing, elevation.
         * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
         *     or south orientated transverse mercator.
         * wnu - westing, northing, up - some planetary coordinate systems have
         *     "west positive" coordinate systems
         * @return {string} Axis orientation.
         * @api
         */
        Projection.prototype.getAxisOrientation = function () {
            return this.axisOrientation_;
        };
        /**
         * Is this projection a global projection which spans the whole world?
         * @return {boolean} Whether the projection is global.
         * @api
         */
        Projection.prototype.isGlobal = function () {
            return this.global_;
        };
        /**
         * Set if the projection is a global projection which spans the whole world
         * @param {boolean} global Whether the projection is global.
         * @api
         */
        Projection.prototype.setGlobal = function (global) {
            this.global_ = global;
            this.canWrapX_ = !!(global && this.extent_);
        };
        /**
         * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
         */
        Projection.prototype.getDefaultTileGrid = function () {
            return this.defaultTileGrid_;
        };
        /**
         * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
         */
        Projection.prototype.setDefaultTileGrid = function (tileGrid) {
            this.defaultTileGrid_ = tileGrid;
        };
        /**
         * Set the validity extent for this projection.
         * @param {import("../extent.js").Extent} extent Extent.
         * @api
         */
        Projection.prototype.setExtent = function (extent) {
            this.extent_ = extent;
            this.canWrapX_ = !!(this.global_ && extent);
        };
        /**
         * Set the world extent for this projection.
         * @param {import("../extent.js").Extent} worldExtent World extent
         *     [minlon, minlat, maxlon, maxlat].
         * @api
         */
        Projection.prototype.setWorldExtent = function (worldExtent) {
            this.worldExtent_ = worldExtent;
        };
        /**
         * Set the getPointResolution function (see {@link module:ol/proj~getPointResolution}
         * for this projection.
         * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
         * @api
         */
        Projection.prototype.setGetPointResolution = function (func) {
            this.getPointResolutionFunc_ = func;
        };
        /**
         * Get the custom point resolution function for this projection (if set).
         * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
         * resolution function (if set).
         */
        Projection.prototype.getPointResolutionFunc = function () {
            return this.getPointResolutionFunc_;
        };
        return Projection;
    }());

    /**
     * @module ol/math
     */
    /**
     * Return the hyperbolic cosine of a given number. The method will use the
     * native `Math.cosh` function if it is available, otherwise the hyperbolic
     * cosine will be calculated via the reference implementation of the Mozilla
     * developer network.
     *
     * @param {number} x X.
     * @return {number} Hyperbolic cosine of x.
     */
    var cosh = (function () {
        // Wrapped in a iife, to save the overhead of checking for the native
        // implementation on every invocation.
        var cosh;
        if ('cosh' in Math) {
            // The environment supports the native Math.cosh function, use it…
            cosh = Math.cosh;
        }
        else {
            // … else, use the reference implementation of MDN:
            cosh = function (x) {
                var y = /** @type {Math} */ (Math).exp(x);
                return (y + 1 / y) / 2;
            };
        }
        return cosh;
    })();
    /**
     * Returns the square of the closest distance between the point (x, y) and the
     * line segment (x1, y1) to (x2, y2).
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} x1 X1.
     * @param {number} y1 Y1.
     * @param {number} x2 X2.
     * @param {number} y2 Y2.
     * @return {number} Squared distance.
     */
    function squaredSegmentDistance(x, y, x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        if (dx !== 0 || dy !== 0) {
            var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x1 = x2;
                y1 = y2;
            }
            else if (t > 0) {
                x1 += dx * t;
                y1 += dy * t;
            }
        }
        return squaredDistance(x, y, x1, y1);
    }
    /**
     * Returns the square of the distance between the points (x1, y1) and (x2, y2).
     * @param {number} x1 X1.
     * @param {number} y1 Y1.
     * @param {number} x2 X2.
     * @param {number} y2 Y2.
     * @return {number} Squared distance.
     */
    function squaredDistance(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx * dx + dy * dy;
    }
    /**
     * Returns the modulo of a / b, depending on the sign of b.
     *
     * @param {number} a Dividend.
     * @param {number} b Divisor.
     * @return {number} Modulo.
     */
    function modulo(a, b) {
        var r = a % b;
        return r * b < 0 ? r + b : r;
    }
    /**
     * Calculates the linearly interpolated value of x between a and b.
     *
     * @param {number} a Number
     * @param {number} b Number
     * @param {number} x Value to be interpolated.
     * @return {number} Interpolated value.
     */
    function lerp(a, b, x) {
        return a + x * (b - a);
    }

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Radius of WGS84 sphere
     *
     * @const
     * @type {number}
     */
    var RADIUS = 6378137;
    /**
     * @const
     * @type {number}
     */
    var HALF_SIZE = Math.PI * RADIUS;
    /**
     * @const
     * @type {import("../extent.js").Extent}
     */
    var EXTENT = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];
    /**
     * @const
     * @type {import("../extent.js").Extent}
     */
    var WORLD_EXTENT = [-180, -85, 180, 85];
    /**
     * Maximum safe value in y direction
     * @const
     * @type {number}
     */
    var MAX_SAFE_Y = RADIUS * Math.log(Math.tan(Math.PI / 2));
    /**
     * @classdesc
     * Projection object for web/spherical Mercator (EPSG:3857).
     */
    var EPSG3857Projection = /** @class */ (function (_super) {
        __extends$4(EPSG3857Projection, _super);
        /**
         * @param {string} code Code.
         */
        function EPSG3857Projection(code) {
            return _super.call(this, {
                code: code,
                units: Units.METERS,
                extent: EXTENT,
                global: true,
                worldExtent: WORLD_EXTENT,
                getPointResolution: function (resolution, point) {
                    return resolution / cosh(point[1] / RADIUS);
                },
            }) || this;
        }
        return EPSG3857Projection;
    }(Projection));
    /**
     * Projections equal to EPSG:3857.
     *
     * @const
     * @type {Array<import("./Projection.js").default>}
     */
    var PROJECTIONS = [
        new EPSG3857Projection('EPSG:3857'),
        new EPSG3857Projection('EPSG:102100'),
        new EPSG3857Projection('EPSG:102113'),
        new EPSG3857Projection('EPSG:900913'),
        new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857'),
    ];
    /**
     * Transformation from EPSG:4326 to EPSG:3857.
     *
     * @param {Array<number>} input Input array of coordinate values.
     * @param {Array<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension (default is `2`).
     * @return {Array<number>} Output array of coordinate values.
     */
    function fromEPSG4326(input, opt_output, opt_dimension) {
        var length = input.length;
        var dimension = opt_dimension > 1 ? opt_dimension : 2;
        var output = opt_output;
        if (output === undefined) {
            if (dimension > 2) {
                // preserve values beyond second dimension
                output = input.slice();
            }
            else {
                output = new Array(length);
            }
        }
        for (var i = 0; i < length; i += dimension) {
            output[i] = (HALF_SIZE * input[i]) / 180;
            var y = RADIUS * Math.log(Math.tan((Math.PI * (+input[i + 1] + 90)) / 360));
            if (y > MAX_SAFE_Y) {
                y = MAX_SAFE_Y;
            }
            else if (y < -MAX_SAFE_Y) {
                y = -MAX_SAFE_Y;
            }
            output[i + 1] = y;
        }
        return output;
    }
    /**
     * Transformation from EPSG:3857 to EPSG:4326.
     *
     * @param {Array<number>} input Input array of coordinate values.
     * @param {Array<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension (default is `2`).
     * @return {Array<number>} Output array of coordinate values.
     */
    function toEPSG4326(input, opt_output, opt_dimension) {
        var length = input.length;
        var dimension = opt_dimension > 1 ? opt_dimension : 2;
        var output = opt_output;
        if (output === undefined) {
            if (dimension > 2) {
                // preserve values beyond second dimension
                output = input.slice();
            }
            else {
                output = new Array(length);
            }
        }
        for (var i = 0; i < length; i += dimension) {
            output[i] = (180 * input[i]) / HALF_SIZE;
            output[i + 1] =
                (360 * Math.atan(Math.exp(input[i + 1] / RADIUS))) / Math.PI - 90;
        }
        return output;
    }

    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Semi-major radius of the WGS84 ellipsoid.
     *
     * @const
     * @type {number}
     */
    var RADIUS$1 = 6378137;
    /**
     * Extent of the EPSG:4326 projection which is the whole world.
     *
     * @const
     * @type {import("../extent.js").Extent}
     */
    var EXTENT$1 = [-180, -90, 180, 90];
    /**
     * @const
     * @type {number}
     */
    var METERS_PER_UNIT$1 = (Math.PI * RADIUS$1) / 180;
    /**
     * @classdesc
     * Projection object for WGS84 geographic coordinates (EPSG:4326).
     *
     * Note that OpenLayers does not strictly comply with the EPSG definition.
     * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
     * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
     */
    var EPSG4326Projection = /** @class */ (function (_super) {
        __extends$5(EPSG4326Projection, _super);
        /**
         * @param {string} code Code.
         * @param {string=} opt_axisOrientation Axis orientation.
         */
        function EPSG4326Projection(code, opt_axisOrientation) {
            return _super.call(this, {
                code: code,
                units: Units.DEGREES,
                extent: EXTENT$1,
                axisOrientation: opt_axisOrientation,
                global: true,
                metersPerUnit: METERS_PER_UNIT$1,
                worldExtent: EXTENT$1,
            }) || this;
        }
        return EPSG4326Projection;
    }(Projection));
    /**
     * Projections equal to EPSG:4326.
     *
     * @const
     * @type {Array<import("./Projection.js").default>}
     */
    var PROJECTIONS$1 = [
        new EPSG4326Projection('CRS:84'),
        new EPSG4326Projection('EPSG:4326', 'neu'),
        new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'),
        new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'),
        new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
    ];

    /**
     * @module ol/proj/projections
     */
    /**
     * @type {Object<string, import("./Projection.js").default>}
     */
    var cache = {};
    /**
     * Get a cached projection by code.
     * @param {string} code The code for the projection.
     * @return {import("./Projection.js").default} The projection (if cached).
     */
    function get(code) {
        return (cache[code] ||
            cache[code.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, 'EPSG:$3')] ||
            null);
    }
    /**
     * Add a projection to the cache.
     * @param {string} code The projection code.
     * @param {import("./Projection.js").default} projection The projection to cache.
     */
    function add(code, projection) {
        cache[code] = projection;
    }

    /**
     * @module ol/proj/transforms
     */
    /**
     * @private
     * @type {!Object<string, Object<string, import("../proj.js").TransformFunction>>}
     */
    var transforms = {};
    /**
     * Registers a conversion function to convert coordinates from the source
     * projection to the destination projection.
     *
     * @param {import("./Projection.js").default} source Source.
     * @param {import("./Projection.js").default} destination Destination.
     * @param {import("../proj.js").TransformFunction} transformFn Transform.
     */
    function add$1(source, destination, transformFn) {
        var sourceCode = source.getCode();
        var destinationCode = destination.getCode();
        if (!(sourceCode in transforms)) {
            transforms[sourceCode] = {};
        }
        transforms[sourceCode][destinationCode] = transformFn;
    }
    /**
     * Get a transform given a source code and a destination code.
     * @param {string} sourceCode The code for the source projection.
     * @param {string} destinationCode The code for the destination projection.
     * @return {import("../proj.js").TransformFunction|undefined} The transform function (if found).
     */
    function get$1(sourceCode, destinationCode) {
        var transform;
        if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
            transform = transforms[sourceCode][destinationCode];
        }
        return transform;
    }

    /**
     * @module ol/proj
     */
    /**
     * @param {Array<number>} input Input coordinate array.
     * @param {Array<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension.
     * @return {Array<number>} Output coordinate array (new array, same coordinate
     *     values).
     */
    function cloneTransform(input, opt_output, opt_dimension) {
        var output;
        if (opt_output !== undefined) {
            for (var i = 0, ii = input.length; i < ii; ++i) {
                opt_output[i] = input[i];
            }
            output = opt_output;
        }
        else {
            output = input.slice();
        }
        return output;
    }
    /**
     * @param {Array<number>} input Input coordinate array.
     * @param {Array<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension.
     * @return {Array<number>} Input coordinate array (same array as input).
     */
    function identityTransform(input, opt_output, opt_dimension) {
        if (opt_output !== undefined && input !== opt_output) {
            for (var i = 0, ii = input.length; i < ii; ++i) {
                opt_output[i] = input[i];
            }
            input = opt_output;
        }
        return input;
    }
    /**
     * Add a Projection object to the list of supported projections that can be
     * looked up by their code.
     *
     * @param {Projection} projection Projection instance.
     * @api
     */
    function addProjection(projection) {
        add(projection.getCode(), projection);
        add$1(projection, projection, cloneTransform);
    }
    /**
     * @param {Array<Projection>} projections Projections.
     */
    function addProjections(projections) {
        projections.forEach(addProjection);
    }
    /**
     * Fetches a Projection object for the code specified.
     *
     * @param {ProjectionLike} projectionLike Either a code string which is
     *     a combination of authority and identifier such as "EPSG:4326", or an
     *     existing projection object, or undefined.
     * @return {Projection} Projection object, or null if not in list.
     * @api
     */
    function get$2(projectionLike) {
        return typeof projectionLike === 'string'
            ? get(/** @type {string} */ (projectionLike))
            : /** @type {Projection} */ (projectionLike) || null;
    }
    /**
     * Registers transformation functions that don't alter coordinates. Those allow
     * to transform between projections with equal meaning.
     *
     * @param {Array<Projection>} projections Projections.
     * @api
     */
    function addEquivalentProjections(projections) {
        addProjections(projections);
        projections.forEach(function (source) {
            projections.forEach(function (destination) {
                if (source !== destination) {
                    add$1(source, destination, cloneTransform);
                }
            });
        });
    }
    /**
     * Registers transformation functions to convert coordinates in any projection
     * in projection1 to any projection in projection2.
     *
     * @param {Array<Projection>} projections1 Projections with equal
     *     meaning.
     * @param {Array<Projection>} projections2 Projections with equal
     *     meaning.
     * @param {TransformFunction} forwardTransform Transformation from any
     *   projection in projection1 to any projection in projection2.
     * @param {TransformFunction} inverseTransform Transform from any projection
     *   in projection2 to any projection in projection1..
     */
    function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
        projections1.forEach(function (projection1) {
            projections2.forEach(function (projection2) {
                add$1(projection1, projection2, forwardTransform);
                add$1(projection2, projection1, inverseTransform);
            });
        });
    }
    /**
     * Searches in the list of transform functions for the function for converting
     * coordinates from the source projection to the destination projection.
     *
     * @param {Projection} sourceProjection Source Projection object.
     * @param {Projection} destinationProjection Destination Projection
     *     object.
     * @return {TransformFunction} Transform function.
     */
    function getTransformFromProjections(sourceProjection, destinationProjection) {
        var sourceCode = sourceProjection.getCode();
        var destinationCode = destinationProjection.getCode();
        var transformFunc = get$1(sourceCode, destinationCode);
        if (!transformFunc) {
            transformFunc = identityTransform;
        }
        return transformFunc;
    }
    /**
     * Given the projection-like objects, searches for a transformation
     * function to convert a coordinates array from the source projection to the
     * destination projection.
     *
     * @param {ProjectionLike} source Source.
     * @param {ProjectionLike} destination Destination.
     * @return {TransformFunction} Transform function.
     * @api
     */
    function getTransform(source, destination) {
        var sourceProjection = get$2(source);
        var destinationProjection = get$2(destination);
        return getTransformFromProjections(sourceProjection, destinationProjection);
    }
    /**
     * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
     * by when this module is executed and should only need to be called again after
     * `clearAllProjections()` is called (e.g. in tests).
     */
    function addCommon() {
        // Add transformations that don't alter coordinates to convert within set of
        // projections with equal meaning.
        addEquivalentProjections(PROJECTIONS);
        addEquivalentProjections(PROJECTIONS$1);
        // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
        // coordinates and back.
        addEquivalentTransforms(PROJECTIONS$1, PROJECTIONS, fromEPSG4326, toEPSG4326);
    }
    addCommon();

    /**
     * @module ol/geom/flat/transform
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {Array<number>=} opt_dest Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function transform2D(flatCoordinates, offset, end, stride, transform, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var x = flatCoordinates[j];
            var y = flatCoordinates[j + 1];
            dest[i++] = transform[0] * x + transform[2] * y + transform[4];
            dest[i++] = transform[1] * x + transform[3] * y + transform[5];
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} angle Angle.
     * @param {Array<number>} anchor Rotation anchor point.
     * @param {Array<number>=} opt_dest Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function rotate(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var anchorX = anchor[0];
        var anchorY = anchor[1];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var deltaX = flatCoordinates[j] - anchorX;
            var deltaY = flatCoordinates[j + 1] - anchorY;
            dest[i++] = anchorX + deltaX * cos - deltaY * sin;
            dest[i++] = anchorY + deltaX * sin + deltaY * cos;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * Scale the coordinates.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} sx Scale factor in the x-direction.
     * @param {number} sy Scale factor in the y-direction.
     * @param {Array<number>} anchor Scale anchor point.
     * @param {Array<number>=} opt_dest Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function scale(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var anchorX = anchor[0];
        var anchorY = anchor[1];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var deltaX = flatCoordinates[j] - anchorX;
            var deltaY = flatCoordinates[j + 1] - anchorY;
            dest[i++] = anchorX + sx * deltaX;
            dest[i++] = anchorY + sy * deltaY;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} deltaX Delta X.
     * @param {number} deltaY Delta Y.
     * @param {Array<number>=} opt_dest Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function translate(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            dest[i++] = flatCoordinates[j] + deltaX;
            dest[i++] = flatCoordinates[j + 1] + deltaY;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }

    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @type {import("../transform.js").Transform}
     */
    var tmpTransform = create();
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for vector geometries.
     *
     * To get notified of changes to the geometry, register a listener for the
     * generic `change` event on your geometry instance.
     *
     * @abstract
     * @api
     */
    var Geometry = /** @class */ (function (_super) {
        __extends$6(Geometry, _super);
        function Geometry() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {import("../extent.js").Extent}
             */
            _this.extent_ = createEmpty();
            /**
             * @private
             * @type {number}
             */
            _this.extentRevision_ = -1;
            /**
             * @protected
             * @type {number}
             */
            _this.simplifiedGeometryMaxMinSquaredTolerance = 0;
            /**
             * @protected
             * @type {number}
             */
            _this.simplifiedGeometryRevision = 0;
            /**
             * Get a transformed and simplified version of the geometry.
             * @abstract
             * @param {number} revision The geometry revision.
             * @param {number} squaredTolerance Squared tolerance.
             * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
             * @return {Geometry} Simplified geometry.
             */
            _this.simplifyTransformedInternal = memoizeOne(function (revision, squaredTolerance, opt_transform) {
                if (!opt_transform) {
                    return this.getSimplifiedGeometry(squaredTolerance);
                }
                var clone = this.clone();
                clone.applyTransform(opt_transform);
                return clone.getSimplifiedGeometry(squaredTolerance);
            });
            return _this;
        }
        /**
         * Get a transformed and simplified version of the geometry.
         * @abstract
         * @param {number} squaredTolerance Squared tolerance.
         * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
         * @return {Geometry} Simplified geometry.
         */
        Geometry.prototype.simplifyTransformed = function (squaredTolerance, opt_transform) {
            return this.simplifyTransformedInternal(this.getRevision(), squaredTolerance, opt_transform);
        };
        /**
         * Make a complete copy of the geometry.
         * @abstract
         * @return {!Geometry} Clone.
         */
        Geometry.prototype.clone = function () {
            return abstract();
        };
        /**
         * @abstract
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        Geometry.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            return abstract();
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @return {boolean} Contains (x, y).
         */
        Geometry.prototype.containsXY = function (x, y) {
            var coord = this.getClosestPoint([x, y]);
            return coord[0] === x && coord[1] === y;
        };
        /**
         * Return the closest point of the geometry to the passed point as
         * {@link module:ol/coordinate~Coordinate coordinate}.
         * @param {import("../coordinate.js").Coordinate} point Point.
         * @param {import("../coordinate.js").Coordinate=} opt_closestPoint Closest point.
         * @return {import("../coordinate.js").Coordinate} Closest point.
         * @api
         */
        Geometry.prototype.getClosestPoint = function (point, opt_closestPoint) {
            var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
            this.closestPointXY(point[0], point[1], closestPoint, Infinity);
            return closestPoint;
        };
        /**
         * Returns true if this geometry includes the specified coordinate. If the
         * coordinate is on the boundary of the geometry, returns false.
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @return {boolean} Contains coordinate.
         * @api
         */
        Geometry.prototype.intersectsCoordinate = function (coordinate) {
            return this.containsXY(coordinate[0], coordinate[1]);
        };
        /**
         * @abstract
         * @param {import("../extent.js").Extent} extent Extent.
         * @protected
         * @return {import("../extent.js").Extent} extent Extent.
         */
        Geometry.prototype.computeExtent = function (extent) {
            return abstract();
        };
        /**
         * Get the extent of the geometry.
         * @param {import("../extent.js").Extent=} opt_extent Extent.
         * @return {import("../extent.js").Extent} extent Extent.
         * @api
         */
        Geometry.prototype.getExtent = function (opt_extent) {
            if (this.extentRevision_ != this.getRevision()) {
                var extent = this.computeExtent(this.extent_);
                if (isNaN(extent[0]) || isNaN(extent[1])) {
                    createOrUpdateEmpty(extent);
                }
                this.extentRevision_ = this.getRevision();
            }
            return returnOrUpdate(this.extent_, opt_extent);
        };
        /**
         * Rotate the geometry around a given coordinate. This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} angle Rotation angle in radians.
         * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
         * @api
         */
        Geometry.prototype.rotate = function (angle, anchor) {
            abstract();
        };
        /**
         * Scale the geometry (with an optional origin).  This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} sx The scaling factor in the x-direction.
         * @param {number=} opt_sy The scaling factor in the y-direction (defaults to sx).
         * @param {import("../coordinate.js").Coordinate=} opt_anchor The scale origin (defaults to the center
         *     of the geometry extent).
         * @api
         */
        Geometry.prototype.scale = function (sx, opt_sy, opt_anchor) {
            abstract();
        };
        /**
         * Create a simplified version of this geometry.  For linestrings, this uses
         * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
         * algorithm.  For polygons, a quantization-based
         * simplification is used to preserve topology.
         * @param {number} tolerance The tolerance distance for simplification.
         * @return {Geometry} A new, simplified version of the original geometry.
         * @api
         */
        Geometry.prototype.simplify = function (tolerance) {
            return this.getSimplifiedGeometry(tolerance * tolerance);
        };
        /**
         * Create a simplified version of this geometry using the Douglas Peucker
         * algorithm.
         * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
         * @abstract
         * @param {number} squaredTolerance Squared tolerance.
         * @return {Geometry} Simplified geometry.
         */
        Geometry.prototype.getSimplifiedGeometry = function (squaredTolerance) {
            return abstract();
        };
        /**
         * Get the type of this geometry.
         * @abstract
         * @return {import("./GeometryType.js").default} Geometry type.
         */
        Geometry.prototype.getType = function () {
            return abstract();
        };
        /**
         * Apply a transform function to the coordinates of the geometry.
         * The geometry is modified in place.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         * @abstract
         * @param {import("../proj.js").TransformFunction} transformFn Transform function.
         * Called with a flat array of geometry coordinates.
         */
        Geometry.prototype.applyTransform = function (transformFn) {
            abstract();
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @abstract
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         */
        Geometry.prototype.intersectsExtent = function (extent) {
            return abstract();
        };
        /**
         * Translate the geometry.  This modifies the geometry coordinates in place.  If
         * instead you want a new geometry, first `clone()` this geometry.
         * @abstract
         * @param {number} deltaX Delta X.
         * @param {number} deltaY Delta Y.
         * @api
         */
        Geometry.prototype.translate = function (deltaX, deltaY) {
            abstract();
        };
        /**
         * Transform each coordinate of the geometry from one coordinate reference
         * system to another. The geometry is modified in place.
         * For example, a line will be transformed to a line and a circle to a circle.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         *
         * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
         *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
         * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
         *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
         * @return {Geometry} This geometry.  Note that original geometry is
         *     modified in place.
         * @api
         */
        Geometry.prototype.transform = function (source, destination) {
            /** @type {import("../proj/Projection.js").default} */
            var sourceProj = get$2(source);
            var transformFn = sourceProj.getUnits() == Units.TILE_PIXELS
                ? function (inCoordinates, outCoordinates, stride) {
                    var pixelExtent = sourceProj.getExtent();
                    var projectedExtent = sourceProj.getWorldExtent();
                    var scale = getHeight(projectedExtent) / getHeight(pixelExtent);
                    compose(tmpTransform, projectedExtent[0], projectedExtent[3], scale, -scale, 0, 0, 0);
                    transform2D(inCoordinates, 0, inCoordinates.length, stride, tmpTransform, outCoordinates);
                    return getTransform(sourceProj, destination)(inCoordinates, outCoordinates, stride);
                }
                : getTransform(sourceProj, destination);
            this.applyTransform(transformFn);
            return this;
        };
        return Geometry;
    }(BaseObject));

    var __extends$7 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Abstract base class; only used for creating subclasses; do not instantiate
     * in apps, as cannot be rendered.
     *
     * @abstract
     * @api
     */
    var SimpleGeometry = /** @class */ (function (_super) {
        __extends$7(SimpleGeometry, _super);
        function SimpleGeometry() {
            var _this = _super.call(this) || this;
            /**
             * @protected
             * @type {import("./GeometryLayout.js").default}
             */
            _this.layout = GeometryLayout.XY;
            /**
             * @protected
             * @type {number}
             */
            _this.stride = 2;
            /**
             * @protected
             * @type {Array<number>}
             */
            _this.flatCoordinates = null;
            return _this;
        }
        /**
         * @param {import("../extent.js").Extent} extent Extent.
         * @protected
         * @return {import("../extent.js").Extent} extent Extent.
         */
        SimpleGeometry.prototype.computeExtent = function (extent) {
            return createOrUpdateFromFlatCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
        };
        /**
         * @abstract
         * @return {Array<*>} Coordinates.
         */
        SimpleGeometry.prototype.getCoordinates = function () {
            return abstract();
        };
        /**
         * Return the first coordinate of the geometry.
         * @return {import("../coordinate.js").Coordinate} First coordinate.
         * @api
         */
        SimpleGeometry.prototype.getFirstCoordinate = function () {
            return this.flatCoordinates.slice(0, this.stride);
        };
        /**
         * @return {Array<number>} Flat coordinates.
         */
        SimpleGeometry.prototype.getFlatCoordinates = function () {
            return this.flatCoordinates;
        };
        /**
         * Return the last coordinate of the geometry.
         * @return {import("../coordinate.js").Coordinate} Last point.
         * @api
         */
        SimpleGeometry.prototype.getLastCoordinate = function () {
            return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
        };
        /**
         * Return the {@link module:ol/geom/GeometryLayout layout} of the geometry.
         * @return {import("./GeometryLayout.js").default} Layout.
         * @api
         */
        SimpleGeometry.prototype.getLayout = function () {
            return this.layout;
        };
        /**
         * Create a simplified version of this geometry using the Douglas Peucker algorithm.
         * @param {number} squaredTolerance Squared tolerance.
         * @return {SimpleGeometry} Simplified geometry.
         */
        SimpleGeometry.prototype.getSimplifiedGeometry = function (squaredTolerance) {
            if (this.simplifiedGeometryRevision !== this.getRevision()) {
                this.simplifiedGeometryMaxMinSquaredTolerance = 0;
                this.simplifiedGeometryRevision = this.getRevision();
            }
            // If squaredTolerance is negative or if we know that simplification will not
            // have any effect then just return this.
            if (squaredTolerance < 0 ||
                (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
                    squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
                return this;
            }
            var simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
            var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
            if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
                return simplifiedGeometry;
            }
            else {
                // Simplification did not actually remove any coordinates.  We now know
                // that any calls to getSimplifiedGeometry with a squaredTolerance less
                // than or equal to the current squaredTolerance will also not have any
                // effect.  This allows us to short circuit simplification (saving CPU
                // cycles) and prevents the cache of simplified geometries from filling
                // up with useless identical copies of this geometry (saving memory).
                this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
                return this;
            }
        };
        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {SimpleGeometry} Simplified geometry.
         * @protected
         */
        SimpleGeometry.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
            return this;
        };
        /**
         * @return {number} Stride.
         */
        SimpleGeometry.prototype.getStride = function () {
            return this.stride;
        };
        /**
         * @param {import("./GeometryLayout.js").default} layout Layout.
         * @param {Array<number>} flatCoordinates Flat coordinates.
         */
        SimpleGeometry.prototype.setFlatCoordinates = function (layout, flatCoordinates) {
            this.stride = getStrideForLayout(layout);
            this.layout = layout;
            this.flatCoordinates = flatCoordinates;
        };
        /**
         * @abstract
         * @param {!Array<*>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         */
        SimpleGeometry.prototype.setCoordinates = function (coordinates, opt_layout) {
            abstract();
        };
        /**
         * @param {import("./GeometryLayout.js").default|undefined} layout Layout.
         * @param {Array<*>} coordinates Coordinates.
         * @param {number} nesting Nesting.
         * @protected
         */
        SimpleGeometry.prototype.setLayout = function (layout, coordinates, nesting) {
            /** @type {number} */
            var stride;
            if (layout) {
                stride = getStrideForLayout(layout);
            }
            else {
                for (var i = 0; i < nesting; ++i) {
                    if (coordinates.length === 0) {
                        this.layout = GeometryLayout.XY;
                        this.stride = 2;
                        return;
                    }
                    else {
                        coordinates = /** @type {Array} */ (coordinates[0]);
                    }
                }
                stride = coordinates.length;
                layout = getLayoutForStride(stride);
            }
            this.layout = layout;
            this.stride = stride;
        };
        /**
         * Apply a transform function to the coordinates of the geometry.
         * The geometry is modified in place.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         * @param {import("../proj.js").TransformFunction} transformFn Transform function.
         * Called with a flat array of geometry coordinates.
         * @api
         */
        SimpleGeometry.prototype.applyTransform = function (transformFn) {
            if (this.flatCoordinates) {
                transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
                this.changed();
            }
        };
        /**
         * Rotate the geometry around a given coordinate. This modifies the geometry
         * coordinates in place.
         * @param {number} angle Rotation angle in counter-clockwise radians.
         * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
         * @api
         */
        SimpleGeometry.prototype.rotate = function (angle, anchor) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                rotate(flatCoordinates, 0, flatCoordinates.length, stride, angle, anchor, flatCoordinates);
                this.changed();
            }
        };
        /**
         * Scale the geometry (with an optional origin).  This modifies the geometry
         * coordinates in place.
         * @param {number} sx The scaling factor in the x-direction.
         * @param {number=} opt_sy The scaling factor in the y-direction (defaults to sx).
         * @param {import("../coordinate.js").Coordinate=} opt_anchor The scale origin (defaults to the center
         *     of the geometry extent).
         * @api
         */
        SimpleGeometry.prototype.scale = function (sx, opt_sy, opt_anchor) {
            var sy = opt_sy;
            if (sy === undefined) {
                sy = sx;
            }
            var anchor = opt_anchor;
            if (!anchor) {
                anchor = getCenter(this.getExtent());
            }
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                scale(flatCoordinates, 0, flatCoordinates.length, stride, sx, sy, anchor, flatCoordinates);
                this.changed();
            }
        };
        /**
         * Translate the geometry.  This modifies the geometry coordinates in place.  If
         * instead you want a new geometry, first `clone()` this geometry.
         * @param {number} deltaX Delta X.
         * @param {number} deltaY Delta Y.
         * @api
         */
        SimpleGeometry.prototype.translate = function (deltaX, deltaY) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                translate(flatCoordinates, 0, flatCoordinates.length, stride, deltaX, deltaY, flatCoordinates);
                this.changed();
            }
        };
        return SimpleGeometry;
    }(Geometry));
    /**
     * @param {number} stride Stride.
     * @return {import("./GeometryLayout.js").default} layout Layout.
     */
    function getLayoutForStride(stride) {
        var layout;
        if (stride == 2) {
            layout = GeometryLayout.XY;
        }
        else if (stride == 3) {
            layout = GeometryLayout.XYZ;
        }
        else if (stride == 4) {
            layout = GeometryLayout.XYZM;
        }
        return /** @type {import("./GeometryLayout.js").default} */ (layout);
    }
    /**
     * @param {import("./GeometryLayout.js").default} layout Layout.
     * @return {number} Stride.
     */
    function getStrideForLayout(layout) {
        var stride;
        if (layout == GeometryLayout.XY) {
            stride = 2;
        }
        else if (layout == GeometryLayout.XYZ || layout == GeometryLayout.XYM) {
            stride = 3;
        }
        else if (layout == GeometryLayout.XYZM) {
            stride = 4;
        }
        return /** @type {number} */ (stride);
    }

    /**
     * @module ol/geom/flat/closest
     */
    /**
     * Returns the point on the 2D line segment flatCoordinates[offset1] to
     * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
     * dimensions are linearly interpolated.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset1 Offset 1.
     * @param {number} offset2 Offset 2.
     * @param {number} stride Stride.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {Array<number>} closestPoint Closest point.
     */
    function assignClosest(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
        var x1 = flatCoordinates[offset1];
        var y1 = flatCoordinates[offset1 + 1];
        var dx = flatCoordinates[offset2] - x1;
        var dy = flatCoordinates[offset2 + 1] - y1;
        var offset;
        if (dx === 0 && dy === 0) {
            offset = offset1;
        }
        else {
            var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                offset = offset2;
            }
            else if (t > 0) {
                for (var i = 0; i < stride; ++i) {
                    closestPoint[i] = lerp(flatCoordinates[offset1 + i], flatCoordinates[offset2 + i], t);
                }
                closestPoint.length = stride;
                return;
            }
            else {
                offset = offset1;
            }
        }
        for (var i = 0; i < stride; ++i) {
            closestPoint[i] = flatCoordinates[offset + i];
        }
        closestPoint.length = stride;
    }
    /**
     * Return the squared of the largest distance between any pair of consecutive
     * coordinates.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} max Max squared delta.
     * @return {number} Max squared delta.
     */
    function maxSquaredDelta(flatCoordinates, offset, end, stride, max) {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        for (offset += stride; offset < end; offset += stride) {
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            var squaredDelta = squaredDistance(x1, y1, x2, y2);
            if (squaredDelta > max) {
                max = squaredDelta;
            }
            x1 = x2;
            y1 = y2;
        }
        return max;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {number} max Max squared delta.
     * @return {number} Max squared delta.
     */
    function arrayMaxSquaredDelta(flatCoordinates, offset, ends, stride, max) {
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            max = maxSquaredDelta(flatCoordinates, offset, end, stride, max);
            offset = end;
        }
        return max;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} maxDelta Max delta.
     * @param {boolean} isRing Is ring.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {Array<number>} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @param {Array<number>=} opt_tmpPoint Temporary point object.
     * @return {number} Minimum squared distance.
     */
    function assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
        if (offset == end) {
            return minSquaredDistance;
        }
        var i, squaredDistance$1;
        if (maxDelta === 0) {
            // All points are identical, so just test the first point.
            squaredDistance$1 = squaredDistance(x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
            if (squaredDistance$1 < minSquaredDistance) {
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = flatCoordinates[offset + i];
                }
                closestPoint.length = stride;
                return squaredDistance$1;
            }
            else {
                return minSquaredDistance;
            }
        }
        var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
        var index = offset + stride;
        while (index < end) {
            assignClosest(flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
            squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
            if (squaredDistance$1 < minSquaredDistance) {
                minSquaredDistance = squaredDistance$1;
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = tmpPoint[i];
                }
                closestPoint.length = stride;
                index += stride;
            }
            else {
                // Skip ahead multiple points, because we know that all the skipped
                // points cannot be any closer than the closest point we have found so
                // far.  We know this because we know how close the current point is, how
                // close the closest point we have found so far is, and the maximum
                // distance between consecutive points.  For example, if we're currently
                // at distance 10, the best we've found so far is 3, and that the maximum
                // distance between consecutive points is 2, then we'll need to skip at
                // least (10 - 3) / 2 == 3 (rounded down) points to have any chance of
                // finding a closer point.  We use Math.max(..., 1) to ensure that we
                // always advance at least one point, to avoid an infinite loop.
                index +=
                    stride *
                        Math.max(((Math.sqrt(squaredDistance$1) - Math.sqrt(minSquaredDistance)) /
                            maxDelta) |
                            0, 1);
            }
        }
        if (isRing) {
            // Check the closing segment.
            assignClosest(flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
            squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
            if (squaredDistance$1 < minSquaredDistance) {
                minSquaredDistance = squaredDistance$1;
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = tmpPoint[i];
                }
                closestPoint.length = stride;
            }
        }
        return minSquaredDistance;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {number} maxDelta Max delta.
     * @param {boolean} isRing Is ring.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {Array<number>} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @param {Array<number>=} opt_tmpPoint Temporary point object.
     * @return {number} Minimum squared distance.
     */
    function assignClosestArrayPoint(flatCoordinates, offset, ends, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
        var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            minSquaredDistance = assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
            offset = end;
        }
        return minSquaredDistance;
    }

    /**
     * @module ol/geom/flat/deflate
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} stride Stride.
     * @return {number} offset Offset.
     */
    function deflateCoordinate(flatCoordinates, offset, coordinate, stride) {
        for (var i = 0, ii = coordinate.length; i < ii; ++i) {
            flatCoordinates[offset++] = coordinate[i];
        }
        return offset;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<import("../../coordinate.js").Coordinate>} coordinates Coordinates.
     * @param {number} stride Stride.
     * @return {number} offset Offset.
     */
    function deflateCoordinates(flatCoordinates, offset, coordinates, stride) {
        for (var i = 0, ii = coordinates.length; i < ii; ++i) {
            var coordinate = coordinates[i];
            for (var j = 0; j < stride; ++j) {
                flatCoordinates[offset++] = coordinate[j];
            }
        }
        return offset;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<Array<import("../../coordinate.js").Coordinate>>} coordinatess Coordinatess.
     * @param {number} stride Stride.
     * @param {Array<number>=} opt_ends Ends.
     * @return {Array<number>} Ends.
     */
    function deflateCoordinatesArray(flatCoordinates, offset, coordinatess, stride, opt_ends) {
        var ends = opt_ends ? opt_ends : [];
        var i = 0;
        for (var j = 0, jj = coordinatess.length; j < jj; ++j) {
            var end = deflateCoordinates(flatCoordinates, offset, coordinatess[j], stride);
            ends[i++] = end;
            offset = end;
        }
        ends.length = i;
        return ends;
    }

    /**
     * @module ol/geom/flat/simplify
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {Array<number>} simplifiedFlatCoordinates Simplified flat
     *     coordinates.
     * @param {number} simplifiedOffset Simplified offset.
     * @return {number} Simplified offset.
     */
    function douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
        var n = (end - offset) / stride;
        if (n < 3) {
            for (; offset < end; offset += stride) {
                simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + 1];
            }
            return simplifiedOffset;
        }
        /** @type {Array<number>} */
        var markers = new Array(n);
        markers[0] = 1;
        markers[n - 1] = 1;
        /** @type {Array<number>} */
        var stack = [offset, end - stride];
        var index = 0;
        while (stack.length > 0) {
            var last = stack.pop();
            var first = stack.pop();
            var maxSquaredDistance = 0;
            var x1 = flatCoordinates[first];
            var y1 = flatCoordinates[first + 1];
            var x2 = flatCoordinates[last];
            var y2 = flatCoordinates[last + 1];
            for (var i = first + stride; i < last; i += stride) {
                var x = flatCoordinates[i];
                var y = flatCoordinates[i + 1];
                var squaredDistance_1 = squaredSegmentDistance(x, y, x1, y1, x2, y2);
                if (squaredDistance_1 > maxSquaredDistance) {
                    index = i;
                    maxSquaredDistance = squaredDistance_1;
                }
            }
            if (maxSquaredDistance > squaredTolerance) {
                markers[(index - offset) / stride] = 1;
                if (first + stride < index) {
                    stack.push(first, index);
                }
                if (index + stride < last) {
                    stack.push(index, last);
                }
            }
        }
        for (var i = 0; i < n; ++i) {
            if (markers[i]) {
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + i * stride];
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + i * stride + 1];
            }
        }
        return simplifiedOffset;
    }
    /**
     * @param {number} value Value.
     * @param {number} tolerance Tolerance.
     * @return {number} Rounded value.
     */
    function snap(value, tolerance) {
        return tolerance * Math.round(value / tolerance);
    }
    /**
     * Simplifies a line string using an algorithm designed by Tim Schaub.
     * Coordinates are snapped to the nearest value in a virtual grid and
     * consecutive duplicate coordinates are discarded.  This effectively preserves
     * topology as the simplification of any subsection of a line string is
     * independent of the rest of the line string.  This means that, for examples,
     * the common edge between two polygons will be simplified to the same line
     * string independently in both polygons.  This implementation uses a single
     * pass over the coordinates and eliminates intermediate collinear points.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} tolerance Tolerance.
     * @param {Array<number>} simplifiedFlatCoordinates Simplified flat
     *     coordinates.
     * @param {number} simplifiedOffset Simplified offset.
     * @return {number} Simplified offset.
     */
    function quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
        // do nothing if the line is empty
        if (offset == end) {
            return simplifiedOffset;
        }
        // snap the first coordinate (P1)
        var x1 = snap(flatCoordinates[offset], tolerance);
        var y1 = snap(flatCoordinates[offset + 1], tolerance);
        offset += stride;
        // add the first coordinate to the output
        simplifiedFlatCoordinates[simplifiedOffset++] = x1;
        simplifiedFlatCoordinates[simplifiedOffset++] = y1;
        // find the next coordinate that does not snap to the same value as the first
        // coordinate (P2)
        var x2, y2;
        do {
            x2 = snap(flatCoordinates[offset], tolerance);
            y2 = snap(flatCoordinates[offset + 1], tolerance);
            offset += stride;
            if (offset == end) {
                // all coordinates snap to the same value, the line collapses to a point
                // push the last snapped value anyway to ensure that the output contains
                // at least two points
                // FIXME should we really return at least two points anyway?
                simplifiedFlatCoordinates[simplifiedOffset++] = x2;
                simplifiedFlatCoordinates[simplifiedOffset++] = y2;
                return simplifiedOffset;
            }
        } while (x2 == x1 && y2 == y1);
        while (offset < end) {
            // snap the next coordinate (P3)
            var x3 = snap(flatCoordinates[offset], tolerance);
            var y3 = snap(flatCoordinates[offset + 1], tolerance);
            offset += stride;
            // skip P3 if it is equal to P2
            if (x3 == x2 && y3 == y2) {
                continue;
            }
            // calculate the delta between P1 and P2
            var dx1 = x2 - x1;
            var dy1 = y2 - y1;
            // calculate the delta between P3 and P1
            var dx2 = x3 - x1;
            var dy2 = y3 - y1;
            // if P1, P2, and P3 are colinear and P3 is further from P1 than P2 is from
            // P1 in the same direction then P2 is on the straight line between P1 and
            // P3
            if (dx1 * dy2 == dy1 * dx2 &&
                ((dx1 < 0 && dx2 < dx1) || dx1 == dx2 || (dx1 > 0 && dx2 > dx1)) &&
                ((dy1 < 0 && dy2 < dy1) || dy1 == dy2 || (dy1 > 0 && dy2 > dy1))) {
                // discard P2 and set P2 = P3
                x2 = x3;
                y2 = y3;
                continue;
            }
            // either P1, P2, and P3 are not colinear, or they are colinear but P3 is
            // between P3 and P1 or on the opposite half of the line to P2.  add P2,
            // and continue with P1 = P2 and P2 = P3
            simplifiedFlatCoordinates[simplifiedOffset++] = x2;
            simplifiedFlatCoordinates[simplifiedOffset++] = y2;
            x1 = x2;
            y1 = y2;
            x2 = x3;
            y2 = y3;
        }
        // add the last point (P2)
        simplifiedFlatCoordinates[simplifiedOffset++] = x2;
        simplifiedFlatCoordinates[simplifiedOffset++] = y2;
        return simplifiedOffset;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {number} tolerance Tolerance.
     * @param {Array<number>} simplifiedFlatCoordinates Simplified flat
     *     coordinates.
     * @param {number} simplifiedOffset Simplified offset.
     * @param {Array<number>} simplifiedEnds Simplified ends.
     * @return {number} Simplified offset.
     */
    function quantizeArray(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            simplifiedOffset = quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset);
            simplifiedEnds.push(simplifiedOffset);
            offset = end;
        }
        return simplifiedOffset;
    }

    /**
     * @module ol/geom/flat/inflate
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {Array<import("../../coordinate.js").Coordinate>=} opt_coordinates Coordinates.
     * @return {Array<import("../../coordinate.js").Coordinate>} Coordinates.
     */
    function inflateCoordinates(flatCoordinates, offset, end, stride, opt_coordinates) {
        var coordinates = opt_coordinates !== undefined ? opt_coordinates : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            coordinates[i++] = flatCoordinates.slice(j, j + stride);
        }
        coordinates.length = i;
        return coordinates;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {Array<Array<import("../../coordinate.js").Coordinate>>=} opt_coordinatess Coordinatess.
     * @return {Array<Array<import("../../coordinate.js").Coordinate>>} Coordinatess.
     */
    function inflateCoordinatesArray(flatCoordinates, offset, ends, stride, opt_coordinatess) {
        var coordinatess = opt_coordinatess !== undefined ? opt_coordinatess : [];
        var i = 0;
        for (var j = 0, jj = ends.length; j < jj; ++j) {
            var end = ends[j];
            coordinatess[i++] = inflateCoordinates(flatCoordinates, offset, end, stride, coordinatess[i]);
            offset = end;
        }
        coordinatess.length = i;
        return coordinatess;
    }

    /**
     * @module ol/geom/flat/area
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {number} Area.
     */
    function linearRing(flatCoordinates, offset, end, stride) {
        var twiceArea = 0;
        var x1 = flatCoordinates[end - stride];
        var y1 = flatCoordinates[end - stride + 1];
        for (; offset < end; offset += stride) {
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            twiceArea += y1 * x2 - x1 * y2;
            x1 = x2;
            y1 = y2;
        }
        return twiceArea / 2;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @return {number} Area.
     */
    function linearRings(flatCoordinates, offset, ends, stride) {
        var area = 0;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            area += linearRing(flatCoordinates, offset, end, stride);
            offset = end;
        }
        return area;
    }

    var __extends$8 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Linear ring geometry. Only used as part of polygon; cannot be rendered
     * on its own.
     *
     * @api
     */
    var LinearRing = /** @class */ (function (_super) {
        __extends$8(LinearRing, _super);
        /**
         * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
         *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         */
        function LinearRing(coordinates, opt_layout) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {number}
             */
            _this.maxDelta_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.maxDeltaRevision_ = -1;
            if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
                _this.setFlatCoordinates(opt_layout, 
                /** @type {Array<number>} */ (coordinates));
            }
            else {
                _this.setCoordinates(
                /** @type {Array<import("../coordinate.js").Coordinate>} */ (coordinates), opt_layout);
            }
            return _this;
        }
        /**
         * Make a complete copy of the geometry.
         * @return {!LinearRing} Clone.
         * @api
         */
        LinearRing.prototype.clone = function () {
            return new LinearRing(this.flatCoordinates.slice(), this.layout);
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        LinearRing.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(maxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return assignClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
        };
        /**
         * Return the area of the linear ring on projected plane.
         * @return {number} Area (on projected plane).
         * @api
         */
        LinearRing.prototype.getArea = function () {
            return linearRing(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };
        /**
         * Return the coordinates of the linear ring.
         * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
         * @api
         */
        LinearRing.prototype.getCoordinates = function () {
            return inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };
        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {LinearRing} Simplified LinearRing.
         * @protected
         */
        LinearRing.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            simplifiedFlatCoordinates.length = douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
            return new LinearRing(simplifiedFlatCoordinates, GeometryLayout.XY);
        };
        /**
         * Get the type of this geometry.
         * @return {import("./GeometryType.js").default} Geometry type.
         * @api
         */
        LinearRing.prototype.getType = function () {
            return GeometryType.LINEAR_RING;
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         * @api
         */
        LinearRing.prototype.intersectsExtent = function (extent) {
            return false;
        };
        /**
         * Set the coordinates of the linear ring.
         * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         * @api
         */
        LinearRing.prototype.setCoordinates = function (coordinates, opt_layout) {
            this.setLayout(opt_layout, coordinates, 1);
            if (!this.flatCoordinates) {
                this.flatCoordinates = [];
            }
            this.flatCoordinates.length = deflateCoordinates(this.flatCoordinates, 0, coordinates, this.stride);
            this.changed();
        };
        return LinearRing;
    }(SimpleGeometry));

    var __extends$9 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Point geometry.
     *
     * @api
     */
    var Point = /** @class */ (function (_super) {
        __extends$9(Point, _super);
        /**
         * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         */
        function Point(coordinates, opt_layout) {
            var _this = _super.call(this) || this;
            _this.setCoordinates(coordinates, opt_layout);
            return _this;
        }
        /**
         * Make a complete copy of the geometry.
         * @return {!Point} Clone.
         * @api
         */
        Point.prototype.clone = function () {
            var point = new Point(this.flatCoordinates.slice(), this.layout);
            point.applyProperties(this);
            return point;
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        Point.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            var flatCoordinates = this.flatCoordinates;
            var squaredDistance$1 = squaredDistance(x, y, flatCoordinates[0], flatCoordinates[1]);
            if (squaredDistance$1 < minSquaredDistance) {
                var stride = this.stride;
                for (var i = 0; i < stride; ++i) {
                    closestPoint[i] = flatCoordinates[i];
                }
                closestPoint.length = stride;
                return squaredDistance$1;
            }
            else {
                return minSquaredDistance;
            }
        };
        /**
         * Return the coordinate of the point.
         * @return {import("../coordinate.js").Coordinate} Coordinates.
         * @api
         */
        Point.prototype.getCoordinates = function () {
            return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
        };
        /**
         * @param {import("../extent.js").Extent} extent Extent.
         * @protected
         * @return {import("../extent.js").Extent} extent Extent.
         */
        Point.prototype.computeExtent = function (extent) {
            return createOrUpdateFromCoordinate(this.flatCoordinates, extent);
        };
        /**
         * Get the type of this geometry.
         * @return {import("./GeometryType.js").default} Geometry type.
         * @api
         */
        Point.prototype.getType = function () {
            return GeometryType.POINT;
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         * @api
         */
        Point.prototype.intersectsExtent = function (extent) {
            return containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
        };
        /**
         * @param {!Array<*>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         * @api
         */
        Point.prototype.setCoordinates = function (coordinates, opt_layout) {
            this.setLayout(opt_layout, coordinates, 0);
            if (!this.flatCoordinates) {
                this.flatCoordinates = [];
            }
            this.flatCoordinates.length = deflateCoordinate(this.flatCoordinates, 0, coordinates, this.stride);
            this.changed();
        };
        return Point;
    }(SimpleGeometry));

    /**
     * @module ol/geom/flat/contains
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @return {boolean} Contains extent.
     */
    function linearRingContainsExtent(flatCoordinates, offset, end, stride, extent) {
        var outside = forEachCorner(extent, 
        /**
         * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
         * @return {boolean} Contains (x, y).
         */
        function (coordinate) {
            return !linearRingContainsXY(flatCoordinates, offset, end, stride, coordinate[0], coordinate[1]);
        });
        return !outside;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} x X.
     * @param {number} y Y.
     * @return {boolean} Contains (x, y).
     */
    function linearRingContainsXY(flatCoordinates, offset, end, stride, x, y) {
        // http://geomalgorithms.com/a03-_inclusion.html
        // Copyright 2000 softSurfer, 2012 Dan Sunday
        // This code may be freely used and modified for any purpose
        // providing that this copyright notice is included with it.
        // SoftSurfer makes no warranty for this code, and cannot be held
        // liable for any real or imagined damage resulting from its use.
        // Users of this code must verify correctness for their application.
        var wn = 0;
        var x1 = flatCoordinates[end - stride];
        var y1 = flatCoordinates[end - stride + 1];
        for (; offset < end; offset += stride) {
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            if (y1 <= y) {
                if (y2 > y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) > 0) {
                    wn++;
                }
            }
            else if (y2 <= y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) < 0) {
                wn--;
            }
            x1 = x2;
            y1 = y2;
        }
        return wn !== 0;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {number} x X.
     * @param {number} y Y.
     * @return {boolean} Contains (x, y).
     */
    function linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y) {
        if (ends.length === 0) {
            return false;
        }
        if (!linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
            return false;
        }
        for (var i = 1, ii = ends.length; i < ii; ++i) {
            if (linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @module ol/geom/flat/interiorpoint
     */
    /**
     * Calculates a point that is likely to lie in the interior of the linear rings.
     * Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {Array<number>} flatCenters Flat centers.
     * @param {number} flatCentersOffset Flat center offset.
     * @param {Array<number>=} opt_dest Destination.
     * @return {Array<number>} Destination point as XYM coordinate, where M is the
     * length of the horizontal intersection that the point belongs to.
     */
    function getInteriorPointOfArray(flatCoordinates, offset, ends, stride, flatCenters, flatCentersOffset, opt_dest) {
        var i, ii, x, x1, x2, y1, y2;
        var y = flatCenters[flatCentersOffset + 1];
        /** @type {Array<number>} */
        var intersections = [];
        // Calculate intersections with the horizontal line
        for (var r = 0, rr = ends.length; r < rr; ++r) {
            var end = ends[r];
            x1 = flatCoordinates[end - stride];
            y1 = flatCoordinates[end - stride + 1];
            for (i = offset; i < end; i += stride) {
                x2 = flatCoordinates[i];
                y2 = flatCoordinates[i + 1];
                if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
                    x = ((y - y1) / (y2 - y1)) * (x2 - x1) + x1;
                    intersections.push(x);
                }
                x1 = x2;
                y1 = y2;
            }
        }
        // Find the longest segment of the horizontal line that has its center point
        // inside the linear ring.
        var pointX = NaN;
        var maxSegmentLength = -Infinity;
        intersections.sort(numberSafeCompareFunction);
        x1 = intersections[0];
        for (i = 1, ii = intersections.length; i < ii; ++i) {
            x2 = intersections[i];
            var segmentLength = Math.abs(x2 - x1);
            if (segmentLength > maxSegmentLength) {
                x = (x1 + x2) / 2;
                if (linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
                    pointX = x;
                    maxSegmentLength = segmentLength;
                }
            }
            x1 = x2;
        }
        if (isNaN(pointX)) {
            // There is no horizontal line that has its center point inside the linear
            // ring.  Use the center of the the linear ring's extent.
            pointX = flatCenters[flatCentersOffset];
        }
        if (opt_dest) {
            opt_dest.push(pointX, y, maxSegmentLength);
            return opt_dest;
        }
        else {
            return [pointX, y, maxSegmentLength];
        }
    }

    /**
     * @module ol/geom/flat/segments
     */
    /**
     * This function calls `callback` for each segment of the flat coordinates
     * array. If the callback returns a truthy value the function returns that
     * value immediately. Otherwise the function returns `false`.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {function(import("../../coordinate.js").Coordinate, import("../../coordinate.js").Coordinate): T} callback Function
     *     called for each segment.
     * @return {T|boolean} Value.
     * @template T
     */
    function forEach(flatCoordinates, offset, end, stride, callback) {
        var point1 = [flatCoordinates[offset], flatCoordinates[offset + 1]];
        var point2 = [];
        var ret;
        for (; offset + stride < end; offset += stride) {
            point2[0] = flatCoordinates[offset + stride];
            point2[1] = flatCoordinates[offset + stride + 1];
            ret = callback(point1, point2);
            if (ret) {
                return ret;
            }
            point1[0] = point2[0];
            point1[1] = point2[1];
        }
        return false;
    }

    /**
     * @module ol/geom/flat/intersectsextent
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @return {boolean} True if the geometry and the extent intersect.
     */
    function intersectsLineString(flatCoordinates, offset, end, stride, extent) {
        var coordinatesExtent = extendFlatCoordinates(createEmpty(), flatCoordinates, offset, end, stride);
        if (!intersects(extent, coordinatesExtent)) {
            return false;
        }
        if (containsExtent(extent, coordinatesExtent)) {
            return true;
        }
        if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
            return true;
        }
        if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
            return true;
        }
        return forEach(flatCoordinates, offset, end, stride, 
        /**
         * @param {import("../../coordinate.js").Coordinate} point1 Start point.
         * @param {import("../../coordinate.js").Coordinate} point2 End point.
         * @return {boolean} `true` if the segment and the extent intersect,
         *     `false` otherwise.
         */
        function (point1, point2) {
            return intersectsSegment(extent, point1, point2);
        });
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @return {boolean} True if the geometry and the extent intersect.
     */
    function intersectsLinearRing(flatCoordinates, offset, end, stride, extent) {
        if (intersectsLineString(flatCoordinates, offset, end, stride, extent)) {
            return true;
        }
        if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[1])) {
            return true;
        }
        if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[3])) {
            return true;
        }
        if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[1])) {
            return true;
        }
        if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[3])) {
            return true;
        }
        return false;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @return {boolean} True if the geometry and the extent intersect.
     */
    function intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent) {
        if (!intersectsLinearRing(flatCoordinates, offset, ends[0], stride, extent)) {
            return false;
        }
        if (ends.length === 1) {
            return true;
        }
        for (var i = 1, ii = ends.length; i < ii; ++i) {
            if (linearRingContainsExtent(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
                if (!intersectsLineString(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @module ol/geom/flat/reverse
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     */
    function coordinates(flatCoordinates, offset, end, stride) {
        while (offset < end - stride) {
            for (var i = 0; i < stride; ++i) {
                var tmp = flatCoordinates[offset + i];
                flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
                flatCoordinates[end - stride + i] = tmp;
            }
            offset += stride;
            end -= stride;
        }
    }

    /**
     * @module ol/geom/flat/orient
     */
    /**
     * Is the linear ring oriented clockwise in a coordinate system with a bottom-left
     * coordinate origin? For a coordinate system with a top-left coordinate origin,
     * the ring's orientation is clockwise when this function returns false.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {boolean} Is clockwise.
     */
    function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
        // http://tinyurl.com/clockwise-method
        // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
        var edge = 0;
        var x1 = flatCoordinates[end - stride];
        var y1 = flatCoordinates[end - stride + 1];
        for (; offset < end; offset += stride) {
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            edge += (x2 - x1) * (y2 + y1);
            x1 = x2;
            y1 = y2;
        }
        return edge === 0 ? undefined : edge > 0;
    }
    /**
     * Determines if linear rings are oriented.  By default, left-hand orientation
     * is tested (first ring must be clockwise, remaining rings counter-clockwise).
     * To test for right-hand orientation, use the `opt_right` argument.
     *
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Array of end indexes.
     * @param {number} stride Stride.
     * @param {boolean=} opt_right Test for right-hand orientation
     *     (counter-clockwise exterior ring and clockwise interior rings).
     * @return {boolean} Rings are correctly oriented.
     */
    function linearRingsAreOriented(flatCoordinates, offset, ends, stride, opt_right) {
        var right = opt_right !== undefined ? opt_right : false;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            var isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
            if (i === 0) {
                if ((right && isClockwise) || (!right && !isClockwise)) {
                    return false;
                }
            }
            else {
                if ((right && !isClockwise) || (!right && isClockwise)) {
                    return false;
                }
            }
            offset = end;
        }
        return true;
    }
    /**
     * Orient coordinates in a flat array of linear rings.  By default, rings
     * are oriented following the left-hand rule (clockwise for exterior and
     * counter-clockwise for interior rings).  To orient according to the
     * right-hand rule, use the `opt_right` argument.
     *
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {boolean=} opt_right Follow the right-hand rule for orientation.
     * @return {number} End.
     */
    function orientLinearRings(flatCoordinates, offset, ends, stride, opt_right) {
        var right = opt_right !== undefined ? opt_right : false;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            var isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
            var reverse = i === 0
                ? (right && isClockwise) || (!right && !isClockwise)
                : (right && !isClockwise) || (!right && isClockwise);
            if (reverse) {
                coordinates(flatCoordinates, offset, end, stride);
            }
            offset = end;
        }
        return offset;
    }

    var __extends$a = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Polygon geometry.
     *
     * @api
     */
    var Polygon = /** @class */ (function (_super) {
        __extends$a(Polygon, _super);
        /**
         * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
         *     Array of linear rings that define the polygon. The first linear ring of the
         *     array defines the outer-boundary or surface of the polygon. Each subsequent
         *     linear ring defines a hole in the surface of the polygon. A linear ring is
         *     an array of vertices' coordinates where the first coordinate and the last are
         *     equivalent. (For internal use, flat coordinates in combination with
         *     `opt_layout` and `opt_ends` are also accepted.)
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         * @param {Array<number>=} opt_ends Ends (for internal use with flat coordinates).
         */
        function Polygon(coordinates, opt_layout, opt_ends) {
            var _this = _super.call(this) || this;
            /**
             * @type {Array<number>}
             * @private
             */
            _this.ends_ = [];
            /**
             * @private
             * @type {number}
             */
            _this.flatInteriorPointRevision_ = -1;
            /**
             * @private
             * @type {import("../coordinate.js").Coordinate}
             */
            _this.flatInteriorPoint_ = null;
            /**
             * @private
             * @type {number}
             */
            _this.maxDelta_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.maxDeltaRevision_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.orientedRevision_ = -1;
            /**
             * @private
             * @type {Array<number>}
             */
            _this.orientedFlatCoordinates_ = null;
            if (opt_layout !== undefined && opt_ends) {
                _this.setFlatCoordinates(opt_layout, 
                /** @type {Array<number>} */ (coordinates));
                _this.ends_ = opt_ends;
            }
            else {
                _this.setCoordinates(
                /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */ (coordinates), opt_layout);
            }
            return _this;
        }
        /**
         * Append the passed linear ring to this polygon.
         * @param {LinearRing} linearRing Linear ring.
         * @api
         */
        Polygon.prototype.appendLinearRing = function (linearRing) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = linearRing.getFlatCoordinates().slice();
            }
            else {
                extend(this.flatCoordinates, linearRing.getFlatCoordinates());
            }
            this.ends_.push(this.flatCoordinates.length);
            this.changed();
        };
        /**
         * Make a complete copy of the geometry.
         * @return {!Polygon} Clone.
         * @api
         */
        Polygon.prototype.clone = function () {
            var polygon = new Polygon(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
            polygon.applyProperties(this);
            return polygon;
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        Polygon.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(arrayMaxSquaredDelta(this.flatCoordinates, 0, this.ends_, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return assignClosestArrayPoint(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @return {boolean} Contains (x, y).
         */
        Polygon.prototype.containsXY = function (x, y) {
            return linearRingsContainsXY(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
        };
        /**
         * Return the area of the polygon on projected plane.
         * @return {number} Area (on projected plane).
         * @api
         */
        Polygon.prototype.getArea = function () {
            return linearRings(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
        };
        /**
         * Get the coordinate array for this geometry.  This array has the structure
         * of a GeoJSON coordinate array for polygons.
         *
         * @param {boolean=} opt_right Orient coordinates according to the right-hand
         *     rule (counter-clockwise for exterior and clockwise for interior rings).
         *     If `false`, coordinates will be oriented according to the left-hand rule
         *     (clockwise for exterior and counter-clockwise for interior rings).
         *     By default, coordinate orientation will depend on how the geometry was
         *     constructed.
         * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
         * @api
         */
        Polygon.prototype.getCoordinates = function (opt_right) {
            var flatCoordinates;
            if (opt_right !== undefined) {
                flatCoordinates = this.getOrientedFlatCoordinates().slice();
                orientLinearRings(flatCoordinates, 0, this.ends_, this.stride, opt_right);
            }
            else {
                flatCoordinates = this.flatCoordinates;
            }
            return inflateCoordinatesArray(flatCoordinates, 0, this.ends_, this.stride);
        };
        /**
         * @return {Array<number>} Ends.
         */
        Polygon.prototype.getEnds = function () {
            return this.ends_;
        };
        /**
         * @return {Array<number>} Interior point.
         */
        Polygon.prototype.getFlatInteriorPoint = function () {
            if (this.flatInteriorPointRevision_ != this.getRevision()) {
                var flatCenter = getCenter(this.getExtent());
                this.flatInteriorPoint_ = getInteriorPointOfArray(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, flatCenter, 0);
                this.flatInteriorPointRevision_ = this.getRevision();
            }
            return this.flatInteriorPoint_;
        };
        /**
         * Return an interior point of the polygon.
         * @return {Point} Interior point as XYM coordinate, where M is the
         * length of the horizontal intersection that the point belongs to.
         * @api
         */
        Polygon.prototype.getInteriorPoint = function () {
            return new Point(this.getFlatInteriorPoint(), GeometryLayout.XYM);
        };
        /**
         * Return the number of rings of the polygon,  this includes the exterior
         * ring and any interior rings.
         *
         * @return {number} Number of rings.
         * @api
         */
        Polygon.prototype.getLinearRingCount = function () {
            return this.ends_.length;
        };
        /**
         * Return the Nth linear ring of the polygon geometry. Return `null` if the
         * given index is out of range.
         * The exterior linear ring is available at index `0` and the interior rings
         * at index `1` and beyond.
         *
         * @param {number} index Index.
         * @return {LinearRing} Linear ring.
         * @api
         */
        Polygon.prototype.getLinearRing = function (index) {
            if (index < 0 || this.ends_.length <= index) {
                return null;
            }
            return new LinearRing(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
        };
        /**
         * Return the linear rings of the polygon.
         * @return {Array<LinearRing>} Linear rings.
         * @api
         */
        Polygon.prototype.getLinearRings = function () {
            var layout = this.layout;
            var flatCoordinates = this.flatCoordinates;
            var ends = this.ends_;
            var linearRings = [];
            var offset = 0;
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var linearRing = new LinearRing(flatCoordinates.slice(offset, end), layout);
                linearRings.push(linearRing);
                offset = end;
            }
            return linearRings;
        };
        /**
         * @return {Array<number>} Oriented flat coordinates.
         */
        Polygon.prototype.getOrientedFlatCoordinates = function () {
            if (this.orientedRevision_ != this.getRevision()) {
                var flatCoordinates = this.flatCoordinates;
                if (linearRingsAreOriented(flatCoordinates, 0, this.ends_, this.stride)) {
                    this.orientedFlatCoordinates_ = flatCoordinates;
                }
                else {
                    this.orientedFlatCoordinates_ = flatCoordinates.slice();
                    this.orientedFlatCoordinates_.length = orientLinearRings(this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
                }
                this.orientedRevision_ = this.getRevision();
            }
            return this.orientedFlatCoordinates_;
        };
        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {Polygon} Simplified Polygon.
         * @protected
         */
        Polygon.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            var simplifiedEnds = [];
            simplifiedFlatCoordinates.length = quantizeArray(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEnds);
            return new Polygon(simplifiedFlatCoordinates, GeometryLayout.XY, simplifiedEnds);
        };
        /**
         * Get the type of this geometry.
         * @return {import("./GeometryType.js").default} Geometry type.
         * @api
         */
        Polygon.prototype.getType = function () {
            return GeometryType.POLYGON;
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         * @api
         */
        Polygon.prototype.intersectsExtent = function (extent) {
            return intersectsLinearRingArray(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
        };
        /**
         * Set the coordinates of the polygon.
         * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
         * @api
         */
        Polygon.prototype.setCoordinates = function (coordinates, opt_layout) {
            this.setLayout(opt_layout, coordinates, 2);
            if (!this.flatCoordinates) {
                this.flatCoordinates = [];
            }
            var ends = deflateCoordinatesArray(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
            this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
            this.changed();
        };
        return Polygon;
    }(SimpleGeometry));
    /**
     * Create a regular polygon from a circle.
     * @param {import("./Circle.js").default} circle Circle geometry.
     * @param {number=} opt_sides Number of sides of the polygon. Default is 32.
     * @param {number=} opt_angle Start angle for the first vertex of the polygon in
     *     counter-clockwise radians. 0 means East. Default is 0.
     * @return {Polygon} Polygon geometry.
     * @api
     */
    function fromCircle(circle, opt_sides, opt_angle) {
        var sides = opt_sides ? opt_sides : 32;
        var stride = circle.getStride();
        var layout = circle.getLayout();
        var center = circle.getCenter();
        var arrayLength = stride * (sides + 1);
        var flatCoordinates = new Array(arrayLength);
        for (var i = 0; i < arrayLength; i += stride) {
            flatCoordinates[i] = 0;
            flatCoordinates[i + 1] = 0;
            for (var j = 2; j < stride; j++) {
                flatCoordinates[i + j] = center[j];
            }
        }
        var ends = [flatCoordinates.length];
        var polygon = new Polygon(flatCoordinates, layout, ends);
        makeRegular(polygon, center, circle.getRadius(), opt_angle);
        return polygon;
    }
    /**
     * Modify the coordinates of a polygon to make it a regular polygon.
     * @param {Polygon} polygon Polygon geometry.
     * @param {import("../coordinate.js").Coordinate} center Center of the regular polygon.
     * @param {number} radius Radius of the regular polygon.
     * @param {number=} opt_angle Start angle for the first vertex of the polygon in
     *     counter-clockwise radians. 0 means East. Default is 0.
     */
    function makeRegular(polygon, center, radius, opt_angle) {
        var flatCoordinates = polygon.getFlatCoordinates();
        var stride = polygon.getStride();
        var sides = flatCoordinates.length / stride - 1;
        var startAngle = opt_angle ? opt_angle : 0;
        for (var i = 0; i <= sides; ++i) {
            var offset = i * stride;
            var angle = startAngle + (modulo(i, sides) * 2 * Math.PI) / sides;
            flatCoordinates[offset] = center[0] + radius * Math.cos(angle);
            flatCoordinates[offset + 1] = center[1] + radius * Math.sin(angle);
        }
        polygon.changed();
    }

    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }; // Ol
    var DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
    /**
     * @constructor
     * @param {class} map
     * @param {object} opt_options
     */

    class Wfst {
      constructor(map, opt_options) {
        // Default options
        this.options = {
          geoServerUrl: null,
          headers: {},
          layers: null,
          layerMode: 'wms',
          evtType: 'singleclick',
          active: true,
          showControl: true,
          useLockFeature: true,
          minZoom: 9,
          language: 'en',
          uploadFormats: '.geojson,.json,.kml',
          processUpload: null,
          beforeInsertFeature: null
        }; // Assign user options

        this.options = Object.assign(Object.assign({}, this.options), opt_options); // Language support

        this._i18n = languages[this.options.language]; // GeoServer

        this._hasLockFeature = false;
        this._hasTransaction = false;
        this._geoServerCapabilities = null;
        this._geoServerData = {}; // Ol

        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._mapLayers = []; // Editing

        this._editedFeatures = new Set();
        this._layerToInsertElements = this.options.layers[0].name; // By default, the first layer is ready to accept new draws

        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = []; // Formats

        this._formatWFS = new format.WFS();
        this._formatGeoJSON = new format.GeoJSON();
        this._formatKml = new format.KML({
          extractStyles: false,
          showPointNames: false
        });
        this._xs = new XMLSerializer(); // State

        this._isVisible = this.view.getZoom() > this.options.minZoom;
        this._countRequests = 0;
        this._isEditModeOn = false;

        this._initAsyncOperations();
      }
      /**
       * Connect to the GeoServer, get Capabilities,
       * get each layer specs and create the layers and map controllers.
       *
       * @param layers
       * @param showControl
       * @param active
       * @private
       */


      _initAsyncOperations() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            yield this._connectToGeoServer();

            if (this.options.layers) {
              yield this._getGeoserverLayersData(this.options.layers, this.options.geoServerUrl);

              this._createLayers(this.options.layers);
            }

            this._initMapElements(this.options.showControl, this.options.active);
          } catch (err) {
            this._showError(err.message);
          }
        });
      }
      /**
       * Get the capabilities from the GeoServer and check
       * all the available operations.
       *
       * @private
       */


      _connectToGeoServer() {
        return __awaiter(this, void 0, void 0, function* () {
          var getCapabilities = () => __awaiter(this, void 0, void 0, function* () {
            var params = new URLSearchParams({
              service: 'wfs',
              version: '1.3.0',
              request: 'GetCapabilities',
              exceptions: 'application/json'
            });
            var url_fetch = this.options.geoServerUrl + '?' + params.toString();

            try {
              var response = yield fetch(url_fetch, {
                headers: this.options.headers
              });

              if (!response.ok) {
                throw new Error('');
              }

              var data = yield response.text();
              var capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
              return capabilities;
            } catch (err) {
              throw new Error(this._i18n.errors.capabilities);
            }
          });

          this._geoServerCapabilities = yield getCapabilities(); // Available operations in the geoserver

          var operations = this._geoServerCapabilities.getElementsByTagName("ows:Operation");

          for (var operation of operations) {
            if (operation.getAttribute('name') === 'Transaction') this._hasTransaction = true;else if (operation.getAttribute('name') === 'LockFeature') this._hasLockFeature = true;
          }

          if (!this._hasTransaction) throw new Error(this._i18n.errors.wfst);
          return true;
        });
      }
      /**
       * Request and store data layers obtained by DescribeFeatureType
       *
       * @param layers
       * @param geoServerUrl
       * @private
       */


      _getGeoserverLayersData(layers, geoServerUrl) {
        return __awaiter(this, void 0, void 0, function* () {
          var getLayerData = layerName => __awaiter(this, void 0, void 0, function* () {
            var params = new URLSearchParams({
              service: 'wfs',
              version: '2.0.0',
              request: 'DescribeFeatureType',
              typeNames: layerName,
              outputFormat: 'application/json',
              exceptions: 'application/json'
            });
            var url_fetch = geoServerUrl + '?' + params.toString();
            var response = yield fetch(url_fetch, {
              headers: this.options.headers
            });

            if (!response.ok) {
              throw new Error('');
            }

            return yield response.json();
          });

          for (var layer of layers) {
            var layerName = layer.name;
            var layerLabel = layer.label || layerName;

            try {
              var data = yield getLayerData(layerName);

              if (data) {
                var targetNamespace = data.targetNamespace;
                var properties = data.featureTypes[0].properties; // Find the geometry field

                var geom = properties.find(el => el.type.indexOf('gml:') >= 0);
                this._geoServerData[layerName] = {
                  namespace: targetNamespace,
                  properties: properties,
                  geomType: geom.localType,
                  geomField: geom.name
                };
              }
            } catch (err) {
              this._showError("".concat(this._i18n.errors.layer, " \"").concat(layerLabel, "\""));
            }
          }
        });
      }
      /**
       * Create map layers in wfs o wms modes.
       *
       * @param layers
       * @private
       */


      _createLayers(layers) {
        var newWmsLayer = layerParams => {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var params = {
            'SERVICE': 'WMS',
            'LAYERS': layerName,
            'TILED': true
          };

          if (cqlFilter) {
            params['CQL_FILTER'] = cqlFilter;
          }

          var layer$1 = new layer.Tile({
            source: new source.TileWMS({
              url: this.options.geoServerUrl,
              params: params,
              serverType: 'geoserver',
              tileLoadFunction: (tile, src) => __awaiter(this, void 0, void 0, function* () {
                try {
                  var response = yield fetch(src, {
                    headers: this.options.headers
                  });

                  if (!response.ok) {
                    throw new Error('');
                  }

                  var data = yield response.blob();

                  if (data !== undefined) {
                    tile.getImage().src = URL.createObjectURL(data);
                  } else {
                    throw new Error('');
                  }
                } catch (err) {
                  tile.setState(TileState__default['default'].ERROR);
                }
              })
            }),
            zIndex: 4,
            minZoom: this.options.minZoom
          });
          layer$1.setProperties({
            name: layerName,
            type: "_wms_"
          });
          return layer$1;
        };

        var newWfsLayer = layerParams => {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var source$1 = new source.Vector({
            format: new format.GeoJSON(),
            strategy: this.options.wfsStrategy === 'bbox' ? loadingstrategy.bbox : loadingstrategy.all,
            loader: extent => __awaiter(this, void 0, void 0, function* () {
              var params = new URLSearchParams({
                service: 'wfs',
                version: '1.0.0',
                request: 'GetFeature',
                typename: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json',
                srsName: DEFAULT_GEOSERVER_SRS
              });

              if (cqlFilter) {
                params.append('cql_filter', cqlFilter);
              } // If bbox, add extent to the request


              if (this.options.wfsStrategy === 'bbox') {
                var extentGeoServer = proj.transformExtent(extent, this.view.getProjection().getCode(), DEFAULT_GEOSERVER_SRS);
                params.append('bbox', extentGeoServer.join(','));
              }

              var url_fetch = this.options.geoServerUrl + '?' + params.toString();

              try {
                var response = yield fetch(url_fetch, {
                  headers: this.options.headers
                });

                if (!response.ok) {
                  throw new Error('');
                }

                var data = yield response.json();
                var features = source$1.getFormat().readFeatures(data, {
                  featureProjection: this.view.getProjection().getCode(),
                  dataProjection: DEFAULT_GEOSERVER_SRS
                });
                features.forEach(feature => {
                  feature.set('_layerName_', layerName,
                  /* silent = */
                  true);
                });
                source$1.addFeatures(features);
              } catch (err) {
                this._showError(this._i18n.errors.geoserver);

                console.error(err);
                source$1.removeLoadedExtent(extent);
              }
            })
          });
          var layer$1 = new layer.Vector({
            visible: this._isVisible,
            minZoom: this.options.minZoom,
            source: source$1,
            zIndex: 2
          });
          layer$1.setProperties({
            name: layerName,
            type: "_wfs_"
          });
          return layer$1;
        };

        layers.forEach(layerParams => {
          var layerName = layerParams.name; // Only create the layer if we can get the GeoserverData

          if (this._geoServerData[layerName]) {
            var layer;

            if (this.options.layerMode === 'wms') {
              layer = newWmsLayer(layerParams);
            } else {
              layer = newWfsLayer(layerParams);
            }

            this.map.addLayer(layer);
            this._mapLayers[layerName] = layer;
          }
        });
      }
      /**
       * Create the edit layer to allow modify elements, add interactions,
       * map controllers and keyboard handlers.
       *
       * @param showControl
       * @param active
       * @private
       */


      _initMapElements(showControl, active) {
        return __awaiter(this, void 0, void 0, function* () {
          // VectorLayer to store features on editing and isnerting
          this._createEditLayer();

          this._addInteractions();

          this._addHandlers();

          if (showControl) this._addControlTools(); // By default, init in edit mode

          this.activateEditMode(active);
        });
      }
      /**
       * @private
       */


      _addInteractions() {
        // Select the wfs feature already downloaded
        var prepareWfsInteraction = () => {
          // Interaction to select wfs layer elements
          this.interactionWfsSelect = new interaction.Select({
            hitTolerance: 10,
            style: feature => this._styleFunction(feature),
            filter: (feature, layer) => {
              return !this._isEditModeOn && layer && layer.get('type') === '_wfs_';
            }
          });
          this.map.addInteraction(this.interactionWfsSelect);
          this.interactionWfsSelect.on('select', (_ref) => {
            var {
              selected,
              deselected,
              mapBrowserEvent
            } = _ref;
            var coordinate = mapBrowserEvent.coordinate;

            if (selected.length) {
              selected.forEach(feature => {
                if (!this._editedFeatures.has(String(feature.getId()))) {
                  // Remove the feature from the original layer                            
                  var layer = this.interactionWfsSelect.getLayer(feature);
                  layer.getSource().removeFeature(feature);

                  this._addFeatureToEdit(feature, coordinate);
                }
              });
            }
          });
        }; // Call the geoserver to get the clicked feature


        var prepareWmsInteraction = () => {
          var getFeatures = evt => __awaiter(this, void 0, void 0, function* () {
            var _this = this;

            var _loop = function* _loop(layerName) {
              var layer = _this._mapLayers[layerName];
              var coordinate = evt.coordinate; // Si la vista es lejana, disminumos el buffer
              // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
              // y mejorar la sensibilidad en IOS

              var buffer = _this.view.getZoom() > 10 ? 10 : 5;
              var url = layer.getSource().getFeatureInfoUrl(coordinate, _this.view.getResolution(), _this.view.getProjection().getCode(), {
                'INFO_FORMAT': 'application/json',
                'BUFFER': buffer,
                'FEATURE_COUNT': 1,
                'EXCEPTIONS': 'application/json'
              });

              try {
                var response = yield fetch(url, {
                  headers: _this.options.headers
                });

                if (!response.ok) {
                  throw new Error(_this._i18n.errors.getFeatures + " " + response.status);
                }

                var data = yield response.json();

                var features = _this._formatGeoJSON.readFeatures(data);

                if (!features.length) return "continue";
                features.forEach(feature => _this._addFeatureToEdit(feature, coordinate, layerName));
              } catch (err) {
                _this._showError(err.message);
              }
            };

            for (var layerName in this._mapLayers) {
              var _ret = yield* _loop(layerName);

              if (_ret === "continue") continue;
            }
          });

          this._keyClickWms = this.map.on(this.options.evtType, evt => __awaiter(this, void 0, void 0, function* () {
            if (this.map.hasFeatureAtPixel(evt.pixel)) return;
            if (!this._isVisible) return; // Only get other features if editmode is disabled

            if (!this._isEditModeOn) yield getFeatures(evt);
          }));
        };

        if (this.options.layerMode === 'wfs') prepareWfsInteraction();else if (this.options.layerMode === 'wms') prepareWmsInteraction(); // Interaction to allow select features in the edit layer

        this.interactionSelectModify = new interaction.Select({
          style: feature => this._styleFunction(feature),
          layers: [this._editLayer],
          toggleCondition: never,
          removeCondition: evt => this._isEditModeOn ? true : false // Prevent deselect on clicking outside the feature

        });
        this.map.addInteraction(this.interactionSelectModify);
        this.interactionModify = new interaction.Modify({
          style: () => {
            if (this._isEditModeOn) {
              return new style.Style({
                image: new style.Circle({
                  radius: 6,
                  fill: new style.Fill({
                    color: '#ff0000'
                  }),
                  stroke: new style.Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                  })
                })
              });
            } else {
              return;
            }
          },
          features: this.interactionSelectModify.getFeatures(),
          condition: evt => {
            return primaryAction(evt) && this._isEditModeOn;
          }
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new interaction.Snap({
          source: this._editLayer.getSource()
        });
        this.map.addInteraction(this.interactionSnap);
      }
      /**
       * Layer to store temporary the elements to be edited
       *
       * @private
       */


      _createEditLayer() {
        this._editLayer = new layer.Vector({
          source: new source.Vector(),
          zIndex: 5,
          style: feature => this._styleFunction(feature)
        });
        this.map.addLayer(this._editLayer);
      }
      /**
       * Add map handlers
       *
       * @private
       */


      _addHandlers() {
        var keyboardEvents = () => {
          document.addEventListener('keydown', (_ref2) => {
            var {
              key
            } = _ref2;
            var inputFocus = document.querySelector('input:focus');
            if (inputFocus) return;

            if (key === "Delete") {
              var selectedFeatures = this.interactionSelectModify.getFeatures();

              if (selectedFeatures) {
                selectedFeatures.forEach(feature => {
                  this._deleteElement(feature, true);
                });
              }
            }
          });
        }; // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver


        this.interactionModify.on('modifystart', evt => {
          this._addFeatureToEditedList(evt.features.item(0));
        });

        this._onDeselectFeatureEvent();

        this._onRemoveFeatureEvent();

        var handleZoomEnd = () => {
          if (this._currentZoom > this.options.minZoom) {
            // Show the layers
            if (!this._isVisible) {
              this._isVisible = true;
            }
          } else {
            // Hide the layer
            if (this._isVisible) {
              this._isVisible = false;
            }
          }
        };

        this.map.on('moveend', () => {
          this._currentZoom = this.view.getZoom();
          if (this._currentZoom !== this._lastZoom) handleZoomEnd();
          this._lastZoom = this._currentZoom;
        });
        keyboardEvents();
      }
      /**
      * Add the widget on the map to allow change the tools and select active layers
      * @private
      */


      _addControlTools() {
        var createUploadElements = () => {
          var container = document.createElement('div'); // Upload button Tool

          var uploadButton = document.createElement('label');
          uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
          uploadButton.htmlFor = 'ol-wfst--upload';
          uploadButton.innerHTML = "<img src=\"".concat(img$4, "\"/> ");
          uploadButton.title = this._i18n.labels.uploadToLayer; // Hidden Input form

          var uploadInput = document.createElement('input');
          uploadInput.id = 'ol-wfst--upload';
          uploadInput.type = 'file';
          uploadInput.accept = this.options.uploadFormats;

          uploadInput.onchange = evt => this._processUploadFile(evt);

          container.append(uploadInput);
          container.append(uploadButton);
          return container;
        };

        var createToolSelector = () => {
          var controlDiv = document.createElement('div');
          controlDiv.className = 'ol-wfst--tools-control'; // Select Tool

          var selectionButton = document.createElement('button');
          selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
          selectionButton.type = 'button';
          selectionButton.innerHTML = "<img src=\"".concat(img$1, "\"/>");
          selectionButton.title = this._i18n.labels.select;

          selectionButton.onclick = () => {
            this._resetStateButtons();

            this.activateEditMode();
          }; // Draw Tool


          var drawButton = document.createElement('button');
          drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
          drawButton.type = 'button';
          drawButton.innerHTML = "<img src = \"".concat(img, "\"/>");
          drawButton.title = this._i18n.labels.addElement;

          drawButton.onclick = () => {
            this._resetStateButtons();

            this.activateDrawMode(this._layerToInsertElements);
          }; // Buttons container


          var buttons = document.createElement('div');
          buttons.className = 'wfst--tools-control--buttons';
          buttons.append(selectionButton);
          buttons.append(drawButton);
          this._controlWidgetTools = new control.Control({
            element: controlDiv
          });
          controlDiv.append(buttons);
          return controlDiv;
        };

        var createSubControl = () => {
          var createSelectDrawElement = () => {
            var select = document.createElement('select');
            select.className = 'wfst--tools-control--select-draw';
            select.disabled = this._geoServerData[this._layerToInsertElements].geomType === GeometryType.GEOMETRY_COLLECTION ? false : true;

            select.onchange = () => {
              this.activateDrawMode(this._layerToInsertElements, select.value);
            };

            var types = [GeometryType.LINE_STRING, GeometryType.POLYGON, GeometryType.POINT, GeometryType.CIRCLE];

            for (var type of types) {
              var option = document.createElement('option');
              option.value = type;
              option.text = type;
              option.selected = this._geoServerData[this._layerToInsertElements].geomType === type || false;
              select.appendChild(option);
            }

            return select;
          };

          var createLayerElements = layerParams => {
            var layerName = layerParams.name;
            var layerLabel = "<span title=\"".concat(this._geoServerData[layerName].geomType, "\">").concat(layerParams.label || layerName, "</span>");
            return "\n                <div>\n                    <label for=\"wfst--".concat(layerName, "\">\n                        <input value=\"").concat(layerName, "\" id=\"wfst--").concat(layerName, "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" ").concat(layerName === this._layerToInsertElements ? 'checked="checked"' : '', ">\n                        ").concat(layerLabel, "\n                    </label>\n                </div>");
          };

          var subControl = document.createElement('div');
          subControl.className = 'wfst--tools-control--sub-control';
          this._selectDraw = createSelectDrawElement();
          subControl.append(this._selectDraw);
          var htmlLayers = Object.keys(this._mapLayers).map(key => createLayerElements(this.options.layers.find(el => el.name === key)));
          var selectLayers = document.createElement('div');
          selectLayers.className = 'wfst--tools-control--select-layers';
          selectLayers.innerHTML = htmlLayers.join('');
          subControl.append(selectLayers);
          var radioInputs = subControl.querySelectorAll('input');
          radioInputs.forEach(radioInput => {
            radioInput.onchange = () => {
              this._layerToInsertElements = radioInput.value;

              this._resetStateButtons();

              this.activateDrawMode(this._layerToInsertElements);
            };
          });
          return subControl;
        };

        var controlDiv = createToolSelector();
        var subControl = createSubControl();
        controlDiv.append(subControl); // Upload section

        if (this.options.upload) {
          var uploadSection = createUploadElements();
          subControl.append(uploadSection);
        }

        this.map.addControl(this._controlWidgetTools);
      }
      /**
       * Lock a feature in the geoserver before edit
       *
       * @param featureId
       * @param layerName
       * @param retry
       * @private
       */


      _lockFeature(featureId, layerName) {
        var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return __awaiter(this, void 0, void 0, function* () {
          var params = new URLSearchParams({
            service: 'wfs',
            version: '1.1.0',
            request: 'LockFeature',
            expiry: String(5),
            LockId: 'GeoServer',
            typeName: layerName,
            releaseAction: 'SOME',
            exceptions: 'application/json',
            featureid: "".concat(featureId)
          });
          var url_fetch = this.options.geoServerUrl + '?' + params.toString();

          try {
            var response = yield fetch(url_fetch, {
              headers: this.options.headers
            });

            if (!response.ok) {
              throw new Error(this._i18n.errors.lockFeature);
            }

            var data = yield response.text();

            try {
              // First, check if is a JSON (with errors)
              data = JSON.parse(data);

              if ('exceptions' in data) {
                if (data.exceptions[0].code === "CannotLockAllFeatures") {
                  // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                  if (!retry) this._lockFeature(featureId, layerName, 1);else this._showError(this._i18n.errors.lockFeature);
                } else {
                  this._showError(data.exceptions[0].text);
                }
              }
            } catch (err) {
              /*
                                 let dataDoc = (new window.DOMParser()).parseFromString(data, 'text/xml');
                                 let lockId = dataDoc.getElementsByTagName('wfs:LockId');
                                 let featuresLocked: HTMLCollectionOf<Element> = dataDoc.getElementsByTagName('ogc:FeatureId');
                                 for (let featureLocked of featuresLocked as any) {
                                     console.log(featureLocked.getAttribute('fid'));
                                 }
                                 */
            }

            return data;
          } catch (err) {
            this._showError(err.message);
          }
        });
      }
      /**
       * Show modal with errors
       *
       * @param msg
       * @private
       */


      _showError(msg) {
        modalVanilla.alert('Error: ' + msg, {
          animateInClass: 'in'
        }).show();
      }
      /**
       * Make the WFS Transactions
       *
       * @param mode
       * @param features
       * @param layerName
       * @private
       */


      _transactWFS(mode, features, layerName) {
        return __awaiter(this, void 0, void 0, function* () {
          features = Array.isArray(features) ? features : [features];

          var cloneFeature = feature => {
            this._removeFeatureFromEditList(feature);

            var featureProperties = feature.getProperties();
            delete featureProperties.boundedBy;
            delete featureProperties._layerName_;
            var clone = new ol.Feature(featureProperties);
            clone.setId(feature.getId());
            return clone;
          };

          var refreshWmsLayer = layer => {
            var source = layer.getSource(); // Refrescamos el wms

            source.refresh(); // Force refresh the tiles

            var params = source.getParams();
            params.t = new Date().getMilliseconds();
            source.updateParams(params);
          };

          var refreshWfsLayer = layer => {
            var source = layer.getSource(); // Refrescamos el wms

            source.refresh();
          };

          var clonedFeatures = [];

          for (var feature of features) {
            var clone = cloneFeature(feature);
            var cloneGeom = clone.getGeometry(); // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220

            if (cloneGeom.getType() === GeometryType.GEOMETRY_COLLECTION) {
              var geom = cloneGeom.getGeometries()[0];
              clone.setGeometry(geom);
            } else if (cloneGeom.getType() === GeometryType.CIRCLE) {
              var _geom = fromCircle(cloneGeom);

              clone.setGeometry(_geom);
            }

            if (mode === 'insert') {
              // Filters
              if (this.options.beforeInsertFeature) {
                clone = this.options.beforeInsertFeature(clone);
              }
            }

            if (clone) clonedFeatures.push(clone);
          }

          if (!clonedFeatures.length) {
            return this._showError(this._i18n.errors.noValidGeometry);
          }

          switch (mode) {
            case 'insert':
              this._insertFeatures = [...this._insertFeatures, ...clonedFeatures];
              break;

            case 'update':
              this._updateFeatures = [...this._updateFeatures, ...clonedFeatures];
              break;

            case 'delete':
              this._deleteFeatures = [...this._deleteFeatures, ...clonedFeatures];
              break;
          }

          this._countRequests++;
          var numberRequest = this._countRequests;
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            // Prevent fire multiples times   
            if (numberRequest !== this._countRequests) return;
            var srs = this.view.getProjection().getCode(); // Force latitude/longitude order on transactions
            // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3

            srs = srs === 'EPSG:4326' ? DEFAULT_GEOSERVER_SRS : srs;
            var options = {
              featureNS: this._geoServerData[layerName].namespace,
              featureType: layerName,
              srsName: srs,
              featurePrefix: null,
              nativeElements: null
            };

            var transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);

            var payload = this._xs.serializeToString(transaction);

            var geomType = this._geoServerData[layerName].geomType;
            var geomField = this._geoServerData[layerName].geomField; // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220

            if (geomType === GeometryType.GEOMETRY_COLLECTION) {
              if (mode === 'insert') {
                payload = payload.replace(/<geometry>/g, "<geometry><MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>"));
                payload = payload.replace(/<\/geometry>/g, "</geometryMember></MultiGeometry></geometry>");
              } else if (mode === 'update') {
                var gmemberIn = "<MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>");
                var gmemberOut = "</geometryMember></MultiGeometry>";
                payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, "$1$2".concat(gmemberIn, "$3").concat(gmemberOut, "$4$5"));
              }
            }

            if (mode === 'insert') {
              // Fixes geometry name, weird bug with GML:
              // The property for the geometry column is always named "geometry"
              payload = payload.replace(/(.*?)(<geometry>)(.*)(<\/geometry>)(.*)/g, "$1<".concat(geomField, ">$3</").concat(geomField, ">$5"));
            } else {
              payload = payload.replace(/<Name>geometry<\/Name>/g, "<Name>".concat(geomField, "</Name>"));
            } // Add default LockId value


            if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
              payload = payload.replace("</Transaction>", "<LockId>GeoServer</LockId></Transaction>");
            }

            try {
              var headers = Object.assign({
                'Content-Type': 'text/xml',
                'Access-Control-Allow-Origin': '*'
              }, this.options.headers);
              var response = yield fetch(this.options.geoServerUrl, {
                method: 'POST',
                body: payload,
                headers: headers
              });

              if (!response.ok) {
                throw new Error(this._i18n.errors.transaction + " " + response.status);
              }

              var parseResponse = this._formatWFS.readTransactionResponse(response);

              if (!Object.keys(parseResponse).length) {
                var responseStr = yield response.text();
                var findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                if (findError) this._showError(findError[1]);
              }

              if (mode !== 'delete') {
                for (var _feature of features) {
                  this._editLayer.getSource().removeFeature(_feature);
                }
              }

              if (this.options.layerMode === 'wfs') refreshWfsLayer(this._mapLayers[layerName]);else if (this.options.layerMode === 'wms') refreshWmsLayer(this._mapLayers[layerName]);
            } catch (err) {
              console.error(err);
            }

            this._insertFeatures = [];
            this._updateFeatures = [];
            this._deleteFeatures = [];
            this._countRequests = 0;
          }), 300);
        });
      }
      /**
       *
       * @param feature
       * @private
       */


      _addFeatureToEditedList(feature) {
        this._editedFeatures.add(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */


      _removeFeatureFromEditList(feature) {
        this._editedFeatures.delete(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */


      _isFeatureEdited(feature) {
        return this._editedFeatures.has(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */


      _cancelEditFeature(feature) {
        this._removeOverlayHelper(feature);

        this._editModeOff();
      }
      /**
       * Trigger on deselecting a feature from in the Edit layer
       *
       * @private
       */


      _onDeselectFeatureEvent() {
        var finishEditFeature = feature => {
          Observable$1.unByKey(this._keyRemove);
          var layerName = feature.get('_layerName_');

          if (this._isFeatureEdited(feature)) {
            this._transactWFS('update', feature, layerName);
          } else {
            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (this.options.layerMode === 'wfs') {
              var layer = this._mapLayers[layerName];
              layer.getSource().addFeature(feature);
              this.interactionWfsSelect.getFeatures().remove(feature);
            }

            this.interactionSelectModify.getFeatures().remove(feature);

            this._editLayer.getSource().removeFeature(feature);
          }

          setTimeout(() => {
            this._onRemoveFeatureEvent();
          }, 150);
        }; // This is fired when a feature is deselected and fires the transaction process


        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', evt => {
          var feature = evt.element;

          this._cancelEditFeature(feature);

          finishEditFeature(feature);
        });
      }
      /**
       * Trigger on removing a feature from the Edit layer
       *
       * @private
       */


      _onRemoveFeatureEvent() {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', evt => {
          if (this._keySelect) Observable$1.unByKey(this._keySelect);
          var feature = evt.feature;
          var layerName = feature.get('_layerName_');

          this._transactWFS('delete', feature, layerName);

          this._cancelEditFeature(feature);

          if (this._keySelect) {
            setTimeout(() => {
              this._onDeselectFeatureEvent();
            }, 150);
          }
        });
      }
      /**
       * Master style that handles two modes on the Edit Layer:
       * - one is the basic, showing only the vertices
       * - and the other when modify is active, showing bigger vertices
       *
       * @param feature
       * @private
       */


      _styleFunction(feature) {
        var geometry = feature.getGeometry();
        var type = geometry.getType();

        if (type === GeometryType.GEOMETRY_COLLECTION) {
          geometry = geometry.getGeometries()[0];
          type = geometry.getType();
        }

        switch (type) {
          case 'Point':
          case 'MultiPoint':
            if (this._isEditModeOn) {
              return [new style.Style({
                image: new style.Circle({
                  radius: 6,
                  fill: new style.Fill({
                    color: '#000000'
                  })
                })
              }), new style.Style({
                image: new style.Circle({
                  radius: 4,
                  fill: new style.Fill({
                    color: '#ff0000'
                  })
                })
              })];
            } else {
              return [new style.Style({
                image: new style.Circle({
                  radius: 5,
                  fill: new style.Fill({
                    color: '#ff0000'
                  })
                })
              }), new style.Style({
                image: new style.Circle({
                  radius: 2,
                  fill: new style.Fill({
                    color: '#000000'
                  })
                })
              })];
            }

          default:
            if (this._isEditModeOn || this._isDrawModeOn) {
              return [new style.Style({
                stroke: new style.Stroke({
                  color: 'rgba( 255, 0, 0, 1)',
                  width: 4
                }),
                fill: new style.Fill({
                  color: 'rgba(255, 0, 0, 0.7)'
                })
              }), new style.Style({
                image: new style.Circle({
                  radius: 4,
                  fill: new style.Fill({
                    color: '#ff0000'
                  }),
                  stroke: new style.Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                  })
                }),
                geometry: feature => {
                  var geometry = feature.getGeometry();
                  var type = geometry.getType();

                  if (type === GeometryType.GEOMETRY_COLLECTION) {
                    geometry = geometry.getGeometries()[0];
                    type = geometry.getType();
                  }
                  var coordinates = geometry.getCoordinates();

                  if (type == GeometryType.POLYGON || type == GeometryType.MULTI_LINE_STRING) {
                    coordinates = coordinates.flat(1);
                  }

                  if (!coordinates || !coordinates.length) return;
                  return new geom.MultiPoint(coordinates);
                }
              }), new style.Style({
                stroke: new style.Stroke({
                  color: 'rgba(255, 255, 255, 0.7)',
                  width: 2
                })
              })];
            } else {
              return [new style.Style({
                image: new style.Circle({
                  radius: 2,
                  fill: new style.Fill({
                    color: '#000000'
                  })
                }),
                geometry: feature => {
                  var geometry = feature.getGeometry();
                  var type = geometry.getType();

                  if (type === GeometryType.GEOMETRY_COLLECTION) {
                    geometry = geometry.getGeometries()[0];
                  }
                  var coordinates = geometry.getCoordinates();

                  if (type == GeometryType.POLYGON || type == GeometryType.MULTI_LINE_STRING) {
                    coordinates = coordinates.flat(1);
                  }

                  if (!coordinates.length) return;
                  return new geom.MultiPoint(coordinates);
                }
              }), new style.Style({
                stroke: new style.Stroke({
                  color: '#ff0000',
                  width: 4
                }),
                fill: new style.Fill({
                  color: 'rgba(255, 0, 0, 0.7)'
                })
              })];
            }

        }
      }
      /**
       *
       * @param feature
       * @private
       */


      _editModeOn(feature) {
        this._editFeatureOriginal = feature.clone();
        this._isEditModeOn = true; // To refresh the style

        this._editLayer.getSource().changed();

        this._removeOverlayHelper(feature);

        var controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--changes-control';
        var elements = document.createElement('div');
        elements.className = 'ol-wfst--changes-control-el';
        var elementId = document.createElement('div');
        elementId.className = 'ol-wfst--changes-control-id';
        elementId.innerHTML = "<b>".concat(this._i18n.labels.editMode, "</b> - <i>").concat(String(feature.getId()), "</i>");
        var acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = this._i18n.labels.apply;
        acceptButton.className = 'btn btn-primary';

        acceptButton.onclick = () => {
          this.interactionSelectModify.getFeatures().remove(feature);
        };

        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
        cancelButton.className = 'btn btn-secondary';

        cancelButton.onclick = () => {
          feature.setGeometry(this._editFeatureOriginal.getGeometry());

          this._removeFeatureFromEditList(feature);

          this.interactionSelectModify.getFeatures().remove(feature);
        };

        elements.append(elementId);
        elements.append(cancelButton);
        elements.append(acceptButton);
        controlDiv.append(elements);
        this._controlApplyDiscardChanges = new control.Control({
          element: controlDiv
        });
        this.map.addControl(this._controlApplyDiscardChanges);
      }
      /**
       * @private
       */


      _editModeOff() {
        this._isEditModeOn = false;
        this.map.removeControl(this._controlApplyDiscardChanges);
      }
      /**
       * Remove a feature from the edit Layer and from the Geoserver
       *
       * @param feature
       * @private
       */


      _deleteElement(feature, confirm) {
        var deleteEl = () => {
          var features = Array.isArray(feature) ? feature : [feature];
          features.forEach(feature => this._editLayer.getSource().removeFeature(feature));
          this.interactionSelectModify.getFeatures().clear();
        };

        if (confirm) {
          var confirmModal = modalVanilla.confirm(this._i18n.labels.confirmDelete, {
            animateInClass: 'in'
          });
          confirmModal.show().once('dismiss', function (modal, ev, button) {
            if (button && button.value) {
              deleteEl();
            }
          });
        } else {
          deleteEl();
        }
      }
      /**
       * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
       *
       * @param feature
       * @param coordinate
       * @param layerName
       * @private
       */


      _addFeatureToEdit(feature) {
        var coordinate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var layerName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var prepareOverlay = () => {
          var svgFields = "<img src=\"".concat(img$3, "\"/>");
          var editFieldsEl = document.createElement('div');
          editFieldsEl.className = 'ol-wfst--edit-button-cnt';
          editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(this._i18n.labels.editFields, "\">").concat(svgFields, "</button>");

          editFieldsEl.onclick = () => {
            this._initEditFieldsModal(feature);
          };

          var buttons = document.createElement('div');
          buttons.append(editFieldsEl);
          var svgGeom = "<img src=\"".concat(img$2, "\"/>");
          var editGeomEl = document.createElement('div');
          editGeomEl.className = 'ol-wfst--edit-button-cnt';
          editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(this._i18n.labels.editGeom, "\">").concat(svgGeom, "</button>");

          editGeomEl.onclick = () => {
            this._editModeOn(feature);
          };

          buttons.append(editGeomEl);
          var position = coordinate || extent.getCenter(feature.getGeometry().getExtent());
          var buttonsOverlay = new ol.Overlay({
            id: feature.getId(),
            position: position,
            positioning: OverlayPositioning.CENTER_CENTER,
            element: buttons,
            offset: [0, -40],
            stopEvent: true
          });
          this.map.addOverlay(buttonsOverlay);
        };

        if (layerName) {
          // Guardamos el nombre de la capa de donde sale la feature
          feature.set('_layerName_', layerName);
        }

        var props = feature ? feature.getProperties() : '';

        if (props) {
          if (feature.getGeometry()) {
            this._editLayer.getSource().addFeature(feature);

            this.interactionSelectModify.getFeatures().push(feature);
            prepareOverlay();
            if (this._useLockFeature && this._hasLockFeature) this._lockFeature(feature.getId(), feature.get('_layerName_'));
          }
        }
      }
      /**
       * Removes in the DOM the class of the tools
       * @private
       */


      _resetStateButtons() {
        var activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
        if (activeBtn) activeBtn.classList.remove('wfst--active');
      }
      /**
      * Confirm modal before transact to the GeoServer the features in the file
      *
      * @param feature
      * @private
      */


      _initUploadFileModal(content, featuresToInsert) {
        var footer = "\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">\n                ".concat(this._i18n.labels.cancel, "\n            </button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.upload, "\n            </button>\n        ");
        var modal = new modalVanilla({
          header: true,
          headerClose: false,
          title: this._i18n.labels.uploadFeatures + ' ' + this._layerToInsertElements,
          content: content,
          backdrop: 'static',
          footer: footer,
          animateInClass: 'in'
        }).show();
        modal.on('dismiss', (modal, event) => {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            this._transactWFS('insert', featuresToInsert, this._layerToInsertElements);
          } else {
            // On cancel button
            Observable$1.unByKey(this._keyRemove);

            this._editLayer.getSource().clear();

            setTimeout(() => {
              this._onRemoveFeatureEvent();
            }, 150);
          }
        });
      }
      /**
       * Parse and check geometry of uploaded files
       *
       * @param evt
       * @private
       */


      _processUploadFile(evt) {
        return __awaiter(this, void 0, void 0, function* () {
          /**
           * Read data file
           * @param file
           */
          var fileReader = file => {
            return new Promise((resolve, reject) => {
              var reader = new FileReader();
              reader.addEventListener('load', e => __awaiter(this, void 0, void 0, function* () {
                var fileData = e.target.result;
                resolve(fileData);
              }));
              reader.addEventListener('error', err => {
                console.error('Error' + err);
                reject();
              });
              reader.readAsText(file);
            });
          };
          /**
           * Attemp to change the geometry feature to the layer
           * @param feature
           */


          var fixGeometry = feature => {
            // Geometry of the layer
            var geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
            var geomTypeFeature = feature.getGeometry().getType();
            var geom$1;

            switch (geomTypeFeature) {
              case 'Point':
                {
                  if (geomTypeLayer === 'MultiPoint') {
                    var coords = feature.getGeometry().getCoordinates();
                    geom$1 = new geom.MultiPoint([coords]);
                  }

                  break;
                }

              case 'LineString':
                if (geomTypeLayer === 'MultiLineString') {
                  var _coords = feature.getGeometry().getCoordinates();

                  geom$1 = new geom.MultiLineString([_coords]);
                }

                break;

              case 'Polygon':
                if (geomTypeLayer === 'MultiPolygon') {
                  var _coords2 = feature.getGeometry().getCoordinates();

                  geom$1 = new geom.MultiPolygon([_coords2]);
                }

                break;

              default:
                geom$1 = null;
            }

            if (!geom$1) {
              return null;
            }

            feature.setGeometry(geom$1);
            return feature;
          };
          /**
           * Check if the feature has the same geometry as the target layer
           * @param feature
           */


          var checkGeometry = feature => {
            // Geometry of the layer
            var geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
            var geomTypeFeature = feature.getGeometry().getType(); // This geom accepts every type of geometry

            if (geomTypeLayer === GeometryType.GEOMETRY_COLLECTION) return true;
            return geomTypeFeature === geomTypeLayer;
          };

          var file = evt.target.files[0];
          var features;
          if (!file) return;
          var extension = file.name.split('.').pop().toLowerCase();

          try {
            // If the user uses a custom fucntion...
            if (this.options.processUpload) {
              features = this.options.processUpload(file);
            } // If the user functions return features, we dont process anything more


            if (!features) {
              var string = yield fileReader(file);

              if (extension === 'geojson' || extension === 'json') {
                features = this._formatGeoJSON.readFeatures(string, {
                  featureProjection: this.view.getProjection().getCode()
                });
              } else if (extension === 'kml') {
                features = this._formatKml.readFeatures(string, {
                  featureProjection: this.view.getProjection().getCode()
                });
              } else {
                this._showError(this._i18n.errors.badFormat);
              }
            }
          } catch (err) {
            this._showError(this._i18n.errors.badFile);
          }

          var invalidFeaturesCount = 0;
          var validFeaturesCount = 0;
          var featuresToInsert = [];

          for (var feature of features) {
            // If the geometry doesn't correspond to the layer, try to fixit.
            // If we can't, don't use it
            if (!checkGeometry(feature)) {
              feature = fixGeometry(feature);
            }

            if (feature) {
              featuresToInsert.push(feature);
              validFeaturesCount++;
            } else {
              invalidFeaturesCount++;
              continue;
            }
          }

          if (!validFeaturesCount) {
            this._showError(this._i18n.errors.noValidGeometry);
          } else {
            this._resetStateButtons();

            this.activateEditMode();
            var content = "\n                ".concat(this._i18n.labels.validFeatures, ": ").concat(validFeaturesCount, "<br>\n                ").concat(invalidFeaturesCount ? "".concat(this._i18n.labels.invalidFeatures, ": ").concat(invalidFeaturesCount) : '', "\n            ");

            this._initUploadFileModal(content, featuresToInsert);

            this._editLayer.getSource().addFeatures(featuresToInsert);

            this.view.fit(this._editLayer.getSource().getExtent(), {
              size: this.map.getSize(),
              maxZoom: 21,
              padding: [100, 100, 100, 100]
            });
          } // Reset the input to allow another onChange trigger


          evt.target.value = null;
        });
      }
      /**
       * Add features to the geoserver, in a custom layer
       * witout verifiyn geometry and showing modal to confirm.
       *
       * @param layerName
       * @param features
       * @public
       */


      insertFeaturesTo(layerName, features) {
        this._transactWFS('insert', features, layerName);
      }
      /**
       * Activate/deactivate the draw mode
       * @param layerName
       * @public
       */


      activateDrawMode(layerName) {
        var geomDrawTypeSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var getDrawTypeSelected = layerName => {
          var drawType;

          if (this._selectDraw) {
            var geomLayer = this._geoServerData[layerName].geomType;
            var geomTypeForSelect = geomLayer.replace('Multi', ''); // If a draw Type is selected, is a GeometryCollection

            if (geomDrawTypeSelected) {
              drawType = this._selectDraw.value;
            } else {
              if (geomLayer === GeometryType.GEOMETRY_COLLECTION) {
                drawType = GeometryType.POINT; // Default drawing type for GeometryCollection

                this._selectDraw.value = drawType;
                this._selectDraw.disabled = false;
              } else {
                drawType = geomLayer;
                this._selectDraw.value = geomTypeForSelect;
                this._selectDraw.disabled = true;
              }
            }
          }

          return drawType;
        };

        var addDrawInteraction = layerName => {
          this.activateEditMode(false); // If already exists, remove

          if (this.interactionDraw) this.map.removeInteraction(this.interactionDraw);
          var geomDrawType = getDrawTypeSelected(layerName);
          this.interactionDraw = new interaction.Draw({
            source: this._editLayer.getSource(),
            type: geomDrawType,
            style: feature => this._styleFunction(feature)
          });
          this.map.addInteraction(this.interactionDraw);

          var drawHandler = () => {
            this.interactionDraw.on('drawend', evt => {
              Observable$1.unByKey(this._keyRemove);
              var feature = evt.feature;

              this._transactWFS('insert', feature, layerName);

              setTimeout(() => {
                this._onRemoveFeatureEvent();
              }, 150);
            });
          };

          drawHandler();
        };

        if (!this.interactionDraw && !layerName) return;
        this._isDrawModeOn = layerName ? true : false;

        if (layerName) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
          if (btn) btn.classList.add('wfst--active');
          this.viewport.classList.add('draw-mode');
          addDrawInteraction(String(layerName));
        } else {
          this.map.removeInteraction(this.interactionDraw);
          this.viewport.classList.remove('draw-mode');
        }
      }
      /**
       * Activate/desactivate the edit mode
       * @param bool
       * @public
       */


      activateEditMode() {
        var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (bool) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
          if (btn) btn.classList.add('wfst--active');
          this.activateDrawMode(false);
        } else {
          // Deselct features
          this.interactionSelectModify.getFeatures().clear();
        }

        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);

        if (this.options.layerMode === 'wms') ; else {
          this.interactionWfsSelect.setActive(bool);
        }
      }
      /**
       * Shows a fields form in a modal window to allow changes in the properties of the feature.
       *
       * @param feature
       * @private
       */


      _initEditFieldsModal(feature) {
        this._editFeature = feature;
        var properties = feature.getProperties();
        var layer = feature.get('_layerName_'); // Data schema from the geoserver

        var dataSchema = this._geoServerData[layer].properties;
        var content = '<form autocomplete="false">';
        Object.keys(properties).forEach(key => {
          // If the feature field exists in the geoserver and is not added by openlayers
          var field = dataSchema.find(data => data.name === key);

          if (field) {
            var typeXsd = field.type;
            var type;

            switch (typeXsd) {
              case 'xsd:string':
                type = 'text';
                break;

              case 'xsd:number':
              case 'xsd:int':
                type = 'number';
                break;

              case 'xsd:date-time':
                type = 'datetime';
                break;

              default:
                type = 'text';
            }

            if (type) {
              content += "\n                <div class=\"ol-wfst--input-field-container\">\n                    <label class=\"ol-wfst--input-field-label\" for=\"".concat(key, "\">").concat(key, "</label>\n                    <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"").concat(type, "\" name=\"").concat(key, "\" value=\"").concat(properties[key] || '', "\">\n                </div>");
            }
          }
        });
        content += '</form>';
        var footer = "\n            <button type=\"button\" class=\"btn btn-link btn-third\" data-action=\"delete\" data-dismiss=\"modal\">\n                ".concat(this._i18n.labels.delete, "\n            </button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.cancel, "\n            </button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.save, "\n            </button>\n        ");
        var modal = new modalVanilla({
          header: true,
          headerClose: true,
          title: "".concat(this._i18n.labels.editElement, " ").concat(this._editFeature.getId(), " "),
          content: content,
          footer: footer,
          animateInClass: 'in'
        }).show();
        modal.on('dismiss', (modal, event) => {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            var inputs = modal.el.querySelectorAll('input');
            inputs.forEach(el => {
              var value = el.value;
              var field = el.name;

              this._editFeature.set(field, value,
              /*isSilent = */
              true);
            });

            this._editFeature.changed();

            this._addFeatureToEditedList(this._editFeature); // Force deselect to trigger handler


            this.interactionSelectModify.getFeatures().remove(this._editFeature);
          } else if (event.target.dataset.action === 'delete') {
            this._deleteElement(this._editFeature, true);
          }
        });
      }
      /**
       * Remove the overlay helper atttached to a specify feature
       * @param feature
       * @private
       */


      _removeOverlayHelper(feature) {
        var featureId = feature.getId();
        if (!featureId) return;
        var overlay = this.map.getOverlayById(featureId);
        if (!overlay) return;
        this.map.removeOverlay(overlay);
      }

    }

    return Wfst;

})));
