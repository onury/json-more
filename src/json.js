import helper from './helper';
import path from 'path';
import fs from 'graceful-fs';
import Promise from 'yaku';
import promisify from 'yaku/lib/promisify';
import stripJsonComments from 'strip-json-comments';
import safeStringify from 'json-stringify-safe';
import parseJSON from 'parse-json';
import stripBOM from 'strip-bom';
import mkdirp from 'mkdirp';

/**
 *  @private
 */
const promise = {
    readFile: promisify(fs.readFile, fs),
    writeFile: promisify(fs.writeFile, fs),
    mkdirp: promisify(mkdirp)
};

/**
 *  JSON utility class that provides extra functionality such as stripping
 *  comments, safely parsing JSON strings with circular references, etc...
 */
class json {

    /**
     *  Parses the given JSON string into a JavaScript object.
     *  This provides the same functionality with native `JSON.parse()` with
     *  some extra options.
     *
     *  @param {String} str - JSON string to be parsed.
     *  @param {Function|Object} [options]
     *         Either a reviver function or parse options object.
     *         @param {Function} [options.reviver=null]
     *                A function that can filter and transform the results.
     *                It receives each of the keys and values, and its return
     *                value is used instead of the original value.
     *                If it returns what it received, then the structure is not
     *                modified. If it returns undefined then the member is
     *                deleted.
     *         @param {Boolean} [options.stripComments=false]
     *                Whether to strip comments from the JSON string.
     *                Note that it will throw if this is set to `false` and
     *                the string includes comments.
     *         @param {Boolean} [options.safe=false]
     *                Whether to safely parse within a try/catch block return an
     *                `Error` instance if parse fails.
     *                If `safe` option set to `true`, comments are force-removed
     *                from the JSON string, regarless of the `stripComments`
     *                option.
     *
     *  @returns {*|Error} - Parsed value. If `safe` option is enabled, returns an
     *  `Error` instance.
     *
     *  @example
     *  var parsed = json.parse(str, { safe: true });
     *  if (parsed instanceof Error) {
     *      console.log('Parse failed:', parsed);
     *  } else {
     *      console.log(parsed);
     *  }
     */
    static parse(str, { reviver, stripComments = false, safe = false } = {}) {
        // CAUTION: don't use arrow for this method since we use `arguments`
        if (typeof arguments[1] === 'function') reviver = arguments[1];
        if (safe || stripComments) str = stripJsonComments(str);
        if (!safe) return parseJSON(str, reviver);
        try {
            return parseJSON(str, reviver);
        } catch (err) {
            return err;
        }
    }

    /**
     *  Outputs a JSON string from the given JavaScript object.
     *  This provides the same functionality with native `JSON.stringify()`
     *  with some extra options.
     *
     *  @param {*} value - JavaScript value to be stringified.
     *  @param {Object|Function|Array} [options]
     *         A replacer or stringify options.
     *         @param {Function|Array<String>} [options.replacer]
     *         Determines how object values are stringified for objects. It can
     *         be a function or an array of strings.
     *         @param {String|Number} [options.space]
     *         Specifies the indentation of nested structures. If it is omitted,
     *         the text will be packed without extra whitespace. If it is a
     *         number, it will specify the number of spaces to indent at each
     *         level. If it is a string (such as "\t" or "&nbsp;"), it contains
     *         the characters used to indent at each level.
     *         @param {Boolean|Function} [options.safe=false]
     *         Specifies whether to safely stringify the given object and
     *         return the string `"[Circular]"` for each circular reference.
     *         You can pass a custom decycler function instead, with the
     *         following signature: `function(k, v) { }`.
     *  @param {String|Number} [space]
     *         This takes effect if second argument is the `replacer` or falsy.
     *
     *  @returns {String}
     */
    static stringify(value, options, space) {
        let opts = helper.getStringifyOptions(options, space);
        let safe, decycler;
        if (opts.isObj) {
            decycler = typeof options.safe === 'function' ? safe : null;
            safe = Boolean(options.safe);
        }

        if (safe) return safeStringify(value, opts.replacer, opts.space, decycler);
        return JSON.stringify(value, opts.replacer, opts.space);
    }

