;(function() {
  "use strict";
	
  /* rsvp库：https://github.com/tildeio/rsvp.js */
	
  function each(items, fn) {
    var i = 0;
    var ilen = items.length;
    for (;ilen > i;i++) {
      if (items[i] === fn) {
        return i;
      }
    }
    return-1;
  }
	
  function callbacksFor(object) {
    var events = object._promiseCallbacks;
    return events || (events = object._promiseCallbacks = {}), events;
  }
	
  function configure(name, value) {
    return "onerror" === name ? void config.on("error", value) : 2 !== arguments.length ? config[name] : void(config[name] = value);
  }
	
  function isObject(arg) {
    return "function" == typeof arg || "object" == typeof arg && null !== arg;
  }
	
  function isFunction(obj) {
    return "function" == typeof obj;
  }
	
  function template(data) {
    return "object" == typeof data && null !== data;
  }
	
  function TemplateClass() {
  }
	
  function init() {
    setTimeout(function() {
      var message;
      var i = 0;
      for (;i < attrList.length;i++) {
        message = attrList[i];
        var data = message.payload;
        data.guid = data.key + data.id;
        data.childGuid = data.key + data.childId;
        if (data.error) {
          data.stack = data.error.stack;
        }
        config.trigger(message.name, message.payload);
      }
      attrList.length = 0;
    }, 50);
  }

  function next(name, promise, selector) {
    if (1 === attrList.push({
      name : name,
      payload : {
        key : promise._guidKey,
        id : promise._id,
        eventName : name,
        detail : promise._result,
        childId : selector && selector._id,
        label : promise._label,
        timeStamp : now(),
        error : config["instrument-with-stack"] ? new Error(promise._label) : null
      }
    })) {
      init();
    }
  }

  function _invokeCallback() {
    return new TypeError("参数错误");
  }

  function noop() {
  }

  function fn(arg) {
    try {
      return arg.then;
    } catch (e) {
      return a.error = e, a;
    }
  }

  function iterator(callback, obj, node, value) {
    try {
      callback.call(obj, node, value);
    } catch (mapped) {
      return mapped;
    }
  }

  function reduce(promise, node, key) {
    config.async(function(promise) {
      var d = false;
      var value = iterator(key, node, function(context) {
        if (!d) {
          d = true;
          if (node !== context) {
            resolve(promise, context);
          } else {
            callback(promise, context);
          }
        }
      }, function(isXML) {
        if (!d) {
          d = true;
          fulfill(promise, isXML);
        }
      }, "Settle: " + (promise._label || " unknown promise"));
      if (!d) {
        if (value) {
          d = true;
          fulfill(promise, value);
        }
      }
    }, promise);
  }

  function notify(value, promise) {
    if (promise._state === FULFILLED) {
      callback(value, promise._result);
    } else {
      if (promise._state === REJECTED) {
        promise._onError = null;
        fulfill(value, promise._result);
      } else {
        reject(promise, void 0, function(val) {
          if (promise !== val) {
            resolve(value, val);
          } else {
            callback(value, val);
          }
        }, function(isXML) {
          fulfill(value, isXML);
        });
      }
    }
  }

  function extend(value, obj) {
    if (obj.constructor === value.constructor) {
      notify(value, obj);
    } else {
      var out = fn(obj);
      if (out === a) {
        fulfill(value, a.error);
      } else {
        if (void 0 === out) {
          callback(value, obj);
        } else {
          if (isFunction(out)) {
            reduce(value, obj, out);
          } else {
            callback(value, obj);
          }
        }
      }
    }
  }

  function resolve(value, key) {
    if (value === key) {
      callback(value, key);
    } else {
      if (isObject(key)) {
        extend(value, key);
      } else {
        callback(value, key);
      }
    }
  }

  function success(promise) {
    if (promise._onError) {
      promise._onError(promise._result);
    }
    publish(promise);
  }

  function callback(promise, value) {
    if (promise._state === PENDING) {
      promise._result = value;
      promise._state = FULFILLED;
      if (0 === promise._subscribers.length) {
        if (config.instrument) {
          instrument("fulfilled", promise);
        }
      } else {
        config.async(publish, promise);
      }
    }
  }

  function fulfill(promise, value) {
    if (promise._state === PENDING) {
      promise._state = REJECTED;
      promise._result = value;
      config.async(success, promise);
    }
  }

  function reject(promise, opt_attributes, obj, child) {
    var subscribers = promise._subscribers;
    var length = subscribers.length;
    promise._onError = null;
    subscribers[length] = opt_attributes;
    subscribers[length + FULFILLED] = obj;
    subscribers[length + REJECTED] = child;
    if (0 === length) {
      if (promise._state) {
        config.async(publish, promise);
      }
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;
    if (config.instrument && instrument(settled === FULFILLED ? "fulfilled" : "rejected", promise), 0 !== subscribers.length) {
      var child;
      var callback;
      var detail = promise._result;
      var i = 0;
      for (;i < subscribers.length;i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];
        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }
      promise._subscribers.length = 0;
    }
  }

  function Alpha() {
    this.error = null;
  }

  function load(cb, evt) {
    try {
      return cb(evt);
    } catch (result) {
      return target.error = result, target;
    }
  }

  function invokeCallback(settled, promise, text, args) {
    var value;
    var ctor;
    var b;
    var i;
    var a = isFunction(text);
    if (a) {
      if (value = load(text, args), value === target ? (i = true, ctor = value.error, value = null) : b = true, promise === value) {
        return void fulfill(promise, _invokeCallback());
      }
    } else {
      value = args;
      b = true;
    }
    if (!(promise._state !== PENDING)) {
      if (a && b) {
        resolve(promise, value);
      } else {
        if (i) {
          fulfill(promise, ctor);
        } else {
          if (settled === FULFILLED) {
            callback(promise, value);
          } else {
            if (settled === REJECTED) {
              fulfill(promise, value);
            }
          }
        }
      }
    }
  }

  function resolver(value, callback) {
    var c = false;
    try {
      callback(function(subKey) {
        if (!c) {
          c = true;
          resolve(value, subKey);
        }
      }, function(isXML) {
        if (!c) {
          c = true;
          fulfill(value, isXML);
        }
      });
    } catch (udataCur) {
      fulfill(value, udataCur);
    }
  }

  function writeByte(deepDataAndEvents, val, value) {
    return deepDataAndEvents === FULFILLED ? {
      state : "fulfilled",
      value : value
    } : {
      state : "rejected",
      reason : value
    };
  }

  function clone(obj, input, recurring, dataAndEvents) {
    this._instanceConstructor = obj;
    this.promise = new obj(noop, dataAndEvents);
    this._abortOnReject = recurring;
    if (this._validateInput(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;
      this._init();
      if (0 === this.length) {
        callback(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (0 === this._remaining) {
          callback(this.promise, this._result);
        }
      }
    } else {
      fulfill(this.promise, this._validationError());
    }
  }

  function authenticate(callback, name) {
    return(new Context(this, callback, true, name)).promise;
  }

  function check(ids, deepDataAndEvents) {

    function promise(fn) {
      resolve(self, fn);
    }

    function check(val) {
      fulfill(self, val);
    }
    var Promise = this;
    var self = new Promise(noop, deepDataAndEvents);
    if (!same(ids)) {
      return fulfill(self, new TypeError("type err")), self;
    }
    var len = ids.length;
    var i = 0;
    for (;self._state === PENDING && len > i;i++) {
      reject(Promise.resolve(ids[i]), void 0, promise, check);
    }
    return self;
  }

  function get(path, errback) {
    var Promise = this;
    if (path && ("object" == typeof path && path.constructor === Promise)) {
      return path;
    }
    var promise = new Promise(noop, errback);
    return resolve(promise, path), promise;
  }

  function then(isXML, onFail) {
    var Promise = this;
    var promise = new Promise(noop, onFail);
    return fulfill(promise, isXML), promise;
  }

  function freeze() {
    throw new TypeError("参数错误");
  }

  function forEach() {
    throw new TypeError("参数错误");
  }

  function Promise(context, label) {
    this._id = counter++;
    this._label = label;
    this._state = void 0;
    this._result = void 0;
    this._subscribers = [];
    if (config.instrument) {
      instrument("created", this);
    }
    if (noop !== context) {
      if (!isFunction(context)) {
        freeze();
      }
      if (!(this instanceof Promise)) {
        forEach();
      }
      resolver(this, context);
    }
  }

  function Buffer() {
    this.value = void 0;
  }

  function isUndefined(obj) {
    try {
      return obj.then;
    } catch (path) {
      return number.value = path, number;
    }
  }

  function log(v, str, t) {
    try {
      v.apply(str, t);
    } catch (path) {
      return number.value = path, number;
    }
  }

  function makeArray(args, arr) {
    var id;
    var r;
    var ret = {};
    var len = args.length;
    var res = new Array(len);
    var i = 0;
    for (;len > i;i++) {
      res[i] = args[i];
    }
    r = 0;
    for (;r < arr.length;r++) {
      id = arr[r];
      ret[id] = res[r + 1];
    }
    return ret;
  }

  function getString(a) {
    var l = a.length;
    var out = new Array(l - 1);
    var i = 1;
    for (;l > i;i++) {
      out[i - 1] = a[i];
    }
    return out;
  }

  function s(callback, el) {
    return{
      then : function(f, value) {
        return callback.call(el, f, value);
      }
    };
  }
	
  function remove(arg, arr) {
    var initialize = function() {
      var a;
      var cycle = this;
      var l = arguments.length;
      var t = new Array(l + 1);
      var index = false;
      var i = 0;
      for (;l > i;++i) {
        if (a = arguments[i], !index) {
          if (index = eq(a), index === b) {
            var thenPromise = new promise(noop);
            return fulfill(thenPromise, b.value), thenPromise;
          }
          if (index) {
            if (index !== true) {
              a = s(index, a);
            }
          }
        }
        t[i] = a;
      }
      var value = new promise(noop);
      return t[l] = function(isXML, subKey) {
        if (isXML) {
          fulfill(value, isXML);
        } else {
          if (void 0 === arr) {
            resolve(value, subKey);
          } else {
            if (arr === true) {
              resolve(value, getString(arguments));
            } else {
              if (same(arr)) {
                resolve(value, makeArray(arguments, arr));
              } else {
                resolve(value, subKey);
              }
            }
          }
        }
      }, index ? all(value, t, arg, cycle) : print(value, t, arg, cycle);
    };
    return initialize.__proto__ = arg, initialize;
  }

  function print(value, t, s, type) {
    var q = log(s, type, t);
    return q === number && fulfill(value, q.value), value;
  }

  function all(value, callback, path, type) {
    return promise.all(callback).then(function(el) {
      var result = log(path, type, el);
      return result === number && fulfill(value, result.value), value;
    });
  }

  function eq(arg) {
    return arg && "object" == typeof arg ? arg.constructor === promise ? true : isUndefined(arg) : false;
  }

  function fetch(callback, res) {
    return promise.all(callback, res);
  }

  function Assertion(obj, value, dataAndEvents) {
    this._superConstructor(obj, value, false, dataAndEvents);
  }

  function _data(name, data) {
    return(new Assertion(promise, name, data)).promise;
  }

  function initial(array, deepDataAndEvents) {
    return promise.race(array, deepDataAndEvents);
  }

  function RacePromiseArray(walkers, values, dataAndEvents) {
    this._superConstructor(walkers, values, true, dataAndEvents);
  }

  function action(params, file) {
    return(new Request(promise, params, file)).promise;
  }

  function PropertiesPromiseArray(walkers, mom, dataAndEvents) {
    this._superConstructor(walkers, mom, false, dataAndEvents);
  }

  function resolved(caller, v) {
    return(new PropertiesPromiseArray(promise, caller, v)).promise;
  }

  function f2(event) {
    throw setTimeout(function() {
      throw event;
    }), event;
  }

  function makeDefer(label) {
    var deferred = {};
    return deferred.promise = new promise(function(resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    }, label), deferred;
  }

  function map(callback, func, cb) {
    return promise.all(callback, cb).then(function(array) {
      if (!isFunction(func)) {
        throw new TypeError("map参数错误");
      }
      var length = array.length;
      var results = new Array(length);
      var i = 0;
      for (;length > i;i++) {
        results[i] = func(array[i]);
      }
      return promise.all(results, cb);
    });
  }

  function download(target, errback) {
    return promise.resolve(target, errback);
  }

  function files(ret, err) {
    return promise.reject(ret, err);
  }

  function create(callback, func, fail) {
    return promise.all(callback, fail).then(function(array) {
      if (!isFunction(func)) {
        throw new TypeError("filter参数错误");
      }
      var length = array.length;
      var results = new Array(length);
      var i = 0;
      for (;length > i;i++) {
        results[i] = func(array[i]);
      }
      return promise.all(results, fail).then(function(tokenized) {
        var values = new Array(length);
        var i = 0;
        var index = 0;
        for (;length > index;index++) {
          if (tokenized[index]) {
            values[i] = array[index];
            i++;
          }
        }
        return values.length = i, values;
      });
    });
  }

  function when(value, rejected) {
    m[name] = value;
    m[name + 1] = rejected;
    name += 2;
    if (2 === name) {
      untrackRejection();
    }
  }

  function start() {
    var nextTick = process.nextTick;
    var requires = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
    return Array.isArray(requires) && ("0" === requires[1] && ("10" === requires[2] && (nextTick = setImmediate))), function() {
      nextTick(func);
    };
  }

  function cc() {
    return function() {
      vertxNext(func);
    };
  }

  function useMutationObserver() {
    var data = 0;
    var s = new bulk(func);
    var link = document.createTextNode("");
    return s.observe(link, {
      characterData : true
    }), function() {
      link.data = data = ++data % 2;
    };
  }

  function initMessageChannel() {
    var channel = new MessageChannel;
    return channel.port1.onmessage = func, function() {
      channel.port2.postMessage(0);
    };
  }

  function wrapListener() {
    return function() {
      setTimeout(func, 1);
    };
  }

  function func() {
    var i = 0;
    for (;name > i;i += 2) {
      var part = m[i];
      var formula = m[i + 1];
      part(formula);
      m[i] = void 0;
      m[i + 1] = void 0;
    }
    name = 0;
  }

  function constructor() {
    try {
      var nodes = require("vertx");
      return nodes.runOnLoop || nodes.runOnContext, cc();
    } catch (b) {
      return wrapListener();
    }
  }

  function async(callback, rejected) {
    config.async(callback, rejected);
  }

  function on() {
    config.on.apply(config, arguments);
  }

  function off() {
    config.off.apply(config, arguments);
  }
  var EventTarget = {
    mixin : function(object) {
      return object.on = this.on, object.off = this.off, object.trigger = this.trigger, object._promiseCallbacks = void 0, object;
    },

    on : function(eventName, fn) {
      var afterMethods;
      var allCallbacks = callbacksFor(this);
      afterMethods = allCallbacks[eventName];
      if (!afterMethods) {
        /** @type {Array} */
        afterMethods = allCallbacks[eventName] = [];
      }
      if (-1 === each(afterMethods, fn)) {
        afterMethods.push(fn);
      }
    },

    off : function(eventName, fn) {
      var items;
      var idx;
      var allCallbacks = callbacksFor(this);
      return fn ? (items = allCallbacks[eventName], idx = each(items, fn), void(-1 !== idx && items.splice(idx, 1))) : void(allCallbacks[eventName] = []);
    },

    trigger : function(eventName, data) {
      var callbacks;
      var callback;
      var allCallbacks = callbacksFor(this);
      if (callbacks = allCallbacks[eventName]) {
        var i = 0;
        for (;i < callbacks.length;i++) {
          (callback = callbacks[i])(data);
        }
      }
    }
  };
  var config = {
    instrument : false
  };
  EventTarget.mixin(config);
  var YES;
  YES = Array.isArray ? Array.isArray : function(arr) {
    return "[object Array]" === Object.prototype.toString.call(arr);
  };
  var same = YES;
  var now = Date.now || function() {
    return(new Date).getTime();
  };
  var createObject = Object.create || function(object) {
    if (arguments.length > 1) {
      throw new Error("参数错误");
    }
    if ("object" != typeof object) {
      throw new TypeError("参数错误");
    }
    return TemplateClass.prototype = object, new TemplateClass;
  };
  var attrList = [];
  var instrument = next;
  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var a = new Alpha;
  var target = new Alpha;
  var Context = clone;
  clone.prototype._validateInput = function(v) {
    return same(v);
  };

  clone.prototype._validationError = function() {
    return new Error("参数错误");
  };

  clone.prototype._init = function() {
    this._result = new Array(this.length);
  };

  clone.prototype._enumerate = function() {
    var n = this.length;
    var promise = this.promise;
    var ancestor = this._input;
    var m = 0;
    for (;promise._state === PENDING && n > m;m++) {
      this._eachEntry(ancestor[m], m);
    }
  };
  clone.prototype._eachEntry = function(me, $conditional) {
    var fn = this._instanceConstructor;
    if (template(me)) {
      if (me.constructor === fn && me._state !== PENDING) {
        me._onError = null;
        this._settledAt(me._state, $conditional, me._result);
      } else {
        this._willSettleAt(fn.resolve(me), $conditional);
      }
    } else {
      this._remaining--;
      this._result[$conditional] = this._makeResult(FULFILLED, $conditional, me);
    }
  };
  clone.prototype._settledAt = function(deepDataAndEvents, $conditional, isXML) {
    var promise = this.promise;
    if (promise._state === PENDING) {
      this._remaining--;
      if (this._abortOnReject && deepDataAndEvents === REJECTED) {
        fulfill(promise, isXML);
      } else {
        this._result[$conditional] = this._makeResult(deepDataAndEvents, $conditional, isXML);
      }
    }
    if (0 === this._remaining) {
      callback(promise, this._result);
    }
  };
	
  clone.prototype._makeResult = function(deepDataAndEvents, val, value) {
    return value;
  };

  clone.prototype._willSettleAt = function(error, val) {
    var hooks = this;
    reject(error, void 0, function(isXML) {
      hooks._settledAt(FULFILLED, val, isXML);
    }, function(isXML) {
      hooks._settledAt(REJECTED, val, isXML);
    });
  };

  var allClasses = authenticate;
  var race = check;
  var cast = get;
  var Reject = then;
  var guidKey = "rsvp_" + now() + "-";
  var counter = 0;
  var promise = Promise;
  Promise.cast = cast;
  Promise.all = allClasses;
  Promise.race = race;
  Promise.resolve = cast;
  Promise.reject = Reject;
  Promise.prototype = {
    constructor : Promise,
    _guidKey : guidKey,
    _onError : function(data) {
      config.async(function(store) {
        setTimeout(function() {
          if (store._onError) {
            config.trigger("error", data);
          }
        }, 0);
      }, this);
    },
    then : function(selector, value, label) {
      var promise = this;
      var settled = promise._state;
      if (settled === FULFILLED && !selector || settled === REJECTED && !value) {
        return config.instrument && instrument("chained", this, this), this;
      }
      promise._onError = null;
      var thenPromise = new this.constructor(noop, label);
      var typePattern = promise._result;
      if (config.instrument && instrument("chained", promise, thenPromise), settled) {
        var thisp = arguments[settled - 1];
        config.async(function() {
          invokeCallback(settled, thenPromise, thisp, typePattern);
        });
      } else {
        reject(promise, thenPromise, selector, value);
      }
      return thenPromise;
    },
    "catch" : function(isXML, label) {
      return this.then(null, isXML, label);
    },
    "finally" : function(callback, label) {
      var constructor = this.constructor;
      return this.then(function(dataAndEvents) {
        return constructor.resolve(callback()).then(function() {
          return dataAndEvents;
        });
      }, function(dataAndEvents) {
        return constructor.resolve(callback()).then(function() {
          throw dataAndEvents;
        });
      }, label);
    }
  };
  var number = new Buffer;
  var b = new Buffer;
  var type = remove;
  var jsFiles = fetch;
  Assertion.prototype = createObject(Context.prototype);
  Assertion.prototype._superConstructor = Context;
  Assertion.prototype._makeResult = writeByte;
  Assertion.prototype._validationError = function() {
    return new Error("allSettled err");
  };
  var data = _data;
  var res = initial;
  var Request = RacePromiseArray;
  RacePromiseArray.prototype = createObject(Context.prototype);
	
  RacePromiseArray.prototype._superConstructor = Context;

  RacePromiseArray.prototype._init = function() {
    this._result = {};
  };

  RacePromiseArray.prototype._validateInput = function(b) {
    return b && "object" == typeof b;
  };

  RacePromiseArray.prototype._validationError = function() {
    return new Error("Promise.hash err");
  };

  RacePromiseArray.prototype._enumerate = function() {
    var promise = this.promise;
    var txs = this._input;
    var children = [];
    var p;
    for (p in txs) {
      if (promise._state === PENDING) {
        if (txs.hasOwnProperty(p)) {
          children.push({
            position : p,
            entry : txs[p]
          });
        }
      }
    }
    var l = children.length;
    this._remaining = l;
    var child;
    var i = 0;
    for (;promise._state === PENDING && l > i;i++) {
      child = children[i];
      this._eachEntry(child.entry, child.position);
    }
  };

  var hash = action;

  PropertiesPromiseArray.prototype = createObject(Request.prototype);

  PropertiesPromiseArray.prototype._superConstructor = Context;

  PropertiesPromiseArray.prototype._makeResult = writeByte;

  PropertiesPromiseArray.prototype._validationError = function() {
    return new Error("hashSettled err");
  };
  var untrackRejection;
  var state = resolved;
  var f2old = f2;
  var defer = makeDefer;
  var result = map;
  var resolveFns = download;
  var file = files;
  var filter = create;
  var name = 0;
  var asap = when;
  var opt_global = "undefined" != typeof window ? window : void 0;
  var global = opt_global || {};
  var bulk = global.MutationObserver || global.WebKitMutationObserver;
  var chainable = "undefined" != typeof process && "[object process]" === {}.toString.call(process);
  var length = "undefined" != typeof Uint8ClampedArray && ("undefined" != typeof importScripts && "undefined" != typeof MessageChannel);
  var m = new Array(1E3);
  if (untrackRejection = chainable ? start() : bulk ? useMutationObserver() : length ? initMessageChannel() : void 0 === opt_global && "function" == typeof require ? constructor() : wrapListener(), config.async = asap, "undefined" != typeof window && "object" == typeof window.__PROMISE_INSTRUMENTATION__) {
    var callbacks = window.__PROMISE_INSTRUMENTATION__;
    configure("instrument", true);
    var eventName;
    for (eventName in callbacks) {
      if (callbacks.hasOwnProperty(eventName)) {
        on(eventName, callbacks[eventName]);
      }
    }
  }
  var vow = {
    race : res,
    Promise : promise,
    allSettled : data,
    hash : hash,
    hashSettled : state,
    denodeify : type,
    on : on,
    off : off,
    map : result,
    filter : filter,
    resolve : resolveFns,
    reject : file,
    all : jsFiles,
    rethrow : f2old,
    defer : defer,
    EventTarget : EventTarget,
    configure : configure,
    async : async
  };
  if ("function" == typeof define && define.amd) {
    define(function() {
      return vow;
    });
  } else {
    if ("undefined" != typeof module && module.exports) {
      module.exports = vow;
    } else {
      if ("undefined" != typeof this) {
        this.RSVP = vow;
      }
    }
  }
	
  /* ================= 以上部分很变态，可忽略 ===================== */

}).call(this), function(module, doc) {	
  var head = doc.head || doc.getElementsByTagName("head")[0];
  var storagePrefix = "gomeCache-";
  var defaultExpiration = 5E3;
  var errors = [];

  var addLocalStorage = function(key, storeObj) {
    try {
      return localStorage.setItem(storagePrefix + key, JSON.stringify(storeObj)), true;
    } catch (elem) {
      if (elem.name.toUpperCase().indexOf("QUOTA") >= 0) {
        var item;
        var bucket = [];
        for (item in localStorage) {
          if (0 === item.indexOf(storagePrefix)) {
            bucket.push(JSON.parse(localStorage[item]));
          }
        }
        return bucket.length ? (bucket.sort(function(a, b) {
          return a.stamp - b.stamp;
        }), gomeCache.remove(bucket[0].key), addLocalStorage(key, storeObj)) : void 0;
      }
      return;
    }
  };

  var template = function(src) {
    var html = new RSVP.Promise(function(callback, cb) {
	  //目前只能同源，想跨域需要用 XMLHttpRequest level2
      var xhr = new XMLHttpRequest;
      xhr.open("GET", src);
      xhr.onreadystatechange = function() {
        if (4 === xhr.readyState) {
          if (200 === xhr.status || 0 === xhr.status && xhr.responseText) {
            callback({
              content : xhr.responseText,
              type : xhr.getResponseHeader("content-type")
            });
          } else {
            cb(new Error(xhr.statusText));
          }
        }
      };
	  // default XHRs never timeout, So we do it ourselves.
      setTimeout(function() {
        if (xhr.readyState < 4) {
          xhr.abort();
        }
      }, gomeCache.timeout);
      xhr.send();
    });
    return html;
  };

  var saveUrl = function(obj) {
    return template(obj.url).then(function(result) {
      var storeObj = wrapStoreData(obj, result);
      return obj.skipCache || addLocalStorage(obj.key, storeObj), storeObj;
    });
  };

  var wrapStoreData = function(obj, data) {
    var now = +new Date;
    return obj.data = data.content, obj.originalType = data.type, obj.type = obj.type || data.type, obj.skipCache = obj.skipCache || false, obj.stamp = now, obj.expire = now + 60 * (obj.expire || defaultExpiration) * 60 * 1E3, obj;
  };

  var isCacheValid = function(source, obj) {
    return!source || (source.expire - +new Date < 0 || (obj.unique !== source.unique || gomeCache.isValidItem && !gomeCache.isValidItem(source, obj)));
  };

  var handleStackObject = function(obj) {
    var source;
    var promise;
    var shouldFetch;
    if (obj.url) {
      return obj.key = obj.key || obj.url, source = gomeCache.get(obj.key), obj.execute = obj.execute !== false, shouldFetch = isCacheValid(source, obj), obj.live || shouldFetch ? (obj.unique && (obj.url += (obj.url.indexOf("?") > 0 ? "&" : "?") + "gomeCache-unique=" + obj.unique), promise = saveUrl(obj), obj.live && (!shouldFetch && (promise = promise.then(function(result) {
        return result;
      }, function() {
        return source;
      })))) : (source.type = obj.type || source.originalType, source.execute = obj.execute, promise = new RSVP.Promise(function(trim) {
        trim(source);
      })), promise;
    }
  };

  var injectScript = function(obj) {

    var script = doc.createElement("script");
    script.defer = true;
    script.text = obj.data;//必须是文本格式
    head.appendChild(script);
  };
  var handlers = {
    "default" : injectScript
  };
  var onSuccess = function(obj) {
    return obj.type && handlers[obj.type] ? handlers[obj.type](obj) : handlers["default"](obj);
  };
  var resolve = function(mod) {
    return mod.map(function(args) {
      return args.execute && onSuccess(args), args;
    });
  };

  var fetch = function() {
    var i;
    var l;
    var scripts = [];

    i = 0;
    l = arguments.length;
    for (;l > i;i++) {
      scripts.push(handleStackObject(arguments[i]));
    }
    return RSVP.all(scripts);
  };

  var thenRequire = function() {
    var resources = fetch.apply(null, arguments);
    var promise = this.then(function() {
      return resources;
    }).then(resolve);
    return promise.thenRequire = thenRequire, promise;
  };
		
  module.gomeCache = {
	  
// API
	  
	// gomeCache.require(details) 每个请求项目发出或者失败时，返回promise
		// url 同源js地址
		// key 脚本名称，对应localstorage key
		// expire 过期时间
		// unique 版本号过期策略，不一致时更新localstorage
		// skipCache 默认false，true时不缓存脚本
    require : function() {

      var i = 0;
      var l = arguments.length;
      for (;l > i;i++) {
        arguments[i].execute = arguments[i].execute !== false;
        if (arguments[i].once && errors.indexOf(arguments[i].url) >= 0) {
          arguments[i].execute = false;
        } else {
          if (arguments[i].execute !== false) {
            if (errors.indexOf(arguments[i].url) < 0) {
              errors.push(arguments[i].url);
            }
          }
        }
      }
      var promise = fetch.apply(null, arguments).then(resolve);
      return promise.thenRequire = thenRequire, promise;
    },
	
	// gomeCache.remove(key) 字面意义明显，不再赘述
    remove : function(key) {
      return localStorage.removeItem(storagePrefix + key), this;
    },

	// gomeCache.get(key) 根据key查找localstorage，返回一个对象，包含stamp（时间戳）expire（过期时间）data（脚本内容）属性
    get : function(key) {
      var item = localStorage.getItem(storagePrefix + key);
      try {
        return JSON.parse(item || "false");
      } catch (c) {
        return false;
      }
    },

	// gomeCache.clear(expired) expired为true时，过期的才会清除，否则全部清除
    clear : function(expired) {
      var item;
      var key;
      var now = +new Date;
      for (item in localStorage) {
        key = item.split(storagePrefix)[1];
        if (key) {
          if (!expired || this.get(key).expire <= now) {
            this.remove(key);
          }
        }
      }
      return this;
    },
	  
	// gomeCache.isValidItem(source, obj) 验证缓存是否有效的方法，缓存文件被调用时执行，返回布尔值
    isValidItem : null,
	
    timeout : 5E3,

    addHandler : function(model, handler) {
      if (!Array.isArray(model)) {
        model = [model];
      }
      model.forEach(function(ext) {
        handlers[ext] = handler;
      });
    },
    removeHandler : function(fn) {
      gomeCache.addHandler(fn, void 0);
    }
  };
  gomeCache.clear(true);//清理过期
}(this, document);
