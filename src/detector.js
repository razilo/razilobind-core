export default class Detector {
	/**
	 * Choose binders for the data found when iterating over element bindables
	 * Some binders will not allow other binders to be found, such as any binder that
	 * creates it own insance e.g. for loops, as they are generated on the fly.
	 * return array of binders
	 */
	static binders(node, model, options, traverser) {
		if (!Detector.defaultBinders || typeof Detector.defaultBinders !== 'object') return;

		let binders = [];
		for (let name in Detector.defaultBinders) {
			let binder = new Detector.defaultBinders[name](options, traverser);
			if (binder.detect(node)) binders.push(binder.build(model));
		}

		if (Detector.customBinders && typeof Detector.customBinders === 'object')
		{
			for (let name in Detector.customBinders) {
				let binder = new Detector.customBinders[name](options, traverser);
				if (binder.detect(node)) binders.push(binder.build(model));
			}
		}

		return binders;
	}

	/**
	 * Run alterers found in resolved alterable data
	 * return resolved The altered resolved data
	 */
	static alterers(alterers, resolved) {
		if (typeof alterers === 'undefined') return false;
		if (typeof alterers !== 'object') alterers = [alterers];

		for (let key in alterers)
		{
			let name = isNaN(key) ? key : alterers[key];
			let options = isNaN(key) ? alterers[key] : undefined;

			if (!Detector.defaultAlterers || typeof Detector.defaultAlterers !== 'object') continue;

			for (let key in Detector.defaultAlterers)
			{
				let alterer = new Detector.defaultAlterers[key]();
				if (alterer.detect(name, resolved)) resolved = alterer.alter(resolved, options);
			}

			if (Detector.customAlterers && typeof Detector.customAlterers === 'object')
			{
				for (let name in Detector.customAlterers)
				{
					let alterer = new Detector.customAlterers[name]();
					if (alterer.detect(name, resolved)) resolved = alterer.alter(resolved, options);
				}
			}
		}

		return resolved;
	}

	/**
	 * Choose a single resolver for data found when iterating over elements. Can be used for any element attribute data
	 * return Resolver resolver or bool false on fail
	 */
	static resolver(data, node) {
		if (typeof data === 'undefined' || data.length < 1) return false;
		if (!Detector.defaultResolvers || typeof Detector.defaultResolvers !== 'object') return false;

		for (let name in Detector.defaultResolvers) {
			let resolver = new Detector.defaultResolvers[name](node);
			if (resolver.detect(data)) return resolver;
		}

		if (Detector.customResolvers && typeof Detector.customResolvers === 'object')
		{
			for (let name in Detector.customResolvers) {
				let resolver = new Detector.customResolvers[name](node);
				if (resolver.detect(data)) return resolver;
			}
		}

		// failed to resolve
		return false;
	}
}
