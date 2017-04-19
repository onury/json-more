'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _yaku = require('yaku');

var _yaku2 = _interopRequireDefault(_yaku);

var _promisify = require('yaku/lib/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _parseJson = require('parse-json');

var _parseJson2 = _interopRequireDefault(_parseJson);

var _stripBom = require('strip-bom');

var _stripBom2 = _interopRequireDefault(_stripBom);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var promise = {
    readFile: (0, _promisify2.default)(_gracefulFs2.default.readFile, _gracefulFs2.default),
    writeFile: (0, _promisify2.default)(_gracefulFs2.default.writeFile, _gracefulFs2.default),
    mkdirp: (0, _promisify2.default)(_mkdirp2.default)
};

var json = function () {
    function json() {
        _classCallCheck(this, json);
    }

    _createClass(json, null, [{
        key: 'parse',
        value: function parse(str) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                reviver = _ref.reviver,
                _ref$stripComments = _ref.stripComments,
                stripComments = _ref$stripComments === undefined ? false : _ref$stripComments,
                _ref$safe = _ref.safe,
                safe = _ref$safe === undefined ? false : _ref$safe;

            if (typeof arguments[1] === 'function') reviver = arguments[1];
            if (safe || stripComments) str = (0, _stripJsonComments2.default)(str);
            if (!safe) return (0, _parseJson2.default)(str, reviver);
            try {
                return (0, _parseJson2.default)(str, reviver);
            } catch (err) {
                return err;
            }
        }
    }, {
        key: 'stringify',
        value: function stringify(value, options, space) {
            var opts = _helper2.default.getStringifyOptions(options, space);
            var safe = void 0,
                decycler = void 0;
            if (opts.isObj) {
                decycler = typeof options.safe === 'function' ? safe : null;
                safe = Boolean(options.safe);
            }

            if (safe) return (0, _jsonStringifySafe2.default)(value, opts.replacer, opts.space, decycler);
            return JSON.stringify(value, opts.replacer, opts.space);
        }
    }, {
        key: 'uglify',
        value: function uglify(str) {
            var o = (0, _parseJson2.default)((0, _stripJsonComments2.default)(str, { whitespace: false }));
            return JSON.stringify(o);
        }
    }, {
        key: 'beautify',
        value: function beautify(str) {
            var space = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

            var o = (0, _parseJson2.default)((0, _stripJsonComments2.default)(str, { whitespace: false }));
            return JSON.stringify(o, null, space);
        }
    }, {
        key: 'normalize',
        value: function normalize(value, options) {
            return json.parse(json.stringify(value, options));
        }
    }, {
        key: 'read',
        value: function read(filePath) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                reviver = _ref2.reviver,
                _ref2$stripComments = _ref2.stripComments,
                stripComments = _ref2$stripComments === undefined ? false : _ref2$stripComments;

            if (typeof arguments[1] === 'function') reviver = arguments[1];
            return promise.readFile(filePath, 'utf8').then(function (data) {
                if (stripComments) data = (0, _stripJsonComments2.default)(data);
                return (0, _parseJson2.default)((0, _stripBom2.default)(data), reviver, filePath);
            });
        }
    }, {
        key: 'write',
        value: function write(filePath, data) {
            var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                replacer = _ref3.replacer,
                space = _ref3.space,
                _ref3$mode = _ref3.mode,
                mode = _ref3$mode === undefined ? 438 : _ref3$mode,
                _ref3$autoPath = _ref3.autoPath,
                autoPath = _ref3$autoPath === undefined ? true : _ref3$autoPath;

            if (typeof arguments[2] === 'function') replacer = arguments[2];
            return _yaku2.default.resolve().then(function () {
                if (autoPath) return promise.mkdirp(_path2.default.dirname(filePath), { fs: _gracefulFs2.default });
            }).then(function () {
                var content = JSON.stringify(data, replacer, space);
                return promise.writeFile(filePath, content + '\n', {
                    mode: mode,
                    encoding: 'utf8'
                });
            });
        }
    }]);

    return json;
}();

json.parse.safe = function (str) {
    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        reviver = _ref4.reviver;

    if (typeof arguments[1] === 'function') reviver = arguments[1];
    return json.parse(str, { reviver: reviver, safe: true });
};

json.read.sync = function (filePath) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        reviver = _ref5.reviver,
        _ref5$stripComments = _ref5.stripComments,
        stripComments = _ref5$stripComments === undefined ? false : _ref5$stripComments,
        _ref5$safe = _ref5.safe,
        safe = _ref5$safe === undefined ? false : _ref5$safe;

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

json.stringify.safe = function (value, options, space, decycler) {
    var opts = _helper2.default.getStringifyOptions(options, space);
    if (opts.isObj) {
        decycler = options.decycler || decycler;
    }
    return (0, _jsonStringifySafe2.default)(value, opts.replacer, opts.space, decycler);
};

json.write.sync = function (filePath, data) {
    var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        replacer = _ref6.replacer,
        space = _ref6.space,
        _ref6$mode = _ref6.mode,
        mode = _ref6$mode === undefined ? 438 : _ref6$mode,
        _ref6$autoPath = _ref6.autoPath,
        autoPath = _ref6$autoPath === undefined ? true : _ref6$autoPath;

    if (typeof arguments[2] === 'function') replacer = arguments[2];
    if (autoPath) _mkdirp2.default.sync(_path2.default.dirname(filePath), { fs: _gracefulFs2.default });
    var content = JSON.stringify(data, replacer, space);
    return _gracefulFs2.default.writeFileSync(filePath, content + '\n', {
        mode: mode,
        encoding: 'utf8'
    });
};

['log', 'info', 'warn', 'error'].forEach(function (fn) {
    json[fn] = _helper2.default.getLogger(fn);
    json[fn].pretty = json[fn + 'Pretty'] = _helper2.default.getLogger(fn, true);
});

json.parseSafe = json.parse.safe;

json.stringifySafe = json.stringify.safe;

json.writeSync = json.write.sync;

json.readSync = json.read.sync;

exports.default = json;