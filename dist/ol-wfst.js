/*!
 * ol-wfst - v4.4.0
 * https://github.com/GastonZalba/ol-wfst#readme
 * Built: Thu Sep 10 2026 23:06:10 GMT-0300 (Argentina Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/style/Fill.js'), require('ol/style/Stroke.js'), require('ol/style/Style.js'), require('ol/control/Control.js'), require('ol/control/FullScreen.js'), require('ol/interaction/Draw.js'), require('ol/interaction/DragBox.js'), require('ol/interaction/Modify.js'), require('ol/interaction/Select.js'), require('ol/interaction/Snap.js'), require('ol/geom/LineString.js'), require('ol/geom/MultiLineString.js'), require('ol/geom/GeometryCollection.js'), require('ol/Collection.js'), require('ol/layer/Vector.js'), require('ol/source/Vector.js'), require('ol/events/Event.js'), require('ol/events/condition.js'), require('ol/Observable.js'), require('ol/coordinate.js'), require('ol/extent.js'), require('ol/layer/Base.js'), require('ol/format/GeoJSON.js'), require('ol/proj.js'), require('ol/loadingstrategy.js'), require('ol/layer/Tile.js'), require('ol/source/TileWMS.js'), require('ol/geom.js'), require('ol/format/KML.js'), require('ol/format/WFS.js'), require('ol/style.js'), require('ol/Object.js'), require('ol/geom/Circle.js'), require('ol/Feature.js'), require('ol/geom/Polygon.js'), require('ol/format/XML.js'), require('ol/xml.js'), require('ol/format/xlink.js'), require('ol/format/xsd.js'), require('ol/Overlay.js')) :
  typeof define === 'function' && define.amd ? define(['ol/style/Fill.js', 'ol/style/Stroke.js', 'ol/style/Style.js', 'ol/control/Control.js', 'ol/control/FullScreen.js', 'ol/interaction/Draw.js', 'ol/interaction/DragBox.js', 'ol/interaction/Modify.js', 'ol/interaction/Select.js', 'ol/interaction/Snap.js', 'ol/geom/LineString.js', 'ol/geom/MultiLineString.js', 'ol/geom/GeometryCollection.js', 'ol/Collection.js', 'ol/layer/Vector.js', 'ol/source/Vector.js', 'ol/events/Event.js', 'ol/events/condition.js', 'ol/Observable.js', 'ol/coordinate.js', 'ol/extent.js', 'ol/layer/Base.js', 'ol/format/GeoJSON.js', 'ol/proj.js', 'ol/loadingstrategy.js', 'ol/layer/Tile.js', 'ol/source/TileWMS.js', 'ol/geom.js', 'ol/format/KML.js', 'ol/format/WFS.js', 'ol/style.js', 'ol/Object.js', 'ol/geom/Circle.js', 'ol/Feature.js', 'ol/geom/Polygon.js', 'ol/format/XML.js', 'ol/xml.js', 'ol/format/xlink.js', 'ol/format/xsd.js', 'ol/Overlay.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(global.ol.style.Fill, global.ol.style.Stroke, global.ol.style.Style, global.ol.control.Control, global.ol.control.FullScreen, global.ol.interaction.Draw, global.ol.interaction.DragBox, global.ol.interaction.Modify, global.ol.interaction.Select, global.ol.interaction.Snap, global.ol.geom.LineString, global.ol.geom.MultiLineString, global.ol.geom.GeometryCollection, global.ol.Collection, global.ol.layer.Vector, global.ol.source.Vector, global.ol.events.Event, global.ol.events.condition, global.ol.Observable, global.ol.coordinate, global.ol.extent, global.ol.layer.Base, global.ol.format.GeoJSON, global.ol.proj, global.ol.loadingstrategy, global.ol.layer.Tile, global.ol.source.TileWMS, global.ol.geom, global.ol.format.KML, global.ol.format.WFS, global.ol.style, global.ol.Object, global.ol.geom.Circle, global.ol.Feature, global.ol.geom.Polygon, global.ol.format.XML, global.ol.xml, global.ol.format.xlink, global.ol.format.xsd, global.ol.Overlay));
})(this, (function (Fill, Stroke, Style, Control, FullScreen, Draw, DragBox, Modify, Select, Snap, LineString, MultiLineString, GeometryCollection, Collection, VectorLayer, VectorSource, BaseEvent, condition_js, Observable, coordinate_js, extent_js, Layer, GeoJSON, proj_js, loadingstrategy_js, TileLayer, TileWMS, geom_js, KML, WFS, style_js, BaseObject, Circle, Feature, Polygon_js, XML, xml_js, xlink_js, xsd_js, Overlay) { 'use strict';

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
  const parseError = (geoserverResponse) => {
      if ('exceptions' in geoserverResponse) {
          return geoserverResponse.exceptions
              .map((e) => e.text)
              .join(',');
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
      if (originalError && originalError.message !== msg) {
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
          selectBox: 'Seleccionar elementos dibujando una caja',
          selectFreehand: 'Seleccionar elementos dibujando a mano alzada',
          query: 'Consultar información del elemento',
          featureInfo: 'Información del elemento',
          addElement: 'Modo dibujo',
          editElement: 'Editar elemento',
          save: 'Guardar',
          delete: 'Eliminar',
          cancel: 'Cancelar',
          apply: 'Aplicar cambios',
          upload: 'Subir',
          editMode: 'Modo Edición',
          confirmDelete: '¿Estás seguro de borrar el elemento?',
          confirmDeleteElements: '¿Borrar los {} elementos?',
          geomTypeNotSupported: 'Geometría no compatible con la capa',
          editFields: 'Editar campos',
          editGeom: 'Editar geometría',
          continueLine: 'Continuar dibujando desde aquí',
          selectDrawType: 'Tipo de geometría para dibujar',
          uploadToLayer: 'Subir archivo a la capa seleccionada',
          uploadFeatures: 'Subida de elementos a la capa',
          validFeatures: 'Válidas',
          invalidFeatures: 'Invalidas',
          loading: 'Cargando...',
          toggleVisibility: 'Cambiar visibilidad de la capa',
          fullscreen: 'Pantalla completa',
          close: 'Cerrar',
          multipleValues: 'Valores múltiples',
          editElements: 'Editar elementos ({})',
          multipleEditNotice: 'Edición múltiple activada. Los cambios se aplicarán a los {} elementos seleccionados.',
          geoserverLayers: 'Capas de GeoServer'
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
          lockFeature: 'No se pudieron bloquear elementos en el GeoServer',
          transaction: 'Error al hacer transacción con el GeoServer',
          getFeatures: 'Error al obtener elemento desde el GeoServer'
      }
  };

  const en = {
      labels: {
          select: 'Select',
          selectBox: 'Select features by drawing a box',
          selectFreehand: 'Select features by freehand drawing',
          query: 'Query feature info',
          featureInfo: 'Feature info',
          addElement: 'Toggle Draw mode',
          editElement: 'Edit feature',
          save: 'Save',
          delete: 'Delete',
          cancel: 'Cancel',
          apply: 'Apply changes',
          upload: 'Upload',
          editMode: 'Edit Mode',
          confirmDelete: 'Are you sure to delete the feature?',
          confirmDeleteElements: 'Delete the {} selected features?',
          geomTypeNotSupported: 'Geometry not supported by layer',
          editFields: 'Edit fields',
          editGeom: 'Edit geometry',
          continueLine: 'Continue drawing from here',
          selectDrawType: 'Geometry type to draw',
          uploadToLayer: 'Upload file to selected layer',
          uploadFeatures: 'Uploaded features to layer',
          validFeatures: 'Valid geometries',
          invalidFeatures: 'Invalid',
          loading: 'Loading...',
          toggleVisibility: 'Toggle layer visibility',
          fullscreen: 'Fullscreen',
          close: 'Close',
          multipleValues: 'Multiple values',
          editElements: 'Edit features ({})',
          multipleEditNotice: 'Multi-edit active. Changes will be applied to the {} selected features.',
          geoserverLayers: 'Geoserver Layers'
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
          lockFeature: 'Could not lock items on the GeoServer',
          transaction: 'Error when doing Transaction with GeoServer',
          getFeatures: 'Error getting elements from GeoServer'
      }
  };

  const zh = {
      labels: {
          select: '选择',
          selectBox: '框选元素',
          selectFreehand: '手绘选择元素',
          query: '查询元素信息',
          featureInfo: '元素信息',
          addElement: '切换绘图类型',
          editElement: '编辑元素',
          save: '保存',
          delete: '删除',
          cancel: '取消',
          apply: '确认并应用改变',
          upload: '上传',
          editMode: '编辑模式',
          confirmDelete: '确认删除元素?',
          confirmDeleteElements: '确认删除选中的 {} 个元素?',
          geomTypeNotSupported: '图层不支持该几何',
          editFields: '编辑区域',
          editGeom: '编辑几何',
          continueLine: '从此处继续绘制',
          selectDrawType: '几何类型',
          uploadToLayer: '通过文件上传图层',
          uploadFeatures: '上传元素到图层',
          validFeatures: '合法的几何类型',
          invalidFeatures: '不合法',
          loading: '加载中...',
          toggleVisibility: '切换图层透明度',
          fullscreen: '全屏',
          close: '关闭',
          multipleValues: '多个值',
          editElements: '编辑元素（{}）',
          multipleEditNotice: '多选编辑已激活。更改将应用于所有 {} 个选定元素。',
          geoserverLayers: 'GeoServer 图层'
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
          I18N = Object.assign(Object.assign({}, I18N), customI18n);
      }
  };
  /**
   * /**
   * For translations thas has a variable "{}"" to be replaced inside
   * @param string
   * @param args
   * @returns
   */
  const I18N_ = (string, ...args) => {
      var _a;
      let text = (_a = I18N.labels) === null || _a === void 0 ? void 0 : _a[string];
      if (!text) {
          text = I18N[string];
      }
      if (!text) {
          console.error('Translation not found', string);
          text = string;
      }
      if (args.length) {
          args.forEach((arg) => {
              text = text.replace(/{}/, arg);
          });
      }
      return text;
  };

  let loadingDiv;
  const initLoading = () => {
      loadingDiv = document.createElement('div');
      loadingDiv.className = 'ol-wfst--tools-control--loading';
      loadingDiv.setAttribute('role', 'progressbar');
      loadingDiv.setAttribute('aria-label', I18N.labels.loading);
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
  const mixins = new WeakMap();
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
      Modes["Query"] = "QUERY";
  })(Modes || (Modes = {}));
  var SelectionMode;
  (function (SelectionMode) {
      SelectionMode["Single"] = "SINGLE";
      SelectionMode["Box"] = "BOX";
      SelectionMode["Freehand"] = "FREEHAND";
  })(SelectionMode || (SelectionMode = {}));
  let selectionMode = SelectionMode.Single;
  function activateMode(m = null) {
      mode = m;
  }
  function getMode() {
      return mode;
  }
  function setSelectionMode(m) {
      selectionMode = m;
  }
  function getSelectionMode() {
      return selectionMode;
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
       * Initialize the layer: request DescribeFeatureType and resolve when it
       * finishes (whether successful or not).
       *
       * @private
       * @returns Promise that resolves when the layer is initialized
       */
      async _init() {
          const geoserver = this.getGeoserver();
          if (geoserver.isLoaded()) {
              await this.getAndUpdateDescribeFeatureType();
          }
          else {
              await new Promise((resolve) => {
                  geoserver.once('change:capabilities', async () => {
                      await this.getAndUpdateDescribeFeatureType();
                      resolve();
                  });
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
              if (data.exceptions) {
                  throw new Error(parseError(data));
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
              showError(`${I18N.errors.layer} "${layerLabel}"`, err, layerName);
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
       * @param featureIds
       * @returns
       */
      async maybeLockFeature(featureIds) {
          const geoserver = this.getGeoserver();
          if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
              return await geoserver.lockFeature(featureIds, this.get(BaseLayerProperty.NAME));
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
      constructor(options) {
          super(Object.assign(Object.assign({}, options), { format: new GeoJSON(), loader: (extent, resolution, projection, success, failure) => {
                  void (async () => {
                      try {
                          // If bbox, add extent to the request
                          if (options.strategy == loadingstrategy_js.bbox) {
                              const extentGeoServer = proj_js.transformExtent(extent, projection.getCode(), options.geoServerAdvanced.projection);
                              // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                              // request features using a bounding box with CRS maybe different from featureTypes native CRS
                              this.urlParams.set('bbox', extentGeoServer.toString() +
                                  `,${options.geoServerAdvanced.projection}`);
                          }
                          const url_fetch = options.geoserverUrl +
                              '?' +
                              this.urlParams.toString();
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
                  })();
              } }));
          this.urlParams = new URLSearchParams({
              SERVICE: 'wfs',
              REQUEST: 'GetFeature',
              OUTPUTFORMAT: 'application/json',
              EXCEPTIONS: 'application/json'
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
      constructor(options) {
          super(Object.assign({ name: options.name, label: options.label || options.name, minZoom: options.minZoom }, options));
          this._loadingCount = 0;
          this._loadedCount = 0;
          if (options.beforeTransactFeature) {
              this.beforeTransactFeature = options.beforeTransactFeature;
          }
          const geoserver = options.geoserver;
          const source = new WfsSource(Object.assign(Object.assign({ name: options.name, headers: geoserver.getHeaders(), credentials: geoserver.getCredentials(), geoserverUrl: geoserver.getUrl(), geoServerAdvanced: geoserver.getAdvanced() }, (options.strategy && { strategy: options.strategy })), { geoserverVendor: options.geoserverVendor }));
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
   * Layer source to retrieve WMS information from geoservers
   * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
   *
   * @extends {ol/source/TieWMS~TileWMS}
   * @param options
   */
  class WmsSource extends TileWMS {
      constructor(options) {
          super(Object.assign({ url: options.geoserverUrl, serverType: 'geoserver', params: Object.assign({ SERVICE: 'wms', TILED: true, LAYERS: options.name, EXCEPTIONS: 'application/json' }, (options.geoserverVendor && options.geoserverVendor)), tileLoadFunction: async (tile, src) => {
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
              } }, options));
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
      constructor(options) {
          super(Object.assign({ name: options.name, label: options.label || options.name, minZoom: options.minZoom }, options));
          this._loadingCount = 0;
          this._loadedCount = 0;
          /**
           * Return the full accuracy geometries to replace the features from GetFeatureInfo
           * @param featuresId
           * @returns
           */
          this._getFullResGeometryById = async (featuresId) => {
              const queryParams = new URLSearchParams({
                  SERVICE: 'wfs',
                  VERSION: '2.0.0',
                  INFO_FORMAT: 'application/json',
                  REQUEST: 'GetFeature',
                  TYPENAME: this.get('name'),
                  MAXFEATURES: String(featuresId.length),
                  OUTPUTFORMAT: 'application/json',
                  SRSNAME: getMap().getView().getProjection().getCode(),
                  FEATUREID: featuresId.join(',')
              });
              const url = this.getSource().getUrls()[0] + '?' + queryParams.toString();
              try {
                  const geoserver = this.getGeoserver();
                  const response = await fetch(url, {
                      headers: geoserver.getHeaders(),
                      credentials: geoserver.getCredentials()
                  });
                  if (!response.ok) {
                      throw new Error(`${I18N.errors.getFeatures} ${response.status}`);
                  }
                  const data = await response.json();
                  const fullById = {};
                  this._parseFeaturesFromResponse(data).forEach((feature) => {
                      fullById[String(feature.getId())] = feature;
                  });
                  return featuresId.map((id) => fullById[String(id)]).filter(Boolean);
              }
              catch (err) {
                  console.error(err);
                  return false;
              }
          };
          if (options.beforeTransactFeature) {
              this.beforeTransactFeature = options.beforeTransactFeature;
          }
          if (options.beforeShowFieldsModal) {
              this.beforeShowFieldsModal = options.beforeShowFieldsModal;
          }
          this._formatGeoJSON = new GeoJSON();
          const geoserver = options.geoserver;
          const source = new WmsSource({
              name: options.name,
              headers: geoserver.getHeaders(),
              credentials: geoserver.getCredentials(),
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
          return this._requestFeatures(url);
      }
      /**
       * Request the WFS features that intersect the given geometry, selecting
       * them with a WFS GetFeature + CQL INTERSECTS filter. Used to select
       * features from a WMS layer with a box or a freehand lasso.
       *
       * @param geometry Geometry in the map view projection
       * @returns
       * @private
       */
      async _getFeaturesInGeometry(geometry) {
          var _a, _b, _c;
          // Make sure the DescribeFeatureType is loaded to get the geometry
          // field, waiting for it if the layer is still initializing
          if (!this.getDescribeFeatureType()) {
              await this.getAndUpdateDescribeFeatureType();
          }
          const geomField = (_b = (_a = this.getDescribeFeatureType()) === null || _a === void 0 ? void 0 : _a._parsed) === null || _b === void 0 ? void 0 : _b.geomField;
          if (!geomField) {
              showError(`${I18N.errors.layer} "${this.get('name')}"`);
              return [];
          }
          const viewProj = getMap().getView().getProjection().getCode();
          const nativeSrs = this._getNativeSrs();
          // Work on a copy transformed to the layer native projection so the
          // server evaluates the INTERSECTS filter against the proper SRID
          const polygon = geometry.clone();
          if (nativeSrs !== viewProj) {
              try {
                  polygon.transform(viewProj, nativeSrs);
              }
              catch (err) {
                  console.error(err);
              }
          }
          const ring = polygon.getCoordinates()[0] || [];
          const ringWkt = ring.map(([x, y]) => `${x} ${y}`).join(', ');
          // Force the filter geometry CRS with the EWKT SRID prefix so the
          // server evaluates the INTERSECTS against the layer projection
          // instead of its native storage SRS
          const sridMatch = (_c = nativeSrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i)) !== null && _c !== void 0 ? _c : nativeSrs.match(/(\d+)$/);
          const cql = sridMatch
              ? `INTERSECTS(${geomField}, SRID=${sridMatch[1]};POLYGON((${ringWkt})))`
              : `INTERSECTS(${geomField}, POLYGON((${ringWkt})))`;
          const queryParams = new URLSearchParams({
              SERVICE: 'wfs',
              VERSION: '2.0.0',
              REQUEST: 'GetFeature',
              TYPENAME: this.get('name'),
              OUTPUTFORMAT: 'application/json',
              SRSNAME: viewProj,
              CQL_FILTER: cql
          });
          const url = this.getSource().getUrls()[0] + '?' + queryParams.toString();
          // The server returns the features in the map view projection (same as
          // the full resolution request), so no further transformation is needed
          return this._requestFeatures(url);
      }
      /**
       * Resolve the layer native SRS so spatial filters are evaluated in the
       * correct projection. It reads the DefaultCRS from the WFS capabilities,
       * falling back to the geoserver advanced projection option and finally to
       * the map view projection.
       *
       * @returns
       * @private
       */
      _getNativeSrs() {
          var _a;
          const geoserver = this.getGeoserver();
          const viewProj = getMap().getView().getProjection().getCode();
          const layerName = String(this.get('name') || '');
          const layerLocalName = layerName.split(':').pop();
          const featureTypeList = (_a = geoserver.getParsedCapabilities()) === null || _a === void 0 ? void 0 : _a.FeatureTypeList;
          const featureType = Array.isArray(featureTypeList)
              ? featureTypeList.find((ft) => {
                  const featureTypeName = String((ft === null || ft === void 0 ? void 0 : ft.Name) || '');
                  return (featureTypeName === layerName ||
                      featureTypeName === layerLocalName ||
                      featureTypeName.split(':').pop() === layerLocalName);
              })
              : undefined;
          const defaultCrs = (featureType === null || featureType === void 0 ? void 0 : featureType.DefaultCRS)
              ? String(featureType.DefaultCRS)
              : '';
          const epsgMatch = defaultCrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i);
          if (epsgMatch) {
              return `EPSG:${epsgMatch[1]}`;
          }
          const advanced = geoserver.getAdvanced().projection;
          if (advanced) {
              return String(advanced);
          }
          return viewProj;
      }
      /**
       * Fetch and parse the features from a request url, replacing the
       * low resolution geometries (GetFeatureInfo) with the full resolution
       * ones requested by FEATUREID when possible.
       *
       * @param url
       * @returns
       * @private
       */
      async _requestFeatures(url) {
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
              let features = this._parseFeaturesFromResponse(data);
              const featuresId = features.map((f) => f.getId());
              if (!featuresId.length) {
                  return [];
              }
              const fullResList = await this._getFullResGeometryById(featuresId);
              if (fullResList) {
                  features = fullResList;
              }
              return features;
          }
          catch (err) {
              showError(err.message, err);
          }
      }
      _parseFeaturesFromResponse(data) {
          return this._formatGeoJSON.readFeatures(data);
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

  function createElement(tagName, props) {
      props = props || {};
      let children = props.children || [];
      children = Array.isArray(children) ? children : [children];
      delete props.children;
      if (typeof tagName === 'function') {
          return tagName(props, children);
      }
      const elem = tagName === 'fragment'
          ? document.createDocumentFragment()
          : document.createElement(tagName);
      if (elem instanceof HTMLElement) {
          Object.entries(props).forEach(([name, value]) => {
              if (value != null) {
                  // listener
                  if (name.startsWith('on') && typeof value === 'function') {
                      elem.addEventListener(name
                          .slice(2)
                          .toLowerCase(), value);
                  }
                  else if (name === 'className') {
                      elem.setAttribute('class', value.toString());
                  }
                  else if (name === 'htmlFor') {
                      elem.setAttribute('for', value.toString());
                  }
                  else {
                      elem.setAttribute(name, value.toString());
                  }
              }
          });
      }
      for (const child of children) {
          if (!child) {
              continue;
          }
          if (Array.isArray(child)) {
              elem.append(...child);
          }
          else if (child instanceof Node) {
              elem.appendChild(child);
          }
          else {
              elem.innerHTML += child;
          }
      }
      return elem;
  }
  function jsx(type, props) {
      return createElement(type, props);
  }
  function jsxs(type, props) {
      return createElement(type, props);
  }
  function Fragment(type, children) {
      return createElement('fragment', { children });
  }

  function uploadSvg() {
  	return (new DOMParser().parseFromString("\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\">\r\n<path d=\"M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
  }

  function drawSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\r\n    <path d=\"M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function selectSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"289\" height=\"448\" viewBox=\"0 0 289 448\">\r\n    <path d=\"M283.25 260.75c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-95.5l50.25 119c3.5 8.25-0.5 17.5-8.5 21l-44.25 18.75c-8.25 3.5-17.5-0.5-21-8.5l-47.75-113-78 78c-3 3-7 4.75-11.25 4.75-2 0-4.25-0.5-6-1.25-6-2.5-10-8.25-10-14.75v-376c0-6.5 4-12.25 10-14.75 1.75-0.75 4-1.25 6-1.25 4.25 0 8.25 1.5 11.25 4.75z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
  }

  function selectBoxSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"1.5\" fill=\"none\" stroke=\"#000\" stroke-width=\"2\" stroke-dasharray=\"4 2\"></rect>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function selectFreehandSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function infoSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function visibilityOnSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\n<path d=\"M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z\"></path>\n</svg>\n", 'image/svg+xml')).firstChild;
  }

  function visibilityOffSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\n<path d=\"M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z\"></path>\n</svg>\n", 'image/svg+xml')).firstChild;
  }

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
      deactivateQueryButton();
  };
  const activateQueryButton = () => {
      const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
      if (btn) {
          btn.classList.add('wfst--active');
      }
  };
  const deactivateQueryButton = () => {
      const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
      if (btn) {
          btn.classList.remove('wfst--active');
      }
  };
  const activateDrawButton = () => {
      const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
      if (btn) {
          btn.classList.add('wfst--active');
      }
  };
  const activateSelectModeButton = (mode) => {
      const activeBtn = document.querySelector('.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active');
      if (activeBtn) {
          activeBtn.classList.remove('wfst--active');
      }
      deactivateQueryButton();
      const btnMap = {
          [SelectionMode.Single]: '.ol-wfst--tools-control-btn-select',
          [SelectionMode.Box]: '.ol-wfst--tools-control-btn-select-box',
          [SelectionMode.Freehand]: '.ol-wfst--tools-control-btn-select-freehand'
      };
      const btn = document.querySelector(btnMap[mode]);
      if (btn) {
          btn.classList.add('wfst--active');
      }
  };
  const deactivateSelectModeButton = () => {
      const activeBtn = document.querySelector('.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active');
      if (activeBtn) {
          activeBtn.classList.remove('wfst--active');
      }
      deactivateQueryButton();
  };
  class LayersControl extends Observable {
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
          const container = document.querySelector('.wfst--tools-control--select-layers-list');
          const layerName = layer.get(BaseLayerProperty.NAME);
          const checked = layer === getActiveLayerToInsertEls() ? { checked: true } : {};
          const input = (jsx("input", Object.assign({ value: layerName, id: `wfst--${layerName}`, type: "radio", className: "ol-wfst--tools-control-input", name: "wfst--select-layer" }, checked, { onChange: (evt) => this._layerChangeHandler(evt, layer) })));
          const layerDom = (jsx("div", { className: `wfst--layer-control 
                            ${layer.getVisible() ? 'ol-wfst--visible-on' : ''}
                            ${layer === getActiveLayerToInsertEls()
                ? 'ol-wfst--selected-on'
                : ''}`, "data-layer": layerName, children: jsxs("label", { htmlFor: `wfst--${layerName}`, children: [jsxs("div", { className: "ol-wfst--tools-control-visible", children: [jsx("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt), children: visibilityOnSvg() }), jsx("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt), children: visibilityOffSvg() })] }), input, jsx("span", { title: `${layer instanceof WfsLayer ? 'WFS' : 'WMS'} - ${layer.getDescribeFeatureType()._parsed.geomType}`, children: layer.get(BaseLayerProperty.LABEL) })] }) }));
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
      /**
       * Called when a layer is selected in the widget
       * @param evt
       * @param layer
       */
      _layerChangeHandler(evt, layer) {
          const selected = document.querySelector('.ol-wfst--selected-on');
          const parentDiv = evt.currentTarget.closest('.wfst--layer-control');
          // Deselect DOM previous layer
          selected.classList.remove('ol-wfst--selected-on');
          // Select this layer
          parentDiv.classList.add('ol-wfst--selected-on');
          setActiveLayerToInsertEls(layer);
          this._changeStateSelect(layer);
          this.dispatchEvent('changeLayer');
      }
      render() {
          return (jsxs(Fragment, { children: [jsxs("div", { className: "wfst--tools-control--head", children: [jsxs("div", { className: "ol-wfst--tools-control-select-cnt", children: [jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select wfst--active", type: "button", title: I18N.labels.select, onClick: () => {
                                          this.dispatchEvent('selectModeSingle');
                                      }, children: selectSvg() }), jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-box", type: "button", title: I18N.labels.selectBox, onClick: () => {
                                          this.dispatchEvent('selectModeBox');
                                      }, children: selectBoxSvg() }), jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-freehand", type: "button", title: I18N.labels.selectFreehand, onClick: () => {
                                          this.dispatchEvent('selectModeFreehand');
                                      }, children: selectFreehandSvg() })] }), jsx("div", { className: "ol-wfst--tools-control-query-cnt", children: jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-query", type: "button", title: I18N.labels.query, onClick: () => {
                                      this.dispatchEvent('queryMode');
                                  }, children: infoSvg() }) }), jsxs("div", { className: "ol-wfst--tools-control-draw-cnt", children: [jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw", type: "button", title: I18N.labels.addElement, onClick: () => {
                                          this.dispatchEvent('drawMode');
                                      }, children: drawSvg() }), jsx("select", { title: I18N.labels.selectDrawType, className: "wfst--tools-control--select-draw", onChange: (evt) => {
                                          const selectedValue = evt.target.value;
                                          this._changeStateSelect(getActiveLayerToInsertEls(), selectedValue);
                                          this.dispatchEvent('changeGeom');
                                      }, children: [
                                          GeometryType.Point,
                                          GeometryType.MultiPoint,
                                          GeometryType.LineString,
                                          GeometryType.MultiLineString,
                                          GeometryType.Polygon,
                                          GeometryType.MultiPolygon,
                                          GeometryType.Circle
                                      ].map((type) => {
                                          // Show all options, but enable only the accepted ones
                                          return jsx("option", { value: type, children: type });
                                      }) })] }), this._uploads && (jsxs("div", { children: [jsx("input", { id: "ol-wfst--upload", type: "file", accept: this._uploadFormats, onChange: (evt) => this._uploads.process(evt) }), jsx("label", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload", htmlFor: "ol-wfst--upload", title: I18N.labels.uploadToLayer, children: uploadSvg() })] }))] }), jsxs("div", { className: "wfst--tools-control--select-layers", children: [jsx("div", { className: "wfst--tools-control--select-layers-title", children: I18N.labels.geoserverLayers }), jsx("div", { className: "wfst--tools-control--select-layers-list" })] })] }));
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
  class Uploads extends Observable {
      constructor(options) {
          super();
          this._options = options;
          this._processUpload = options.processUpload;
          // Formats
          this._formatWFS = new WFS();
          this._formatGeoJSON = new GeoJSON();
          this._formatKml = new KML({
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
          let geom;
          switch (geomTypeFeature) {
              case GeometryType.Point: {
                  if (geomTypeLayer === GeometryType.MultiPoint) {
                      const coords = feature.getGeometry().getCoordinates();
                      geom = new geom_js.MultiPoint([coords]);
                  }
                  break;
              }
              case GeometryType.LineString:
                  if (geomTypeLayer === GeometryType.MultiLineString) {
                      const coords = feature.getGeometry().getCoordinates();
                      geom = new geom_js.MultiLineString([coords]);
                  }
                  break;
              case GeometryType.Polygon:
                  if (geomTypeLayer === GeometryType.MultiPolygon) {
                      const coords = feature.getGeometry().getCoordinates();
                      geom = new geom_js.MultiPolygon([coords]);
                  }
                  break;
              default:
                  geom = null;
          }
          if (!geom) {
              return null;
          }
          feature.setGeometry(geom);
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
          const modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: false, title: I18N.labels.uploadFeatures +
                  ' ' +
                  getActiveLayerToInsertEls().get(BaseLayerProperty.NAME), content: content, backdrop: 'static', footer: footer })).show();
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
          fullscreen: true,
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

  class EditControlChangesEl extends Control {
      constructor(features) {
          super({
              element: (jsx("div", { className: "ol-wfst--changes-control", children: jsxs("div", { className: "ol-wfst--changes-control-el", children: [jsxs("div", { className: "ol-wfst--changes-control-id", children: [jsx("b", { children: I18N.labels.editMode }), " -", ' ', jsx("i", { children: features.length > 1
                                          ? I18N_('editElements', features.length)
                                          : String(features[0].getId()) })] }), jsx("button", { type: "button", className: "btn btn-sm btn-secondary", onClick: () => {
                                  this._dispatch('cancel', features);
                              }, children: I18N.labels.cancel }), jsx("button", { type: "button", className: "btn btn-sm btn-primary", onClick: () => {
                                  this._dispatch('apply', features);
                              }, children: I18N.labels.apply }), jsx("button", { type: "button", className: "btn btn-sm btn-danger-outline", onClick: () => {
                                  this._dispatch('delete', features);
                              }, children: I18N.labels.delete })] }) }))
          });
      }
      _dispatch(type, features) {
          const evt = new VectorSource.VectorSourceEvent(type, features[0]);
          evt.features = features;
          this.dispatchEvent(evt);
      }
  }

  // Ol
  /**
   * Modern vertex handle mimicking the round "extend line" buttons shown at
   * line endpoints: a soft halo for depth and a white disc with a subtle
   * border. When `highlighted` is `true` (e.g. hovering a vertex with the
   * Modify interaction) the handle gets bigger with a stronger halo and a
   * darker border.
   *
   * @param highlighted Whether to render the bigger/highlighted state
   * @param geometry Style geometry function to position the handles
   * @private
   */
  const editVertexStyles = (highlighted = false, geometry) => {
      const halo = highlighted ? 10 : 8;
      const haloColor = highlighted
          ? 'rgba(0, 0, 0, 0.40)'
          : 'rgba(0, 0, 0, 0.28)';
      const radius = highlighted ? 7 : 6;
      const border = highlighted ? '#4b5563' : '#b3b3b3';
      const borderWidth = highlighted ? 2 : 1.5;
      return [
          new style_js.Style(Object.assign({ image: new style_js.Circle({
                  radius: halo,
                  fill: new style_js.Fill({
                      color: haloColor
                  })
              }) }, (geometry ? { geometry } : {}))),
          new style_js.Style(Object.assign({ image: new style_js.Circle({
                  radius: radius,
                  fill: new style_js.Fill({
                      color: '#ffffff'
                  }),
                  stroke: new style_js.Stroke({
                      width: borderWidth,
                      color: border
                  })
              }) }, (geometry ? { geometry } : {})))
      ];
  };
  /**
   * Extract a `MultiPoint` with every vertex of the given feature geometry
   * (polygons and multi-line strings are flattened). Returns `undefined` when
   * the geometry has no coordinates.
   *
   * @param feature
   * @private
   */
  const getFeatureVertices = (feature) => {
      let geometry = feature.getGeometry();
      if (geometry instanceof geom_js.GeometryCollection) {
          geometry = geometry.getGeometries()[0];
      }
      const coordinates = geometry.getCoordinates();
      let flatCoordinates = null;
      if (geometry instanceof geom_js.Polygon || geometry instanceof geom_js.MultiLineString) {
          flatCoordinates = coordinates.flat(1);
      }
      else if (geometry instanceof geom_js.MultiPolygon) {
          flatCoordinates = coordinates.flat(2);
      }
      else {
          flatCoordinates = coordinates;
      }
      if (!flatCoordinates || !flatCoordinates.length) {
          return;
      }
      return new geom_js.MultiPoint(flatCoordinates);
  };
  /**
   * Master style that handles two modes on the Edit Layer:
   * - one is the basic, showing only the vertices
   * - and the other when modify is active, showing bigger vertices
   *
   * When `hovered` is `true`, a white/red halo is prepended to highlight the
   * feature, indicating it can be selected on click.
   *
   * @param feature
   * @param hovered
   * @private
   */
  function styleFunction(feature, hovered = false) {
      let geometry = feature.getGeometry();
      let type = geometry.getType();
      if (geometry instanceof geom_js.GeometryCollection) {
          geometry = geometry.getGeometries()[0];
          type = geometry.getType();
      }
      const haloStyle = () => {
          return [
              new style_js.Style({
                  image: new style_js.Circle({
                      radius: 9,
                      fill: new style_js.Fill({
                          color: 'rgba(255, 255, 255, 0.9)'
                      }),
                      stroke: new style_js.Stroke({
                          color: '#ff0000',
                          width: 3
                      })
                  }),
                  stroke: new style_js.Stroke({
                      color: 'rgba(255, 255, 255, 0.9)',
                      width: 8
                  }),
                  fill: new style_js.Fill({
                      color: 'rgba(255, 255, 255, 0.9)'
                  })
              })
          ];
      };
      switch (type) {
          case GeometryType.Point:
          case GeometryType.MultiPoint:
              if (getMode() === Modes.Edit) {
                  return editVertexStyles();
              }
              else {
                  return [
                      ...(hovered ? haloStyle() : []),
                      new style_js.Style({
                          image: new style_js.Circle({
                              radius: 5,
                              fill: new style_js.Fill({
                                  color: '#ff0000'
                              })
                          })
                      }),
                      new style_js.Style({
                          image: new style_js.Circle({
                              radius: 2,
                              fill: new style_js.Fill({
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
                      new style_js.Style({
                          stroke: new style_js.Stroke({
                              color: 'rgba( 255, 0, 0, 1)',
                              width: 4
                          }),
                          fill: new style_js.Fill({
                              color: 'rgba(255, 0, 0, 0.7)'
                          })
                      }),
                      ...editVertexStyles(false, getFeatureVertices),
                      new style_js.Style({
                          stroke: new style_js.Stroke({
                              color: 'rgba(255, 255, 255, 0.7)',
                              width: 2
                          })
                      })
                  ];
              }
              else {
                  return [
                      ...(hovered ? haloStyle() : []),
                      new style_js.Style({
                          image: new style_js.Circle({
                              radius: 2,
                              fill: new style_js.Fill({
                                  color: '#000000'
                              })
                          }),
                          geometry: (feature) => getFeatureVertices(feature)
                      }),
                      new style_js.Style({
                          stroke: new style_js.Stroke({
                              color: '#ff0000',
                              width: 4
                          }),
                          fill: new style_js.Fill({
                              color: 'rgba(255, 0, 0, 0.7)'
                          })
                      })
                  ];
              }
      }
  }
  /**
   * Style used to highlight a feature after a query, drawn on a dedicated
   * highlight layer so the source layers keep their own rendering.
   *
   * @param feature
   * @private
   */
  function queryStyleFunction(_feature) {
      return [
          new style_js.Style({
              image: new style_js.Circle({
                  radius: 6,
                  fill: new style_js.Fill({
                      color: 'rgba(0, 170, 255, 0.4)'
                  }),
                  stroke: new style_js.Stroke({
                      color: '#0066cc',
                      width: 2
                  })
              }),
              stroke: new style_js.Stroke({
                  color: '#00aaff',
                  width: 4
              }),
              fill: new style_js.Fill({
                  color: 'rgba(0, 170, 255, 0.3)'
              })
          })
      ];
  }

  /**
   * Shows a fields form in a modal window to allow changes in the properties of
   * one or several features. When editing multiple features, fields whose value
   * differs across the selection show the "multiple values" placeholder and only
   * the fields actually changed are applied to the whole selection.
   *
   * @param features
   * @private
   */
  class EditFieldsModal extends Observable {
      constructor(options) {
          super();
          this._options = options;
          this._modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: true, title: '', content: '<div></div>', footer: `
                <button
                    type="button"
                    class="btn btn-sm btn-third"
                    data-action="delete"
                    data-dismiss="modal"
                >
                    ${I18N.labels.delete}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    data-dismiss="modal"
                >
                    ${I18N.labels.cancel}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    data-action="save"
                    data-dismiss="modal"
                >
                    ${I18N.labels.save}
                </button>
            ` }));
          this._modal.on('dismiss', (modal, event) => {
              // On saving changes
              if (event.target.dataset.action === 'save') {
                  const formElements = modal.el.querySelector('form')
                      .elements;
                  const multipleFields = new Set(Array.from(formElements)
                      .filter((el) => el.dataset.multiple === 'true')
                      .map((el) => el.name));
                  Array.from(formElements).forEach((el) => {
                      const value = el.value;
                      const field = el.name;
                      // Do not overwrite untouched fields that had
                      // multiple values in the selection
                      if (multipleFields.has(field) && value === '') {
                          return;
                      }
                      this._features.forEach((feature) => {
                          if (feature.get(field) !== value) {
                              feature.set(field, value, /* isSilent = */ true);
                          }
                      });
                  });
                  this._features.forEach((feature) => {
                      feature.changed();
                      addFeatureToEditedList(feature);
                  });
                  this._dispatch('save', this._features);
              }
              else if (event.target.dataset.action === 'delete') {
                  this._dispatch('delete', this._features);
              }
          });
      }
      show(features) {
          this._features = Array.isArray(features) ? features : [features];
          const multiple = this._features.length > 1;
          const modalTitle = multiple
              ? I18N_('editElements', this._features.length)
              : `${I18N.labels.editElement} ${this._features[0].getId()} `;
          const layerName = this._features[0].get('_layerName_');
          // Data schema from the geoserver
          const layer = getStoredLayer(layerName);
          const describeFeatureType = layer.getDescribeFeatureType()._parsed;
          const fieldList = describeFeatureType.properties.filter((field) => field.name !== describeFeatureType.geomField);
          this._modal._html.body.innerHTML = '';
          this._modal._html.body.append(jsxs("div", { children: [multiple && (jsx("div", { className: "ol-wfst--edit-modal-notice", children: I18N_('multipleEditNotice', this._features.length) })), jsx("form", { autocomplete: "false", children: fieldList.flatMap((field) => {
                          const key = field.name;
                          const values = this._features.map((feature) => feature.get(key));
                          const uniqueValues = Array.from(new Set(values.map((value) => String(value !== null && value !== void 0 ? value : ''))));
                          const hasMultipleValues = multiple && uniqueValues.length > 1;
                          const value = hasMultipleValues
                              ? null
                              : uniqueValues[0] || null;
                          const typeXsd = field.type;
                          let type;
                          switch (typeXsd) {
                              case 'xsd:double':
                              case 'xsd:number':
                              case 'xsd:int':
                                  type = 'number';
                                  break;
                              case 'xsd:date':
                                  type = 'date';
                                  break;
                              case 'xsd:date-time':
                                  type = 'datetime';
                                  break;
                              case 'xsd:string':
                              default:
                                  type = 'text';
                          }
                          let input = (jsx("input", { placeholder: hasMultipleValues
                                  ? I18N.labels.multipleValues
                                  : 'NULL', className: 'ol-wfst--input-field-input' +
                                  (hasMultipleValues
                                      ? ' ol-wfst--input-multiple'
                                      : ''), type: type, name: key, value: value, "data-multiple": hasMultipleValues ? 'true' : null }));
                          if (layer.beforeShowFieldsModal) {
                              const hookInput = layer.beforeShowFieldsModal(field, value, input);
                              if (!hookInput) {
                                  return [];
                              }
                              if (typeof hookInput === 'string') {
                                  input = new DOMParser().parseFromString(hookInput, 'text/html').body.childNodes[0];
                              }
                              else {
                                  input = hookInput;
                              }
                          }
                          if (hasMultipleValues) {
                              input.dataset.multiple = 'true';
                              input.classList.add('ol-wfst--input-multiple');
                          }
                          return (jsxs("div", { className: "ol-wfst--input-field-container", children: [jsx("label", { className: "ol-wfst--input-field-label", htmlFor: key, children: key }), input] }));
                      }) })] }));
          this._modal._html.header.innerHTML = modalTitle;
          this._modal.show();
      }
      _dispatch(type, features) {
          const evt = new VectorSource.VectorSourceEvent(type, features[0]);
          evt.features = features;
          this.dispatchEvent(evt);
      }
  }

  /**
   * @module ol/format/WFSCapabilities
   */

  /**
   * @const
   * @type {Array<null|string>}
   */
  const NAMESPACE_URIS = [
    null,
    'http://www.opengis.net/fes/2.0',
    'http://www.opengis.net/ows/1.1',
    'http://www.opengis.net/wfs/2.0',
  ];

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'ServiceIdentification': xml_js.makeObjectPropertySetter(readServiceIdentification),
    'ServiceProvider': xml_js.makeObjectPropertySetter(readServiceProvider),
    'OperationsMetadata': xml_js.makeObjectPropertySetter(readOperationsMetadata),
    'FeatureTypeList': xml_js.makeObjectPropertySetter(readFeatureTypeList),
    'Filter_Capabilities': xml_js.makeObjectPropertySetter(readFilter_Capabilities),
  });

  /**
   * @classdesc
   * Format for reading WFS capabilities data
   *
   * @api
   */
  class WFSCapabilities extends XML {
    constructor() {
      super();

      /**
       * @type {string|undefined}
       */
      this.version = undefined;
    }

    /**
     * @param {Element} node Node.
     * @return {Object} Object
     */
    readFromNode(node) {
      this.version = node.getAttribute('version').trim();
      const wfsCapabilityObject = xml_js.pushParseAndPop(
        {
          'version': this.version,
        },
        PARSERS,
        node,
        []
      );
      return wfsCapabilityObject ? wfsCapabilityObject : null;
    }
  }

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_IDENTIFICATION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Title': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Abstract': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Keywords': xml_js.makeObjectPropertySetter(readKeywordList),
    'ServiceType': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'ServiceTypeVersion': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Fees': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'AccessConstraints': xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_PROVIDER_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'ProviderName': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'ServiceContact': xml_js.makeObjectPropertySetter(readServiceContact),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const OPERATIONS_METADATA_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Operation': xml_js.makeObjectPropertyPusher(readNamedOperation),
    'Constraint': xml_js.makeObjectPropertyPusher(readNamedConstraint),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_CONTACT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'IndividualName': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'PositionName': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'ContactInfo': xml_js.makeObjectPropertySetter(readContactInfo),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONTACT_INFO_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Phone': xml_js.makeObjectPropertySetter(readPhone),
    'Address': xml_js.makeObjectPropertySetter(readAddress),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PHONE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Voice': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Facsimile': xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ADDRESS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'DeliveryPoint': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'City': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'AdministrativeArea': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'PostalCode': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Country': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'ElectronicMailAddress': xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_LIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'FeatureType': xml_js.makeArrayPusher(readFeatureType),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Name': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Title': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Abstract': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Keywords': xml_js.makeObjectPropertySetter(readKeywordList),
    'DefaultCRS': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'WGS84BoundingBox': xml_js.makeObjectPropertySetter(readWGS84BoundingBox),
    'MetadataURL': xml_js.makeObjectPropertySetter(xlink_js.readHref),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const OPERATION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'DCP': xml_js.makeObjectPropertySetter(readDCP),
    'Parameter': xml_js.makeObjectPropertyPusher(readNamedParameter),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PARAMETER_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'AllowedValues': xml_js.makeObjectPropertySetter(readValueList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONSTRAINT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'NoValues': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'DefaultValue': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'AllowedValues': xml_js.makeObjectPropertySetter(readValueList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const HTTP_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Get': xml_js.makeObjectPropertySetter(xlink_js.readHref),
    'Post': xml_js.makeObjectPropertySetter(xlink_js.readHref),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const WGS84_BOUNDINGBOX_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'LowerCorner': xml_js.makeObjectPropertySetter(readStringCoords),
    'UpperCorner': xml_js.makeObjectPropertySetter(readStringCoords),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const DCP_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'HTTP': xml_js.makeObjectPropertySetter(readHTTP),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const KEYWORDLIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Keyword': xml_js.makeArrayPusher(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const VALUELIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Value': xml_js.makeArrayPusher(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FILTER_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Conformance': xml_js.makeObjectPropertySetter(readConformance),
    'Id_Capabilities': xml_js.makeObjectPropertySetter(readId_Capabilities),
    'Scalar_Capabilities': xml_js.makeObjectPropertySetter(readScalarCapabilities),
    'Spatial_Capabilities': xml_js.makeObjectPropertySetter(readSpatialCapabilities),
    'Temporal_Capabilities': xml_js.makeObjectPropertySetter(readTemporalCapabilities),
    'Functions': xml_js.makeObjectPropertySetter(readFunctions),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONFORMANCE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Constraint': xml_js.makeObjectPropertyPusher(readNamedConstraint),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ID_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'ResourceIdentifier': xml_js.makeObjectPropertySetter(readNamedResourceIdentifier),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SCALAR_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'LogicalOperators': xml_js.makeObjectPropertySetter(readLogicalOperators),
    'ComparisonOperators': xml_js.makeObjectPropertySetter(readComparisonOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SPATIAL_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'GeometryOperands': xml_js.makeObjectPropertySetter(readGeometryOperands),
    'SpatialOperators': xml_js.makeObjectPropertySetter(readSpatialOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'TemporalOperands': xml_js.makeObjectPropertySetter(readTemporalOperands),
    'TemporalOperators': xml_js.makeObjectPropertySetter(readTemporalOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTIONS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Function': xml_js.makeArrayPusher(readNamedFunction),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Returns': xml_js.makeObjectPropertySetter(xsd_js.readString),
    'Arguments': xml_js.makeObjectPropertySetter(readArguments),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ARGUMENTS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Argument': xml_js.makeArrayPusher(readNamedArgument),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ARGUMENT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'Type': xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const LOGICAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'LogicalOperator': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPARISON_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'ComparisonOperator': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const GEOMETRY_OPERANDS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'GeometryOperand': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SPATIAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'SpatialOperator': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_OPERANDS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'TemporalOperand': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'TemporalOperator': xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Service Identification object.
   */
  function readServiceIdentification(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_IDENTIFICATION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Service Provider object.
   */
  function readServiceProvider(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_PROVIDER_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operations Metadata object.
   */
  function readOperationsMetadata(node, objectStack) {
    return xml_js.pushParseAndPop({}, OPERATIONS_METADATA_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FeatureType list.
   */
  function readFeatureTypeList(node, objectStack) {
    return xml_js.pushParseAndPop([], FEATURE_TYPE_LIST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Serrvice contact object.
   */
  function readServiceContact(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_CONTACT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact info object.
   */
  function readContactInfo(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONTACT_INFO_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact Phone object.
   */
  function readPhone(node, objectStack) {
    return xml_js.pushParseAndPop({}, PHONE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact address object.
   */
  function readAddress(node, objectStack) {
    return xml_js.pushParseAndPop({}, ADDRESS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} DCP object.
   */
  function readDCP(node, objectStack) {
    return xml_js.pushParseAndPop({}, DCP_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operation object.
   */
  function readOperation(node, objectStack) {
    return xml_js.pushParseAndPop({}, OPERATION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Parameter object.
   */
  function readParameter(node, objectStack) {
    return xml_js.pushParseAndPop({}, PARAMETER_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Constraint object.
   */
  function readConstraint(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONSTRAINT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} HTTP object.
   */
  function readHTTP(node, objectStack) {
    return xml_js.pushParseAndPop({}, HTTP_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named operation object.
   */
  function readNamedOperation(node, objectStack) {
    const operation = readOperation(node, objectStack);
    if (operation) {
      operation['name'] = node.getAttribute('name');
      return operation;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Function object.
   */
  function readNamedFunction(node, objectStack) {
    const func = readFunction(node, objectStack);
    if (func) {
      func['name'] = node.getAttribute('name');
      return func;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named argument object.
   */
  function readNamedArgument(node, objectStack) {
    const argument = readArgument(node, objectStack);
    if (argument) {
      argument['name'] = node.getAttribute('name');
      return argument;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Parameter object.
   */
  function readNamedParameter(node, objectStack) {
    const parameter = readParameter(node, objectStack);
    if (parameter) {
      parameter['name'] = node.getAttribute('name');
      return parameter;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Constraint object.
   */
  function readNamedConstraint(node, objectStack) {
    const constraint = readConstraint(node, objectStack);
    if (constraint) {
      constraint['name'] = node.getAttribute('name');
      return constraint;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Node name attribute string.
   */
  function readNamedOnly(node) {
    return node.getAttribute('name') || undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {Object|undefined} Named Resource Identifier object.
   */
  function readNamedResourceIdentifier(node) {
    return {
      name: node.getAttribute('name'),
    };
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} WGS84 BoundingBox resource object.
   */
  function readWGS84BoundingBox(node, objectStack) {
    return xml_js.pushParseAndPop({}, WGS84_BOUNDINGBOX_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Keyword list.
   */
  function readKeywordList(node, objectStack) {
    return xml_js.pushParseAndPop([], KEYWORDLIST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Value list.
   */
  function readValueList(node, objectStack) {
    return xml_js.pushParseAndPop([], VALUELIST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FeatureTyoe object.
   */
  function readFeatureType(node, objectStack) {
    return xml_js.pushParseAndPop({}, FEATURE_TYPE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FilterCapabilities object.
   */
  function readFilter_Capabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, FILTER_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Conformance object.
   */
  function readConformance(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONFORMANCE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Id Capabilities object.
   */
  function readId_Capabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, ID_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Scalar Capabilities object.
   */
  function readScalarCapabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, SCALAR_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Spatial Capabilities object.
   */
  function readSpatialCapabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, SPATIAL_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Temporal Capabilities object.
   */
  function readTemporalCapabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, TEMPORAL_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Functions array.
   */
  function readFunctions(node, objectStack) {
    return xml_js.pushParseAndPop([], FUNCTIONS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Function object.
   */
  function readFunction(node, objectStack) {
    return xml_js.pushParseAndPop({}, FUNCTION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Logical Operators array.
   */
  function readLogicalOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], LOGICAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Comparison Operators array.
   */
  function readComparisonOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], COMPARISON_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Geometry Operands array.
   */
  function readGeometryOperands(node, objectStack) {
    return xml_js.pushParseAndPop([], GEOMETRY_OPERANDS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Spatials Operators array.
   */
  function readSpatialOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], SPATIAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Temporal Operands array.
   */
  function readTemporalOperands(node, objectStack) {
    return xml_js.pushParseAndPop([], TEMPORAL_OPERANDS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Temporal Operators array.
   */
  function readTemporalOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], TEMPORAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Arguments array.
   */
  function readArguments(node, objectStack) {
    return xml_js.pushParseAndPop([], ARGUMENTS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Argument object.
   */
  function readArgument(node, objectStack) {
    return xml_js.pushParseAndPop({}, ARGUMENT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @return {Array<number>|undefined} Coordinates array.
   */
  function readStringCoords(node) {
    const coords = xml_js.getAllTextContent(node, false).split(' ');
    if (coords.length) {
      return coords.map((c) => Number(c));
    }
    return undefined;
  }

  // Ol
  // https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
  // Axis ordering: latitude/longitude
  const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';
  const parser = new WFSCapabilities();
  /**
   * @fires change:capabilities
   * @extends {ol/Object~BaseObject}
   * @param options
   */
  class Geoserver extends BaseObject {
      constructor(options) {
          super();
          const defaults = {
              url: null,
              advanced: {
                  getCapabilitiesVersion: '2.0.0',
                  getFeatureVersion: '1.0.0',
                  describeFeatureTypeVersion: '1.1.0',
                  lockFeatureVersion: '1.1.0',
                  wfsTransactionVersion: '1.1.0',
                  projection: DEFAULT_GEOSERVER_SRS,
                  lockFeatureParams: {
                      expiry: 5, // minutes
                      lockId: 'WFST-editor',
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
          this._lockedId = this._options.advanced.lockFeatureParams.lockId;
          // Formats
          this._formatWFS = new WFS();
          this._formatGeoJSON = new GeoJSON();
          this._formatKml = new KML({
              extractStyles: false,
              showPointNames: false
          });
          this._xs = new XMLSerializer();
          this.getAndUpdateCapabilities();
          this.on('change:parsedCapabilities', () => {
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
       * Only work for `2.0.0` getCapabilities version
       * @returns
       * @public
       */
      getParsedCapabilities() {
          return this.get(GeoserverProperty.PARSED_CAPABILITIES);
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
              const parsedCapabilities = parser.read(data);
              this.set(GeoserverProperty.PARSED_CAPABILITIES, parsedCapabilities);
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
          var _a, _b;
          if (this.getAdvanced().getCapabilitiesVersion === '2.0.0') {
              // Available operations in the geoserver
              const operations = (_b = (_a = this.getParsedCapabilities()) === null || _a === void 0 ? void 0 : _a.OperationsMetadata) === null || _b === void 0 ? void 0 : _b.Operation;
              if (operations) {
                  operations.forEach((operation) => {
                      if (operation.name === 'Transaction') {
                          this.set(GeoserverProperty.HASTRASNACTION, true);
                      }
                      else if (operation.name === 'LockFeature') {
                          this.set(GeoserverProperty.HASLOCKFEATURE, true);
                      }
                      else if (operation.name === 'DescribeFeatureType') {
                          this.set(GeoserverProperty.HASDESCRIBEFEATURETYPE, true);
                      }
                  });
              }
          }
          else {
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
          }
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
          features = (Array.isArray(features) ? features : [features]);
          const clonedFeatures = [];
          const geoLayer = getStoredLayer(layerName);
          for (const feature of features) {
              let clone = this._cloneFeature(feature);
              const cloneGeom = clone.getGeometry();
              // Ugly fix to support GeometryCollection on GML
              // See https://github.com/openlayers/openlayers/issues/4220
              if (cloneGeom instanceof GeometryCollection) {
                  this._transformGeoemtryCollectionToGeometries(clone, cloneGeom);
              }
              else if (cloneGeom instanceof Circle) {
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
                      if (!geoLayer || !geoLayer.getDescribeFeatureType()) {
                          throw new Error(`${I18N.errors.layerNotFound}: "${layerName}"`);
                      }
                      const describeFeatureType = geoLayer.getDescribeFeatureType()._parsed;
                      const layerNameClean = layerName.split(':').length > 1
                          ? layerName.split(':').pop()
                          : layerName;
                      const options = {
                          featureNS: describeFeatureType.namespace,
                          featureType: layerNameClean,
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
                      else if (transactionType === TransactionType.Update) {
                          payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                      }
                      // This has to be te same used before
                      if (this.hasLockFeature &&
                          this.getUseLockFeature() &&
                          transactionType !== TransactionType.Insert) {
                          payload = payload.replace(`</Transaction>`, `<LockId>${this._lockedId}</LockId></Transaction>`);
                      }
                      const headers = Object.assign({ 'Content-Type': 'text/xml' }, this.getHeaders());
                      const response = await fetch(this.getUrl(), {
                          method: 'POST',
                          body: payload,
                          headers: headers,
                          credentials: this._options.credentials
                      });
                      if (!response.ok) {
                          throw new Error(I18N.errors.transaction + ' ' + response.status);
                      }
                      const responseStr = await response.text();
                      const parseResponse = this._formatWFS.readTransactionResponse(responseStr);
                      const wlayer = getStoredLayer(layerName);
                      if (!Object.keys(parseResponse).length) {
                          const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                          if (findError) {
                              if (wlayer instanceof WmsLayer) {
                                  this._removeFeatures(features);
                              }
                              // maybe remove tmp wms features here
                              throw new Error(findError[1]);
                          }
                      }
                      if (transactionType !== TransactionType.Delete) {
                          this._removeFeatures(features);
                      }
                      features.forEach((feature) => {
                          removeFeatureFromEditList(feature);
                      });
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
       * @privatwe
       */
      _removeFeatures(features) {
          for (const feature of features) {
              getEditLayer().getSource().removeFeature(feature);
          }
      }
      /**
       *
       * @param feature
       * @param geom
       * @private
       */
      _transformCircleToPolygon(feature, geom) {
          const geomConverted = Polygon_js.fromCircle(geom);
          feature.setGeometry(geomConverted);
      }
      /**
       *
       * @param feature
       * @private
       * @param geom
       */
      _transformGeoemtryCollectionToGeometries(feature, geom) {
          let geomConverted = geom.getGeometries()[0];
          if (geomConverted instanceof Circle) {
              geomConverted = Polygon_js.fromCircle(geomConverted);
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
          delete featureProperties._editOverlayCoord_;
          const clone = new Feature(featureProperties);
          clone.setId(feature.getId());
          return clone;
      }
      /**
       * Lock one or several features in the geoserver. Useful before editing,
       * to avoid changes from multiples users. Locking several features at once
       * with a single request keeps the lock covered by one LockId
       *
       * @param featureIds
       * @param layerName
       * @param retry
       * @public
       */
      async lockFeature(featureIds, layerName, retry = 0) {
          const params = new URLSearchParams({
              service: 'wfs',
              version: this.getAdvanced().lockFeatureVersion,
              request: 'LockFeature',
              typeName: layerName,
              expiry: String(this._options.advanced.lockFeatureParams.expiry),
              handle: this._options.advanced.lockFeatureParams.lockId,
              releaseAction: this._options.advanced.lockFeatureParams.releaseAction,
              exceptions: 'application/json',
              featureid: Array.isArray(featureIds)
                  ? featureIds.join(',')
                  : String(featureIds)
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
                      const error = new Error(parseError(dataParsed));
                      const exceptions = dataParsed.exceptions;
                      if (exceptions[0].code === 'CannotLockAllFeatures') {
                          // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                          if (!retry) {
                              this.lockFeature(featureIds, layerName, 1);
                          }
                          else {
                              throw error;
                          }
                      }
                      else {
                          throw error;
                      }
                  }
              }
              catch (err) {
                  // XML response (not JSON): parse the real lock id returned by
                  // the server so the transaction references the lock that was
                  // actually created instead of the configured one
                  try {
                      const dataDoc = new window.DOMParser().parseFromString(data, 'text/xml');
                      const lockIdNode = dataDoc.getElementsByTagName('wfs:LockId')[0] ||
                          dataDoc.getElementsByTagNameNS('http://www.opengis.net/wfs', 'LockId')[0];
                      if (lockIdNode && lockIdNode.textContent) {
                          this._lockedId = lockIdNode.textContent;
                      }
                  }
                  catch (parseErr) {
                      // Keep the configured lockId
                  }
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
      GeoserverProperty["PARSED_CAPABILITIES"] = "parsedCapabilities";
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

  function editFieldsSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\">\r\n    <path d=\"M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function editGeomSvg() {
  	return (new DOMParser().parseFromString(" <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"541\" height=\"512\" viewBox=\"0 0 541 512\">\r\n    <path fill=\"#000\" d=\"M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z\"></path>\r\n    <path fill=\"#000\" d=\"M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z\"></path>\r\n    <path fill=\"#000\" d=\"M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z\"></path>\r\n    <path fill=\"#000\" d=\"M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z\"></path>\r\n    <path fill=\"#000\" d=\"M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z\"></path>\r\n    <path fill=\"#000\" d=\"M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  class EditOverlay extends Overlay {
      constructor(feature = null, coordinate = null, id) {
          super({
              id: id !== null && id !== void 0 ? id : (feature ? feature.getId() : undefined),
              position: coordinate ||
                  (feature
                      ? extent_js.getCenter(feature.getGeometry().getExtent())
                      : undefined),
              positioning: 'center-center',
              offset: [0, -40],
              stopEvent: true,
              element: (jsxs("div", { children: [jsx("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                              this.dispatchEvent('editFields');
                          }, children: jsx("button", { className: "ol-wfst--edit-button", type: "button", title: I18N.labels.editFields, children: editFieldsSvg() }) }), jsx("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                              this.dispatchEvent('editGeom');
                          }, children: jsx("button", { class: "ol-wfst--edit-button", type: "button", title: I18N.labels.editGeom, children: editGeomSvg() }) })] }))
          });
      }
  }

  function addLineSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  class ExtendLineOverlay extends Overlay {
      constructor(feature, coordinate, side, component = 0, onClick) {
          super({
              position: coordinate,
              positioning: 'center-center',
              stopEvent: true,
              element: (jsx("div", { className: "ol-wfst--extend-button-cnt", children: jsx("button", { className: "ol-wfst--extend-button", type: "button", title: I18N.labels.continueLine, onClick: () => {
                          onClick(side);
                      }, children: addLineSvg() }) }))
          });
          this.feature = feature;
          this.side = side;
          this.component = component;
      }
  }

  const QUERY_OVERLAY_ID = 'ol-wfst--query-overlay';
  /**
   * Popup overlay that shows the attributes of a queried feature and its
   * layer label. The geometry is highlighted separately on a dedicated layer.
   *
   * @extends {ol/Overlay~Overlay}
   * @param feature
   * @param coordinate
   * @param layer
   * @private
   */
  class QueryOverlay extends Overlay {
      constructor(feature, coordinate, layer) {
          const describeFeatureType = layer.getDescribeFeatureType();
          const parsed = describeFeatureType === null || describeFeatureType === void 0 ? void 0 : describeFeatureType._parsed;
          const fields = (parsed === null || parsed === void 0 ? void 0 : parsed.properties) || [];
          const geomField = parsed === null || parsed === void 0 ? void 0 : parsed.geomField;
          const rows = fields
              .filter((field) => field.name !== geomField)
              .map((field) => {
              let value = feature.get(field.name);
              if (value === undefined || value === null) {
                  value = '';
              }
              else if (typeof value === 'object') {
                  value = JSON.stringify(value);
              }
              return (jsxs("div", { className: "ol-wfst--query-popup-row", children: [jsx("span", { className: "ol-wfst--query-popup-key", children: field.name }), jsx("span", { className: "ol-wfst--query-popup-value", children: String(value) })] }));
          });
          super({
              id: QUERY_OVERLAY_ID,
              position: coordinate || extent_js.getCenter(feature.getGeometry().getExtent()),
              positioning: 'bottom-center',
              offset: [0, -14],
              stopEvent: true,
              autoPan: true,
              element: (jsxs("div", { className: "ol-wfst--query-popup", children: [jsxs("div", { className: "ol-wfst--query-popup-head", children: [jsx("div", { className: "ol-wfst--query-popup-title", children: I18N.labels.featureInfo }), jsx("button", { className: "ol-wfst--query-popup-close", type: "button", title: I18N.labels.close, onClick: () => {
                                      this.dispatchEvent('close');
                                  }, children: "\u00D7" })] }), jsxs("div", { className: "ol-wfst--query-popup-subtitle", children: [jsx("b", { children: layer.get(BaseLayerProperty.LABEL) }), jsx("i", { children: String(feature.getId()) })] }), jsx("div", { className: "ol-wfst--query-popup-body", children: rows })] }))
          });
      }
  }

  function fullscreenSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  function fullscreenExitSvg() {
  	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
  }

  const controlElement = document.createElement('div');
  const INIT_LOADING_TIMEOUT = 20000;
  /**
   * Tiny WFS-T client to insert (drawing/uploading), modify and delete
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
  class Wfst extends Control {
      constructor(options) {
          super({
              target: null,
              element: controlElement,
              render: () => {
                  if (!this._map)
                      this._init();
              }
          });
          this._initialized = false;
          this._queryOverlayId = 'ol-wfst--query-overlay';
          this._shiftPressed = false;
          this._hoveredFeature = null;
          this._keySelectBound = false;
          // Editing
          this._editFeaturesOriginal = {};
          this._multiOverlayId = 'ol-wfst--multi-edit-overlay';
          this._extendOverlays = [];
          setLang(options.language, options.i18n);
          const defaultOptions = getDefaultOptions();
          this._options = deepObjectAssign(defaultOptions, options);
          // By default, the first layer is ready to accept new draws
          setActiveLayerToInsertEls(this._options.layers[0]);
          this._controlWidgetToolsDiv = controlElement;
          this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
          this._uploads = new Uploads(this._options);
          this._editFields = new EditFieldsModal(this._options);
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
                  showLoading();
                  const layerInitPromises = [];
                  layers.forEach((layer) => {
                      if (layer.isVisible(this._view))
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
                          if (this._options.showControl && layers.length > 1) {
                              const domEl = this._layersControl.addLayerEl(layer);
                              layer.on('change:isVisible', () => {
                                  const layerNotVisible = 'ol-wfst--layer-not-visible';
                                  const visible = layer.isVisibleByZoom();
                                  if (visible)
                                      domEl.classList.remove(layerNotVisible);
                                  else
                                      domEl.classList.add(layerNotVisible);
                              });
                          }
                          layer.set(BaseLayerProperty.ISVISIBLE, this._currentZoom > layer.getMinZoom());
                          this.dispatchEvent(new WfstEvent({
                              type: 'describeFeatureType',
                              layer: layer,
                              data: layer.getDescribeFeatureType()
                          }));
                      });
                      layerInitPromises.push(layer._init());
                      this._map.addLayer(layer);
                      setMapLayers({
                          [layer.get(BaseLayerProperty.NAME)]: layer
                      });
                  });
                  this._createMapElements(this._options.showControl, this._options.active);
                  // Show the loading bar until every layer has resolved its
                  // DescribeFeatureType (success or error), with a fail-safe
                  // timeout so it never stays visible on a dead connection.
                  await Promise.race([
                      Promise.all(layerInitPromises),
                      new Promise((resolve) => setTimeout(resolve, INIT_LOADING_TIMEOUT))
                  ]);
                  showLoading(false);
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
          this._editFields.on('save', async ({ feature, features }) => {
              const list = features || [feature];
              const ok = await this._transactEditList(list);
              if (ok) {
                  Array.from(list).forEach((f) => this._collectionModify.remove(f));
              }
          });
          // @ts-expect-error
          this._editFields.on('delete', ({ features }) => {
              this._deleteFeature(features, true);
          });
          this._addMapEvents();
          this._addMiddleButtonPan();
          initModal(this._options['modal']);
          this._layersWidgetDiv = document.createElement('div');
          this._layersWidgetDiv.className = 'ol-wfst--layers-control';
          this._layersWidgetDiv.append(initLoading());
          this._map.addControl(new Control({
              element: this._layersWidgetDiv
          }));
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
          this._prepareHighlightLayer();
          this._addQueryInteraction();
          if (showControl) {
              this._addMapControl();
              if (this._options.fullscreen) {
                  this._map.addControl(new FullScreen({
                      className: 'ol-wfst--fullscreen',
                      tipLabel: I18N.labels.fullscreen,
                      label: fullscreenSvg(),
                      labelActive: fullscreenExitSvg()
                  }));
              }
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
              this._collectionModify = new Collection();
              // Interaction to select wfs layer elements
              this._interactionWfsSelect = new Select({
                  hitTolerance: 10,
                  style: (feature) => styleFunction(feature),
                  toggleCondition: condition_js.shiftKeyOnly, // Allow adding features to the selection with shift
                  filter: (feature, layer) => {
                      return (getMode() !== Modes.Edit &&
                          getMode() !== Modes.Query &&
                          layer &&
                          layer instanceof WfsLayer &&
                          layer === getActiveLayerToInsertEls());
                  }
              });
              this._map.addInteraction(this._interactionWfsSelect);
              this._interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                  const coordinate = mapBrowserEvent.coordinate;
                  // Clear hover to avoid keeping the style on the selected feature
                  this._clearHoverState();
                  if (getMode() === Modes.Query) {
                      return;
                  }
                  if (selected.length) {
                      selected.forEach((feature) => {
                          if (!isFeatureEdited(feature)) {
                              // Remove the feature from the original layer
                              const layer = this._interactionWfsSelect.getLayer(feature);
                              layer.getSource().removeFeature(feature);
                              this._addFeatureToEditMode(feature, coordinate, layer.get(BaseLayerProperty.NAME));
                          }
                      });
                      this._lockSelectedFeatures();
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
              this._interactionSelectModify = new Select({
                  style: (feature) => styleFunction(feature),
                  layers: [getEditLayer()],
                  toggleCondition: condition_js.shiftKeyOnly, // Allow adding features with shift
                  removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
              });
              this._map.addInteraction(this._interactionSelectModify);
              // When clicking without shift, replace the current selection: remove
              // any previously selected and not re-selected feature from the edit list
              this._interactionSelectModify.on('select', ({ selected, mapBrowserEvent }) => {
                  if (!selected.length ||
                      !mapBrowserEvent ||
                      condition_js.shiftKeyOnly(mapBrowserEvent)) {
                      return;
                  }
                  const selectedSet = new Set(selected);
                  Array.from(this._collectionModify.getArray()).forEach((feature) => {
                      if (!selectedSet.has(feature)) {
                          this._collectionModify.remove(feature);
                      }
                  });
              });
              this._collectionModify =
                  this._interactionSelectModify.getFeatures();
              this._keyClickWms = this._map.on(this._options.evtType || 'singleclick', async (evt) => {
                  if (this._map.hasFeatureAtPixel(evt.pixel)) {
                      return;
                  }
                  // Only get other features if editmode is disabled
                  if (getMode() !== Modes.Edit && getMode() !== Modes.Query) {
                      const layer = getActiveLayerToInsertEls();
                      // If layer is hidden or is a wfs, skip
                      if (!layer.getVisible() ||
                          !layer.isVisibleByZoom() ||
                          layer instanceof WfsLayer) {
                          return;
                      }
                      const features = await layer._getFeaturesByClickEvent(evt);
                      if (!(features === null || features === void 0 ? void 0 : features.length)) {
                          return;
                      }
                      // Without shift, replace the current selection
                      if (!condition_js.shiftKeyOnly(evt)) {
                          Array.from(this._collectionModify.getArray()).forEach((feature) => {
                              this._collectionModify.remove(feature);
                          });
                      }
                      this._addFeatureToEditMode(features[0], evt.coordinate, layer.get(BaseLayerProperty.NAME));
                      this._lockSelectedFeatures();
                  }
              });
          };
          if (this._options.layers.find((layer) => layer instanceof WfsLayer)) {
              prepareWfsInteraction();
          }
          if (this._options.layers.find((layer) => layer instanceof WmsLayer)) {
              prepareWmsInteraction();
          }
          this._interactionModify = new Modify({
              style: (feature) => {
                  if (getMode() === Modes.Edit) {
                      return editVertexStyles(feature.get('existing') === true);
                  }
                  else {
                      return;
                  }
              },
              features: this._collectionModify,
              condition: (evt) => {
                  return condition_js.primaryAction(evt) && getMode() === Modes.Edit;
              }
          });
          this._map.addInteraction(this._interactionModify);
          this._interactionSnap = new Snap({
              source: getEditLayer().getSource()
          });
          this._map.addInteraction(this._interactionSnap);
          this._addSelectionInteractions();
      }
      /**
       * Interactions to select features by drawing a box (DragBox) or a freehand
       * polygon (freehand Draw lasso). The selected features are added to the
       * edit list, keeping the same behaviour as the single click selection.
       *
       * @private
       */
      _addSelectionInteractions() {
          const selectionStyle = new Style({
              fill: new Fill({
                  color: 'rgba(255, 200, 0, 0.1)'
              }),
              stroke: new Stroke({
                  color: '#ffc800',
                  width: 2,
                  lineDash: [6, 4]
              })
          });
          // Box selection (dragging a rectangle)
          this._interactionDragBox = new DragBox({
              condition: (evt) => condition_js.primaryAction(evt) && this._isSelectMode(SelectionMode.Box),
              className: 'ol-wfst--dragbox'
          });
          this._interactionDragBox.on('boxend', (evt) => {
              if (!this._isSelectMode(SelectionMode.Box)) {
                  return;
              }
              // Without shift, replace the current selection
              if (!evt.mapBrowserEvent.originalEvent.shiftKey) {
                  this._collectionModify.clear();
              }
              this._selectByGeometry(this._interactionDragBox.getGeometry());
          });
          this._map.addInteraction(this._interactionDragBox);
          // Freehand selection (holding the mouse to draw a closed lasso)
          this._interactionFreehandSelect = new Draw({
              type: GeometryType.Polygon,
              freehand: true,
              stopClick: true,
              style: selectionStyle,
              condition: (evt) => condition_js.primaryAction(evt) && this._isSelectMode(SelectionMode.Freehand)
          });
          this._interactionFreehandSelect.on('drawend', (evt) => {
              if (!this._isSelectMode(SelectionMode.Freehand)) {
                  return;
              }
              const geometry = evt.feature.getGeometry();
              const ring = geometry ? geometry.getCoordinates()[0] : [];
              // Ignore degenerate lassos (a simple click without dragging)
              if (!ring.length || ring.length < 4 || geometry.getArea() <= 0) {
                  return;
              }
              // Without shift, replace the current selection
              if (!this._shiftPressed) {
                  this._collectionModify.clear();
              }
              this._selectByGeometry(geometry);
          });
          this._map.addInteraction(this._interactionFreehandSelect);
          this._refreshSelectionInteractions();
      }
      /**
       * Whether a selection tool mode is currently usable: only outside the
       * edit/draw modes.
       *
       * @param mode
       * @private
       */
      _isSelectMode(mode) {
          return getMode() === null && getSelectionMode() === mode;
      }
      /**
       * Enable/disable the box and freehand selection interactions according to
       * the current selection tool and map mode.
       *
       * @private
       */
      _refreshSelectionInteractions() {
          const active = getMode() === null;
          if (this._interactionDragBox) {
              this._interactionDragBox.setActive(active && getSelectionMode() === SelectionMode.Box);
          }
          if (this._interactionFreehandSelect) {
              this._interactionFreehandSelect.setActive(active && getSelectionMode() === SelectionMode.Freehand);
          }
      }
      /**
       * Select the features that intersect the given polygon on the active layer
       * and add them to the edit list. WFS features are picked from the already
       * loaded source, while WMS features are requested to the GeoServer with a
       * WFS GetFeature INTERSECTS filter.
       *
       * @param geometry
       * @private
       */
      async _selectByGeometry(geometry) {
          const layer = getActiveLayerToInsertEls();
          if (!layer || !layer.getVisible() || !layer.isVisibleByZoom()) {
              showError(I18N.errors.layerNotVisible);
              return;
          }
          let features;
          if (layer instanceof WfsLayer) {
              const candidates = layer
                  .getSource()
                  .getFeaturesInExtent(geometry.getExtent());
              // The extent is only a bounding box; for the freehand lasso be
              // more precise and keep the features whose vertices fall inside it
              if (getSelectionMode() === SelectionMode.Freehand) {
                  features = candidates.filter((feature) => {
                      const featureGeom = feature.getGeometry();
                      if (!featureGeom) {
                          return false;
                      }
                      const flatCoords = featureGeom.getFlatCoordinates();
                      const stride = featureGeom.getStride();
                      for (let i = 0; i < flatCoords.length; i += stride) {
                          if (geometry.intersectsCoordinate([
                              flatCoords[i],
                              flatCoords[i + 1]
                          ])) {
                              return true;
                          }
                      }
                      return false;
                  });
              }
              else {
                  features = candidates;
              }
          }
          else if (layer instanceof WmsLayer) {
              features = await layer._getFeaturesInGeometry(geometry);
          }
          if (features) {
              this._selectFeatures(features);
          }
      }
      /**
       * Add the given features to the edit mode:
       * remove them from their original layer and push them into the edit
       * collection so they can be modified/deleted like the ones selected
       * with a single click.
       *
       * @param features
       * @private
       */
      _selectFeatures(features) {
          if (!features || !features.length) {
              return;
          }
          const layer = getActiveLayerToInsertEls();
          const layerName = layer.get(BaseLayerProperty.NAME);
          const selectedIds = new Set(this._collectionModify.getArray().map((feature) => feature.getId()));
          features.forEach((feature) => {
              if (isFeatureEdited(feature) || selectedIds.has(feature.getId())) {
                  return;
              }
              // WFS features are stored in their layer source: remove them from
              // there while they are being edited
              if (layer instanceof WfsLayer &&
                  layer.getSource().hasFeature(feature)) {
                  layer.getSource().removeFeature(feature);
              }
              this._addFeatureToEditMode(feature, null, layerName);
          });
          this._lockSelectedFeatures();
      }
      /**
       * Layer to store temporary the elements to be edited
       * @private
       */
      _prepareEditLayer() {
          this._map.addLayer(getEditLayer());
      }
      /**
       * Create the dedicated layer used to highlight the queried feature, so
       * the source layers keep their own rendering untouched.
       * @private
       */
      _prepareHighlightLayer() {
          this._highlightSource = new VectorSource();
          this._highlightLayer = new VectorLayer({
              source: this._highlightSource,
              style: (feature) => queryStyleFunction(),
              zIndex: 100
          });
          this._map.addLayer(this._highlightLayer);
      }
      /**
       * Listen for clicks while the query mode is active: get the clicked
       * feature of the active layer (from the already loaded source for WFS,
       * or through a GetFeatureInfo request for WMS), highlight it and show
       * its attributes in a popup.
       * @private
       */
      _addQueryInteraction() {
          this._keyClickQuery = this._map.on(this._options.evtType || 'singleclick', async (evt) => {
              if (getMode() !== Modes.Query) {
                  return;
              }
              const layer = getActiveLayerToInsertEls();
              // Skip hidden layers
              if (!layer.getVisible() || !layer.isVisibleByZoom()) {
                  return;
              }
              let feature = null;
              if (layer instanceof WfsLayer) {
                  const featuresAtPixel = this._map.getFeaturesAtPixel(evt.pixel, {
                      hitTolerance: 10,
                      layerFilter: (candidate) => candidate === layer
                  });
                  if (featuresAtPixel && featuresAtPixel.length) {
                      feature = featuresAtPixel[0];
                  }
              }
              else if (layer instanceof WmsLayer) {
                  const features = await layer._getFeaturesByClickEvent(evt);
                  if (features === null || features === void 0 ? void 0 : features.length) {
                      feature = features[0];
                  }
              }
              // Click on empty space: clear the previous result
              if (!feature) {
                  this._clearQueryResult();
                  return;
              }
              this._showQueryResult(feature, layer, evt.coordinate);
          });
      }
      /**
       * Highlight the given feature and attach a popup with its attributes.
       * @param feature
       * @param layer
       * @param coordinate
       * @private
       */
      _showQueryResult(feature, layer, coordinate) {
          this._clearQueryResult();
          this._highlightSource.addFeature(feature);
          this._queryOverlay = new QueryOverlay(feature, coordinate, layer);
          // @ts-expect-error
          this._queryOverlay.on('close', () => {
              this._clearQueryResult();
          });
          this._map.addOverlay(this._queryOverlay);
      }
      /**
       * Remove the query popup overlay if any.
       * @private
       */
      _removeQueryOverlay() {
          if (this._queryOverlay) {
              this._map.removeOverlay(this._queryOverlay);
              this._queryOverlay = null;
              return;
          }
          const overlay = this._map.getOverlayById(this._queryOverlayId);
          if (overlay) {
              this._map.removeOverlay(overlay);
          }
      }
      /**
       * Clear the highlight and remove the query popup.
       * @private
       */
      _clearQueryResult() {
          var _a;
          (_a = this._highlightSource) === null || _a === void 0 ? void 0 : _a.clear();
          this._removeQueryOverlay();
      }
      /**
       * Activate/deactivate the query mode: while it is active, clicking a
       * feature of the active layer shows its info in a popup instead of
       * selecting it for editing.
       *
       * @param bool
       * @public
       */
      activateQueryMode(bool = true) {
          var _a, _b;
          if (bool) {
              // Leave any draw interaction active
              if (this._interactionDraw) {
                  this._map.removeInteraction(this._interactionDraw);
                  this._viewport.classList.remove('draw-mode');
              }
              resetStateButtons();
              deactivateSelectModeButton();
              activateQueryButton();
              this._clearHoverState();
              activateMode(Modes.Query);
              // Disable the edit selection interactions while querying
              if (this._interactionSelectModify) {
                  this._interactionSelectModify.setActive(false);
              }
              if (this._interactionWfsSelect) {
                  this._interactionWfsSelect.setActive(false);
              }
              (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(false);
              this._syncExtendLineOverlays();
              this._refreshSelectionInteractions();
          }
          else {
              activateMode(null);
              deactivateQueryButton();
              activateSelectModeButton(getSelectionMode());
              if (this._interactionSelectModify) {
                  this._interactionSelectModify.setActive(true);
              }
              if (this._interactionWfsSelect) {
                  this._interactionWfsSelect.setActive(true);
              }
              (_b = this._interactionModify) === null || _b === void 0 ? void 0 : _b.setActive(true);
              this._refreshSelectionInteractions();
          }
          this._clearQueryResult();
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
                      const selectedFeatures = this._collectionModify.getArray();
                      if (selectedFeatures.length) {
                          this._deleteFeature(selectedFeatures, true);
                      }
                  }
              });
          };
          keyboardEvents();
          /**
           * Change the cursor to a pointing hand and highlight the feature
           * when hovering over a WFS feature of the active layer.
           * @private
           */
          const pointerMoveHandler = (evt) => {
              if (evt.dragging) {
                  return;
              }
              // In edit mode, give pointer feedback on the editable
              // vertices/segments
              if (getMode() === Modes.Edit) {
                  this._clearHoverState();
                  this._updateEditCursor(evt);
                  return;
              }
              // Only show the hover outside edit and draw modes
              if (getMode() !== null) {
                  this._clearHoverState();
                  return;
              }
              const layer = getActiveLayerToInsertEls();
              // Hover only works on visible WFS layers
              if (!layer ||
                  !layer.getVisible() ||
                  !layer.isVisibleByZoom() ||
                  !(layer instanceof WfsLayer)) {
                  this._clearHoverState();
                  return;
              }
              const features = this._map.getFeaturesAtPixel(evt.pixel, {
                  hitTolerance: 10,
                  layerFilter: (candidate) => candidate === layer
              });
              if (features && features.length) {
                  const feature = features[0];
                  if (feature !== this._hoveredFeature) {
                      this._clearHoverState();
                      this._hoveredFeature = feature;
                      this._hoveredFeature.setStyle((f) => styleFunction(f, true));
                  }
                  if (this._viewport.style.cursor !== 'pointer') {
                      this._viewport.style.cursor = 'pointer';
                  }
              }
              else {
                  this._clearHoverState();
              }
          };
          this._map.on('pointermove', pointerMoveHandler);
          // Store the shift state when a gesture starts, so the freehand
          // selection can decide between adding or replacing the selection
          this._viewport.addEventListener('pointerdown', (evt) => {
              this._shiftPressed = evt.shiftKey;
          });
          // Clear the hover before firing a click, otherwise the Select interaction
          // would capture the hover style as the original style of the feature and
          // restore it on deselect, leaving the highlight permanently enabled.
          this._viewport.addEventListener('pointerdown', () => this._clearHoverState());
          this._viewport.addEventListener('pointerleave', () => this._clearHoverState(), { once: false });
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
       * Allow panning with the middle mouse button at all times, even when the
       * draw/freehand/box interactions are consuming the left button. The
       * middle pointerdown is intercepted in the capture phase so OpenLayers
       * never processes it and the active tool is not affected.
       *
       * @private
       */
      _addMiddleButtonPan() {
          const viewport = this._viewport;
          let panning = false;
          let lastX = 0;
          let lastY = 0;
          const isMiddleButton = (evt) => evt.pointerType === 'mouse' && evt.button === 1;
          const stopPanning = () => {
              panning = false;
          };
          viewport.addEventListener('pointerdown', (evt) => {
              if (!isMiddleButton(evt)) {
                  return;
              }
              evt.preventDefault();
              evt.stopPropagation();
              viewport.setPointerCapture(evt.pointerId);
              panning = true;
              lastX = evt.clientX;
              lastY = evt.clientY;
              if (this._view.getAnimating()) {
                  this._view.cancelAnimations();
              }
          }, true);
          viewport.addEventListener('pointermove', (evt) => {
              if (!panning) {
                  return;
              }
              evt.preventDefault();
              const delta = [lastX - evt.clientX, evt.clientY - lastY];
              lastX = evt.clientX;
              lastY = evt.clientY;
              const resolution = this._view.getResolution();
              const rotation = this._view.getRotation();
              const cosAngle = Math.cos(rotation);
              const sinAngle = Math.sin(rotation);
              const x = (delta[0] * cosAngle - delta[1] * sinAngle) * resolution;
              const y = (delta[1] * cosAngle + delta[0] * sinAngle) * resolution;
              this._view.adjustCenterInternal([x, y]);
          });
          const endPan = () => {
              if (!panning) {
                  return;
              }
              stopPanning();
          };
          viewport.addEventListener('pointerup', endPan);
          viewport.addEventListener('pointercancel', endPan);
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
              evt.features.forEach((feature) => {
                  addFeatureToEditedList(feature);
              });
              super.dispatchEvent(evt);
          });
          this._interactionModify.on('modifystart', (evt) => {
              super.dispatchEvent(evt);
          });
          // Keep the "continue drawing" buttons glued to the line endpoints
          // @ts-expect-error - 'modify' is a valid Modify event not typed in the `on` signature
          this._interactionModify.on('modify', () => {
              this._updateExtendOverlayPositions();
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
              if (getMode() === Modes.Query) {
                  this.activateQueryMode(false);
              }
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
          // @ts-expect-error
          this._layersControl.on('changeLayer', () => {
              if (getMode() === Modes.Draw) {
                  this.activateDrawMode(getActiveLayerToInsertEls());
              }
          });
          [
              ['selectModeSingle', SelectionMode.Single],
              ['selectModeBox', SelectionMode.Box],
              ['selectModeFreehand', SelectionMode.Freehand]
          ].forEach(([evtName, mode]) => {
              // @ts-expect-error
              this._layersControl.on(evtName, () => {
                  // Leaving the draw mode when a select tool is chosen
                  if (getMode() === Modes.Draw) {
                      resetStateButtons();
                      this.activateEditMode();
                  }
                  // Leaving the query mode when a select tool is chosen
                  if (getMode() === Modes.Query) {
                      this.activateQueryMode(false);
                  }
                  setSelectionMode(mode);
                  activateSelectModeButton(mode);
                  this._refreshSelectionInteractions();
              });
          });
          // @ts-expect-error
          this._layersControl.on('queryMode', () => {
              this.activateQueryMode(getMode() !== Modes.Query);
          });
          const controlEl = this._layersControl.render();
          this._selectDraw = controlEl.querySelector('.wfst--tools-control--select-draw');
          this._controlWidgetToolsDiv.append(controlEl.querySelector('.wfst--tools-control--head'));
          if (this._options.layers.length > 1) {
              this._layersWidgetDiv.append(controlEl.querySelector('.wfst--tools-control--select-layers'));
          }
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
          // Reset any per-feature style (e.g. hover) before returning the feature
          // to its layer, so it renders with the layer's default style.
          feature.setStyle(undefined);
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
          if (this._keySelectBound) {
              return;
          }
          this._keySelectBound = true;
          // This is fired when a feature is deselected and fires the transaction process
          if (this._keySelect) {
              Observable.unByKey(this._keySelect);
          }
          this._keySelect = this._collectionModify.on('remove', (evt) => {
              const feature = evt.element;
              this._deselectEditFeature(feature);
              this._syncEditOverlays();
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
                  Observable.unByKey(this._keySelect);
                  this._keySelectBound = false;
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
       * @param features
       * @private
       */
      _editModeOn(features) {
          features = Array.isArray(features) ? features : [features];
          features.forEach((feature) => {
              this._editFeaturesOriginal[String(feature.getId())] =
                  feature.clone();
          });
          activateMode(Modes.Edit);
          // Show the "continue drawing" buttons on the line endpoints
          this._syncExtendLineOverlays();
          // To refresh the style
          getEditLayer().getSource().changed();
          this._refreshSelectionInteractions();
          const multiOverlay = this._map.getOverlayById(this._multiOverlayId);
          if (multiOverlay) {
              this._map.removeOverlay(multiOverlay);
          }
          features.forEach((feature) => {
              this._removeOverlayHelper(feature);
          });
          this._controlApplyDiscardChanges = new EditControlChangesEl(features);
          this._controlApplyDiscardChanges.on('cancel', (evt) => {
              const list = evt.features;
              Array.from(list).forEach((feature) => {
                  const original = this._editFeaturesOriginal[String(feature.getId())];
                  if (original) {
                      feature.setGeometry(original.getGeometry());
                  }
                  removeFeatureFromEditList(feature);
                  this._collectionModify.remove(feature);
              });
          });
          this._controlApplyDiscardChanges.on('apply', async (evt) => {
              showLoading();
              const list = evt.features;
              const ok = await this._transactEditList(list);
              if (ok) {
                  Array.from(list).forEach((feature) => {
                      this._collectionModify.remove(feature);
                  });
              }
          });
          this._controlApplyDiscardChanges.on('delete', (evt) => {
              this._deleteFeature(evt.features, true);
          });
          this._map.addControl(this._controlApplyDiscardChanges);
      }
      /**
       * @private
       */
      _editModeOff() {
          activateMode(null);
          this._destroyExtendLineOverlays();
          this._map.removeControl(this._controlApplyDiscardChanges);
          this._refreshSelectionInteractions();
      }
      /**
       * Get the first and last coordinate of every line component of a
       * LineString/MultiLineString geometry, including the line components
       * nested inside a GeometryCollection. Anything else returns an empty
       * array.
       *
       * @param geometry
       * @private
       */
      _getLineEndPoints(geometry) {
          const endPoints = [];
          const appendLine = (line, collection) => {
              if (line instanceof LineString) {
                  if (line.getCoordinates().length) {
                      endPoints.push({
                          first: line.getFirstCoordinate(),
                          last: line.getLastCoordinate(),
                          line,
                          lineIndex: 0,
                          collection
                      });
                  }
                  return;
              }
              line.getCoordinates().forEach((coordinates, lineIndex) => {
                  if (coordinates.length) {
                      endPoints.push({
                          first: coordinates[0],
                          last: coordinates[coordinates.length - 1],
                          line,
                          lineIndex,
                          collection
                      });
                  }
              });
          };
          // "getGeometries()" returns deep clones (see ol GeometryCollection),
          // but the extend/merge must work on the actual members.
          const collect = (geometry, collection) => {
              if (geometry instanceof LineString ||
                  geometry instanceof MultiLineString) {
                  appendLine(geometry, collection);
              }
              else if (geometry instanceof GeometryCollection) {
                  geometry.getGeometriesArray().forEach((member) => {
                      collect(member, geometry);
                  });
              }
          };
          collect(geometry);
          return endPoints;
      }
      /**
       * Remove every "continue drawing" overlay and abort any active line
       * extension draw.
       *
       * @private
       */
      _destroyExtendLineOverlays() {
          if (this._extendDraw) {
              this._finishExtendDraw();
          }
          this._extendOverlays.forEach((overlay) => {
              this._map.removeOverlay(overlay);
          });
          this._extendOverlays = [];
      }
      /**
       * Keep the "continue drawing" overlays in sync with the current edit
       * selection: they are only shown while editing LineString/MultiLineString
       * features, and they are repositioned on the endpoints of each line
       * component.
       *
       * @private
       */
      _syncExtendLineOverlays() {
          if (getMode() !== Modes.Edit || !this._collectionModify) {
              this._destroyExtendLineOverlays();
              return;
          }
          const items = this._collectionModify.getArray();
          // Remove overlays whose feature was deselected or lost its line geometry
          const removed = [];
          this._extendOverlays.forEach((overlay) => {
              const stale = !items.includes(overlay.feature) ||
                  overlay.component >=
                      this._getLineEndPoints(overlay.feature.getGeometry())
                          .length;
              if (stale) {
                  this._map.removeOverlay(overlay);
                  removed.push(overlay);
              }
          });
          this._extendOverlays = this._extendOverlays.filter((overlay) => !removed.includes(overlay));
          // Add overlays for new LineString/MultiLineString features
          items.forEach((feature) => {
              this._getLineEndPoints(feature.getGeometry()).forEach(({ first, last }, component) => {
                  ['start', 'end'].forEach((side) => {
                      const exists = this._extendOverlays.some((overlay) => overlay.feature === feature &&
                          overlay.component === component &&
                          overlay.side === side);
                      if (exists) {
                          return;
                      }
                      const overlay = new ExtendLineOverlay(feature, side === 'start' ? first : last, side, component, () => this._startExtendLineDraw(feature, side, component));
                      this._extendOverlays.push(overlay);
                      this._map.addOverlay(overlay);
                  });
              });
          });
          this._updateExtendOverlayPositions();
      }
      /**
       * Move the "continue drawing" overlays to the current position of their
       * line endpoints, e.g. after a vertex is dragged with the Modify
       * interaction.
       *
       * @private
       */
      _updateExtendOverlayPositions() {
          this._extendOverlays.forEach((overlay) => {
              const point = this._getLineEndPoints(overlay.feature.getGeometry())[overlay.component];
              if (!point) {
                  return;
              }
              overlay.setPosition(overlay.side === 'start' ? point.first : point.last);
          });
      }
      /**
       * Start drawing a continuation of a line from one of its endpoints. The
       * sketch is anchored on the clicked vertex, so the next clicks append the
       * new points. A double click (or clicking back on the last point) ends
       * the drawing and merges the segment into the feature.
       *
       * @param feature
       * @param side 'start' prepends the new segment, 'end' appends it
       * @param component index of the clicked line component
       * @private
       */
      _startExtendLineDraw(feature, side, component = 0) {
          var _a;
          if (this._extendDraw || getMode() !== Modes.Edit) {
              return;
          }
          const points = this._getLineEndPoints(feature.getGeometry());
          if (!points.length || component >= points.length) {
              return;
          }
          const anchor = side === 'start' ? points[component].first : points[component].last;
          // While extending, the Modify/Select interactions must not grab the clicks
          (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(false);
          if (this._interactionSelectModify) {
              this._interactionSelectModify.setActive(false);
          }
          if (this._interactionWfsSelect) {
              this._interactionWfsSelect.setActive(false);
          }
          this._extendDraw = new Draw({
              type: GeometryType.LineString,
              style: (f) => styleFunction(f),
              stopClick: true // To prevent firing a map/wms click
          });
          this._extendDraw.on('drawend', (evt) => {
              this._mergeExtendLine(feature, side, evt.feature, component);
          });
          this._extendDraw.on('drawabort', () => {
              this._finishExtendDraw();
          });
          this._map.addInteraction(this._extendDraw);
          // Anchor the sketch on the clicked vertex: the user only has to digitize
          // the continuation points (this also dispatches the "drawstart" event)
          this._extendDraw.appendCoordinates([anchor]);
      }
      /**
       * Merge the just-drawn segment into the edited feature's line geometry and
       * restore the editing interactions.
       *
       * @param feature
       * @param side
       * @param sketch
       * @param component index of the extended line component
       * @private
       */
      _mergeExtendLine(feature, side, sketch, component = 0) {
          const points = this._getLineEndPoints(feature.getGeometry());
          const point = points[component];
          if (!point) {
              this._finishExtendDraw();
              return;
          }
          const segment = sketch.getGeometry().getCoordinates();
          const { line, lineIndex } = point;
          if (line instanceof LineString) {
              const coords = line.getCoordinates();
              if (side === 'start') {
                  line.setCoordinates([...segment.slice(1).reverse(), ...coords]);
              }
              else {
                  line.setCoordinates([...coords, ...segment.slice(1)]);
              }
          }
          else if (line instanceof MultiLineString) {
              const coords = line.getCoordinates();
              if (side === 'start') {
                  coords[lineIndex] = [
                      ...segment.slice(1).reverse(),
                      ...coords[lineIndex]
                  ];
              }
              else {
                  coords[lineIndex] = [...coords[lineIndex], ...segment.slice(1)];
              }
              line.setCoordinates(coords);
          }
          // Only mark the feature as edited when the segment added new vertices
          if (segment.length > 1) {
              addFeatureToEditedList(feature);
          }
          this._finishExtendDraw();
          this._syncExtendLineOverlays();
      }
      /**
       * Remove the active line extension draw and restore the interactions that
       * were disabled while drawing.
       *
       * @private
       */
      _finishExtendDraw() {
          var _a;
          if (this._extendDraw) {
              this._map.removeInteraction(this._extendDraw);
              this._extendDraw = null;
          }
          if (getMode() !== Modes.Edit) {
              return;
          }
          (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(true);
          if (this._interactionSelectModify) {
              this._interactionSelectModify.setActive(true);
          }
          if (this._interactionWfsSelect) {
              this._interactionWfsSelect.setActive(true);
          }
      }
      /**
       * Send all the given features in a single WFS-T Update transaction per
       * layer, so a multi selection is saved with only one request. The "edited"
       * flag is cleared before transacting, so a deselect fired while the
       * request is in flight does not trigger a duplicate transaction.
       *
       * @param list
       * @returns false when there is nothing to transact or the transaction fails
       * @private
       */
      async _transactEditList(list) {
          if (!list.length) {
              return true;
          }
          const byLayer = {};
          list.forEach((feature) => {
              const layerName = feature.get('_layerName_');
              if (!byLayer[layerName]) {
                  byLayer[layerName] = [];
              }
              byLayer[layerName].push(feature);
          });
          for (const layerName of Object.keys(byLayer)) {
              const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
              if (!layer) {
                  continue;
              }
              byLayer[layerName].forEach((feature) => {
                  removeFeatureFromEditList(feature);
              });
              let ok;
              try {
                  ok = await layer.transactFeatures(TransactionType.Update, byLayer[layerName]);
              }
              catch (err) {
                  return false;
              }
              if (ok === false) {
                  return false;
              }
          }
          return true;
      }
      /**
       * Remove features from the edit Layer and from the Geoserver
       *
       * @param feature
       * @param confirm
       * @private
       */
      _deleteFeature(feature, confirm) {
          const deleteEl = () => {
              var _a;
              const features = Array.isArray(feature) ? feature : [feature];
              features.forEach((feature) => {
                  feature.set('_delete_', true, true);
                  getEditLayer().getSource().removeFeature(feature);
              });
              this._collectionModify.clear();
              this._editModeOff();
              this._syncEditOverlays();
              const layerName = (_a = features[0]) === null || _a === void 0 ? void 0 : _a.get('_layerName_');
              const layer = layerName
                  ? this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName)
                  : null;
              if (layer instanceof WfsLayer) {
                  features.forEach((feature) => {
                      this._interactionWfsSelect.getFeatures().remove(feature);
                  });
              }
          };
          if (confirm) {
              const features = Array.isArray(feature) ? feature : [feature];
              const message = features.length > 1
                  ? I18N_('confirmDeleteElements', features.length)
                  : I18N.labels.confirmDelete;
              const confirmModal = Modal.confirm(message, Object.assign({}, this._options.modal));
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
          if (layerName) {
              // Store the layer information inside the feature
              feature.set('_layerName_', layerName);
          }
          if (coordinate) {
              // Keep the click coordinate to position the overlay helper
              feature.set('_editOverlayCoord_', coordinate);
          }
          const props = feature ? feature.getProperties() : '';
          if (props) {
              if (feature.getGeometry()) {
                  getEditLayer().getSource().addFeature(feature);
                  this._collectionModify.push(feature);
                  this._syncEditOverlays();
              }
          }
      }
      /**
       * Lock the whole current selection with a single LockFeature request per
       * layer, so the transaction LockId covers all the selected features
       *
       * @private
       */
      async _lockSelectedFeatures() {
          const byLayer = {};
          this._collectionModify.getArray().forEach((selected) => {
              const layerName = selected.get('_layerName_');
              if (!layerName) {
                  return;
              }
              (byLayer[layerName] || (byLayer[layerName] = [])).push(selected.getId());
          });
          const locks = [];
          Object.keys(byLayer).forEach((layerName) => {
              const layer = getStoredLayer(layerName);
              if (layer) {
                  locks.push(layer.maybeLockFeature(byLayer[layerName]));
              }
          });
          if (locks.length) {
              await Promise.all(locks);
          }
      }
      /**
       * Create an EditOverlay helper and attach the edit listeners
       *
       * @param feature
       * @param coordinate
       * @param id
       * @private
       */
      _createEditOverlay(feature = null, coordinate = null, id = null) {
          coordinate =
              coordinate || (feature ? feature.get('_editOverlayCoord_') : null);
          const overlay = new EditOverlay(feature, coordinate, id);
          // @ts-expect-error
          overlay.on('editFields', () => {
              this._editFields.show(this._collectionModify.getArray());
          });
          // @ts-expect-error
          overlay.on('editGeom', () => {
              this._editModeOn(this._collectionModify.getArray());
          });
          this._map.addOverlay(overlay);
      }
      /**
       * Sync the edit overlay helpers with the current selection: a single
       * per-feature overlay while a feature is selected, or a unique overlay
       * centered between all the selected features when editing several at once
       *
       * @private
       */
      _syncEditOverlays() {
          if (getMode() === Modes.Edit) {
              return;
          }
          const multiOverlay = this._map.getOverlayById(this._multiOverlayId);
          if (multiOverlay) {
              this._map.removeOverlay(multiOverlay);
          }
          const items = this._collectionModify.getArray();
          if (items.length > 1) {
              items.forEach((feature) => {
                  this._removeOverlayHelper(feature);
              });
              const extent = extent_js.createEmpty();
              items.forEach((feature) => {
                  extent_js.extend(extent, feature.getGeometry().getExtent());
              });
              this._createEditOverlay(null, extent_js.getCenter(extent), this._multiOverlayId);
          }
          else if (items.length === 1) {
              const feature = items[0];
              const featureId = feature.getId();
              if (featureId && !this._map.getOverlayById(featureId)) {
                  this._createEditOverlay(feature);
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
              this._interactionDraw = new Draw({
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
              // Clear hover style while drawing
              this._clearHoverState();
              activateDrawButton();
              deactivateSelectModeButton();
              this._viewport.classList.add('draw-mode');
              addDrawInteraction(layer);
          }
          else {
              this._map.removeInteraction(this._interactionDraw);
              this._viewport.classList.remove('draw-mode');
              activateSelectModeButton(getSelectionMode());
          }
          activateMode(layer ? Modes.Draw : null);
          this._refreshSelectionInteractions();
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
              // Clear hover state when leaving the edit mode
              this._clearHoverState();
          }
          if (this._interactionSelectModify) {
              this._interactionSelectModify.setActive(bool);
          }
          this._interactionModify.setActive(bool);
          if (this._interactionWfsSelect)
              this._interactionWfsSelect.setActive(bool);
          this._refreshSelectionInteractions();
      }
      /**
       * Reset the cursor and remove the hover style of the last hovered feature
       * @private
       */
      _clearHoverState() {
          if (this._viewport) {
              this._viewport.style.cursor = '';
          }
          if (this._hoveredFeature) {
              this._hoveredFeature.setStyle(undefined);
              this._hoveredFeature = null;
          }
      }
      /**
       * Change the map cursor while in edit mode: `move` when the pointer is
       * over an editable vertex and `copy` when it is over a segment (where a
       * new vertex can be inserted), mirroring the Modify interaction hit
       * tolerance.
       *
       * @param evt
       * @private
       */
      _updateEditCursor(evt) {
          if (!this._collectionModify) {
              return;
          }
          const tolerance = 12;
          const toleranceSq = tolerance * tolerance;
          const pixel = evt.pixel;
          for (const feature of this._collectionModify.getArray()) {
              const vertices = getFeatureVertices(feature);
              const coordinates = vertices ? vertices.getCoordinates() : [];
              if (!coordinates.length) {
                  continue;
              }
              // Hovering an existing vertex (draggable handle)
              for (const coordinate of coordinates) {
                  const vertexPixel = this._map.getPixelFromCoordinate(coordinate);
                  if (coordinate_js.squaredDistance(vertexPixel, pixel) <= toleranceSq) {
                      this._viewport.style.cursor = 'move';
                      return;
                  }
              }
              // Hovering a segment (allows inserting a new vertex)
              for (let i = 0; i < coordinates.length - 1; i++) {
                  const start = this._map.getPixelFromCoordinate(coordinates[i]);
                  const end = this._map.getPixelFromCoordinate(coordinates[i + 1]);
                  if (coordinate_js.squaredDistanceToSegment(pixel, [start, end]) <= toleranceSq) {
                      this._viewport.style.cursor = 'copy';
                      return;
                  }
              }
          }
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
  class WfstEvent extends BaseEvent {
      constructor(options) {
          super(options.type);
          this.layer = options.layer;
          this.data = options.data;
      }
  }

  const utils = {
      WfsLayer,
      WmsLayer,
      Geoserver
  };
  Object.assign(Wfst, utils);

  return Wfst;

}));
//# sourceMappingURL=ol-wfst.js.map