    /**
     *  Uglifies the given JSON string.
     *  @param {String} str - JSON string to be uglified.
     *  @returns {String}
     */
    static uglify(str) {
        let o = parseJSON(stripJsonComments(str, { whitespace: false }));
        return JSON.stringify(o);
    }

    /**
     *  Beautifies the given JSON string.
     *  @param {String} str
     *         JSON string to be beautified.
     *  @param {String|Number} [space=2]
     *         Specifies the indentation of nested structures. If it is omitted,
     *         the text will be packed without extra whitespace. If it is a
     *         number, it will specify the number of spaces to indent at each
     *         level. If it is a string (such as "\t" or "&nbsp;"), it contains
     *         the characters used to indent at each level.
     *  @returns {String}
     */
    static beautify(str, space = 2) {
        let o = parseJSON(stripJsonComments(str, { whitespace: false }));
        return JSON.stringify(o, null, space);
    }

    /**
     *  Normalizes the given value by stringifying and parsing it back to a
     *  Javascript object.
     *  @param {*} value
     *  @param {Object|Function|Array} [options]
     *         A replacer or normalize options.
     *         @param {Function|Array<String>} [options.replacer]
     *         Determines how object values are normalized for objects. It can
     *         be a function or an array of strings.
     *         @param {Boolean|Function} [options.safe=false]
     *         Specifies whether to safely normalize the given object and
     *         return the string `"[Circular]"` for each circular reference.
     *         You can pass a custom decycler function instead, with the
     *         following signature: `function(k, v) { }`.
     *
     *  @returns {*}
     */
    static normalize(value, options) {
        return json.parse(json.stringify(value, options));
    }

    /**
     *  Asynchronously reads a JSON file, strips UTF-8 BOM and parses the JSON
     *  content.
     *  @param {String} filePath
     *         Path to JSON file.
     *  @param {Function|Object} [options]
     *         Either a reviver function or read options object.
     *         @param {Function} [options.reviver=null]
     *                A function that can filter and transform the results.
     *                It receives each of the keys and values, and its return
     *                value is used instead of the original value.
     *                If it returns what it received, then the structure is not
     *                modified. If it returns undefined then the member is
     *                deleted.
     *         @param {Boolean} [options.stripComments=false]
     *                Whether to strip comments from the JSON string.
     *                Note that it will throw if this is set to `false` and
     *                the string includes comments.
     *
     *  @returns {Promise<*>}
     *           Parsed JSON content as a JavaScript object.
     */
    static read(filePath, { reviver, stripComments = false } = {}) {
        // CAUTION: don't use arrow for this method since we use `arguments`
        if (typeof arguments[1] === 'function') reviver = arguments[1];
        return promise.readFile(filePath, 'utf8')
            .then(data => {
                if (stripComments) data = stripJsonComments(data);
                return parseJSON(stripBOM(data), reviver, filePath);
            });
    }

    /**
     *  Asynchronously writes a JSON file from the given JavaScript object.
     *  @param {String} filePath
     *         Path to JSON file to be written.
     *  @param {*} data
     *         Data to be stringified into JSON.
     *  @param {Object} [options]
     *         Stringify / write options or replacer function.
     *         @param {Function|Array<String>} [options.replacer]
     *                Determines how object values are stringified for objects. It can
     *                be a function or an array of strings.
     *         @param {String|Number} [options.space]
     *                Specifies the indentation of nested structures. If it is omitted,
     *                the text will be packed without extra whitespace. If it is a
     *                number, it will specify the number of spaces to indent at each
     *                level. If it is a string (such as "\t" or "&nbsp;"), it contains
     *                the characters used to indent at each level.
     *         @param {Number} [mode=438]
     *                FileSystem permission mode to be used when writing the file.
     *                Default is `438` (0666 in octal).
     *         @param {Boolean} [autoPath=true]
     *                Specifies whether to create path directories if they don't
     *                exist. This will throw if set to `false` and path does not
     *                exist.
     *  @returns {Promise<*>}
     */
    static write(filePath, data, { replacer, space, mode = 438, autoPath = true } = {}) {
        // CAUTION: don't use arrow for this method since we use `arguments`
        if (typeof arguments[2] === 'function') replacer = arguments[2];
        return Promise.resolve()
            .then(() => {
                if (autoPath) return promise.mkdirp(path.dirname(filePath), { fs });
            })
            .then(() => {
                let content = JSON.stringify(data, replacer, space);
                return promise.writeFile(filePath, `${content}\n`, {
                    mode,
                    encoding: 'utf8'
                });
            });
    }

}

