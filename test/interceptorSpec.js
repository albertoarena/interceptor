describe("interceptor", function () {

    // Mock object
    var MockPerson = function (n) {
        var name = n;
        return {
            id: 0,
            getName: function () {
                return name;
            },
            setName: function (n) {
                name = n;
                return this;
            }
        };
    };

    // Mock callbacks
    var MockCallbacks = function () {
        return {
            after: function (v, obj) {
                return v + ' smith';
            },
            before: function (obj) {
                //
            },
            conditional: function (args, obj) {
                return 'mike';
            },
            conditionalCallbackOk: function (args, obj) {
                args[0] = args[0] + ' smith';
                return true;
            },
            conditionalCallbackFail: function (args, obj) {
                return false;
            },
            wrap: function (originalMethod, args, obj) {
                return originalMethod() + ' smith';
            },
            injectRandomName: function (length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                this.setName(text);
                return this;
            },
            injectSayHello: function () {
                return 'hello';
            },
            property: function (obj) {
                return 'Nick';
            },
            invalid: null
        };
    };

    describe("After method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
            spyOn(callbacks, "after").and.callThrough();
        });

        it("Should invoke a callback", function () {
            personInterceptor.after('getName', callbacks.after);
            expect(person.getName()).toEqual('john smith');
            expect(callbacks.after).toHaveBeenCalled();
        });

        it("Shouldn't invoke a property", function () {
            personInterceptor.after('name', callbacks.after);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid method", function () {
            personInterceptor.after('notExisting', callbacks.after);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid callback", function () {
            personInterceptor.after('getName', callbacks.invalid);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
        });
    });

    describe("Before method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
            spyOn(callbacks, "before").and.callThrough();
        });

        it("Should invoke a callback", function () {
            personInterceptor.before('getName', callbacks.before);
            expect(person.getName()).toEqual('john');
            expect(callbacks.before).toHaveBeenCalled();
        });

        it("Shouldn't invoke a property", function () {
            personInterceptor.before('name', callbacks.before);
            expect(person.getName()).toEqual('john');
            expect(callbacks.before).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid method", function () {
            personInterceptor.before('notExisting', callbacks.before);
            expect(person.getName()).toEqual('john');
            expect(callbacks.before).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid callback", function () {
            personInterceptor.before('getName', callbacks.invalid);
            expect(person.getName()).toEqual('john');
            expect(callbacks.before).not.toHaveBeenCalled();
        });
    });

    describe("Conditional method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
        });

        it("Should invoke a callback", function () {
            spyOn(callbacks, 'conditionalCallbackOk').and.callThrough();
            personInterceptor.conditional('setName', callbacks.conditionalCallbackOk);
            expect(person.setName('jim')).toBe(person);
            expect(callbacks.conditionalCallbackOk).toHaveBeenCalled();
            expect(person.getName()).toEqual('jim smith');
        });

        it("Should invoke a callback and return false", function () {
            spyOn(callbacks, 'conditionalCallbackFail').and.callThrough();
            personInterceptor.conditional('setName', callbacks.conditionalCallbackFail);
            expect(person.setName('jim')).toBeFalsy();
            expect(callbacks.conditionalCallbackFail).toHaveBeenCalled();
            expect(person.getName()).toEqual('john');
        });


        it("Should invoke a callback and return a value", function () {
            spyOn(callbacks, 'conditionalCallbackFail').and.callThrough();
            personInterceptor.conditional('setName', callbacks.conditionalCallbackFail, 'failed');
            expect(person.setName('jim')).toEqual('failed');
            expect(callbacks.conditionalCallbackFail).toHaveBeenCalled();
            expect(person.getName()).toEqual('john');
        });

        it("Shouldn't invoke a property", function () {
            spyOn(callbacks, 'conditionalCallbackFail').and.callThrough();
            personInterceptor.conditional('name', callbacks.conditionalCallbackFail);
            expect(person.setName('jim')).toBe(person);
            expect(callbacks.conditionalCallbackFail).not.toHaveBeenCalled();
            expect(person.getName()).toEqual('jim');
        });

        it("Shouldn't invoke an invalid method", function () {
            spyOn(callbacks, 'conditionalCallbackFail').and.callThrough();
            personInterceptor.conditional('notExisting', callbacks.conditionalCallbackFail);
            expect(person.setName('jim')).toBe(person);
            expect(callbacks.conditionalCallbackFail).not.toHaveBeenCalled();
            expect(person.getName()).toEqual('jim');
        });

        it("Shouldn't invoke an invalid callback", function () {
            spyOn(callbacks, 'conditionalCallbackFail').and.callThrough();
            personInterceptor.conditional('setName', callbacks.invalid);
            expect(person.setName('jim')).toBe(person);
            expect(callbacks.conditionalCallbackFail).not.toHaveBeenCalled();
            expect(person.getName()).toEqual('jim');
        });
    });

    describe("Both method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
            spyOn(callbacks, "after").and.callThrough();
            spyOn(callbacks, "before").and.callThrough();
        });

        it("Should invoke a callback", function () {
            personInterceptor.both('getName', callbacks.before, callbacks.after);
            expect(person.getName()).toEqual('john smith');
            expect(callbacks.after).toHaveBeenCalled();
            expect(callbacks.before).toHaveBeenCalled();
        });

        it("Shouldn't invoke a property", function () {
            personInterceptor.both('name', callbacks.before, callbacks.after);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
            expect(callbacks.before).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid method", function () {
            personInterceptor.both('notExisting', callbacks.before, callbacks.after);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
            expect(callbacks.before).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid callback", function () {
            personInterceptor.both('getName', callbacks.invalid, callbacks.invalid);
            expect(person.getName()).toEqual('john');
            expect(callbacks.after).not.toHaveBeenCalled();
            expect(callbacks.before).not.toHaveBeenCalled();
        });
    });

    describe("Wrap method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
            spyOn(callbacks, "wrap").and.callThrough();
        });

        it("Should invoke a callback", function () {
            personInterceptor.wrap('getName', callbacks.wrap);
            expect(person.getName()).toEqual('john smith');
            expect(callbacks.wrap).toHaveBeenCalled();
        });

        it("Shouldn't invoke a property", function () {
            personInterceptor.wrap('name', callbacks.wrap);
            expect(person.getName()).toEqual('john');
            expect(callbacks.wrap).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid method", function () {
            personInterceptor.wrap('notExisting', callbacks.wrap);
            expect(person.getName()).toEqual('john');
            expect(callbacks.wrap).not.toHaveBeenCalled();
        });

        it("Shouldn't invoke an invalid callback", function () {
            personInterceptor.wrap('getName', callbacks.invalid);
            expect(person.getName()).toEqual('john');
            expect(callbacks.wrap).not.toHaveBeenCalled();
        });
    });

    describe("Inject method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
        });

        it("Should inject a method sayHello", function () {
            spyOn(callbacks, "injectSayHello").and.callThrough();
            personInterceptor.inject('sayHello', callbacks.injectSayHello);
            expect(person.sayHello).toBeDefined();
            expect(person.sayHello()).toEqual('hello');
            expect(callbacks.injectSayHello).toHaveBeenCalled;
        });

        it("Should inject a method randomName", function () {
            spyOn(callbacks, "injectRandomName").and.callThrough();
            personInterceptor.inject('randomName', callbacks.injectRandomName);
            expect(person.randomName(10)).toEqual(person);
            expect(person.getName().length).toEqual(10);
            expect(callbacks.injectRandomName).toHaveBeenCalled;
        });

        it("Shouldn't inject an existing property", function () {
            personInterceptor.inject('id', callbacks.injectSayHello);
            expect(typeof person.id).toEqual('number');
        });


        it("Shouldn't inject an existing method", function () {
            personInterceptor.inject('getName', callbacks.injectSayHello);
            expect(person.getName()).toEqual('john');
        });

        it("Shouldn't inject an invalid method", function () {
            spyOn(callbacks, "injectSayHello").and.callThrough();
            personInterceptor.inject('sayHello', callbacks.invalid);
            expect(person.sayHello).toBeUndefined();
        });
    });

    describe("Detach method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
        });

        it("Should detach a method sayHello", function () {
            spyOn(callbacks, "injectSayHello").and.callThrough();
            personInterceptor.inject('sayHello', callbacks.injectSayHello);
            expect(person.sayHello).toBeDefined();
            expect(person.sayHello()).toEqual('hello');
            expect(callbacks.injectSayHello).toHaveBeenCalled;
            personInterceptor.detach('sayHello');
            expect(person.sayHello).toBeUndefined();
        });
    });

    describe("Property method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
        });

        it("Should add a property", function () {
            personInterceptor.property('surname', 'Black');
            expect(person.surname).toBeDefined();
            expect(person.surname).toEqual('Black');
        });

        it("Should add a function return as a property", function () {
            personInterceptor.property('surname', callbacks.property);
            expect(person.surname).toBeDefined();
            expect(person.surname).toEqual('Nick');
        });

        it("Shouldn't add a function as a property", function () {
            personInterceptor.property(function () {
            }, 'value');
            expect(person.surname).toBeUndefined();
        });

        it("Shouldn't add a null property", function () {
            personInterceptor.property(null, 'value');
            expect(person.surname).toBeUndefined();
        });
    });

    describe("Property method", function () {
        var person, callbacks, personInterceptor;

        beforeEach(function () {
            person = new MockPerson('john');
            callbacks = new MockCallbacks();
            personInterceptor = new interceptor(person);
        });
    });

});