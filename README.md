# Interceptor
Interceptor is a JavaScript library to intercept and inject methods against an existing object.

## Intercept methods

    function Person(n) {
        var name = n;
        return {
            getName: function() {
                return name;
            },
            setName: function(n) {
                name = n;
            }
        };
    }

    var john = new Person('John');

    # Intercept the method setName adding a "before" callback
    interceptor(john)
        .before('setName', function(v, obj) {
            return v + ' Smith';
        })
        .before('getName', function(v, obj) {
            return 'Mr ' + v;
        });

    console.log(john.setName('Mike).getName());
    # ==> Mr Mike Smith

## Inject new methods and properties

    function Person(n) {
        var name = n;
        return {
            getName: function() {
                return name;
            },
            setName: function(n) {
                name = n;
            }
        };
    }

    interceptor(join)
        .inject('hello', function() {
            return 'Hello, ' + this.getName();
        })
        .property('surname', 'Black');

    console.log(john.hello());
    # ==> Hello, John

    console.log(john.surname);
    # ==> Black