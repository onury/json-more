'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _helper = require('./helper');var _helper2 = _interopRequireDefault(_helper);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _gracefulFs = require('graceful-fs');var _gracefulFs2 = _interopRequireDefault(_gracefulFs);
var _yaku = require('yaku');var _yaku2 = _interopRequireDefault(_yaku);
var _promisify = require('yaku/lib/promisify');var _promisify2 = _interopRequireDefault(_promisify);
var _stripJsonComments = require('strip-json-comments');var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);
var _jsonStringifySafe = require('json-stringify-safe');var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);
var _parseJson = require('parse-json');var _parseJson2 = _interopRequireDefault(_parseJson);
var _stripBom = require('strip-bom');var _stripBom2 = _interopRequireDefault(_stripBom);
var _mkdirp = require('mkdirp');var _mkdirp2 = _interopRequireDefault(_mkdirp);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

/**
                                                                                                                                                                                                                                                                                                                                   *  @private
                                                                                                                                                                                                                                                                                                                                   */
var promise = {
    readFile: (0, _promisify2.default)(_gracefulFs2.default.readFile, _gracefulFs2.default),
    writeFile: (0, _promisify2.default)(_gracefulFs2.default.writeFile, _gracefulFs2.default),
    mkdirp: (0, _promisify2.default)(_mkdirp2.default) };


/**
                                                           *  JSON utility class that provides extra functionality such as stripping
                                                           *  comments, safely parsing JSON strings with circular references, etc...
                                                           */var
