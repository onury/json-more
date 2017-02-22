'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var helper = {
    isPrimitive: function isPrimitive(value) {
        var t = typeof value === 'undefined' ? 'undefined' : _typeof(value);
        return value === null || value === undefined || t !== 'function' && t !== 'object';
    },
    strLog: function strLog(value) {
        var pretty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (helper.isPrimitive(value)) return value;
        var s = pretty ? '  ' : null;
        return (0, _jsonStringifySafe2.default)(value, null, s);
    },
    getLogger: function getLogger(fn) {
        var pretty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (fn === 'error') {
            return function () {
                var _console;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (_console = console).log.apply(_console, _toConsumableArray(args.map(function (arg) {
                    return arg instanceof Error ? arg.stack || arg.message || String(arg) : helper.strLog(arg, pretty);
                })));
            };
        }
        return function () {
            var _console2;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            (_console2 = console).log.apply(_console2, _toConsumableArray(args.map(function (arg) {
                return helper.strLog(arg, pretty);
            })));
        };
    },
    getStringifyOptions: function getStringifyOptions(options, indent) {
        var replacer = void 0,
            space = void 0,
            isObj = false;

        if (!options) {
            replacer = null;
            space = indent;
        } else if (typeof options === 'function' || Array.isArray(options)) {
            replacer = options;
            space = indent;
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            replacer = options.replacer;
            space = options.indent;
            isObj = true;
        }

        return {
            replacer: replacer,
            space: space,
            isObj: isObj
        };
    }
};

exports.default = helper;