(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ol/style'), require('ol/control'), require('ol/interaction'), require('ol/events/Event'), require('ol/events/condition'), require('ol/Observable'), require('ol/layer/Vector'), require('ol/layer/Base'), require('ol/format/GeoJSON'), require('ol/source/Vector'), require('ol/proj'), require('ol/loadingstrategy'), require('ol/layer/Tile'), require('ol/format'), require('ol/source/TileWMS'), require('ol/geom'), require('ol/Object'), require('ol/geom/Polygon'), require('ol/extent')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ol/style', 'ol/control', 'ol/interaction', 'ol/events/Event', 'ol/events/condition', 'ol/Observable', 'ol/layer/Vector', 'ol/layer/Base', 'ol/format/GeoJSON', 'ol/source/Vector', 'ol/proj', 'ol/loadingstrategy', 'ol/layer/Tile', 'ol/format', 'ol/source/TileWMS', 'ol/geom', 'ol/Object', 'ol/geom/Polygon', 'ol/extent'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Wfst = {}, global.ol.style, global.ol.control, global.ol.interaction, global.ol.events.Event, global.ol.events.condition, global.ol.Observable, global.ol.layer.Vector, global.ol.layer.Base, global.ol.format.GeoJSON, global.ol.source.Vector, global.ol.proj, global.ol.loadingstrategy, global.ol.layer.Tile, global.ol.format, global.ol.source.TileWMS, global.ol.geom, global.ol.Object, global.ol.geom.Polygon, global.ol.extent));
})(this, (function (exports, style, control, interaction, BaseEvent$1, condition, Observable$2, VectorLayer, Layer, GeoJSON, VectorSource, proj, loadingstrategy, TileLayer, format, TileWMS, geom, BaseObject$2, Polygon, extent) { 'use strict';

  /**
   * @module ol/AssertionError
   */

  /** @type {Object<number, string>} */
  const messages = {
    1: 'The view center is not defined',
    2: 'The view resolution is not defined',
    3: 'The view rotation is not defined',
    4: '`image` and `src` cannot be provided at the same time',
    5: '`imgSize` must be set when `image` is provided',
    7: '`format` must be set when `url` is set',
    8: 'Unknown `serverType` configured',
    9: '`url` must be configured or set using `#setUrl()`',
    10: 'The default `geometryFunction` can only handle `Point` geometries',
    11: '`options.featureTypes` must be an Array',
    12: '`options.geometryName` must also be provided when `options.bbox` is set',
    13: 'Invalid corner',
    14: 'Invalid color',
    15: 'Tried to get a value for a key that does not exist in the cache',
    16: 'Tried to set a value for a key that is used already',
    17: '`resolutions` must be sorted in descending order',
    18: 'Either `origin` or `origins` must be configured, never both',
    19: 'Number of `tileSizes` and `resolutions` must be equal',
    20: 'Number of `origins` and `resolutions` must be equal',
    22: 'Either `tileSize` or `tileSizes` must be configured, never both',
    24: 'Invalid extent or geometry provided as `geometry`',
    25: 'Cannot fit empty extent provided as `geometry`',
    26: 'Features must have an id set',
    27: 'Features must have an id set',
    28: '`renderMode` must be `"hybrid"` or `"vector"`',
    30: 'The passed `feature` was already added to the source',
    31: 'Tried to enqueue an `element` that was already added to the queue',
    32: 'Transformation matrix cannot be inverted',
    33: 'Invalid units',
    34: 'Invalid geometry layout',
    36: 'Unknown SRS type',
    37: 'Unknown geometry type found',
    38: '`styleMapValue` has an unknown type',
    39: 'Unknown geometry type',
    40: 'Expected `feature` to have a geometry',
    41: 'Expected an `ol/style/Style` or an array of `ol/style/Style.js`',
    42: 'Question unknown, the answer is 42',
    43: 'Expected `layers` to be an array or a `Collection`',
    47: 'Expected `controls` to be an array or an `ol/Collection`',
    48: 'Expected `interactions` to be an array or an `ol/Collection`',
    49: 'Expected `overlays` to be an array or an `ol/Collection`',
    50: '`options.featureTypes` should be an Array',
    51: 'Either `url` or `tileJSON` options must be provided',
    52: 'Unknown `serverType` configured',
    53: 'Unknown `tierSizeCalculation` configured',
    55: 'The {-y} placeholder requires a tile grid with extent',
    56: 'mapBrowserEvent must originate from a pointer event',
    57: 'At least 2 conditions are required',
    59: 'Invalid command found in the PBF',
    60: 'Missing or invalid `size`',
    61: 'Cannot determine IIIF Image API version from provided image information JSON',
    62: 'A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`',
    64: 'Layer opacity must be a number',
    66: '`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`',
    67: 'A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both',
    68: 'A VectorTile source can only be rendered if it has a projection compatible with the view projection',
  };

  /**
   * Error object thrown when an assertion failed. This is an ECMA-262 Error,
   * extended with a `code` property.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
   */
  class AssertionError extends Error {
    /**
     * @param {number} code Error code.
     */
    constructor(code) {
      const message = messages[code];

      super(message);

      /**
       * Error code. The meaning of the code can be found on
       * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
       * the version found in the OpenLayers script's header comment if a version
       * other than the latest is used).
       * @type {number}
       * @deprecated ol/AssertionError and error codes will be removed in v8.0
       * @api
       */
      this.code = code;

      /**
       * @type {string}
       */
      this.name = 'AssertionError';

      // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
      this.message = message;
    }
  }

  var AssertionError$1 = AssertionError;

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
  class BaseEvent {
    /**
     * @param {string} type Type.
     */
    constructor(type) {
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
    preventDefault() {
      this.defaultPrevented = true;
    }

    /**
     * Stop event propagation.
     * @api
     */
    stopPropagation() {
      this.propagationStopped = true;
    }
  }

  var Event$1 = BaseEvent;

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
  class Disposable {
    constructor() {
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
    dispose() {
      if (!this.disposed) {
        this.disposed = true;
        this.disposeInternal();
      }
    }

    /**
     * Extension point for disposable objects.
     * @protected
     */
    disposeInternal() {}
  }

  var Disposable$1 = Disposable;

  /**
   * @module ol/functions
   */

  /**
   * A reusable function, used e.g. as a default for callbacks.
   *
   * @return {void} Nothing.
   */
  function VOID() {}

  /**
   * @module ol/obj
   */

  /**
   * Removes all properties from an object.
   * @param {Object} object The object to clear.
   */
  function clear(object) {
    for (const property in object) {
      delete object[property];
    }
  }

  /**
   * Determine if an object has any properties.
   * @param {Object} object The object to check.
   * @return {boolean} The object is empty.
   */
  function isEmpty(object) {
    let property;
    for (property in object) {
      return false;
    }
    return !property;
  }

  /**
   * @module ol/events/Target
   */

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
  class Target extends Disposable$1 {
    /**
     * @param {*} [target] Default event target for dispatched events.
     */
    constructor(target) {
      super();

      /**
       * @private
       * @type {*}
       */
      this.eventTarget_ = target;

      /**
       * @private
       * @type {Object<string, number>}
       */
      this.pendingRemovals_ = null;

      /**
       * @private
       * @type {Object<string, number>}
       */
      this.dispatching_ = null;

      /**
       * @private
       * @type {Object<string, Array<import("../events.js").Listener>>}
       */
      this.listeners_ = null;
    }

    /**
     * @param {string} type Type.
     * @param {import("../events.js").Listener} listener Listener.
     */
    addEventListener(type, listener) {
      if (!type || !listener) {
        return;
      }
      const listeners = this.listeners_ || (this.listeners_ = {});
      const listenersForType = listeners[type] || (listeners[type] = []);
      if (!listenersForType.includes(listener)) {
        listenersForType.push(listener);
      }
    }

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
    dispatchEvent(event) {
      const isString = typeof event === 'string';
      const type = isString ? event : event.type;
      const listeners = this.listeners_ && this.listeners_[type];
      if (!listeners) {
        return;
      }

      const evt = isString ? new Event$1(event) : /** @type {Event} */ (event);
      if (!evt.target) {
        evt.target = this.eventTarget_ || this;
      }
      const dispatching = this.dispatching_ || (this.dispatching_ = {});
      const pendingRemovals =
        this.pendingRemovals_ || (this.pendingRemovals_ = {});
      if (!(type in dispatching)) {
        dispatching[type] = 0;
        pendingRemovals[type] = 0;
      }
      ++dispatching[type];
      let propagate;
      for (let i = 0, ii = listeners.length; i < ii; ++i) {
        if ('handleEvent' in listeners[i]) {
          propagate = /** @type {import("../events.js").ListenerObject} */ (
            listeners[i]
          ).handleEvent(evt);
        } else {
          propagate = /** @type {import("../events.js").ListenerFunction} */ (
            listeners[i]
          ).call(this, evt);
        }
        if (propagate === false || evt.propagationStopped) {
          propagate = false;
          break;
        }
      }
      if (--dispatching[type] === 0) {
        let pr = pendingRemovals[type];
        delete pendingRemovals[type];
        while (pr--) {
          this.removeEventListener(type, VOID);
        }
        delete dispatching[type];
      }
      return propagate;
    }

    /**
     * Clean up.
     */
    disposeInternal() {
      this.listeners_ && clear(this.listeners_);
    }

    /**
     * Get the listeners for a specified event type. Listeners are returned in the
     * order that they will be called in.
     *
     * @param {string} type Type.
     * @return {Array<import("../events.js").Listener>|undefined} Listeners.
     */
    getListeners(type) {
      return (this.listeners_ && this.listeners_[type]) || undefined;
    }

    /**
     * @param {string} [type] Type. If not provided,
     *     `true` will be returned if this event target has any listeners.
     * @return {boolean} Has listeners.
     */
    hasListener(type) {
      if (!this.listeners_) {
        return false;
      }
      return type
        ? type in this.listeners_
        : Object.keys(this.listeners_).length > 0;
    }

    /**
     * @param {string} type Type.
     * @param {import("../events.js").Listener} listener Listener.
     */
    removeEventListener(type, listener) {
      const listeners = this.listeners_ && this.listeners_[type];
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          if (this.pendingRemovals_ && type in this.pendingRemovals_) {
            // make listener a no-op, and remove later in #dispatchEvent()
            listeners[index] = VOID;
            ++this.pendingRemovals_[type];
          } else {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
              delete this.listeners_[type];
            }
          }
        }
      }
    }
  }

  var Target$1 = Target;

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
   * Key to use with {@link module:ol/Observable.unByKey}.
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
   * @param {Object} [thisArg] Object referenced by the `this` keyword in the
   *     listener. Default is the `target`.
   * @param {boolean} [once] If true, add the listener as one-off listener.
   * @return {EventsKey} Unique key for the listener.
   */
  function listen(target, type, listener, thisArg, once) {
    if (thisArg && thisArg !== target) {
      listener = listener.bind(thisArg);
    }
    if (once) {
      const originalListener = listener;
      listener = function () {
        target.removeEventListener(type, listener);
        originalListener.apply(this, arguments);
      };
    }
    const eventsKey = {
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
   * @param {Object} [thisArg] Object referenced by the `this` keyword in the
   *     listener. Default is the `target`.
   * @return {EventsKey} Key for unlistenByKey.
   */
  function listenOnce(target, type, listener, thisArg) {
    return listen(target, type, listener, thisArg, true);
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

  /**
   * @module ol/Observable
   */

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
  class Observable extends Target$1 {
    constructor() {
      super();

      this.on =
        /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (
          this.onInternal
        );

      this.once =
        /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (
          this.onceInternal
        );

      this.un = /** @type {ObservableOnSignature<void>} */ (this.unInternal);

      /**
       * @private
       * @type {number}
       */
      this.revision_ = 0;
    }

    /**
     * Increases the revision counter and dispatches a 'change' event.
     * @api
     */
    changed() {
      ++this.revision_;
      this.dispatchEvent(EventType.CHANGE);
    }

    /**
     * Get the version number for this object.  Each time the object is modified,
     * its version number will be incremented.
     * @return {number} Revision.
     * @api
     */
    getRevision() {
      return this.revision_;
    }

    /**
     * @param {string|Array<string>} type Type.
     * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
     * @protected
     */
    onInternal(type, listener) {
      if (Array.isArray(type)) {
        const len = type.length;
        const keys = new Array(len);
        for (let i = 0; i < len; ++i) {
          keys[i] = listen(this, type[i], listener);
        }
        return keys;
      } else {
        return listen(this, /** @type {string} */ (type), listener);
      }
    }

    /**
     * @param {string|Array<string>} type Type.
     * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
     * @protected
     */
    onceInternal(type, listener) {
      let key;
      if (Array.isArray(type)) {
        const len = type.length;
        key = new Array(len);
        for (let i = 0; i < len; ++i) {
          key[i] = listenOnce(this, type[i], listener);
        }
      } else {
        key = listenOnce(this, /** @type {string} */ (type), listener);
      }
      /** @type {Object} */ (listener).ol_key = key;
      return key;
    }

    /**
     * Unlisten for a certain type of event.
     * @param {string|Array<string>} type Type.
     * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
     * @protected
     */
    unInternal(type, listener) {
      const key = /** @type {Object} */ (listener).ol_key;
      if (key) {
        unByKey(key);
      } else if (Array.isArray(type)) {
        for (let i = 0, ii = type.length; i < ii; ++i) {
          this.removeEventListener(type[i], listener);
        }
      } else {
        this.removeEventListener(type, listener);
      }
    }
  }

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
      for (let i = 0, ii = key.length; i < ii; ++i) {
        unlistenByKey(key[i]);
      }
    } else {
      unlistenByKey(/** @type {import("./events.js").EventsKey} */ (key));
    }
  }

  var Observable$1 = Observable;

  /**
   * @module ol/util
   */

  /**
   * Counter for getUid.
   * @type {number}
   * @private
   */
  let uidCounter_ = 0;

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
   * @module ol/Object
   */

  /**
   * @classdesc
   * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
   */
  class ObjectEvent extends Event$1 {
    /**
     * @param {string} type The event type.
     * @param {string} key The property name.
     * @param {*} oldValue The old value for `key`.
     */
    constructor(type, key, oldValue) {
      super(type);

      /**
       * The name of the property whose value is changing.
       * @type {string}
       * @api
       */
      this.key = key;

      /**
       * The old value. To get the new value use `e.target.get(e.key)` where
       * `e` is the event object.
       * @type {*}
       * @api
       */
      this.oldValue = oldValue;
    }
  }

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
   * This extends {@link module:ol/Observable~Observable} with observable
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
  class BaseObject extends Observable$1 {
    /**
     * @param {Object<string, *>} [values] An object with key-value pairs.
     */
    constructor(values) {
      super();

      /***
       * @type {ObjectOnSignature<import("./events").EventsKey>}
       */
      this.on;

      /***
       * @type {ObjectOnSignature<import("./events").EventsKey>}
       */
      this.once;

      /***
       * @type {ObjectOnSignature<void>}
       */
      this.un;

      // Call {@link module:ol/util.getUid} to ensure that the order of objects' ids is
      // the same as the order in which they were created.  This also helps to
      // ensure that object properties are always added in the same order, which
      // helps many JavaScript engines generate faster code.
      getUid(this);

      /**
       * @private
       * @type {Object<string, *>}
       */
      this.values_ = null;

      if (values !== undefined) {
        this.setProperties(values);
      }
    }

    /**
     * Gets a value.
     * @param {string} key Key name.
     * @return {*} Value.
     * @api
     */
    get(key) {
      let value;
      if (this.values_ && this.values_.hasOwnProperty(key)) {
        value = this.values_[key];
      }
      return value;
    }

    /**
     * Get a list of object property names.
     * @return {Array<string>} List of property names.
     * @api
     */
    getKeys() {
      return (this.values_ && Object.keys(this.values_)) || [];
    }

    /**
     * Get an object of all property names and values.
     * @return {Object<string, *>} Object.
     * @api
     */
    getProperties() {
      return (this.values_ && Object.assign({}, this.values_)) || {};
    }

    /**
     * @return {boolean} The object has properties.
     */
    hasProperties() {
      return !!this.values_;
    }

    /**
     * @param {string} key Key name.
     * @param {*} oldValue Old value.
     */
    notify(key, oldValue) {
      let eventType;
      eventType = `change:${key}`;
      if (this.hasListener(eventType)) {
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
      }
      eventType = ObjectEventType.PROPERTYCHANGE;
      if (this.hasListener(eventType)) {
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
      }
    }

    /**
     * @param {string} key Key name.
     * @param {import("./events.js").Listener} listener Listener.
     */
    addChangeListener(key, listener) {
      this.addEventListener(`change:${key}`, listener);
    }

    /**
     * @param {string} key Key name.
     * @param {import("./events.js").Listener} listener Listener.
     */
    removeChangeListener(key, listener) {
      this.removeEventListener(`change:${key}`, listener);
    }

    /**
     * Sets a value.
     * @param {string} key Key name.
     * @param {*} value Value.
     * @param {boolean} [silent] Update without triggering an event.
     * @api
     */
    set(key, value, silent) {
      const values = this.values_ || (this.values_ = {});
      if (silent) {
        values[key] = value;
      } else {
        const oldValue = values[key];
        values[key] = value;
        if (oldValue !== value) {
          this.notify(key, oldValue);
        }
      }
    }

    /**
     * Sets a collection of key-value pairs.  Note that this changes any existing
     * properties and adds new ones (it does not remove any existing properties).
     * @param {Object<string, *>} values Values.
     * @param {boolean} [silent] Update without triggering an event.
     * @api
     */
    setProperties(values, silent) {
      for (const key in values) {
        this.set(key, values[key], silent);
      }
    }

    /**
     * Apply any properties from another object without triggering events.
     * @param {BaseObject} source The source object.
     * @protected
     */
    applyProperties(source) {
      if (!source.values_) {
        return;
      }
      Object.assign(this.values_ || (this.values_ = {}), source.values_);
    }

    /**
     * Unsets a property.
     * @param {string} key Key name.
     * @param {boolean} [silent] Unset without triggering an event.
     * @api
     */
    unset(key, silent) {
      if (this.values_ && key in this.values_) {
        const oldValue = this.values_[key];
        delete this.values_[key];
        if (isEmpty(this.values_)) {
          this.values_ = null;
        }
        if (!silent) {
          this.notify(key, oldValue);
        }
      }
    }
  }

  var BaseObject$1 = BaseObject;

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

  /**
   * @module ol/Collection
   */

  /**
   * @enum {string}
   * @private
   */
  const Property$1 = {
    LENGTH: 'length',
  };

  /**
   * @classdesc
   * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
   * type.
   * @template T
   */
  class CollectionEvent extends Event$1 {
    /**
     * @param {import("./CollectionEventType.js").default} type Type.
     * @param {T} element Element.
     * @param {number} index The index of the added or removed element.
     */
    constructor(type, element, index) {
      super(type);

      /**
       * The element that is added to or removed from the collection.
       * @type {T}
       * @api
       */
      this.element = element;

      /**
       * The index of the added or removed element.
       * @type {number}
       * @api
       */
      this.index = index;
    }
  }

  /***
   * @template T
   * @template Return
   * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
   *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:length', import("./Object").ObjectEvent, Return> &
   *   import("./Observable").OnSignature<'add'|'remove', CollectionEvent<T>, Return> &
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
  class Collection extends BaseObject$1 {
    /**
     * @param {Array<T>} [array] Array.
     * @param {Options} [options] Collection options.
     */
    constructor(array, options) {
      super();

      /***
       * @type {CollectionOnSignature<T, import("./events").EventsKey>}
       */
      this.on;

      /***
       * @type {CollectionOnSignature<T, import("./events").EventsKey>}
       */
      this.once;

      /***
       * @type {CollectionOnSignature<T, void>}
       */
      this.un;

      options = options || {};

      /**
       * @private
       * @type {boolean}
       */
      this.unique_ = !!options.unique;

      /**
       * @private
       * @type {!Array<T>}
       */
      this.array_ = array ? array : [];

      if (this.unique_) {
        for (let i = 0, ii = this.array_.length; i < ii; ++i) {
          this.assertUnique_(this.array_[i], i);
        }
      }

      this.updateLength_();
    }

    /**
     * Remove all elements from the collection.
     * @api
     */
    clear() {
      while (this.getLength() > 0) {
        this.pop();
      }
    }

    /**
     * Add elements to the collection.  This pushes each item in the provided array
     * to the end of the collection.
     * @param {!Array<T>} arr Array.
     * @return {Collection<T>} This collection.
     * @api
     */
    extend(arr) {
      for (let i = 0, ii = arr.length; i < ii; ++i) {
        this.push(arr[i]);
      }
      return this;
    }

    /**
     * Iterate over each element, calling the provided callback.
     * @param {function(T, number, Array<T>): *} f The function to call
     *     for every element. This function takes 3 arguments (the element, the
     *     index and the array). The return value is ignored.
     * @api
     */
    forEach(f) {
      const array = this.array_;
      for (let i = 0, ii = array.length; i < ii; ++i) {
        f(array[i], i, array);
      }
    }

    /**
     * Get a reference to the underlying Array object. Warning: if the array
     * is mutated, no events will be dispatched by the collection, and the
     * collection's "length" property won't be in sync with the actual length
     * of the array.
     * @return {!Array<T>} Array.
     * @api
     */
    getArray() {
      return this.array_;
    }

    /**
     * Get the element at the provided index.
     * @param {number} index Index.
     * @return {T} Element.
     * @api
     */
    item(index) {
      return this.array_[index];
    }

    /**
     * Get the length of this collection.
     * @return {number} The length of the array.
     * @observable
     * @api
     */
    getLength() {
      return this.get(Property$1.LENGTH);
    }

    /**
     * Insert an element at the provided index.
     * @param {number} index Index.
     * @param {T} elem Element.
     * @api
     */
    insertAt(index, elem) {
      if (index < 0 || index > this.getLength()) {
        throw new Error('Index out of bounds: ' + index);
      }
      if (this.unique_) {
        this.assertUnique_(elem);
      }
      this.array_.splice(index, 0, elem);
      this.updateLength_();
      this.dispatchEvent(
        new CollectionEvent(CollectionEventType.ADD, elem, index)
      );
    }

    /**
     * Remove the last element of the collection and return it.
     * Return `undefined` if the collection is empty.
     * @return {T|undefined} Element.
     * @api
     */
    pop() {
      return this.removeAt(this.getLength() - 1);
    }

    /**
     * Insert the provided element at the end of the collection.
     * @param {T} elem Element.
     * @return {number} New length of the collection.
     * @api
     */
    push(elem) {
      if (this.unique_) {
        this.assertUnique_(elem);
      }
      const n = this.getLength();
      this.insertAt(n, elem);
      return this.getLength();
    }

    /**
     * Remove the first occurrence of an element from the collection.
     * @param {T} elem Element.
     * @return {T|undefined} The removed element or undefined if none found.
     * @api
     */
    remove(elem) {
      const arr = this.array_;
      for (let i = 0, ii = arr.length; i < ii; ++i) {
        if (arr[i] === elem) {
          return this.removeAt(i);
        }
      }
      return undefined;
    }

    /**
     * Remove the element at the provided index and return it.
     * Return `undefined` if the collection does not contain this index.
     * @param {number} index Index.
     * @return {T|undefined} Value.
     * @api
     */
    removeAt(index) {
      if (index < 0 || index >= this.getLength()) {
        return undefined;
      }
      const prev = this.array_[index];
      this.array_.splice(index, 1);
      this.updateLength_();
      this.dispatchEvent(
        /** @type {CollectionEvent<T>} */ (
          new CollectionEvent(CollectionEventType.REMOVE, prev, index)
        )
      );
      return prev;
    }

    /**
     * Set the element at the provided index.
     * @param {number} index Index.
     * @param {T} elem Element.
     * @api
     */
    setAt(index, elem) {
      const n = this.getLength();
      if (index >= n) {
        this.insertAt(index, elem);
        return;
      }
      if (index < 0) {
        throw new Error('Index out of bounds: ' + index);
      }
      if (this.unique_) {
        this.assertUnique_(elem, index);
      }
      const prev = this.array_[index];
      this.array_[index] = elem;
      this.dispatchEvent(
        /** @type {CollectionEvent<T>} */ (
          new CollectionEvent(CollectionEventType.REMOVE, prev, index)
        )
      );
      this.dispatchEvent(
        /** @type {CollectionEvent<T>} */ (
          new CollectionEvent(CollectionEventType.ADD, elem, index)
        )
      );
    }

    /**
     * @private
     */
    updateLength_() {
      this.set(Property$1.LENGTH, this.array_.length);
    }

    /**
     * @private
     * @param {T} elem Element.
     * @param {number} [except] Optional index to ignore.
     */
    assertUnique_(elem, except) {
      for (let i = 0, ii = this.array_.length; i < ii; ++i) {
        if (this.array_[i] === elem && i !== except) {
          throw new AssertionError$1(58);
        }
      }
    }
  }

  var Collection$1 = Collection;

  /**
   * @module ol/asserts
   */

  /**
   * @param {*} assertion Assertion we expected to be truthy.
   * @param {number} errorCode Error code.
   */
  function assert(assertion, errorCode) {
    if (!assertion) {
      throw new AssertionError$1(errorCode);
    }
  }

  /**
   * @module ol/Feature
   */

  /**
   * @typedef {typeof Feature|typeof import("./render/Feature.js").default} FeatureClass
   */

  /**
   * @typedef {Feature|import("./render/Feature.js").default} FeatureLike
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
   * Note that attribute properties are set as {@link module:ol/Object~BaseObject} properties on
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
   * const feature = new Feature({
   *   geometry: new Polygon(polyCoords),
   *   labelPoint: new Point(labelCoords),
   *   name: 'My Polygon',
   * });
   *
   * // get the polygon geometry
   * const poly = feature.getGeometry();
   *
   * // Render the feature as a point using the coordinates from labelPoint
   * feature.setGeometryName('labelPoint');
   *
   * // get the point geometry
   * const point = feature.getGeometry();
   * ```
   *
   * @api
   * @template {import("./geom/Geometry.js").default} [Geometry=import("./geom/Geometry.js").default]
   */
  class Feature extends BaseObject$1 {
    /**
     * @param {Geometry|ObjectWithGeometry<Geometry>} [geometryOrProperties]
     *     You may pass a Geometry object directly, or an object literal containing
     *     properties. If you pass an object literal, you may include a Geometry
     *     associated with a `geometry` key.
     */
    constructor(geometryOrProperties) {
      super();

      /***
       * @type {FeatureOnSignature<import("./events").EventsKey>}
       */
      this.on;

      /***
       * @type {FeatureOnSignature<import("./events").EventsKey>}
       */
      this.once;

      /***
       * @type {FeatureOnSignature<void>}
       */
      this.un;

      /**
       * @private
       * @type {number|string|undefined}
       */
      this.id_ = undefined;

      /**
       * @type {string}
       * @private
       */
      this.geometryName_ = 'geometry';

      /**
       * User provided style.
       * @private
       * @type {import("./style/Style.js").StyleLike}
       */
      this.style_ = null;

      /**
       * @private
       * @type {import("./style/Style.js").StyleFunction|undefined}
       */
      this.styleFunction_ = undefined;

      /**
       * @private
       * @type {?import("./events.js").EventsKey}
       */
      this.geometryChangeKey_ = null;

      this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);

      if (geometryOrProperties) {
        if (
          typeof (
            /** @type {?} */ (geometryOrProperties).getSimplifiedGeometry
          ) === 'function'
        ) {
          const geometry = /** @type {Geometry} */ (geometryOrProperties);
          this.setGeometry(geometry);
        } else {
          /** @type {Object<string, *>} */
          const properties = geometryOrProperties;
          this.setProperties(properties);
        }
      }
    }

    /**
     * Clone this feature. If the original feature has a geometry it
     * is also cloned. The feature id is not set in the clone.
     * @return {Feature<Geometry>} The clone.
     * @api
     */
    clone() {
      const clone = /** @type {Feature<Geometry>} */ (
        new Feature(this.hasProperties() ? this.getProperties() : null)
      );
      clone.setGeometryName(this.getGeometryName());
      const geometry = this.getGeometry();
      if (geometry) {
        clone.setGeometry(/** @type {Geometry} */ (geometry.clone()));
      }
      const style = this.getStyle();
      if (style) {
        clone.setStyle(style);
      }
      return clone;
    }

    /**
     * Get the feature's default geometry.  A feature may have any number of named
     * geometries.  The "default" geometry (the one that is rendered by default) is
     * set when calling {@link module:ol/Feature~Feature#setGeometry}.
     * @return {Geometry|undefined} The default geometry for the feature.
     * @api
     * @observable
     */
    getGeometry() {
      return /** @type {Geometry|undefined} */ (this.get(this.geometryName_));
    }

    /**
     * Get the feature identifier.  This is a stable identifier for the feature and
     * is either set when reading data from a remote source or set explicitly by
     * calling {@link module:ol/Feature~Feature#setId}.
     * @return {number|string|undefined} Id.
     * @api
     */
    getId() {
      return this.id_;
    }

    /**
     * Get the name of the feature's default geometry.  By default, the default
     * geometry is named `geometry`.
     * @return {string} Get the property name associated with the default geometry
     *     for this feature.
     * @api
     */
    getGeometryName() {
      return this.geometryName_;
    }

    /**
     * Get the feature's style. Will return what was provided to the
     * {@link module:ol/Feature~Feature#setStyle} method.
     * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
     * @api
     */
    getStyle() {
      return this.style_;
    }

    /**
     * Get the feature's style function.
     * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
     * representing the current style of this feature.
     * @api
     */
    getStyleFunction() {
      return this.styleFunction_;
    }

    /**
     * @private
     */
    handleGeometryChange_() {
      this.changed();
    }

    /**
     * @private
     */
    handleGeometryChanged_() {
      if (this.geometryChangeKey_) {
        unlistenByKey(this.geometryChangeKey_);
        this.geometryChangeKey_ = null;
      }
      const geometry = this.getGeometry();
      if (geometry) {
        this.geometryChangeKey_ = listen(
          geometry,
          EventType.CHANGE,
          this.handleGeometryChange_,
          this
        );
      }
      this.changed();
    }

    /**
     * Set the default geometry for the feature.  This will update the property
     * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
     * @param {Geometry|undefined} geometry The new geometry.
     * @api
     * @observable
     */
    setGeometry(geometry) {
      this.set(this.geometryName_, geometry);
    }

    /**
     * Set the style for the feature to override the layer style.  This can be a
     * single style object, an array of styles, or a function that takes a
     * resolution and returns an array of styles. To unset the feature style, call
     * `setStyle()` without arguments or a falsey value.
     * @param {import("./style/Style.js").StyleLike} [style] Style for this feature.
     * @api
     * @fires module:ol/events/Event~BaseEvent#event:change
     */
    setStyle(style) {
      this.style_ = style;
      this.styleFunction_ = !style ? undefined : createStyleFunction(style);
      this.changed();
    }

    /**
     * Set the feature id.  The feature id is considered stable and may be used when
     * requesting features or comparing identifiers returned from a remote source.
     * The feature id can be used with the
     * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
     * @param {number|string|undefined} id The feature id.
     * @api
     * @fires module:ol/events/Event~BaseEvent#event:change
     */
    setId(id) {
      this.id_ = id;
      this.changed();
    }

    /**
     * Set the property name to be used when getting the feature's default geometry.
     * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
     * this name will be returned.
     * @param {string} name The property name of the default geometry.
     * @api
     */
    setGeometryName(name) {
      this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
      this.geometryName_ = name;
      this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
      this.handleGeometryChanged_();
    }
  }

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
    } else {
      /**
       * @type {Array<import("./style/Style.js").default>}
       */
      let styles;
      if (Array.isArray(obj)) {
        styles = obj;
      } else {
        assert(typeof (/** @type {?} */ (obj).getZIndex) === 'function', 41); // Expected an `import("./style/Style.js").Style` or an array of `import("./style/Style.js").Style`
        const style = /** @type {import("./style/Style.js").default} */ (obj);
        styles = [style];
      }
      return function () {
        return styles;
      };
    }
  }
  var Feature$1 = Feature;

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
    return (
      extent1[0] <= extent2[0] &&
      extent2[2] <= extent1[2] &&
      extent1[1] <= extent2[1] &&
      extent2[3] <= extent1[3]
    );
  }

  /**
   * Get the current computed width for the given element including margin,
   * padding and border.
   * Equivalent to jQuery's `$(el).outerWidth(true)`.
   * @param {!HTMLElement} element Element.
   * @return {number} The width.
   */
  function outerWidth(element) {
    let width = element.offsetWidth;
    const style = getComputedStyle(element);
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
    let height = element.offsetHeight;
    const style = getComputedStyle(element);
    height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);

    return height;
  }

  /**
   * @param {Node} node The node to remove.
   * @return {Node|null} The node that was removed or null.
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
  const CLASS_SELECTABLE = 'ol-selectable';

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

    /**
     * Triggered when loading of additional map data (tiles, images, features) starts.
     * @event module:ol/MapEvent~MapEvent#loadstart
     * @api
     */
    LOADSTART: 'loadstart',

    /**
     * Triggered when loading of additional map data has completed.
     * @event module:ol/MapEvent~MapEvent#loadend
     * @api
     */
    LOADEND: 'loadend',
  };

  /***
   * @typedef {'postrender'|'movestart'|'moveend'|'loadstart'|'loadend'} Types
   */

  /**
   * @module ol/Overlay
   */

  /**
   * @typedef {'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-center' | 'center-right' | 'top-left' | 'top-center' | 'top-right'} Positioning
   * The overlay position: `'bottom-left'`, `'bottom-center'`,  `'bottom-right'`,
   * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
   * `'top-center'`, or `'top-right'`.
   */

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
   * @property {Positioning} [positioning='top-left'] Defines how
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
   * `setPosition`, so that the overlay is entirely visible in the current viewport.
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
  const Property = {
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
   *     // ...
   *     const popup = new Overlay({
   *       element: document.getElementById('popup'),
   *     });
   *     popup.setPosition(coordinate);
   *     map.addOverlay(popup);
   *
   * @api
   */
  class Overlay extends BaseObject$1 {
    /**
     * @param {Options} options Overlay options.
     */
    constructor(options) {
      super();

      /***
       * @type {OverlayOnSignature<import("./events").EventsKey>}
       */
      this.on;

      /***
       * @type {OverlayOnSignature<import("./events").EventsKey>}
       */
      this.once;

      /***
       * @type {OverlayOnSignature<void>}
       */
      this.un;

      /**
       * @protected
       * @type {Options}
       */
      this.options = options;

      /**
       * @protected
       * @type {number|string|undefined}
       */
      this.id = options.id;

      /**
       * @protected
       * @type {boolean}
       */
      this.insertFirst =
        options.insertFirst !== undefined ? options.insertFirst : true;

      /**
       * @protected
       * @type {boolean}
       */
      this.stopEvent = options.stopEvent !== undefined ? options.stopEvent : true;

      /**
       * @protected
       * @type {HTMLElement}
       */
      this.element = document.createElement('div');
      this.element.className =
        options.className !== undefined
          ? options.className
          : 'ol-overlay-container ' + CLASS_SELECTABLE;
      this.element.style.position = 'absolute';
      this.element.style.pointerEvents = 'auto';

      /**
       * @protected
       * @type {PanIntoViewOptions|undefined}
       */
      this.autoPan = options.autoPan === true ? {} : options.autoPan || undefined;

      /**
       * @protected
       * @type {{transform_: string,
       *         visible: boolean}}
       */
      this.rendered = {
        transform_: '',
        visible: true,
      };

      /**
       * @protected
       * @type {?import("./events.js").EventsKey}
       */
      this.mapPostrenderListenerKey = null;

      this.addChangeListener(Property.ELEMENT, this.handleElementChanged);
      this.addChangeListener(Property.MAP, this.handleMapChanged);
      this.addChangeListener(Property.OFFSET, this.handleOffsetChanged);
      this.addChangeListener(Property.POSITION, this.handlePositionChanged);
      this.addChangeListener(Property.POSITIONING, this.handlePositioningChanged);

      if (options.element !== undefined) {
        this.setElement(options.element);
      }

      this.setOffset(options.offset !== undefined ? options.offset : [0, 0]);

      this.setPositioning(options.positioning || 'top-left');

      if (options.position !== undefined) {
        this.setPosition(options.position);
      }
    }

    /**
     * Get the DOM element of this overlay.
     * @return {HTMLElement|undefined} The Element containing the overlay.
     * @observable
     * @api
     */
    getElement() {
      return /** @type {HTMLElement|undefined} */ (this.get(Property.ELEMENT));
    }

    /**
     * Get the overlay identifier which is set on constructor.
     * @return {number|string|undefined} Id.
     * @api
     */
    getId() {
      return this.id;
    }

    /**
     * Get the map associated with this overlay.
     * @return {import("./Map.js").default|null} The map that the
     * overlay is part of.
     * @observable
     * @api
     */
    getMap() {
      return /** @type {import("./Map.js").default|null} */ (
        this.get(Property.MAP) || null
      );
    }

    /**
     * Get the offset of this overlay.
     * @return {Array<number>} The offset.
     * @observable
     * @api
     */
    getOffset() {
      return /** @type {Array<number>} */ (this.get(Property.OFFSET));
    }

    /**
     * Get the current position of this overlay.
     * @return {import("./coordinate.js").Coordinate|undefined} The spatial point that the overlay is
     *     anchored at.
     * @observable
     * @api
     */
    getPosition() {
      return /** @type {import("./coordinate.js").Coordinate|undefined} */ (
        this.get(Property.POSITION)
      );
    }

    /**
     * Get the current positioning of this overlay.
     * @return {Positioning} How the overlay is positioned
     *     relative to its point on the map.
     * @observable
     * @api
     */
    getPositioning() {
      return /** @type {Positioning} */ (this.get(Property.POSITIONING));
    }

    /**
     * @protected
     */
    handleElementChanged() {
      removeChildren(this.element);
      const element = this.getElement();
      if (element) {
        this.element.appendChild(element);
      }
    }

    /**
     * @protected
     */
    handleMapChanged() {
      if (this.mapPostrenderListenerKey) {
        removeNode(this.element);
        unlistenByKey(this.mapPostrenderListenerKey);
        this.mapPostrenderListenerKey = null;
      }
      const map = this.getMap();
      if (map) {
        this.mapPostrenderListenerKey = listen(
          map,
          MapEventType.POSTRENDER,
          this.render,
          this
        );
        this.updatePixelPosition();
        const container = this.stopEvent
          ? map.getOverlayContainerStopEvent()
          : map.getOverlayContainer();
        if (this.insertFirst) {
          container.insertBefore(this.element, container.childNodes[0] || null);
        } else {
          container.appendChild(this.element);
        }
        this.performAutoPan();
      }
    }

    /**
     * @protected
     */
    render() {
      this.updatePixelPosition();
    }

    /**
     * @protected
     */
    handleOffsetChanged() {
      this.updatePixelPosition();
    }

    /**
     * @protected
     */
    handlePositionChanged() {
      this.updatePixelPosition();
      this.performAutoPan();
    }

    /**
     * @protected
     */
    handlePositioningChanged() {
      this.updatePixelPosition();
    }

    /**
     * Set the DOM element to be associated with this overlay.
     * @param {HTMLElement|undefined} element The Element containing the overlay.
     * @observable
     * @api
     */
    setElement(element) {
      this.set(Property.ELEMENT, element);
    }

    /**
     * Set the map to be associated with this overlay.
     * @param {import("./Map.js").default|null} map The map that the
     * overlay is part of. Pass `null` to just remove the overlay from the current map.
     * @observable
     * @api
     */
    setMap(map) {
      this.set(Property.MAP, map);
    }

    /**
     * Set the offset for this overlay.
     * @param {Array<number>} offset Offset.
     * @observable
     * @api
     */
    setOffset(offset) {
      this.set(Property.OFFSET, offset);
    }

    /**
     * Set the position for this overlay. If the position is `undefined` the
     * overlay is hidden.
     * @param {import("./coordinate.js").Coordinate|undefined} position The spatial point that the overlay
     *     is anchored at.
     * @observable
     * @api
     */
    setPosition(position) {
      this.set(Property.POSITION, position);
    }

    /**
     * Pan the map so that the overlay is entirely visible in the current viewport
     * (if necessary) using the configured autoPan parameters
     * @protected
     */
    performAutoPan() {
      if (this.autoPan) {
        this.panIntoView(this.autoPan);
      }
    }

    /**
     * Pan the map so that the overlay is entirely visible in the current viewport
     * (if necessary).
     * @param {PanIntoViewOptions} [panIntoViewOptions] Options for the pan action
     * @api
     */
    panIntoView(panIntoViewOptions) {
      const map = this.getMap();

      if (!map || !map.getTargetElement() || !this.get(Property.POSITION)) {
        return;
      }

      const mapRect = this.getRect(map.getTargetElement(), map.getSize());
      const element = this.getElement();
      const overlayRect = this.getRect(element, [
        outerWidth(element),
        outerHeight(element),
      ]);

      panIntoViewOptions = panIntoViewOptions || {};

      const myMargin =
        panIntoViewOptions.margin === undefined ? 20 : panIntoViewOptions.margin;
      if (!containsExtent(mapRect, overlayRect)) {
        // the overlay is not completely inside the viewport, so pan the map
        const offsetLeft = overlayRect[0] - mapRect[0];
        const offsetRight = mapRect[2] - overlayRect[2];
        const offsetTop = overlayRect[1] - mapRect[1];
        const offsetBottom = mapRect[3] - overlayRect[3];

        const delta = [0, 0];
        if (offsetLeft < 0) {
          // move map to the left
          delta[0] = offsetLeft - myMargin;
        } else if (offsetRight < 0) {
          // move map to the right
          delta[0] = Math.abs(offsetRight) + myMargin;
        }
        if (offsetTop < 0) {
          // move map up
          delta[1] = offsetTop - myMargin;
        } else if (offsetBottom < 0) {
          // move map down
          delta[1] = Math.abs(offsetBottom) + myMargin;
        }

        if (delta[0] !== 0 || delta[1] !== 0) {
          const center = /** @type {import("./coordinate.js").Coordinate} */ (
            map.getView().getCenterInternal()
          );
          const centerPx = map.getPixelFromCoordinateInternal(center);
          if (!centerPx) {
            return;
          }
          const newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];

          const panOptions = panIntoViewOptions.animation || {};
          map.getView().animateInternal({
            center: map.getCoordinateFromPixelInternal(newCenterPx),
            duration: panOptions.duration,
            easing: panOptions.easing,
          });
        }
      }
    }

    /**
     * Get the extent of an element relative to the document
     * @param {HTMLElement} element The element.
     * @param {import("./size.js").Size} size The size of the element.
     * @return {import("./extent.js").Extent} The extent.
     * @protected
     */
    getRect(element, size) {
      const box = element.getBoundingClientRect();
      const offsetX = box.left + window.pageXOffset;
      const offsetY = box.top + window.pageYOffset;
      return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
    }

    /**
     * Set the positioning for this overlay.
     * @param {Positioning} positioning how the overlay is
     *     positioned relative to its point on the map.
     * @observable
     * @api
     */
    setPositioning(positioning) {
      this.set(Property.POSITIONING, positioning);
    }

    /**
     * Modify the visibility of the element.
     * @param {boolean} visible Element visibility.
     * @protected
     */
    setVisible(visible) {
      if (this.rendered.visible !== visible) {
        this.element.style.display = visible ? '' : 'none';
        this.rendered.visible = visible;
      }
    }

    /**
     * Update pixel position.
     * @protected
     */
    updatePixelPosition() {
      const map = this.getMap();
      const position = this.getPosition();
      if (!map || !map.isRendered() || !position) {
        this.setVisible(false);
        return;
      }

      const pixel = map.getPixelFromCoordinate(position);
      const mapSize = map.getSize();
      this.updateRenderedPosition(pixel, mapSize);
    }

    /**
     * @param {import("./pixel.js").Pixel} pixel The pixel location.
     * @param {import("./size.js").Size|undefined} mapSize The map size.
     * @protected
     */
    updateRenderedPosition(pixel, mapSize) {
      const style = this.element.style;
      const offset = this.getOffset();

      const positioning = this.getPositioning();

      this.setVisible(true);

      const x = Math.round(pixel[0] + offset[0]) + 'px';
      const y = Math.round(pixel[1] + offset[1]) + 'px';
      let posX = '0%';
      let posY = '0%';
      if (
        positioning == 'bottom-right' ||
        positioning == 'center-right' ||
        positioning == 'top-right'
      ) {
        posX = '-100%';
      } else if (
        positioning == 'bottom-center' ||
        positioning == 'center-center' ||
        positioning == 'top-center'
      ) {
        posX = '-50%';
      }
      if (
        positioning == 'bottom-left' ||
        positioning == 'bottom-center' ||
        positioning == 'bottom-right'
      ) {
        posY = '-100%';
      } else if (
        positioning == 'center-left' ||
        positioning == 'center-center' ||
        positioning == 'center-right'
      ) {
        posY = '-50%';
      }
      const transform = `translate(${posX}, ${posY}) translate(${x}, ${y})`;
      if (this.rendered.transform_ != transform) {
        this.rendered.transform_ = transform;
        style.transform = transform;
      }
    }

    /**
     * returns the options this Overlay has been created with
     * @return {Options} overlay options
     */
    getOptions() {
      return this.options;
    }
  }

  var Overlay$1 = Overlay;

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
   * modal-vanilla 0.12.0 <https://github.com/KaneCohen/modal-vanilla>
   * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
   * Available under BSD-3-Clause license
   */

  let _factory = null;

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

    if (!_factory) {
      _factory = document.createElement('div');
    }

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
      return '0.12.0';
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
      this._pointerInContent = false;
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
      this._options;
      let html = this._html;

      this._events.keydownHandler = this._handleKeydownEvent.bind(this);
      document.body.addEventListener('keydown',
        this._events.keydownHandler
      );

      this._events.mousedownHandler = this._handleMousedownEvent.bind(this);
      html.container.addEventListener('mousedown',
        this._events.mousedownHandler
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

    _handleMousedownEvent(e) {
      this._pointerInContent = false;
      let path = getPath(e.target);
      path.every(node => {
        if (node.classList && node.classList.contains('modal-content')) {
          this._pointerInContent = true;
          return false;
        }
        return true;
      });
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

        if (!this._pointerInContent && node.classList.contains('modal')) {
          this.emit('dismiss', this, e, null);
          this.hide();
          return false;
        }
        return true;
      });

      this._pointerInContent = false;
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

      this._html.container.removeEventListener('mousedown',
        this._events.mousedownHandler
      );

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

  // External
  let options = {};
  // Store layerNames that has errors
  const isError = new Set();
  const initModal = (opts) => {
      options = opts;
  };
  const parseError = (geoserverError) => {
      if ('exceptions' in geoserverError) {
          return geoserverError.exceptions.map((e) => e.text).join(',');
      }
      else {
          return '';
      }
  };
  /**
   * Show modal with errors
   *
   * @param msg
   * @private
   */
  const showError = (msg, originalError = null, layerName = '') => {
      // Prevent multiples modals error in the same layer
      if (isError.has(layerName)) {
          return;
      }
      isError.add(layerName);
      let err_msg = `<b>Error: ${msg}</b>`;
      if (originalError) {
          err_msg += `. ${originalError.message}`;
      }
      const al = Modal.alert(err_msg, options);
      al.show();
      al.on('hidden', () => {
          isError.delete(layerName);
      });
  };

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
          layerNotFound: 'Capa no encontrada',
          layerNotVisible: 'La capa no está visible',
          noValidGeometry: 'No se encontraron geometrías válidas para agregar a esta capa',
          geoserver: 'No se pudieron obtener datos desde el GeoServer',
          badFormat: 'Formato no soportado',
          badFile: 'Error al leer elementos del archivo',
          lockFeature: 'No se pudieron bloquear elementos en el GeoServer.',
          transaction: 'Error al hacer transacción con el GeoServer.',
          getFeatures: 'Error al obtener elemento desde el GeoServer.'
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
          layerNotFound: 'Layer not found',
          layerNotVisible: 'Layer is not visible',
          noValidGeometry: 'No valid geometries found to add to this layer',
          geoserver: 'Failed to get data from GeoServer',
          badFormat: 'Unsupported format',
          badFile: 'Error reading items from file',
          lockFeature: 'Could not lock items on the GeoServer.',
          transaction: 'Error when doing Transaction with GeoServer.',
          getFeatures: 'Error getting elements from GeoServer.'
      }
  };

  const zh = {
      labels: {
          select: '选择',
          addElement: '切换绘图类型',
          editElement: '编辑元素',
          save: '保存',
          delete: '删除',
          cancel: '取消',
          apply: '确认并应用改变',
          upload: '上传',
          editMode: '编辑模式',
          confirmDelete: '确认删除元素?',
          geomTypeNotSupported: '图层不支持该几何',
          editFields: '编辑区域',
          editGeom: '编辑几何',
          selectDrawType: '几何类型',
          uploadToLayer: '通过文件上传图层',
          uploadFeatures: '上传元素到图层',
          validFeatures: '合法的几何类型',
          invalidFeatures: '不合法',
          loading: '加载中...',
          toggleVisibility: '切换图层透明度',
          close: '关闭'
      },
      errors: {
          capabilities: '无法加载GeoServer服务所支持的能力.',
          wfst: 'GeoServer不支持事务',
          layer: '无法从图层获得数据',
          layerNotFound: 'Layer not found',
          layerNotVisible: 'Layer is not visible',
          noValidGeometry: '不支持的几何类型无法加载到图层',
          geoserver: '无法从GeoServer获取数据',
          badFormat: '不支持的格式',
          badFile: '读取文件数据出错',
          lockFeature: '无法锁定GeoServer上的元素.',
          transaction: 'GeoServer处理事务出错.',
          getFeatures: '从GeoServer获取元素出错.'
      }
  };

  const langs = {
      es,
      en,
      zh
  };
  // Set default Language
  let I18N = en;
  const setLang = (lang = 'en', customI18n = null) => {
      // Check if language exists
      if (lang in langs) {
          I18N = langs[lang];
      }
      // Check if customs translations are provided
      if (customI18n) {
          I18N = { ...I18N, ...customI18n };
      }
  };

  let loadingDiv;
  const initLoading = () => {
      loadingDiv = document.createElement('div');
      loadingDiv.className = 'ol-wfst--tools-control--loading';
      loadingDiv.innerHTML = I18N.labels.loading;
      return loadingDiv;
  };
  const showLoading = (bool = true) => {
      if (bool) {
          loadingDiv.classList.add('ol-wfst--tools-control--loading-show');
      }
      else {
          loadingDiv.classList.remove('ol-wfst--tools-control--loading-show');
      }
  };

  /**
   * Utility function that works like `Object.apply`, but copies getters and setters properly as well.  Additionally gives
   * the option to exclude properties by name.
   */
  const copyProps = (dest, src, exclude = []) => {
      const props = Object.getOwnPropertyDescriptors(src);
      for (let prop of exclude)
          delete props[prop];
      Object.defineProperties(dest, props);
  };
  /**
   * Returns the full chain of prototypes up until Object.prototype given a starting object.  The order of prototypes will
   * be closest to farthest in the chain.
   */
  const protoChain = (obj, currentChain = [obj]) => {
      const proto = Object.getPrototypeOf(obj);
      if (proto === null)
          return currentChain;
      return protoChain(proto, [...currentChain, proto]);
  };
  /**
   * Identifies the nearest ancestor common to all the given objects in their prototype chains.  For most unrelated
   * objects, this function should return Object.prototype.
   */
  const nearestCommonProto = (...objs) => {
      if (objs.length === 0)
          return undefined;
      let commonProto = undefined;
      const protoChains = objs.map(obj => protoChain(obj));
      while (protoChains.every(protoChain => protoChain.length > 0)) {
          const protos = protoChains.map(protoChain => protoChain.pop());
          const potentialCommonProto = protos[0];
          if (protos.every(proto => proto === potentialCommonProto))
              commonProto = potentialCommonProto;
          else
              break;
      }
      return commonProto;
  };
  /**
   * Creates a new prototype object that is a mixture of the given prototypes.  The mixing is achieved by first
   * identifying the nearest common ancestor and using it as the prototype for a new object.  Then all properties/methods
   * downstream of this prototype (ONLY downstream) are copied into the new object.
   *
   * The resulting prototype is more performant than softMixProtos(...), as well as ES5 compatible.  However, it's not as
   * flexible as updates to the source prototypes aren't captured by the mixed result.  See softMixProtos for why you may
   * want to use that instead.
   */
  const hardMixProtos = (ingredients, constructor, exclude = []) => {
      var _a;
      const base = (_a = nearestCommonProto(...ingredients)) !== null && _a !== void 0 ? _a : Object.prototype;
      const mixedProto = Object.create(base);
      // Keeps track of prototypes we've already visited to avoid copying the same properties multiple times.  We init the
      // list with the proto chain below the nearest common ancestor because we don't want any of those methods mixed in
      // when they will already be accessible via prototype access.
      const visitedProtos = protoChain(base);
      for (let prototype of ingredients) {
          let protos = protoChain(prototype);
          // Apply the prototype chain in reverse order so that old methods don't override newer ones.
          for (let i = protos.length - 1; i >= 0; i--) {
              let newProto = protos[i];
              if (visitedProtos.indexOf(newProto) === -1) {
                  copyProps(mixedProto, newProto, ['constructor', ...exclude]);
                  visitedProtos.push(newProto);
              }
          }
      }
      mixedProto.constructor = constructor;
      return mixedProto;
  };
  const unique = (arr) => arr.filter((e, i) => arr.indexOf(e) == i);

  // Keeps track of constituent classes for every mixin class created by ts-mixer.
  const mixins = new Map();
  const getMixinsForClass = (clazz) => mixins.get(clazz);
  const registerMixins = (mixedClass, constituents) => mixins.set(mixedClass, constituents);

  const mergeObjectsOfDecorators = (o1, o2) => {
      var _a, _b;
      const allKeys = unique([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]);
      const mergedObject = {};
      for (let key of allKeys)
          mergedObject[key] = unique([...((_a = o1 === null || o1 === void 0 ? void 0 : o1[key]) !== null && _a !== void 0 ? _a : []), ...((_b = o2 === null || o2 === void 0 ? void 0 : o2[key]) !== null && _b !== void 0 ? _b : [])]);
      return mergedObject;
  };
  const mergePropertyAndMethodDecorators = (d1, d2) => {
      var _a, _b, _c, _d;
      return ({
          property: mergeObjectsOfDecorators((_a = d1 === null || d1 === void 0 ? void 0 : d1.property) !== null && _a !== void 0 ? _a : {}, (_b = d2 === null || d2 === void 0 ? void 0 : d2.property) !== null && _b !== void 0 ? _b : {}),
          method: mergeObjectsOfDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.method) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.method) !== null && _d !== void 0 ? _d : {}),
      });
  };
  const mergeDecorators = (d1, d2) => {
      var _a, _b, _c, _d, _e, _f;
      return ({
          class: unique([...(_a = d1 === null || d1 === void 0 ? void 0 : d1.class) !== null && _a !== void 0 ? _a : [], ...(_b = d2 === null || d2 === void 0 ? void 0 : d2.class) !== null && _b !== void 0 ? _b : []]),
          static: mergePropertyAndMethodDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.static) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.static) !== null && _d !== void 0 ? _d : {}),
          instance: mergePropertyAndMethodDecorators((_e = d1 === null || d1 === void 0 ? void 0 : d1.instance) !== null && _e !== void 0 ? _e : {}, (_f = d2 === null || d2 === void 0 ? void 0 : d2.instance) !== null && _f !== void 0 ? _f : {}),
      });
  };
  const decorators = new Map();
  const findAllConstituentClasses = (...classes) => {
      var _a;
      const allClasses = new Set();
      const frontier = new Set([...classes]);
      while (frontier.size > 0) {
          for (let clazz of frontier) {
              const protoChainClasses = protoChain(clazz.prototype).map(proto => proto.constructor);
              const mixinClasses = (_a = getMixinsForClass(clazz)) !== null && _a !== void 0 ? _a : [];
              const potentiallyNewClasses = [...protoChainClasses, ...mixinClasses];
              const newClasses = potentiallyNewClasses.filter(c => !allClasses.has(c));
              for (let newClass of newClasses)
                  frontier.add(newClass);
              allClasses.add(clazz);
              frontier.delete(clazz);
          }
      }
      return [...allClasses];
  };
  const deepDecoratorSearch = (...classes) => {
      const decoratorsForClassChain = findAllConstituentClasses(...classes)
          .map(clazz => decorators.get(clazz))
          .filter(decorators => !!decorators);
      if (decoratorsForClassChain.length == 0)
          return {};
      if (decoratorsForClassChain.length == 1)
          return decoratorsForClassChain[0];
      return decoratorsForClassChain.reduce((d1, d2) => mergeDecorators(d1, d2));
  };

  function Mixin(...constructors) {
      var _a, _b, _c;
      const prototypes = constructors.map(constructor => constructor.prototype);
      function MixedClass(...args) {
          for (const constructor of constructors)
              // @ts-ignore: potentially abstract class
              copyProps(this, new constructor(...args));
      }
      MixedClass.prototype = hardMixProtos(prototypes, MixedClass)
          ;
      Object.setPrototypeOf(MixedClass, hardMixProtos(constructors, null, ['prototype'])
          );
      let DecoratedMixedClass = MixedClass;
      {
          const classDecorators = deepDecoratorSearch(...constructors)
              ;
          for (let decorator of (_a = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.class) !== null && _a !== void 0 ? _a : []) {
              const result = decorator(DecoratedMixedClass);
              if (result) {
                  DecoratedMixedClass = result;
              }
          }
          applyPropAndMethodDecorators((_b = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.static) !== null && _b !== void 0 ? _b : {}, DecoratedMixedClass);
          applyPropAndMethodDecorators((_c = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.instance) !== null && _c !== void 0 ? _c : {}, DecoratedMixedClass.prototype);
      }
      registerMixins(DecoratedMixedClass, constructors);
      return DecoratedMixedClass;
  }
  const applyPropAndMethodDecorators = (propAndMethodDecorators, target) => {
      const propDecorators = propAndMethodDecorators.property;
      const methodDecorators = propAndMethodDecorators.method;
      if (propDecorators)
          for (let key in propDecorators)
              for (let decorator of propDecorators[key])
                  decorator(target, key);
      if (methodDecorators)
          for (let key in methodDecorators)
              for (let decorator of methodDecorators[key])
                  decorator(target, key, Object.getOwnPropertyDescriptor(target, key));
  };

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
  var TransactionType;
  (function (TransactionType) {
      TransactionType["Insert"] = "insert";
      TransactionType["Delete"] = "delete";
      TransactionType["Update"] = "update";
  })(TransactionType || (TransactionType = {}));

  let map;
  let layerToInsertElements = null;
  let mode = null;
  var Modes;
  (function (Modes) {
      Modes["Edit"] = "EDIT";
      Modes["Draw"] = "DRAW";
  })(Modes || (Modes = {}));
  function activateMode(m = null) {
      mode = m;
  }
  function getMode() {
      return mode;
  }
  const editedFeatures = new Set();
  const mapLayers = {};
  function setMap(m) {
      map = m;
  }
  function getMap() {
      return map;
  }
  function setActiveLayerToInsertEls(layer) {
      layerToInsertElements = layer;
  }
  function getActiveLayerToInsertEls() {
      return layerToInsertElements;
  }
  function setMapLayers(data) {
      Object.assign(mapLayers, data);
  }
  function getStoredMapLayers() {
      return mapLayers;
  }
  function getStoredLayer(layerName) {
      return getStoredMapLayers()[layerName];
  }
  function addFeatureToEditedList(feature) {
      editedFeatures.add(String(feature.getId()));
  }
  function removeFeatureFromEditList(feature) {
      editedFeatures.delete(String(feature.getId()));
  }
  function isFeatureEdited(feature) {
      return editedFeatures.has(String(feature.getId()));
  }

  /**
   * Base class from which all layer types are derived.
   */
  class BaseLayer extends Layer {
      /**
       * @private
       */
      _init() {
          const geoserver = this.getGeoserver();
          if (geoserver.isLoaded()) {
              this.getAndUpdateDescribeFeatureType();
          }
          else {
              geoserver.on('change:capabilities', () => {
                  this.getAndUpdateDescribeFeatureType();
              });
          }
      }
      /**
       * Request and store data layers obtained by DescribeFeatureType
       *
       * @public
       */
      async getAndUpdateDescribeFeatureType() {
          const layerName = this.get(BaseLayerProperty.NAME);
          const layerLabel = this.get(BaseLayerProperty.LABEL);
          try {
              const geoserver = this.getGeoserver();
              const params = new URLSearchParams({
                  service: 'wfs',
                  version: geoserver.getAdvanced().describeFeatureTypeVersion,
                  request: 'DescribeFeatureType',
                  typeName: layerName,
                  outputFormat: 'application/json',
                  exceptions: 'application/json'
              });
              const url_fetch = geoserver.getUrl() + '?' + params.toString();
              const response = await fetch(url_fetch, {
                  headers: geoserver.getHeaders(),
                  credentials: geoserver.getCredentials()
              });
              if (!response.ok) {
                  throw new Error('');
              }
              const data = await response.json();
              if (!data) {
                  throw new Error('');
              }
              const targetNamespace = data.targetNamespace;
              const properties = data.featureTypes[0].properties;
              // Find the geometry field
              const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);
              data._parsed = {
                  namespace: targetNamespace,
                  properties: properties,
                  geomType: geom.localType,
                  geomField: geom.name
              };
              this.set(BaseLayerProperty.DESCRIBEFEATURETYPE, data);
          }
          catch (err) {
              console.error(err);
              throw new Error(`${I18N.errors.layer} "${layerLabel}"`);
          }
      }
      /**
       * @public
       * @returns
       */
      isVisibleByZoom() {
          return getMap().getView().getZoom() > this.getMinZoom();
      }
      /**
       *
       * @param mode
       * @param features
       * @public
       */
      async transactFeatures(mode, features) {
          const geoserver = this.getGeoserver();
          return geoserver.transact(mode, features, this.get(BaseLayerProperty.NAME));
      }
      async insertFeatures(features) {
          return this.transactFeatures(TransactionType.Insert, features);
      }
      /**
       * @public
       * @param featureId
       * @returns
       */
      async maybeLockFeature(featureId) {
          const geoserver = this.getGeoserver();
          if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
              return await geoserver.lockFeature(featureId, this.get(BaseLayerProperty.NAME));
          }
          return null;
      }
      /**
       *
       * @returns
       * @public
       */
      getGeoserver() {
          return this.get(BaseLayerProperty.GEOSERVER);
      }
      /**
       *
       * @returns
       * @public
       */
      getDescribeFeatureType() {
          return this.get(BaseLayerProperty.DESCRIBEFEATURETYPE);
      }
  }
  var BaseLayerProperty;
  (function (BaseLayerProperty) {
      BaseLayerProperty["NAME"] = "name";
      BaseLayerProperty["LABEL"] = "label";
      BaseLayerProperty["DESCRIBEFEATURETYPE"] = "describeFeatureType";
      BaseLayerProperty["ISVISIBLE"] = "isVisible";
      BaseLayerProperty["GEOSERVER"] = "geoserver";
  })(BaseLayerProperty || (BaseLayerProperty = {}));

  /**
   * Layer source to retrieve WFS features from geoservers
   * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
   *
   * @extends {ol/source/Vector~VectorSource}
   * @param options
   */
  class WfsSource extends VectorSource {
      urlParams = new URLSearchParams({
          SERVICE: 'wfs',
          REQUEST: 'GetFeature',
          OUTPUTFORMAT: 'application/json',
          EXCEPTIONS: 'application/json'
      });
      constructor(options) {
          super({
              ...options,
              format: new GeoJSON(),
              loader: async (extent, resolution, projection, success, failure) => {
                  try {
                      // If bbox, add extent to the request
                      if (options.strategy == loadingstrategy.bbox) {
                          const extentGeoServer = proj.transformExtent(extent, projection.getCode(), options.geoServerAdvanced.projection);
                          // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                          // request features using a bounding box with CRS maybe different from featureTypes native CRS
                          this.urlParams.set('bbox', extentGeoServer.toString() +
                              `,${options.geoServerAdvanced.projection}`);
                      }
                      const url_fetch = options.geoserverUrl + '?' + this.urlParams.toString();
                      const response = await fetch(url_fetch, {
                          headers: options.headers,
                          credentials: options.credentials
                      });
                      if (!response.ok) {
                          throw new Error('');
                      }
                      const data = await response.json();
                      if (data.exceptions) {
                          throw new Error(parseError(data));
                      }
                      const features = this.getFormat().readFeatures(data, {
                          featureProjection: projection.getCode(),
                          dataProjection: options.geoServerAdvanced.projection
                      });
                      features.forEach((feature) => {
                          feature.set('_layerName_', options.name, 
                          /* silent = */ true);
                      });
                      this.addFeatures(features);
                      success(features);
                  }
                  catch (err) {
                      this.removeLoadedExtent(extent);
                      showError(I18N.errors.geoserver, err, options.name);
                      failure();
                  }
              }
          });
          this.urlParams.set('version', options.geoServerAdvanced.getFeatureVersion);
          this.urlParams.set('typename', options.name);
          this.urlParams.set('srsName', options.geoServerAdvanced.projection.toString());
      }
  }

  /**
   * Layer to retrieve WFS features from geoservers
   * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
   *
   * @fires layerRendered
   * @extends {ol/layer/Vector~VectorLayer}
   * @param options
   */
  class WfsLayer extends Mixin(BaseLayer, (VectorLayer)) {
      _loadingCount = 0;
      _loadedCount = 0;
      beforeTransactFeature;
      constructor(options) {
          super({
              name: options.name,
              label: options.label || options.name,
              minZoom: options.minZoom,
              ...options
          });
          if (options.beforeTransactFeature) {
              this.beforeTransactFeature = options.beforeTransactFeature;
          }
          const geoserver = options.geoserver;
          const source = new WfsSource({
              name: options.name,
              geoserverUrl: geoserver.getUrl(),
              geoServerAdvanced: geoserver.getAdvanced(),
              ...(options.strategy && { strategy: options.strategy }),
              geoserverVendor: options.geoserverVendor
          });
          this._loadingCount = 0;
          this._loadedCount = 0;
          source.on('featuresloadstart', () => {
              this._loadingCount++;
              if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                  showLoading();
              }
          });
          source.on(['featuresloadend', 'featuresloaderror'], () => {
              this._loadedCount++;
              if (this._loadingCount === this._loadedCount) {
                  this._loadingCount = 0;
                  this._loadedCount = 0;
                  setTimeout(() => {
                      this.dispatchEvent('layerRendered');
                  }, 300);
              }
          });
          this.setSource(source);
          const geoserverOptions = options.geoserverVendor;
          Object.keys(geoserverOptions).forEach((param) => {
              source.urlParams.set(param, geoserverOptions[param]);
          });
      }
      /**
       * @public
       */
      refresh() {
          const source = this.getSource();
          // Refrescamos el wms
          source.refresh();
      }
      /**
       * Use this to update Geoserver Wms Vendors (https://docs.geoserver.org/latest/en/user/services/wms/vendor.html)
       * and other arguements (https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getmap)
       * in all the getMap requests.
       *
       * Example: you can use this to change the style of the WMS, add a custom sld, set a cql_filter, etc.
       *
       * @public
       * @param paramName
       * @param value Use `undefined` or `null` to remove the param
       * @param refresh
       */
      setCustomParam(paramName, value = null, refresh = true) {
          const source = this.getSource();
          if (value === undefined || value === null) {
              source.urlParams.delete(paramName);
          }
          else {
              source.urlParams.set(paramName, value);
          }
          if (refresh) {
              this.refresh();
          }
          return source.urlParams;
      }
  }

  /**
   * Layer source to retrieve WMS information from geoservers
   * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
   *
   * @extends {ol/source/TieWMS~TileWMS}
   * @param options
   */
  class WmsSource extends TileWMS {
      constructor(options) {
          super({
              url: options.geoserverUrl,
              serverType: 'geoserver',
              params: {
                  SERVICE: 'wms',
                  TILED: true,
                  LAYERS: options.name,
                  EXCEPTIONS: 'application/json',
                  ...(options.geoserverVendor && options.geoserverVendor)
              },
              tileLoadFunction: async (tile, src) => {
                  const blobToJson = (blob) => {
                      return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(JSON.parse(reader.result));
                          reader.readAsText(blob);
                      });
                  };
                  try {
                      const response = await fetch(src, {
                          headers: options.headers,
                          credentials: options.credentials
                      });
                      if (!response.ok) {
                          throw new Error('');
                      }
                      let data = await response.blob();
                      // Check if the response has an error
                      if (data.type == 'application/json') {
                          const parsedError = await blobToJson(data);
                          throw new Error(parseError(parsedError));
                      }
                      tile.getImage().src =
                          URL.createObjectURL(data);
                      tile.setState(TileState.LOADED);
                  }
                  catch (err) {
                      showError(I18N.errors.geoserver, err, options.name);
                      tile.setState(TileState.ERROR);
                  }
              },
              ...options
          });
      }
  }

  /**
   * Layer to retrieve WMS information from geoservers
   * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
   *
   * @fires layerRendered
   * @extends {ol/layer/Tile~TileLayer}
   * @param options
   */
  class WmsLayer extends Mixin(BaseLayer, (TileLayer)) {
      _loadingCount = 0;
      _loadedCount = 0;
      beforeTransactFeature;
      // Formats
      _formatGeoJSON;
      constructor(options) {
          super({
              name: options.name,
              label: options.label || options.name,
              minZoom: options.minZoom,
              ...options
          });
          if (options.beforeTransactFeature) {
              this.beforeTransactFeature = options.beforeTransactFeature;
          }
          this._formatGeoJSON = new format.GeoJSON();
          const geoserver = options.geoserver;
          const source = new WmsSource({
              name: options.name,
              geoserverUrl: geoserver.getUrl(),
              geoServerAdvanced: geoserver.getAdvanced(),
              geoserverVendor: options.geoserverVendor
          });
          this._loadingCount = 0;
          this._loadedCount = 0;
          source.on('tileloadstart', () => {
              this._loadingCount++;
              if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                  showLoading();
              }
          });
          source.on(['tileloadend', 'tileloaderror'], () => {
              this._loadedCount++;
              if (this._loadingCount === this._loadedCount) {
                  this._loadingCount = 0;
                  this._loadedCount = 0;
                  setTimeout(() => {
                      this.dispatchEvent('layerRendered');
                  }, 300);
              }
          });
          this.setSource(source);
      }
      /**
       * Get the features on the click area
       * @param evt
       * @returns
       * @private
       */
      async _getFeaturesByClickEvent(evt) {
          const coordinate = evt.coordinate;
          const view = getMap().getView();
          // Si la vista es lejana, disminumos el buffer
          // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
          // y mejorar la sensibilidad en IOS
          const buffer = view.getZoom() > 10 ? 10 : 5;
          const source = this.getSource();
          // Fallback to support a bad name
          // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
          const fallbackOl5 = 'getFeatureInfoUrl' in source
              ? 'getFeatureInfoUrl'
              : 'getGetFeatureInfoUrl';
          const url = source[fallbackOl5](coordinate, view.getResolution(), view.getProjection().getCode(), {
              INFO_FORMAT: 'application/json',
              BUFFER: buffer,
              FEATURE_COUNT: 1,
              EXCEPTIONS: 'application/json'
          });
          const geoserver = this.getGeoserver();
          try {
              const response = await fetch(url, {
                  headers: geoserver.getHeaders(),
                  credentials: geoserver.getCredentials()
              });
              if (!response.ok) {
                  throw new Error(`${I18N.errors.getFeatures} ${response.status}`);
              }
              const data = await response.json();
              const features = this._formatGeoJSON.readFeatures(data);
              return features;
          }
          catch (err) {
              showError(err.message, err);
          }
      }
      /**
       * @public
       */
      refresh() {
          const source = this.getSource();
          // Refrescamos el wms
          source.refresh();
          // Force refresh the tiles
          const params = source.getParams();
          params.t = new Date().getMilliseconds();
          source.updateParams(params);
      }
      /**
       * Use this to update Geoserver Wfs Vendors (https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html)
       * and other arguements (https://docs.geoserver.org/stable/en/user/services/wfs/reference.html)
       * in all the getFeature requests.
       *
       * Example: you can use this to set a cql_filter, limit the numbers of features, etc.
       *
       * @public
       * @param paramName
       * @param value
       * @param refresh
       */
      setCustomParam(paramName, value = null, refresh = true) {
          const source = this.getSource();
          source.updateParams({
              [paramName]: value
          });
          if (refresh) {
              this.refresh();
          }
          return source.getParams();
      }
  }

  function createElement(tagName, attrs = {}, ...children) {
      if (typeof tagName === 'function')
          return tagName(attrs, children);
      const elem = tagName === null
          ? new DocumentFragment()
          : document.createElement(tagName);
      Object.entries(attrs || {}).forEach(([name, value]) => {
          if (typeof value !== undefined &&
              value !== null &&
              value !== undefined) {
              if (name.startsWith('on') && name.toLowerCase() in window)
                  elem.addEventListener(name.toLowerCase().substr(2), value);
              else {
                  if (name === 'className')
                      elem.setAttribute('class', value.toString());
                  else if (name === 'htmlFor')
                      elem.setAttribute('for', value.toString());
                  else
                      elem.setAttribute(name, value.toString());
              }
          }
      });
      for (const child of children) {
          if (!child)
              continue;
          if (Array.isArray(child))
              elem.append(...child);
          else {
              if (child.nodeType === undefined)
                  elem.innerHTML += child;
              else
                  elem.appendChild(child);
          }
      }
      return elem;
  }

  var img$5 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

  var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

  var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

  var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

  /**
   * Removes in the DOM the class of the tools
   * @private
   */
  const resetStateButtons = () => {
      const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
      if (activeBtn) {
          activeBtn.classList.remove('wfst--active');
      }
  };
  const activateModeButtons = () => {
      const btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
      if (btn) {
          btn.classList.add('wfst--active');
      }
  };
  const activateDrawButton = () => {
      const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
      if (btn) {
          btn.classList.add('wfst--active');
      }
  };
  class LayersControl extends Observable$1 {
      _uploads;
      _uploadFormats;
      constructor(uploads, uploadFormats) {
          super();
          this._uploads = uploads;
          this._uploadFormats = uploadFormats;
      }
      /**
       *
       * @param layer
       * @public
       */
      addLayerEl(layer) {
          const container = document.querySelector('.wfst--tools-control--select-layers');
          const layerName = layer.get(BaseLayerProperty.NAME);
          const checked = layer === getActiveLayerToInsertEls() ? { checked: 'checked' } : {};
          const input = (createElement("input", { value: layerName, id: `wfst--${layerName}`, type: "radio", className: "ol-wfst--tools-control-input", name: "wfst--select-layer", ...checked, onchange: (evt) => this._layerChangeHandler(evt, layer) }));
          const layerDom = (createElement("div", { className: `wfst--layer-control 
                            ${layer.getVisible() ? 'ol-wfst--visible-on' : ''}
                            ${layer === getActiveLayerToInsertEls()
                ? 'ol-wfst--selected-on'
                : ''}`, "data-layer": layerName },
              createElement("div", { className: "ol-wfst--tools-control-visible" },
                  createElement("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on", title: I18N.labels.toggleVisibility, onclick: (evt) => this._visibilityClickHandler(evt) },
                      createElement("img", { src: img$3 })),
                  createElement("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off", title: I18N.labels.toggleVisibility, onclick: (evt) => this._visibilityClickHandler(evt) },
                      createElement("img", { src: img$2 }))),
              createElement("label", { htmlFor: `wfst--${layerName}` },
                  input,
                  createElement("span", { title: layer.getDescribeFeatureType()._parsed.geomType }, layer.get(BaseLayerProperty.LABEL)))));
          container.appendChild(layerDom);
          if (layer === getActiveLayerToInsertEls()) {
              input.dispatchEvent(new Event('change'));
          }
          return layerDom;
      }
      /**
       * Update geom Types availibles to select for this layer
       *
       * @param layerName
       * @param geomDrawTypeSelected
       * @private
       */
      _changeStateSelect(layer, geomDrawTypeSelected = null) {
          /**
           * Set the geometry type in the select according to the geometry of
           * the layer in the geoserver and disable what does not correspond.
           *
           * @param value
           * @param options
           * @private
           */
          const setSelectState = (value, options) => {
              Array.from(selectDraw.options).forEach((option) => {
                  option.selected = option.value === value ? true : false;
                  option.disabled =
                      options === 'all'
                          ? false
                          : options.includes(option.value)
                              ? false
                              : true;
                  option.title = option.disabled
                      ? I18N.labels.geomTypeNotSupported
                      : '';
              });
          };
          const selectDraw = document.querySelector('.wfst--tools-control--select-draw');
          let drawType;
          if (selectDraw) {
              const geomLayer = layer.getDescribeFeatureType()._parsed.geomType;
              if (geomDrawTypeSelected) {
                  drawType = selectDraw.value;
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
                      selectDraw.value = drawType;
                  }
                  else {
                      drawType = geomLayer;
                      setSelectState(drawType, [geomLayer]);
                  }
              }
          }
          return drawType;
      }
      _visibilityClickHandler(evt) {
          const btn = evt.currentTarget;
          const parentDiv = btn.closest('.wfst--layer-control');
          const layerName = parentDiv.dataset['layer'];
          parentDiv.classList.toggle('ol-wfst--visible-on');
          const layer = getStoredMapLayers()[layerName];
          if (parentDiv.classList.contains('ol-wfst--visible-on')) {
              layer.setVisible(true);
          }
          else {
              layer.setVisible(false);
          }
      }
      _layerChangeHandler(evt, layer) {
          const radioInput = evt.currentTarget;
          const parentDiv = radioInput.closest('.wfst--layer-control');
          // Deselect DOM previous layer
          const selected = document.querySelector('.ol-wfst--selected-on');
          if (selected)
              selected.classList.remove('ol-wfst--selected-on');
          // Select this layer
          parentDiv.classList.add('ol-wfst--selected-on');
          setActiveLayerToInsertEls(layer);
          this._changeStateSelect(layer);
      }
      render() {
          return (createElement(null, null,
              createElement("div", { className: "wfst--tools-control--head" },
                  this._uploads && (createElement("div", null,
                      createElement("input", { id: "ol-wfst--upload", type: "file", accept: this._uploadFormats, onchange: (evt) => this._uploads.process(evt) }),
                      createElement("label", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload", htmlFor: "ol-wfst--upload", title: I18N.labels.uploadToLayer },
                          createElement("img", { src: img$5 })))),
                  createElement("div", { className: "ol-wfst--tools-control-draw-cnt" },
                      createElement("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw", type: "button", title: I18N.labels.addElement, onclick: () => {
                              this.dispatchEvent('drawMode');
                          } },
                          createElement("img", { src: img$4 })),
                      createElement("select", { title: I18N.labels.selectDrawType, className: "wfst--tools-control--select-draw", onchange: (evt) => {
                              const selectedValue = evt.target
                                  .value;
                              this._changeStateSelect(getActiveLayerToInsertEls(), selectedValue);
                              this.dispatchEvent('changeGeom');
                          } }, [
                          GeometryType.Point,
                          GeometryType.MultiPoint,
                          GeometryType.LineString,
                          GeometryType.MultiLineString,
                          GeometryType.Polygon,
                          GeometryType.MultiPolygon,
                          GeometryType.Circle
                      ].map((type) => {
                          // Show all options, but enable only the accepted ones
                          return createElement("option", { value: type }, type);
                      })))),
              createElement("div", { className: "wfst--tools-control--select-layers" })));
      }
  }

  let editLayer = new VectorLayer({
      source: new VectorSource(),
      zIndex: 100
  });
  const getEditLayer = () => {
      return editLayer;
  };

  // Ol
  class Uploads extends Observable$1 {
      _options;
      // Formats
      _formatWFS;
      _formatGeoJSON;
      _formatKml;
      _xs;
      _processUpload;
      constructor(options) {
          super();
          this._options = options;
          this._processUpload = options.processUpload;
          // Formats
          this._formatWFS = new format.WFS();
          this._formatGeoJSON = new format.GeoJSON();
          this._formatKml = new format.KML({
              extractStyles: false,
              showPointNames: false
          });
          this._xs = new XMLSerializer();
      }
      /**
       * Parse and check geometry of uploaded files
       *
       * @param evt
       * @public
       */
      async process(evt) {
          const map = getMap();
          const view = map.getView();
          const file = evt.target.files[0];
          let features;
          if (!file) {
              return;
          }
          const extension = file.name.split('.').pop().toLowerCase();
          try {
              // If the user uses a custom fucntion...
              if (this._processUpload) {
                  features = this._processUpload(file);
              }
              // If the user functions return features, we dont process anything more
              if (!features) {
                  const string = await this._fileReader(file);
                  if (extension === 'geojson' || extension === 'json') {
                      features = this._formatGeoJSON.readFeatures(string, {
                          featureProjection: view.getProjection().getCode()
                      });
                  }
                  else if (extension === 'kml') {
                      features = this._formatKml.readFeatures(string, {
                          featureProjection: view.getProjection().getCode()
                      });
                  }
                  else {
                      showError(I18N.errors.badFormat);
                  }
              }
              let invalidFeaturesCount = 0;
              let validFeaturesCount = 0;
              const featuresToInsert = [];
              for (let feature of features) {
                  // If the geometry doesn't correspond to the layer, try to fixit.
                  // If we can't, don't use it
                  if (!this._checkGeometry(feature)) {
                      feature = this._fixGeometry(feature);
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
                  showError(I18N.errors.noValidGeometry);
              }
              else {
                  resetStateButtons();
                  this.dispatchEvent(new VectorSource.VectorSourceEvent('loadedFeatures', null, featuresToInsert));
                  const content = `
            ${I18N.labels.validFeatures}: ${validFeaturesCount}<br>
            ${invalidFeaturesCount
                    ? `${I18N.labels.invalidFeatures}: ${invalidFeaturesCount}`
                    : ''}`;
                  this._initModal(content, featuresToInsert);
              }
              // Reset the input to allow another onChange trigger
              evt.target.value = null;
          }
          catch (err) {
              showError(I18N.errors.badFile, err);
          }
      }
      /**
       * Read data file
       * @param file
       * @public
       */
      async _fileReader(file) {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.addEventListener('load', async (e) => {
                  const fileData = e.target.result;
                  resolve(fileData);
              });
              reader.addEventListener('error', (err) => {
                  console.error('Error' + err);
                  reject();
              });
              reader.readAsText(file);
          });
      }
      /**
       * Attemp to change the geometry feature to the layer
       * @param feature
       * @private
       */
      _fixGeometry(feature) {
          // Geometry of the layer
          const geomTypeLayer = getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
              .geomType;
          const geomTypeFeature = feature.getGeometry().getType();
          let geom$1;
          switch (geomTypeFeature) {
              case GeometryType.Point: {
                  if (geomTypeLayer === GeometryType.MultiPoint) {
                      const coords = feature.getGeometry().getCoordinates();
                      geom$1 = new geom.MultiPoint([coords]);
                  }
                  break;
              }
              case GeometryType.LineString:
                  if (geomTypeLayer === GeometryType.MultiLineString) {
                      const coords = feature.getGeometry().getCoordinates();
                      geom$1 = new geom.MultiLineString([coords]);
                  }
                  break;
              case GeometryType.Polygon:
                  if (geomTypeLayer === GeometryType.MultiPolygon) {
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
      }
      /**
       * Check if the feature has the same geometry as the target layer
       * @param feature
       * @private
       */
      _checkGeometry(feature) {
          // Geometry of the layer
          const geomTypeLayer = getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
              .geomType;
          const geomTypeFeature = feature.getGeometry().getType();
          // This geom accepts every type of geometry
          if (geomTypeLayer === GeometryType.GeometryCollection) {
              return true;
          }
          return geomTypeFeature === geomTypeLayer;
      }
      /**
       * Confirm modal before transact to the GeoServer the features in the file
       *
       * @param content
       * @param featuresToInsert
       * @private
       */
      _initModal(content, featuresToInsert) {
          const footer = `
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
            ${I18N.labels.cancel}
        </button>
        <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
            ${I18N.labels.upload}
        </button>
    `;
          const modal = new Modal({
              ...this._options.modal,
              header: true,
              headerClose: false,
              title: I18N.labels.uploadFeatures +
                  ' ' +
                  getActiveLayerToInsertEls().get(BaseLayerProperty.NAME),
              content: content,
              backdrop: 'static',
              footer: footer
          }).show();
          modal.on('dismiss', (modal, event) => {
              // On saving changes
              if (event.target.dataset.action === 'save') {
                  this.dispatchEvent(new VectorSource.VectorSourceEvent('addedFeatures', null, featuresToInsert));
              }
              else {
                  // On cancel button
                  getEditLayer().getSource().clear();
              }
          });
      }
  }

  /**
   * @param target
   * @param sources
   * @returns
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

  const DEFAULT_LANGUAGE = 'en';
  const getDefaultOptions = () => {
      return {
          layers: null,
          evtType: 'singleclick',
          active: true,
          showControl: true,
          language: DEFAULT_LANGUAGE,
          uploadFormats: '.geojson,.json,.kml',
          processUpload: null,
          modal: {
              animateClass: 'fade',
              animateInClass: 'show',
              transition: 300,
              backdropTransition: 150,
              templates: {
                  dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                  headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${I18N.labels.close}"><span aria-hidden="true">×</span></button>`
              }
          }
      };
  };

  class EditControlChangesEl extends control.Control {
      constructor(feature) {
          super({
              element: (createElement("div", { className: "ol-wfst--changes-control" },
                  createElement("div", { className: "ol-wfst--changes-control-el" },
                      createElement("div", { className: "ol-wfst--changes-control-id" },
                          createElement("b", null, I18N.labels.editMode),
                          " -",
                          ' ',
                          createElement("i", null, String(feature.getId()))),
                      createElement("button", { type: "button", className: "btn btn-sm btn-secondary", onclick: () => {
                              this.dispatchEvent(new VectorSource.VectorSourceEvent('cancel', feature));
                          } }, I18N.labels.cancel),
                      createElement("button", { type: "button", className: "btn btn-sm btn-primary", onclick: () => {
                              this.dispatchEvent(new VectorSource.VectorSourceEvent('apply', feature));
                          } }, I18N.labels.apply),
                      createElement("button", { type: "button", className: "btn btn-sm btn-danger-outline", onclick: () => {
                              this.dispatchEvent(new VectorSource.VectorSourceEvent('delete', feature));
                          } }, I18N.labels.delete))))
          });
      }
  }

  // Ol
  /**
   * Master style that handles two modes on the Edit Layer:
   * - one is the basic, showing only the vertices
   * - and the other when modify is active, showing bigger vertices
   *
   * @param feature
   * @private
   */
  function styleFunction(feature) {
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
              if (getMode() === Modes.Edit) {
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
              if (getMode() == Modes.Draw || getMode() == Modes.Edit) {
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

  // Ol
  /**
   * Shows a fields form in a modal window to allow changes in the properties of the feature.
   *
   * @param feature
   * @private
   */
  class EditFieldsModal extends Observable$1 {
      _options;
      _modal;
      _feature;
      constructor(options) {
          super();
          this._options = options;
          const footer = `
            <button type="button" class="btn btn-sm btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${I18N.labels.delete}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${I18N.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${I18N.labels.save}
            </button>
        `;
          this._modal = new Modal({
              ...this._options,
              header: true,
              headerClose: true,
              title: '',
              content: '<div></div>',
              footer: footer
          });
          this._modal.on('dismiss', (modal, event) => {
              // On saving changes
              if (event.target.dataset.action === 'save') {
                  const inputs = modal.el.querySelectorAll('input');
                  inputs.forEach((el) => {
                      const value = el.value;
                      const field = el.name;
                      this._feature.set(field, value, /*isSilent = */ true);
                  });
                  this._feature.changed();
                  addFeatureToEditedList(this._feature);
                  this.dispatchEvent(new VectorSource.VectorSourceEvent('save', this._feature));
              }
              else if (event.target.dataset.action === 'delete') {
                  this.dispatchEvent(new VectorSource.VectorSourceEvent('delete', this._feature));
              }
          });
      }
      show(feature) {
          this._feature = feature;
          const title = `${I18N.labels.editElement} ${feature.getId()} `;
          const properties = feature.getProperties();
          const layerName = feature.get('_layerName_');
          // Data schema from the geoserver
          const layer = getStoredLayer(layerName);
          const dataSchema = layer.getDescribeFeatureType()._parsed.properties;
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
          this._modal._html.body.innerHTML = content;
          this._modal._html.header.innerHTML = title;
          this._modal.show();
      }
  }

  // Ol
  // https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
  // Axis ordering: latitude/longitude
  const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';
  /**
   * @fires change:capabilities
   * @extends {ol/Object~BaseObject}
   * @param options
   */
  class Geoserver extends BaseObject$2 {
      _options;
      _countRequests;
      _insertFeatures;
      _updateFeatures;
      _deleteFeatures;
      // Formats
      _formatWFS;
      _formatGeoJSON;
      _formatKml;
      _xs;
      state_;
      constructor(options) {
          super();
          const defaults = {
              url: null,
              advanced: {
                  getCapabilitiesVersion: '1.3.0',
                  getFeatureVersion: '1.0.0',
                  describeFeatureTypeVersion: '1.1.0',
                  lockFeatureVersion: '1.1.0',
                  wfsTransactionVersion: '1.1.0',
                  projection: DEFAULT_GEOSERVER_SRS,
                  lockFeatureParams: {
                      expiry: 5,
                      lockId: 'GeoServer',
                      releaseAction: 'SOME'
                  }
              },
              headers: {},
              credentials: 'same-origin',
              useLockFeature: true
          };
          this._options = deepObjectAssign(defaults, options);
          this.setAdvanced(this._options.advanced);
          this.setHeaders(this._options.headers);
          this.setCredentials(this._options.credentials);
          this.setUrl(this._options.url);
          this.setUseLockFeature(this._options.useLockFeature);
          this._countRequests = 0;
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
          this.getAndUpdateCapabilities();
          this.on('change:capabilities', () => {
              this._checkGeoserverCapabilities();
          });
      }
      /**
       *
       * @returns
       * @public
       */
      getCapabilities() {
          return this.get(GeoserverProperty.CAPABILITIES);
      }
      /**
       *
       * @param url
       * @param opt_silent
       * @public
       */
      setUrl(url, opt_silent = false) {
          this.set(GeoserverProperty.URL, url, opt_silent);
      }
      /**
       *
       * @returns
       */
      getUrl() {
          return this.get(GeoserverProperty.URL);
      }
      /**
       *
       * @param headers
       * @param opt_silent
       * @returns
       * @public
       */
      setHeaders(headers = {}, opt_silent = false) {
          return this.set(GeoserverProperty.HEADERS, headers, opt_silent);
      }
      /**
       *
       * @returns
       * @public
       */
      getHeaders() {
          return this.get(GeoserverProperty.HEADERS);
      }
      /**
       *
       * @param credentials
       * @param opt_silent
       * @public
       */
      setCredentials(credentials = null, opt_silent = false) {
          this.set(GeoserverProperty.CREDENTIALS, credentials, opt_silent);
      }
      /**
       *
       * @returns
       * @public
       */
      getCredentials() {
          return this.get(GeoserverProperty.CREDENTIALS);
      }
      /**
       *
       * @returns
       * @public
       */
      setAdvanced(advanced = {}, opt_silent = false) {
          this.set(GeoserverProperty.ADVANCED, advanced, opt_silent);
      }
      /**
       *
       * @returns
       * @public
       */
      getAdvanced() {
          return this.get(GeoserverProperty.ADVANCED);
      }
      /**
       *
       * @returns
       * @public
       */
      hasTransaction() {
          return this.get(GeoserverProperty.HASTRASNACTION);
      }
      /**
       *
       * @returns
       * @public
       */
      hasLockFeature() {
          return this.get(GeoserverProperty.HASLOCKFEATURE);
      }
      /**
       *
       * @returns
       * @public
       */
      getUseLockFeature() {
          return this.get(GeoserverProperty.USELOCKFEATURE);
      }
      /**
       *
       * @returns
       * @public
       */
      setUseLockFeature(useLockFeature, opt_silent = false) {
          this.set(GeoserverProperty.USELOCKFEATURE, useLockFeature, opt_silent);
      }
      /**
       *
       * @returns
       * @public
       */
      isLoaded() {
          return this.get(GeoserverProperty.ISLOADED);
      }
      /**
       *
       * @returns
       */
      getState() {
          return this.state_;
      }
      /**
       * Get the capabilities from the GeoServer and check
       * all the available operations.
       *
       * @fires getcapabilities
       * @public
       */
      async getAndUpdateCapabilities() {
          try {
              const params = new URLSearchParams({
                  service: 'wfs',
                  version: this.getAdvanced().getCapabilitiesVersion,
                  request: 'GetCapabilities',
                  exceptions: 'application/json'
              });
              const url_fetch = this.getUrl() + '?' + params.toString();
              const response = await fetch(url_fetch, {
                  headers: this.getHeaders(),
                  credentials: this.getCredentials()
              });
              if (!response.ok) {
                  throw new Error('');
              }
              const data = await response.text();
              const capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
              this.set(GeoserverProperty.CAPABILITIES, capabilities);
              this.state_ = capabilities ? 'ready' : 'error';
              return capabilities;
          }
          catch (err) {
              console.error(err);
              const msg = typeof err === 'string' ? err : I18N.errors.capabilities;
              showError(msg, err);
          }
      }
      /**
       *
       * @private
       */
      _checkGeoserverCapabilities() {
          // Available operations in the geoserver
          const operations = this.getCapabilities().getElementsByTagName('ows:Operation');
          Array.from(operations).forEach((operation) => {
              if (operation.getAttribute('name') === 'Transaction') {
                  this.set(GeoserverProperty.HASTRASNACTION, true);
              }
              else if (operation.getAttribute('name') === 'LockFeature') {
                  this.set(GeoserverProperty.HASLOCKFEATURE, true);
              }
              else if (operation.getAttribute('name') === 'DescribeFeatureType') {
                  this.set(GeoserverProperty.HASDESCRIBEFEATURETYPE, true);
              }
          });
          if (!this.hasTransaction()) {
              throw I18N.errors.wfst;
          }
      }
      /**
       * Make the WFS Transactions
       *
       * @param transactionType
       * @param features
       * @param layerName
       * @private
       */
      async transact(transactionType, features, layerName) {
          features = Array.isArray(features) ? features : [features];
          const clonedFeatures = [];
          const geoLayer = getStoredLayer(layerName);
          for (const feature of features) {
              let clone = this._cloneFeature(feature);
              const cloneGeom = clone.getGeometry();
              // Ugly fix to support GeometryCollection on GML
              // See https://github.com/openlayers/openlayers/issues/4220
              if (cloneGeom instanceof geom.GeometryCollection) {
                  this._transformGeoemtryCollectionToGeometries(clone, cloneGeom);
              }
              else if (cloneGeom instanceof geom.Circle) {
                  // Geoserver has no Support to Circles
                  this._transformCircleToPolygon(clone, cloneGeom);
              }
              // Filters
              if ('beforeTransactFeature' in geoLayer &&
                  typeof geoLayer.beforeTransactFeature === 'function') {
                  clone = geoLayer.beforeTransactFeature(clone, transactionType);
              }
              if (clone) {
                  clonedFeatures.push(clone);
              }
          }
          if (!clonedFeatures.length) {
              showError(I18N.errors.noValidGeometry);
              return false;
          }
          switch (transactionType) {
              case TransactionType.Insert:
                  this._insertFeatures = [
                      ...this._insertFeatures,
                      ...clonedFeatures
                  ];
                  break;
              case TransactionType.Update:
                  this._updateFeatures = [
                      ...this._updateFeatures,
                      ...clonedFeatures
                  ];
                  break;
              case TransactionType.Delete:
                  this._deleteFeatures = [
                      ...this._deleteFeatures,
                      ...clonedFeatures
                  ];
                  break;
          }
          this._countRequests++;
          const numberRequest = this._countRequests;
          return new Promise((resolve, reject) => {
              setTimeout(async () => {
                  try {
                      // Prevent fire multiples times
                      if (numberRequest !== this._countRequests) {
                          return;
                      }
                      let srs = getMap().getView().getProjection().getCode();
                      // Force latitude/longitude order on transactions
                      // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                      srs =
                          srs === 'EPSG:4326'
                              ? 'urn:x-ogc:def:crs:EPSG:4326'
                              : srs;
                      const describeFeatureType = geoLayer.getDescribeFeatureType()._parsed;
                      if (!geoLayer) {
                          throw new Error(I18N.errors.layerNotFound);
                      }
                      const options = {
                          featureNS: describeFeatureType.namespace,
                          featureType: layerName,
                          srsName: srs,
                          featurePrefix: null,
                          nativeElements: null,
                          version: this.getAdvanced().wfsTransactionVersion
                      };
                      const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                      let payload = this._xs.serializeToString(transaction);
                      const geomType = describeFeatureType.geomType;
                      const geomField = describeFeatureType.geomField;
                      // Ugly fix to support GeometryCollection on GML
                      // See https://github.com/openlayers/openlayers/issues/4220
                      if (geomType === GeometryType.GeometryCollection) {
                          if (transactionType === TransactionType.Insert) {
                              payload = payload.replace(/<geometry>/g, `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`);
                              payload = payload.replace(/<\/geometry>/g, `</geometryMember></MultiGeometry></geometry>`);
                          }
                          else if (transactionType === TransactionType.Update) {
                              const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                              const gmemberOut = `</geometryMember></MultiGeometry>`;
                              payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, `$1$2${gmemberIn}$3${gmemberOut}$4$5`);
                          }
                      }
                      // Fixes geometry name, weird bug with GML:
                      // The property for the geometry column is always named "geometry"
                      if (transactionType === TransactionType.Insert) {
                          payload = payload.replace(/<(\/?)\bgeometry\b>/g, `<$1${geomField}>`);
                      }
                      else {
                          payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                      }
                      // This has to be te same used before
                      if (this.hasLockFeature &&
                          this.getUseLockFeature() &&
                          transactionType !== TransactionType.Insert) {
                          payload = payload.replace(`</Transaction>`, `<LockId>${this._options.advanced.lockFeatureParams.lockId}</LockId></Transaction>`);
                      }
                      const headers = {
                          'Content-Type': 'text/xml',
                          ...this.getHeaders()
                      };
                      const response = await fetch(this.getUrl(), {
                          method: 'POST',
                          body: payload,
                          headers: headers,
                          credentials: this._options.credentials
                      });
                      if (!response.ok) {
                          throw new Error(I18N.errors.transaction + ' ' + response.status);
                      }
                      const parseResponse = this._formatWFS.readTransactionResponse(await response.text());
                      if (!Object.keys(parseResponse).length) {
                          const responseStr = await response.text();
                          const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                          if (findError) {
                              throw new Error(findError[1]);
                          }
                      }
                      if (transactionType !== TransactionType.Delete) {
                          for (const feature of features) {
                              getEditLayer().getSource().removeFeature(feature);
                          }
                      }
                      const wlayer = getStoredLayer(layerName);
                      wlayer.refresh();
                      showLoading(false);
                      this._insertFeatures = [];
                      this._updateFeatures = [];
                      this._deleteFeatures = [];
                      this._countRequests = 0;
                      resolve(parseResponse);
                  }
                  catch (err) {
                      showError(err.message, err);
                      showLoading(false);
                      this._countRequests = 0;
                      reject();
                  }
              }, 0);
          });
      }
      /**
       *
       * @param feature
       * @param geom
       * @private
       */
      _transformCircleToPolygon(feature, geom) {
          const geomConverted = Polygon.fromCircle(geom);
          feature.setGeometry(geomConverted);
      }
      /**
       *
       * @param feature
       * @private
       * @param geom
       */
      _transformGeoemtryCollectionToGeometries(feature, geom$1) {
          let geomConverted = geom$1.getGeometries()[0];
          if (geomConverted instanceof geom.Circle) {
              geomConverted = Polygon.fromCircle(geomConverted);
          }
          feature.setGeometry(geomConverted);
      }
      /**
       *
       * @param feature
       * @returns
       * @private
       */
      _cloneFeature(feature) {
          removeFeatureFromEditList(feature);
          const featureProperties = feature.getProperties();
          delete featureProperties.boundedBy;
          delete featureProperties._layerName_;
          const clone = new Feature$1(featureProperties);
          clone.setId(feature.getId());
          return clone;
      }
      /**
       * Lock a feature in the geoserver. Useful before editing a geometry,
       * to avoid changes from multiples suers
       *
       * @param featureId
       * @param layerName
       * @param retry
       * @public
       */
      async lockFeature(featureId, layerName, retry = 0) {
          const params = new URLSearchParams({
              service: 'wfs',
              version: this.getAdvanced().lockFeatureVersion,
              request: 'LockFeature',
              typeName: layerName,
              expiry: String(this._options.advanced.lockFeatureParams.expiry),
              LockId: this._options.advanced.lockFeatureParams.lockId,
              releaseAction: this._options.advanced.lockFeatureParams.releaseAction,
              exceptions: 'application/json',
              featureid: `${featureId}`
          });
          const url_fetch = this.getUrl() + '?' + params.toString();
          try {
              const response = await fetch(url_fetch, {
                  headers: this._options.headers,
                  credentials: this._options.credentials
              });
              if (!response.ok) {
                  throw new Error(I18N.errors.lockFeature);
              }
              const data = await response.text();
              try {
                  // First, check if is a JSON (with errors)
                  const dataParsed = JSON.parse(data);
                  if ('exceptions' in dataParsed) {
                      const exceptions = dataParsed.exceptions;
                      if (exceptions[0].code === 'CannotLockAllFeatures') {
                          // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                          if (!retry) {
                              this.lockFeature(featureId, layerName, 1);
                          }
                          else {
                              showError(I18N.errors.lockFeature, exceptions);
                          }
                      }
                      else {
                          showError(exceptions[0].text, exceptions);
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
              showError(err.message, err);
          }
      }
  }
  var GeoserverProperty;
  (function (GeoserverProperty) {
      GeoserverProperty["CAPABILITIES"] = "capabilities";
      GeoserverProperty["URL"] = "url";
      GeoserverProperty["HEADERS"] = "headers";
      GeoserverProperty["CREDENTIALS"] = "credentials";
      GeoserverProperty["ADVANCED"] = "advanced";
      GeoserverProperty["HASTRASNACTION"] = "hasTransaction";
      GeoserverProperty["HASLOCKFEATURE"] = "hasLockFeature";
      GeoserverProperty["HASDESCRIBEFEATURETYPE"] = "hasDescribeFeatureType";
      GeoserverProperty["USELOCKFEATURE"] = "useLockFeature";
      GeoserverProperty["ISLOADED"] = "isLoaded";
  })(GeoserverProperty || (GeoserverProperty = {}));

  var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

  var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

  class EditOverlay extends Overlay$1 {
      constructor(feature, coordinate = null) {
          super({
              id: feature.getId(),
              position: coordinate || extent.getCenter(feature.getGeometry().getExtent()),
              positioning: 'center-center',
              offset: [0, -40],
              stopEvent: true,
              element: (createElement("div", null,
                  createElement("div", { className: "ol-wfst--edit-button-cnt", onclick: () => {
                          this.dispatchEvent('editFields');
                      } },
                      createElement("button", { className: "ol-wfst--edit-button", type: "button", title: I18N.labels.editFields },
                          createElement("img", { src: img$1, alt: I18N.labels.editFields }))),
                  createElement("div", { className: "ol-wfst--edit-button-cnt", onclick: () => {
                          this.dispatchEvent('editGeom');
                      } },
                      createElement("button", { class: "ol-wfst--edit-button", type: "button", title: I18N.labels.editGeom },
                          createElement("img", { src: img, alt: I18N.labels.editGeom })))))
          });
      }
  }

  const controlElement = document.createElement('div');
  /**
   * Tiny WFST-T client to insert (drawing/uploading), modify and delete
   * features on GeoServers using OpenLayers. Layers with these types
   * of geometries are supported: "GeometryCollection" (in this case, you can
   * choose the geometry type of each element to draw), "Point", "MultiPoint",
   * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
   *
   * @constructor
   * @fires modifystart
   * @fires modifyend
   * @fires drawstart
   * @fires drawend
   * @fires load
   * @fires describeFeatureType
   * @extends {ol/control/Control~Control}
   * @param options Wfst options, see [Wfst Options](#options) for more details.
   */
  class Wfst extends control.Control {
      _options;
      _i18n;
      // Ol
      _map;
      _view;
      _viewport;
      _initialized = false;
      _layersControl;
      _overlay;
      // Interactions
      _interactionWfsSelect;
      _interactionSelectModify;
      _collectionModify;
      _interactionModify;
      _interactionSnap;
      _interactionDraw;
      // Obserbable keys
      _keyClickWms;
      _keyRemove;
      _keySelect;
      // Controls
      _controlApplyDiscardChanges;
      _controlWidgetToolsDiv;
      _selectDraw;
      // State
      _currentZoom;
      _lastZoom;
      // Editing
      _editFeature;
      _editFeatureOriginal;
      _uploads;
      _editFields;
      constructor(options) {
          super({
              target: null,
              element: controlElement,
              render: () => {
                  if (!this._map)
                      this._init();
              }
          });
          setLang(options.language, options.i18n);
          const defaultOptions = getDefaultOptions();
          this._options = deepObjectAssign(defaultOptions, options);
          // By default, the first layer is ready to accept new draws
          setActiveLayerToInsertEls(this._options.layers[0]);
          this._controlWidgetToolsDiv = controlElement;
          this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
          this._uploads = new Uploads(this._options);
          this._editFields = new EditFieldsModal(this._options.modal);
      }
      /**
       * Get all the layers in the ol-wfst instance
       * @public
       */
      getLayers() {
          return Object.values(getStoredMapLayers());
      }
      /**
       * Get a layer
       * @public
       */
      getLayerByName(layerName = '') {
          const layers = getStoredMapLayers();
          if (layerName && layerName in layers) {
              return layers[layerName];
          }
          return null;
      }
      /**
       * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
       * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
       * @fires describeFeatureType
       * @private
       */
      async _initMapAndLayers() {
          try {
              const layers = this._options.layers;
              if (layers.length) {
                  let layerRendered = 0;
                  let layersNumber = 0; // Only count visibles
                  layers.forEach((layer) => {
                      if (layer.getVisible())
                          layersNumber++;
                      layer.on('layerRendered', () => {
                          layerRendered++;
                          if (layerRendered >= layersNumber) {
                              // run only once
                              if (!this._initialized) {
                                  this.dispatchEvent('load');
                                  this._initialized = true;
                              }
                              showLoading(false);
                          }
                      });
                      layer.on('change:describeFeatureType', () => {
                          const domEl = this._layersControl.addLayerEl(layer);
                          layer.on('change:isVisible', () => {
                              const layerNotVisible = 'ol-wfst--layer-not-visible';
                              const visible = layer.isVisibleByZoom();
                              if (visible)
                                  domEl.classList.remove(layerNotVisible);
                              else
                                  domEl.classList.add(layerNotVisible);
                          });
                          layer.set(BaseLayerProperty.ISVISIBLE, this._currentZoom > layer.getMinZoom());
                          this.dispatchEvent(new WfstEvent({
                              type: 'describeFeatureType',
                              layer: layer,
                              data: layer.getDescribeFeatureType()
                          }));
                      });
                      layer._init();
                      this._map.addLayer(layer);
                      setMapLayers({
                          [layer.get(BaseLayerProperty.NAME)]: layer
                      });
                  });
                  this._createMapElements(this._options.showControl, this._options.active);
              }
          }
          catch (err) {
              showLoading(false);
              showError(err.message, err);
          }
      }
      /**
       * @private
       */
      _init() {
          this._map = super.getMap();
          this._view = this._map.getView();
          this._viewport = this._map.getViewport();
          setMap(this._map);
          //@ts-expect-error
          this._uploads.on('addedFeatures', ({ features }) => {
              const layer = getActiveLayerToInsertEls();
              layer.insertFeatures(features);
          });
          //@ts-expect-error
          this._uploads.on('loadedFeatures', ({ features }) => {
              this.activateEditMode();
              const editLayerSource = getEditLayer().getSource();
              editLayerSource.addFeatures(features);
              this._view.fit(editLayerSource.getExtent(), {
                  size: this._map.getSize(),
                  maxZoom: 21,
                  padding: [100, 100, 100, 100]
              });
          });
          // @ts-expect-error
          this._editFields.on('save', ({ feature }) => {
              // Force deselect to trigger handler
              this._collectionModify.remove(feature);
          });
          // @ts-expect-error
          this._editFields.dispose('delete', ({ feature }) => {
              this._deleteFeature(feature, true);
          });
          this._addMapEvents();
          initModal(this._options['modal']);
          this._controlWidgetToolsDiv.append(initLoading());
          this._initMapAndLayers();
      }
      /**
       * Create the edit layer to allow modify elements, add interactions,
       * map controls and keyboard handlers.
       *
       * @param showControl
       * @param active
       * @private
       */
      async _createMapElements(showControl, active) {
          // VectorLayer to store features on editing and inserting
          this._prepareEditLayer();
          this._addInteractions();
          this._addInteractionHandlers();
          if (showControl) {
              this._addMapControl();
          }
          // By default, init in edit mode
          this.activateEditMode(active);
      }
      /**
       * @private
       */
      _addInteractions() {
          /**
           * Select the wfs feature already downloaded
           * @private
           */
          const prepareWfsInteraction = () => {
              this._collectionModify = new Collection$1();
              // Interaction to select wfs layer elements
              this._interactionWfsSelect = new interaction.Select({
                  hitTolerance: 10,
                  style: (feature) => styleFunction(feature),
                  toggleCondition: condition.never,
                  filter: (feature, layer) => {
                      return (getMode() !== Modes.Edit &&
                          layer &&
                          layer instanceof WfsLayer &&
                          layer === getActiveLayerToInsertEls());
                  }
              });
              this._map.addInteraction(this._interactionWfsSelect);
              this._interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                  const coordinate = mapBrowserEvent.coordinate;
                  if (selected.length) {
                      selected.forEach((feature) => {
                          if (!isFeatureEdited(feature)) {
                              // Remove the feature from the original layer
                              const layer = this._interactionWfsSelect.getLayer(feature);
                              layer.getSource().removeFeature(feature);
                              this._addFeatureToEditMode(feature, coordinate, layer.get(BaseLayerProperty.NAME));
                          }
                      });
                  }
                  if (deselected.length) {
                      if (getMode() !== Modes.Edit) {
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
              this._interactionSelectModify = new interaction.Select({
                  style: (feature) => styleFunction(feature),
                  layers: [getEditLayer()],
                  toggleCondition: condition.never,
                  removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
              });
              this._map.addInteraction(this._interactionSelectModify);
              this._collectionModify =
                  this._interactionSelectModify.getFeatures();
              this._keyClickWms = this._map.on(this._options.evtType, async (evt) => {
                  if (this._map.hasFeatureAtPixel(evt.pixel)) {
                      return;
                  }
                  // Only get other features if editmode is disabled
                  if (getMode() !== Modes.Edit) {
                      const layer = getActiveLayerToInsertEls();
                      // If layer is hidden or is a wfs, skip
                      if (!layer.getVisible() ||
                          !layer.isVisibleByZoom() ||
                          layer instanceof WfsLayer) {
                          return;
                      }
                      const features = await layer._getFeaturesByClickEvent(evt);
                      if (!features.length) {
                          return;
                      }
                      // For now, support is only for one feature at time
                      this._addFeatureToEditMode(features[0], evt.coordinate, layer.get(BaseLayerProperty.NAME));
                  }
              });
          };
          if (this._options.layers.find((layer) => layer instanceof WfsLayer)) {
              prepareWfsInteraction();
          }
          if (this._options.layers.find((layer) => layer instanceof WmsLayer)) {
              prepareWmsInteraction();
          }
          this._interactionModify = new interaction.Modify({
              style: () => {
                  if (getMode() === Modes.Edit) {
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
                  return condition.primaryAction(evt) && getMode() === Modes.Edit;
              }
          });
          this._map.addInteraction(this._interactionModify);
          this._interactionSnap = new interaction.Snap({
              source: getEditLayer().getSource()
          });
          this._map.addInteraction(this._interactionSnap);
      }
      /**
       * Layer to store temporary the elements to be edited
       * @private
       */
      _prepareEditLayer() {
          this._map.addLayer(getEditLayer());
      }
      /**
       * @private
       */
      _addMapEvents() {
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
          keyboardEvents();
          this._map.on('moveend', () => {
              this._currentZoom = this._view.getZoom();
              if (this._currentZoom !== this._lastZoom) {
                  const layers = getStoredMapLayers();
                  Object.keys(layers).forEach((key) => {
                      const layer = layers[key];
                      if (this._currentZoom > layer.getMinZoom()) {
                          // Show the layers
                          if (!layer.get(BaseLayerProperty.ISVISIBLE)) {
                              layer.set(BaseLayerProperty.ISVISIBLE, true);
                          }
                      }
                      else {
                          // Hide the layer
                          if (layer.get(BaseLayerProperty.ISVISIBLE)) {
                              layer.set(BaseLayerProperty.ISVISIBLE, false);
                          }
                      }
                  });
                  this._lastZoom = this._currentZoom;
              }
          });
      }
      /**
       * Add map handlers
       * @private
       */
      _addInteractionHandlers() {
          // When a feature is modified, add this to a list.
          // This prevent events fired on select and deselect features that has no changes and should
          // not be updated in the geoserver
          this._interactionModify.on('modifyend', (evt) => {
              const feature = evt.features.item(0);
              addFeatureToEditedList(feature);
              super.dispatchEvent(evt);
          });
          this._interactionModify.on('modifystart', (evt) => {
              super.dispatchEvent(evt);
          });
          this._onDeselectFeatureEvent();
          this._onRemoveFeatureEvent();
      }
      /**
       * Add the widget on the map to allow change the tools and select active layers
       * @private
       */
      _addMapControl() {
          this._layersControl = new LayersControl(this._options.showUpload ? this._uploads : null, this._options.uploadFormats);
          // @ts-expect-error
          this._layersControl.on('drawMode', () => {
              if (getMode() === Modes.Draw) {
                  resetStateButtons();
                  this.activateEditMode();
              }
              else {
                  const activeLayer = getActiveLayerToInsertEls();
                  if (!activeLayer.isVisibleByZoom()) {
                      showError(I18N.errors.layerNotVisible);
                  }
                  else {
                      this.activateDrawMode(getActiveLayerToInsertEls());
                  }
              }
          });
          // @ts-expect-error
          this._layersControl.on('changeGeom', () => {
              if (getMode() === Modes.Draw) {
                  this.activateDrawMode(getActiveLayerToInsertEls());
              }
          });
          const controlEl = this._layersControl.render();
          this._selectDraw = controlEl.querySelector('.wfst--tools-control--select-draw');
          this._controlWidgetToolsDiv.append(controlEl);
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
          const layer = getStoredMapLayers()[layerName];
          layer.getSource().addFeature(feature);
      }
      /**
       * @param feature
       * @private
       */
      _removeFeatureFromTmpLayer(feature) {
          // Remove element from the Layer
          getEditLayer().getSource().removeFeature(feature);
      }
      /**
       * Trigger on deselecting a feature from in the Edit layer
       *
       * @private
       */
      _onDeselectFeatureEvent() {
          const checkIfFeatureIsChanged = (feature) => {
              const layerName = feature.get('_layerName_');
              const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
              if (layer instanceof WfsLayer) {
                  this._interactionWfsSelect.getFeatures().remove(feature);
              }
              if (isFeatureEdited(feature)) {
                  layer.transactFeatures(TransactionType.Update, feature);
              }
              else {
                  // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                  if (layer instanceof WfsLayer) {
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
          this._keyRemove = getEditLayer()
              .getSource()
              .on('removefeature', (evt) => {
              const feature = evt.feature;
              if (!feature.get('_delete_')) {
                  return;
              }
              if (this._keySelect) {
                  Observable$2.unByKey(this._keySelect);
              }
              const layerName = feature.get('_layerName_');
              const ll = this.getLayerByName(layerName);
              ll.transactFeatures(TransactionType.Delete, feature);
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
       *
       * @param feature
       * @private
       */
      _editModeOn(feature) {
          this._editFeatureOriginal = feature.clone();
          activateMode(Modes.Edit);
          // To refresh the style
          getEditLayer().getSource().changed();
          this._removeOverlayHelper(feature);
          this._controlApplyDiscardChanges = new EditControlChangesEl(feature);
          this._controlApplyDiscardChanges.on('cancel', ({ feature }) => {
              feature.setGeometry(this._editFeatureOriginal.getGeometry());
              removeFeatureFromEditList(feature);
              this._collectionModify.remove(feature);
          });
          this._controlApplyDiscardChanges.on('apply', ({ feature }) => {
              showLoading();
              this._collectionModify.remove(feature);
          });
          this._controlApplyDiscardChanges.on('delete', ({ feature }) => {
              this._deleteFeature(feature, true);
          });
          this._map.addControl(this._controlApplyDiscardChanges);
      }
      /**
       * @private
       */
      _editModeOff() {
          activateMode(null);
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
                  getEditLayer().getSource().removeFeature(feature);
              });
              this._collectionModify.clear();
              const layerName = feature.get('_layerName_');
              const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
              if (layer instanceof WfsLayer) {
                  this._interactionWfsSelect.getFeatures().remove(feature);
              }
          };
          if (confirm) {
              const confirmModal = Modal.confirm(I18N.labels.confirmDelete, {
                  ...this._options.modal
              });
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
      _addFeatureToEditMode(feature, coordinate = null, layerName = null) {
          // For now, only allow one element at time
          // @TODO: allow edit multiples elements
          if (this._collectionModify.getLength())
              return;
          if (layerName) {
              // Store the layer information inside the feature
              feature.set('_layerName_', layerName);
          }
          const props = feature ? feature.getProperties() : '';
          if (props) {
              if (feature.getGeometry()) {
                  getEditLayer().getSource().addFeature(feature);
                  this._collectionModify.push(feature);
                  const overlay = new EditOverlay(feature, coordinate);
                  // @ts-expect-error
                  overlay.on('editFields', () => {
                      this._editFields.show(feature);
                  });
                  // @ts-expect-error
                  overlay.on('editGeom', () => {
                      this._editModeOn(feature);
                  });
                  this._map.addOverlay(overlay);
                  const layer = getStoredLayer(layerName);
                  if (layer) {
                      layer.maybeLockFeature(feature.getId());
                  }
              }
          }
      }
      /**
       * Activate/deactivate the draw mode
       *
       * @param layer
       * @public
       */
      activateDrawMode(layer) {
          /**
           *
           * @param layer
           * @private
           */
          const addDrawInteraction = (layer) => {
              this.activateEditMode(false);
              // If already exists, remove
              if (this._interactionDraw) {
                  this._map.removeInteraction(this._interactionDraw);
              }
              const geomDrawType = this._selectDraw.value;
              this._interactionDraw = new interaction.Draw({
                  source: getEditLayer().getSource(),
                  type: geomDrawType,
                  style: (feature) => styleFunction(feature),
                  stopClick: true // To prevent firing a map/wms click
              });
              this._map.addInteraction(this._interactionDraw);
              this._interactionDraw.on('drawstart', (evt) => {
                  super.dispatchEvent(evt);
              });
              this._interactionDraw.on('drawend', (evt) => {
                  const feature = evt.feature;
                  layer.transactFeatures(TransactionType.Insert, feature);
                  super.dispatchEvent(evt);
              });
          };
          if (!this._interactionDraw && !layer) {
              return;
          }
          if (layer) {
              // If layer is set to invisible, show warning
              if (!layer.getVisible()) {
                  return;
              }
              activateDrawButton();
              this._viewport.classList.add('draw-mode');
              addDrawInteraction(layer);
          }
          else {
              this._map.removeInteraction(this._interactionDraw);
              this._viewport.classList.remove('draw-mode');
          }
          activateMode(layer ? Modes.Draw : null);
      }
      /**
       * Activate/desactivate the edit mode
       *
       * @param bool
       * @public
       */
      activateEditMode(bool = true) {
          if (bool) {
              activateModeButtons();
              this.activateDrawMode(false);
          }
          else {
              // Deselct features
              this._collectionModify.clear();
          }
          if (this._interactionSelectModify) {
              this._interactionSelectModify.setActive(bool);
          }
          this._interactionModify.setActive(bool);
          if (this._interactionWfsSelect)
              this._interactionWfsSelect.setActive(bool);
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
  class WfstEvent extends BaseEvent$1 {
      data;
      layer;
      constructor(options) {
          super(options.type);
          this.layer = options.layer;
          this.data = options.data;
      }
  }

  var utils = {
    WfsLayer: WfsLayer,
    WmsLayer: WmsLayer,
    Geoserver: Geoserver
  };
  Object.assign(Wfst, utils);

  exports.default = Wfst;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ol-wfst.js.map
