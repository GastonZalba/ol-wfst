(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es7.symbol.async-iterator'), require('core-js/modules/es6.symbol'), require('core-js/modules/es7.array.includes'), require('core-js/modules/es6.string.includes'), require('core-js/modules/es6.regexp.split'), require('core-js/modules/es6.regexp.match'), require('core-js/modules/es6.regexp.replace'), require('core-js/modules/es6.object.keys'), require('core-js/modules/es6.array.find'), require('core-js/modules/es6.array.from'), require('core-js/modules/es6.regexp.to-string'), require('core-js/modules/es6.function.name'), require('core-js/modules/web.dom.iterable'), require('core-js/modules/es6.array.iterator'), require('core-js/modules/es6.string.iterator'), require('core-js/modules/es6.set'), require('core-js/modules/es6.object.assign'), require('core-js/modules/es6.promise'), require('core-js/modules/es6.object.to-string'), require('ol/TileState'), require('ol/geom'), require('ol/style'), require('ol/control'), require('ol/interaction'), require('ol'), require('ol/format'), require('ol/layer'), require('ol/source'), require('ol/loadingstrategy'), require('ol/geom/Polygon'), require('ol/extent'), require('ol/events/condition'), require('ol/proj'), require('ol/Observable')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/es7.symbol.async-iterator', 'core-js/modules/es6.symbol', 'core-js/modules/es7.array.includes', 'core-js/modules/es6.string.includes', 'core-js/modules/es6.regexp.split', 'core-js/modules/es6.regexp.match', 'core-js/modules/es6.regexp.replace', 'core-js/modules/es6.object.keys', 'core-js/modules/es6.array.find', 'core-js/modules/es6.array.from', 'core-js/modules/es6.regexp.to-string', 'core-js/modules/es6.function.name', 'core-js/modules/web.dom.iterable', 'core-js/modules/es6.array.iterator', 'core-js/modules/es6.string.iterator', 'core-js/modules/es6.set', 'core-js/modules/es6.object.assign', 'core-js/modules/es6.promise', 'core-js/modules/es6.object.to-string', 'ol/TileState', 'ol/geom', 'ol/style', 'ol/control', 'ol/interaction', 'ol', 'ol/format', 'ol/layer', 'ol/source', 'ol/loadingstrategy', 'ol/geom/Polygon', 'ol/extent', 'ol/events/condition', 'ol/proj', 'ol/Observable'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wfst = factory(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, global.ol.TileState, global.ol.geom, global.ol.style, global.ol.control, global.ol.interaction, global.ol, global.ol.format, global.ol.layer, global.ol.source, global.ol.loadingstrategy, global.ol.geom.Polygon, global.ol.extent, global.ol.events.condition, global.ol.proj, global.ol.Observable));
}(this, (function (es7_symbol_asyncIterator, es6_symbol, es7_array_includes, es6_string_includes, es6_regexp_split, es6_regexp_match, es6_regexp_replace, es6_object_keys, es6_array_find, es6_array_from, es6_regexp_toString, es6_function_name, web_dom_iterable, es6_array_iterator, es6_string_iterator, es6_set, es6_object_assign, es6_promise, es6_object_toString, TileState, geom, style, control, interaction, ol, format, layer, source, loadingstrategy, Polygon, extent, condition, proj, Observable) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var TileState__default = /*#__PURE__*/_interopDefaultLegacy(TileState);

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    typeof module === "object" ? module.exports : {}
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }

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

  var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

  var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

  var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='289' height='448' viewBox='0 0 289 448'%3e %3cpath d='M283.25 260.75c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-95.5l50.25 119c3.5 8.25-0.5 17.5-8.5 21l-44.25 18.75c-8.25 3.5-17.5-0.5-21-8.5l-47.75-113-78 78c-3 3-7 4.75-11.25 4.75-2 0-4.25-0.5-6-1.25-6-2.5-10-8.25-10-14.75v-376c0-6.5 4-12.25 10-14.75 1.75-0.75 4-1.25 6-1.25 4.25 0 8.25 1.5 11.25 4.75z'%3e%3c/path%3e%3c/svg%3e";

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
      geomTypeNotSupported: 'Geometría no compatible con la capa',
      editFields: 'Editar campos',
      editGeom: 'Editar geometría',
      selectDrawType: 'Tipo de geometría para dibujar',
      uploadToLayer: 'Subir archivo a la capa seleccionada',
      uploadFeatures: 'Subida de elementos a la capa',
      validFeatures: 'Válidas',
      invalidFeatures: 'Invalidas',
      loading: 'Cargando...'
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
      geomTypeNotSupported: 'Geometry not supported by layer',
      editFields: 'Edit fields',
      editGeom: 'Edit geometry',
      selectDrawType: 'Geometry type to draw',
      uploadToLayer: 'Upload file to selected layer',
      uploadFeatures: 'Uploaded features to layer',
      validFeatures: 'Valid geometries',
      invalidFeatures: 'Invalid',
      loading: 'Loading...'
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

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  // Axis ordering: latitude/longitude

  var DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
  /**
   * Tiny WFST-T client to insert (drawing/uploading), modify and delete
   * features on GeoServers using OpenLayers. Layers with these types
   * of geometry are supported: "GeometryCollection" (in this case, you can
   * choose the geometry type of each element to draw), "Point", "MultiPoint",
   * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
   *
   * @constructor
   * @param map Instance of the created map
   * @param opt_options Wfst options, see [Wfst Options](#options) for more details.
   */

  var Wfst = /*#__PURE__*/function () {
    function Wfst(map, opt_options) {
      _classCallCheck(this, Wfst);

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


    _createClass(Wfst, [{
      key: "_initAsyncOperations",
      value: function _initAsyncOperations() {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  this._showLoading();

                  _context.next = 4;
                  return this._connectToGeoServerAndGetCapabilities();

                case 4:
                  if (!this.options.layers) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 7;
                  return this._getGeoserverLayersData(this.options.layers, this.options.geoServerUrl);

                case 7:
                  this._createLayers(this.options.layers, this.options.layerMode);

                case 8:
                  this._initMapElements(this.options.showControl, this.options.active);

                  _context.next = 15;
                  break;

                case 11:
                  _context.prev = 11;
                  _context.t0 = _context["catch"](0);

                  this._hideLoading();

                  this._showError(_context.t0.message);

                case 15:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 11]]);
        }));
      }
      /**
       * Get the capabilities from the GeoServer and check
       * all the available operations.
       *
       * @private
       */

    }, {
      key: "_connectToGeoServerAndGetCapabilities",
      value: function _connectToGeoServerAndGetCapabilities() {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var _this = this;

          var getCapabilities, operations;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  /**
                   * @private
                   */
                  getCapabilities = function getCapabilities() {
                    return __awaiter(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                      var params, url_fetch, response, data, capabilities;
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              params = new URLSearchParams({
                                service: 'wfs',
                                version: '1.3.0',
                                request: 'GetCapabilities',
                                exceptions: 'application/json'
                              });
                              url_fetch = this.options.geoServerUrl + '?' + params.toString();
                              _context2.prev = 2;
                              _context2.next = 5;
                              return fetch(url_fetch, {
                                headers: this.options.headers
                              });

                            case 5:
                              response = _context2.sent;

                              if (response.ok) {
                                _context2.next = 8;
                                break;
                              }

                              throw new Error('');

                            case 8:
                              _context2.next = 10;
                              return response.text();

                            case 10:
                              data = _context2.sent;
                              capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
                              return _context2.abrupt("return", capabilities);

                            case 15:
                              _context2.prev = 15;
                              _context2.t0 = _context2["catch"](2);
                              throw new Error(this._i18n.errors.capabilities);

                            case 18:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2, this, [[2, 15]]);
                    }));
                  };

                  _context3.next = 3;
                  return getCapabilities();

                case 3:
                  this._geoServerCapabilities = _context3.sent;
                  // Available operations in the geoserver
                  operations = this._geoServerCapabilities.getElementsByTagName('ows:Operation');
                  Array.from(operations).forEach(function (operation) {
                    if (operation.getAttribute('name') === 'Transaction') {
                      _this._hasTransaction = true;
                    } else if (operation.getAttribute('name') === 'LockFeature') {
                      _this._hasLockFeature = true;
                    }
                  });

                  if (this._hasTransaction) {
                    _context3.next = 8;
                    break;
                  }

                  throw new Error(this._i18n.errors.wfst);

                case 8:
                  return _context3.abrupt("return", true);

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));
      }
      /**
       * Request and store data layers obtained by DescribeFeatureType
       *
       * @param layers
       * @param geoServerUrl
       * @private
       */

    }, {
      key: "_getGeoserverLayersData",
      value: function _getGeoserverLayersData(layers, geoServerUrl) {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          var _this2 = this;

          var getLayerData, _iterator, _step, layer, layerName, layerLabel, data, targetNamespace, properties, geom;

          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  getLayerData = function getLayerData(layerName) {
                    return __awaiter(_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                      var params, url_fetch, response;
                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              params = new URLSearchParams({
                                service: 'wfs',
                                version: '2.0.0',
                                request: 'DescribeFeatureType',
                                typeNames: layerName,
                                outputFormat: 'application/json',
                                exceptions: 'application/json'
                              });
                              url_fetch = geoServerUrl + '?' + params.toString();
                              _context4.next = 4;
                              return fetch(url_fetch, {
                                headers: this.options.headers
                              });

                            case 4:
                              response = _context4.sent;

                              if (response.ok) {
                                _context4.next = 7;
                                break;
                              }

                              throw new Error('');

                            case 7:
                              _context4.next = 9;
                              return response.json();

                            case 9:
                              return _context4.abrupt("return", _context4.sent);

                            case 10:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4, this);
                    }));
                  };

                  _iterator = _createForOfIteratorHelper(layers);
                  _context5.prev = 2;

                  _iterator.s();

                case 4:
                  if ((_step = _iterator.n()).done) {
                    _context5.next = 20;
                    break;
                  }

                  layer = _step.value;
                  layerName = layer.name;
                  layerLabel = layer.label || layerName;
                  _context5.prev = 8;
                  _context5.next = 11;
                  return getLayerData(layerName);

                case 11:
                  data = _context5.sent;

                  if (data) {
                    targetNamespace = data.targetNamespace;
                    properties = data.featureTypes[0].properties; // Find the geometry field

                    geom = properties.find(function (el) {
                      return el.type.indexOf('gml:') >= 0;
                    });
                    this._geoServerData[layerName] = {
                      namespace: targetNamespace,
                      properties: properties,
                      geomType: geom.localType,
                      geomField: geom.name
                    };
                  }

                  _context5.next = 18;
                  break;

                case 15:
                  _context5.prev = 15;
                  _context5.t0 = _context5["catch"](8);

                  this._showError("".concat(this._i18n.errors.layer, " \"").concat(layerLabel, "\""));

                case 18:
                  _context5.next = 4;
                  break;

                case 20:
                  _context5.next = 25;
                  break;

                case 22:
                  _context5.prev = 22;
                  _context5.t1 = _context5["catch"](2);

                  _iterator.e(_context5.t1);

                case 25:
                  _context5.prev = 25;

                  _iterator.f();

                  return _context5.finish(25);

                case 28:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this, [[2, 22, 25, 28], [8, 15]]);
        }));
      }
      /**
       * Create map layers in wfs o wms modes.
       *
       * @param layers
       * @private
       */

    }, {
      key: "_createLayers",
      value: function _createLayers(layers, layerMode) {
        var _this3 = this;

        var layerLoaded = 0;
        var layersNumber = layers.length;
        /**
         * When all the data is loaded, hide the loading
         * @private
         */

        var addLayerLoaded = function addLayerLoaded() {
          layerLoaded++;

          if (layerLoaded === layersNumber) {
            _this3._hideLoading();
          }
        };
        /**
         *
         * @param layerParams
         * @private
         */


        var newWmsLayer = function newWmsLayer(layerParams) {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var params = {
            SERVICE: 'WMS',
            LAYERS: layerName,
            TILED: true
          };

          if (cqlFilter) {
            params['CQL_FILTER'] = cqlFilter;
          }

          var layer$1 = new layer.Tile({
            source: new source.TileWMS({
              url: _this3.options.geoServerUrl,
              params: params,
              serverType: 'geoserver',
              tileLoadFunction: function tileLoadFunction(tile, src) {
                return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                  var response, data;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.prev = 0;
                          _context6.next = 3;
                          return fetch(src, {
                            headers: this.options.headers
                          });

                        case 3:
                          response = _context6.sent;

                          if (response.ok) {
                            _context6.next = 6;
                            break;
                          }

                          throw new Error('');

                        case 6:
                          _context6.next = 8;
                          return response.blob();

                        case 8:
                          data = _context6.sent;

                          if (!(data !== undefined)) {
                            _context6.next = 13;
                            break;
                          }

                          tile.getImage().src = URL.createObjectURL(data);
                          _context6.next = 14;
                          break;

                        case 13:
                          throw new Error('');

                        case 14:
                          _context6.next = 19;
                          break;

                        case 16:
                          _context6.prev = 16;
                          _context6.t0 = _context6["catch"](0);
                          tile.setState(TileState__default['default'].ERROR);

                        case 19:
                          _context6.prev = 19;
                          addLayerLoaded();
                          return _context6.finish(19);

                        case 22:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6, this, [[0, 16, 19, 22]]);
                }));
              }
            }),
            zIndex: 4,
            minZoom: _this3.options.minZoom
          });
          layer$1.setProperties({
            name: layerName,
            type: '_wms_'
          });
          return layer$1;
        };
        /**
         *
         * @param layerParams
         * @private
         */


        var newWfsLayer = function newWfsLayer(layerParams) {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var source$1 = new source.Vector({
            format: new format.GeoJSON(),
            strategy: _this3.options.wfsStrategy === 'bbox' ? loadingstrategy.bbox : loadingstrategy.all,
            loader: function loader(extent) {
              return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var params, extentGeoServer, url_fetch, response, data, features;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        params = new URLSearchParams({
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
                          extentGeoServer = proj.transformExtent(extent, this.view.getProjection().getCode(), DEFAULT_GEOSERVER_SRS);
                          params.append('bbox', extentGeoServer.join(','));
                        }

                        url_fetch = this.options.geoServerUrl + '?' + params.toString();
                        _context7.prev = 4;
                        _context7.next = 7;
                        return fetch(url_fetch, {
                          headers: this.options.headers
                        });

                      case 7:
                        response = _context7.sent;

                        if (response.ok) {
                          _context7.next = 10;
                          break;
                        }

                        throw new Error('');

                      case 10:
                        _context7.next = 12;
                        return response.json();

                      case 12:
                        data = _context7.sent;
                        features = source$1.getFormat().readFeatures(data, {
                          featureProjection: this.view.getProjection().getCode(),
                          dataProjection: DEFAULT_GEOSERVER_SRS
                        });
                        features.forEach(function (feature) {
                          feature.set('_layerName_', layerName,
                          /* silent = */
                          true);
                        });
                        source$1.addFeatures(features);
                        _context7.next = 23;
                        break;

                      case 18:
                        _context7.prev = 18;
                        _context7.t0 = _context7["catch"](4);

                        this._showError(this._i18n.errors.geoserver);

                        console.error(_context7.t0);
                        source$1.removeLoadedExtent(extent);

                      case 23:
                        _context7.prev = 23;
                        addLayerLoaded();
                        return _context7.finish(23);

                      case 26:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, this, [[4, 18, 23, 26]]);
              }));
            }
          });
          var layer$1 = new layer.Vector({
            visible: _this3._isVisible,
            minZoom: _this3.options.minZoom,
            source: source$1,
            zIndex: 2
          });
          layer$1.setProperties({
            name: layerName,
            type: '_wfs_'
          });
          return layer$1;
        };

        var _iterator2 = _createForOfIteratorHelper(layers),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var layerParams = _step2.value;
            var layerName = layerParams.name; // Only create the layer if we can get the GeoserverData

            if (this._geoServerData[layerName]) {
              var layer$1 = void 0;

              if (layerMode === 'wms') {
                layer$1 = newWmsLayer(layerParams);
              } else {
                layer$1 = newWfsLayer(layerParams);
              }

              this.map.addLayer(layer$1);
              this._mapLayers[layerName] = layer$1;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      /**
       * Create the edit layer to allow modify elements, add interactions,
       * map controllers and keyboard handlers.
       *
       * @param showControl
       * @param active
       * @private
       */

    }, {
      key: "_initMapElements",
      value: function _initMapElements(showControl, active) {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  // VectorLayer to store features on editing and isnerting
                  this._createEditLayer();

                  this._addInteractions();

                  this._addHandlers();

                  if (showControl) {
                    this._addControlTools();
                  } // By default, init in edit mode


                  this.activateEditMode(active);

                case 5:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));
      }
      /**
       * @private
       */

    }, {
      key: "_addInteractions",
      value: function _addInteractions() {
        var _this4 = this;

        // Select the wfs feature already downloaded
        var prepareWfsInteraction = function prepareWfsInteraction() {
          // Interaction to select wfs layer elements
          _this4.interactionWfsSelect = new interaction.Select({
            hitTolerance: 10,
            style: function style(feature) {
              return _this4._styleFunction(feature);
            },
            toggleCondition: condition.never,
            filter: function filter(feature, layer) {
              return !_this4._isEditModeOn && layer && layer.get('type') === '_wfs_';
            }
          });

          _this4.map.addInteraction(_this4.interactionWfsSelect);

          _this4.interactionWfsSelect.on('select', function (_ref) {
            var selected = _ref.selected,
                deselected = _ref.deselected,
                mapBrowserEvent = _ref.mapBrowserEvent;
            var coordinate = mapBrowserEvent.coordinate;

            if (selected.length) {
              selected.forEach(function (feature) {
                if (!_this4._editedFeatures.has(String(feature.getId()))) {
                  // Remove the feature from the original layer
                  var layer = _this4.interactionWfsSelect.getLayer(feature);

                  layer.getSource().removeFeature(feature);

                  _this4._addFeatureToEdit(feature, coordinate);
                }
              });
            }

            if (deselected.length) {
              if (!_this4._isEditModeOn) {
                deselected.forEach(function (feature) {
                  // Trigger deselect
                  // This is necessary for those times where two features overlap.
                  _this4.interactionSelectModify.getFeatures().remove(feature);
                });
              }
            }
          });
        };
        /**
         * Call the geoserver to get the clicked feature
         * @private
         */


        var prepareWmsInteraction = function prepareWmsInteraction() {
          var getFeatures = function getFeatures(evt) {
            return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
              var _this5 = this;

              var _loop, layerName, _ret;

              return regeneratorRuntime.wrap(function _callee9$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(layerName) {
                        var layer, coordinate, buffer, url, response, data, features;
                        return regeneratorRuntime.wrap(function _loop$(_context9) {
                          while (1) {
                            switch (_context9.prev = _context9.next) {
                              case 0:
                                layer = _this5._mapLayers[layerName];
                                coordinate = evt.coordinate; // Si la vista es lejana, disminumos el buffer
                                // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                                // y mejorar la sensibilidad en IOS

                                buffer = _this5.view.getZoom() > 10 ? 10 : 5;
                                url = layer.getSource().getFeatureInfoUrl(coordinate, _this5.view.getResolution(), _this5.view.getProjection().getCode(), {
                                  INFO_FORMAT: 'application/json',
                                  BUFFER: buffer,
                                  FEATURE_COUNT: 1,
                                  EXCEPTIONS: 'application/json'
                                });
                                _context9.prev = 4;
                                _context9.next = 7;
                                return fetch(url, {
                                  headers: _this5.options.headers
                                });

                              case 7:
                                response = _context9.sent;

                                if (response.ok) {
                                  _context9.next = 10;
                                  break;
                                }

                                throw new Error(_this5._i18n.errors.getFeatures + ' ' + response.status);

                              case 10:
                                _context9.next = 12;
                                return response.json();

                              case 12:
                                data = _context9.sent;
                                features = _this5._formatGeoJSON.readFeatures(data);

                                if (features.length) {
                                  _context9.next = 16;
                                  break;
                                }

                                return _context9.abrupt("return", "continue");

                              case 16:
                                features.forEach(function (feature) {
                                  return _this5._addFeatureToEdit(feature, coordinate, layerName);
                                });
                                _context9.next = 22;
                                break;

                              case 19:
                                _context9.prev = 19;
                                _context9.t0 = _context9["catch"](4);

                                _this5._showError(_context9.t0.message);

                              case 22:
                              case "end":
                                return _context9.stop();
                            }
                          }
                        }, _loop, null, [[4, 19]]);
                      });
                      _context10.t0 = regeneratorRuntime.keys(this._mapLayers);

                    case 2:
                      if ((_context10.t1 = _context10.t0()).done) {
                        _context10.next = 10;
                        break;
                      }

                      layerName = _context10.t1.value;
                      return _context10.delegateYield(_loop(layerName), "t2", 5);

                    case 5:
                      _ret = _context10.t2;

                      if (!(_ret === "continue")) {
                        _context10.next = 8;
                        break;
                      }

                      return _context10.abrupt("continue", 2);

                    case 8:
                      _context10.next = 2;
                      break;

                    case 10:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee9, this);
            }));
          };

          _this4._keyClickWms = _this4.map.on(_this4.options.evtType, function (evt) {
            return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
              return regeneratorRuntime.wrap(function _callee10$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      if (!this.map.hasFeatureAtPixel(evt.pixel)) {
                        _context11.next = 2;
                        break;
                      }

                      return _context11.abrupt("return");

                    case 2:
                      if (this._isVisible) {
                        _context11.next = 4;
                        break;
                      }

                      return _context11.abrupt("return");

                    case 4:
                      if (this._isEditModeOn) {
                        _context11.next = 7;
                        break;
                      }

                      _context11.next = 7;
                      return getFeatures(evt);

                    case 7:
                    case "end":
                      return _context11.stop();
                  }
                }
              }, _callee10, this);
            }));
          });
        };

        if (this.options.layerMode === 'wfs') {
          prepareWfsInteraction();
        } else if (this.options.layerMode === 'wms') {
          prepareWmsInteraction();
        } // Interaction to allow select features in the edit layer


        this.interactionSelectModify = new interaction.Select({
          style: function style(feature) {
            return _this4._styleFunction(feature);
          },
          layers: [this._editLayer],
          toggleCondition: condition.never,
          removeCondition: function removeCondition() {
            return _this4._isEditModeOn ? true : false;
          } // Prevent deselect on clicking outside the feature

        });
        this.map.addInteraction(this.interactionSelectModify);
        this.interactionModify = new interaction.Modify({
          style: function style$1() {
            if (_this4._isEditModeOn) {
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
          condition: function condition$1(evt) {
            return condition.primaryAction(evt) && _this4._isEditModeOn;
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

    }, {
      key: "_createEditLayer",
      value: function _createEditLayer() {
        var _this6 = this;

        this._editLayer = new layer.Vector({
          source: new source.Vector(),
          zIndex: 5,
          style: function style(feature) {
            return _this6._styleFunction(feature);
          }
        });
        this.map.addLayer(this._editLayer);
      }
      /**
       * Add map handlers
       *
       * @private
       */

    }, {
      key: "_addHandlers",
      value: function _addHandlers() {
        var _this7 = this;

        /**
         * @private
         */
        var keyboardEvents = function keyboardEvents() {
          document.addEventListener('keydown', function (_ref2) {
            var key = _ref2.key;
            var inputFocus = document.querySelector('input:focus');

            if (inputFocus) {
              return;
            }

            if (key === 'Delete') {
              var selectedFeatures = _this7.interactionSelectModify.getFeatures();

              if (selectedFeatures) {
                selectedFeatures.forEach(function (feature) {
                  _this7._deleteFeature(feature, true);
                });
              }
            }
          });
        }; // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver


        this.interactionModify.on('modifystart', function (evt) {
          _this7._addFeatureToEditedList(evt.features.item(0));
        });

        this._onDeselectFeatureEvent();

        this._onRemoveFeatureEvent();
        /**
         * @private
         */


        var handleZoomEnd = function handleZoomEnd() {
          if (_this7._currentZoom > _this7.options.minZoom) {
            // Show the layers
            if (!_this7._isVisible) {
              _this7._isVisible = true;
            }
          } else {
            // Hide the layer
            if (_this7._isVisible) {
              _this7._isVisible = false;
            }
          }
        };

        this.map.on('moveend', function () {
          _this7._currentZoom = _this7.view.getZoom();

          if (_this7._currentZoom !== _this7._lastZoom) {
            handleZoomEnd();
          }

          _this7._lastZoom = _this7._currentZoom;
        });
        keyboardEvents();
      }
      /**
       * Add the widget on the map to allow change the tools and select active layers
       * @private
       */

    }, {
      key: "_addControlTools",
      value: function _addControlTools() {
        var _this8 = this;

        /**
         * @private
         */
        var createUploadElements = function createUploadElements() {
          var container = document.createElement('div'); // Upload button Tool

          var uploadButton = document.createElement('label');
          uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
          uploadButton.htmlFor = 'ol-wfst--upload';
          uploadButton.innerHTML = "<img src=\"".concat(img$4, "\"/> ");
          uploadButton.title = _this8._i18n.labels.uploadToLayer; // Hidden Input form

          var uploadInput = document.createElement('input');
          uploadInput.id = 'ol-wfst--upload';
          uploadInput.type = 'file';
          uploadInput.accept = _this8.options.uploadFormats;

          uploadInput.onchange = function (evt) {
            return _this8._processUploadFile(evt);
          };

          container.append(uploadInput);
          container.append(uploadButton);
          return container;
        };
        /**
         * @private
         */


        var createToolSelector = function createToolSelector() {
          var controlDiv = document.createElement('div');
          controlDiv.className = 'ol-wfst--tools-control'; // Select Tool

          var selectionButton = document.createElement('button');
          selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
          selectionButton.type = 'button';
          selectionButton.innerHTML = "<img src=\"".concat(img$3, "\"/>");
          selectionButton.title = _this8._i18n.labels.select;

          selectionButton.onclick = function () {
            _this8._resetStateButtons();

            _this8.activateEditMode();
          }; // Draw Tool


          var drawButton = document.createElement('button');
          drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
          drawButton.type = 'button';
          drawButton.innerHTML = "<img src = \"".concat(img, "\"/>");
          drawButton.title = _this8._i18n.labels.addElement;

          drawButton.onclick = function () {
            _this8._resetStateButtons();

            _this8.activateDrawMode(_this8._layerToInsertElements);
          }; // Buttons container


          var buttons = document.createElement('div');
          buttons.className = 'wfst--tools-control--buttons';
          buttons.append(selectionButton);
          buttons.append(drawButton);
          _this8._controlWidgetTools = new control.Control({
            element: controlDiv
          });
          controlDiv.append(buttons);
          return controlDiv;
        };

        var createSubControl = function createSubControl() {
          var createSelectDrawElement = function createSelectDrawElement() {
            var select = document.createElement('select');
            select.title = _this8._i18n.labels.selectDrawType;
            select.className = 'wfst--tools-control--select-draw';

            select.onchange = function () {
              _this8.activateDrawMode(_this8._layerToInsertElements, select.value);
            };

            var types = [GeometryType.POINT, GeometryType.MULTI_POINT, GeometryType.LINE_STRING, GeometryType.MULTI_LINE_STRING, GeometryType.POLYGON, GeometryType.MULTI_POLYGON, GeometryType.CIRCLE];

            for (var _i = 0, _types = types; _i < _types.length; _i++) {
              var type = _types[_i];
              var option = document.createElement('option');
              option.value = type;
              option.text = type;
              option.selected = _this8._geoServerData[_this8._layerToInsertElements].geomType === type || false;
              select.appendChild(option);
            }

            return select;
          };

          var createLayerElements = function createLayerElements(layerParams) {
            var layerName = layerParams.name;
            var layerLabel = "<span title=\"".concat(_this8._geoServerData[layerName].geomType, "\">").concat(layerParams.label || layerName, "</span>");
            return "\n                <div>\n                    <label for=\"wfst--".concat(layerName, "\">\n                        <input value=\"").concat(layerName, "\" id=\"wfst--").concat(layerName, "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" ").concat(layerName === _this8._layerToInsertElements ? 'checked="checked"' : '', ">\n                        ").concat(layerLabel, "\n                    </label>\n                </div>");
          };

          var subControl = document.createElement('div');
          subControl.className = 'wfst--tools-control--sub-control';
          _this8._selectDraw = createSelectDrawElement();
          subControl.append(_this8._selectDraw);
          var htmlLayers = Object.keys(_this8._mapLayers).map(function (key) {
            return createLayerElements(_this8.options.layers.find(function (el) {
              return el.name === key;
            }));
          });
          var selectLayers = document.createElement('div');
          selectLayers.className = 'wfst--tools-control--select-layers';
          selectLayers.innerHTML = htmlLayers.join('');
          subControl.append(selectLayers);
          var radioInputs = subControl.querySelectorAll('input');
          radioInputs.forEach(function (radioInput) {
            radioInput.onchange = function () {
              _this8._layerToInsertElements = radioInput.value;

              _this8._resetStateButtons();

              _this8.activateDrawMode(_this8._layerToInsertElements);
            };
          });
          return subControl;
        };

        var controlDiv = createToolSelector();
        var subControl = createSubControl();
        controlDiv.append(subControl); // Upload section

        if (this.options.showUpload) {
          var uploadSection = createUploadElements();
          subControl.append(uploadSection);
        }

        this.map.addControl(this._controlWidgetTools);
      }
      /**
       * Show Loading modal
       *
       * @private
       */

    }, {
      key: "_showLoading",
      value: function _showLoading() {
        if (!this._modalLoading) {
          this._modalLoading = document.createElement('div');
          this._modalLoading.className = 'wfst--tools-control--loading';
          this._modalLoading.textContent = this._i18n.labels.loading;
          this.map.addControl(new control.Control({
            element: this._modalLoading
          }));
        }

        this._modalLoading.classList.add('wfst--tools-control--loading-show');
      }
    }, {
      key: "_hideLoading",
      value: function _hideLoading() {
        this._modalLoading.classList.remove('wfst--tools-control--loading-show');
      }
      /**
       * Lock a feature in the geoserver before edit
       *
       * @param featureId
       * @param layerName
       * @param retry
       * @private
       */

    }, {
      key: "_lockFeature",
      value: function _lockFeature(featureId, layerName) {
        var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
          var params, url_fetch, response, data, dataParsed, exceptions;
          return regeneratorRuntime.wrap(function _callee11$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  params = new URLSearchParams({
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
                  url_fetch = this.options.geoServerUrl + '?' + params.toString();
                  _context12.prev = 2;
                  _context12.next = 5;
                  return fetch(url_fetch, {
                    headers: this.options.headers
                  });

                case 5:
                  response = _context12.sent;

                  if (response.ok) {
                    _context12.next = 8;
                    break;
                  }

                  throw new Error(this._i18n.errors.lockFeature);

                case 8:
                  _context12.next = 10;
                  return response.text();

                case 10:
                  data = _context12.sent;

                  try {
                    // First, check if is a JSON (with errors)
                    dataParsed = JSON.parse(data);

                    if ('exceptions' in dataParsed) {
                      exceptions = dataParsed.exceptions;

                      if (exceptions[0].code === 'CannotLockAllFeatures') {
                        // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                        if (!retry) {
                          this._lockFeature(featureId, layerName, 1);
                        } else {
                          this._showError(this._i18n.errors.lockFeature);
                        }
                      } else {
                        this._showError(exceptions[0].text);
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

                  return _context12.abrupt("return", data);

                case 15:
                  _context12.prev = 15;
                  _context12.t0 = _context12["catch"](2);

                  this._showError(_context12.t0.message);

                case 18:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee11, this, [[2, 15]]);
        }));
      }
      /**
       * Show modal with errors
       *
       * @param msg
       * @private
       */

    }, {
      key: "_showError",
      value: function _showError(msg) {
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

    }, {
      key: "_transactWFS",
      value: function _transactWFS(mode, features, layerName) {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
          var _this9 = this;

          var transformCircleToPolygon, transformGeoemtryCollectionToGeometries, cloneFeature, refreshWmsLayer, refreshWfsLayer, clonedFeatures, _iterator3, _step3, feature, clone, cloneGeom, cloneGeomType, numberRequest;

          return regeneratorRuntime.wrap(function _callee13$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  transformCircleToPolygon = function transformCircleToPolygon(feature, geom) {
                    var geomConverted = Polygon.fromCircle(geom);
                    feature.setGeometry(geomConverted);
                  };

                  transformGeoemtryCollectionToGeometries = function transformGeoemtryCollectionToGeometries(feature, geom) {
                    var geomConverted = geom.getGeometries()[0];

                    if (geomConverted.getType() === GeometryType.CIRCLE) {
                      geomConverted = Polygon.fromCircle(geomConverted);
                    }

                    feature.setGeometry(geomConverted);
                  };

                  features = Array.isArray(features) ? features : [features];

                  cloneFeature = function cloneFeature(feature) {
                    _this9._removeFeatureFromEditList(feature);

                    var featureProperties = feature.getProperties();
                    delete featureProperties.boundedBy;
                    delete featureProperties._layerName_;
                    var clone = new ol.Feature(featureProperties);
                    clone.setId(feature.getId());
                    return clone;
                  };

                  refreshWmsLayer = function refreshWmsLayer(layer) {
                    var source = layer.getSource(); // Refrescamos el wms

                    source.refresh(); // Force refresh the tiles

                    var params = source.getParams();
                    params.t = new Date().getMilliseconds();
                    source.updateParams(params);
                  };

                  refreshWfsLayer = function refreshWfsLayer(layer) {
                    var source = layer.getSource(); // Refrescamos el wms

                    source.refresh();
                  };

                  clonedFeatures = [];
                  _iterator3 = _createForOfIteratorHelper(features);

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      feature = _step3.value;
                      clone = cloneFeature(feature);
                      cloneGeom = clone.getGeometry();
                      cloneGeomType = cloneGeom.getType(); // Ugly fix to support GeometryCollection on GML
                      // See https://github.com/openlayers/openlayers/issues/4220

                      if (cloneGeomType === GeometryType.GEOMETRY_COLLECTION) {
                        transformGeoemtryCollectionToGeometries(clone, cloneGeom);
                      } else if (cloneGeomType === GeometryType.CIRCLE) {
                        // Geoserver has no Support to Circles
                        transformCircleToPolygon(clone, cloneGeom);
                      }

                      if (mode === 'insert') {
                        // Filters
                        if (this.options.beforeInsertFeature) {
                          clone = this.options.beforeInsertFeature(clone);
                        }
                      }

                      if (clone) {
                        clonedFeatures.push(clone);
                      }
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }

                  if (clonedFeatures.length) {
                    _context14.next = 11;
                    break;
                  }

                  return _context14.abrupt("return", this._showError(this._i18n.errors.noValidGeometry));

                case 11:
                  _context14.t0 = mode;
                  _context14.next = _context14.t0 === 'insert' ? 14 : _context14.t0 === 'update' ? 16 : _context14.t0 === 'delete' ? 18 : 20;
                  break;

                case 14:
                  this._insertFeatures = [].concat(_toConsumableArray(this._insertFeatures), clonedFeatures);
                  return _context14.abrupt("break", 21);

                case 16:
                  this._updateFeatures = [].concat(_toConsumableArray(this._updateFeatures), clonedFeatures);
                  return _context14.abrupt("break", 21);

                case 18:
                  this._deleteFeatures = [].concat(_toConsumableArray(this._deleteFeatures), clonedFeatures);
                  return _context14.abrupt("break", 21);

                case 20:
                  return _context14.abrupt("break", 21);

                case 21:
                  this._countRequests++;
                  numberRequest = this._countRequests;
                  setTimeout(function () {
                    return __awaiter(_this9, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                      var srs, options, transaction, payload, geomType, geomField, gmemberIn, gmemberOut, headers, response, parseResponse, responseStr, findError, _iterator4, _step4, feature;

                      return regeneratorRuntime.wrap(function _callee12$(_context13) {
                        while (1) {
                          switch (_context13.prev = _context13.next) {
                            case 0:
                              if (!(numberRequest !== this._countRequests)) {
                                _context13.next = 2;
                                break;
                              }

                              return _context13.abrupt("return");

                            case 2:
                              srs = this.view.getProjection().getCode(); // Force latitude/longitude order on transactions
                              // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3

                              srs = srs === 'EPSG:4326' ? DEFAULT_GEOSERVER_SRS : srs;
                              options = {
                                featureNS: this._geoServerData[layerName].namespace,
                                featureType: layerName,
                                srsName: srs,
                                featurePrefix: null,
                                nativeElements: null
                              };
                              transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                              payload = this._xs.serializeToString(transaction);
                              geomType = this._geoServerData[layerName].geomType;
                              geomField = this._geoServerData[layerName].geomField; // Ugly fix to support GeometryCollection on GML
                              // See https://github.com/openlayers/openlayers/issues/4220

                              if (geomType === GeometryType.GEOMETRY_COLLECTION) {
                                if (mode === 'insert') {
                                  payload = payload.replace(/<geometry>/g, "<geometry><MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>"));
                                  payload = payload.replace(/<\/geometry>/g, "</geometryMember></MultiGeometry></geometry>");
                                } else if (mode === 'update') {
                                  gmemberIn = "<MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>");
                                  gmemberOut = "</geometryMember></MultiGeometry>";
                                  payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, "$1$2".concat(gmemberIn, "$3").concat(gmemberOut, "$4$5"));
                                }
                              } // Fixes geometry name, weird bug with GML:
                              // The property for the geometry column is always named "geometry"


                              if (mode === 'insert') {
                                payload = payload.replace(/<(\/?)\bgeometry\b>/g, "<$1".concat(geomField, ">"));
                              } else {
                                payload = payload.replace(/<Name>geometry<\/Name>/g, "<Name>".concat(geomField, "</Name>"));
                              } // Add default LockId value


                              if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
                                payload = payload.replace("</Transaction>", "<LockId>GeoServer</LockId></Transaction>");
                              }

                              _context13.prev = 12;
                              headers = Object.assign({
                                'Content-Type': 'text/xml'
                              }, this.options.headers);
                              _context13.next = 16;
                              return fetch(this.options.geoServerUrl, {
                                method: 'POST',
                                body: payload,
                                headers: headers
                              });

                            case 16:
                              response = _context13.sent;

                              if (response.ok) {
                                _context13.next = 19;
                                break;
                              }

                              throw new Error(this._i18n.errors.transaction + ' ' + response.status);

                            case 19:
                              parseResponse = this._formatWFS.readTransactionResponse(response);

                              if (Object.keys(parseResponse).length) {
                                _context13.next = 26;
                                break;
                              }

                              _context13.next = 23;
                              return response.text();

                            case 23:
                              responseStr = _context13.sent;
                              findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);

                              if (findError) {
                                this._showError(findError[1]);
                              }

                            case 26:
                              if (mode !== 'delete') {
                                _iterator4 = _createForOfIteratorHelper(features);

                                try {
                                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                                    feature = _step4.value;

                                    this._editLayer.getSource().removeFeature(feature);
                                  }
                                } catch (err) {
                                  _iterator4.e(err);
                                } finally {
                                  _iterator4.f();
                                }
                              }

                              if (this.options.layerMode === 'wfs') {
                                refreshWfsLayer(this._mapLayers[layerName]);
                              } else if (this.options.layerMode === 'wms') {
                                refreshWmsLayer(this._mapLayers[layerName]);
                              }

                              this._hideLoading();

                              _context13.next = 34;
                              break;

                            case 31:
                              _context13.prev = 31;
                              _context13.t0 = _context13["catch"](12);
                              console.error(_context13.t0);

                            case 34:
                              this._insertFeatures = [];
                              this._updateFeatures = [];
                              this._deleteFeatures = [];
                              this._countRequests = 0;

                            case 38:
                            case "end":
                              return _context13.stop();
                          }
                        }
                      }, _callee12, this, [[12, 31]]);
                    }));
                  }, 0);

                case 24:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee13, this);
        }));
      }
      /**
       *
       * @param feature
       * @private
       */

    }, {
      key: "_addFeatureToEditedList",
      value: function _addFeatureToEditedList(feature) {
        this._editedFeatures.add(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */

    }, {
      key: "_removeFeatureFromEditList",
      value: function _removeFeatureFromEditList(feature) {
        this._editedFeatures.delete(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */

    }, {
      key: "_isFeatureEdited",
      value: function _isFeatureEdited(feature) {
        return this._editedFeatures.has(String(feature.getId()));
      }
      /**
       *
       * @param feature
       * @private
       */

    }, {
      key: "_deselectEditFeature",
      value: function _deselectEditFeature(feature) {
        this._removeOverlayHelper(feature);
      }
      /**
       *
       * @param feature
       * @param layerName
       * @private
       */

    }, {
      key: "_restoreFeatureToLayer",
      value: function _restoreFeatureToLayer(feature, layerName) {
        layerName = layerName || feature.get('_layerName_');
        var layer = this._mapLayers[layerName];
        layer.getSource().addFeature(feature);
      }
    }, {
      key: "_removeFeatureFromTmpLayer",
      value: function _removeFeatureFromTmpLayer(feature) {
        // Remove element from the Layer
        this._editLayer.getSource().removeFeature(feature);
      }
      /**
       * Trigger on deselecting a feature from in the Edit layer
       *
       * @private
       */

    }, {
      key: "_onDeselectFeatureEvent",
      value: function _onDeselectFeatureEvent() {
        var _this10 = this;

        var checkIfFeatureIsChanged = function checkIfFeatureIsChanged(feature) {
          var layerName = feature.get('_layerName_');

          if (_this10.options.layerMode === 'wfs') {
            _this10.interactionWfsSelect.getFeatures().remove(feature);
          }

          if (_this10._isFeatureEdited(feature)) {
            _this10._transactWFS('update', feature, layerName);
          } else {
            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (_this10.options.layerMode === 'wfs') {
              _this10._restoreFeatureToLayer(feature, layerName);
            }

            _this10._removeFeatureFromTmpLayer(feature);
          }
        }; // This is fired when a feature is deselected and fires the transaction process


        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', function (evt) {
          var feature = evt.element;

          _this10._deselectEditFeature(feature);

          checkIfFeatureIsChanged(feature);

          _this10._editModeOff();
        });
      }
      /**
       * Trigger on removing a feature from the Edit layer
       *
       * @private
       */

    }, {
      key: "_onRemoveFeatureEvent",
      value: function _onRemoveFeatureEvent() {
        var _this11 = this;

        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', function (evt) {
          var feature = evt.feature;

          if (!feature.get('_delete_')) {
            return;
          }

          if (_this11._keySelect) {
            Observable.unByKey(_this11._keySelect);
          }

          var layerName = feature.get('_layerName_');

          _this11._transactWFS('delete', feature, layerName);

          _this11._deselectEditFeature(feature);

          _this11._editModeOff();

          if (_this11._keySelect) {
            setTimeout(function () {
              _this11._onDeselectFeatureEvent();
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

    }, {
      key: "_styleFunction",
      value: function _styleFunction(feature) {
        var getVertexs = function getVertexs(feature) {
          var geometry = feature.getGeometry();
          var type = geometry.getType();

          if (type === GeometryType.GEOMETRY_COLLECTION) {
            geometry = geometry.getGeometries()[0];
            type = geometry.getType();
          }

          var coordinates = geometry.getCoordinates();
          var coordinatesFlat = null;

          if (type === GeometryType.POLYGON || type === GeometryType.MULTI_LINE_STRING) {
            coordinatesFlat = coordinates.flat(1);
          } else if (type === GeometryType.MULTI_POLYGON) {
            coordinatesFlat = coordinates.flat(2);
          }

          if (!coordinatesFlat || !coordinatesFlat.length) {
            return;
          }

          return new geom.MultiPoint(coordinatesFlat);
        };

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
            // If editing mode is active, show bigger vertex
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
                geometry: function geometry(feature) {
                  return getVertexs(feature);
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
                geometry: function geometry(feature) {
                  return getVertexs(feature);
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

    }, {
      key: "_editModeOn",
      value: function _editModeOn(feature) {
        var _this12 = this;

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

        acceptButton.onclick = function () {
          _this12._showLoading();

          _this12.interactionSelectModify.getFeatures().remove(feature);
        };

        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
        cancelButton.className = 'btn btn-secondary';

        cancelButton.onclick = function () {
          feature.setGeometry(_this12._editFeatureOriginal.getGeometry());

          _this12._removeFeatureFromEditList(feature);

          _this12.interactionSelectModify.getFeatures().remove(feature);
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

    }, {
      key: "_editModeOff",
      value: function _editModeOff() {
        this._isEditModeOn = false;
        this.map.removeControl(this._controlApplyDiscardChanges);
      }
      /**
       * Remove a feature from the edit Layer and from the Geoserver
       *
       * @param feature
       * @private
       */

    }, {
      key: "_deleteFeature",
      value: function _deleteFeature(feature, confirm) {
        var _this13 = this;

        var deleteEl = function deleteEl() {
          var features = Array.isArray(feature) ? feature : [feature];
          features.forEach(function (feature) {
            feature.set('_delete_', true, true);

            _this13._editLayer.getSource().removeFeature(feature);
          });

          _this13.interactionSelectModify.getFeatures().clear();

          if (_this13.options.layerMode === 'wfs') {
            _this13.interactionWfsSelect.getFeatures().remove(feature);
          }
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

    }, {
      key: "_addFeatureToEdit",
      value: function _addFeatureToEdit(feature) {
        var _this14 = this;

        var coordinate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var layerName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var prepareOverlay = function prepareOverlay() {
          var svgFields = "<img src=\"".concat(img$1, "\"/>");
          var editFieldsEl = document.createElement('div');
          editFieldsEl.className = 'ol-wfst--edit-button-cnt';
          editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(_this14._i18n.labels.editFields, "\">").concat(svgFields, "</button>");

          editFieldsEl.onclick = function () {
            _this14._initEditFieldsModal(feature);
          };

          var buttons = document.createElement('div');
          buttons.append(editFieldsEl);
          var svgGeom = "<img src=\"".concat(img$2, "\"/>");
          var editGeomEl = document.createElement('div');
          editGeomEl.className = 'ol-wfst--edit-button-cnt';
          editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(_this14._i18n.labels.editGeom, "\">").concat(svgGeom, "</button>");

          editGeomEl.onclick = function () {
            _this14._editModeOn(feature);
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

          _this14.map.addOverlay(buttonsOverlay);
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

    }, {
      key: "_resetStateButtons",
      value: function _resetStateButtons() {
        var activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');

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

    }, {
      key: "_initUploadFileModal",
      value: function _initUploadFileModal(content, featuresToInsert) {
        var _this15 = this;

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
        modal.on('dismiss', function (modal, event) {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            _this15._transactWFS('insert', featuresToInsert, _this15._layerToInsertElements);
          } else {
            // On cancel button
            _this15._editLayer.getSource().clear();
          }
        });
      }
      /**
       * Parse and check geometry of uploaded files
       *
       * @param evt
       * @private
       */

    }, {
      key: "_processUploadFile",
      value: function _processUploadFile(evt) {
        return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
          var _this16 = this;

          var fileReader, fixGeometry, checkGeometry, file, features, extension, string, invalidFeaturesCount, validFeaturesCount, featuresToInsert, _iterator5, _step5, feature, content;

          return regeneratorRuntime.wrap(function _callee15$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  /**
                   * Read data file
                   * @param file
                   * @private
                   */
                  fileReader = function fileReader(file) {
                    return new Promise(function (resolve, reject) {
                      var reader = new FileReader();
                      reader.addEventListener('load', function (e) {
                        return __awaiter(_this16, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                          var fileData;
                          return regeneratorRuntime.wrap(function _callee14$(_context15) {
                            while (1) {
                              switch (_context15.prev = _context15.next) {
                                case 0:
                                  fileData = e.target.result;
                                  resolve(fileData);

                                case 2:
                                case "end":
                                  return _context15.stop();
                              }
                            }
                          }, _callee14);
                        }));
                      });
                      reader.addEventListener('error', function (err) {
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


                  fixGeometry = function fixGeometry(feature) {
                    // Geometry of the layer
                    var geomTypeLayer = _this16._geoServerData[_this16._layerToInsertElements].geomType;
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
                   * @private
                   */


                  checkGeometry = function checkGeometry(feature) {
                    // Geometry of the layer
                    var geomTypeLayer = _this16._geoServerData[_this16._layerToInsertElements].geomType;
                    var geomTypeFeature = feature.getGeometry().getType(); // This geom accepts every type of geometry

                    if (geomTypeLayer === GeometryType.GEOMETRY_COLLECTION) {
                      return true;
                    }

                    return geomTypeFeature === geomTypeLayer;
                  };

                  file = evt.target.files[0];

                  if (file) {
                    _context16.next = 6;
                    break;
                  }

                  return _context16.abrupt("return");

                case 6:
                  extension = file.name.split('.').pop().toLowerCase();
                  _context16.prev = 7;

                  // If the user uses a custom fucntion...
                  if (this.options.processUpload) {
                    features = this.options.processUpload(file);
                  } // If the user functions return features, we dont process anything more


                  if (features) {
                    _context16.next = 14;
                    break;
                  }

                  _context16.next = 12;
                  return fileReader(file);

                case 12:
                  string = _context16.sent;

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

                case 14:
                  _context16.next = 19;
                  break;

                case 16:
                  _context16.prev = 16;
                  _context16.t0 = _context16["catch"](7);

                  this._showError(this._i18n.errors.badFile);

                case 19:
                  invalidFeaturesCount = 0;
                  validFeaturesCount = 0;
                  featuresToInsert = [];
                  _iterator5 = _createForOfIteratorHelper(features);
                  _context16.prev = 23;

                  _iterator5.s();

                case 25:
                  if ((_step5 = _iterator5.n()).done) {
                    _context16.next = 37;
                    break;
                  }

                  feature = _step5.value;

                  // If the geometry doesn't correspond to the layer, try to fixit.
                  // If we can't, don't use it
                  if (!checkGeometry(feature)) {
                    feature = fixGeometry(feature);
                  }

                  if (!feature) {
                    _context16.next = 33;
                    break;
                  }

                  featuresToInsert.push(feature);
                  validFeaturesCount++;
                  _context16.next = 35;
                  break;

                case 33:
                  invalidFeaturesCount++;
                  return _context16.abrupt("continue", 35);

                case 35:
                  _context16.next = 25;
                  break;

                case 37:
                  _context16.next = 42;
                  break;

                case 39:
                  _context16.prev = 39;
                  _context16.t1 = _context16["catch"](23);

                  _iterator5.e(_context16.t1);

                case 42:
                  _context16.prev = 42;

                  _iterator5.f();

                  return _context16.finish(42);

                case 45:
                  if (!validFeaturesCount) {
                    this._showError(this._i18n.errors.noValidGeometry);
                  } else {
                    this._resetStateButtons();

                    this.activateEditMode();
                    content = "\n                ".concat(this._i18n.labels.validFeatures, ": ").concat(validFeaturesCount, "<br>\n                ").concat(invalidFeaturesCount ? "".concat(this._i18n.labels.invalidFeatures, ": ").concat(invalidFeaturesCount) : '', "\n            ");

                    this._initUploadFileModal(content, featuresToInsert);

                    this._editLayer.getSource().addFeatures(featuresToInsert);

                    this.view.fit(this._editLayer.getSource().getExtent(), {
                      size: this.map.getSize(),
                      maxZoom: 21,
                      padding: [100, 100, 100, 100]
                    });
                  } // Reset the input to allow another onChange trigger


                  evt.target.value = null;

                case 47:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee15, this, [[7, 16], [23, 39, 42, 45]]);
        }));
      }
      /**
       * Activate/deactivate the draw mode
       *
       * @param layerName
       * @public
       */

    }, {
      key: "activateDrawMode",
      value: function activateDrawMode(layerName) {
        var _this17 = this;

        var geomDrawTypeSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         * @private
         */
        var setSelectState = function setSelectState(value, options) {
          Array.from(_this17._selectDraw.options).forEach(function (option) {
            option.selected = option.value === value ? true : false;
            option.disabled = options === 'all' ? false : options.includes(option.value) ? false : true;
            option.title = option.disabled ? _this17._i18n.labels.geomTypeNotSupported : '';
          });
        };
        /**
         *
         * @param layerName
         * @private
         */


        var getDrawTypeSelected = function getDrawTypeSelected(layerName) {
          var drawType;

          if (_this17._selectDraw) {
            var geomLayer = _this17._geoServerData[layerName].geomType; // If a draw Type value is provided, the function was triggerd
            // on changing the Select geoemtry type (is a GeometryCollection)

            if (geomDrawTypeSelected) {
              drawType = _this17._selectDraw.value;
            } else {
              if (geomLayer === GeometryType.GEOMETRY_COLLECTION) {
                drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection

                setSelectState(drawType, 'all');
              } else if (geomLayer === GeometryType.LINEAR_RING) {
                drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection

                setSelectState(drawType, [GeometryType.CIRCLE, GeometryType.LINEAR_RING, GeometryType.POLYGON]);
                _this17._selectDraw.value = drawType;
              } else {
                drawType = geomLayer;
                setSelectState(drawType, [geomLayer]);
              }
            }
          }

          return drawType;
        };
        /**
         *
         * @param layerName
         * @private
         */


        var addDrawInteraction = function addDrawInteraction(layerName) {
          _this17.activateEditMode(false); // If already exists, remove


          if (_this17.interactionDraw) {
            _this17.map.removeInteraction(_this17.interactionDraw);
          }

          var geomDrawType = getDrawTypeSelected(layerName);
          _this17.interactionDraw = new interaction.Draw({
            source: _this17._editLayer.getSource(),
            type: geomDrawType,
            style: function style(feature) {
              return _this17._styleFunction(feature);
            }
          });

          _this17.map.addInteraction(_this17.interactionDraw);

          var drawHandler = function drawHandler() {
            _this17.interactionDraw.on('drawend', function (evt) {
              var feature = evt.feature;

              _this17._transactWFS('insert', feature, layerName);
            });
          };

          drawHandler();
        };

        if (!this.interactionDraw && !layerName) {
          return;
        }

        this._isDrawModeOn = layerName ? true : false;

        if (layerName) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');

          if (btn) {
            btn.classList.add('wfst--active');
          }

          this.viewport.classList.add('draw-mode');
          addDrawInteraction(String(layerName));
        } else {
          this.map.removeInteraction(this.interactionDraw);
          this.viewport.classList.remove('draw-mode');
        }
      }
      /**
       * Activate/desactivate the edit mode
       *
       * @param bool
       * @public
       */

    }, {
      key: "activateEditMode",
      value: function activateEditMode() {
        var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (bool) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-edit');

          if (btn) {
            btn.classList.add('wfst--active');
          }

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
       * Add features directly to the geoserver, in a custom layer
       * without checking geometry or showing modal to confirm.
       *
       * @param layerName
       * @param features
       * @public
       */

    }, {
      key: "insertFeaturesTo",
      value: function insertFeaturesTo(layerName, features) {
        this._transactWFS('insert', features, layerName);
      }
      /**
       * Shows a fields form in a modal window to allow changes in the properties of the feature.
       *
       * @param feature
       * @private
       */

    }, {
      key: "_initEditFieldsModal",
      value: function _initEditFieldsModal(feature) {
        var _this18 = this;

        this._editFeature = feature;
        var properties = feature.getProperties();
        var layer = feature.get('_layerName_'); // Data schema from the geoserver

        var dataSchema = this._geoServerData[layer].properties;
        var content = '<form autocomplete="false">';
        Object.keys(properties).forEach(function (key) {
          // If the feature field exists in the geoserver and is not added by openlayers
          var field = dataSchema.find(function (data) {
            return data.name === key;
          });

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
        modal.on('dismiss', function (modal, event) {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            var inputs = modal.el.querySelectorAll('input');
            inputs.forEach(function (el) {
              var value = el.value;
              var field = el.name;

              _this18._editFeature.set(field, value,
              /*isSilent = */
              true);
            });

            _this18._editFeature.changed();

            _this18._addFeatureToEditedList(_this18._editFeature); // Force deselect to trigger handler


            _this18.interactionSelectModify.getFeatures().remove(_this18._editFeature);
          } else if (event.target.dataset.action === 'delete') {
            _this18._deleteFeature(_this18._editFeature, true);
          }
        });
      }
      /**
       * Remove the overlay helper atttached to a specify feature
       * @param feature
       * @private
       */

    }, {
      key: "_removeOverlayHelper",
      value: function _removeOverlayHelper(feature) {
        var featureId = feature.getId();

        if (!featureId) {
          return;
        }

        var overlay = this.map.getOverlayById(featureId);

        if (!overlay) {
          return;
        }

        this.map.removeOverlay(overlay);
      }
    }]);

    return Wfst;
  }();

  return Wfst;

})));
