import Detector from './detector.js'

export default class Traverser {
    constructor(options) {
		this.options = options;
		this.observables = {};
    }

	traverse(element, model) {
        // check for binders and build observables map
        var binders = Detector.binders(element, model, this.options, this);

		// compile binders into a watch list (one binder instance only per element)
        if (binders.length > 0)
        {
            for (var i = 0; i < binders.length; i++) {
                if (binders[i].observables.length > 0)
                {
                    for (let ii = 0; ii < binders[i].observables.length; ii++)
                    {
                        let path = binders[i].observables[ii];
                        if (typeof this.observables[path] === 'undefined') this.observables[path] = {};
                        this.observables[path][binders[i].id] = binders[i];
                    }
                }
            }
        }

		// do not traverse parent elements with flag set, accept root binded elements
		// if (!!element.hasAttribute && element.hasAttribute('no-traverse') && !element.razilovm) return;
		if (!!element.hasAttribute && element.hasAttribute('no-traverse')) return;

        // always go deep! <o_0>
		if (element.childNodes) {
			for (let i = 0; i <  element.childNodes.length; i++) this.traverse(element.childNodes[i], model);
		}
	}
}
