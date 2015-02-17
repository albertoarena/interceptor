# Interceptor

Interceptor is a JavaScript library that allows to intercept methods of an existing object, and inject new methods
and properties.

## How to use it

To intercept/inject methods of an existing object, simply call `interceptor()` passing as a paramater the object itself,
and after use the methods of interceptor to modify the behaviour of the object.

    interceptor(objectInstance)
        .before(method, beforeCallback)
        .after(method, afterCallback)
        .both(method, beforeCallback, afterCallback)
        .conditional(method, conditionalCallback, returnIfFails)
        .wrap(method, wrapCallback)

All the methods of an `interceptor` object are **chainable**.

When the callbacks are called, `this` will be always the object itself.

## Method `before`

The `before` method can be used to execute some code before the original method is called, e.g. to prepare something
or inject some values in the object.

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

Example:

    var obj = {
        name: 'Jim',
        hello: function() {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .before('hello', function(obj) {
            this.name = 'Ross';
        });

    obj.hello(); # ==> 'hello Ross'

## Method `after`

The `after` method can be used to process the result of the original method before it is returned, and change it
on the fly.

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

Example:

    var obj = {
        name: 'Jim',
        hello: function() {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .after('hello', function(value, obj) {
            return value + '!!';
        });

    obj.hello(); # ==> 'hello Jim!!'

## Method `both`

The `both` method is a shortcut to the `before` and `after` methods together.

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

Example:

     var obj = {
         name: 'Jim',
         hello: function() {
             return 'hello ' + this.name;
         }
     }

     interceptor(obj)
         .both('hello', function(value) {
                this.name = 'Ross';
            },
            function(value, obj) {
                return value + '!!';
            }
         );

     obj.hello(); # ==> 'hello Ross!!'

## Method `conditional`

The `conditional` method can be used to create a conditional branch that decides if the original method will be
invoked or not.

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

Example:

    var obj = {
        name: 'Jim',
        hello: function() {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .conditional('hello', function(args, obj) {
            return (this.name != 'Jim');
        }, 'failed!');

    obj.hello(); # ==> 'failed!'

## Method `wrap`

The `wrap` method can be used to change the behaviour of the original method, e.g. adding parameters not available in
its definition or changing the value returned by it.

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

Example:

    var obj = {
        name: 'Jim',
        hello: function(ob) {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .wrap('hello', function(original, args, obj) {
            if (args.length === 0) {
                return original();
            } else {
                return 'hiya ' + this.name + ', ' + args.join(', ');
            }
        });

    obj.hello();                    # ==> 'hello Jim'
    obj.hello('how are you?');      # ==> 'hiya Jim, how are you?'

## Method `inject`

The `inject` method can be used to inject a custom method in an existing object.

    /**
     * Injection of a custom method that is not available in the object
     * The callback can accept whatever arguments
     *
     * @param {string} methodName
     * @param {function} callback
     * @returns {interceptor}
     */

Example:

    var obj = {
        name: 'Jim',
        hello: function(ob) {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .inject('goodbye', function() {
            return 'goodbye ' + this.name;
         });

    obj.hello();            # ==> 'hello Jim'
    obj.goodbye();          # ==> 'goodbye Jim'

## Method `detach`

The `detach` method detaches a custom method added with `inject'. It doesn't detach the original methods of the object.

    /**
     * Detaching of a custom method that was injected previously
     * It doesn't detach the original methods of the object
     *
     * @param {string} methodName
     * @returns {interceptor}
     */

    var obj = {
        name: 'Jim',
        hello: function(ob) {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .inject('goodbye', function() {
            return 'goodbye ' + this.name;
         });

    obj.hello();            # ==> 'hello Jim'
    obj.goodbye();          # ==> 'goodbye Jim'

    interceptor(obj)
        .detach('goodbye')

    typeof obj.goodbye      # ==> undefined

## Method `property`

The `property` method can be used to inject a custom property in the object.

    /**
     * Injection of a custom property that is not available in the object
     *
     * @param {string} propertyName
     * @param {*} value
     * @returns {interceptor}
     */

Example:

    var obj = {
        name: 'Jim',
        hello: function(ob) {
            return 'hello ' + this.name;
        }
    }

    interceptor(obj)
        .property('surname', 'Smith');

    obj.name;               # ==> 'Jim'
    obj.surname;            # ==> 'Smith'
