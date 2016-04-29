export default class Observer {
	static object(obj, fn, deep, prefix) {
		if (typeof this.object === 'undefined') this.object = obj;
		prefix = typeof prefix === 'undefined' ? '' : prefix;
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
}
