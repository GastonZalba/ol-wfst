(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/geom'), require('ol/style'), require('ol/control'), require('ol/interaction'), require('ol/format'), require('ol/layer'), require('ol/source'), require('ol/loadingstrategy'), require('ol/geom/Polygon'), require('ol/extent'), require('ol/events/condition'), require('ol/proj'), require('ol/Observable')) :
    typeof define === 'function' && define.amd ? define(['ol/geom', 'ol/style', 'ol/control', 'ol/interaction', 'ol/format', 'ol/layer', 'ol/source', 'ol/loadingstrategy', 'ol/geom/Polygon', 'ol/extent', 'ol/events/condition', 'ol/proj', 'ol/Observable'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(global.ol.geom, global.ol.style, global.ol.control, global.ol.interaction, global.ol.format, global.ol.layer, global.ol.source, global.ol.loadingstrategy, global.ol.geom.Polygon, global.ol.extent, global.ol.events.condition, global.ol.proj, global.ol.Observable));
}(this, (function (geom, style, control, interaction, format, layer, source, loadingstrategy, Polygon, extent, condition, proj, Observable$1) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * @module ol/TileState
     */
    /**
     * @enum {number}
     */
    var TileState = {
        IDLE: 0,
        LOADING: 1,
        LOADED: 2,
        /**
         * Indicates that tile loading failed
         * @type {number}
         */
        ERROR: 3,
        EMPTY: 4,
    };

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
    var VERSION = '6.12.0';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
             * @type {boolean}
             */
            this.defaultPrevented;
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
         * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
         * will be fired.
         * @api
         */
        BaseEvent.prototype.preventDefault = function () {
            this.defaultPrevented = true;
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
     * @typedef {'propertychange'} Types
     */

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
     * @module ol/functions
     */
    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {void} Nothing.
     */
    function VOID() { }

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
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
         * @param {*} [opt_target] Default event target for dispatched events.
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
         * @param {string} [opt_type] Type. If not provided,
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
     * @module ol/events
     */
    /**
     * Key to use with {@link module:ol/Observable~Observable#unByKey}.
     * @typedef {Object} EventsKey
     * @property {ListenerFunction} listener Listener.
     * @property {import("./events/Target.js").EventTargetLike} target Target.
     * @property {string} type Type.
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
     * @property {ListenerFunction} handleEvent HandleEvent listener function.
     */
    /**
     * @typedef {ListenerFunction|ListenerObject} Listener
     */
    /**
     * Registers an event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` to a `this` object, and returns
     * a key for use with {@link module:ol/events.unlistenByKey}.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object} [opt_this] Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @param {boolean} [opt_once] If true, add the listener as one-off listener.
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
     * {@link module:ol/events.unlistenByKey} in case the listener needs to be
     * unregistered before it is called.
     *
     * When {@link module:ol/events.listen} is called with the same arguments after this
     * function, the self-unregistering listener will be turned into a permanent
     * listener.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object} [opt_this] Object referenced by the `this` keyword in the
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
     * {@link module:ol/events.listen} or {@link module:ol/events.listenOnce}.
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
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /***
     * @template {string} Type
     * @template {Event|import("./events/Event.js").default} EventClass
     * @template Return
     * @typedef {(type: Type, listener: (event: EventClass) => ?) => Return} OnSignature
     */
    /***
     * @template {string} Type
     * @template Return
     * @typedef {(type: Type[], listener: (event: Event|import("./events/Event").default) => ?) => Return extends void ? void : Return[]} CombinedOnSignature
     */
    /**
     * @typedef {'change'|'error'} EventTypes
     */
    /***
     * @template Return
     * @typedef {OnSignature<EventTypes, import("./events/Event.js").default, Return> & CombinedOnSignature<EventTypes, Return>} ObservableOnSignature
     */
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
            _this.on =
                /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (_this.onInternal);
            _this.once =
                /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (_this.onceInternal);
            _this.un = /** @type {ObservableOnSignature<void>} */ (_this.unInternal);
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
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
         * @protected
         */
        Observable.prototype.onInternal = function (type, listener) {
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
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
         * @protected
         */
        Observable.prototype.onceInternal = function (type, listener) {
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
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @protected
         */
        Observable.prototype.unInternal = function (type, listener) {
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
     * Listen for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.on;
    /**
     * Listen once for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.once;
    /**
     * Unlisten for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @api
     */
    Observable.prototype.un;
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
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *    import("./Observable").OnSignature<import("./ObjectEventType").Types, ObjectEvent, Return> &
     *    import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types, Return>} ObjectOnSignature
     */
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
         * @param {Object<string, *>} [opt_values] An object with key-value pairs.
         */
        function BaseObject(opt_values) {
            var _this = _super.call(this) || this;
            /***
             * @type {ObjectOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {ObjectOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {ObjectOnSignature<void>}
             */
            _this.un;
            // Call {@link module:ol/util.getUid} to ensure that the order of objects' ids is
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
            eventType = "change:" + key;
            this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
            eventType = ObjectEventType.PROPERTYCHANGE;
            this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
        };
        /**
         * @param {string} key Key name.
         * @param {import("./events.js").Listener} listener Listener.
         */
        BaseObject.prototype.addChangeListener = function (key, listener) {
            this.addEventListener("change:" + key, listener);
        };
        /**
         * @param {string} key Key name.
         * @param {import("./events.js").Listener} listener Listener.
         */
        BaseObject.prototype.removeChangeListener = function (key, listener) {
            this.removeEventListener("change:" + key, listener);
        };
        /**
         * Sets a value.
         * @param {string} key Key name.
         * @param {*} value Value.
         * @param {boolean} [opt_silent] Update without triggering an event.
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
         * @param {boolean} [opt_silent] Update without triggering an event.
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
         * @param {boolean} [opt_silent] Unset without triggering an event.
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
     * @module ol/CollectionEventType
     */
    /**
     * @enum {string}
     */
    var CollectionEventType = {
        /**
         * Triggered when an item is added to the collection.
         * @event module:ol/Collection.CollectionEvent#add
         * @api
         */
        ADD: 'add',
        /**
         * Triggered when an item is removed from the collection.
         * @event module:ol/Collection.CollectionEvent#remove
         * @api
         */
        REMOVE: 'remove',
    };

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @enum {string}
     * @private
     */
    var Property = {
        LENGTH: 'length',
    };
    /**
     * @classdesc
     * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
     * type.
     */
    var CollectionEvent = /** @class */ (function (_super) {
        __extends$4(CollectionEvent, _super);
        /**
         * @param {import("./CollectionEventType.js").default} type Type.
         * @param {*} [opt_element] Element.
         * @param {number} [opt_index] The index of the added or removed element.
         */
        function CollectionEvent(type, opt_element, opt_index) {
            var _this = _super.call(this, type) || this;
            /**
             * The element that is added to or removed from the collection.
             * @type {*}
             * @api
             */
            _this.element = opt_element;
            /**
             * The index of the added or removed element.
             * @type {number}
             * @api
             */
            _this.index = opt_index;
            return _this;
        }
        return CollectionEvent;
    }(BaseEvent));
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:length', import("./Object").ObjectEvent, Return> &
     *   import("./Observable").OnSignature<'add'|'remove', CollectionEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types|
     *     'change:length'|'add'|'remove',Return>} CollectionOnSignature
     */
    /**
     * @typedef {Object} Options
     * @property {boolean} [unique=false] Disallow the same item from being added to
     * the collection twice.
     */
    /**
     * @classdesc
     * An expanded version of standard JS Array, adding convenience methods for
     * manipulation. Add and remove changes to the Collection trigger a Collection
     * event. Note that this does not cover changes to the objects _within_ the
     * Collection; they trigger events on the appropriate object, not on the
     * Collection as a whole.
     *
     * @fires CollectionEvent
     *
     * @template T
     * @api
     */
    var Collection = /** @class */ (function (_super) {
        __extends$4(Collection, _super);
        /**
         * @param {Array<T>} [opt_array] Array.
         * @param {Options} [opt_options] Collection options.
         */
        function Collection(opt_array, opt_options) {
            var _this = _super.call(this) || this;
            /***
             * @type {CollectionOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {CollectionOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {CollectionOnSignature<void>}
             */
            _this.un;
            var options = opt_options || {};
            /**
             * @private
             * @type {boolean}
             */
            _this.unique_ = !!options.unique;
            /**
             * @private
             * @type {!Array<T>}
             */
            _this.array_ = opt_array ? opt_array : [];
            if (_this.unique_) {
                for (var i = 0, ii = _this.array_.length; i < ii; ++i) {
                    _this.assertUnique_(_this.array_[i], i);
                }
            }
            _this.updateLength_();
            return _this;
        }
        /**
         * Remove all elements from the collection.
         * @api
         */
        Collection.prototype.clear = function () {
            while (this.getLength() > 0) {
                this.pop();
            }
        };
        /**
         * Add elements to the collection.  This pushes each item in the provided array
         * to the end of the collection.
         * @param {!Array<T>} arr Array.
         * @return {Collection<T>} This collection.
         * @api
         */
        Collection.prototype.extend = function (arr) {
            for (var i = 0, ii = arr.length; i < ii; ++i) {
                this.push(arr[i]);
            }
            return this;
        };
        /**
         * Iterate over each element, calling the provided callback.
         * @param {function(T, number, Array<T>): *} f The function to call
         *     for every element. This function takes 3 arguments (the element, the
         *     index and the array). The return value is ignored.
         * @api
         */
        Collection.prototype.forEach = function (f) {
            var array = this.array_;
            for (var i = 0, ii = array.length; i < ii; ++i) {
                f(array[i], i, array);
            }
        };
        /**
         * Get a reference to the underlying Array object. Warning: if the array
         * is mutated, no events will be dispatched by the collection, and the
         * collection's "length" property won't be in sync with the actual length
         * of the array.
         * @return {!Array<T>} Array.
         * @api
         */
        Collection.prototype.getArray = function () {
            return this.array_;
        };
        /**
         * Get the element at the provided index.
         * @param {number} index Index.
         * @return {T} Element.
         * @api
         */
        Collection.prototype.item = function (index) {
            return this.array_[index];
        };
        /**
         * Get the length of this collection.
         * @return {number} The length of the array.
         * @observable
         * @api
         */
        Collection.prototype.getLength = function () {
            return this.get(Property.LENGTH);
        };
        /**
         * Insert an element at the provided index.
         * @param {number} index Index.
         * @param {T} elem Element.
         * @api
         */
        Collection.prototype.insertAt = function (index, elem) {
            if (this.unique_) {
                this.assertUnique_(elem);
            }
            this.array_.splice(index, 0, elem);
            this.updateLength_();
            this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
        };
        /**
         * Remove the last element of the collection and return it.
         * Return `undefined` if the collection is empty.
         * @return {T|undefined} Element.
         * @api
         */
        Collection.prototype.pop = function () {
            return this.removeAt(this.getLength() - 1);
        };
        /**
         * Insert the provided element at the end of the collection.
         * @param {T} elem Element.
         * @return {number} New length of the collection.
         * @api
         */
        Collection.prototype.push = function (elem) {
            if (this.unique_) {
                this.assertUnique_(elem);
            }
            var n = this.getLength();
            this.insertAt(n, elem);
            return this.getLength();
        };
        /**
         * Remove the first occurrence of an element from the collection.
         * @param {T} elem Element.
         * @return {T|undefined} The removed element or undefined if none found.
         * @api
         */
        Collection.prototype.remove = function (elem) {
            var arr = this.array_;
            for (var i = 0, ii = arr.length; i < ii; ++i) {
                if (arr[i] === elem) {
                    return this.removeAt(i);
                }
            }
            return undefined;
        };
        /**
         * Remove the element at the provided index and return it.
         * Return `undefined` if the collection does not contain this index.
         * @param {number} index Index.
         * @return {T|undefined} Value.
         * @api
         */
        Collection.prototype.removeAt = function (index) {
            var prev = this.array_[index];
            this.array_.splice(index, 1);
            this.updateLength_();
            this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
            return prev;
        };
        /**
         * Set the element at the provided index.
         * @param {number} index Index.
         * @param {T} elem Element.
         * @api
         */
        Collection.prototype.setAt = function (index, elem) {
            var n = this.getLength();
            if (index < n) {
                if (this.unique_) {
                    this.assertUnique_(elem, index);
                }
                var prev = this.array_[index];
                this.array_[index] = elem;
                this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
                this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
            }
            else {
                for (var j = n; j < index; ++j) {
                    this.insertAt(j, undefined);
                }
                this.insertAt(index, elem);
            }
        };
        /**
         * @private
         */
        Collection.prototype.updateLength_ = function () {
            this.set(Property.LENGTH, this.array_.length);
        };
        /**
         * @private
         * @param {T} elem Element.
         * @param {number} [opt_except] Optional index to ignore.
         */
        Collection.prototype.assertUnique_ = function (elem, opt_except) {
            for (var i = 0, ii = this.array_.length; i < ii; ++i) {
                if (this.array_[i] === elem && i !== opt_except) {
                    throw new AssertionError(58);
                }
            }
        };
        return Collection;
    }(BaseObject));

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

    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {typeof Feature|typeof import("./render/Feature.js").default} FeatureClass
     */
    /**
     * @typedef {Feature<import("./geom/Geometry.js").default>|import("./render/Feature.js").default} FeatureLike
     */
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:geometry', import("./Object").ObjectEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types
     *     |'change:geometry', Return>} FeatureOnSignature
     */
    /***
     * @template Geometry
     * @typedef {Object<string, *> & { geometry?: Geometry }} ObjectWithGeometry
     */
    /**
     * @classdesc
     * A vector object for geographic features with a geometry and other
     * attribute properties, similar to the features in vector file formats like
     * GeoJSON.
     *
     * Features can be styled individually with `setStyle`; otherwise they use the
     * style of their vector layer.
     *
     * Note that attribute properties are set as {@link module:ol/Object} properties on
     * the feature object, so they are observable, and have get/set accessors.
     *
     * Typically, a feature has a single geometry property. You can set the
     * geometry using the `setGeometry` method and get it with `getGeometry`.
     * It is possible to store more than one geometry on a feature using attribute
     * properties. By default, the geometry used for rendering is identified by
     * the property name `geometry`. If you want to use another geometry property
     * for rendering, use the `setGeometryName` method to change the attribute
     * property associated with the geometry for the feature.  For example:
     *
     * ```js
     *
     * import Feature from 'ol/Feature';
     * import Polygon from 'ol/geom/Polygon';
     * import Point from 'ol/geom/Point';
     *
     * var feature = new Feature({
     *   geometry: new Polygon(polyCoords),
     *   labelPoint: new Point(labelCoords),
     *   name: 'My Polygon'
     * });
     *
     * // get the polygon geometry
     * var poly = feature.getGeometry();
     *
     * // Render the feature as a point using the coordinates from labelPoint
     * feature.setGeometryName('labelPoint');
     *
     * // get the point geometry
     * var point = feature.getGeometry();
     * ```
     *
     * @api
     * @template {import("./geom/Geometry.js").default} Geometry
     */
    var Feature = /** @class */ (function (_super) {
        __extends$5(Feature, _super);
        /**
         * @param {Geometry|ObjectWithGeometry<Geometry>} [opt_geometryOrProperties]
         *     You may pass a Geometry object directly, or an object literal containing
         *     properties. If you pass an object literal, you may include a Geometry
         *     associated with a `geometry` key.
         */
        function Feature(opt_geometryOrProperties) {
            var _this = _super.call(this) || this;
            /***
             * @type {FeatureOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {FeatureOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {FeatureOnSignature<void>}
             */
            _this.un;
            /**
             * @private
             * @type {number|string|undefined}
             */
            _this.id_ = undefined;
            /**
             * @type {string}
             * @private
             */
            _this.geometryName_ = 'geometry';
            /**
             * User provided style.
             * @private
             * @type {import("./style/Style.js").StyleLike}
             */
            _this.style_ = null;
            /**
             * @private
             * @type {import("./style/Style.js").StyleFunction|undefined}
             */
            _this.styleFunction_ = undefined;
            /**
             * @private
             * @type {?import("./events.js").EventsKey}
             */
            _this.geometryChangeKey_ = null;
            _this.addChangeListener(_this.geometryName_, _this.handleGeometryChanged_);
            if (opt_geometryOrProperties) {
                if (typeof (
                /** @type {?} */ (opt_geometryOrProperties).getSimplifiedGeometry) === 'function') {
                    var geometry = /** @type {Geometry} */ (opt_geometryOrProperties);
                    _this.setGeometry(geometry);
                }
                else {
                    /** @type {Object<string, *>} */
                    var properties = opt_geometryOrProperties;
                    _this.setProperties(properties);
                }
            }
            return _this;
        }
        /**
         * Clone this feature. If the original feature has a geometry it
         * is also cloned. The feature id is not set in the clone.
         * @return {Feature<Geometry>} The clone.
         * @api
         */
        Feature.prototype.clone = function () {
            var clone = /** @type {Feature<Geometry>} */ (new Feature(this.hasProperties() ? this.getProperties() : null));
            clone.setGeometryName(this.getGeometryName());
            var geometry = this.getGeometry();
            if (geometry) {
                clone.setGeometry(/** @type {Geometry} */ (geometry.clone()));
            }
            var style = this.getStyle();
            if (style) {
                clone.setStyle(style);
            }
            return clone;
        };
        /**
         * Get the feature's default geometry.  A feature may have any number of named
         * geometries.  The "default" geometry (the one that is rendered by default) is
         * set when calling {@link module:ol/Feature~Feature#setGeometry}.
         * @return {Geometry|undefined} The default geometry for the feature.
         * @api
         * @observable
         */
        Feature.prototype.getGeometry = function () {
            return /** @type {Geometry|undefined} */ (this.get(this.geometryName_));
        };
        /**
         * Get the feature identifier.  This is a stable identifier for the feature and
         * is either set when reading data from a remote source or set explicitly by
         * calling {@link module:ol/Feature~Feature#setId}.
         * @return {number|string|undefined} Id.
         * @api
         */
        Feature.prototype.getId = function () {
            return this.id_;
        };
        /**
         * Get the name of the feature's default geometry.  By default, the default
         * geometry is named `geometry`.
         * @return {string} Get the property name associated with the default geometry
         *     for this feature.
         * @api
         */
        Feature.prototype.getGeometryName = function () {
            return this.geometryName_;
        };
        /**
         * Get the feature's style. Will return what was provided to the
         * {@link module:ol/Feature~Feature#setStyle} method.
         * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
         * @api
         */
        Feature.prototype.getStyle = function () {
            return this.style_;
        };
        /**
         * Get the feature's style function.
         * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
         * representing the current style of this feature.
         * @api
         */
        Feature.prototype.getStyleFunction = function () {
            return this.styleFunction_;
        };
        /**
         * @private
         */
        Feature.prototype.handleGeometryChange_ = function () {
            this.changed();
        };
        /**
         * @private
         */
        Feature.prototype.handleGeometryChanged_ = function () {
            if (this.geometryChangeKey_) {
                unlistenByKey(this.geometryChangeKey_);
                this.geometryChangeKey_ = null;
            }
            var geometry = this.getGeometry();
            if (geometry) {
                this.geometryChangeKey_ = listen(geometry, EventType.CHANGE, this.handleGeometryChange_, this);
            }
            this.changed();
        };
        /**
         * Set the default geometry for the feature.  This will update the property
         * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
         * @param {Geometry|undefined} geometry The new geometry.
         * @api
         * @observable
         */
        Feature.prototype.setGeometry = function (geometry) {
            this.set(this.geometryName_, geometry);
        };
        /**
         * Set the style for the feature to override the layer style.  This can be a
         * single style object, an array of styles, or a function that takes a
         * resolution and returns an array of styles. To unset the feature style, call
         * `setStyle()` without arguments or a falsey value.
         * @param {import("./style/Style.js").StyleLike} [opt_style] Style for this feature.
         * @api
         * @fires module:ol/events/Event~BaseEvent#event:change
         */
        Feature.prototype.setStyle = function (opt_style) {
            this.style_ = opt_style;
            this.styleFunction_ = !opt_style
                ? undefined
                : createStyleFunction(opt_style);
            this.changed();
        };
        /**
         * Set the feature id.  The feature id is considered stable and may be used when
         * requesting features or comparing identifiers returned from a remote source.
         * The feature id can be used with the
         * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
         * @param {number|string|undefined} id The feature id.
         * @api
         * @fires module:ol/events/Event~BaseEvent#event:change
         */
        Feature.prototype.setId = function (id) {
            this.id_ = id;
            this.changed();
        };
        /**
         * Set the property name to be used when getting the feature's default geometry.
         * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
         * this name will be returned.
         * @param {string} name The property name of the default geometry.
         * @api
         */
        Feature.prototype.setGeometryName = function (name) {
            this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
            this.geometryName_ = name;
            this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
            this.handleGeometryChanged_();
        };
        return Feature;
    }(BaseObject));
    /**
     * Convert the provided object into a feature style function.  Functions passed
     * through unchanged.  Arrays of Style or single style objects wrapped
     * in a new feature style function.
     * @param {!import("./style/Style.js").StyleFunction|!Array<import("./style/Style.js").default>|!import("./style/Style.js").default} obj
     *     A feature style function, a single style, or an array of styles.
     * @return {import("./style/Style.js").StyleFunction} A style function.
     */
    function createStyleFunction(obj) {
        if (typeof obj === 'function') {
            return obj;
        }
        else {
            /**
             * @type {Array<import("./style/Style.js").default>}
             */
            var styles_1;
            if (Array.isArray(obj)) {
                styles_1 = obj;
            }
            else {
                assert(typeof ( /** @type {?} */(obj).getZIndex) === 'function', 41); // Expected an `import("./style/Style.js").Style` or an array of `import("./style/Style.js").Style`
                var style = /** @type {import("./style/Style.js").default} */ (obj);
                styles_1 = [style];
            }
            return function () {
                return styles_1;
            };
        }
    }

    /**
     * @module ol/extent
     */
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
     * Get the current computed width for the given element including margin,
     * padding and border.
     * Equivalent to jQuery's `$(el).outerWidth(true)`.
     * @param {!HTMLElement} element Element.
     * @return {number} The width.
     */
    function outerWidth(element) {
        var width = element.offsetWidth;
        var style = getComputedStyle(element);
        width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
        return width;
    }
    /**
     * Get the current computed height for the given element including margin,
     * padding and border.
     * Equivalent to jQuery's `$(el).outerHeight(true)`.
     * @param {!HTMLElement} element Element.
     * @return {number} The height.
     */
    function outerHeight(element) {
        var height = element.offsetHeight;
        var style = getComputedStyle(element);
        height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
        return height;
    }
    /**
     * @param {Node} node The node to remove.
     * @return {Node} The node that was removed or null.
     */
    function removeNode(node) {
        return node && node.parentNode ? node.parentNode.removeChild(node) : null;
    }
    /**
     * @param {Node} node The node to remove the children from.
     */
    function removeChildren(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }

    /**
     * @module ol/css
     */
    /**
     * The CSS class that we'll give the DOM elements to have them selectable.
     *
     * @const
     * @type {string}
     */
    var CLASS_SELECTABLE = 'ol-selectable';

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
    /***
     * @typedef {'postrender'|'movestart'|'moveend'} Types
     */

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

    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {Object} Options
     * @property {number|string} [id] Set the overlay id. The overlay id can be used
     * with the {@link module:ol/Map~Map#getOverlayById} method.
     * @property {HTMLElement} [element] The overlay element.
     * @property {Array<number>} [offset=[0, 0]] Offsets in pixels used when positioning
     * the overlay. The first element in the
     * array is the horizontal offset. A positive value shifts the overlay right.
     * The second element in the array is the vertical offset. A positive value
     * shifts the overlay down.
     * @property {import("./coordinate.js").Coordinate} [position] The overlay position
     * in map projection.
     * @property {import("./OverlayPositioning.js").default} [positioning='top-left'] Defines how
     * the overlay is actually positioned with respect to its `position` property.
     * Possible values are `'bottom-left'`, `'bottom-center'`, `'bottom-right'`,
     * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
     * `'top-center'`, and `'top-right'`.
     * @property {boolean} [stopEvent=true] Whether event propagation to the map
     * viewport should be stopped. If `true` the overlay is placed in the same
     * container as that of the controls (CSS class name
     * `ol-overlaycontainer-stopevent`); if `false` it is placed in the container
     * with CSS class name specified by the `className` property.
     * @property {boolean} [insertFirst=true] Whether the overlay is inserted first
     * in the overlay container, or appended. If the overlay is placed in the same
     * container as that of the controls (see the `stopEvent` option) you will
     * probably set `insertFirst` to `true` so the overlay is displayed below the
     * controls.
     * @property {PanIntoViewOptions|boolean} [autoPan=false] Pan the map when calling
     * `setPosition`, so that the overlay is entirely visible in the current viewport?
     * If `true` (deprecated), then `autoPanAnimation` and `autoPanMargin` will be
     * used to determine the panning parameters; if an object is supplied then other
     * parameters are ignored.
     * @property {PanOptions} [autoPanAnimation] The animation options used to pan
     * the overlay into view. This animation is only used when `autoPan` is enabled.
     * A `duration` and `easing` may be provided to customize the animation.
     * Deprecated and ignored if `autoPan` is supplied as an object.
     * @property {number} [autoPanMargin=20] The margin (in pixels) between the
     * overlay and the borders of the map when autopanning. Deprecated and ignored
     * if `autoPan` is supplied as an object.
     * @property {PanIntoViewOptions} [autoPanOptions] The options to use for the
     * autoPan. This is only used when `autoPan` is enabled and has preference over
     * the individual `autoPanMargin` and `autoPanOptions`.
     * @property {string} [className='ol-overlay-container ol-selectable'] CSS class
     * name.
     */
    /**
     * @typedef {Object} PanOptions
     * @property {number} [duration=1000] The duration of the animation in
     * milliseconds.
     * @property {function(number):number} [easing] The easing function to use. Can
     * be one from {@link module:ol/easing} or a custom function.
     * Default is {@link module:ol/easing.inAndOut}.
     */
    /**
     * @typedef {Object} PanIntoViewOptions
     * @property {PanOptions} [animation={}] The animation parameters for the pan
     * @property {number} [margin=20] The margin (in pixels) between the
     * overlay and the borders of the map when panning into view.
     */
    /**
     * @enum {string}
     * @protected
     */
    var Property$1 = {
        ELEMENT: 'element',
        MAP: 'map',
        OFFSET: 'offset',
        POSITION: 'position',
        POSITIONING: 'positioning',
    };
    /**
     * @typedef {import("./ObjectEventType").Types|'change:element'|'change:map'|'change:offset'|'change:position'|
     *   'change:positioning'} OverlayObjectEventTypes
     */
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<OverlayObjectEventTypes, import("./Object").ObjectEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|OverlayObjectEventTypes, Return>} OverlayOnSignature
     */
    /**
     * @classdesc
     * An element to be displayed over the map and attached to a single map
     * location.  Like {@link module:ol/control/Control~Control}, Overlays are
     * visible widgets. Unlike Controls, they are not in a fixed position on the
     * screen, but are tied to a geographical coordinate, so panning the map will
     * move an Overlay but not a Control.
     *
     * Example:
     *
     *     import Overlay from 'ol/Overlay';
     *
     *     var popup = new Overlay({
     *       element: document.getElementById('popup')
     *     });
     *     popup.setPosition(coordinate);
     *     map.addOverlay(popup);
     *
     * @api
     */
    var Overlay = /** @class */ (function (_super) {
        __extends$6(Overlay, _super);
        /**
         * @param {Options} options Overlay options.
         */
        function Overlay(options) {
            var _this = _super.call(this) || this;
            /***
             * @type {OverlayOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {OverlayOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {OverlayOnSignature<void>}
             */
            _this.un;
            /**
             * @protected
             * @type {Options}
             */
            _this.options = options;
            /**
             * @protected
             * @type {number|string|undefined}
             */
            _this.id = options.id;
            /**
             * @protected
             * @type {boolean}
             */
            _this.insertFirst =
                options.insertFirst !== undefined ? options.insertFirst : true;
            /**
             * @protected
             * @type {boolean}
             */
            _this.stopEvent = options.stopEvent !== undefined ? options.stopEvent : true;
            /**
             * @protected
             * @type {HTMLElement}
             */
            _this.element = document.createElement('div');
            _this.element.className =
                options.className !== undefined
                    ? options.className
                    : 'ol-overlay-container ' + CLASS_SELECTABLE;
            _this.element.style.position = 'absolute';
            _this.element.style.pointerEvents = 'auto';
            var autoPan = options.autoPan;
            if (autoPan && 'object' !== typeof autoPan) {
                autoPan = {
                    animation: options.autoPanAnimation,
                    margin: options.autoPanMargin,
                };
            }
            /**
             * @protected
             * @type {PanIntoViewOptions|false}
             */
            _this.autoPan = /** @type {PanIntoViewOptions} */ (autoPan) || false;
            /**
             * @protected
             * @type {{transform_: string,
             *         visible: boolean}}
             */
            _this.rendered = {
                transform_: '',
                visible: true,
            };
            /**
             * @protected
             * @type {?import("./events.js").EventsKey}
             */
            _this.mapPostrenderListenerKey = null;
            _this.addChangeListener(Property$1.ELEMENT, _this.handleElementChanged);
            _this.addChangeListener(Property$1.MAP, _this.handleMapChanged);
            _this.addChangeListener(Property$1.OFFSET, _this.handleOffsetChanged);
            _this.addChangeListener(Property$1.POSITION, _this.handlePositionChanged);
            _this.addChangeListener(Property$1.POSITIONING, _this.handlePositioningChanged);
            if (options.element !== undefined) {
                _this.setElement(options.element);
            }
            _this.setOffset(options.offset !== undefined ? options.offset : [0, 0]);
            _this.setPositioning(options.positioning !== undefined
                ? /** @type {import("./OverlayPositioning.js").default} */ (options.positioning)
                : OverlayPositioning.TOP_LEFT);
            if (options.position !== undefined) {
                _this.setPosition(options.position);
            }
            return _this;
        }
        /**
         * Get the DOM element of this overlay.
         * @return {HTMLElement|undefined} The Element containing the overlay.
         * @observable
         * @api
         */
        Overlay.prototype.getElement = function () {
            return /** @type {HTMLElement|undefined} */ (this.get(Property$1.ELEMENT));
        };
        /**
         * Get the overlay identifier which is set on constructor.
         * @return {number|string|undefined} Id.
         * @api
         */
        Overlay.prototype.getId = function () {
            return this.id;
        };
        /**
         * Get the map associated with this overlay.
         * @return {import("./PluggableMap.js").default|undefined} The map that the
         * overlay is part of.
         * @observable
         * @api
         */
        Overlay.prototype.getMap = function () {
            return /** @type {import("./PluggableMap.js").default|undefined} */ (this.get(Property$1.MAP));
        };
        /**
         * Get the offset of this overlay.
         * @return {Array<number>} The offset.
         * @observable
         * @api
         */
        Overlay.prototype.getOffset = function () {
            return /** @type {Array<number>} */ (this.get(Property$1.OFFSET));
        };
        /**
         * Get the current position of this overlay.
         * @return {import("./coordinate.js").Coordinate|undefined} The spatial point that the overlay is
         *     anchored at.
         * @observable
         * @api
         */
        Overlay.prototype.getPosition = function () {
            return /** @type {import("./coordinate.js").Coordinate|undefined} */ (this.get(Property$1.POSITION));
        };
        /**
         * Get the current positioning of this overlay.
         * @return {import("./OverlayPositioning.js").default} How the overlay is positioned
         *     relative to its point on the map.
         * @observable
         * @api
         */
        Overlay.prototype.getPositioning = function () {
            return /** @type {import("./OverlayPositioning.js").default} */ (this.get(Property$1.POSITIONING));
        };
        /**
         * @protected
         */
        Overlay.prototype.handleElementChanged = function () {
            removeChildren(this.element);
            var element = this.getElement();
            if (element) {
                this.element.appendChild(element);
            }
        };
        /**
         * @protected
         */
        Overlay.prototype.handleMapChanged = function () {
            if (this.mapPostrenderListenerKey) {
                removeNode(this.element);
                unlistenByKey(this.mapPostrenderListenerKey);
                this.mapPostrenderListenerKey = null;
            }
            var map = this.getMap();
            if (map) {
                this.mapPostrenderListenerKey = listen(map, MapEventType.POSTRENDER, this.render, this);
                this.updatePixelPosition();
                var container = this.stopEvent
                    ? map.getOverlayContainerStopEvent()
                    : map.getOverlayContainer();
                if (this.insertFirst) {
                    container.insertBefore(this.element, container.childNodes[0] || null);
                }
                else {
                    container.appendChild(this.element);
                }
                this.performAutoPan();
            }
        };
        /**
         * @protected
         */
        Overlay.prototype.render = function () {
            this.updatePixelPosition();
        };
        /**
         * @protected
         */
        Overlay.prototype.handleOffsetChanged = function () {
            this.updatePixelPosition();
        };
        /**
         * @protected
         */
        Overlay.prototype.handlePositionChanged = function () {
            this.updatePixelPosition();
            this.performAutoPan();
        };
        /**
         * @protected
         */
        Overlay.prototype.handlePositioningChanged = function () {
            this.updatePixelPosition();
        };
        /**
         * Set the DOM element to be associated with this overlay.
         * @param {HTMLElement|undefined} element The Element containing the overlay.
         * @observable
         * @api
         */
        Overlay.prototype.setElement = function (element) {
            this.set(Property$1.ELEMENT, element);
        };
        /**
         * Set the map to be associated with this overlay.
         * @param {import("./PluggableMap.js").default|undefined} map The map that the
         * overlay is part of.
         * @observable
         * @api
         */
        Overlay.prototype.setMap = function (map) {
            this.set(Property$1.MAP, map);
        };
        /**
         * Set the offset for this overlay.
         * @param {Array<number>} offset Offset.
         * @observable
         * @api
         */
        Overlay.prototype.setOffset = function (offset) {
            this.set(Property$1.OFFSET, offset);
        };
        /**
         * Set the position for this overlay. If the position is `undefined` the
         * overlay is hidden.
         * @param {import("./coordinate.js").Coordinate|undefined} position The spatial point that the overlay
         *     is anchored at.
         * @observable
         * @api
         */
        Overlay.prototype.setPosition = function (position) {
            this.set(Property$1.POSITION, position);
        };
        /**
         * Pan the map so that the overlay is entirely visible in the current viewport
         * (if necessary) using the configured autoPan parameters
         * @protected
         */
        Overlay.prototype.performAutoPan = function () {
            if (this.autoPan) {
                this.panIntoView(this.autoPan);
            }
        };
        /**
         * Pan the map so that the overlay is entirely visible in the current viewport
         * (if necessary).
         * @param {PanIntoViewOptions} [opt_panIntoViewOptions] Options for the pan action
         * @api
         */
        Overlay.prototype.panIntoView = function (opt_panIntoViewOptions) {
            var map = this.getMap();
            if (!map || !map.getTargetElement() || !this.get(Property$1.POSITION)) {
                return;
            }
            var mapRect = this.getRect(map.getTargetElement(), map.getSize());
            var element = this.getElement();
            var overlayRect = this.getRect(element, [
                outerWidth(element),
                outerHeight(element),
            ]);
            var panIntoViewOptions = opt_panIntoViewOptions || {};
            var myMargin = panIntoViewOptions.margin === undefined ? 20 : panIntoViewOptions.margin;
            if (!containsExtent(mapRect, overlayRect)) {
                // the overlay is not completely inside the viewport, so pan the map
                var offsetLeft = overlayRect[0] - mapRect[0];
                var offsetRight = mapRect[2] - overlayRect[2];
                var offsetTop = overlayRect[1] - mapRect[1];
                var offsetBottom = mapRect[3] - overlayRect[3];
                var delta = [0, 0];
                if (offsetLeft < 0) {
                    // move map to the left
                    delta[0] = offsetLeft - myMargin;
                }
                else if (offsetRight < 0) {
                    // move map to the right
                    delta[0] = Math.abs(offsetRight) + myMargin;
                }
                if (offsetTop < 0) {
                    // move map up
                    delta[1] = offsetTop - myMargin;
                }
                else if (offsetBottom < 0) {
                    // move map down
                    delta[1] = Math.abs(offsetBottom) + myMargin;
                }
                if (delta[0] !== 0 || delta[1] !== 0) {
                    var center = /** @type {import("./coordinate.js").Coordinate} */ (map.getView().getCenterInternal());
                    var centerPx = map.getPixelFromCoordinateInternal(center);
                    if (!centerPx) {
                        return;
                    }
                    var newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];
                    var panOptions = panIntoViewOptions.animation || {};
                    map.getView().animateInternal({
                        center: map.getCoordinateFromPixelInternal(newCenterPx),
                        duration: panOptions.duration,
                        easing: panOptions.easing,
                    });
                }
            }
        };
        /**
         * Get the extent of an element relative to the document
         * @param {HTMLElement} element The element.
         * @param {import("./size.js").Size} size The size of the element.
         * @return {import("./extent.js").Extent} The extent.
         * @protected
         */
        Overlay.prototype.getRect = function (element, size) {
            var box = element.getBoundingClientRect();
            var offsetX = box.left + window.pageXOffset;
            var offsetY = box.top + window.pageYOffset;
            return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
        };
        /**
         * Set the positioning for this overlay.
         * @param {import("./OverlayPositioning.js").default} positioning how the overlay is
         *     positioned relative to its point on the map.
         * @observable
         * @api
         */
        Overlay.prototype.setPositioning = function (positioning) {
            this.set(Property$1.POSITIONING, positioning);
        };
        /**
         * Modify the visibility of the element.
         * @param {boolean} visible Element visibility.
         * @protected
         */
        Overlay.prototype.setVisible = function (visible) {
            if (this.rendered.visible !== visible) {
                this.element.style.display = visible ? '' : 'none';
                this.rendered.visible = visible;
            }
        };
        /**
         * Update pixel position.
         * @protected
         */
        Overlay.prototype.updatePixelPosition = function () {
            var map = this.getMap();
            var position = this.getPosition();
            if (!map || !map.isRendered() || !position) {
                this.setVisible(false);
                return;
            }
            var pixel = map.getPixelFromCoordinate(position);
            var mapSize = map.getSize();
            this.updateRenderedPosition(pixel, mapSize);
        };
        /**
         * @param {import("./pixel.js").Pixel} pixel The pixel location.
         * @param {import("./size.js").Size|undefined} mapSize The map size.
         * @protected
         */
        Overlay.prototype.updateRenderedPosition = function (pixel, mapSize) {
            var style = this.element.style;
            var offset = this.getOffset();
            var positioning = this.getPositioning();
            this.setVisible(true);
            var x = Math.round(pixel[0] + offset[0]) + 'px';
            var y = Math.round(pixel[1] + offset[1]) + 'px';
            var posX = '0%';
            var posY = '0%';
            if (positioning == OverlayPositioning.BOTTOM_RIGHT ||
                positioning == OverlayPositioning.CENTER_RIGHT ||
                positioning == OverlayPositioning.TOP_RIGHT) {
                posX = '-100%';
            }
            else if (positioning == OverlayPositioning.BOTTOM_CENTER ||
                positioning == OverlayPositioning.CENTER_CENTER ||
                positioning == OverlayPositioning.TOP_CENTER) {
                posX = '-50%';
            }
            if (positioning == OverlayPositioning.BOTTOM_LEFT ||
                positioning == OverlayPositioning.BOTTOM_CENTER ||
                positioning == OverlayPositioning.BOTTOM_RIGHT) {
                posY = '-100%';
            }
            else if (positioning == OverlayPositioning.CENTER_LEFT ||
                positioning == OverlayPositioning.CENTER_CENTER ||
                positioning == OverlayPositioning.CENTER_RIGHT) {
                posY = '-50%';
            }
            var transform = "translate(" + posX + ", " + posY + ") translate(" + x + ", " + y + ")";
            if (this.rendered.transform_ != transform) {
                this.rendered.transform_ = transform;
                style.transform = transform;
                // @ts-ignore IE9
                style.msTransform = transform;
            }
        };
        /**
         * returns the options this Overlay has been created with
         * @return {Options} overlay options
         */
        Overlay.prototype.getOptions = function () {
            return this.options;
        };
        return Overlay;
    }(BaseObject));

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
        
    // Alias for removeListener added in NodeJS 10.0
    // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
    EventEmitter.prototype.off = function(type, listener){
        return this.removeListener(type, listener);
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

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(modal);

    var modalVanilla = require$$0.default;

    var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

    var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

    var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

    var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

    var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

    var img$5 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

    var GeometryType;
    (function (GeometryType) {
        GeometryType["Point"] = "Point";
        GeometryType["LineString"] = "LineString";
        GeometryType["LinearRing"] = "LinearRing";
        GeometryType["Polygon"] = "Polygon";
        GeometryType["MultiPoint"] = "MultiPoint";
        GeometryType["MultiLineString"] = "MultiLineString";
        GeometryType["MultiPolygon"] = "MultiPolygon";
        GeometryType["GeometryCollection"] = "GeometryCollection";
        GeometryType["Circle"] = "Circle";
    })(GeometryType || (GeometryType = {}));

    const es = {
        labels: {
            select: 'Seleccionar',
            addElement: 'Modo dibujo',
            editElement: 'Editar elemento',
            save: 'Guardar',
            delete: 'Eliminar',
            cancel: 'Cancelar',
            apply: 'Aplicar cambios',
            upload: 'Subir',
            editMode: 'Modo Edición',
            confirmDelete: '¿Estás seguro de borrar el elemento?',
            geomTypeNotSupported: 'Geometría no compatible con la capa',
            editFields: 'Editar campos',
            editGeom: 'Editar geometría',
            selectDrawType: 'Tipo de geometría para dibujar',
            uploadToLayer: 'Subir archivo a la capa seleccionada',
            uploadFeatures: 'Subida de elementos a la capa',
            validFeatures: 'Válidas',
            invalidFeatures: 'Invalidas',
            loading: 'Cargando...',
            toggleVisibility: 'Cambiar visibilidad de la capa',
            close: 'Cerrar'
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

    const en = {
        labels: {
            select: 'Select',
            addElement: 'Toggle Draw mode',
            editElement: 'Edit feature',
            save: 'Save',
            delete: 'Delete',
            cancel: 'Cancel',
            apply: 'Apply changes',
            upload: 'Upload',
            editMode: 'Edit Mode',
            confirmDelete: 'Are you sure to delete the feature?',
            geomTypeNotSupported: 'Geometry not supported by layer',
            editFields: 'Edit fields',
            editGeom: 'Edit geometry',
            selectDrawType: 'Geometry type to draw',
            uploadToLayer: 'Upload file to selected layer',
            uploadFeatures: 'Uploaded features to layer',
            validFeatures: 'Valid geometries',
            invalidFeatures: 'Invalid',
            loading: 'Loading...',
            toggleVisibility: 'Toggle layer visibility',
            close: 'Close'
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

    var i18n = /*#__PURE__*/Object.freeze({
        __proto__: null,
        es: es,
        en: en
    });

    // https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
    // Axis ordering: latitude/longitude
    const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';
    const DEFAULT_LANGUAGE = 'en';
    const controlElement = document.createElement('div');
    /**
     * Tiny WFST-T client to insert (drawing/uploading), modify and delete
     * features on GeoServers using OpenLayers. Layers with these types
     * of geometries are supported: "GeometryCollection" (in this case, you can
     * choose the geometry type of each element to draw), "Point", "MultiPoint",
     * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
     *
     * @constructor
     * @fires getCapabilities
     * @fires describeFeatureType
     * @fires allDescribeFeatureTypeLoaded
     * @fires getFeature
     * @fires modifystart
     * @fires modifyend
     * @fires drawstart
     * @fires drawend
     * @extends {ol/control/Control~Control}
     * @param opt_options Wfst options, see [Wfst Options](#options) for more details.
     */
    class Wfst extends control.Control {
        constructor(opt_options) {
            super({
                target: null,
                element: controlElement
            });
            // Check if the selected language exists
            this._i18n =
                opt_options.language && opt_options.language in i18n
                    ? i18n[opt_options.language]
                    : i18n[DEFAULT_LANGUAGE];
            if (opt_options.i18n) {
                // Merge custom translations
                this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
            }
            // Default options
            const defaultOptions = {
                geoServerUrl: null,
                geoServerAdvanced: {
                    getCapabilitiesVersion: '1.3.0',
                    getFeatureVersion: '1.0.0',
                    describeFeatureTypeVersion: '1.1.0',
                    lockFeatureVersion: '1.1.0',
                    wfsTransactionVersion: '1.1.0',
                    projection: DEFAULT_GEOSERVER_SRS
                },
                headers: {},
                layers: null,
                evtType: 'singleclick',
                active: true,
                showControl: true,
                useLockFeature: true,
                minZoom: 9,
                language: DEFAULT_LANGUAGE,
                uploadFormats: '.geojson,.json,.kml',
                processUpload: null,
                beforeInsertFeature: null,
                modal: {
                    animateClass: 'fade',
                    animateInClass: 'show',
                    transition: 300,
                    backdropTransition: 150,
                    templates: {
                        dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                        headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.labels.close}"><span aria-hidden="true">×</span></button>`
                    }
                }
            };
            this._options = deepObjectAssign(defaultOptions, opt_options);
            this._mapLayers = [];
            this._countRequests = 0;
            this._isEditModeOn = false;
            // GeoServer
            this._hasLockFeature = false;
            this._hasTransaction = false;
            this._geoServerCapabilities = null;
            this._geoServerData = {};
            // Editing
            this._editedFeatures = new Set();
            this._layerToInsertElements = this._options.layers[0].name; // By default, the first layer is ready to accept new draws
            this._insertFeatures = [];
            this._updateFeatures = [];
            this._deleteFeatures = [];
            // Formats
            this._formatWFS = new format.WFS();
            this._formatGeoJSON = new format.GeoJSON();
            this._formatKml = new format.KML({
                extractStyles: false,
                showPointNames: false
            });
            this._xs = new XMLSerializer();
            this._controlWidgetToolsDiv = controlElement;
            this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
            this._initAsyncOperations();
        }
        /**
         * @private
         */
        _onLoad() {
            this._map = super.getMap();
            this._view = this._map.getView();
            this._viewport = this._map.getViewport();
            // State
            this._isVisible = this._view.getZoom() > this._options.minZoom;
            this._createLayers(this._options.layers);
            this._initMapElements(this._options.showControl, this._options.active);
        }
        /**
         * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
         * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
         *
         * @param layers
         * @param showControl
         * @param active
         * @private
         */
        _initAsyncOperations() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // @ts-expect-error
                    this.on('allDescribeFeatureTypeLoaded', this._onLoad);
                    this._showLoading();
                    yield this._connectToGeoServerAndGetCapabilities();
                    if (this._options.layers) {
                        yield this._getGeoserverLayersData(this._options.layers, this._options.geoServerUrl);
                    }
                }
                catch (err) {
                    this._hideLoading();
                    this._showError(err.message, err);
                }
            });
        }
        /**
         * Get the capabilities from the GeoServer and check
         * all the available operations.
         *
         * @fires capabilitiesLoaded
         * @private
         */
        _connectToGeoServerAndGetCapabilities() {
            const _super = Object.create(null, {
                dispatchEvent: { get: () => super.dispatchEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                /**
                 * @private
                 */
                const getCapabilities = () => __awaiter(this, void 0, void 0, function* () {
                    const params = new URLSearchParams({
                        service: 'wfs',
                        version: this._options.geoServerAdvanced.getCapabilitiesVersion,
                        request: 'GetCapabilities',
                        exceptions: 'application/json'
                    });
                    const url_fetch = this._options.geoServerUrl + '?' + params.toString();
                    try {
                        const response = yield fetch(url_fetch, {
                            headers: this._options.headers
                        });
                        if (!response.ok) {
                            throw new Error('');
                        }
                        const data = yield response.text();
                        const capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
                        return capabilities;
                    }
                    catch (err) {
                        throw new Error(this._i18n.errors.capabilities);
                    }
                });
                this._geoServerCapabilities = yield getCapabilities();
                // Available operations in the geoserver
                const operations = this._geoServerCapabilities.getElementsByTagName('ows:Operation');
                Array.from(operations).forEach((operation) => {
                    if (operation.getAttribute('name') === 'Transaction') {
                        this._hasTransaction = true;
                    }
                    else if (operation.getAttribute('name') === 'LockFeature') {
                        this._hasLockFeature = true;
                    }
                });
                if (!this._hasTransaction) {
                    throw new Error(this._i18n.errors.wfst);
                }
                _super.dispatchEvent.call(this, {
                    type: 'getCapabilities',
                    // @ts-expect-error
                    data: this._geoServerCapabilities
                });
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
            const _super = Object.create(null, {
                dispatchEvent: { get: () => super.dispatchEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                /**
                 *
                 * @param layerName
                 * @fires describeFeatureType
                 * @fires allDescribeFeatureTypeLoaded
                 * @returns
                 */
                const getLayerData = (layerName) => __awaiter(this, void 0, void 0, function* () {
                    const params = new URLSearchParams({
                        service: 'wfs',
                        version: this._options.geoServerAdvanced
                            .describeFeatureTypeVersion,
                        request: 'DescribeFeatureType',
                        typeName: layerName,
                        outputFormat: 'application/json',
                        exceptions: 'application/json'
                    });
                    const url_fetch = geoServerUrl + '?' + params.toString();
                    const response = yield fetch(url_fetch, {
                        headers: this._options.headers
                    });
                    if (!response.ok) {
                        throw new Error('');
                    }
                    return yield response.json();
                });
                for (const layer of layers) {
                    const layerName = layer.name;
                    const layerLabel = layer.label || layerName;
                    try {
                        const data = yield getLayerData(layerName);
                        if (!data) {
                            throw new Error('');
                        }
                        _super.dispatchEvent.call(this, {
                            type: 'describeFeatureType',
                            // @ts-expect-error
                            layer: layerName,
                            data: data
                        });
                        const targetNamespace = data.targetNamespace;
                        const properties = data.featureTypes[0].properties;
                        // Find the geometry field
                        const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);
                        this._geoServerData[layerName] = {
                            namespace: targetNamespace,
                            properties: properties,
                            geomType: geom.localType,
                            geomField: geom.name
                        };
                    }
                    catch (err) {
                        throw new Error(`${this._i18n.errors.layer} "${layerLabel}"`);
                    }
                }
                _super.dispatchEvent.call(this, {
                    type: 'allDescribeFeatureTypeLoaded',
                    // @ts-expect-error
                    data: this._geoServerData
                });
            });
        }
        /**
         * Create map layers in wfs o wms modes.
         *
         * @param layers
         * @private
         */
        _createLayers(layers) {
            let layerLoaded = 0;
            let layersNumber = 0; // Only count visibles
            /**
             * When all the data is loaded, hide the loading
             * @private
             */
            const addLayerLoaded = () => {
                layerLoaded++;
                if (layerLoaded >= layersNumber) {
                    this._hideLoading();
                }
            };
            /**
             *
             * @param layerParams
             * @private
             */
            const newWmsLayer = (layerParams) => {
                const layerName = layerParams.name;
                const cqlFilter = layerParams.cqlFilter;
                const buffer = layerParams.tilesBuffer;
                const params = {
                    SERVICE: 'WMS',
                    LAYERS: layerName,
                    TILED: true
                };
                if (cqlFilter) {
                    params['CQL_FILTER'] = cqlFilter;
                }
                if (buffer) {
                    params['BUFFER'] = buffer;
                }
                const source$1 = new source.TileWMS({
                    url: this._options.geoServerUrl,
                    params: params,
                    serverType: 'geoserver',
                    tileLoadFunction: (tile, src) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const response = yield fetch(src, {
                                headers: this._options.headers
                            });
                            if (!response.ok) {
                                throw new Error('');
                            }
                            const data = yield response.blob();
                            if (data !== undefined) {
                                tile.getImage().src = URL.createObjectURL(data);
                            }
                            else {
                                throw new Error('');
                            }
                            tile.setState(TileState.LOADED);
                        }
                        catch (err) {
                            tile.setState(TileState.ERROR);
                        }
                    })
                });
                let loading = 0;
                let loaded = 0;
                source$1.on('tileloadstart', () => {
                    loading++;
                    this._showLoading();
                });
                source$1.on(['tileloadend', 'tileloaderror'], () => {
                    loaded++;
                    setTimeout(() => {
                        if (loading === loaded)
                            addLayerLoaded();
                    }, 300);
                });
                const layer_options = Object.assign({ name: layerName, type: '_wms_', minZoom: this._options.minZoom, source: source$1, visible: true, zIndex: 1 }, layerParams);
                const layer$1 = new layer.Tile(layer_options);
                return layer$1;
            };
            /**
             *
             * @param layerParams
             * @private
             */
            const newWfsLayer = (layerParams) => {
                const layerName = layerParams.name;
                const cqlFilter = layerParams.cqlFilter;
                const strategy = layerParams.wfsStrategy || 'bbox';
                const source$1 = new source.Vector({
                    format: new format.GeoJSON(),
                    strategy: strategy === 'bbox' ? loadingstrategy.bbox : loadingstrategy.all,
                    loader: (extent) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const params = new URLSearchParams({
                                service: 'wfs',
                                version: this._options.geoServerAdvanced
                                    .getFeatureVersion,
                                request: 'GetFeature',
                                typename: layerName,
                                outputFormat: 'application/json',
                                exceptions: 'application/json',
                                srsName: this._options.geoServerAdvanced.projection.toString()
                            });
                            if (cqlFilter) {
                                params.append('cql_filter', cqlFilter);
                            }
                            // If bbox, add extent to the request
                            if (strategy === 'bbox') {
                                const extentGeoServer = proj.transformExtent(extent, this._view.getProjection().getCode(), this._options.geoServerAdvanced.projection);
                                // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                                // request features using a bounding box with CRS maybe different from featureTypes native CRS
                                params.append('bbox', extentGeoServer.toString() +
                                    `,${this._options.geoServerAdvanced.projection}`);
                            }
                            const url_fetch = this._options.geoServerUrl +
                                '?' +
                                params.toString();
                            const response = yield fetch(url_fetch, {
                                headers: this._options.headers
                            });
                            if (!response.ok) {
                                throw new Error('');
                            }
                            const data = yield response.json();
                            this.dispatchEvent({
                                type: 'getFeature',
                                // @ts-expect-error
                                layer: layerName,
                                data: data
                            });
                            const features = source$1.getFormat().readFeatures(data, {
                                featureProjection: this._view
                                    .getProjection()
                                    .getCode(),
                                dataProjection: this._options.geoServerAdvanced
                                    .projection
                            });
                            features.forEach((feature) => {
                                feature.set('_layerName_', layerName, 
                                /* silent = */ true);
                            });
                            source$1.addFeatures(features);
                            source$1.dispatchEvent('featuresloadend');
                        }
                        catch (err) {
                            source$1.dispatchEvent('featuresloaderror');
                            this._showError(this._i18n.errors.geoserver, err);
                            source$1.removeLoadedExtent(extent);
                        }
                    })
                });
                let loading = 0;
                let loaded = 0;
                source$1.on('featuresloadstart', () => {
                    loading++;
                    this._showLoading();
                });
                source$1.on(['featuresloadend', 'featuresloaderror'], () => {
                    loaded++;
                    setTimeout(() => {
                        if (loading === loaded)
                            addLayerLoaded();
                    }, 300);
                });
                const layer_options = Object.assign({ name: layerName, type: '_wfs_', minZoom: this._options.minZoom, source: source$1, visible: true, zIndex: 2 }, layerParams);
                const layer$1 = new layer.Vector(layer_options);
                return layer$1;
            };
            for (const layerParams of layers) {
                const layerName = layerParams.name;
                // Only create the layer if we can get the GeoserverData
                if (this._geoServerData[layerName]) {
                    let layer;
                    const layerParams = this._options.layers.find((e) => e.name === layerName);
                    const mode = layerParams.mode;
                    // If mode is undefined, by default use wfs
                    if (!mode) {
                        layerParams.mode = 'wfs';
                    }
                    if (layerParams.mode === 'wfs') {
                        layer = newWfsLayer(layerParams);
                    }
                    else {
                        layer = newWmsLayer(layerParams);
                    }
                    if (layer.getVisible())
                        layersNumber++;
                    this._map.addLayer(layer);
                    this._mapLayers[layerName] = layer;
                }
            }
        }
        /**
         * Create the edit layer to allow modify elements, add interactions,
         * map controls and keyboard handlers.
         *
         * @param showControl
         * @param active
         * @private
         */
        _initMapElements(showControl, active) {
            return __awaiter(this, void 0, void 0, function* () {
                // VectorLayer to store features on editing and inserting
                this._createEditLayer();
                this._addInteractions();
                this._addHandlers();
                if (showControl) {
                    this._addMapControl();
                }
                // By default, init in edit mode
                this.activateEditMode(active);
            });
        }
        /**
         * @private
         */
        _addInteractions() {
            // Select the wfs feature already downloaded
            const prepareWfsInteraction = () => {
                this._collectionModify = new Collection();
                // Interaction to select wfs layer elements
                this.interactionWfsSelect = new interaction.Select({
                    hitTolerance: 10,
                    style: (feature) => this._styleFunction(feature),
                    toggleCondition: condition.never,
                    filter: (feature, layer) => {
                        return (!this._isEditModeOn &&
                            layer &&
                            layer.get('type') === '_wfs_');
                    }
                });
                this._map.addInteraction(this.interactionWfsSelect);
                this.interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                    const coordinate = mapBrowserEvent.coordinate;
                    if (selected.length) {
                        selected.forEach((feature) => {
                            if (!this._editedFeatures.has(String(feature.getId()))) {
                                // Remove the feature from the original layer
                                const layer = this.interactionWfsSelect.getLayer(feature);
                                layer.getSource().removeFeature(feature);
                                this._addFeatureToEdit(feature, coordinate);
                            }
                        });
                    }
                    if (deselected.length) {
                        if (!this._isEditModeOn) {
                            deselected.forEach((feature) => {
                                // Trigger deselect
                                // This is necessary for those times where two features overlap.
                                this._collectionModify.remove(feature);
                            });
                        }
                    }
                });
            };
            /**
             * Call the geoserver to get the clicked feature
             * @private
             */
            const prepareWmsInteraction = () => {
                // Interaction to allow select features in the edit layer
                this.interactionSelectModify = new interaction.Select({
                    style: (feature) => this._styleFunction(feature),
                    layers: [this._editLayer],
                    toggleCondition: condition.never,
                    removeCondition: () => (this._isEditModeOn ? true : false) // Prevent deselect on clicking outside the feature
                });
                this._map.addInteraction(this.interactionSelectModify);
                this._collectionModify = this.interactionSelectModify.getFeatures();
                const getFeatures = (evt) => __awaiter(this, void 0, void 0, function* () {
                    for (const layerName in this._mapLayers) {
                        const layer = this._mapLayers[layerName];
                        // If layer is hidden or is not a wms, skip
                        if (!layer.getVisible() ||
                            !(layer.get('type') === '_wms_')) {
                            continue;
                        }
                        const coordinate = evt.coordinate;
                        // Si la vista es lejana, disminumos el buffer
                        // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                        // y mejorar la sensibilidad en IOS
                        const buffer = this._view.getZoom() > 10 ? 10 : 5;
                        const source = layer.getSource();
                        // Fallback to support a bad name
                        // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
                        const fallbackOl5 = 'getFeatureInfoUrl' in source
                            ? 'getFeatureInfoUrl'
                            : 'getGetFeatureInfoUrl';
                        const url = source[fallbackOl5](coordinate, this._view.getResolution(), this._view.getProjection().getCode(), {
                            INFO_FORMAT: 'application/json',
                            BUFFER: buffer,
                            FEATURE_COUNT: 1,
                            EXCEPTIONS: 'application/json'
                        });
                        try {
                            const response = yield fetch(url, {
                                headers: this._options.headers
                            });
                            if (!response.ok) {
                                throw new Error(this._i18n.errors.getFeatures +
                                    ' ' +
                                    response.status);
                            }
                            const data = yield response.json();
                            const features = this._formatGeoJSON.readFeatures(data);
                            if (!features.length) {
                                continue;
                            }
                            features.forEach((feature) => this._addFeatureToEdit(feature, coordinate, layerName));
                        }
                        catch (err) {
                            this._showError(err.message, err);
                        }
                    }
                });
                this._keyClickWms = this._map.on(this._options.evtType, (evt) => __awaiter(this, void 0, void 0, function* () {
                    if (this._map.hasFeatureAtPixel(evt.pixel)) {
                        return;
                    }
                    if (!this._isVisible) {
                        return;
                    }
                    // Only get other features if editmode is disabled
                    if (!this._isEditModeOn) {
                        yield getFeatures(evt);
                    }
                }));
            };
            if (this._options.layers.find((layer) => layer.mode === 'wfs')) {
                prepareWfsInteraction();
            }
            if (this._options.layers.find((layer) => layer.mode === 'wms')) {
                prepareWmsInteraction();
            }
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
                    }
                    else {
                        return;
                    }
                },
                features: this._collectionModify,
                condition: (evt) => {
                    return condition.primaryAction(evt) && this._isEditModeOn;
                }
            });
            this._map.addInteraction(this.interactionModify);
            this.interactionSnap = new interaction.Snap({
                source: this._editLayer.getSource()
            });
            this._map.addInteraction(this.interactionSnap);
        }
        /**
         * Layer to store temporary the elements to be edited
         *
         * @private
         */
        _createEditLayer() {
            this._editLayer = new layer.Vector({
                source: new source.Vector(),
                zIndex: 100
            });
            this._map.addLayer(this._editLayer);
        }
        /**
         * Add map handlers
         *
         * @private
         */
        _addHandlers() {
            /**
             * @private
             */
            const keyboardEvents = () => {
                document.addEventListener('keydown', ({ key }) => {
                    const inputFocus = document.querySelector('input:focus');
                    if (inputFocus) {
                        return;
                    }
                    if (key === 'Delete') {
                        const selectedFeatures = this._collectionModify;
                        if (selectedFeatures) {
                            selectedFeatures.forEach((feature) => {
                                this._deleteFeature(feature, true);
                            });
                        }
                    }
                });
            };
            // When a feature is modified, add this to a list.
            // This prevent events fired on select and deselect features that has no changes and should
            // not be updated in the geoserver
            this.interactionModify.on('modifyend', (evt) => {
                const feature = evt.features.item(0);
                this._addFeatureToEditedList(feature);
                super.dispatchEvent(evt);
            });
            this.interactionModify.on('modifystart', (evt) => {
                super.dispatchEvent(evt);
            });
            this._onDeselectFeatureEvent();
            this._onRemoveFeatureEvent();
            /**
             * @private
             */
            const handleZoomEnd = () => {
                if (this._currentZoom > this._options.minZoom) {
                    // Show the layers
                    if (!this._isVisible) {
                        this._isVisible = true;
                    }
                }
                else {
                    // Hide the layer
                    if (this._isVisible) {
                        this._isVisible = false;
                    }
                }
            };
            this._map.on('moveend', () => {
                this._currentZoom = this._view.getZoom();
                if (this._currentZoom !== this._lastZoom) {
                    handleZoomEnd();
                }
                this._lastZoom = this._currentZoom;
            });
            keyboardEvents();
        }
        /**
         * Add the widget on the map to allow change the tools and select active layers
         * @private
         */
        _addMapControl() {
            const createLayersControl = () => {
                const createLayerElements = (layerParams) => {
                    const layerName = layerParams.name;
                    const layerLabel = `<span title="${this._geoServerData[layerName].geomType}">${layerParams.label || layerName}</span>`;
                    const visible = 'visible' in layerParams ? layerParams.visible : true;
                    return `
                <div class="wfst--layer-control 
                    ${visible ? 'ol-wfst--visible-on' : ''}
                    ${layerName === this._layerToInsertElements
                    ? 'ol-wfst--selected-on'
                    : ''}
                    " data-layer="${layerName}">
                    <div class="ol-wfst--tools-control-visible">
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on" title="${this._i18n.labels.toggleVisibility}">
                      <img src="${img$4}"/>
                    </span>
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off" title="${this._i18n.labels.toggleVisibility}">
                      <img src="${img$5}"/>
                    </span>
                  </div>
                    <label for="wfst--${layerName}">
                        <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${layerName === this._layerToInsertElements
                    ? 'checked="checked"'
                    : ''}>
                        ${layerLabel}
                    </label>
                </div>`;
                };
                let htmlLayers = '';
                Object.keys(this._mapLayers).map((key) => (htmlLayers += createLayerElements(this._options.layers.find((el) => el.name === key))));
                const selectLayers = document.createElement('div');
                selectLayers.className = 'wfst--tools-control--select-layers';
                selectLayers.innerHTML = htmlLayers;
                // Layer Selector
                const radioInputs = selectLayers.querySelectorAll('input');
                radioInputs.forEach((radioInput) => {
                    const parentDiv = radioInput.closest('.wfst--layer-control');
                    radioInput.onchange = () => {
                        // Deselect DOM previous layer
                        const selected = selectLayers.querySelector('.ol-wfst--selected-on');
                        if (selected)
                            selected.classList.remove('ol-wfst--selected-on');
                        // Select this layer
                        parentDiv.classList.add('ol-wfst--selected-on');
                        this._layerToInsertElements = radioInput.value;
                        this._changeStateSelect(this._layerToInsertElements);
                    };
                });
                // Visibility toggler
                const visibilityBtn = selectLayers.querySelectorAll('.ol-wfst--tools-control-visible-btn');
                visibilityBtn.forEach((btn) => {
                    const parentDiv = btn.closest('.wfst--layer-control');
                    const layerName = parentDiv.dataset['layer'];
                    btn.onclick = () => {
                        parentDiv.classList.toggle('ol-wfst--visible-on');
                        const layer = this._mapLayers[layerName];
                        if (parentDiv.classList.contains('ol-wfst--visible-on')) {
                            layer.setVisible(true);
                        }
                        else {
                            layer.setVisible(false);
                        }
                    };
                });
                return selectLayers;
            };
            const createHeadControl = () => {
                /**
                 * @private
                 */
                const createUploadElements = () => {
                    const container = document.createElement('div');
                    // Upload button Tool
                    const uploadButton = document.createElement('label');
                    uploadButton.className =
                        'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
                    uploadButton.htmlFor = 'ol-wfst--upload';
                    uploadButton.innerHTML = `<img src="${img$3}"/> `;
                    uploadButton.title = this._i18n.labels.uploadToLayer;
                    // Hidden Input form
                    const uploadInput = document.createElement('input');
                    uploadInput.id = 'ol-wfst--upload';
                    uploadInput.type = 'file';
                    uploadInput.accept = this._options.uploadFormats;
                    uploadInput.onchange = (evt) => this._processUploadFile(evt);
                    container.append(uploadInput);
                    container.append(uploadButton);
                    return container;
                };
                const createDrawContainer = () => {
                    const drawContainer = document.createElement('div');
                    drawContainer.className = 'ol-wfst--tools-control-draw-cnt';
                    // Draw Tool
                    const drawButton = document.createElement('button');
                    drawButton.className =
                        'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
                    drawButton.type = 'button';
                    drawButton.innerHTML = `<img src="${img}"/>`;
                    drawButton.title = this._i18n.labels.addElement;
                    drawButton.onclick = () => {
                        if (this._isDrawModeOn) {
                            this._resetStateButtons();
                            this.activateEditMode();
                        }
                        else {
                            this.activateDrawMode(this._layerToInsertElements);
                        }
                    };
                    // Select geom type
                    const select = document.createElement('select');
                    select.title = this._i18n.labels.selectDrawType;
                    select.className = 'wfst--tools-control--select-draw';
                    select.onchange = () => {
                        const selectedValue = select.value;
                        this._changeStateSelect(this._layerToInsertElements, selectedValue);
                        if (this._isDrawModeOn) {
                            this.activateDrawMode(this._layerToInsertElements);
                        }
                    };
                    const types = [
                        GeometryType.Point,
                        GeometryType.MultiPoint,
                        GeometryType.LineString,
                        GeometryType.MultiLineString,
                        GeometryType.Polygon,
                        GeometryType.MultiPolygon,
                        GeometryType.Circle
                    ];
                    for (const type of types) {
                        const option = document.createElement('option');
                        option.value = type;
                        option.text = type;
                        option.selected =
                            this._geoServerData[this._layerToInsertElements]
                                .geomType === type || false;
                        select.appendChild(option);
                    }
                    drawContainer.append(drawButton);
                    drawContainer.append(select);
                    this._selectDraw = select;
                    return drawContainer;
                };
                const subControl = document.createElement('div');
                subControl.className = 'wfst--tools-control--head';
                // Upload section
                if (this._options.showUpload) {
                    const uploadSection = createUploadElements();
                    subControl.append(uploadSection);
                }
                const drawContainer = createDrawContainer();
                subControl.append(drawContainer);
                return subControl;
            };
            const headControl = createHeadControl();
            this._controlWidgetToolsDiv.append(headControl);
            const htmlLayers = createLayersControl();
            this._controlWidgetToolsDiv.append(htmlLayers);
        }
        /**
         * Show Loading modal
         *
         * @private
         */
        _showLoading() {
            if (!this._modalLoading) {
                this._modalLoading = document.createElement('div');
                this._modalLoading.className = 'ol-wfst--tools-control--loading';
                this._modalLoading.innerHTML = this._i18n.labels.loading;
                this._controlWidgetToolsDiv.append(this._modalLoading);
            }
            this._modalLoading.classList.add('ol-wfst--tools-control--loading-show');
        }
        _hideLoading() {
            this._modalLoading.classList.remove('ol-wfst--tools-control--loading-show');
        }
        /**
         * Lock a feature in the geoserver before edit
         *
         * @param featureId
         * @param layerName
         * @param retry
         * @private
         */
        _lockFeature(featureId, layerName, retry = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    service: 'wfs',
                    version: this._options.geoServerAdvanced.lockFeatureVersion,
                    request: 'LockFeature',
                    expiry: String(5),
                    LockId: 'GeoServer',
                    typeName: layerName,
                    releaseAction: 'SOME',
                    exceptions: 'application/json',
                    featureid: `${featureId}`
                });
                const url_fetch = this._options.geoServerUrl + '?' + params.toString();
                try {
                    const response = yield fetch(url_fetch, {
                        headers: this._options.headers
                    });
                    if (!response.ok) {
                        throw new Error(this._i18n.errors.lockFeature);
                    }
                    const data = yield response.text();
                    try {
                        // First, check if is a JSON (with errors)
                        const dataParsed = JSON.parse(data);
                        if ('exceptions' in dataParsed) {
                            const exceptions = dataParsed.exceptions;
                            if (exceptions[0].code === 'CannotLockAllFeatures') {
                                // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                                if (!retry) {
                                    this._lockFeature(featureId, layerName, 1);
                                }
                                else {
                                    this._showError(this._i18n.errors.lockFeature, exceptions);
                                }
                            }
                            else {
                                this._showError(exceptions[0].text, exceptions);
                            }
                        }
                    }
                    catch (err) {
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
                }
                catch (err) {
                    this._showError(err.message, err);
                }
            });
        }
        /**
         * Show modal with errors
         *
         * @param msg
         * @private
         */
        _showError(msg, originalError = null) {
            modalVanilla.alert('Error: ' + msg, Object.assign({}, this._options.modal)).show();
            if (originalError)
                console.error(originalError);
        }
        /**
         * Make the WFS Transactions
         *
         * @param action
         * @param features
         * @param layerName
         * @private
         */
        _transactWFS(action, features, layerName) {
            return __awaiter(this, void 0, void 0, function* () {
                const transformCircleToPolygon = (feature, geom) => {
                    const geomConverted = Polygon.fromCircle(geom);
                    feature.setGeometry(geomConverted);
                };
                const transformGeoemtryCollectionToGeometries = (feature, geom$1) => {
                    let geomConverted = geom$1.getGeometries()[0];
                    if (geomConverted instanceof geom.Circle) {
                        geomConverted = Polygon.fromCircle(geomConverted);
                    }
                    feature.setGeometry(geomConverted);
                };
                features = Array.isArray(features) ? features : [features];
                const cloneFeature = (feature) => {
                    this._removeFeatureFromEditList(feature);
                    const featureProperties = feature.getProperties();
                    delete featureProperties.boundedBy;
                    delete featureProperties._layerName_;
                    const clone = new Feature(featureProperties);
                    clone.setId(feature.getId());
                    return clone;
                };
                const refreshWmsLayer = (layer) => {
                    const source = layer.getSource();
                    // Refrescamos el wms
                    source.refresh();
                    // Force refresh the tiles
                    const params = source.getParams();
                    params.t = new Date().getMilliseconds();
                    source.updateParams(params);
                };
                const refreshWfsLayer = (layer) => {
                    const source = layer.getSource();
                    // Refrescamos el wms
                    source.refresh();
                };
                const clonedFeatures = [];
                for (const feature of features) {
                    let clone = cloneFeature(feature);
                    const cloneGeom = clone.getGeometry();
                    // Ugly fix to support GeometryCollection on GML
                    // See https://github.com/openlayers/openlayers/issues/4220
                    if (cloneGeom instanceof geom.GeometryCollection) {
                        transformGeoemtryCollectionToGeometries(clone, cloneGeom);
                    }
                    else if (cloneGeom instanceof geom.Circle) {
                        // Geoserver has no Support to Circles
                        transformCircleToPolygon(clone, cloneGeom);
                    }
                    if (action === 'insert') {
                        // Filters
                        if (this._options.beforeInsertFeature) {
                            clone = this._options.beforeInsertFeature(clone);
                        }
                    }
                    if (clone) {
                        clonedFeatures.push(clone);
                    }
                }
                if (!clonedFeatures.length) {
                    return this._showError(this._i18n.errors.noValidGeometry);
                }
                switch (action) {
                    case 'insert':
                        this._insertFeatures = [
                            ...this._insertFeatures,
                            ...clonedFeatures
                        ];
                        break;
                    case 'update':
                        this._updateFeatures = [
                            ...this._updateFeatures,
                            ...clonedFeatures
                        ];
                        break;
                    case 'delete':
                        this._deleteFeatures = [
                            ...this._deleteFeatures,
                            ...clonedFeatures
                        ];
                        break;
                }
                this._countRequests++;
                const numberRequest = this._countRequests;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Prevent fire multiples times
                        if (numberRequest !== this._countRequests) {
                            return;
                        }
                        let srs = this._view.getProjection().getCode();
                        // Force latitude/longitude order on transactions
                        // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                        srs = srs === 'EPSG:4326' ? 'urn:x-ogc:def:crs:EPSG:4326' : srs;
                        const options = {
                            featureNS: this._geoServerData[layerName].namespace,
                            featureType: layerName,
                            srsName: srs,
                            featurePrefix: null,
                            nativeElements: null,
                            version: this._options.geoServerAdvanced
                                .wfsTransactionVersion
                        };
                        const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                        let payload = this._xs.serializeToString(transaction);
                        const geomType = this._geoServerData[layerName].geomType;
                        const geomField = this._geoServerData[layerName].geomField;
                        // Ugly fix to support GeometryCollection on GML
                        // See https://github.com/openlayers/openlayers/issues/4220
                        if (geomType === GeometryType.GeometryCollection) {
                            if (action === 'insert') {
                                payload = payload.replace(/<geometry>/g, `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`);
                                payload = payload.replace(/<\/geometry>/g, `</geometryMember></MultiGeometry></geometry>`);
                            }
                            else if (action === 'update') {
                                const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                                const gmemberOut = `</geometryMember></MultiGeometry>`;
                                payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, `$1$2${gmemberIn}$3${gmemberOut}$4$5`);
                            }
                        }
                        // Fixes geometry name, weird bug with GML:
                        // The property for the geometry column is always named "geometry"
                        if (action === 'insert') {
                            payload = payload.replace(/<(\/?)\bgeometry\b>/g, `<$1${geomField}>`);
                        }
                        else {
                            payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                        }
                        // Add default LockId value
                        if (this._hasLockFeature &&
                            this._useLockFeature &&
                            action !== 'insert') {
                            payload = payload.replace(`</Transaction>`, `<LockId>GeoServer</LockId></Transaction>`);
                        }
                        const headers = Object.assign({ 'Content-Type': 'text/xml' }, this._options.headers);
                        const response = yield fetch(this._options.geoServerUrl, {
                            method: 'POST',
                            body: payload,
                            headers: headers
                        });
                        if (!response.ok) {
                            throw new Error(this._i18n.errors.transaction + ' ' + response.status);
                        }
                        const parseResponse = this._formatWFS.readTransactionResponse(response);
                        if (!Object.keys(parseResponse).length) {
                            const responseStr = yield response.text();
                            const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                            if (findError) {
                                this._showError(findError[1]);
                            }
                        }
                        if (action !== 'delete') {
                            for (const feature of features) {
                                this._editLayer.getSource().removeFeature(feature);
                            }
                        }
                        const { mode } = this._options.layers.find((layer) => layer.name === layerName);
                        if (mode === 'wfs') {
                            refreshWfsLayer(this._mapLayers[layerName]);
                        }
                        else if (mode === 'wms') {
                            refreshWmsLayer(this._mapLayers[layerName]);
                        }
                        this._hideLoading();
                    }
                    catch (err) {
                        this._showError(err.message, err);
                    }
                    this._insertFeatures = [];
                    this._updateFeatures = [];
                    this._deleteFeatures = [];
                    this._countRequests = 0;
                }), 0);
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
        _deselectEditFeature(feature) {
            this._removeOverlayHelper(feature);
        }
        /**
         *
         * @param feature
         * @param layerName
         * @private
         */
        _restoreFeatureToLayer(feature, layerName) {
            layerName = layerName || feature.get('_layerName_');
            const layer = this._mapLayers[layerName];
            layer.getSource().addFeature(feature);
        }
        _removeFeatureFromTmpLayer(feature) {
            // Remove element from the Layer
            this._editLayer.getSource().removeFeature(feature);
        }
        /**
         * Trigger on deselecting a feature from in the Edit layer
         *
         * @private
         */
        _onDeselectFeatureEvent() {
            const checkIfFeatureIsChanged = (feature) => {
                const layerName = feature.get('_layerName_');
                const { mode } = this._options.layers.find((layer) => layer.name === layerName);
                if (mode === 'wfs') {
                    this.interactionWfsSelect.getFeatures().remove(feature);
                }
                if (this._isFeatureEdited(feature)) {
                    this._transactWFS('update', feature, layerName);
                }
                else {
                    // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                    if (mode === 'wfs') {
                        this._restoreFeatureToLayer(feature, layerName);
                    }
                    this._removeFeatureFromTmpLayer(feature);
                }
            };
            // This is fired when a feature is deselected and fires the transaction process
            this._keySelect = this._collectionModify.on('remove', (evt) => {
                const feature = evt.element;
                this._deselectEditFeature(feature);
                checkIfFeatureIsChanged(feature);
                this._editModeOff();
            });
        }
        /**
         * Trigger on removing a feature from the Edit layer
         *
         * @private
         */
        _onRemoveFeatureEvent() {
            // If a feature is removed from the edit layer
            this._keyRemove = this._editLayer
                .getSource()
                .on('removefeature', (evt) => {
                const feature = evt.feature;
                if (!feature.get('_delete_')) {
                    return;
                }
                if (this._keySelect) {
                    Observable$1.unByKey(this._keySelect);
                }
                const layerName = feature.get('_layerName_');
                this._transactWFS('delete', feature, layerName);
                this._deselectEditFeature(feature);
                this._editModeOff();
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
            const getVertexs = (feature) => {
                let geometry = feature.getGeometry();
                if (geometry instanceof geom.GeometryCollection) {
                    geometry = geometry.getGeometries()[0];
                }
                const coordinates = geometry.getCoordinates();
                let flatCoordinates = null;
                if (geometry instanceof geom.Polygon ||
                    geometry instanceof geom.MultiLineString) {
                    flatCoordinates = coordinates.flat(1);
                }
                else if (geometry instanceof geom.MultiPolygon) {
                    flatCoordinates = coordinates.flat(2);
                }
                else {
                    flatCoordinates = coordinates;
                }
                if (!flatCoordinates || !flatCoordinates.length) {
                    return;
                }
                return new geom.MultiPoint(flatCoordinates);
            };
            let geometry = feature.getGeometry();
            let type = geometry.getType();
            if (geometry instanceof geom.GeometryCollection) {
                geometry = geometry.getGeometries()[0];
                type = geometry.getType();
            }
            switch (type) {
                case GeometryType.Point:
                case GeometryType.MultiPoint:
                    if (this._isEditModeOn) {
                        return [
                            new style.Style({
                                image: new style.Circle({
                                    radius: 6,
                                    fill: new style.Fill({
                                        color: '#000000'
                                    })
                                })
                            }),
                            new style.Style({
                                image: new style.Circle({
                                    radius: 4,
                                    fill: new style.Fill({
                                        color: '#ff0000'
                                    })
                                })
                            })
                        ];
                    }
                    else {
                        return [
                            new style.Style({
                                image: new style.Circle({
                                    radius: 5,
                                    fill: new style.Fill({
                                        color: '#ff0000'
                                    })
                                })
                            }),
                            new style.Style({
                                image: new style.Circle({
                                    radius: 2,
                                    fill: new style.Fill({
                                        color: '#000000'
                                    })
                                })
                            })
                        ];
                    }
                default:
                    // If editing mode is active, show bigger vertex
                    if (this._isEditModeOn || this._isDrawModeOn) {
                        return [
                            new style.Style({
                                stroke: new style.Stroke({
                                    color: 'rgba( 255, 0, 0, 1)',
                                    width: 4
                                }),
                                fill: new style.Fill({
                                    color: 'rgba(255, 0, 0, 0.7)'
                                })
                            }),
                            new style.Style({
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
                                geometry: (feature) => getVertexs(feature)
                            }),
                            new style.Style({
                                stroke: new style.Stroke({
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    width: 2
                                })
                            })
                        ];
                    }
                    else {
                        return [
                            new style.Style({
                                image: new style.Circle({
                                    radius: 2,
                                    fill: new style.Fill({
                                        color: '#000000'
                                    })
                                }),
                                geometry: (feature) => getVertexs(feature)
                            }),
                            new style.Style({
                                stroke: new style.Stroke({
                                    color: '#ff0000',
                                    width: 4
                                }),
                                fill: new style.Fill({
                                    color: 'rgba(255, 0, 0, 0.7)'
                                })
                            })
                        ];
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
            this._isEditModeOn = true;
            // To refresh the style
            this._editLayer.getSource().changed();
            this._removeOverlayHelper(feature);
            const controlDiv = document.createElement('div');
            controlDiv.className = 'ol-wfst--changes-control';
            const elements = document.createElement('div');
            elements.className = 'ol-wfst--changes-control-el';
            const elementId = document.createElement('div');
            elementId.className = 'ol-wfst--changes-control-id';
            elementId.innerHTML = `<b>${this._i18n.labels.editMode}</b> - <i>${String(feature.getId())}</i>`;
            const acceptButton = document.createElement('button');
            acceptButton.type = 'button';
            acceptButton.textContent = this._i18n.labels.apply;
            acceptButton.className = 'btn btn-sm btn-primary';
            acceptButton.onclick = () => {
                this._showLoading();
                this._collectionModify.remove(feature);
            };
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.textContent = this._i18n.labels.cancel;
            cancelButton.className = 'btn btn-sm btn-secondary';
            cancelButton.onclick = () => {
                feature.setGeometry(this._editFeatureOriginal.getGeometry());
                this._removeFeatureFromEditList(feature);
                this._collectionModify.remove(feature);
            };
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = this._i18n.labels.delete;
            deleteButton.className = 'btn btn-sm btn-danger-outline';
            deleteButton.onclick = () => {
                this._deleteFeature(feature, true);
            };
            elements.append(elementId);
            elements.append(cancelButton);
            elements.append(acceptButton);
            elements.append(deleteButton);
            controlDiv.append(elements);
            this._controlApplyDiscardChanges = new control.Control({
                element: controlDiv
            });
            this._map.addControl(this._controlApplyDiscardChanges);
        }
        /**
         * @private
         */
        _editModeOff() {
            this._isEditModeOn = false;
            this._map.removeControl(this._controlApplyDiscardChanges);
        }
        /**
         * Remove a feature from the edit Layer and from the Geoserver
         *
         * @param feature
         * @private
         */
        _deleteFeature(feature, confirm) {
            const deleteEl = () => {
                const features = Array.isArray(feature) ? feature : [feature];
                features.forEach((feature) => {
                    feature.set('_delete_', true, true);
                    this._editLayer.getSource().removeFeature(feature);
                });
                this._collectionModify.clear();
                const layerName = feature.get('_layerName_');
                const { mode } = this._options.layers.find((layer) => layer.name === layerName);
                if (mode === 'wfs') {
                    this.interactionWfsSelect.getFeatures().remove(feature);
                }
            };
            if (confirm) {
                const confirmModal = modalVanilla.confirm(this._i18n.labels.confirmDelete, Object.assign({}, this._options.modal));
                confirmModal.show().once('dismiss', function (modal, ev, button) {
                    if (button && button.value) {
                        deleteEl();
                    }
                });
            }
            else {
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
        _addFeatureToEdit(feature, coordinate = null, layerName = null) {
            const prepareOverlay = () => {
                const svgFields = `<img src="${img$1}"/>`;
                const editFieldsEl = document.createElement('div');
                editFieldsEl.className = 'ol-wfst--edit-button-cnt';
                editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editFields}">${svgFields}</button>`;
                editFieldsEl.onclick = () => {
                    this._initEditFieldsModal(feature);
                };
                const buttons = document.createElement('div');
                buttons.append(editFieldsEl);
                const svgGeom = `<img src="${img$2}"/>`;
                const editGeomEl = document.createElement('div');
                editGeomEl.className = 'ol-wfst--edit-button-cnt';
                editGeomEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editGeom}">${svgGeom}</button>`;
                editGeomEl.onclick = () => {
                    this._editModeOn(feature);
                };
                buttons.append(editGeomEl);
                const position = coordinate || extent.getCenter(feature.getGeometry().getExtent());
                const buttonsOverlay = new Overlay({
                    id: feature.getId(),
                    position: position,
                    positioning: 'center-center',
                    element: buttons,
                    offset: [0, -40],
                    stopEvent: true
                });
                this._map.addOverlay(buttonsOverlay);
            };
            if (layerName) {
                // Guardamos el nombre de la capa de donde sale la feature
                feature.set('_layerName_', layerName);
            }
            const props = feature ? feature.getProperties() : '';
            if (props) {
                if (feature.getGeometry()) {
                    this._editLayer.getSource().addFeature(feature);
                    this._collectionModify.push(feature);
                    prepareOverlay();
                    if (this._useLockFeature && this._hasLockFeature) {
                        this._lockFeature(feature.getId(), feature.get('_layerName_'));
                    }
                }
            }
        }
        /**
         * Removes in the DOM the class of the tools
         * @private
         */
        _resetStateButtons() {
            const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
            if (activeBtn) {
                activeBtn.classList.remove('wfst--active');
            }
        }
        /**
         * Confirm modal before transact to the GeoServer the features in the file
         *
         * @param content
         * @param featureToInsert
         * @private
         */
        _initUploadFileModal(content, featuresToInsert) {
            const footer = `
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.upload}
            </button>
        `;
            const modal = new modalVanilla(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: false, title: this._i18n.labels.uploadFeatures +
                    ' ' +
                    this._layerToInsertElements, content: content, backdrop: 'static', footer: footer })).show();
            modal.on('dismiss', (modal, event) => {
                // On saving changes
                if (event.target.dataset.action === 'save') {
                    this._transactWFS('insert', featuresToInsert, this._layerToInsertElements);
                }
                else {
                    // On cancel button
                    this._editLayer.getSource().clear();
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
                 * @private
                 */
                const fileReader = (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('load', (e) => __awaiter(this, void 0, void 0, function* () {
                            const fileData = e.target.result;
                            resolve(fileData);
                        }));
                        reader.addEventListener('error', (err) => {
                            console.error('Error' + err);
                            reject();
                        });
                        reader.readAsText(file);
                    });
                };
                /**
                 * Attemp to change the geometry feature to the layer
                 * @param feature
                 * @private
                 */
                const fixGeometry = (feature) => {
                    // Geometry of the layer
                    const geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                    const geomTypeFeature = feature.getGeometry().getType();
                    let geom$1;
                    switch (geomTypeFeature) {
                        case 'Point': {
                            if (geomTypeLayer === 'MultiPoint') {
                                const coords = feature.getGeometry().getCoordinates();
                                geom$1 = new geom.MultiPoint([coords]);
                            }
                            break;
                        }
                        case 'LineString':
                            if (geomTypeLayer === 'MultiLineString') {
                                const coords = feature.getGeometry().getCoordinates();
                                geom$1 = new geom.MultiLineString([coords]);
                            }
                            break;
                        case 'Polygon':
                            if (geomTypeLayer === 'MultiPolygon') {
                                const coords = feature.getGeometry().getCoordinates();
                                geom$1 = new geom.MultiPolygon([coords]);
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
                 * @private
                 */
                const checkGeometry = (feature) => {
                    // Geometry of the layer
                    const geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                    const geomTypeFeature = feature.getGeometry().getType();
                    // This geom accepts every type of geometry
                    if (geomTypeLayer === GeometryType.GeometryCollection) {
                        return true;
                    }
                    return geomTypeFeature === geomTypeLayer;
                };
                const file = evt.target.files[0];
                let features;
                if (!file) {
                    return;
                }
                const extension = file.name.split('.').pop().toLowerCase();
                try {
                    // If the user uses a custom fucntion...
                    if (this._options.processUpload) {
                        features = this._options.processUpload(file);
                    }
                    // If the user functions return features, we dont process anything more
                    if (!features) {
                        const string = yield fileReader(file);
                        if (extension === 'geojson' || extension === 'json') {
                            features = this._formatGeoJSON.readFeatures(string, {
                                featureProjection: this._view.getProjection().getCode()
                            });
                        }
                        else if (extension === 'kml') {
                            features = this._formatKml.readFeatures(string, {
                                featureProjection: this._view.getProjection().getCode()
                            });
                        }
                        else {
                            this._showError(this._i18n.errors.badFormat);
                        }
                    }
                }
                catch (err) {
                    this._showError(this._i18n.errors.badFile, err);
                }
                let invalidFeaturesCount = 0;
                let validFeaturesCount = 0;
                const featuresToInsert = [];
                for (let feature of features) {
                    // If the geometry doesn't correspond to the layer, try to fixit.
                    // If we can't, don't use it
                    if (!checkGeometry(feature)) {
                        feature = fixGeometry(feature);
                    }
                    if (feature) {
                        featuresToInsert.push(feature);
                        validFeaturesCount++;
                    }
                    else {
                        invalidFeaturesCount++;
                        continue;
                    }
                }
                if (!validFeaturesCount) {
                    this._showError(this._i18n.errors.noValidGeometry);
                }
                else {
                    this._resetStateButtons();
                    this.activateEditMode();
                    const content = `
                ${this._i18n.labels.validFeatures}: ${validFeaturesCount}<br>
                ${invalidFeaturesCount
                    ? `${this._i18n.labels.invalidFeatures}: ${invalidFeaturesCount}`
                    : ''}
            `;
                    this._editLayer.getSource().addFeatures(featuresToInsert);
                    this._initUploadFileModal(content, featuresToInsert);
                    this._view.fit(this._editLayer.getSource().getExtent(), {
                        size: this._map.getSize(),
                        maxZoom: 21,
                        padding: [100, 100, 100, 100]
                    });
                }
                // Reset the input to allow another onChange trigger
                evt.target.value = null;
            });
        }
        /**
         * Update geom Types availibles to select for this layer
         *
         * @param layerName
         * @param geomDrawTypeSelected
         */
        _changeStateSelect(layerName, geomDrawTypeSelected = null) {
            /**
             * Set the geometry type in the select according to the geometry of
             * the layer in the geoserver and disable what does not correspond.
             *
             * @param value
             * @param options
             * @private
             */
            const setSelectState = (value, options) => {
                Array.from(this._selectDraw.options).forEach((option) => {
                    option.selected = option.value === value ? true : false;
                    option.disabled =
                        options === 'all'
                            ? false
                            : options.includes(option.value)
                                ? false
                                : true;
                    option.title = option.disabled
                        ? this._i18n.labels.geomTypeNotSupported
                        : '';
                });
            };
            let drawType;
            if (this._selectDraw) {
                const geomLayer = this._geoServerData[layerName].geomType;
                if (geomDrawTypeSelected) {
                    drawType = this._selectDraw.value;
                }
                else {
                    if (geomLayer === GeometryType.GeometryCollection) {
                        drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                        setSelectState(drawType, 'all');
                    }
                    else if (geomLayer === GeometryType.LinearRing) {
                        drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                        setSelectState(drawType, [
                            GeometryType.Circle,
                            GeometryType.LinearRing,
                            GeometryType.Polygon
                        ]);
                        this._selectDraw.value = drawType;
                    }
                    else {
                        drawType = geomLayer;
                        setSelectState(drawType, [geomLayer]);
                    }
                }
            }
            return drawType;
        }
        /**
         * Activate/deactivate the draw mode
         *
         * @param layerName
         * @public
         */
        activateDrawMode(layerName) {
            /**
             *
             * @param layerName
             * @private
             */
            const addDrawInteraction = (layerName) => {
                this.activateEditMode(false);
                // If already exists, remove
                if (this.interactionDraw) {
                    this._map.removeInteraction(this.interactionDraw);
                }
                const geomDrawType = this._selectDraw.value;
                this.interactionDraw = new interaction.Draw({
                    source: this._editLayer.getSource(),
                    type: geomDrawType,
                    style: (feature) => this._styleFunction(feature)
                });
                this._map.addInteraction(this.interactionDraw);
                this.interactionDraw.on('drawstart', (evt) => {
                    super.dispatchEvent(evt);
                });
                this.interactionDraw.on('drawend', (evt) => {
                    const feature = evt.feature;
                    this._transactWFS('insert', feature, layerName);
                    super.dispatchEvent(evt);
                });
            };
            if (!this.interactionDraw && !layerName) {
                return;
            }
            if (layerName) {
                // If layer is set to invisible, show warning
                if (!this._mapLayers[layerName].getVisible()) {
                    return;
                }
                const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
                if (btn) {
                    btn.classList.add('wfst--active');
                }
                this._viewport.classList.add('draw-mode');
                addDrawInteraction(String(layerName));
            }
            else {
                this._map.removeInteraction(this.interactionDraw);
                this._viewport.classList.remove('draw-mode');
            }
            this._isDrawModeOn = layerName ? true : false;
        }
        /**
         * Activate/desactivate the edit mode
         *
         * @param bool
         * @public
         */
        activateEditMode(bool = true) {
            if (bool) {
                const btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
                if (btn) {
                    btn.classList.add('wfst--active');
                }
                this.activateDrawMode(false);
            }
            else {
                // Deselct features
                this._collectionModify.clear();
            }
            if (this.interactionSelectModify) {
                this.interactionSelectModify.setActive(bool);
            }
            this.interactionModify.setActive(bool);
            if (this.interactionWfsSelect)
                this.interactionWfsSelect.setActive(bool);
        }
        /**
         * Add features directly to the geoserver, in a custom layer
         * without checking geometry or showing modal to confirm.
         *
         * @param layerName
         * @param features
         * @public
         */
        insertFeaturesTo(layerName, features) {
            this._transactWFS('insert', features, layerName);
        }
        /**
         * Shows a fields form in a modal window to allow changes in the properties of the feature.
         *
         * @param feature
         * @private
         */
        _initEditFieldsModal(feature) {
            this._editFeature = feature;
            const properties = feature.getProperties();
            const layer = feature.get('_layerName_');
            // Data schema from the geoserver
            const dataSchema = this._geoServerData[layer].properties;
            let content = '<form autocomplete="false">';
            Object.keys(properties).forEach((key) => {
                // If the feature field exists in the geoserver and is not added by openlayers
                const field = dataSchema.find((data) => data.name === key);
                if (field) {
                    const typeXsd = field.type;
                    let type;
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
                        content += `
                <div class="ol-wfst--input-field-container">
                    <label class="ol-wfst--input-field-label" for="${key}">${key}</label>
                    <input placeholder="NULL" class="ol-wfst--input-field-input" type="${type}" name="${key}" value="${properties[key] || ''}">
                </div>`;
                    }
                }
            });
            content += '</form>';
            const footer = `
            <button type="button" class="btn btn-sm btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${this._i18n.labels.delete}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.save}
            </button>
        `;
            const modal = new modalVanilla(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: true, title: `${this._i18n.labels.editElement} ${this._editFeature.getId()} `, content: content, footer: footer })).show();
            modal.on('dismiss', (modal, event) => {
                // On saving changes
                if (event.target.dataset.action === 'save') {
                    const inputs = modal.el.querySelectorAll('input');
                    inputs.forEach((el) => {
                        const value = el.value;
                        const field = el.name;
                        this._editFeature.set(field, value, /*isSilent = */ true);
                    });
                    this._editFeature.changed();
                    this._addFeatureToEditedList(this._editFeature);
                    // Force deselect to trigger handler
                    this._collectionModify.remove(this._editFeature);
                }
                else if (event.target.dataset.action === 'delete') {
                    this._deleteFeature(this._editFeature, true);
                }
            });
        }
        /**
         * Remove the overlay helper atttached to a specify feature
         * @param feature
         * @private
         */
        _removeOverlayHelper(feature) {
            const featureId = feature.getId();
            if (!featureId) {
                return;
            }
            const overlay = this._map.getOverlayById(featureId);
            if (!overlay) {
                return;
            }
            this._map.removeOverlay(overlay);
        }
    }
    /**
     *
     * @param target
     * @param sources
     * @returns
     * @private
     */
    const deepObjectAssign = (target, ...sources) => {
        sources.forEach((source) => {
            Object.keys(source).forEach((key) => {
                const s_val = source[key];
                const t_val = target[key];
                target[key] =
                    t_val &&
                        s_val &&
                        typeof t_val === 'object' &&
                        typeof s_val === 'object' &&
                        !Array.isArray(t_val) // Don't merge arrays
                        ? deepObjectAssign(t_val, s_val)
                        : s_val;
            });
        });
        return target;
    };

    return Wfst;

})));
//# sourceMappingURL=ol-wfst.js.map