json = function () {function json() {_classCallCheck(this, json);}_createClass(json, null, [{ key: 'parse',

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
                                                                                                             *         @param {Boolean} [options.whitespace=true]
                                                                                                             *                Whether to leave whitespace in place of stripped comments.
                                                                                                             *                This only takes effect if `options.stripComments` is set
                                                                                                             *                to `true`.
                                                                                                             *
                                                                                                             *  @returns {*}
                                                                                                             */value: function parse(
        str) {var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref.reviver,_ref$stripComments = _ref.stripComments,stripComments = _ref$stripComments === undefined ? false : _ref$stripComments,_ref$whitespace = _ref.whitespace,whitespace = _ref$whitespace === undefined ? true : _ref$whitespace;
            // CAUTION: don't use arrow for this method since we use `arguments`
            if (typeof arguments[1] === 'function') reviver = arguments[1];
            if (stripComments) str = (0, _stripJsonComments2.default)(str, { whitespace: whitespace });
            return (0, _parseJson2.default)(str, reviver);
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
           */ }, { key: 'stringify', value: function stringify(
        value, options, space) {
            var opts = _helper2.default.getStringifyOptions(options, space);
            var safe = void 0,decycler = void 0;
            if (opts.isObj) {
                decycler = typeof options.safe === 'function' ? safe : null;
                safe = Boolean(options.safe);
            }

            if (safe) return (0, _jsonStringifySafe2.default)(value, opts.replacer, opts.space, decycler);
            return JSON.stringify(value, opts.replacer, opts.space);
        }

        /**
           *  Uglifies the given JSON string.
           *  @param {String} str - JSON string to be uglified.
           *  @returns {String}
           */ }, { key: 'uglify', value: function uglify(
        str) {
            var o = (0, _parseJson2.default)((0, _stripJsonComments2.default)(str, { whitespace: false }));
            return JSON.stringify(o);
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
           *         @param {Boolean} [options.whitespace=true]
           *                Whether to leave whitespace in place of stripped comments.
           *                This only takes effect if `options.stripComments` is set
           *                to `true`.
           *  @returns {Promise<*>}
           *           Parsed JSON content as a JavaScript object.
           */ }, { key: 'read', value: function read(
        filePath) {var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref2.reviver,_ref2$stripComments = _ref2.stripComments,stripComments = _ref2$stripComments === undefined ? false : _ref2$stripComments,_ref2$whitespace = _ref2.whitespace,whitespace = _ref2$whitespace === undefined ? true : _ref2$whitespace;
            // CAUTION: don't use arrow for this method since we use `arguments`
            if (typeof arguments[1] === 'function') reviver = arguments[1];
            return promise.readFile(filePath, 'utf8').
            then(function (data) {
                if (stripComments) data = (0, _stripJsonComments2.default)(data, { whitespace: whitespace });
                return (0, _parseJson2.default)((0, _stripBom2.default)(data), reviver, filePath);
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
           */ }, { key: 'write', value: function write(
        filePath, data) {var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},replacer = _ref3.replacer,space = _ref3.space,_ref3$mode = _ref3.mode,mode = _ref3$mode === undefined ? 438 : _ref3$mode,_ref3$autoPath = _ref3.autoPath,autoPath = _ref3$autoPath === undefined ? true : _ref3$autoPath;
            // CAUTION: don't use arrow for this method since we use `arguments`
            if (typeof arguments[2] === 'function') replacer = arguments[2];
            return _yaku2.default.resolve().
            then(function () {
                if (autoPath) return promise.mkdirp(_path2.default.dirname(filePath), { fs: _gracefulFs2.default });
            }).
            then(function () {
                var content = JSON.stringify(data, replacer, space);
                return promise.writeFile(filePath, content + '\n', {
                    mode: mode,
                    encoding: 'utf8' });

            });
        } }]);return json;}();

;

// Deep methods

/**
 *  Convenience method for `stringify()` with `safe` option enabled.
 *  You can pass a `decycler` function either within the `options` object
 *  or as the fourth argument.
 *  @alias json.stringifySafe
 */
json.stringify.safe = function (value, options, space, decycler) {
    var opts = _helper2.default.getStringifyOptions(options, space);
    if (opts.isObj) {
        decycler = options.decycler || decycler;
    }

    return (0, _jsonStringifySafe2.default)(value, opts.replacer, opts.space, decycler);
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
json.write.sync = function (filePath, data) {var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},replacer = _ref4.replacer,space = _ref4.space,_ref4$mode = _ref4.mode,mode = _ref4$mode === undefined ? 438 : _ref4$mode,_ref4$autoPath = _ref4.autoPath,autoPath = _ref4$autoPath === undefined ? true : _ref4$autoPath;
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[2] === 'function') replacer = arguments[2];
    if (autoPath) _mkdirp2.default.sync(_path2.default.dirname(filePath), { fs: _gracefulFs2.default });
    var content = JSON.stringify(data, replacer, space);
    return _gracefulFs2.default.writeFileSync(filePath, content + '\n', {
        mode: mode,
        encoding: 'utf8' });

};

/**
    *  Synchronously reads a JSON file, strips UTF-8 BOM and parses the JSON
    *  content.
    *  @alias json.readSync
    *
    *  @param {String} filePath
    *         Path to JSON file.
    *  @returns {*}
    *           Parsed JSON content as a JavaScript object.
    */
json.read.sync = function (filePath) {var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref5.reviver,_ref5$stripComments = _ref5.stripComments,stripComments = _ref5$stripComments === undefined ? false : _ref5$stripComments,_ref5$whitespace = _ref5.whitespace,whitespace = _ref5$whitespace === undefined ? true : _ref5$whitespace;
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[1] === 'function') reviver = arguments[1];
    var data = _gracefulFs2.default.readFileSync(filePath, 'utf8');
    if (stripComments) data = (0, _stripJsonComments2.default)(data, { whitespace: whitespace });
    return (0, _parseJson2.default)((0, _stripBom2.default)(data), reviver, filePath);
};

// Generate logger methods

['log', 'info', 'warn', 'error'].forEach(function (fn) {
    json[fn] = _helper2.default.getLogger(fn);
    json[fn].pretty = json[fn + 'Pretty'] = _helper2.default.getLogger(fn, true);
});

// Aliases

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
exports.default =
json;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uLmpzIl0sIm5hbWVzIjpbInByb21pc2UiLCJyZWFkRmlsZSIsIndyaXRlRmlsZSIsIm1rZGlycCIsImpzb24iLCJzdHIiLCJyZXZpdmVyIiwic3RyaXBDb21tZW50cyIsIndoaXRlc3BhY2UiLCJhcmd1bWVudHMiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzcGFjZSIsIm9wdHMiLCJnZXRTdHJpbmdpZnlPcHRpb25zIiwic2FmZSIsImRlY3ljbGVyIiwiaXNPYmoiLCJCb29sZWFuIiwicmVwbGFjZXIiLCJKU09OIiwic3RyaW5naWZ5IiwibyIsImZpbGVQYXRoIiwidGhlbiIsImRhdGEiLCJtb2RlIiwiYXV0b1BhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZzIiwiY29udGVudCIsImVuY29kaW5nIiwid3JpdGUiLCJzeW5jIiwid3JpdGVGaWxlU3luYyIsInJlYWQiLCJyZWFkRmlsZVN5bmMiLCJmb3JFYWNoIiwiZm4iLCJnZXRMb2dnZXIiLCJwcmV0dHkiLCJzdHJpbmdpZnlTYWZlIiwid3JpdGVTeW5jIiwicmVhZFN5bmMiXSwibWFwcGluZ3MiOiJnbkJBQUEsa0M7QUFDQSw0QjtBQUNBLHlDO0FBQ0EsNEI7QUFDQSwrQztBQUNBLHdEO0FBQ0Esd0Q7QUFDQSx1QztBQUNBLHFDO0FBQ0EsZ0M7O0FBRUE7OztBQUdBLElBQU1BLFVBQVU7QUFDWkMsY0FBVSx5QkFBVSxxQkFBR0EsUUFBYix1QkFERTtBQUVaQyxlQUFXLHlCQUFVLHFCQUFHQSxTQUFiLHVCQUZDO0FBR1pDLFlBQVEsMENBSEksRUFBaEI7OztBQU1BOzs7O0FBSU1DLEk7O0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCYUMsVyxFQUFpRSxnRkFBSixFQUFJLENBQTFEQyxPQUEwRCxRQUExREEsT0FBMEQsMkJBQWpEQyxhQUFpRCxDQUFqREEsYUFBaUQsc0NBQWpDLEtBQWlDLDZDQUExQkMsVUFBMEIsQ0FBMUJBLFVBQTBCLG1DQUFiLElBQWE7QUFDMUU7QUFDQSxn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QXFCdEMsS0FBS2lCLFNBQUwsQ0FBZU4sSUFBcEM7QUFDQTs7O0FBR0FYLEtBQUt1QyxTQUFMLEdBQWlCdkMsS0FBSzZCLEtBQUwsQ0FBV0MsSUFBNUI7QUFDQTs7O0FBR0E5QixLQUFLd0MsUUFBTCxHQUFnQnhDLEtBQUtnQyxJQUFMLENBQVVGLElBQTFCOztBQUVBOztBQUVlOUIsSSIsImZpbGUiOiJqc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGhlbHBlciBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdncmFjZWZ1bC1mcyc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICd5YWt1JztcbmltcG9ydCBwcm9taXNpZnkgZnJvbSAneWFrdS9saWIvcHJvbWlzaWZ5JztcbmltcG9ydCBzdHJpcEpzb25Db21tZW50cyBmcm9tICdzdHJpcC1qc29uLWNvbW1lbnRzJztcbmltcG9ydCBzYWZlU3RyaW5naWZ5IGZyb20gJ2pzb24tc3RyaW5naWZ5LXNhZmUnO1xuaW1wb3J0IHBhcnNlSlNPTiBmcm9tICdwYXJzZS1qc29uJztcbmltcG9ydCBzdHJpcEJPTSBmcm9tICdzdHJpcC1ib20nO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuXG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG5jb25zdCBwcm9taXNlID0ge1xuICAgIHJlYWRGaWxlOiBwcm9taXNpZnkoZnMucmVhZEZpbGUsIGZzKSxcbiAgICB3cml0ZUZpbGU6IHByb21pc2lmeShmcy53cml0ZUZpbGUsIGZzKSxcbiAgICBta2RpcnA6IHByb21pc2lmeShta2RpcnApXG59O1xuXG4vKipcbiAqICBKU09OIHV0aWxpdHkgY2xhc3MgdGhhdCBwcm92aWRlcyBleHRyYSBmdW5jdGlvbmFsaXR5IHN1Y2ggYXMgc3RyaXBwaW5nXG4gKiAgY29tbWVudHMsIHNhZmVseSBwYXJzaW5nIEpTT04gc3RyaW5ncyB3aXRoIGNpcmN1bGFyIHJlZmVyZW5jZXMsIGV0Yy4uLlxuICovXG5jbGFzcyBqc29uIHtcblxuICAgIC8qKlxuICAgICAqICBQYXJzZXMgdGhlIGdpdmVuIEpTT04gc3RyaW5nIGludG8gYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAgICAgKiAgVGhpcyBwcm92aWRlcyB0aGUgc2FtZSBmdW5jdGlvbmFsaXR5IHdpdGggbmF0aXZlIGBKU09OLnBhcnNlKClgIHdpdGhcbiAgICAgKiAgc29tZSBleHRyYSBvcHRpb25zLlxuICAgICAqXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBKU09OIHN0cmluZyB0byBiZSBwYXJzZWQuXG4gICAgICogIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgIEVpdGhlciBhIHJldml2ZXIgZnVuY3Rpb24gb3IgcGFyc2Ugb3B0aW9ucyBvYmplY3QuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5yZXZpdmVyPW51bGxdXG4gICAgICogICAgICAgICAgICAgICAgQSBmdW5jdGlvbiB0aGF0IGNhbiBmaWx0ZXIgYW5kIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy5cbiAgICAgKiAgICAgICAgICAgICAgICBJdCByZWNlaXZlcyBlYWNoIG9mIHRoZSBrZXlzIGFuZCB2YWx1ZXMsIGFuZCBpdHMgcmV0dXJuXG4gICAgICogICAgICAgICAgICAgICAgdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICAgKiAgICAgICAgICAgICAgICBJZiBpdCByZXR1cm5zIHdoYXQgaXQgcmVjZWl2ZWQsIHRoZW4gdGhlIHN0cnVjdHVyZSBpcyBub3RcbiAgICAgKiAgICAgICAgICAgICAgICBtb2RpZmllZC4gSWYgaXQgcmV0dXJucyB1bmRlZmluZWQgdGhlbiB0aGUgbWVtYmVyIGlzXG4gICAgICogICAgICAgICAgICAgICAgZGVsZXRlZC5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc3RyaXBDb21tZW50cz1mYWxzZV1cbiAgICAgKiAgICAgICAgICAgICAgICBXaGV0aGVyIHRvIHN0cmlwIGNvbW1lbnRzIGZyb20gdGhlIEpTT04gc3RyaW5nLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy53aGl0ZXNwYWNlPXRydWVdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBsZWF2ZSB3aGl0ZXNwYWNlIGluIHBsYWNlIG9mIHN0cmlwcGVkIGNvbW1lbnRzLlxuICAgICAqICAgICAgICAgICAgICAgIFRoaXMgb25seSB0YWtlcyBlZmZlY3QgaWYgYG9wdGlvbnMuc3RyaXBDb21tZW50c2AgaXMgc2V0XG4gICAgICogICAgICAgICAgICAgICAgdG8gYHRydWVgLlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzdHIsIHsgcmV2aXZlciwgc3RyaXBDb21tZW50cyA9IGZhbHNlLCB3aGl0ZXNwYWNlID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAgICAgLy8gQ0FVVElPTjogZG9uJ3QgdXNlIGFycm93IGZvciB0aGlzIG1ldGhvZCBzaW5jZSB3ZSB1c2UgYGFyZ3VtZW50c2BcbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicpIHJldml2ZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGlmIChzdHJpcENvbW1lbnRzKSBzdHIgPSBzdHJpcEpzb25Db21tZW50cyhzdHIsIHsgd2hpdGVzcGFjZSB9KTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSlNPTihzdHIsIHJldml2ZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBPdXRwdXRzIGEgSlNPTiBzdHJpbmcgZnJvbSB0aGUgZ2l2ZW4gSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIFRoaXMgcHJvdmlkZXMgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoIG5hdGl2ZSBgSlNPTi5zdHJpbmdpZnkoKWBcbiAgICAgKiAgd2l0aCBzb21lIGV4dHJhIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHsqfSB2YWx1ZSAtIEphdmFTY3JpcHQgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufEFycmF5fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgIEEgcmVwbGFjZXIgb3Igc3RyaW5naWZ5IG9wdGlvbnMuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5PFN0cmluZz59IFtvcHRpb25zLnJlcGxhY2VyXVxuICAgICAqICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAgICAgKiAgICAgICAgIFNwZWNpZmllcyB0aGUgaW5kZW50YXRpb24gb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsXG4gICAgICogICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAgICAgKiAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gICAgICogICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSwgaXQgY29udGFpbnNcbiAgICAgKiAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtvcHRpb25zLnNhZmU9ZmFsc2VdXG4gICAgICogICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBzYWZlbHkgc3RyaW5naWZ5IHRoZSBnaXZlbiBvYmplY3QgYW5kXG4gICAgICogICAgICAgICByZXR1cm4gdGhlIHN0cmluZyBgXCJbQ2lyY3VsYXJdXCJgIGZvciBlYWNoIGNpcmN1bGFyIHJlZmVyZW5jZS5cbiAgICAgKiAgICAgICAgIFlvdSBjYW4gcGFzcyBhIGN1c3RvbSBkZWN5Y2xlciBmdW5jdGlvbiBpbnN0ZWFkLCB3aXRoIHRoZVxuICAgICAqICAgICAgICAgZm9sbG93aW5nIHNpZ25hdHVyZTogYGZ1bmN0aW9uKGssIHYpIHsgfWAuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW3NwYWNlXVxuICAgICAqICAgICAgICAgVGhpcyB0YWtlcyBlZmZlY3QgaWYgc2Vjb25kIGFyZ3VtZW50IGlzIHRoZSBgcmVwbGFjZXJgIG9yIGZhbHN5LlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucywgc3BhY2UpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBoZWxwZXIuZ2V0U3RyaW5naWZ5T3B0aW9ucyhvcHRpb25zLCBzcGFjZSk7XG4gICAgICAgIGxldCBzYWZlLCBkZWN5Y2xlcjtcbiAgICAgICAgaWYgKG9wdHMuaXNPYmopIHtcbiAgICAgICAgICAgIGRlY3ljbGVyID0gdHlwZW9mIG9wdGlvbnMuc2FmZSA9PT0gJ2Z1bmN0aW9uJyA/IHNhZmUgOiBudWxsO1xuICAgICAgICAgICAgc2FmZSA9IEJvb2xlYW4ob3B0aW9ucy5zYWZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzYWZlKSByZXR1cm4gc2FmZVN0cmluZ2lmeSh2YWx1ZSwgb3B0cy5yZXBsYWNlciwgb3B0cy5zcGFjZSwgZGVjeWNsZXIpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG9wdHMucmVwbGFjZXIsIG9wdHMuc3BhY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBVZ2xpZmllcyB0aGUgZ2l2ZW4gSlNPTiBzdHJpbmcuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBKU09OIHN0cmluZyB0byBiZSB1Z2xpZmllZC5cbiAgICAgKiAgQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgdWdsaWZ5KHN0cikge1xuICAgICAgICBsZXQgbyA9IHBhcnNlSlNPTihzdHJpcEpzb25Db21tZW50cyhzdHIsIHsgd2hpdGVzcGFjZTogZmFsc2UgfSkpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEFzeW5jaHJvbm91c2x5IHJlYWRzIGEgSlNPTiBmaWxlLCBzdHJpcHMgVVRGLTggQk9NIGFuZCBwYXJzZXMgdGhlIEpTT05cbiAgICAgKiAgY29udGVudC5cbiAgICAgKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICogICAgICAgICBQYXRoIHRvIEpTT04gZmlsZS5cbiAgICAgKiAgQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IFtvcHRpb25zXVxuICAgICAqICAgICAgICAgRWl0aGVyIGEgcmV2aXZlciBmdW5jdGlvbiBvciByZWFkIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMucmV2aXZlcj1udWxsXVxuICAgICAqICAgICAgICAgICAgICAgIEEgZnVuY3Rpb24gdGhhdCBjYW4gZmlsdGVyIGFuZCB0cmFuc2Zvcm0gdGhlIHJlc3VsdHMuXG4gICAgICogICAgICAgICAgICAgICAgSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLCBhbmQgaXRzIHJldHVyblxuICAgICAqICAgICAgICAgICAgICAgIHZhbHVlIGlzIHVzZWQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gICAgICogICAgICAgICAgICAgICAgSWYgaXQgcmV0dXJucyB3aGF0IGl0IHJlY2VpdmVkLCB0aGVuIHRoZSBzdHJ1Y3R1cmUgaXMgbm90XG4gICAgICogICAgICAgICAgICAgICAgbW9kaWZpZWQuIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpc1xuICAgICAqICAgICAgICAgICAgICAgIGRlbGV0ZWQuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN0cmlwQ29tbWVudHM9ZmFsc2VdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBzdHJpcCBjb21tZW50cyBmcm9tIHRoZSBKU09OIHN0cmluZy5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMud2hpdGVzcGFjZT10cnVlXVxuICAgICAqICAgICAgICAgICAgICAgIFdoZXRoZXIgdG8gbGVhdmUgd2hpdGVzcGFjZSBpbiBwbGFjZSBvZiBzdHJpcHBlZCBjb21tZW50cy5cbiAgICAgKiAgICAgICAgICAgICAgICBUaGlzIG9ubHkgdGFrZXMgZWZmZWN0IGlmIGBvcHRpb25zLnN0cmlwQ29tbWVudHNgIGlzIHNldFxuICAgICAqICAgICAgICAgICAgICAgIHRvIGB0cnVlYC5cbiAgICAgKiAgQHJldHVybnMge1Byb21pc2U8Kj59XG4gICAgICogICAgICAgICAgIFBhcnNlZCBKU09OIGNvbnRlbnQgYXMgYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAgICAgKi9cbiAgICBzdGF0aWMgcmVhZChmaWxlUGF0aCwgeyByZXZpdmVyLCBzdHJpcENvbW1lbnRzID0gZmFsc2UsIHdoaXRlc3BhY2UgPSB0cnVlIH0gPSB7fSkge1xuICAgICAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykgcmV2aXZlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgcmV0dXJuIHByb21pc2UucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JylcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdHJpcENvbW1lbnRzKSBkYXRhID0gc3RyaXBKc29uQ29tbWVudHMoZGF0YSwgeyB3aGl0ZXNwYWNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUpTT04oc3RyaXBCT00oZGF0YSksIHJldml2ZXIsIGZpbGVQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBBc3luY2hyb25vdXNseSB3cml0ZXMgYSBKU09OIGZpbGUgZnJvbSB0aGUgZ2l2ZW4gSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aFxuICAgICAqICAgICAgICAgUGF0aCB0byBKU09OIGZpbGUgdG8gYmUgd3JpdHRlbi5cbiAgICAgKiAgQHBhcmFtIHsqfSBkYXRhXG4gICAgICogICAgICAgICBEYXRhIHRvIGJlIHN0cmluZ2lmaWVkIGludG8gSlNPTi5cbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAqICAgICAgICAgU3RyaW5naWZ5IC8gd3JpdGUgb3B0aW9ucyBvciByZXBsYWNlciBmdW5jdGlvbi5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7RnVuY3Rpb258QXJyYXk8U3RyaW5nPn0gW29wdGlvbnMucmVwbGFjZXJdXG4gICAgICogICAgICAgICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgICAgICAgIGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW29wdGlvbnMuc3BhY2VdXG4gICAgICogICAgICAgICAgICAgICAgU3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvbiBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCxcbiAgICAgKiAgICAgICAgICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAgICAgKiAgICAgICAgICAgICAgICBudW1iZXIsIGl0IHdpbGwgc3BlY2lmeSB0aGUgbnVtYmVyIG9mIHNwYWNlcyB0byBpbmRlbnQgYXQgZWFjaFxuICAgICAqICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLCBpdCBjb250YWluc1xuICAgICAqICAgICAgICAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gICAgICogICAgICAgICBAcGFyYW0ge051bWJlcn0gW21vZGU9NDM4XVxuICAgICAqICAgICAgICAgICAgICAgIEZpbGVTeXN0ZW0gcGVybWlzc2lvbiBtb2RlIHRvIGJlIHVzZWQgd2hlbiB3cml0aW5nIHRoZSBmaWxlLlxuICAgICAqICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgYDQzOGAgKDA2NjYgaW4gb2N0YWwpLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufSBbYXV0b1BhdGg9dHJ1ZV1cbiAgICAgKiAgICAgICAgICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBjcmVhdGUgcGF0aCBkaXJlY3RvcmllcyBpZiB0aGV5IGRvbid0XG4gICAgICogICAgICAgICAgICAgICAgZXhpc3QuIFRoaXMgd2lsbCB0aHJvdyBpZiBzZXQgdG8gYGZhbHNlYCBhbmQgcGF0aCBkb2VzIG5vdFxuICAgICAqICAgICAgICAgICAgICAgIGV4aXN0LlxuICAgICAqICBAcmV0dXJucyB7UHJvbWlzZTwqPn1cbiAgICAgKi9cbiAgICBzdGF0aWMgd3JpdGUoZmlsZVBhdGgsIGRhdGEsIHsgcmVwbGFjZXIsIHNwYWNlLCBtb2RlID0gNDM4LCBhdXRvUGF0aCA9IHRydWUgfSA9IHt9KSB7XG4gICAgICAgIC8vIENBVVRJT046IGRvbid0IHVzZSBhcnJvdyBmb3IgdGhpcyBtZXRob2Qgc2luY2Ugd2UgdXNlIGBhcmd1bWVudHNgXG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzJdID09PSAnZnVuY3Rpb24nKSByZXBsYWNlciA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dG9QYXRoKSByZXR1cm4gcHJvbWlzZS5ta2RpcnAocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgeyBmcyB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhLCByZXBsYWNlciwgc3BhY2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLndyaXRlRmlsZShmaWxlUGF0aCwgYCR7Y29udGVudH1cXG5gLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufTtcblxuLy8gRGVlcCBtZXRob2RzXG5cbi8qKlxuICogIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgYHN0cmluZ2lmeSgpYCB3aXRoIGBzYWZlYCBvcHRpb24gZW5hYmxlZC5cbiAqICBZb3UgY2FuIHBhc3MgYSBgZGVjeWNsZXJgIGZ1bmN0aW9uIGVpdGhlciB3aXRoaW4gdGhlIGBvcHRpb25zYCBvYmplY3RcbiAqICBvciBhcyB0aGUgZm91cnRoIGFyZ3VtZW50LlxuICogIEBhbGlhcyBqc29uLnN0cmluZ2lmeVNhZmVcbiAqL1xuanNvbi5zdHJpbmdpZnkuc2FmZSA9ICh2YWx1ZSwgb3B0aW9ucywgc3BhY2UsIGRlY3ljbGVyKSA9PiB7XG4gICAgbGV0IG9wdHMgPSBoZWxwZXIuZ2V0U3RyaW5naWZ5T3B0aW9ucyhvcHRpb25zLCBzcGFjZSk7XG4gICAgaWYgKG9wdHMuaXNPYmopIHtcbiAgICAgICAgZGVjeWNsZXIgPSBvcHRpb25zLmRlY3ljbGVyIHx8IGRlY3ljbGVyO1xuICAgIH1cblxuICAgIHJldHVybiBzYWZlU3RyaW5naWZ5KHZhbHVlLCBvcHRzLnJlcGxhY2VyLCBvcHRzLnNwYWNlLCBkZWN5Y2xlcik7XG59O1xuXG4vKipcbiAqICBTeW5jaHJvbm91c2x5IHdyaXRlcyBhIEpTT04gZmlsZSBmcm9tIHRoZSBnaXZlbiBKYXZhU2NyaXB0IG9iamVjdC5cbiAqICBAYWxpYXMganNvbi53cml0ZVN5bmNcbiAqXG4gKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gKiAgICAgICAgIFBhdGggdG8gSlNPTiBmaWxlIHRvIGJlIHdyaXR0ZW4uXG4gKiAgQHBhcmFtIHsqfSBkYXRhXG4gKiAgICAgICAgIERhdGEgdG8gYmUgc3RyaW5naWZpZWQgaW50byBKU09OLlxuICogIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqICAgICAgICAgU3RyaW5naWZ5IC8gd3JpdGUgb3B0aW9ucyBvciByZXBsYWNlciBmdW5jdGlvbi5cbiAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbnxBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5yZXBsYWNlcl1cbiAqICAgICAgICAgICAgICAgIERldGVybWluZXMgaG93IG9iamVjdCB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkIGZvciBvYmplY3RzLiBJdCBjYW5cbiAqICAgICAgICAgICAgICAgIGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAqICAgICAgICAgICAgICAgIFNwZWNpZmllcyB0aGUgaW5kZW50YXRpb24gb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsXG4gKiAgICAgICAgICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAqICAgICAgICAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gKiAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSwgaXQgY29udGFpbnNcbiAqICAgICAgICAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gKiAgICAgICAgIEBwYXJhbSB7TnVtYmVyfSBbbW9kZT00MzhdXG4gKiAgICAgICAgICAgICAgICBGaWxlU3lzdGVtIHBlcm1pc3Npb24gbW9kZSB0byBiZSB1c2VkIHdoZW4gd3JpdGluZyB0aGUgZmlsZS5cbiAqICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgYDQzOGAgKDA2NjYgaW4gb2N0YWwpLlxuICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFthdXRvUGF0aD10cnVlXVxuICogICAgICAgICAgICAgICAgU3BlY2lmaWVzIHdoZXRoZXIgdG8gY3JlYXRlIHBhdGggZGlyZWN0b3JpZXMgaWYgdGhleSBkb24ndFxuICogICAgICAgICAgICAgICAgZXhpc3QuIFRoaXMgd2lsbCB0aHJvdyBpZiBzZXQgdG8gYGZhbHNlYCBhbmQgZGlyZWN0b3J5IHBhdGhcbiAqICAgICAgICAgICAgICAgIGRvZXMgbm90IGV4aXN0LlxuICogIEByZXR1cm5zIHt2b2lkfVxuICovXG5qc29uLndyaXRlLnN5bmMgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIGRhdGEsIHsgcmVwbGFjZXIsIHNwYWNlLCBtb2RlID0gNDM4LCBhdXRvUGF0aCA9IHRydWUgfSA9IHt9KSB7XG4gICAgLy8gQ0FVVElPTjogZG9uJ3QgdXNlIGFycm93IGZvciB0aGlzIG1ldGhvZCBzaW5jZSB3ZSB1c2UgYGFyZ3VtZW50c2BcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSA9PT0gJ2Z1bmN0aW9uJykgcmVwbGFjZXIgPSBhcmd1bWVudHNbMl07XG4gICAgaWYgKGF1dG9QYXRoKSBta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB7IGZzIH0pO1xuICAgIGxldCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSwgcmVwbGFjZXIsIHNwYWNlKTtcbiAgICByZXR1cm4gZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgYCR7Y29udGVudH1cXG5gLCB7XG4gICAgICAgIG1vZGUsXG4gICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICB9KTtcbn07XG5cbi8qKlxuICogIFN5bmNocm9ub3VzbHkgcmVhZHMgYSBKU09OIGZpbGUsIHN0cmlwcyBVVEYtOCBCT00gYW5kIHBhcnNlcyB0aGUgSlNPTlxuICogIGNvbnRlbnQuXG4gKiAgQGFsaWFzIGpzb24ucmVhZFN5bmNcbiAqXG4gKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gKiAgICAgICAgIFBhdGggdG8gSlNPTiBmaWxlLlxuICogIEByZXR1cm5zIHsqfVxuICogICAgICAgICAgIFBhcnNlZCBKU09OIGNvbnRlbnQgYXMgYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqL1xuanNvbi5yZWFkLnN5bmMgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIHsgcmV2aXZlciwgc3RyaXBDb21tZW50cyA9IGZhbHNlLCB3aGl0ZXNwYWNlID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSByZXZpdmVyID0gYXJndW1lbnRzWzFdO1xuICAgIGxldCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGlmIChzdHJpcENvbW1lbnRzKSBkYXRhID0gc3RyaXBKc29uQ29tbWVudHMoZGF0YSwgeyB3aGl0ZXNwYWNlIH0pO1xuICAgIHJldHVybiBwYXJzZUpTT04oc3RyaXBCT00oZGF0YSksIHJldml2ZXIsIGZpbGVQYXRoKTtcbn07XG5cbi8vIEdlbmVyYXRlIGxvZ2dlciBtZXRob2RzXG5cblsnbG9nJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLmZvckVhY2goZm4gPT4ge1xuICAgIGpzb25bZm5dID0gaGVscGVyLmdldExvZ2dlcihmbik7XG4gICAganNvbltmbl0ucHJldHR5ID0ganNvbltmbiArICdQcmV0dHknXSA9IGhlbHBlci5nZXRMb2dnZXIoZm4sIHRydWUpO1xufSk7XG5cbi8vIEFsaWFzZXNcblxuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuanNvbi5zdHJpbmdpZnlTYWZlID0ganNvbi5zdHJpbmdpZnkuc2FmZTtcbi8qKlxuICogIEBwcml2YXRlXG4gKi9cbmpzb24ud3JpdGVTeW5jID0ganNvbi53cml0ZS5zeW5jO1xuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuanNvbi5yZWFkU3luYyA9IGpzb24ucmVhZC5zeW5jO1xuXG4vLyBFeHBvcnRcblxuZXhwb3J0IGRlZmF1bHQganNvbjtcbiJdfQ==