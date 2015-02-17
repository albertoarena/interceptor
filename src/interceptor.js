/**
 * Interceptor.js
 * Inject interception points to an object methods
 *
 * @param obj
 * @returns {*}
 */

function interceptor(obj) {

    var injected = [];

    return {
        after: function (methodName, callbackAfter) {
            (function () {
                if (typeof obj[methodName] == 'function' && typeof callbackAfter == 'function') {
                    var original = obj[methodName];
                    obj[methodName] = function () {
                        return callbackAfter(original.apply(obj, arguments), obj);
                    }
                }
            })();
            return this;
        },

        before: function (methodName, callbackBefore) {
            (function () {
                if (typeof obj[methodName] == 'function' && typeof callbackBefore == 'function') {
                    var original = obj[methodName];
                    obj[methodName] = function () {
                        callbackBefore(obj);
                        return original.apply(obj, arguments);
                    }
                }
            })();
            return this;
        },

        conditional: function (methodName, callbackConditional, returnIfFails) {
            (function () {
                if (typeof obj[methodName] == 'function' && typeof callbackConditional == 'function') {
                    var original = obj[methodName];
                    obj[methodName] = function () {
                        if (callbackConditional(arguments, obj)) {
                            return original.apply(obj, arguments);
                        }
                        else {
                            return (returnIfFails !== undefined ? returnIfFails : false);
                        }
                    }
                }
            })();
            return this;
        },

        both: function (methodName, callbackBefore, callbackAfter) {
            return this.before(methodName, callbackBefore)
                .after(methodName, callbackAfter);
        },

        wrap: function (methodName, wrapCallback) {
            (function () {
                if (typeof obj[methodName] == 'function' && typeof wrapCallback == 'function') {
                    var original = obj[methodName];
                    obj[methodName] = function () {
                        return wrapCallback(original, arguments, obj);
                    }
                }
            })();
            return this;
        },

        inject: function (methodName, callback) {
            if (typeof obj[methodName] == 'undefined' && typeof callback == 'function') {
                injected.push(methodName);
                obj[methodName] = callback;
            }
            return this;
        },

        detach: function (methodName) {
            if (injected.indexOf(methodName) != -1 && typeof obj[methodName] == 'function') {
                delete obj[methodName];
            }
            return this;
        },

        invoke: function (methodName, args) {
            if (typeof obj[methodName] == 'function') {
                obj[methodName].apply(undefined, args);
            }
            return this;
        },

        property: function (property, value) {
            var propertyType = typeof property;
            if (propertyType != 'function' && propertyType !== undefined && propertyType !== null && typeof obj[property] == 'undefined') {
                if (typeof value == 'function') {
                    obj[property] = value.apply(obj);
                }
                else {
                    obj[property] = value;
                }
            }
            return this;
        }

    };

};
