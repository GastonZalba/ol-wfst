(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol'), require('ol/format'), require('ol/source'), require('ol/layer'), require('ol/interaction'), require('ol/Observable'), require('ol/geom'), require('ol/loadingstrategy'), require('ol/extent'), require('ol/style')) :
  typeof define === 'function' && define.amd ? define(['ol', 'ol/format', 'ol/source', 'ol/layer', 'ol/interaction', 'ol/Observable', 'ol/geom', 'ol/loadingstrategy', 'ol/extent', 'ol/style'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(global.ol, global.ol.format, global.ol.source, global.ol.layer, global.ol.interaction, global.ol.Observable, global.ol.geom, global.ol.loadingstrategy, global.ol.extent, global.ol.style));
}(this, (function (ol, format, source, layer, interaction, Observable, geom, loadingstrategy, extent, style) { 'use strict';

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
  };
  /**
   * @constructor
   * @param {class} map
   * @param {object} opt_options
   */

  class Wfst {
    constructor(map, opt_options) {
      this.layerMode = opt_options.layerMode || 'wms';
      this.evtType = opt_options.evtType || 'singleclick';
      this.wfsStrategy = opt_options.wfsStrategy || 'bbox'; // const active = ('active' in opt_options) ? opt_options.active : true;

      var layers = opt_options.layers ? Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers] : null;
      this.urlGeoserverWms = opt_options.urlWms;
      this.urlGeoserverWfs = opt_options.urlWfs;

      if (opt_options.showError) {
        this.showError = msg => opt_options.showError(msg);
      }

      this.map = map;
      this.view = map.getView();
      this.viewport = map.getViewport();
      this._editedFeatures = [];
      this._layers = [];
      this._layersData = {};
      this.insertFeatures = [];
      this.updateFeatures = [];
      this.deleteFeatures = [];
      this.formatWFS = new format.WFS();
      this.formatGeoJSON = new format.GeoJSON();
      this.xs = new XMLSerializer();
      this.countRequests = 0;
      this.init(layers);
    }

    init(layers) {
      return __awaiter(this, void 0, void 0, function* () {
        if (layers) {
          this.createLayers(layers);
          yield this.getLayersData(layers);
        }

        this.createEditLayer();
        this.addLayerModeInteractions();
        this.addInteractions();
        this.addHandlers();
        this.addDrawInteraction(layers[0]);
        this.addKeyboardEvents();
      });
    } // Layer to store temporary all the elements to edit


    createEditLayer() {
      this.editLayer = new layer.Vector({
        source: new source.Vector(),
        zIndex: 5
      });
      this.map.addLayer(this.editLayer);
    } // Add already created layers to the map


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
      this.getLayersData(layersStr);
    }

    getLayersData(layers) {
      return __awaiter(this, void 0, void 0, function* () {
        var getLayerData = layerName => __awaiter(this, void 0, void 0, function* () {
          var params = new URLSearchParams({
            version: '2.0.0',
            request: 'DescribeFeatureType',
            typeNames: layerName,
            outputFormat: 'application/json',
            exceptions: 'application/json'
          });
          var url_fetch = this.urlGeoserverWfs + '?' + params.toString();

          try {
            var response = yield fetch(url_fetch);
            var data = yield response.json();
            return data;
          } catch (err) {
            console.error(err);
            return null;
          }
        });

        for (var layerName of layers) {
          var data = yield getLayerData(layerName);

          if (data) {
            var targetNamespace = data.targetNamespace;
            var properties = data.featureTypes[0].properties; // Fixme

            var geom = properties[0];
            this._layersData[layerName] = {
              namespace: targetNamespace,
              properties: properties,
              geomType: geom.localType
            };
          }
        }
      });
    }

    createLayers(layers) {
      var newWmsLayer = layerName => {
        var layer$1 = new layer.Tile({
          source: new source.TileWMS({
            url: this.urlGeoserverWms,
            params: {
              'LAYERS': layerName,
              'TILED': true
            },
            serverType: 'geoserver'
          }),
          zIndex: 4
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
            var params = new URLSearchParams({
              version: '1.0.0',
              request: 'GetFeature',
              typename: layerName,
              outputFormat: 'application/json',
              exceptions: 'application/json',
              srsName: 'urn:ogc:def:crs:EPSG::4326'
            }); // If bbox, add extent to the request

            if (this.wfsStrategy === 'bbox') params.append('bbox', extent.join(','));
            var url_fetch = this.urlGeoserverWfs + '?' + params.toString();

            try {
              var response = yield fetch(url_fetch);
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
        var layer;

        if (this.layerMode === 'wms') {
          layer = newWmsLayer(layerName);
        } else {
          layer = newWfsLayer(layerName);
        }

        this.map.addLayer(layer);
        this._layers[layerName] = layer;
      });
    }

    showError(msg) {
      modalVanilla.alert(msg).show();
    }

    transactWFS(mode, feature) {
      return __awaiter(this, void 0, void 0, function* () {
        var cloneFeature = feature => {
          delete this._editedFeatures[feature.getId()];
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

        var clone = cloneFeature(feature); // Peevent fire multiples times

        this.countRequests++;
        var numberRequest = this.countRequests;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
          if (numberRequest !== this.countRequests) return;
          var layerName = feature.get('_layerName_');
          var options = {
            featureNS: this._layersData[layerName].namespace,
            featureType: layerName,
            srsName: 'urn:ogc:def:crs:EPSG::4326',
            featurePrefix: null,
            nativeElements: null
          };

          switch (mode) {
            case 'insert':
              this.insertFeatures = [...this.insertFeatures, clone];
              break;

            case 'update':
              this.updateFeatures = [...this.updateFeatures, clone];
              break;

            case 'delete':
              this.deleteFeatures = [...this.deleteFeatures, clone];
              break;
          }

          var transaction = this.formatWFS.writeTransaction(this.insertFeatures, this.updateFeatures, this.deleteFeatures, options);
          var payload = this.xs.serializeToString(transaction); // Fixes geometry name

          payload = payload.replaceAll("geometry", "geom");

          try {
            var response = yield fetch(this.urlGeoserverWfs, {
              method: 'POST',
              body: payload,
              headers: {
                'Content-Type': 'text/xml',
                'Access-Control-Allow-Origin': '*'
              }
            });
            var parseResponse = this.formatWFS.readTransactionResponse(response);

            if (!Object.keys(parseResponse).length) {
              var findError = String(response).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
              if (findError) this.showError(findError[1]);
            }

            if (mode !== 'delete') this.editLayer.getSource().removeFeature(feature);
            if (this.layerMode === 'wfs') refreshWfsLayer(this._layers[layerName]);else if (this.layerMode === 'wms') refreshWmsLayer(this._layers[layerName]);
          } catch (err) {
            console.error(err);
          }

          this.insertFeatures = [];
          this.updateFeatures = [];
          this.deleteFeatures = [];
          this.countRequests = 0;
        }), 300);
      });
    }

    addLayerModeInteractions() {
      // Select the wfs feature already downloaded
      var addWfsInteraction = () => {
        // Interaction to select wfs layer elements
        this.interactionWfsSelect = new interaction.Select({
          hitTolerance: 10,
          style: feature => this.styleFunction(feature),
          filter: (feature, layer) => {
            return layer && layer.get('type') === '_wfs_';
          }
        });
        this.map.addInteraction(this.interactionWfsSelect);
        this.interactionWfsSelect.on('select', (_ref) => {
          var {
            selected,
            deselected
          } = _ref;

          if (deselected.length) {
            deselected.forEach(feature => {
              this.map.removeOverlay(this.map.getOverlayById(feature.getId()));
            });
          }

          if (selected.length) {
            selected.forEach(feature => {
              if (!this._editedFeatures[feature.getId()]) {
                // Remove the feature from the original layer                            
                var layer = this.interactionWfsSelect.getLayer(feature);
                layer.getSource().removeFeature(feature);
                this.addFeatureToEdit(feature);
              }
            });
          }
        });
      }; // Call the geoserver to get the clicked feature


      var addWmsInteraction = () => {
        var getFeatures = evt => __awaiter(this, void 0, void 0, function* () {
          var _this = this;

          var _loop = function* _loop(layerName) {
            var layer = _this._layers[layerName]; // Si la vista es lejana, disminumos el buffer
            // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
            // y mejorar la sensibilidad en IOS

            var buffer = _this.view.getZoom() > 10 ? 10 : 5;
            var url = layer.getSource().getFeatureInfoUrl(evt.coordinate, _this.view.getResolution(), _this.view.getProjection(), {
              'INFO_FORMAT': 'application/json',
              'BUFFER': buffer,
              'FEATURE_COUNT': 1,
              'EXCEPTIONS': 'application/json'
            });

            try {
              var response = yield fetch(url);
              var data = yield response.json();

              var features = _this.formatGeoJSON.readFeatures(data);

              if (!features.length) return {
                v: void 0
              };
              features.forEach(feature => _this.addFeatureToEdit(feature, layerName));
            } catch (err) {
              console.error(err);
            }
          };

          for (var layerName in this._layers) {
            var _ret = yield* _loop(layerName);

            if (typeof _ret === "object") return _ret.v;
          }
        });

        this.keyClickWms = this.map.on(this.evtType, evt => __awaiter(this, void 0, void 0, function* () {
          if (this.map.hasFeatureAtPixel(evt.pixel)) return;
          yield getFeatures(evt);
        }));
      };

      if (this.layerMode === 'wfs') addWfsInteraction();else if (this.layerMode === 'wms') addWmsInteraction();
    }

    addFeatureToEditedList(feature) {
      this._editedFeatures.push(String(feature.getId()));
    }

    isFeatureEdited(feature) {
      return this._editedFeatures[String(feature.getId())];
    }

    addInteractions() {
      this.interactionSelect = new interaction.Select({
        style: feature => this.styleFunction(feature),
        layers: [this.editLayer]
      });
      this.map.addInteraction(this.interactionSelect);
      this.interactionModify = new interaction.Modify({
        features: this.interactionSelect.getFeatures()
      });
      this.map.addInteraction(this.interactionModify);
      this.interactionSnap = new interaction.Snap({
        source: this.editLayer.getSource()
      });
      this.map.addInteraction(this.interactionSnap);
    }

    addDrawInteraction(layerName) {
      this.interactionDraw = new interaction.Draw({
        source: this.editLayer.getSource(),
        type: this._layersData[layerName].geomType
      });
      this.map.addInteraction(this.interactionDraw);
      this.activateDrawMode(false);

      var drawHandler = () => {
        this.interactionDraw.on('drawend', evt => {
          Observable.unByKey(this.keyRemove);
          var feature = evt.feature;
          feature.set('_layerName_', layerName,
          /* silent = */
          true); //feature.setId(feature.id_);

          this.transactWFS('insert', feature);
          setTimeout(() => {
            this.removeFeatureHandler();
          }, 150);
        });
      };

      drawHandler();
    }

    selectFeatureHandler() {
      // This is fired when a feature is deselected and fires the transaction process
      // and update the geoserver
      this.keySelect = this.interactionSelect.getFeatures().on('remove', evt => {
        var feature = evt.element;
        Observable.unByKey(this.keyRemove);

        if (this.isFeatureEdited(feature)) {
          this.transactWFS('update', feature);
        } else {
          // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
          if (this.layerMode === 'wfs') {
            var layer = this._layers[feature.get('_layerName_')];

            layer.getSource().addFeature(feature);
          }

          this.editLayer.getSource().removeFeature(feature);
          this.interactionSelect.getFeatures().clear();
        }

        setTimeout(() => {
          this.removeFeatureHandler();
        }, 150);
      });
    }

    removeFeatureHandler() {
      // If a feature is removed from the edit layer
      this.keyRemove = this.editLayer.getSource().on('removefeature', evt => {
        Observable.unByKey(this.keySelect);
        var feature = evt.feature;
        this.transactWFS('delete', feature);
        setTimeout(() => {
          this.selectFeatureHandler();
        }, 150);
      });
    }

    addHandlers() {
      // When a feature is modified, add this to a list.
      // This prevent events fired on select and deselect features that has no changes and should
      // not be updated in the geoserver
      this.interactionModify.on('modifystart', evt => {
        this.addFeatureToEditedList(evt.features.item(0));
      });
      this.selectFeatureHandler();
      this.removeFeatureHandler();
    }

    styleFunction(feature) {
      var showVerticesStyle = new style.Style({
        image: new style.Circle({
          radius: 6,
          fill: new style.Fill({
            color: '#ffffff'
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
      });
      var type = feature.getGeometry().getType();

      switch (type) {
        case 'Point':
        case 'MultiPoint':
          return [new style.Style({
            image: new style.Circle({
              radius: 5,
              stroke: new style.Stroke({
                color: 'rgba( 255, 255, 255, 0.8)',
                width: 12
              })
            })
          })];

        default:
          return [new style.Style({
            stroke: new style.Stroke({
              color: 'rgba( 255, 0, 0, 1)',
              width: 4
            })
          }), showVerticesStyle, new style.Style({
            stroke: new style.Stroke({
              color: 'rgba( 255, 255, 255, 0.7)',
              width: 2
            })
          })];
      }
    }

    deleteElement(feature) {
      var features = Array.isArray(feature) ? feature : [feature];
      features.forEach(feature => this.editLayer.getSource().removeFeature(feature));
      this.interactionSelect.getFeatures().clear();
    }

    addKeyboardEvents() {
      document.addEventListener('keydown', (_ref2) => {
        var {
          key
        } = _ref2;

        if (key === "Delete") {
          var selectedFeatures = this.interactionSelect.getFeatures();

          if (selectedFeatures) {
            selectedFeatures.forEach(feature => {
              this.deleteElement(feature);
            });
          }
        }
      });
    }

    addFeatureToEdit(feature) {
      var layerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var prepareOverlay = () => {
        var svg = "\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\">\n            <path d=\"M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z\"></path>\n            </svg>";
        var editEl = document.createElement('div');
        editEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\">".concat(svg, "</button>");

        editEl.onclick = () => {
          this.initModal(feature);
        };

        var buttons = document.createElement('div');
        buttons.append(editEl);
        var buttonsOverlay = new ol.Overlay({
          id: feature.getId(),
          position: extent.getCenter(feature.getGeometry().getExtent()),
          element: buttons,
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
          this.editLayer.getSource().addFeature(feature);
          this.interactionSelect.getFeatures().push(feature);
          prepareOverlay();
        }
      }
    }

    activateDrawMode() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.interactionDraw.setActive(bool);
    }

    activateEditMode() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.interactionSelect.setActive(bool);
      this.interactionModify.setActive(bool); // FIXME
      // if (this.layerMode === 'wms') {
      //     if (!bool) unByKey(this.clickWmsKey);
      // }
    }

    initModal(feature) {
      this.editFeature = feature;
      var properties = feature.getProperties();
      var layer = feature.get('_layerName_'); // Data schema from the geoserver

      var dataSchema = this._layersData[layer].properties;
      var content = '';
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
      var footer = "\n            <button type=\"button\" class=\"btn btn-danger\" data-action=\"delete\" data-dismiss=\"modal\">Eliminar</button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancelar</button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">Guardar</button>\n        ";
      this.modal = new modalVanilla({
        header: true,
        headerClose: true,
        title: "Editar elemento ".concat(this.editFeature.getId()),
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
            this.editFeature.set(field, value,
            /*isSilent = */
            true);
          });
          this.editFeature.changed();
          this.addFeatureToEditedList(this.editFeature);
          this.transactWFS('update', this.editFeature);
        } else if (event.target.dataset.action === 'delete') {
          this.map.removeOverlay(this.map.getOverlayById(feature.getId()));
          this.deleteElement(this.editFeature);
        }
      });
    }

  }

  return Wfst;

})));
