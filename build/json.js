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
                                                                                                             *                Note that it will throw if this is set to `false` and
                                                                                                             *                the string includes comments.
                                                                                                             *         @param {Boolean} [options.safe=false]
                                                                                                             *                Whether to safely parse within a try/catch block.
                                                                                                             *                If parse fails, it will return an instance of an `Error`,
                                                                                                             *                instead of a parsed value.
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
                                                                                                             */value: function parse(
        str) {var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref.reviver,_ref$stripComments = _ref.stripComments,stripComments = _ref$stripComments === undefined ? false : _ref$stripComments,_ref$safe = _ref.safe,safe = _ref$safe === undefined ? false : _ref$safe;
            // CAUTION: don't use arrow for this method since we use `arguments`
            if (typeof arguments[1] === 'function') reviver = arguments[1];
            if (safe || stripComments) str = (0, _stripJsonComments2.default)(str);
            if (!safe) return (0, _parseJson2.default)(str, reviver);
            try {
                return (0, _parseJson2.default)(str, reviver);
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
           */ }, { key: 'beautify', value: function beautify(
        str) {var space = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
            var o = (0, _parseJson2.default)((0, _stripJsonComments2.default)(str, { whitespace: false }));
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
           */ }, { key: 'normalize', value: function normalize(
        value, options) {
            return (0, _parseJson2.default)(json.stringify(value, options));
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
           */ }, { key: 'read', value: function read(
        filePath) {var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref2.reviver,_ref2$stripComments = _ref2.stripComments,stripComments = _ref2$stripComments === undefined ? false : _ref2$stripComments;
            // CAUTION: don't use arrow for this method since we use `arguments`
            if (typeof arguments[1] === 'function') reviver = arguments[1];
            return promise.readFile(filePath, 'utf8').
            then(function (data) {
                if (stripComments) data = (0, _stripJsonComments2.default)(data);
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



// Deep methods

/**
 *  Convenience method for `parse()` with `safe` option enabled.
 *  @alias json.parseSafe
 */
json.parse.safe = function (str) {var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref4.reviver;
    if (typeof arguments[1] === 'function') reviver = arguments[1];
    return json.parse(str, { reviver: reviver, safe: true });
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
json.read.sync = function (filePath) {var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},reviver = _ref5.reviver,_ref5$stripComments = _ref5.stripComments,stripComments = _ref5$stripComments === undefined ? false : _ref5$stripComments,_ref5$safe = _ref5.safe,safe = _ref5$safe === undefined ? false : _ref5$safe;
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[1] === 'function') reviver = arguments[1];
    var data = _gracefulFs2.default.readFileSync(filePath, 'utf8');
    if (safe || stripComments) data = (0, _stripJsonComments2.default)(data);
    if (!safe) return (0, _parseJson2.default)((0, _stripBom2.default)(data), reviver, filePath);
    try {
        return (0, _parseJson2.default)((0, _stripBom2.default)(data), reviver, filePath);
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
json.write.sync = function (filePath, data) {var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},replacer = _ref6.replacer,space = _ref6.space,_ref6$mode = _ref6.mode,mode = _ref6$mode === undefined ? 438 : _ref6$mode,_ref6$autoPath = _ref6.autoPath,autoPath = _ref6$autoPath === undefined ? true : _ref6$autoPath;
    // CAUTION: don't use arrow for this method since we use `arguments`
    if (typeof arguments[2] === 'function') replacer = arguments[2];
    if (autoPath) _mkdirp2.default.sync(_path2.default.dirname(filePath), { fs: _gracefulFs2.default });
    var content = JSON.stringify(data, replacer, space);
    return _gracefulFs2.default.writeFileSync(filePath, content + '\n', {
        mode: mode,
        encoding: 'utf8' });

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
exports.default =
json;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uLmpzIl0sIm5hbWVzIjpbInByb21pc2UiLCJyZWFkRmlsZSIsIndyaXRlRmlsZSIsIm1rZGlycCIsImpzb24iLCJzdHIiLCJyZXZpdmVyIiwic3RyaXBDb21tZW50cyIsInNhZmUiLCJhcmd1bWVudHMiLCJlcnIiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzcGFjZSIsIm9wdHMiLCJnZXRTdHJpbmdpZnlPcHRpb25zIiwiZGVjeWNsZXIiLCJpc09iaiIsIkJvb2xlYW4iLCJyZXBsYWNlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJvIiwid2hpdGVzcGFjZSIsImZpbGVQYXRoIiwidGhlbiIsImRhdGEiLCJtb2RlIiwiYXV0b1BhdGgiLCJyZXNvbHZlIiwiZGlybmFtZSIsImZzIiwiY29udGVudCIsImVuY29kaW5nIiwicGFyc2UiLCJyZWFkIiwic3luYyIsInJlYWRGaWxlU3luYyIsIndyaXRlIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJmbiIsImdldExvZ2dlciIsInByZXR0eSIsInBhcnNlU2FmZSIsInN0cmluZ2lmeVNhZmUiLCJ3cml0ZVN5bmMiLCJyZWFkU3luYyJdLCJtYXBwaW5ncyI6ImduQkFBQSxrQztBQUNBLDRCO0FBQ0EseUM7QUFDQSw0QjtBQUNBLCtDO0FBQ0Esd0Q7QUFDQSx3RDtBQUNBLHVDO0FBQ0EscUM7QUFDQSxnQzs7QUFFQTs7O0FBR0EsSUFBTUEsVUFBVTtBQUNaQyxjQUFVLHlCQUFVLHFCQUFHQSxRQUFiLHVCQURFO0FBRVpDLGVBQVcseUJBQVUscUJBQUdBLFNBQWIsdUJBRkM7QUFHWkMsWUFBUSwwQ0FISSxFQUFoQjs7O0FBTUE7Ozs7QUFJTUMsSTs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ2FDLFcsRUFBNEQsZ0ZBQUosRUFBSSxDQUFyREMsT0FBcUQsUUFBckRBLE9BQXFELDJCQUE1Q0MsYUFBNEMsQ0FBNUNBLGFBQTRDLHNDQUE1QixLQUE0Qix1Q0FBckJDLElB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QUFpQjFDLEtBQUtrQyxLQUFMLENBQVdGLElBQTVCO0FBQ0E7OztBQUdBaEMsS0FBSzJDLFFBQUwsR0FBZ0IzQyxLQUFLK0IsSUFBTCxDQUFVQyxJQUExQjs7QUFFQTs7QUFFZWhDLEkiLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoZWxwZXIgZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZ3JhY2VmdWwtZnMnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAneWFrdSc7XG5pbXBvcnQgcHJvbWlzaWZ5IGZyb20gJ3lha3UvbGliL3Byb21pc2lmeSc7XG5pbXBvcnQgc3RyaXBKc29uQ29tbWVudHMgZnJvbSAnc3RyaXAtanNvbi1jb21tZW50cyc7XG5pbXBvcnQgc2FmZVN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcbmltcG9ydCBwYXJzZUpTT04gZnJvbSAncGFyc2UtanNvbic7XG5pbXBvcnQgc3RyaXBCT00gZnJvbSAnc3RyaXAtYm9tJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcblxuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuY29uc3QgcHJvbWlzZSA9IHtcbiAgICByZWFkRmlsZTogcHJvbWlzaWZ5KGZzLnJlYWRGaWxlLCBmcyksXG4gICAgd3JpdGVGaWxlOiBwcm9taXNpZnkoZnMud3JpdGVGaWxlLCBmcyksXG4gICAgbWtkaXJwOiBwcm9taXNpZnkobWtkaXJwKVxufTtcblxuLyoqXG4gKiAgSlNPTiB1dGlsaXR5IGNsYXNzIHRoYXQgcHJvdmlkZXMgZXh0cmEgZnVuY3Rpb25hbGl0eSBzdWNoIGFzIHN0cmlwcGluZ1xuICogIGNvbW1lbnRzLCBzYWZlbHkgcGFyc2luZyBKU09OIHN0cmluZ3Mgd2l0aCBjaXJjdWxhciByZWZlcmVuY2VzLCBldGMuLi5cbiAqL1xuY2xhc3MganNvbiB7XG5cbiAgICAvKipcbiAgICAgKiAgUGFyc2VzIHRoZSBnaXZlbiBKU09OIHN0cmluZyBpbnRvIGEgSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIFRoaXMgcHJvdmlkZXMgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoIG5hdGl2ZSBgSlNPTi5wYXJzZSgpYCB3aXRoXG4gICAgICogIHNvbWUgZXh0cmEgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gc3RyIC0gSlNPTiBzdHJpbmcgdG8gYmUgcGFyc2VkLlxuICAgICAqICBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBFaXRoZXIgYSByZXZpdmVyIGZ1bmN0aW9uIG9yIHBhcnNlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMucmV2aXZlcj1udWxsXVxuICAgICAqICAgICAgICAgICAgICAgIEEgZnVuY3Rpb24gdGhhdCBjYW4gZmlsdGVyIGFuZCB0cmFuc2Zvcm0gdGhlIHJlc3VsdHMuXG4gICAgICogICAgICAgICAgICAgICAgSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLCBhbmQgaXRzIHJldHVyblxuICAgICAqICAgICAgICAgICAgICAgIHZhbHVlIGlzIHVzZWQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gICAgICogICAgICAgICAgICAgICAgSWYgaXQgcmV0dXJucyB3aGF0IGl0IHJlY2VpdmVkLCB0aGVuIHRoZSBzdHJ1Y3R1cmUgaXMgbm90XG4gICAgICogICAgICAgICAgICAgICAgbW9kaWZpZWQuIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpc1xuICAgICAqICAgICAgICAgICAgICAgIGRlbGV0ZWQuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN0cmlwQ29tbWVudHM9ZmFsc2VdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBzdHJpcCBjb21tZW50cyBmcm9tIHRoZSBKU09OIHN0cmluZy5cbiAgICAgKiAgICAgICAgICAgICAgICBOb3RlIHRoYXQgaXQgd2lsbCB0aHJvdyBpZiB0aGlzIGlzIHNldCB0byBgZmFsc2VgIGFuZFxuICAgICAqICAgICAgICAgICAgICAgIHRoZSBzdHJpbmcgaW5jbHVkZXMgY29tbWVudHMuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNhZmU9ZmFsc2VdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBzYWZlbHkgcGFyc2Ugd2l0aGluIGEgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAqICAgICAgICAgICAgICAgIElmIHBhcnNlIGZhaWxzLCBpdCB3aWxsIHJldHVybiBhbiBpbnN0YW5jZSBvZiBhbiBgRXJyb3JgLFxuICAgICAqICAgICAgICAgICAgICAgIGluc3RlYWQgb2YgYSBwYXJzZWQgdmFsdWUuXG4gICAgICogICAgICAgICAgICAgICAgSWYgYHNhZmVgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBjb21tZW50cyBhcmUgZm9yY2UtcmVtb3ZlZFxuICAgICAqICAgICAgICAgICAgICAgIGZyb20gdGhlIEpTT04gc3RyaW5nLCByZWdhcmxlc3Mgb2YgdGhlIGBzdHJpcENvbW1lbnRzYFxuICAgICAqICAgICAgICAgICAgICAgIG9wdGlvbi5cbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7KnxFcnJvcn0gLSBQYXJzZWQgdmFsdWUuIElmIGBzYWZlYCBvcHRpb24gaXMgZW5hYmxlZCwgcmV0dXJucyBhblxuICAgICAqICBgRXJyb3JgIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogIEBleGFtcGxlXG4gICAgICogIHZhciBwYXJzZWQgPSBqc29uLnBhcnNlKHN0ciwgeyBzYWZlOiB0cnVlIH0pO1xuICAgICAqICBpZiAocGFyc2VkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKCdQYXJzZSBmYWlsZWQ6JywgcGFyc2VkKTtcbiAgICAgKiAgfSBlbHNlIHtcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKHBhcnNlZCk7XG4gICAgICogIH1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc3RyLCB7IHJldml2ZXIsIHN0cmlwQ29tbWVudHMgPSBmYWxzZSwgc2FmZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykgcmV2aXZlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKHNhZmUgfHwgc3RyaXBDb21tZW50cykgc3RyID0gc3RyaXBKc29uQ29tbWVudHMoc3RyKTtcbiAgICAgICAgaWYgKCFzYWZlKSByZXR1cm4gcGFyc2VKU09OKHN0ciwgcmV2aXZlcik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VKU09OKHN0ciwgcmV2aXZlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBPdXRwdXRzIGEgSlNPTiBzdHJpbmcgZnJvbSB0aGUgZ2l2ZW4gSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIFRoaXMgcHJvdmlkZXMgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoIG5hdGl2ZSBgSlNPTi5zdHJpbmdpZnkoKWBcbiAgICAgKiAgd2l0aCBzb21lIGV4dHJhIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHsqfSB2YWx1ZSAtIEphdmFTY3JpcHQgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufEFycmF5fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgIEEgcmVwbGFjZXIgb3Igc3RyaW5naWZ5IG9wdGlvbnMuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5PFN0cmluZz59IFtvcHRpb25zLnJlcGxhY2VyXVxuICAgICAqICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAgICAgKiAgICAgICAgIFNwZWNpZmllcyB0aGUgaW5kZW50YXRpb24gb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsXG4gICAgICogICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAgICAgKiAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gICAgICogICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSwgaXQgY29udGFpbnNcbiAgICAgKiAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtvcHRpb25zLnNhZmU9ZmFsc2VdXG4gICAgICogICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBzYWZlbHkgc3RyaW5naWZ5IHRoZSBnaXZlbiBvYmplY3QgYW5kXG4gICAgICogICAgICAgICByZXR1cm4gdGhlIHN0cmluZyBgXCJbQ2lyY3VsYXJdXCJgIGZvciBlYWNoIGNpcmN1bGFyIHJlZmVyZW5jZS5cbiAgICAgKiAgICAgICAgIFlvdSBjYW4gcGFzcyBhIGN1c3RvbSBkZWN5Y2xlciBmdW5jdGlvbiBpbnN0ZWFkLCB3aXRoIHRoZVxuICAgICAqICAgICAgICAgZm9sbG93aW5nIHNpZ25hdHVyZTogYGZ1bmN0aW9uKGssIHYpIHsgfWAuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW3NwYWNlXVxuICAgICAqICAgICAgICAgVGhpcyB0YWtlcyBlZmZlY3QgaWYgc2Vjb25kIGFyZ3VtZW50IGlzIHRoZSBgcmVwbGFjZXJgIG9yIGZhbHN5LlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucywgc3BhY2UpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBoZWxwZXIuZ2V0U3RyaW5naWZ5T3B0aW9ucyhvcHRpb25zLCBzcGFjZSk7XG4gICAgICAgIGxldCBzYWZlLCBkZWN5Y2xlcjtcbiAgICAgICAgaWYgKG9wdHMuaXNPYmopIHtcbiAgICAgICAgICAgIGRlY3ljbGVyID0gdHlwZW9mIG9wdGlvbnMuc2FmZSA9PT0gJ2Z1bmN0aW9uJyA/IHNhZmUgOiBudWxsO1xuICAgICAgICAgICAgc2FmZSA9IEJvb2xlYW4ob3B0aW9ucy5zYWZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzYWZlKSByZXR1cm4gc2FmZVN0cmluZ2lmeSh2YWx1ZSwgb3B0cy5yZXBsYWNlciwgb3B0cy5zcGFjZSwgZGVjeWNsZXIpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG9wdHMucmVwbGFjZXIsIG9wdHMuc3BhY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBVZ2xpZmllcyB0aGUgZ2l2ZW4gSlNPTiBzdHJpbmcuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBKU09OIHN0cmluZyB0byBiZSB1Z2xpZmllZC5cbiAgICAgKiAgQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgdWdsaWZ5KHN0cikge1xuICAgICAgICBsZXQgbyA9IHBhcnNlSlNPTihzdHJpcEpzb25Db21tZW50cyhzdHIsIHsgd2hpdGVzcGFjZTogZmFsc2UgfSkpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEJlYXV0aWZpZXMgdGhlIGdpdmVuIEpTT04gc3RyaW5nLlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgICogICAgICAgICBKU09OIHN0cmluZyB0byBiZSBiZWF1dGlmaWVkLlxuICAgICAqICBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IFtzcGFjZT0yXVxuICAgICAqICAgICAgICAgU3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvbiBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCxcbiAgICAgKiAgICAgICAgIHRoZSB0ZXh0IHdpbGwgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYVxuICAgICAqICAgICAgICAgbnVtYmVyLCBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbiAgICAgKiAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLCBpdCBjb250YWluc1xuICAgICAqICAgICAgICAgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbiAgICAgKiAgQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgYmVhdXRpZnkoc3RyLCBzcGFjZSA9IDIpIHtcbiAgICAgICAgbGV0IG8gPSBwYXJzZUpTT04oc3RyaXBKc29uQ29tbWVudHMoc3RyLCB7IHdoaXRlc3BhY2U6IGZhbHNlIH0pKTtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG8sIG51bGwsIHNwYWNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgTm9ybWFsaXplcyB0aGUgZ2l2ZW4gdmFsdWUgYnkgc3RyaW5naWZ5aW5nIGFuZCBwYXJzaW5nIGl0IGJhY2sgdG8gYVxuICAgICAqICBKYXZhc2NyaXB0IG9iamVjdC5cbiAgICAgKiAgQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqICBAcGFyYW0ge09iamVjdHxGdW5jdGlvbnxBcnJheX0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBBIHJlcGxhY2VyIG9yIG5vcm1hbGl6ZSBvcHRpb25zLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbnxBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5yZXBsYWNlcl1cbiAgICAgKiAgICAgICAgIERldGVybWluZXMgaG93IG9iamVjdCB2YWx1ZXMgYXJlIG5vcm1hbGl6ZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBbb3B0aW9ucy5zYWZlPWZhbHNlXVxuICAgICAqICAgICAgICAgU3BlY2lmaWVzIHdoZXRoZXIgdG8gc2FmZWx5IG5vcm1hbGl6ZSB0aGUgZ2l2ZW4gb2JqZWN0IGFuZFxuICAgICAqICAgICAgICAgcmV0dXJuIHRoZSBzdHJpbmcgYFwiW0NpcmN1bGFyXVwiYCBmb3IgZWFjaCBjaXJjdWxhciByZWZlcmVuY2UuXG4gICAgICogICAgICAgICBZb3UgY2FuIHBhc3MgYSBjdXN0b20gZGVjeWNsZXIgZnVuY3Rpb24gaW5zdGVhZCwgd2l0aCB0aGVcbiAgICAgKiAgICAgICAgIGZvbGxvd2luZyBzaWduYXR1cmU6IGBmdW5jdGlvbihrLCB2KSB7IH1gLlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxpemUodmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSlNPTihqc29uLnN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBBc3luY2hyb25vdXNseSByZWFkcyBhIEpTT04gZmlsZSwgc3RyaXBzIFVURi04IEJPTSBhbmQgcGFyc2VzIHRoZSBKU09OXG4gICAgICogIGNvbnRlbnQuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aFxuICAgICAqICAgICAgICAgUGF0aCB0byBKU09OIGZpbGUuXG4gICAgICogIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgIEVpdGhlciBhIHJldml2ZXIgZnVuY3Rpb24gb3IgcmVhZCBvcHRpb25zIG9iamVjdC5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnJldml2ZXI9bnVsbF1cbiAgICAgKiAgICAgICAgICAgICAgICBBIGZ1bmN0aW9uIHRoYXQgY2FuIGZpbHRlciBhbmQgdHJhbnNmb3JtIHRoZSByZXN1bHRzLlxuICAgICAqICAgICAgICAgICAgICAgIEl0IHJlY2VpdmVzIGVhY2ggb2YgdGhlIGtleXMgYW5kIHZhbHVlcywgYW5kIGl0cyByZXR1cm5cbiAgICAgKiAgICAgICAgICAgICAgICB2YWx1ZSBpcyB1c2VkIGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIHZhbHVlLlxuICAgICAqICAgICAgICAgICAgICAgIElmIGl0IHJldHVybnMgd2hhdCBpdCByZWNlaXZlZCwgdGhlbiB0aGUgc3RydWN0dXJlIGlzIG5vdFxuICAgICAqICAgICAgICAgICAgICAgIG1vZGlmaWVkLiBJZiBpdCByZXR1cm5zIHVuZGVmaW5lZCB0aGVuIHRoZSBtZW1iZXIgaXNcbiAgICAgKiAgICAgICAgICAgICAgICBkZWxldGVkLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zdHJpcENvbW1lbnRzPWZhbHNlXVxuICAgICAqICAgICAgICAgICAgICAgIFdoZXRoZXIgdG8gc3RyaXAgY29tbWVudHMgZnJvbSB0aGUgSlNPTiBzdHJpbmcuXG4gICAgICogICAgICAgICAgICAgICAgTm90ZSB0aGF0IGl0IHdpbGwgdGhyb3cgaWYgdGhpcyBpcyBzZXQgdG8gYGZhbHNlYCBhbmRcbiAgICAgKiAgICAgICAgICAgICAgICB0aGUgc3RyaW5nIGluY2x1ZGVzIGNvbW1lbnRzLlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtQcm9taXNlPCo+fVxuICAgICAqICAgICAgICAgICBQYXJzZWQgSlNPTiBjb250ZW50IGFzIGEgSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICovXG4gICAgc3RhdGljIHJlYWQoZmlsZVBhdGgsIHsgcmV2aXZlciwgc3RyaXBDb21tZW50cyA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykgcmV2aXZlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgcmV0dXJuIHByb21pc2UucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JylcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdHJpcENvbW1lbnRzKSBkYXRhID0gc3RyaXBKc29uQ29tbWVudHMoZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSlNPTihzdHJpcEJPTShkYXRhKSwgcmV2aXZlciwgZmlsZVBhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEFzeW5jaHJvbm91c2x5IHdyaXRlcyBhIEpTT04gZmlsZSBmcm9tIHRoZSBnaXZlbiBKYXZhU2NyaXB0IG9iamVjdC5cbiAgICAgKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICogICAgICAgICBQYXRoIHRvIEpTT04gZmlsZSB0byBiZSB3cml0dGVuLlxuICAgICAqICBAcGFyYW0geyp9IGRhdGFcbiAgICAgKiAgICAgICAgIERhdGEgdG8gYmUgc3RyaW5naWZpZWQgaW50byBKU09OLlxuICAgICAqICBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBTdHJpbmdpZnkgLyB3cml0ZSBvcHRpb25zIG9yIHJlcGxhY2VyIGZ1bmN0aW9uLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbnxBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5yZXBsYWNlcl1cbiAgICAgKiAgICAgICAgICAgICAgICBEZXRlcm1pbmVzIGhvdyBvYmplY3QgdmFsdWVzIGFyZSBzdHJpbmdpZmllZCBmb3Igb2JqZWN0cy4gSXQgY2FuXG4gICAgICogICAgICAgICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAgICAgKiAgICAgICAgICAgICAgICBTcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uIG9mIG5lc3RlZCBzdHJ1Y3R1cmVzLiBJZiBpdCBpcyBvbWl0dGVkLFxuICAgICAqICAgICAgICAgICAgICAgIHRoZSB0ZXh0IHdpbGwgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYVxuICAgICAqICAgICAgICAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gICAgICogICAgICAgICAgICAgICAgbGV2ZWwuIElmIGl0IGlzIGEgc3RyaW5nIChzdWNoIGFzIFwiXFx0XCIgb3IgXCImbmJzcDtcIiksIGl0IGNvbnRhaW5zXG4gICAgICogICAgICAgICAgICAgICAgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7TnVtYmVyfSBbbW9kZT00MzhdXG4gICAgICogICAgICAgICAgICAgICAgRmlsZVN5c3RlbSBwZXJtaXNzaW9uIG1vZGUgdG8gYmUgdXNlZCB3aGVuIHdyaXRpbmcgdGhlIGZpbGUuXG4gICAgICogICAgICAgICAgICAgICAgRGVmYXVsdCBpcyBgNDM4YCAoMDY2NiBpbiBvY3RhbCkuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFthdXRvUGF0aD10cnVlXVxuICAgICAqICAgICAgICAgICAgICAgIFNwZWNpZmllcyB3aGV0aGVyIHRvIGNyZWF0ZSBwYXRoIGRpcmVjdG9yaWVzIGlmIHRoZXkgZG9uJ3RcbiAgICAgKiAgICAgICAgICAgICAgICBleGlzdC4gVGhpcyB3aWxsIHRocm93IGlmIHNldCB0byBgZmFsc2VgIGFuZCBwYXRoIGRvZXMgbm90XG4gICAgICogICAgICAgICAgICAgICAgZXhpc3QuXG4gICAgICogIEByZXR1cm5zIHtQcm9taXNlPCo+fVxuICAgICAqL1xuICAgIHN0YXRpYyB3cml0ZShmaWxlUGF0aCwgZGF0YSwgeyByZXBsYWNlciwgc3BhY2UsIG1vZGUgPSA0MzgsIGF1dG9QYXRoID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAgICAgLy8gQ0FVVElPTjogZG9uJ3QgdXNlIGFycm93IGZvciB0aGlzIG1ldGhvZCBzaW5jZSB3ZSB1c2UgYGFyZ3VtZW50c2BcbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMl0gPT09ICdmdW5jdGlvbicpIHJlcGxhY2VyID0gYXJndW1lbnRzWzJdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0b1BhdGgpIHJldHVybiBwcm9taXNlLm1rZGlycChwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB7IGZzIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIHJlcGxhY2VyLCBzcGFjZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2Uud3JpdGVGaWxlKGZpbGVQYXRoLCBgJHtjb250ZW50fVxcbmAsIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZSxcbiAgICAgICAgICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbi8vIERlZXAgbWV0aG9kc1xuXG4vKipcbiAqICBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGBwYXJzZSgpYCB3aXRoIGBzYWZlYCBvcHRpb24gZW5hYmxlZC5cbiAqICBAYWxpYXMganNvbi5wYXJzZVNhZmVcbiAqL1xuanNvbi5wYXJzZS5zYWZlID0gZnVuY3Rpb24gKHN0ciwgeyByZXZpdmVyIH0gPSB7fSkge1xuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSByZXZpdmVyID0gYXJndW1lbnRzWzFdO1xuICAgIHJldHVybiBqc29uLnBhcnNlKHN0ciwgeyByZXZpdmVyLCBzYWZlOiB0cnVlIH0pO1xufTtcblxuLyoqXG4gKiAgU3luY2hyb25vdXNseSByZWFkcyBhIEpTT04gZmlsZSwgc3RyaXBzIFVURi04IEJPTSBhbmQgcGFyc2VzIHRoZSBKU09OXG4gKiAgY29udGVudC5cbiAqICBAYWxpYXMganNvbi5yZWFkU3luY1xuICpcbiAqICBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAqICAgICAgICAgUGF0aCB0byBKU09OIGZpbGUuXG4gKiAgQHJldHVybnMgeyp8RXJyb3J9XG4gKiAgICAgICAgICAgUGFyc2VkIEpTT04gY29udGVudCBhcyBhIEphdmFTY3JpcHQgb2JqZWN0LlxuICogICAgICAgICAgIElmIHBhcnNlIGZhaWxzLCByZXR1cm5zIGFuIGBFcnJvcmAgaW5zdGFuY2UuXG4gKi9cbmpzb24ucmVhZC5zeW5jID0gZnVuY3Rpb24gKGZpbGVQYXRoLCB7IHJldml2ZXIsIHN0cmlwQ29tbWVudHMgPSBmYWxzZSwgc2FmZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIENBVVRJT046IGRvbid0IHVzZSBhcnJvdyBmb3IgdGhpcyBtZXRob2Qgc2luY2Ugd2UgdXNlIGBhcmd1bWVudHNgXG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicpIHJldml2ZXIgPSBhcmd1bWVudHNbMV07XG4gICAgbGV0IGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgaWYgKHNhZmUgfHwgc3RyaXBDb21tZW50cykgZGF0YSA9IHN0cmlwSnNvbkNvbW1lbnRzKGRhdGEpO1xuICAgIGlmICghc2FmZSkgcmV0dXJuIHBhcnNlSlNPTihzdHJpcEJPTShkYXRhKSwgcmV2aXZlciwgZmlsZVBhdGgpO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwYXJzZUpTT04oc3RyaXBCT00oZGF0YSksIHJldml2ZXIsIGZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG59O1xuXG4vKipcbiAqICBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGBzdHJpbmdpZnkoKWAgd2l0aCBgc2FmZWAgb3B0aW9uIGVuYWJsZWQuXG4gKiAgWW91IGNhbiBwYXNzIGEgYGRlY3ljbGVyYCBmdW5jdGlvbiBlaXRoZXIgd2l0aGluIHRoZSBgb3B0aW9uc2Agb2JqZWN0XG4gKiAgb3IgYXMgdGhlIGZvdXJ0aCBhcmd1bWVudC5cbiAqICBAYWxpYXMganNvbi5zdHJpbmdpZnlTYWZlXG4gKi9cbmpzb24uc3RyaW5naWZ5LnNhZmUgPSAodmFsdWUsIG9wdGlvbnMsIHNwYWNlLCBkZWN5Y2xlcikgPT4ge1xuICAgIGxldCBvcHRzID0gaGVscGVyLmdldFN0cmluZ2lmeU9wdGlvbnMob3B0aW9ucywgc3BhY2UpO1xuICAgIGlmIChvcHRzLmlzT2JqKSB7XG4gICAgICAgIGRlY3ljbGVyID0gb3B0aW9ucy5kZWN5Y2xlciB8fCBkZWN5Y2xlcjtcbiAgICB9XG4gICAgcmV0dXJuIHNhZmVTdHJpbmdpZnkodmFsdWUsIG9wdHMucmVwbGFjZXIsIG9wdHMuc3BhY2UsIGRlY3ljbGVyKTtcbn07XG5cbi8qKlxuICogIFN5bmNocm9ub3VzbHkgd3JpdGVzIGEgSlNPTiBmaWxlIGZyb20gdGhlIGdpdmVuIEphdmFTY3JpcHQgb2JqZWN0LlxuICogIEBhbGlhcyBqc29uLndyaXRlU3luY1xuICpcbiAqICBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAqICAgICAgICAgUGF0aCB0byBKU09OIGZpbGUgdG8gYmUgd3JpdHRlbi5cbiAqICBAcGFyYW0geyp9IGRhdGFcbiAqICAgICAgICAgRGF0YSB0byBiZSBzdHJpbmdpZmllZCBpbnRvIEpTT04uXG4gKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogICAgICAgICBTdHJpbmdpZnkgLyB3cml0ZSBvcHRpb25zIG9yIHJlcGxhY2VyIGZ1bmN0aW9uLlxuICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5PFN0cmluZz59IFtvcHRpb25zLnJlcGxhY2VyXVxuICogICAgICAgICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICogICAgICAgICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICogICAgICAgICBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IFtvcHRpb25zLnNwYWNlXVxuICogICAgICAgICAgICAgICAgU3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvbiBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCxcbiAqICAgICAgICAgICAgICAgIHRoZSB0ZXh0IHdpbGwgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYVxuICogICAgICAgICAgICAgICAgbnVtYmVyLCBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbiAqICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLCBpdCBjb250YWluc1xuICogICAgICAgICAgICAgICAgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbiAqICAgICAgICAgQHBhcmFtIHtOdW1iZXJ9IFttb2RlPTQzOF1cbiAqICAgICAgICAgICAgICAgIEZpbGVTeXN0ZW0gcGVybWlzc2lvbiBtb2RlIHRvIGJlIHVzZWQgd2hlbiB3cml0aW5nIHRoZSBmaWxlLlxuICogICAgICAgICAgICAgICAgRGVmYXVsdCBpcyBgNDM4YCAoMDY2NiBpbiBvY3RhbCkuXG4gKiAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW2F1dG9QYXRoPXRydWVdXG4gKiAgICAgICAgICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBjcmVhdGUgcGF0aCBkaXJlY3RvcmllcyBpZiB0aGV5IGRvbid0XG4gKiAgICAgICAgICAgICAgICBleGlzdC4gVGhpcyB3aWxsIHRocm93IGlmIHNldCB0byBgZmFsc2VgIGFuZCBkaXJlY3RvcnkgcGF0aFxuICogICAgICAgICAgICAgICAgZG9lcyBub3QgZXhpc3QuXG4gKiAgQHJldHVybnMge3ZvaWR9XG4gKi9cbmpzb24ud3JpdGUuc3luYyA9IGZ1bmN0aW9uIChmaWxlUGF0aCwgZGF0YSwgeyByZXBsYWNlciwgc3BhY2UsIG1vZGUgPSA0MzgsIGF1dG9QYXRoID0gdHJ1ZSB9ID0ge30pIHtcbiAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzJdID09PSAnZnVuY3Rpb24nKSByZXBsYWNlciA9IGFyZ3VtZW50c1syXTtcbiAgICBpZiAoYXV0b1BhdGgpIG1rZGlycC5zeW5jKHBhdGguZGlybmFtZShmaWxlUGF0aCksIHsgZnMgfSk7XG4gICAgbGV0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhLCByZXBsYWNlciwgc3BhY2UpO1xuICAgIHJldHVybiBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBgJHtjb250ZW50fVxcbmAsIHtcbiAgICAgICAgbW9kZSxcbiAgICAgICAgZW5jb2Rpbmc6ICd1dGY4J1xuICAgIH0pO1xufTtcblxuLy8gR2VuZXJhdGUgbG9nZ2VyIG1ldGhvZHNcblxuWydsb2cnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaChmbiA9PiB7XG4gICAganNvbltmbl0gPSBoZWxwZXIuZ2V0TG9nZ2VyKGZuKTtcbiAgICBqc29uW2ZuXS5wcmV0dHkgPSBqc29uW2ZuICsgJ1ByZXR0eSddID0gaGVscGVyLmdldExvZ2dlcihmbiwgdHJ1ZSk7XG59KTtcblxuLy8gQWxpYXNlc1xuXG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG5qc29uLnBhcnNlU2FmZSA9IGpzb24ucGFyc2Uuc2FmZTtcbi8qKlxuICogIEBwcml2YXRlXG4gKi9cbmpzb24uc3RyaW5naWZ5U2FmZSA9IGpzb24uc3RyaW5naWZ5LnNhZmU7XG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG5qc29uLndyaXRlU3luYyA9IGpzb24ud3JpdGUuc3luYztcbi8qKlxuICogIEBwcml2YXRlXG4gKi9cbmpzb24ucmVhZFN5bmMgPSBqc29uLnJlYWQuc3luYztcblxuLy8gRXhwb3J0XG5cbmV4cG9ydCBkZWZhdWx0IGpzb247XG4iXX0=