// Deep methods

/**
 *  Convenience method for `parse()` with `safe` option enabled.
 *  @alias json.parseSafe
 */
json.parse.safe = function (str, { reviver } = {}) {
    if (typeof arguments[1] === 'function') reviver = arguments[1];
    return json.parse(str, { reviver, safe: true });
};

/**
 *  Synchronously reads a JSON file, strips UTF-8 BOM and parses the JSON
 *  content.
 *  @alias json.readSync
 *
 *  @param {String} filePath
 *         Path to JSON file.
 *  @returns {*|Error}
 *           Parsed JSON content as a JavaScript object.
 *           If parse fails, returns an `Error` instance.
 */
json.read.sync = function (filePath, { reviver, stripComments = false, safe = false } = {}) {
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[1] === 'function') reviver = arguments[1];
    let data = fs.readFileSync(filePath, 'utf8');
    if (safe || stripComments) data = stripJsonComments(data);
    if (!safe) return parseJSON(stripBOM(data), reviver, filePath);
    try {
        return parseJSON(stripBOM(data), reviver, filePath);
    } catch (err) {
        return err;
    }
};

/**
 *  Convenience method for `stringify()` with `safe` option enabled.
 *  You can pass a `decycler` function either within the `options` object
 *  or as the fourth argument.
 *  @alias json.stringifySafe
 */
json.stringify.safe = (value, options, space, decycler) => {
    let opts = helper.getStringifyOptions(options, space);
    if (opts.isObj) {
        decycler = options.decycler || decycler;
    }
    return safeStringify(value, opts.replacer, opts.space, decycler);
};

/**
 *  Synchronously writes a JSON file from the given JavaScript object.
 *  @alias json.writeSync
 *
 *  @param {String} filePath
 *         Path to JSON file to be written.
 *  @param {*} data
 *         Data to be stringified into JSON.
 *  @param {Object} [options]
 *         Stringify / write options or replacer function.
 *         @param {Function|Array<String>} [options.replacer]
 *                Determines how object values are stringified for objects. It can
 *                be a function or an array of strings.
 *         @param {String|Number} [options.space]
 *                Specifies the indentation of nested structures. If it is omitted,
 *                the text will be packed without extra whitespace. If it is a
 *                number, it will specify the number of spaces to indent at each
 *                level. If it is a string (such as "\t" or "&nbsp;"), it contains
 *                the characters used to indent at each level.
 *         @param {Number} [mode=438]
 *                FileSystem permission mode to be used when writing the file.
 *                Default is `438` (0666 in octal).
 *         @param {Boolean} [autoPath=true]
 *                Specifies whether to create path directories if they don't
 *                exist. This will throw if set to `false` and directory path
 *                does not exist.
 *  @returns {void}
 */
json.write.sync = function (filePath, data, { replacer, space, mode = 438, autoPath = true } = {}) {
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[2] === 'function') replacer = arguments[2];
    if (autoPath) mkdirp.sync(path.dirname(filePath), { fs });
    let content = JSON.stringify(data, replacer, space);
    return fs.writeFileSync(filePath, `${content}\n`, {
        mode,
        encoding: 'utf8'
    });
};

// Generate logger methods

['log', 'info', 'warn', 'error'].forEach(fn => {
    json[fn] = helper.getLogger(fn);
    json[fn].pretty = json[fn + 'Pretty'] = helper.getLogger(fn, true);
});

// Aliases

/**
 *  @private
 */
json.parseSafe = json.parse.safe;
/**
 *  @private
 */
json.stringifySafe = json.stringify.safe;
/**
 *  @private
 */
json.writeSync = json.write.sync;
/**
 *  @private
 */
json.readSync = json.read.sync;

// Export

export default json;
