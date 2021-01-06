(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol'), require('ol/format'), require('ol/source'), require('ol/layer'), require('ol/interaction'), require('ol/Observable'), require('ol/geom'), require('ol/loadingstrategy'), require('ol/extent'), require('ol/style')) :
    typeof define === 'function' && define.amd ? define(['ol', 'ol/format', 'ol/source', 'ol/layer', 'ol/interaction', 'ol/Observable', 'ol/geom', 'ol/loadingstrategy', 'ol/extent', 'ol/style'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(global.ol, global.ol.format, global.ol.source, global.ol.layer, global.ol.interaction, global.ol.Observable, global.ol.geom, global.ol.loadingstrategy, global.ol.extent, global.ol.style));
}(this, (function (ol, format, source, layer, interaction, Observable$1, geom, loadingstrategy, extent, style) { 'use strict';

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
     * @module ol/util
     */
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
    var VERSION = '6.4.3';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
     * @module ol/MapEventType
     */
    /**
     * @enum {string}
     */
    var MapEventType = {
        /**
         * Triggered after a map frame is rendered.
         * @event module:ol/MapEvent~MapEvent#postrender
         * @api
         */
        POSTRENDER: 'postrender',
        /**
         * Triggered when the map starts moving.
         * @event module:ol/MapEvent~MapEvent#movestart
         * @api
         */
        MOVESTART: 'movestart',
        /**
         * Triggered after the map is moved.
         * @event module:ol/MapEvent~MapEvent#moveend
         * @api
         */
        MOVEEND: 'moveend',
    };

    /**
     * @param {Node} node The node to remove.
     * @returns {Node} The node that was removed or null.
     */
    function removeNode(node) {
        return node && node.parentNode ? node.parentNode.removeChild(node) : null;
    }

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {Object} Options
     * @property {HTMLElement} [element] The element is the control's
     * container element. This only needs to be specified if you're developing
     * a custom control.
     * @property {function(import("../MapEvent.js").default):void} [render] Function called when
     * the control should be re-rendered. This is called in a `requestAnimationFrame`
     * callback.
     * @property {HTMLElement|string} [target] Specify a target if you want
     * the control to be rendered outside of the map's viewport.
     */
    /**
     * @classdesc
     * A control is a visible widget with a DOM element in a fixed position on the
     * screen. They can involve user input (buttons), or be informational only;
     * the position is determined using CSS. By default these are placed in the
     * container with CSS class name `ol-overlaycontainer-stopevent`, but can use
     * any outside DOM element.
     *
     * This is the base class for controls. You can use it for simple custom
     * controls by creating the element with listeners, creating an instance:
     * ```js
     * var myControl = new Control({element: myElement});
     * ```
     * and then adding this to the map.
     *
     * The main advantage of having this as a control rather than a simple separate
     * DOM element is that preventing propagation is handled for you. Controls
     * will also be objects in a {@link module:ol/Collection~Collection}, so you can use their methods.
     *
     * You can also extend this base for your own control class. See
     * examples/custom-controls for an example of how to do this.
     *
     * @api
     */
    var Control = /** @class */ (function (_super) {
        __extends$4(Control, _super);
        /**
         * @param {Options} options Control options.
         */
        function Control(options) {
            var _this = _super.call(this) || this;
            var element = options.element;
            if (element && !options.target && !element.style.pointerEvents) {
                element.style.pointerEvents = 'auto';
            }
            /**
             * @protected
             * @type {HTMLElement}
             */
            _this.element = element ? element : null;
            /**
             * @private
             * @type {HTMLElement}
             */
            _this.target_ = null;
            /**
             * @private
             * @type {import("../PluggableMap.js").default}
             */
            _this.map_ = null;
            /**
             * @protected
             * @type {!Array<import("../events.js").EventsKey>}
             */
            _this.listenerKeys = [];
            if (options.render) {
                _this.render = options.render;
            }
            if (options.target) {
                _this.setTarget(options.target);
            }
            return _this;
        }
        /**
         * Clean up.
         */
        Control.prototype.disposeInternal = function () {
            removeNode(this.element);
            _super.prototype.disposeInternal.call(this);
        };
        /**
         * Get the map associated with this control.
         * @return {import("../PluggableMap.js").default} Map.
         * @api
         */
        Control.prototype.getMap = function () {
            return this.map_;
        };
        /**
         * Remove the control from its current map and attach it to the new map.
         * Subclasses may set up event handlers to get notified about changes to
         * the map here.
         * @param {import("../PluggableMap.js").default} map Map.
         * @api
         */
        Control.prototype.setMap = function (map) {
            if (this.map_) {
                removeNode(this.element);
            }
            for (var i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
                unlistenByKey(this.listenerKeys[i]);
            }
            this.listenerKeys.length = 0;
            this.map_ = map;
            if (this.map_) {
                var target = this.target_
                    ? this.target_
                    : map.getOverlayContainerStopEvent();
                target.appendChild(this.element);
                if (this.render !== VOID) {
                    this.listenerKeys.push(listen(map, MapEventType.POSTRENDER, this.render, this));
                }
                map.render();
            }
        };
        /**
         * Renders the control.
         * @param {import("../MapEvent.js").default} mapEvent Map event.
         * @api
         */
        Control.prototype.render = function (mapEvent) { };
        /**
         * This function is used to set a target element for the control. It has no
         * effect if it is called after the control has been added to the map (i.e.
         * after `setMap` is called on the control). If no `target` is set in the
         * options passed to the control constructor and if `setTarget` is not called
         * then the control is added to the map's overlay container.
         * @param {HTMLElement|string} target Target.
         * @api
         */
        Control.prototype.setTarget = function (target) {
            this.target_ =
                typeof target === 'string' ? document.getElementById(target) : target;
        };
        return Control;
    }(BaseObject));

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
    /**
     * @constructor
     * @param {class} map
     * @param {object} opt_options
     */

    class Wfst {
      constructor(map, opt_options) {
        this.layerMode = opt_options.layerMode || 'wms';
        this.evtType = opt_options.evtType || 'singleclick';
        this.wfsStrategy = opt_options.wfsStrategy || 'bbox';
        var active = 'active' in opt_options ? opt_options.active : true;
        var layers = opt_options.layers ? Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers] : null;
        var showControl = 'showControl' in opt_options ? opt_options.showControl : true;
        this._useLockFeature = 'useLockFeature' in opt_options ? opt_options.useLockFeature : true;

        this.beforeInsertFeature = feature => 'beforeInsertFeature' in opt_options ? opt_options.beforeInsertFeature(feature) : feature;

        this._minZoom = 'minZoom' in opt_options ? opt_options.minZoom : 9; // GeoServer

        this._geoServerUrl = opt_options.urlGeoserver;
        this._hasLockFeature = false;
        this._hasTransaction = false;
        this._geoServerCapabilities = null;
        this._geoServerData = {}; // Ol

        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._isVisible = this.view.getZoom() > this._minZoom;
        this._editedFeatures = new Set();
        this._layers = []; // By default, the first layer is ready to accept new draws

        this._layerToInsertElements = layers[0];
        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];
        this._formatWFS = new format.WFS();
        this._formatGeoJSON = new format.GeoJSON();
        this._xs = new XMLSerializer();
        this._countRequests = 0;
        this._isEditModeOn = false;

        this._initAsyncOperations(layers, showControl, active);
      }
      /**
       *
       * @param layers
       * @param showControl
       * @param active
       * @private
       */


      _initAsyncOperations(layers, showControl, active) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            yield this._connectToGeoServer();

            if (layers) {
              yield this._getLayersData(layers, this._geoServerUrl);

              this._createLayers(layers);
            }

            this._initMapElements(showControl, active);
          } catch (err) {
            this._showError(err.message);
          }
        });
      }
      /**
       *
       * @param layers
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
            var url_fetch = this._geoServerUrl + '?' + params.toString();

            try {
              var response = yield fetch(url_fetch);

              if (!response.ok) {
                throw new Error('');
              }

              var data = yield response.text();
              var capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
              return capabilities;
            } catch (err) {
              throw new Error('No se pudieron descargar las Capabilidades del GeoServer');
            }
          });

          this._geoServerCapabilities = yield getCapabilities(); // Available operations in the geoserver

          var operations = this._geoServerCapabilities.getElementsByTagName("ows:Operation");

          for (var operation of operations) {
            if (operation.getAttribute('name') === 'Transaction') this._hasTransaction = true;else if (operation.getAttribute('name') === 'LockFeature') this._hasLockFeature = true;
          }

          if (!this._hasTransaction) throw new Error('El GeoServer no tiene soporte a Transacciones');
          return true;
        });
      }
      /**
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

          this._addKeyboardEvents();

          if (showControl) this._addControlTools();
          this.activateEditMode(active);
        });
      }
      /**
       * Layer to store temporary all the elements to edit
       * @private
       */


      _createEditLayer() {
        this._editLayer = new layer.Vector({
          source: new source.Vector(),
          zIndex: 5
        });
        this.map.addLayer(this._editLayer);
      }
      /**
       * Add already created layers to the map
       * @param layers
       * @public
       */


      addLayers(layers) {
        layers = Array.isArray(layers) ? layers : [layers];
        var layersStr = [];
        if (!layers.length) return;
        layers.forEach(layer$1 => {
          if (layer$1 instanceof layer.Vector) {
            layer$1.set('type', '_wfs_');
          } else {
            layer$1.set('type', '_wms_');
          }

          this.map.addLayer(layer$1);
          var layerName = layer$1.get('name');
          this._layers[layerName] = layer$1;
          layersStr.push(layerName);
        });

        this._getLayersData(layersStr, this._geoServerUrl);
      }
      /**
       * Lock a feature in the geoserver before edit
       * @param featureId
       * @param layerName
       * @todo fix cql filter
       */


      _lockFeature(featureId, layerName) {
        var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return __awaiter(this, void 0, void 0, function* () {
          var params = new URLSearchParams({
            service: 'wfs',
            version: '1.1.0',
            request: 'LockFeature',
            expiry: String(5),
            LockId: 'a',
            typeName: layerName,
            releaseAction: 'SOME',
            exceptions: 'application/json',
            featureid: "".concat(featureId)
          });
          var url_fetch = this._geoServerUrl + '?' + params.toString();

          try {
            var response = yield fetch(url_fetch);

            if (!response.ok) {
              throw new Error('No se pudieron bloquear elementos en el GeoServer. HTTP status: ' + response.status);
            }

            var data = yield response.text();

            try {
              // First, check if is a JSON (with errors)
              data = JSON.parse(data);

              if ('exceptions' in data) {
                if (data.exceptions[0].code === "CannotLockAllFeatures") {
                  // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                  if (!retry) this._lockFeature(featureId, layerName, 1);else this._showError('El elemento no se puede bloquear');
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
       *
       * @param layers
       * @private
       */


      _getLayersData(layers, geoServerUrl) {
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
            var response = yield fetch(url_fetch);

            if (!response.ok) {
              throw new Error('');
            }

            return yield response.json();
          });

          for (var layerName of layers) {
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
              this._showError("No se pudieron obtener datos de la capa \"".concat(layerName, "\"."));
            }
          }
        });
      }
      /**
       *
       * @param layers
       * @private
       */


      _createLayers(layers) {
        var newWmsLayer = layerName => {
          var layer$1 = new layer.Tile({
            source: new source.TileWMS({
              url: this._geoServerUrl,
              params: {
                'SERVICE': 'WMS',
                'LAYERS': layerName,
                'TILED': true
              },
              serverType: 'geoserver'
            }),
            zIndex: 4,
            minZoom: this._minZoom
          });
          layer$1.setProperties({
            name: layerName,
            type: "_wms_"
          });
          return layer$1;
        };

        var newWfsLayer = layerName => {
          var source$1 = new source.Vector({
            format: new format.GeoJSON(),
            strategy: this.wfsStrategy === 'bbox' ? loadingstrategy.bbox : loadingstrategy.all,
            loader: extent => __awaiter(this, void 0, void 0, function* () {
              if (!this._isVisible) return;
              var params = new URLSearchParams({
                service: 'wfs',
                version: '1.0.0',
                request: 'GetFeature',
                typename: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json',
                srsName: 'urn:ogc:def:crs:EPSG::4326'
              }); // If bbox, add extent to the request

              if (this.wfsStrategy === 'bbox') params.append('bbox', extent.join(','));
              var url_fetch = this._geoServerUrl + '?' + params.toString();

              try {
                var response = yield fetch(url_fetch);

                if (!response.ok) {
                  throw new Error('No se pudieron obtener datos desde el GeoServer. HTTP status: ' + response.status);
                }

                var data = yield response.json();
                var features = source$1.getFormat().readFeatures(data);
                features.forEach(feature => {
                  feature.set('_layerName_', layerName,
                  /* silent = */
                  true);
                });
                source$1.addFeatures(features);
              } catch (err) {
                console.error(err);
                source$1.removeLoadedExtent(extent);
              }
            })
          });
          var layer$1 = new layer.Vector({
            visible: this._isVisible,
            minZoom: this._minZoom,
            source: source$1,
            zIndex: 2
          });
          layer$1.setProperties({
            name: layerName,
            type: "_wfs_"
          });
          return layer$1;
        };

        layers.forEach(layerName => {
          // Only create the layer if we can get the GeoserverData
          if (this._geoServerData[layerName]) {
            var layer;

            if (this.layerMode === 'wms') {
              layer = newWmsLayer(layerName);
            } else {
              layer = newWfsLayer(layerName);
            }

            this.map.addLayer(layer);
            this._layers[layerName] = layer;
          }
        });
      }
      /**
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
       *
       * @param mode
       * @param features
       * @private
       */


      _transactWFS(mode, features, layerName) {
        return __awaiter(this, void 0, void 0, function* () {
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

          features = Array.isArray(features) ? features : [features];
          features.forEach(feature => {
            var clone = cloneFeature(feature); // Filters

            if (mode === 'insert') {
              clone = this.beforeInsertFeature(clone);
            } // Peevent fire multiples times


            this._countRequests++;
            var numberRequest = this._countRequests;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
              if (numberRequest !== this._countRequests) return;
              var options = {
                featureNS: this._geoServerData[layerName].namespace,
                featureType: layerName,
                srsName: 'urn:ogc:def:crs:EPSG::4326',
                featurePrefix: null,
                nativeElements: null
              };

              switch (mode) {
                case 'insert':
                  this._insertFeatures = [...this._insertFeatures, clone];
                  break;

                case 'update':
                  this._updateFeatures = [...this._updateFeatures, clone];
                  break;

                case 'delete':
                  this._deleteFeatures = [...this._deleteFeatures, clone];
                  break;
              }

              var transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);

              var payload = this._xs.serializeToString(transaction); // Fixes geometry name, weird bug


              payload = payload.replaceAll("geometry", this._geoServerData[layerName].geomField); // Add default LockId value

              if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
                payload = payload.replace("</Transaction>", "<LockId>GeoServer</LockId></Transaction>");
              }

              try {
                var response = yield fetch(this._geoServerUrl, {
                  method: 'POST',
                  body: payload,
                  headers: {
                    'Content-Type': 'text/xml',
                    'Access-Control-Allow-Origin': '*'
                  }
                });

                if (!response.ok) {
                  throw new Error('Error al hacer transacción con el GeoServer. HTTP status: ' + response.status);
                }

                var parseResponse = this._formatWFS.readTransactionResponse(response);

                if (!Object.keys(parseResponse).length) {
                  var responseStr = yield response.text();
                  var findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                  if (findError) this._showError(findError[1]);
                }

                if (mode !== 'delete') this._editLayer.getSource().removeFeature(feature);
                if (this.layerMode === 'wfs') refreshWfsLayer(this._layers[layerName]);else if (this.layerMode === 'wms') refreshWmsLayer(this._layers[layerName]);
              } catch (err) {
                console.error(err);
              }

              this._insertFeatures = [];
              this._updateFeatures = [];
              this._deleteFeatures = [];
              this._countRequests = 0;
            }), 300);
          });
        });
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


      _addFeatureToEditedList(feature) {
        this._editedFeatures.add(String(feature.getId()));
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
              var layer = _this._layers[layerName];
              var coordinate = evt.coordinate; // Si la vista es lejana, disminumos el buffer
              // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
              // y mejorar la sensibilidad en IOS

              var buffer = _this.view.getZoom() > 10 ? 10 : 5;
              var url = layer.getSource().getFeatureInfoUrl(coordinate, _this.view.getResolution(), _this.view.getProjection(), {
                'INFO_FORMAT': 'application/json',
                'BUFFER': buffer,
                'FEATURE_COUNT': 1,
                'EXCEPTIONS': 'application/json'
              });

              try {
                var response = yield fetch(url);

                if (!response.ok) {
                  throw new Error('Error al obtener elemento desde el GeoServer. HTTP status: ' + response.status);
                }

                var data = yield response.json();

                var features = _this._formatGeoJSON.readFeatures(data);

                if (!features.length) return "continue";
                features.forEach(feature => _this._addFeatureToEdit(feature, coordinate, layerName));
              } catch (err) {
                _this._showError(err.message);
              }
            };

            for (var layerName in this._layers) {
              var _ret = yield* _loop(layerName);

              if (_ret === "continue") continue;
            }
          });

          this._keyClickWms = this.map.on(this.evtType, evt => __awaiter(this, void 0, void 0, function* () {
            if (this.map.hasFeatureAtPixel(evt.pixel)) return;
            if (!this._isVisible) return; // Only get other features if editmode is disabled

            if (!this._isEditModeOn) yield getFeatures(evt);
          }));
        };

        if (this.layerMode === 'wfs') prepareWfsInteraction();else if (this.layerMode === 'wms') prepareWmsInteraction(); // Interaction to allow select features in the edit layer

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
       *
       * @param feature
       * @private
       */


      _cancelEditFeature(feature) {
        this._removeOverlayHelper(feature);

        this._editModeOff();
      }
      /**
       *
       * @param feature
       * @private
       */


      _finishEditFeature(feature) {
        Observable$1.unByKey(this._keyRemove);
        var layerName = feature.get('_layerName_');

        if (this._isFeatureEdited(feature)) {
          this._transactWFS('update', feature, layerName);
        } else {
          // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
          if (this.layerMode === 'wfs') {
            var layer = this._layers[layerName];
            layer.getSource().addFeature(feature);
            this.interactionWfsSelect.getFeatures().remove(feature);
          }

          this.interactionSelectModify.getFeatures().remove(feature);

          this._editLayer.getSource().removeFeature(feature);
        }

        setTimeout(() => {
          this._removeFeatureHandler();
        }, 150);
      }
      /**
       * @private
       */


      _selectFeatureHandler() {
        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', evt => {
          var feature = evt.element;

          this._cancelEditFeature(feature);

          this._finishEditFeature(feature);
        });
      }
      /**
       * @private
       */


      _removeFeatureHandler() {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', evt => {
          if (this._keySelect) Observable$1.unByKey(this._keySelect);
          var feature = evt.feature;
          var layerName = feature.get('_layerName_');

          this._transactWFS('delete', feature, layerName);

          this._cancelEditFeature(feature);

          if (this._keySelect) {
            setTimeout(() => {
              this._selectFeatureHandler();
            }, 150);
          }
        });
      }
      /**
       * @private
       */


      _addHandlers() {
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', evt => {
          this._addFeatureToEditedList(evt.features.item(0));
        });

        this._selectFeatureHandler();

        this._removeFeatureHandler();

        var handleZoomEnd = () => {
          if (this._currentZoom < this._minZoom) {
            // Hide the layer
            if (this._isVisible) {
              this._isVisible = false;
            }
          } else {
            // Show the layers
            if (!this._isVisible) {
              this._isVisible = true;
            } else {
              // If the view is closer, don't do anything, we already had the features
              if (this._currentZoom > this._lastZoom) return;
            }
          }
        };

        this.map.on('moveend', () => {
          this._currentZoom = this.view.getZoom();
          if (this._currentZoom !== this._lastZoom) handleZoomEnd();
          this._lastZoom = this._currentZoom;
        });
      }
      /**
       *
       * @param feature
       * @private
       */


      _styleFunction(feature) {
        var type = feature.getGeometry().getType();

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
                  var coordinates = geometry.getCoordinates();
                  var type = geometry.getType();

                  if (type == 'Polygon' || type == 'MultiLineString') {
                    coordinates = coordinates.flat(1);
                  }

                  if (!coordinates.length) return;
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
                  var coordinates = geometry.getCoordinates();
                  var type = geometry.getType();

                  if (type == 'Polygon' || type == 'MultiLineString') {
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
        elementId.innerHTML = "<b>Modo Edici\xF3n</b> - <i>".concat(String(feature.getId()), "</i>");
        var acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = 'Aplicar cambios';
        acceptButton.className = 'btn btn-primary';

        acceptButton.onclick = () => {
          this.interactionSelectModify.getFeatures().remove(feature);
        };

        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
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
        this._controlApplyDiscardChanges = new Control({
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
          var confirmModal = modalVanilla.confirm('¿Está seguro de borrar el elemento?', {
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
       * Add Keyboards events to allow shortcuts on editing features
       * @private
       */


      _addKeyboardEvents() {
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
          editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"Editar campos\">".concat(svgFields, "</button>");

          editFieldsEl.onclick = () => {
            this._initEditFieldsModal(feature);
          };

          var buttons = document.createElement('div');
          buttons.append(editFieldsEl);
          var svgGeom = "<img src=\"".concat(img$2, "\"/>");
          var editGeomEl = document.createElement('div');
          editGeomEl.className = 'ol-wfst--edit-button-cnt';
          editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"Editar geometr\xEDa\">".concat(svgGeom, "</button>");

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
       * Add the widget on the map to allow change the tools and select active layers
       * @private
       */


      _addControlTools() {
        var createLayerElement = layerName => {
          return "\n                <div>       \n                    <label for=\"wfst--".concat(layerName, "\">\n                        <input value=\"").concat(layerName, "\" id=\"wfst--").concat(layerName, "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" ").concat(layerName === this._layerToInsertElements ? 'checked="checked"' : '', ">\n                        ").concat(layerName, "\n                    </label>\n                </div>\n            ");
        };

        var controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--tools-control'; // Select Tool

        var selectionButton = document.createElement('button');
        selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
        selectionButton.type = 'button';
        selectionButton.innerHTML = "<img src=\"".concat(img$1, "\"/>");
        selectionButton.title = 'Seleccionar';

        selectionButton.onclick = () => {
          this._resetStateButtons();

          this.activateEditMode();
        }; // Draw Tool


        var drawButton = document.createElement('button');
        drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
        drawButton.type = 'button';
        drawButton.innerHTML = "<img src=\"".concat(img, "\"/>");
        drawButton.title = 'Añadir elemento';

        drawButton.onclick = () => {
          this._resetStateButtons();

          this.activateDrawMode(this._layerToInsertElements);
        }; // Upload Tool


        var uploadButton = document.createElement('label');
        uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
        uploadButton.htmlFor = 'ol-wfst--upload';
        uploadButton.innerHTML = "<img src=\"".concat(img$4, "\"/>");
        uploadButton.title = 'Subir archivo';

        uploadButton.onclick = () => {};

        var uploadInput = document.createElement('input');
        uploadInput.id = 'ol-wfst--upload';
        uploadInput.type = 'file';
        uploadInput.accept = '.geojson';

        uploadInput.onchange = evt => {
          console.log(evt);
        };

        var buttons = document.createElement('div');
        buttons.className = 'wfst--tools-control--buttons';
        buttons.append(uploadInput);
        buttons.append(selectionButton);
        buttons.append(drawButton);
        buttons.append(uploadButton);
        this._controlWidgetTools = new Control({
          element: controlDiv
        });
        controlDiv.append(buttons);

        if (Object.keys(this._layers).length > 1) {
          var html = Object.keys(this._layers).map(key => createLayerElement(key));
          var selectLayers = document.createElement('div');
          selectLayers.className = 'wfst--tools-control--layers';
          selectLayers.innerHTML = html.join('');
          var radioInputs = selectLayers.querySelectorAll('input');
          radioInputs.forEach(radioInput => {
            radioInput.onchange = () => {
              this._layerToInsertElements = radioInput.value;

              this._resetStateButtons();

              this.activateDrawMode(this._layerToInsertElements);
            };
          });
          controlDiv.append(selectLayers);
        }

        this.map.addControl(this._controlWidgetTools);
      }
      /**
       * Add features to the geoserver, in a custom layer
       * This is useful to use on uploading files
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
       * @param bool
       * @public
       */


      activateDrawMode(bool) {
        var addDrawInteraction = layerName => {
          this.activateEditMode(false); // If already exists, remove

          if (this.interactionDraw) this.map.removeInteraction(this.interactionDraw);
          this.interactionDraw = new interaction.Draw({
            source: this._editLayer.getSource(),
            type: this._geoServerData[layerName].geomType,
            style: feature => this._styleFunction(feature)
          });
          this.map.addInteraction(this.interactionDraw);

          var drawHandler = () => {
            this.interactionDraw.on('drawend', evt => {
              Observable$1.unByKey(this._keyRemove);
              var feature = evt.feature;

              this._transactWFS('insert', feature, layerName);

              setTimeout(() => {
                this._removeFeatureHandler();
              }, 150);
            });
          };

          drawHandler();
        };

        if (!this.interactionDraw && !bool) return;
        this._isDrawModeOn = bool ? true : false;

        if (bool) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
          if (btn) btn.classList.add('wfst--active');
          addDrawInteraction(String(bool));
        } else {
          this.map.removeInteraction(this.interactionDraw);
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
        } else {
          this.interactionSelectModify.getFeatures().clear();
        }

        this.activateDrawMode(false);
        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);

        if (this.layerMode === 'wms') ; else {
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
              content += "\n                    <div class=\"ol-wfst--input-field-container\">\n                        <label class=\"ol-wfst--input-field-label\" for=\"".concat(key, "\">").concat(key, "</label>\n                        <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"").concat(type, "\" name=\"").concat(key, "\" value=\"").concat(properties[key] || '', "\">\n                    </div>\n                    ");
            }
          }
        });
        content += '</form>';
        var footer = "\n            <button type=\"button\" class=\"btn btn-transparent btn-third\" data-action=\"delete\" data-dismiss=\"modal\">Eliminar</button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancelar</button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">Guardar</button>\n        ";
        this.modal = new modalVanilla({
          header: true,
          headerClose: true,
          title: "Editar elemento ".concat(this._editFeature.getId()),
          content: content,
          footer: footer,
          animateInClass: 'in'
        }).show();
        this.modal.on('dismiss', (modal, event) => {
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

            this._addFeatureToEditedList(this._editFeature);

            var layerName = this._editFeature.get('_layerName_');

            this._transactWFS('update', this._editFeature, layerName);
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
