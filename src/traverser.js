import Detector from './detector.js'

export default class Traverser {
    constructor(options) {
		this.options = options;
		this.observables = {};
    }

	traverse(element, model, initial) {
		// check for binders and build observables map
        let binders = this.options.noParentBind && initial ? [] : Detector.binders(element, model, this.options, this);

		// compile binders into a watch list (one binder instance only per element)
        if (binders.length > 0)
        {
            for (let i = 0; i < binders.length; i++) {
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

        this.goDeep(element, model);
	}

    goDeep(element, model) {
        // go deep! <o_0> Make sure we do not do this for loops (bind-for) as they will traverse
        // themselves to stop stale binding bug on placeholder instead of parent looped results
		if (element.childNodes && !element.hasAttribute('bind-for')) {
			for (let i = 0; i <  element.childNodes.length; i++)
			{
				if (element.childNodes[i].nodeType !== 1) continue;
				this.traverse(element.childNodes[i], model);
			}
		}
    }
}
