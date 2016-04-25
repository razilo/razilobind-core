export default class Observer {
	static object(obj, fn, deep, prefix) {
		if (typeof this.object === 'undefined') this.object = obj;
		prefix = typeof prefix === 'undefined' ? '' : prefix;
		return new Proxy(obj, {
			set: function(target, prop, value) {
				let old = target[prop];
				target[prop] = value;
				// if (prop == 'length' && !isNaN(old) && !isNaN(value) && (value == old -1 || value == old)) fn(prefix.indexOf('.') == prefix.length -1 ? prefix.substring(0, prefix.length -1) : prefix, old, value);
				// else fn(prefix + prop, old, value);
				fn(prefix + prop, old, value);
				return true;
			},
			get: function(target, prop) {
				let val = target[prop];
				if (!!deep && val instanceof Object) return Observer.object(val, fn, deep, prefix + prop + '.');
				return val;
			}
		});
	}
}
