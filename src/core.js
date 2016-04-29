import Traverser from './traverser.js'
import Observer from './observer.js'

/**
 * RaziloBind Binding Library
 * Offers View-Model binding between js object and html view
 */
export default class Core {
    constructor(options) {
		// set up
		this.options = typeof options !== 'undefined' ? options : {};
        this.options.prefix = typeof this.options.prefix !== 'undefined' ? this.options.prefix + '-' : '';
	}

	bind(element, object) {
		element = typeof element === 'string' ? document.querySelector(element) : element;
		if (!element) throw "Element not found, cannot bind to non-element";

		// set basics
		element.razilobind = this;
        this.model = Observer.object(object, this.update.bind(this), true);
        this.element = element;

		// iterate over nodes
		this.traverser = new Traverser(this.options);
		this.traverser.traverse(this.element, this.model, this.object);
	}

    update(path, oldV, newV) {
		var action = 'update';
		var pathParts = path.split('.');
		var pathEnd = pathParts[pathParts.length -1];

		// sort out arrys and objects
		if (pathEnd === 'length')
		{
			// convert .lengths to parent updates
			action = oldV > newV ? 'array-remove' : 'array-add';
			path = path.substring(0, path.length - pathEnd.length -1);
		}
		else if (typeof oldV === 'undefined' || typeof newV === 'undefined')
		{
			var model = this.model;
			for (let i = 0; i < pathParts.length - 1; i++) model = model[pathParts[i]];

			// if parent is object, also fire parent update and allow original to continue
			if (typeof model.length === 'undefined')
			{
				var xPath = path.substring(0, path.length - pathEnd.length -1);
				var xAction = typeof oldV === 'undefined' ? 'object-add' : 'object-remove';
				if (typeof this.traverser.observables[xPath] !== 'undefined') for (let key in this.traverser.observables[xPath]) this.traverser.observables[xPath][key].update(oldV, xPath, xAction, pathEnd);
			}
		}

		if (typeof this.traverser.observables[path] !== 'undefined') for (let key in this.traverser.observables[path]) this.traverser.observables[path][key].update(oldV, path, action);
	}
}
