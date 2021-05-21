'use strict';
//
module.exports = {
    btoa: (decoded) => {
        if (Array.isArray(decoded)) return Buffer.from(decoded.join(','), 'binary').toString('base64').replace(/=.*$/, '');
        return Buffer.from(decoded, 'binary').toString('base64').replace(/=.*$/, '');
    },
    atob: (b64Encoded) => {
        return Buffer.from(b64Encoded, 'base64').toString('utf8');
    },
    // https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf
    get: (object, path, defaultValue = undefined) => {
        return String(path)
            .split('.')
            .reduce((acc, v) => {
                try {
                    acc = acc[v] !== undefined && acc[v] !== null ? acc[v] : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
                return acc;
            }, object);
    },
    isNumeric: (string) => {
        return !isNaN(parseFloat(string)) && isFinite(string);
    },
    isObject: (item) => {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    mergeDeep: function (target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.mergeDeep(target, ...sources);
    },
    // sources shoud return array of objects, null or undefined
    replaceDeep: function (target, keyToReplace, sources) {
        Object.keys(target).forEach((key) => {
            // passes if sources returns empty array, should return undefined or null to avoid
            if (key === keyToReplace && sources(target[key])) {
                Object.assign(target, ...sources(target[key]));
                delete target[key];
                // key found, replaced, the result may also include a keyToReplace so start over
                return this.replaceDeep(target, keyToReplace, sources);
            } else if (target[key] && typeof target[key] === 'object') {
                this.replaceDeep(target[key], keyToReplace, sources);
            }
        });
        return target;
    },
    // sources shoud return array of objects, null or undefined
    parseDeep: function (target, keyToParse, sources) {
        Object.keys(target).forEach((key) => {
            // if sources returns empty array the target.key will result an empty object
            if (key === keyToParse) {
                target[key] = Object.assign({}, ...sources(target[key]));
            } else if (target[key] && typeof target[key] === 'object') {
                this.parseDeep(target[key], keyToParse, sources);
            }
        });
        return target;
    },
    areEqualObjects: (a, b) => {
        let s = (o) =>
            Object.entries(o)
                .sort()
                .map((i) => {
                    if (i[1] instanceof Object) i[1] = s(i[1]);
                    return i;
                });
        return JSON.stringify(s(a)) === JSON.stringify(s(b));
    },
    parseQueryString: function (queryString, asArray) {
        let result = asArray ? [] : {};
        if (!queryString) return result;
        queryString = decodeURI(queryString).replace(/^\?/g, '');
        let params = queryString.split('&');
        if (params.length > 0) {
            for (let i = 0; i < params.length; i++) {
                let args = params[i].split('=');
                if (args[1] === undefined) {
                    result[args[0]] = true;
                } else if (this.isNumeric(args[1])) {
                    result[args[0]] = parseFloat(args[1]);
                } else if (args[1].includes(',')) {
                    result[args[0]] = args[1].split(',');
                } else {
                    result[args[0]] = args[1];
                }
            }
        }
        return result;
    },
    queryStringify: (object) => {
        return Object.keys(object)
            .map((key) => (object[key] == 'true' ? key : key + '=' + object[key]))
            .join('&');
    },
    mergeQueryStrings: function (initial, upserts) {
        if (typeof upserts === 'string') {
            return this.queryStringify(Object.assign(this.parseQueryString(initial), this.parseQueryString(upserts)));
        } else if (typeof upserts === 'object') {
            return this.queryStringify(Object.assign(this.parseQueryString(initial), upserts));
        }
    },
    stringToDecimalUnicodePoints: (string) => {
        if (typeof string !== 'string') return [];
        return string.split('').map((char) => char.charCodeAt(0));
    },
    decimalUnicodePointsToString: (unicodePoints) => {
        if (!(unicodePoints instanceof Array)) return '';
        return unicodePoints.map((i) => String.fromCharCode(i)).join('');
    },
    //<!-- Capitalize -->
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    //<!-- Camelcase array of strings -->
    camelcaseStringArray: function (array) {
        if (array.constructor !== Array) return null;
        let result = array[0].toLowerCase();
        for (let i = 1; i < array.length; i++) {
            result += this.capitalizeFirstLetter(array[i].toLowerCase());
        }
        return result;
    },
    sleep: (milliseconds) => {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if (new Date().getTime() - start > milliseconds) {
                break;
            }
        }
    },
    microtime: (getAsFloat) => {
        var s, now, multiplier;
        if (typeof performance !== 'undefined' && performance.now) {
            now = (performance.now() + performance.timing.navigationStart) / 1000;
            multiplier = 1e6; // 1,000,000 for microseconds
        } else {
            now = Date.now ? Date.now() / 1000 : Math.floor(new Date().getTime() / 1000.0);
            multiplier = 1e3; // 1,000
        }
        // Getting microtime as a float is easy
        if (getAsFloat) {
            return now;
        }
        // Dirty trick to only get the integer part
        s = now | 0;
        return Math.round((now - s) * multiplier) / multiplier + ' ' + s;
    },
    generateUUID: () => {
        // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 = typeof performance !== 'undefined' && typeof performance.now !== 'undefined' ? performance.now() * 1000 : 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) {
                //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    },
};
