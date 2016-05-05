export default class Observer {
	/**
	 * object()
	 * Observe an object, applying a callback if changed
	 * This method uses native Proxy available for clean observing, returning proxied object
     *
	 * NOTE:
	 * If native proxy not available, proxy will be polyfilled and fallback to object observe polyfill for observing
	 * and proxy polyfill for those who  want to use it (caveat, proxy polyfill does not allow mutating of arrays) To change a polyfilled proxy
	 * you will have to replace whole array. This is why we fall back to OO polyfill for observing but allow you to still use Proxy polyfill
	 * if you want to for your app with this caveat.
	 *
	 * DEPS:
	 * This class relies on the smiffy6969/proxy-oo-polyfill (npm install proxy-oo-polyfill) for hybrid proxy with oo observing.
	 *
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 * @return Object The proxied object
	 */
	static object(obj, fn, deep, prefix) {
		if (!Proxy.oo) return Observer.proxy(obj, fn, deep, prefix);
		Observer.oo(obj, fn, deep, prefix);
		return obj;
	}

	/**
	 * proxy()
	 *
	 * Use native proxy to extend object model, allowing us to observe changes and instigate callback on changes
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 * @return Object The proxied object
	 */
	static proxy(obj, fn, deep, prefix) {
		prefix = typeof prefix === 'undefined' ? '' : prefix;
		if (typeof this.object === 'undefined') this.object = obj;
		return new Proxy(obj, {
			set: function(target, prop, value) {
				let old = target[prop];
				target[prop] = value;
				fn(prefix + prop, old, value);
				return true;
			},
			get: function(target, prop) {
				let val = target[prop];
				if (!!deep && val instanceof Object && typeof prop === 'string') return Observer.object(val, fn, deep, prefix + prop + '.');
				return val;
			}
		});
	}

	/**
	 * oo()
	 *
	 * Fallback observing method to allow us to watch changes on object without native proxy
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 */
	static oo(obj, fn, deep, prefix) {
		prefix = typeof prefix === 'undefined' ? '' : prefix;
		Proxy.oo.observe(obj, function(changes) {
			for (let i = 0; i < changes.length; i++)
			{
				fn(prefix + changes[i].name, obj[changes[i].name], changes[i].oldValue, changes[i].type);
				if (changes[i].type == 'add' && !!deep && obj[changes[i].name] && typeof obj[changes[i].name] === 'object') Observer.oo(obj[changes[i].name], fn, deep, prefix + changes[i].name + '.');
			}
		});
		for (var name in obj) if (!!deep && obj[name] && typeof obj[name] === 'object') Observer.oo(obj[name], fn, deep, prefix + name + '.');
	}
}
