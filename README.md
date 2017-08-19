# json-more

[![npm](http://img.shields.io/npm/v/json-more.svg)](https://www.npmjs.com/package/json-more)
[![release](https://img.shields.io/github/release/onury/json-more.svg)](https://github.com/onury/json-more)
[![dependencies](https://david-dm.org/onury/json-more.svg)](https://david-dm.org/onury/json-more)
[![license](http://img.shields.io/npm/l/json-more.svg)](https://github.com/onury/json-more/blob/master/LICENSE)
[![maintained](https://img.shields.io/maintenance/yes/2017.svg)](https://github.com/onury/json-more/graphs/punch-card)  

> © 2017, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

More JSON utilities for most JSON things in Node.js  

`npm i json-more --save`

## Features

- Safely stringify objects with circular references.
- Safely parse strings into a JS object or error instance.
- Strip comments from JSON strings.
- Read and auto-parse JSON files gracefully, sync or async (with promises).
- Strips UTF-8 BOM, throws more helpful JSON errors.
- Write JSON files gracefully sync or async (with promises).
- Convenience methods for logging objects as JSON (without worrying about circular references).
- Uglify/beautify JSON strings.
- TypeScript support.

## Usage

```js
const json = require('json-more');
```

## Methods

- [`json.beautify()`](#jsonbeautifystring--space)
- [`json.log()`](#jsonlogargs)
- [`json.log.pretty()`](#jsonlogargs)
- [`json.normalize()`](#jsonnormalizevalue)
- [`json.parse()`](#jsonparsestring--reviver)
- [`json.parse.safe()`](#jsonparsesafe)
- [`json.read()`](#jsonreadfilepath--options)
- [`json.read.sync()`](#jsonreadsync)
- [`json.stringify()`](#jsonstringifyvalue--replacer--space)
- [`json.stringify.safe()`](#jsonstringifysafe)
- [`json.stripComments()`](#jsonstripcommentsstring)
- [`json.uglify()`](#jsonuglifystring)
- [`json.write()`](#jsonwritefilepath-data--options)
- [`json.write.sync()`](#jsonwritesync)

_Instead of dot.dot methods, you can use camelCase aliases.  
e.g. `json.stringifySafe()` instead of `json.stringify.safe()`._

### `json.beautify(string [, space])`

Beautifies the given JSON string.

### `json.log(...args)`

> You can use these convenience logger methods to easily stringify and log objects. Supports `console` methods such as `log()`, `info()`, `warn()` and `error()`. These methods will automatically handle circular references; so they won't throw.

```js
json.log(object);
// to log with indents:
json.log.pretty(object, otherObject);
// warning log  with indents
json.warn.pretty(object);
// error
json.error(error, otherObject);
```
_Note that `.error()` logs the `.stack` property on the `Error` instance arguments, without stringifying the object._

### `json.normalize(string [, options])`

> Normalizes the given value by stringifying and parsing it back to a Javascript object.

**`options`**:_`Object|Function`_  
See [`.stringify()`](#jsonstringifyvalue--replacer--space) options.

```js
var c = new SomeClass();
c.constructor.name // —> "SomeClass"
json.normalize(c).constructor.name // —> "Object"
```

### `json.parse(string [, reviver])`

> Parses the given JSON string into a JavaScript object. This provides the same functionality and signature as native `JSON.parse()`.

_For some extra options you can prefer the following overload:_

### `json.parse(string [, options])`  

**`options`**:_`Object|Function`_  
Parse options or reviver function. If an `Object`, it can have the following properties:

- `reviver`:_`Function`_  
A function to filter and transform the results.
- `stripComments`:_`Boolean`_  
Whether to strip comments from the JSON string. Default: `false`
- `safe`:_`Boolean`_  
Whether to safely parse within a try/catch block and return an `Error` instance if parse fails. If `safe` option set to `true`, comments are force-removed from the JSON string, regarless of the `stripComments` option. Default: `false`

```js
var parsed = json.parse(str, { safe: true });
console.log(parsed instanceof Error ? 'Parse failed!' : parsed);
```

### `json.parse.safe()`

> Convenience method for `parse()` with `safe` option enabled. 

### `json.read(filePath [, options])`

> Asynchronously reads a JSON file, strips UTF-8 BOM and parses the JSON content and returns a `Promise`.

**`options`**:_`Object|Function`_  
Parse options or reviver function. If an `Object`, it can have the following properties:

- `reviver`:_`Function`_  
A function to filter and transform the results.
- `stripComments`:_`Boolean`_  
Whether to strip comments from the JSON string. Default: `false`

```js
json.read('./file.json')
  .then(obj => console.log(obj))
  .catch(err => console.log('read failed!'));
```

### `json.read.sync()`

> Synchronous version of [`json.read()`](#jsonreadfilepath--options).

### `json.stringify(value [, replacer] [, space])`
> Outputs a JSON string from the given JavaScript object. This provides the same functionality and signature as native `JSON.stringify()`.

_For some extra options you can prefer the following overload:_

### `json.stringify(value [, options])`

**`options`**:_`Object|Function`_  
Stringify options or replacer function. If an `Object`, it can have the following properties:

- `replacer`:_`Function|Array`_  
Determines how object values are stringified for objects. It can be a function or an array of strings.
- `space`:_`Number|String`_  
Specifies the indentation of nested structures.
- `safe`:_`Boolean|Function`_  
Whether to safely stringify the given object and return the string `"[Circular]"` for each circular reference. You can pass a custom decycler function instead, with the following signature: `function(k, v) { }`. Default: `false`

```js
var obj = { some: 'property' };
console.log(json.stringify(obj));
// pretty output with indents
var pretty = json.stringify(obj, null, 2);
// equivalent to:
pretty = json.stringify(obj, { reviver: null, space: 2 });

console.log(json.parse(pretty));
```

### `json.stringify.safe()`

> Convenience method for `stringify()` with `safe` option enabled. You can pass a `decycler` function either within the `options` object or as the fourth argument.

### `json.stripComments(string)`

> Comments are not a part of the JSON standard. But developers tend to use comments in JSON files (such as configuration files, etc).

```js
// comments will be stripped...
{
    "some": /* special */ "property",
    "value": 1 // don't change this!!!
}
```
To strip comments and parse this:
```js
Json.parse(json.stripComments(str));
// is equivalent to:
json.parse(str, { stripComments: true });

// —> '{"some":"property","value":1}'
```

### `json.uglify(string)`

> Uglifies the given JSON string.

### `json.write(filePath, data [, options])`

> Asynchronously writes a JSON file from the given JavaScript object and returns a `Promise`.  

**`options`**:_`Object|Function`_  
Stringify / write options or replacer function. If an `Object`, it can have the following properties:
- `replacer`:_`Function|Array`_  
Determines how object values are stringified for objects. It can be a function or an array of strings.
- `space`:_`Number|String`_  
Specifies the indentation of nested structures.
- `autoPath`:_`Boolean|Function`_   
Whether to create path directories if they don't exist. This will throw if set to `false` and path does not exist. Default: `true`
- `mode`:_`Number`_  
FileSystem permission mode to be used when writing the file. Default: `438` (`0666` in octal).

### `json.write.sync()`

> Synchronous version of [`json.write()`](#jsonwritefilepath-data--options).

## Change Log

- **v0.6.0** (2017-04-19)
    + Added `.normalize()` method.
    + Added `.parseSafe()`, `.parse.safe()` methods.
    + Removed unnecessary `whitespace` option from `parse()` and `.read()` methods.
    + Clean up.

- **v0.5.3** (2017-02-23)
    + Added TypeScript/typings support.
    + Added `.beautify()` method.

- **v0.5.1** (2017-02-17)
    + Fixed `decycler` reference for `.stringify()` method.

- **v0.5.0** (2017-02-16)
    + Initial release.


## License
MIT.


[strip-json-comments]:https://github.com/sindresorhus/strip-json-comments
[json-stringify-safe]:https://github.com/isaacs/json-stringify-safe
[parse-json]:https://github.com/sindresorhus/parse-json
[fs-extra]:https://www.npmjs.com/package/fs-extra
