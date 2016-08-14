/**
 * Date Alterer
 * Alters various data to a date string in (options) format
 *
 * Inspired by dateFormat https://github.com/felixge/node-dateformat/blob/master/lib/dateformat.js by Steven Levithan <stevenlevithan.com>
 *
 * Inherits
 *
 * properties: name, accepts, options
 * method: detect(name, resolved) { return bool }
 *
 * PORTED FROM: dateFormat https://github.com/felixge/node-dateformat/blob/master/lib/dateformat.js
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
export default class DateFormat {
	static dateFormat(date, mask, utc, gmt) {
		var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
		var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
		var timezoneClip = /[^-+\dA-Z]/g;

		var masks = {
			'default':               'ddd mmm dd yyyy HH:MM:ss',
			'shortDate':             'm/d/yy',
			'mediumDate':            'mmm d, yyyy',
			'longDate':              'mmmm d, yyyy',
			'fullDate':              'dddd, mmmm d, yyyy',
			'shortTime':             'h:MM TT',
			'mediumTime':            'h:MM:ss TT',
			'longTime':              'h:MM:ss TT Z',
			'isoDate':               'yyyy-mm-dd',
			'isoTime':               'HH:MM:ss',
			'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
			'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
			'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
		};

		var i18n = {
			dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		};

        mask = String(masks[mask] || mask || masks['default']);

        // Allow setting the utc/gmt argument via the mask
        var maskSlice = mask.slice(0, 4);
        if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
        	mask = mask.slice(4);
        	utc = true;
        	if (maskSlice === 'GMT:') gmt = true;
        }

        var _ = utc ? 'getUTC' : 'get';
        var d = date[_ + 'Date']();
        var D = date[_ + 'Day']();
        var m = date[_ + 'Month']();
        var y = date[_ + 'FullYear']();
        var H = date[_ + 'Hours']();
        var M = date[_ + 'Minutes']();
        var s = date[_ + 'Seconds']();
        var L = date[_ + 'Milliseconds']();
        var o = utc ? 0 : date.getTimezoneOffset();
        var W = DateFormat.getWeek(date);
        var N = DateFormat.getDayOfWeek(date);
        var flags = {
			d:    d,
			dd:   DateFormat.pad(d),
			ddd:  i18n.dayNames[D],
			dddd: i18n.dayNames[D + 7],
			m:    m + 1,
			mm:   DateFormat.pad(m + 1),
			mmm:  i18n.monthNames[m],
			mmmm: i18n.monthNames[m + 12],
			yy:   String(y).slice(2),
			yyyy: y,
			h:    H % 12 || 12,
			hh:   DateFormat.pad(H % 12 || 12),
			H:    H,
			HH:   DateFormat.pad(H),
			M:    M,
			MM:   DateFormat.pad(M),
			s:    s,
			ss:   DateFormat.pad(s),
			l:    DateFormat.pad(L, 3),
			L:    DateFormat.pad(Math.round(L / 10)),
			t:    H < 12 ? 'a'  : 'p',
			tt:   H < 12 ? 'am' : 'pm',
			T:    H < 12 ? 'A'  : 'P',
			TT:   H < 12 ? 'AM' : 'PM',
			Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
			o:    (o > 0 ? '-' : '+') + DateFormat.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
			W:    W,
			N:    N
        };

        return mask.replace(token, function (match) {
        	if (match in flags) return flags[match];
            return match.slice(1, match.length - 1);
        });
    }

	/**
	 * Get the ISO 8601 week number
	 * Based on comments from
	 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
	 *
	 * @param  {Object} `date`
	 * @return {Number}
	 */
	static getWeek(date) {
	  // Remove time components of date
	  var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	  // Change date to Thursday same week
	  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

	  // Take January 4th as it is always in week 1 (see ISO 8601)
	  var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

	  // Change date to Thursday same week
	  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

	  // Check if daylight-saving-time-switch occured and correct for it
	  var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
	  targetThursday.setHours(targetThursday.getHours() - ds);

	  // Number of weeks between target Thursday and first Thursday
	  var weekDiff = (targetThursday - firstThursday) / (86400000*7);
	  return 1 + Math.floor(weekDiff);
	}

	/**
	 * Get ISO-8601 numeric representation of the day of the week
	 * 1 (for Monday) through 7 (for Sunday)
	 *
	 * @param  {Object} `date`
	 * @return {Number}
	 */
	static getDayOfWeek(date) {
		var dow = date.getDay();
		if (dow === 0) dow = 7;
		return dow;
	}

	static pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = '0' + val;
  		return val;
	}
}
