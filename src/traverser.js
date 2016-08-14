import Detector from './detector.js'

export default class Traverser {
    constructor(options) {
		this.options = options;
		this.observables = {};
    }

	traverse(element, model, initial) {
		// check for binders and build observables map
        var binders = this.options.noParentBind && initial ? [] : Detector.binders(element, model, this.options, this);

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

        // go deep! <o_0>
		if (element.childNodes) {
			for (let i = 0; i <  element.childNodes.length; i++)
			{
				// skip those not wanting to be traversed
				if (!!element.childNodes[i].parentNode.hasAttribute('no-traverse')) continue;
				this.traverse(element.childNodes[i], model);
			}
		}
	}
}
