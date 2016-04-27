# raziloBind - Core ES6 JS/HTML Binding Library

## What is raziloBind?


ES6 JS/HTML binding library for creating dynamic web applications through HTML attribute binding. Made up of 4 libraries, puled in via a parent package that pulls in all required parts and configures as importable ES6 module 'RaziloBind'.

* **[https://github.com/smiffy6969/razilobind-core](razilobind-core)** *(the main part)*, to traverse, detect and observe.
* **[https://github.com/smiffy6969/razilobind-binder](razilobind-binder) [injectables]** *(the actual binders)*, binding object properties to elements to do various things.
* **[https://github.com/smiffy6969/razilobind-resolver](razilobind-resolver) [injectables]** *(to parse attribute data)*, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[https://github.com/smiffy6969/razilobind-alterer](razilobind-alterer) [injectables]** *(to change things)*, altering resolved data to something else without affecting the model.

This package **razilobind-core**, is the base functionality that binds, observes, traverses and detects, allowing injectables to be used on dom elements.


## What is the Core For?


The core is the basic part of the tool, it allows us to configure the tool with the right amount of injectables (binders, alterers and resolvers), set any options and return an instance of the core for us to bind a dom element and js object model to.


## Why is it Seperate?


Because it's modular, it allows you to extend the core to auto configure (as we do in razilobind package). It also allows you to build your own core, fork this one and still use the injectables. It is much more flexible to do it this way.


## Usage


The recommended way to use core, is through the [https://github.com/smiffy6969/razilobind](smiffy6969/razilobind) package. This will give you the standard use and configure the tool with default injectables. This will also expose the library as razilobind as it extends this package and does the required config. Another addation in the parent package is the addition of the functions to load in custom binders directly (or pull in your own via imports). Should you wish to have more control, you can use this module directly and configure the core as you want it in your project as so...


Pull in the module...

```
npm install razilobind-core razilobind-alterer razilobind-binder razilobind-resolver
```

Use the module, oldy worldy (BUT ES6 COMPILED!)...

```javascript
import {RaziloBindCore, RaziloBindCoreDetector} from 'razilobind-core'
import {RaziloBindTrimAlterer, ...} from 'razilobind-alterer'
import {RaziloBindForBinder, ...} from 'razilobind-binder'
import {RaziloBindBooleanResolver, ...} from 'razilobind-resolver'

// Inject injectables, pull in what you need!
RaziloBindCoreDetector.defaultAlterers = {TrimAlterer: RaziloBindTrimAlterer, ...};
RaziloBindCoreDetector.defaultBinders = {ForBinder: RaziloBindForBinder, ...};
RaziloBindCoreDetector.defaultResolvers = {BooleanResolver: RaziloBindBooleanResolver, ...};

// Create a model
var model = {foo: 'foo', bar: 'bar'};

// Bind
var rb = new RaziloBindCore({prefix: 'raz'});
rb.bind('#test', model);
```

Or use the module, OO style, create a new class to extend the core...

```javascript
import {RaziloBindCore, RaziloBindCoreDetector} from 'razilobind-core'
import {RaziloBindTrimAlterer, ...} from 'razilobind-alterer'
import {RaziloBindForBinder, ...} from 'razilobind-binder'
import {RaziloBindBooleanResolver, ...} from 'razilobind-resolver'

export default class YourProjectBind extends RaziloBindCore {
    constructor(options) {
		super(options);

		// Inject injectables, pull in what you need!
		RaziloBindCoreDetector.defaultAlterers = {TrimAlterer: RaziloBindTrimAlterer, ...};
		RaziloBindCoreDetector.defaultBinders = {ForBinder: RaziloBindForBinder, ...};
		RaziloBindCoreDetector.defaultResolvers = {BooleanResolver: RaziloBindBooleanResolver, ...};
	}
}
```

Then import that in and use that!

```javascript
import YourProjectBind from 'your-project-bind'

// Create a model
var model = {foo: 'foo', bar: 'bar'};

// Bind
var yp = new YourProjectBind({prefix: 'raz'});
yp.bind('#test', model);
```


Do some binding in HTML

```html
<span raz-bind-text="foo"></span>
```

## Configuration


At present there is only one configuration option, that is to prefix or not to prefix (that is the question!). Prefix all razilobind attributes with teh following passed into core directly or parent package on instanciation.


```javascript
var foo = new RaziloBindCore({prefix: 'foo'});
```

... will require foo- to be used in front of all razilobind attributes.


## What Injectables do I Need?


Thats up to you and what you want to do, I would recommend pulling in te parent package as the default binders will offer a level of standard functionality, things you should need. To find out what injectables are available, head on over to the following places.

* **[https://github.com/smiffy6969/razilobind-binder](razilobind-binder)**, binding object properties to elements to do various things.
* **[https://github.com/smiffy6969/razilobind-resolver](razilobind-resolver)**, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[https://github.com/smiffy6969/razilobind-alterer](razilobind-alterer)**, altering resolved data to something else without affecting the model.


## Can I Create my own Injectables?


Sure, why not, you even get to choose how to inject them, if you want the default ones or just your own. You can do this by directly adding them to razilobind, or by injecting them into razilobind-core if you are extending core with your own module. See the necessary area listed above for details on how to create and inject binders, resolvers and alterers. 
