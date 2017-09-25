define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evented = (function () {
        function Evented() {
            this.eventObj = {};
            this.eventId = _.uniqueId("event-");
            this.setEventSplitter(" ");
            this.setEventSuffixSplitter(":");
        }
        Evented.prototype.offKeyMatcher = function (objkey, key) {
            if (key == "*" || key == "all") {
                return true;
            }
            else {
                var reg = new RegExp("^" + key + ":{1}|^" + key + "$");
                return reg.test(objkey);
            }
        };
        Evented.prototype.triggerKeyMatcher = function (objkey, key) {
            if (key == "*" || key == "all" || objkey == "*" || objkey == "all") {
                return true;
            }
            else {
                key = key.split(this.eventSuffixSplitter)[0].trim();
                objkey = objkey.split(this.eventSuffixSplitter)[0].trim();
                return key == objkey;
            }
        };
        Evented.prototype.setEventSplitter = function (s) {
            this.eventSplitter = s;
            return this;
        };
        Evented.prototype.setEventSuffixSplitter = function (s) {
            this.eventSuffixSplitter = s;
            return this;
        };
        Evented.eachEvent = function (iteratee, eventObj, name, callback, context, args) {
            var names = name.split(eventObj.eventSplitter);
            for (var i = 0; i < names.length; ++i) {
                iteratee(eventObj, eventObj.eventObj, names[i], callback, context, args);
            }
        };
        Evented.onApi = function (eventObj, eventsDataObj, name, callback, context) {
            if (_.isFunction(callback)) {
                var handlers = eventsDataObj[name] || (eventsDataObj[name] = []);
                var handler = {
                    callback: callback, context: context
                };
                var isFind = _.some(handlers, function (h) { return h.callback == callback && h.context == context; });
                if (isFind) {
                    return eventObj;
                }
                else {
                    handlers.push(handler);
                    return eventObj;
                }
            }
        };
        Evented.offApi = function (eventObj, eventsDataObj, key, callback, context) {
            _.each(eventsDataObj, function (v, k) {
                if (eventObj.offKeyMatcher(k, key)) {
                    if (_.isFunction(callback)) {
                        eventsDataObj[k] = _.reject(v, function (handle) { return handle.callback == callback && handle.context == context; });
                    }
                    else {
                        eventsDataObj[k] = [];
                    }
                }
            });
            return eventObj;
        };
        Evented.onceApi = function (eventObj, eventsDataObj, key, callback, context) {
            if (_.isFunction(callback)) {
                var newCallback = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    callback.apply(context, args);
                    eventObj.off(key, callback, context);
                };
                eventObj.on(key, newCallback, null);
            }
        };
        Evented.triggerApi = function (eventObj, eventsDataObj, key, callback, context, args) {
            _.each(eventsDataObj, function (v, k) {
                if (eventObj.triggerKeyMatcher(k, key)) {
                    _.each(v, function (v) { return v.callback.apply(v.context, args); });
                }
            });
        };
        Evented.prototype.on = function (keys, callback, context) {
            Evented.eachEvent(Evented.onApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.off = function (keys, callback, context) {
            Evented.eachEvent(Evented.offApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.once = function (keys, callback, context) {
            Evented.eachEvent(Evented.onceApi, this, keys, callback, context);
            return this;
        };
        Evented.prototype.trigger = function (keys) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            Evented.eachEvent(Evented.triggerApi, this, keys, null, null, args);
            return this;
        };
        Evented.prototype.fire = function (keys) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            Evented.eachEvent(Evented.triggerApi, this, keys, null, null, args);
            return this;
        };
        Evented.prototype.proxyEvents = function (e) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _.each(args, function (arg) { return e.on(arg, function () {
                var targs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    targs[_i] = arguments[_i];
                }
                _this.fire.apply(_this, [arg].concat(targs));
            }); });
        };
        return Evented;
    }());
    exports.Evented = Evented;
});
