import safeStringify from 'json-stringify-safe';

const helper = {
    isPrimitive(value) {
        let t = typeof value;
        return value === null
                || value === undefined
                || (t !== 'function' && t !== 'object');
    },

    strLog(value, pretty = false) {
        if (helper.isPrimitive(value)) return value;
        let s = pretty ? '  ' : null;
        return safeStringify(value, null, s);
    },

    getLogger(fn, pretty = false) {
        if (fn === 'error') {
            return (...args) => {
                console.log(...(args.map(arg => {
                    return arg instanceof Error
                        ? arg.stack || arg.message || String(arg)
                        : helper.strLog(arg, pretty);
                })));
            };
        }
        return (...args) => {
            console.log(...(args.map(arg => helper.strLog(arg, pretty))));
        };
    },

    getStringifyOptions(options, indent) {
        let replacer, space,
            isObj = false;

        if (!options) {
            replacer = null;
            space = indent;
        } else if (typeof options === 'function' || Array.isArray(options)) {
            replacer = options;
            space = indent;
        } else if (typeof options === 'object') {
            replacer = options.replacer;
            space = options.indent;
            isObj = true;
        }

        return {
            replacer,
            space,
            isObj
        };
    }

};

export default helper;
