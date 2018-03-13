'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _jsonStringifySafe = require('json-stringify-safe');var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

var helper = {
    isPrimitive: function isPrimitive(value) {
        var t = typeof value === 'undefined' ? 'undefined' : _typeof(value);
        return value === null ||
        value === undefined ||
        t !== 'function' && t !== 'object';
    },

    strLog: function strLog(value) {var pretty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (helper.isPrimitive(value)) return value;
        var s = pretty ? '  ' : null;
        return (0, _jsonStringifySafe2.default)(value, null, s);
    },

    getLogger: function getLogger(fn) {var pretty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (fn === 'error') {
            return function () {var _console;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
                (_console = console).log.apply(_console, _toConsumableArray(args.map(function (arg) {
                    return arg instanceof Error ?
                    arg.stack || arg.message || String(arg) :
                    helper.strLog(arg, pretty);
                })));
            };
        }
        return function () {var _console2;for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
            (_console2 = console).log.apply(_console2, _toConsumableArray(args.map(function (arg) {return helper.strLog(arg, pretty);})));
        };
    },

    getStringifyOptions: function getStringifyOptions(options, indent) {
        var replacer = void 0,space = void 0,
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
            isObj: isObj };

    } };exports.default =



helper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwiaXNQcmltaXRpdmUiLCJ2YWx1ZSIsInQiLCJ1bmRlZmluZWQiLCJzdHJMb2ciLCJwcmV0dHkiLCJzIiwiZ2V0TG9nZ2VyIiwiZm4iLCJhcmdzIiwibG9nIiwibWFwIiwiYXJnIiwiRXJyb3IiLCJzdGFjayIsIm1lc3NhZ2UiLCJTdHJpbmciLCJnZXRTdHJpbmdpZnlPcHRpb25zIiwib3B0aW9ucyIsImluZGVudCIsInJlcGxhY2VyIiwic3BhY2UiLCJpc09iaiIsIkFycmF5IiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6Im9WQUFBLHdEOztBQUVBLElBQU1BLFNBQVM7QUFDWEMsZUFEVyx1QkFDQ0MsS0FERCxFQUNRO0FBQ2YsWUFBSUMsV0FBV0QsS0FBWCx5Q0FBV0EsS0FBWCxDQUFKO0FBQ0EsZUFBT0EsVUFBVSxJQUFWO0FBQ0lBLGtCQUFVRSxTQURkO0FBRUtELGNBQU0sVUFBTixJQUFvQkEsTUFBTSxRQUZ0QztBQUdILEtBTlU7O0FBUVhFLFVBUlcsa0JBUUpILEtBUkksRUFRbUIsS0FBaEJJLE1BQWdCLHVFQUFQLEtBQU87QUFDMUIsWUFBSU4sT0FBT0MsV0FBUCxDQUFtQkMsS0FBbkIsQ0FBSixFQUErQixPQUFPQSxLQUFQO0FBQy9CLFlBQUlLLElBQUlELFNBQVMsSUFBVCxHQUFnQixJQUF4QjtBQUNBLGVBQU8saUNBQWNKLEtBQWQsRUFBcUIsSUFBckIsRUFBMkJLLENBQTNCLENBQVA7QUFDSCxLQVpVOztBQWNYQyxhQWRXLHFCQWNEQyxFQWRDLEVBY21CLEtBQWhCSCxNQUFnQix1RUFBUCxLQUFPO0FBQzFCLFlBQUlHLE9BQU8sT0FBWCxFQUFvQjtBQUNoQixtQkFBTyxZQUFhLGdEQUFUQyxJQUFTLGdEQUFUQSxJQUFTO0FBQ2hCLHFDQUFRQyxHQUFSLG9DQUFnQkQsS0FBS0UsR0FBTCxDQUFTLGVBQU87QUFDNUIsMkJBQU9DLGVBQWVDLEtBQWY7QUFDREQsd0JBQUlFLEtBQUosSUFBYUYsSUFBSUcsT0FBakIsSUFBNEJDLE9BQU9KLEdBQVAsQ0FEM0I7QUFFRGIsMkJBQU9LLE1BQVAsQ0FBY1EsR0FBZCxFQUFtQlAsTUFBbkIsQ0FGTjtBQUdILGlCQUplLENBQWhCO0FBS0gsYUFORDtBQU9IO0FBQ0QsZUFBTyxZQUFhLGtEQUFUSSxJQUFTLHFEQUFUQSxJQUFTO0FBQ2hCLGtDQUFRQyxHQUFSLHFDQUFnQkQsS0FBS0UsR0FBTCxDQUFTLHVCQUFPWixPQUFPSyxNQUFQLENBQWNRLEdBQWQsRUFBbUJQLE1BQW5CLENBQVAsRUFBVCxDQUFoQjtBQUNILFNBRkQ7QUFHSCxLQTNCVTs7QUE2QlhZLHVCQTdCVywrQkE2QlNDLE9BN0JULEVBNkJrQkMsTUE3QmxCLEVBNkIwQjtBQUNqQyxZQUFJQyxpQkFBSixDQUFjQyxjQUFkO0FBQ0lDLGdCQUFRLEtBRFo7O0FBR0EsWUFBSSxDQUFDSixPQUFMLEVBQWM7QUFDVkUsdUJBQVcsSUFBWDtBQUNBQyxvQkFBUUYsTUFBUjtBQUNILFNBSEQsTUFHTyxJQUFJLE9BQU9ELE9BQVAsS0FBbUIsVUFBbkIsSUFBaUNLLE1BQU1DLE9BQU4sQ0FBY04sT0FBZCxDQUFyQyxFQUE2RDtBQUNoRUUsdUJBQVdGLE9BQVg7QUFDQUcsb0JBQVFGLE1BQVI7QUFDSCxTQUhNLE1BR0EsSUFBSSxRQUFPRCxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQ3BDRSx1QkFBV0YsUUFBUUUsUUFBbkI7QUFDQUMsb0JBQVFILFFBQVFDLE1BQWhCO0FBQ0FHLG9CQUFRLElBQVI7QUFDSDs7QUFFRCxlQUFPO0FBQ0hGLDhCQURHO0FBRUhDLHdCQUZHO0FBR0hDLHdCQUhHLEVBQVA7O0FBS0gsS0FsRFUsRUFBZixDOzs7O0FBc0RldkIsTSIsImZpbGUiOiJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2FmZVN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcblxuY29uc3QgaGVscGVyID0ge1xuICAgIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gICAgICAgIGxldCB0ID0gdHlwZW9mIHZhbHVlO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGxcbiAgICAgICAgICAgICAgICB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfHwgKHQgIT09ICdmdW5jdGlvbicgJiYgdCAhPT0gJ29iamVjdCcpO1xuICAgIH0sXG5cbiAgICBzdHJMb2codmFsdWUsIHByZXR0eSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChoZWxwZXIuaXNQcmltaXRpdmUodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgICAgIGxldCBzID0gcHJldHR5ID8gJyAgJyA6IG51bGw7XG4gICAgICAgIHJldHVybiBzYWZlU3RyaW5naWZ5KHZhbHVlLCBudWxsLCBzKTtcbiAgICB9LFxuXG4gICAgZ2V0TG9nZ2VyKGZuLCBwcmV0dHkgPSBmYWxzZSkge1xuICAgICAgICBpZiAoZm4gPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLihhcmdzLm1hcChhcmcgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYXJnLnN0YWNrIHx8IGFyZy5tZXNzYWdlIHx8IFN0cmluZyhhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGhlbHBlci5zdHJMb2coYXJnLCBwcmV0dHkpO1xuICAgICAgICAgICAgICAgIH0pKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4uKGFyZ3MubWFwKGFyZyA9PiBoZWxwZXIuc3RyTG9nKGFyZywgcHJldHR5KSkpKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZ2V0U3RyaW5naWZ5T3B0aW9ucyhvcHRpb25zLCBpbmRlbnQpIHtcbiAgICAgICAgbGV0IHJlcGxhY2VyLCBzcGFjZSxcbiAgICAgICAgICAgIGlzT2JqID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICByZXBsYWNlciA9IG51bGw7XG4gICAgICAgICAgICBzcGFjZSA9IGluZGVudDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyB8fCBBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXBsYWNlciA9IG9wdGlvbnM7XG4gICAgICAgICAgICBzcGFjZSA9IGluZGVudDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlcGxhY2VyID0gb3B0aW9ucy5yZXBsYWNlcjtcbiAgICAgICAgICAgIHNwYWNlID0gb3B0aW9ucy5pbmRlbnQ7XG4gICAgICAgICAgICBpc09iaiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVwbGFjZXIsXG4gICAgICAgICAgICBzcGFjZSxcbiAgICAgICAgICAgIGlzT2JqXG4gICAgICAgIH07XG4gICAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXI7XG4iXX0=