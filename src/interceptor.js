/**
 * Interceptor.js
 * Inject interception points to an object methods
 *
 * @author Alberto Arena <arena.alberto@gmail.com>
 * @licence MIT https://github.com/albertoarena/interceptor/blob/master/LICENSE-MIT
 *
 * @param {Object} obj
 * @returns {*}
 */

function interceptor(obj) {

    var injected = [];

    return {
        /**
         * Interception of a method after it is called
         * The callback receives as arguments the value returned by the original method and the object
         *      callbackAfter(value, object)
         * The intercepted method will return the value returned by the callback
         *
         * @param {string} methodName           method name
         * @param {function} callbackAfter      callback to execute after the original method is called
         * @returns {interceptor}               this
         */
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

        /**
         * Interception of a method before it is called
         * The callback receives as argument the object
         *      callbackBefore(object)
         * The intercepted method will return regularly its result
         *
         * @param {string} methodName
         * @param {function} callbackBefore
         * @returns {interceptor}
         */
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

        /**
         * Base on a condition, it calls the original method or return another value
         * The callback receives as argument the arguments of the method calling as an array, and the original object
         *      conditionalCallback(args, object)
         * If the conditional callback returns true, the original method will be called and its result returned
         * If the conditional callback returns false, the returnIfFails value is returned, or false if not available
         *
         * @param {string} methodName
         * @param {function} callbackConditional
         * @param {undefined|*} returnIfFails
         * @returns {interceptor}
         */
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

        /**
         * Interception of a method before and after it is called
         * Equivalent to before().after() called together
         * The before callback receives as arguments the value returned by the original method and the object
         *      callbackAfter(value, object)
         * The after callback receives as arguments the value returned by the original method and the object
         *      callbackAfter(value, object)
         * The intercepted method will return the value returned by the after callback
         *
         * @param {string} methodName
         * @param {function} callbackBefore
         * @param {function} callbackAfter
         * @returns {interceptor}
         */
        both: function (methodName, callbackBefore, callbackAfter) {
            return this.before(methodName, callbackBefore)
                .after(methodName, callbackAfter);
        },

        /**
         * Wrapping of a method
         * The callback receives as arguments the original methods, the arguments of the call and the object
         *      wrapCallback(originalMethod, args, obj)
         * The intercepted method will return the result of the wrap callback
         *
         * @param {string} methodName
         * @param {function} wrapCallback
         * @returns {interceptor}
         */
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

        /**
         * Injection of a custom method that is not available in the object
         * The callback can accept whatever arguments
         *
         * @param {string} methodName
         * @param {function} callback
         * @returns {interceptor}
         */
        inject: function (methodName, callback) {
            if (typeof obj[methodName] == 'undefined' && typeof callback == 'function') {
                injected.push(methodName);
                obj[methodName] = callback;
            }
            return this;
        },

        /**
         * Detaching of a custom method that was injected previously
         * It doesn't detach the original methods of the object
         *
         * @param {string} methodName
         * @returns {interceptor}
         */
        detach: function (methodName) {
            if (injected.indexOf(methodName) != -1 && typeof obj[methodName] == 'function') {
                delete obj[methodName];
            }
            return this;
        },

        /**
         * Injection of a custom property that is not available in the object
         *
         * @param {string} propertyName
         * @param {*} value
         * @returns {interceptor}
         */
        property: function (propertyName, value) {
            var propertyType = typeof propertyName;
            if (propertyType != 'function' && propertyType !== undefined && propertyType !== null && typeof obj[propertyName] == 'undefined') {
                if (typeof value == 'function') {
                    obj[propertyName] = value.apply(obj);
                }
                else {
                    obj[propertyName] = value;
                }
            }
            return this;
        }

    };

};
