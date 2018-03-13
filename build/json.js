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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uLmpzIl0sIm5hbWVzIjpbInByb21pc2UiLCJyZWFkRmlsZSIsIndyaXRlRmlsZSIsIm1rZGlycCIsImpzb24iLCJzdHIiLCJyZXZpdmVyIiwic3RyaXBDb21tZW50cyIsInNhZmUiLCJhcmd1bWVudHMiLCJlcnIiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzcGFjZSIsIm9wdHMiLCJnZXRTdHJpbmdpZnlPcHRpb25zIiwiZGVjeWNsZXIiLCJpc09iaiIsIkJvb2xlYW4iLCJyZXBsYWNlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJvIiwid2hpdGVzcGFjZSIsInBhcnNlIiwiZmlsZVBhdGgiLCJ0aGVuIiwiZGF0YSIsIm1vZGUiLCJhdXRvUGF0aCIsInJlc29sdmUiLCJkaXJuYW1lIiwiZnMiLCJjb250ZW50IiwiZW5jb2RpbmciLCJyZWFkIiwic3luYyIsInJlYWRGaWxlU3luYyIsIndyaXRlIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJmbiIsImdldExvZ2dlciIsInByZXR0eSIsInBhcnNlU2FmZSIsInN0cmluZ2lmeVNhZmUiLCJ3cml0ZVN5bmMiLCJyZWFkU3luYyJdLCJtYXBwaW5ncyI6ImduQkFBQSxrQztBQUNBLDRCO0FBQ0EseUM7QUFDQSw0QjtBQUNBLCtDO0FBQ0Esd0Q7QUFDQSx3RDtBQUNBLHVDO0FBQ0EscUM7QUFDQSxnQzs7QUFFQTs7O0FBR0EsSUFBTUEsVUFBVTtBQUNaQyxjQUFVLHlCQUFVLHFCQUFHQSxRQUFiLHVCQURFO0FBRVpDLGVBQVcseUJBQVUscUJBQUdBLFNBQWIsdUJBRkM7QUFHWkMsWUFBUSwwQ0FISSxFQUFoQjs7O0FBTUE7Ozs7QUFJTUMsSTs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDYUMsVyxFQUE0RCxnRkFBSixFQUFJLENBQXJEQyxPQUFxRCxRQUFyREEsT0FBcUQsMkJBQTVDQyxhQUE0QyxDQUE1Q0EsYUFBNEMsc0NBQTVCLEtBQTRCLHVDQUFyQkMsSUFB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QUFLMEMsU0FBTCxHQUFpQjFDLEtBQUtrQyxLQUFMLENBQVdGLElBQTVCO0FBQ0E7OztBQUdBaEMsS0FBSzJDLFFBQUwsR0FBZ0IzQyxLQUFLK0IsSUFBTCxDQUFVQyxJQUExQjs7QUFFQTs7QUFFZWhDLEkiLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoZWxwZXIgZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZ3JhY2VmdWwtZnMnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAneWFrdSc7XG5pbXBvcnQgcHJvbWlzaWZ5IGZyb20gJ3lha3UvbGliL3Byb21pc2lmeSc7XG5pbXBvcnQgc3RyaXBKc29uQ29tbWVudHMgZnJvbSAnc3RyaXAtanNvbi1jb21tZW50cyc7XG5pbXBvcnQgc2FmZVN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcbmltcG9ydCBwYXJzZUpTT04gZnJvbSAncGFyc2UtanNvbic7XG5pbXBvcnQgc3RyaXBCT00gZnJvbSAnc3RyaXAtYm9tJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcblxuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuY29uc3QgcHJvbWlzZSA9IHtcbiAgICByZWFkRmlsZTogcHJvbWlzaWZ5KGZzLnJlYWRGaWxlLCBmcyksXG4gICAgd3JpdGVGaWxlOiBwcm9taXNpZnkoZnMud3JpdGVGaWxlLCBmcyksXG4gICAgbWtkaXJwOiBwcm9taXNpZnkobWtkaXJwKVxufTtcblxuLyoqXG4gKiAgSlNPTiB1dGlsaXR5IGNsYXNzIHRoYXQgcHJvdmlkZXMgZXh0cmEgZnVuY3Rpb25hbGl0eSBzdWNoIGFzIHN0cmlwcGluZ1xuICogIGNvbW1lbnRzLCBzYWZlbHkgcGFyc2luZyBKU09OIHN0cmluZ3Mgd2l0aCBjaXJjdWxhciByZWZlcmVuY2VzLCBldGMuLi5cbiAqL1xuY2xhc3MganNvbiB7XG5cbiAgICAvKipcbiAgICAgKiAgUGFyc2VzIHRoZSBnaXZlbiBKU09OIHN0cmluZyBpbnRvIGEgSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIFRoaXMgcHJvdmlkZXMgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoIG5hdGl2ZSBgSlNPTi5wYXJzZSgpYCB3aXRoXG4gICAgICogIHNvbWUgZXh0cmEgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gc3RyIC0gSlNPTiBzdHJpbmcgdG8gYmUgcGFyc2VkLlxuICAgICAqICBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBFaXRoZXIgYSByZXZpdmVyIGZ1bmN0aW9uIG9yIHBhcnNlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMucmV2aXZlcj1udWxsXVxuICAgICAqICAgICAgICAgICAgICAgIEEgZnVuY3Rpb24gdGhhdCBjYW4gZmlsdGVyIGFuZCB0cmFuc2Zvcm0gdGhlIHJlc3VsdHMuXG4gICAgICogICAgICAgICAgICAgICAgSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLCBhbmQgaXRzIHJldHVyblxuICAgICAqICAgICAgICAgICAgICAgIHZhbHVlIGlzIHVzZWQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gICAgICogICAgICAgICAgICAgICAgSWYgaXQgcmV0dXJucyB3aGF0IGl0IHJlY2VpdmVkLCB0aGVuIHRoZSBzdHJ1Y3R1cmUgaXMgbm90XG4gICAgICogICAgICAgICAgICAgICAgbW9kaWZpZWQuIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpc1xuICAgICAqICAgICAgICAgICAgICAgIGRlbGV0ZWQuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN0cmlwQ29tbWVudHM9ZmFsc2VdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBzdHJpcCBjb21tZW50cyBmcm9tIHRoZSBKU09OIHN0cmluZy5cbiAgICAgKiAgICAgICAgICAgICAgICBOb3RlIHRoYXQgaXQgd2lsbCB0aHJvdyBpZiB0aGlzIGlzIHNldCB0byBgZmFsc2VgIGFuZFxuICAgICAqICAgICAgICAgICAgICAgIHRoZSBzdHJpbmcgaW5jbHVkZXMgY29tbWVudHMuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNhZmU9ZmFsc2VdXG4gICAgICogICAgICAgICAgICAgICAgV2hldGhlciB0byBzYWZlbHkgcGFyc2Ugd2l0aGluIGEgdHJ5L2NhdGNoIGJsb2NrIHJldHVybiBhblxuICAgICAqICAgICAgICAgICAgICAgIGBFcnJvcmAgaW5zdGFuY2UgaWYgcGFyc2UgZmFpbHMuXG4gICAgICogICAgICAgICAgICAgICAgSWYgYHNhZmVgIG9wdGlvbiBzZXQgdG8gYHRydWVgLCBjb21tZW50cyBhcmUgZm9yY2UtcmVtb3ZlZFxuICAgICAqICAgICAgICAgICAgICAgIGZyb20gdGhlIEpTT04gc3RyaW5nLCByZWdhcmxlc3Mgb2YgdGhlIGBzdHJpcENvbW1lbnRzYFxuICAgICAqICAgICAgICAgICAgICAgIG9wdGlvbi5cbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7KnxFcnJvcn0gLSBQYXJzZWQgdmFsdWUuIElmIGBzYWZlYCBvcHRpb24gaXMgZW5hYmxlZCwgcmV0dXJucyBhblxuICAgICAqICBgRXJyb3JgIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogIEBleGFtcGxlXG4gICAgICogIHZhciBwYXJzZWQgPSBqc29uLnBhcnNlKHN0ciwgeyBzYWZlOiB0cnVlIH0pO1xuICAgICAqICBpZiAocGFyc2VkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKCdQYXJzZSBmYWlsZWQ6JywgcGFyc2VkKTtcbiAgICAgKiAgfSBlbHNlIHtcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKHBhcnNlZCk7XG4gICAgICogIH1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc3RyLCB7IHJldml2ZXIsIHN0cmlwQ29tbWVudHMgPSBmYWxzZSwgc2FmZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykgcmV2aXZlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKHNhZmUgfHwgc3RyaXBDb21tZW50cykgc3RyID0gc3RyaXBKc29uQ29tbWVudHMoc3RyKTtcbiAgICAgICAgaWYgKCFzYWZlKSByZXR1cm4gcGFyc2VKU09OKHN0ciwgcmV2aXZlcik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VKU09OKHN0ciwgcmV2aXZlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBPdXRwdXRzIGEgSlNPTiBzdHJpbmcgZnJvbSB0aGUgZ2l2ZW4gSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIFRoaXMgcHJvdmlkZXMgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoIG5hdGl2ZSBgSlNPTi5zdHJpbmdpZnkoKWBcbiAgICAgKiAgd2l0aCBzb21lIGV4dHJhIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHsqfSB2YWx1ZSAtIEphdmFTY3JpcHQgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufEFycmF5fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgIEEgcmVwbGFjZXIgb3Igc3RyaW5naWZ5IG9wdGlvbnMuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufEFycmF5PFN0cmluZz59IFtvcHRpb25zLnJlcGxhY2VyXVxuICAgICAqICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAgICAgKiAgICAgICAgIFNwZWNpZmllcyB0aGUgaW5kZW50YXRpb24gb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsXG4gICAgICogICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAgICAgKiAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gICAgICogICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSwgaXQgY29udGFpbnNcbiAgICAgKiAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtvcHRpb25zLnNhZmU9ZmFsc2VdXG4gICAgICogICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBzYWZlbHkgc3RyaW5naWZ5IHRoZSBnaXZlbiBvYmplY3QgYW5kXG4gICAgICogICAgICAgICByZXR1cm4gdGhlIHN0cmluZyBgXCJbQ2lyY3VsYXJdXCJgIGZvciBlYWNoIGNpcmN1bGFyIHJlZmVyZW5jZS5cbiAgICAgKiAgICAgICAgIFlvdSBjYW4gcGFzcyBhIGN1c3RvbSBkZWN5Y2xlciBmdW5jdGlvbiBpbnN0ZWFkLCB3aXRoIHRoZVxuICAgICAqICAgICAgICAgZm9sbG93aW5nIHNpZ25hdHVyZTogYGZ1bmN0aW9uKGssIHYpIHsgfWAuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW3NwYWNlXVxuICAgICAqICAgICAgICAgVGhpcyB0YWtlcyBlZmZlY3QgaWYgc2Vjb25kIGFyZ3VtZW50IGlzIHRoZSBgcmVwbGFjZXJgIG9yIGZhbHN5LlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucywgc3BhY2UpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBoZWxwZXIuZ2V0U3RyaW5naWZ5T3B0aW9ucyhvcHRpb25zLCBzcGFjZSk7XG4gICAgICAgIGxldCBzYWZlLCBkZWN5Y2xlcjtcbiAgICAgICAgaWYgKG9wdHMuaXNPYmopIHtcbiAgICAgICAgICAgIGRlY3ljbGVyID0gdHlwZW9mIG9wdGlvbnMuc2FmZSA9PT0gJ2Z1bmN0aW9uJyA/IHNhZmUgOiBudWxsO1xuICAgICAgICAgICAgc2FmZSA9IEJvb2xlYW4ob3B0aW9ucy5zYWZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzYWZlKSByZXR1cm4gc2FmZVN0cmluZ2lmeSh2YWx1ZSwgb3B0cy5yZXBsYWNlciwgb3B0cy5zcGFjZSwgZGVjeWNsZXIpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG9wdHMucmVwbGFjZXIsIG9wdHMuc3BhY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBVZ2xpZmllcyB0aGUgZ2l2ZW4gSlNPTiBzdHJpbmcuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBKU09OIHN0cmluZyB0byBiZSB1Z2xpZmllZC5cbiAgICAgKiAgQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgdWdsaWZ5KHN0cikge1xuICAgICAgICBsZXQgbyA9IHBhcnNlSlNPTihzdHJpcEpzb25Db21tZW50cyhzdHIsIHsgd2hpdGVzcGFjZTogZmFsc2UgfSkpO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEJlYXV0aWZpZXMgdGhlIGdpdmVuIEpTT04gc3RyaW5nLlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgICogICAgICAgICBKU09OIHN0cmluZyB0byBiZSBiZWF1dGlmaWVkLlxuICAgICAqICBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IFtzcGFjZT0yXVxuICAgICAqICAgICAgICAgU3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvbiBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCxcbiAgICAgKiAgICAgICAgIHRoZSB0ZXh0IHdpbGwgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYVxuICAgICAqICAgICAgICAgbnVtYmVyLCBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbiAgICAgKiAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLCBpdCBjb250YWluc1xuICAgICAqICAgICAgICAgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbiAgICAgKiAgQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgYmVhdXRpZnkoc3RyLCBzcGFjZSA9IDIpIHtcbiAgICAgICAgbGV0IG8gPSBwYXJzZUpTT04oc3RyaXBKc29uQ29tbWVudHMoc3RyLCB7IHdoaXRlc3BhY2U6IGZhbHNlIH0pKTtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG8sIG51bGwsIHNwYWNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgTm9ybWFsaXplcyB0aGUgZ2l2ZW4gdmFsdWUgYnkgc3RyaW5naWZ5aW5nIGFuZCBwYXJzaW5nIGl0IGJhY2sgdG8gYVxuICAgICAqICBKYXZhc2NyaXB0IG9iamVjdC5cbiAgICAgKiAgQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqICBAcGFyYW0ge09iamVjdHxGdW5jdGlvbnxBcnJheX0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBBIHJlcGxhY2VyIG9yIG5vcm1hbGl6ZSBvcHRpb25zLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbnxBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5yZXBsYWNlcl1cbiAgICAgKiAgICAgICAgIERldGVybWluZXMgaG93IG9iamVjdCB2YWx1ZXMgYXJlIG5vcm1hbGl6ZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBbb3B0aW9ucy5zYWZlPWZhbHNlXVxuICAgICAqICAgICAgICAgU3BlY2lmaWVzIHdoZXRoZXIgdG8gc2FmZWx5IG5vcm1hbGl6ZSB0aGUgZ2l2ZW4gb2JqZWN0IGFuZFxuICAgICAqICAgICAgICAgcmV0dXJuIHRoZSBzdHJpbmcgYFwiW0NpcmN1bGFyXVwiYCBmb3IgZWFjaCBjaXJjdWxhciByZWZlcmVuY2UuXG4gICAgICogICAgICAgICBZb3UgY2FuIHBhc3MgYSBjdXN0b20gZGVjeWNsZXIgZnVuY3Rpb24gaW5zdGVhZCwgd2l0aCB0aGVcbiAgICAgKiAgICAgICAgIGZvbGxvd2luZyBzaWduYXR1cmU6IGBmdW5jdGlvbihrLCB2KSB7IH1gLlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxpemUodmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGpzb24ucGFyc2UoanNvbi5zdHJpbmdpZnkodmFsdWUsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgQXN5bmNocm9ub3VzbHkgcmVhZHMgYSBKU09OIGZpbGUsIHN0cmlwcyBVVEYtOCBCT00gYW5kIHBhcnNlcyB0aGUgSlNPTlxuICAgICAqICBjb250ZW50LlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAgICAgKiAgICAgICAgIFBhdGggdG8gSlNPTiBmaWxlLlxuICAgICAqICBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29wdGlvbnNdXG4gICAgICogICAgICAgICBFaXRoZXIgYSByZXZpdmVyIGZ1bmN0aW9uIG9yIHJlYWQgb3B0aW9ucyBvYmplY3QuXG4gICAgICogICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5yZXZpdmVyPW51bGxdXG4gICAgICogICAgICAgICAgICAgICAgQSBmdW5jdGlvbiB0aGF0IGNhbiBmaWx0ZXIgYW5kIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy5cbiAgICAgKiAgICAgICAgICAgICAgICBJdCByZWNlaXZlcyBlYWNoIG9mIHRoZSBrZXlzIGFuZCB2YWx1ZXMsIGFuZCBpdHMgcmV0dXJuXG4gICAgICogICAgICAgICAgICAgICAgdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICAgKiAgICAgICAgICAgICAgICBJZiBpdCByZXR1cm5zIHdoYXQgaXQgcmVjZWl2ZWQsIHRoZW4gdGhlIHN0cnVjdHVyZSBpcyBub3RcbiAgICAgKiAgICAgICAgICAgICAgICBtb2RpZmllZC4gSWYgaXQgcmV0dXJucyB1bmRlZmluZWQgdGhlbiB0aGUgbWVtYmVyIGlzXG4gICAgICogICAgICAgICAgICAgICAgZGVsZXRlZC5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc3RyaXBDb21tZW50cz1mYWxzZV1cbiAgICAgKiAgICAgICAgICAgICAgICBXaGV0aGVyIHRvIHN0cmlwIGNvbW1lbnRzIGZyb20gdGhlIEpTT04gc3RyaW5nLlxuICAgICAqICAgICAgICAgICAgICAgIE5vdGUgdGhhdCBpdCB3aWxsIHRocm93IGlmIHRoaXMgaXMgc2V0IHRvIGBmYWxzZWAgYW5kXG4gICAgICogICAgICAgICAgICAgICAgdGhlIHN0cmluZyBpbmNsdWRlcyBjb21tZW50cy5cbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7UHJvbWlzZTwqPn1cbiAgICAgKiAgICAgICAgICAgUGFyc2VkIEpTT04gY29udGVudCBhcyBhIEphdmFTY3JpcHQgb2JqZWN0LlxuICAgICAqL1xuICAgIHN0YXRpYyByZWFkKGZpbGVQYXRoLCB7IHJldml2ZXIsIHN0cmlwQ29tbWVudHMgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgLy8gQ0FVVElPTjogZG9uJ3QgdXNlIGFycm93IGZvciB0aGlzIG1ldGhvZCBzaW5jZSB3ZSB1c2UgYGFyZ3VtZW50c2BcbiAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicpIHJldml2ZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHJldHVybiBwcm9taXNlLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaXBDb21tZW50cykgZGF0YSA9IHN0cmlwSnNvbkNvbW1lbnRzKGRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUpTT04oc3RyaXBCT00oZGF0YSksIHJldml2ZXIsIGZpbGVQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBBc3luY2hyb25vdXNseSB3cml0ZXMgYSBKU09OIGZpbGUgZnJvbSB0aGUgZ2l2ZW4gSmF2YVNjcmlwdCBvYmplY3QuXG4gICAgICogIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aFxuICAgICAqICAgICAgICAgUGF0aCB0byBKU09OIGZpbGUgdG8gYmUgd3JpdHRlbi5cbiAgICAgKiAgQHBhcmFtIHsqfSBkYXRhXG4gICAgICogICAgICAgICBEYXRhIHRvIGJlIHN0cmluZ2lmaWVkIGludG8gSlNPTi5cbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAqICAgICAgICAgU3RyaW5naWZ5IC8gd3JpdGUgb3B0aW9ucyBvciByZXBsYWNlciBmdW5jdGlvbi5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7RnVuY3Rpb258QXJyYXk8U3RyaW5nPn0gW29wdGlvbnMucmVwbGFjZXJdXG4gICAgICogICAgICAgICAgICAgICAgRGV0ZXJtaW5lcyBob3cgb2JqZWN0IHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhblxuICAgICAqICAgICAgICAgICAgICAgIGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAgICAgKiAgICAgICAgIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW29wdGlvbnMuc3BhY2VdXG4gICAgICogICAgICAgICAgICAgICAgU3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvbiBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCxcbiAgICAgKiAgICAgICAgICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAgICAgKiAgICAgICAgICAgICAgICBudW1iZXIsIGl0IHdpbGwgc3BlY2lmeSB0aGUgbnVtYmVyIG9mIHNwYWNlcyB0byBpbmRlbnQgYXQgZWFjaFxuICAgICAqICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLCBpdCBjb250YWluc1xuICAgICAqICAgICAgICAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gICAgICogICAgICAgICBAcGFyYW0ge051bWJlcn0gW21vZGU9NDM4XVxuICAgICAqICAgICAgICAgICAgICAgIEZpbGVTeXN0ZW0gcGVybWlzc2lvbiBtb2RlIHRvIGJlIHVzZWQgd2hlbiB3cml0aW5nIHRoZSBmaWxlLlxuICAgICAqICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgYDQzOGAgKDA2NjYgaW4gb2N0YWwpLlxuICAgICAqICAgICAgICAgQHBhcmFtIHtCb29sZWFufSBbYXV0b1BhdGg9dHJ1ZV1cbiAgICAgKiAgICAgICAgICAgICAgICBTcGVjaWZpZXMgd2hldGhlciB0byBjcmVhdGUgcGF0aCBkaXJlY3RvcmllcyBpZiB0aGV5IGRvbid0XG4gICAgICogICAgICAgICAgICAgICAgZXhpc3QuIFRoaXMgd2lsbCB0aHJvdyBpZiBzZXQgdG8gYGZhbHNlYCBhbmQgcGF0aCBkb2VzIG5vdFxuICAgICAqICAgICAgICAgICAgICAgIGV4aXN0LlxuICAgICAqICBAcmV0dXJucyB7UHJvbWlzZTwqPn1cbiAgICAgKi9cbiAgICBzdGF0aWMgd3JpdGUoZmlsZVBhdGgsIGRhdGEsIHsgcmVwbGFjZXIsIHNwYWNlLCBtb2RlID0gNDM4LCBhdXRvUGF0aCA9IHRydWUgfSA9IHt9KSB7XG4gICAgICAgIC8vIENBVVRJT046IGRvbid0IHVzZSBhcnJvdyBmb3IgdGhpcyBtZXRob2Qgc2luY2Ugd2UgdXNlIGBhcmd1bWVudHNgXG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzJdID09PSAnZnVuY3Rpb24nKSByZXBsYWNlciA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dG9QYXRoKSByZXR1cm4gcHJvbWlzZS5ta2RpcnAocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgeyBmcyB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhLCByZXBsYWNlciwgc3BhY2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLndyaXRlRmlsZShmaWxlUGF0aCwgYCR7Y29udGVudH1cXG5gLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuXG4vLyBEZWVwIG1ldGhvZHNcblxuLyoqXG4gKiAgQ29udmVuaWVuY2UgbWV0aG9kIGZvciBgcGFyc2UoKWAgd2l0aCBgc2FmZWAgb3B0aW9uIGVuYWJsZWQuXG4gKiAgQGFsaWFzIGpzb24ucGFyc2VTYWZlXG4gKi9cbmpzb24ucGFyc2Uuc2FmZSA9IGZ1bmN0aW9uIChzdHIsIHsgcmV2aXZlciB9ID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykgcmV2aXZlciA9IGFyZ3VtZW50c1sxXTtcbiAgICByZXR1cm4ganNvbi5wYXJzZShzdHIsIHsgcmV2aXZlciwgc2FmZTogdHJ1ZSB9KTtcbn07XG5cbi8qKlxuICogIFN5bmNocm9ub3VzbHkgcmVhZHMgYSBKU09OIGZpbGUsIHN0cmlwcyBVVEYtOCBCT00gYW5kIHBhcnNlcyB0aGUgSlNPTlxuICogIGNvbnRlbnQuXG4gKiAgQGFsaWFzIGpzb24ucmVhZFN5bmNcbiAqXG4gKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gKiAgICAgICAgIFBhdGggdG8gSlNPTiBmaWxlLlxuICogIEByZXR1cm5zIHsqfEVycm9yfVxuICogICAgICAgICAgIFBhcnNlZCBKU09OIGNvbnRlbnQgYXMgYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqICAgICAgICAgICBJZiBwYXJzZSBmYWlscywgcmV0dXJucyBhbiBgRXJyb3JgIGluc3RhbmNlLlxuICovXG5qc29uLnJlYWQuc3luYyA9IGZ1bmN0aW9uIChmaWxlUGF0aCwgeyByZXZpdmVyLCBzdHJpcENvbW1lbnRzID0gZmFsc2UsIHNhZmUgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyBDQVVUSU9OOiBkb24ndCB1c2UgYXJyb3cgZm9yIHRoaXMgbWV0aG9kIHNpbmNlIHdlIHVzZSBgYXJndW1lbnRzYFxuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSByZXZpdmVyID0gYXJndW1lbnRzWzFdO1xuICAgIGxldCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgIGlmIChzYWZlIHx8IHN0cmlwQ29tbWVudHMpIGRhdGEgPSBzdHJpcEpzb25Db21tZW50cyhkYXRhKTtcbiAgICBpZiAoIXNhZmUpIHJldHVybiBwYXJzZUpTT04oc3RyaXBCT00oZGF0YSksIHJldml2ZXIsIGZpbGVQYXRoKTtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcGFyc2VKU09OKHN0cmlwQk9NKGRhdGEpLCByZXZpdmVyLCBmaWxlUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgfVxufTtcblxuLyoqXG4gKiAgQ29udmVuaWVuY2UgbWV0aG9kIGZvciBgc3RyaW5naWZ5KClgIHdpdGggYHNhZmVgIG9wdGlvbiBlbmFibGVkLlxuICogIFlvdSBjYW4gcGFzcyBhIGBkZWN5Y2xlcmAgZnVuY3Rpb24gZWl0aGVyIHdpdGhpbiB0aGUgYG9wdGlvbnNgIG9iamVjdFxuICogIG9yIGFzIHRoZSBmb3VydGggYXJndW1lbnQuXG4gKiAgQGFsaWFzIGpzb24uc3RyaW5naWZ5U2FmZVxuICovXG5qc29uLnN0cmluZ2lmeS5zYWZlID0gKHZhbHVlLCBvcHRpb25zLCBzcGFjZSwgZGVjeWNsZXIpID0+IHtcbiAgICBsZXQgb3B0cyA9IGhlbHBlci5nZXRTdHJpbmdpZnlPcHRpb25zKG9wdGlvbnMsIHNwYWNlKTtcbiAgICBpZiAob3B0cy5pc09iaikge1xuICAgICAgICBkZWN5Y2xlciA9IG9wdGlvbnMuZGVjeWNsZXIgfHwgZGVjeWNsZXI7XG4gICAgfVxuICAgIHJldHVybiBzYWZlU3RyaW5naWZ5KHZhbHVlLCBvcHRzLnJlcGxhY2VyLCBvcHRzLnNwYWNlLCBkZWN5Y2xlcik7XG59O1xuXG4vKipcbiAqICBTeW5jaHJvbm91c2x5IHdyaXRlcyBhIEpTT04gZmlsZSBmcm9tIHRoZSBnaXZlbiBKYXZhU2NyaXB0IG9iamVjdC5cbiAqICBAYWxpYXMganNvbi53cml0ZVN5bmNcbiAqXG4gKiAgQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gKiAgICAgICAgIFBhdGggdG8gSlNPTiBmaWxlIHRvIGJlIHdyaXR0ZW4uXG4gKiAgQHBhcmFtIHsqfSBkYXRhXG4gKiAgICAgICAgIERhdGEgdG8gYmUgc3RyaW5naWZpZWQgaW50byBKU09OLlxuICogIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqICAgICAgICAgU3RyaW5naWZ5IC8gd3JpdGUgb3B0aW9ucyBvciByZXBsYWNlciBmdW5jdGlvbi5cbiAqICAgICAgICAgQHBhcmFtIHtGdW5jdGlvbnxBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5yZXBsYWNlcl1cbiAqICAgICAgICAgICAgICAgIERldGVybWluZXMgaG93IG9iamVjdCB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkIGZvciBvYmplY3RzLiBJdCBjYW5cbiAqICAgICAgICAgICAgICAgIGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqICAgICAgICAgQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBbb3B0aW9ucy5zcGFjZV1cbiAqICAgICAgICAgICAgICAgIFNwZWNpZmllcyB0aGUgaW5kZW50YXRpb24gb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsXG4gKiAgICAgICAgICAgICAgICB0aGUgdGV4dCB3aWxsIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGFcbiAqICAgICAgICAgICAgICAgIG51bWJlciwgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gKiAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSwgaXQgY29udGFpbnNcbiAqICAgICAgICAgICAgICAgIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4gKiAgICAgICAgIEBwYXJhbSB7TnVtYmVyfSBbbW9kZT00MzhdXG4gKiAgICAgICAgICAgICAgICBGaWxlU3lzdGVtIHBlcm1pc3Npb24gbW9kZSB0byBiZSB1c2VkIHdoZW4gd3JpdGluZyB0aGUgZmlsZS5cbiAqICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgYDQzOGAgKDA2NjYgaW4gb2N0YWwpLlxuICogICAgICAgICBAcGFyYW0ge0Jvb2xlYW59IFthdXRvUGF0aD10cnVlXVxuICogICAgICAgICAgICAgICAgU3BlY2lmaWVzIHdoZXRoZXIgdG8gY3JlYXRlIHBhdGggZGlyZWN0b3JpZXMgaWYgdGhleSBkb24ndFxuICogICAgICAgICAgICAgICAgZXhpc3QuIFRoaXMgd2lsbCB0aHJvdyBpZiBzZXQgdG8gYGZhbHNlYCBhbmQgZGlyZWN0b3J5IHBhdGhcbiAqICAgICAgICAgICAgICAgIGRvZXMgbm90IGV4aXN0LlxuICogIEByZXR1cm5zIHt2b2lkfVxuICovXG5qc29uLndyaXRlLnN5bmMgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIGRhdGEsIHsgcmVwbGFjZXIsIHNwYWNlLCBtb2RlID0gNDM4LCBhdXRvUGF0aCA9IHRydWUgfSA9IHt9KSB7XG4gICAgLy8gQ0FVVElPTjogZG9uJ3QgdXNlIGFycm93IGZvciB0aGlzIG1ldGhvZCBzaW5jZSB3ZSB1c2UgYGFyZ3VtZW50c2BcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSA9PT0gJ2Z1bmN0aW9uJykgcmVwbGFjZXIgPSBhcmd1bWVudHNbMl07XG4gICAgaWYgKGF1dG9QYXRoKSBta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB7IGZzIH0pO1xuICAgIGxldCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSwgcmVwbGFjZXIsIHNwYWNlKTtcbiAgICByZXR1cm4gZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgYCR7Y29udGVudH1cXG5gLCB7XG4gICAgICAgIG1vZGUsXG4gICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICB9KTtcbn07XG5cbi8vIEdlbmVyYXRlIGxvZ2dlciBtZXRob2RzXG5cblsnbG9nJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLmZvckVhY2goZm4gPT4ge1xuICAgIGpzb25bZm5dID0gaGVscGVyLmdldExvZ2dlcihmbik7XG4gICAganNvbltmbl0ucHJldHR5ID0ganNvbltmbiArICdQcmV0dHknXSA9IGhlbHBlci5nZXRMb2dnZXIoZm4sIHRydWUpO1xufSk7XG5cbi8vIEFsaWFzZXNcblxuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuanNvbi5wYXJzZVNhZmUgPSBqc29uLnBhcnNlLnNhZmU7XG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG5qc29uLnN0cmluZ2lmeVNhZmUgPSBqc29uLnN0cmluZ2lmeS5zYWZlO1xuLyoqXG4gKiAgQHByaXZhdGVcbiAqL1xuanNvbi53cml0ZVN5bmMgPSBqc29uLndyaXRlLnN5bmM7XG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG5qc29uLnJlYWRTeW5jID0ganNvbi5yZWFkLnN5bmM7XG5cbi8vIEV4cG9ydFxuXG5leHBvcnQgZGVmYXVsdCBqc29uO1xuIl19