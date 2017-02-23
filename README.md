# json-more

> © 2017, Onur Yıldırım (@onury). MIT License.

More JSON utilities for most JSON things in Node.js  

`npm i json-more --save`

## Features

- Strip comments from JSON strings.
- Safely stringify objects with circular references.
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
- [`json.parse()`](#jsonparsestring--reviver)
- [`json.read()`](#jsonreadfilepath--options)
- [`json.read.sync()`](#jsonreadsync)
- [`json.stringify()`](#jsonstringifyvalue--replacer--space)
- [`json.stringify.safe()`](#jsonstringifysafe)
- [`json.stripComments()`](#jsonstripcommentsstring)
- [`json.uglify()`](#jsonuglifystring)
- [`json.write()`](#jsonwritefilepath-data--options)
- [`json.write.sync()`](#jsonwritesync)

_If you don't like dot-dot methods, you can use camelCase aliases. e.g. `json.stringifySafe()` instead of `json.stringify.safe()`... you get the idea._

### `json.beautify(string [, space])`

Beautifies the given JSON string.

### `json.log(...args)`

You can use these convenience logger methods to easily stringify and log objects. Supports `console` methods such as `log()`, `info()`, `warn()` and `error()`. These methods will automatically handle circular references; so they won't throw.

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

### `json.parse(string [, reviver])`

Parses the given JSON string into a JavaScript object. This provides the same functionality and signature as native `JSON.parse()`.

For some extra options you can prefer the following overload:

#### `json.parse(string [, options])`  

**`options`**:_`Object|Function`_  
Parse options or reviver function. If an `Object`, it can have the following properties:

- `reviver`:_`Function`_  
A function to filter and transform the results.
- `stripComments`:_`Boolean`_  
Whether to strip comments from the JSON string.
- `whitespace`:_`Boolean`_  
Whether to leave whitespace in place of stripped comments. This only takes effect if `stripComments` is enabled.

### `json.read(filePath [, options])`

Asynchronously reads a JSON file, strips UTF-8 BOM and parses the JSON content and returns a `Promise`.

**`options`**:_`Object|Function`_  
Parse options or reviver function. If an `Object`, it can have the following properties:

- `reviver`:_`Function`_  
A function to filter and transform the results.
- `stripComments`:_`Boolean`_  
Whether to strip comments from the JSON string.
- `whitespace`:_`Boolean`_  
Whether to leave whitespace in place of stripped comments. This only takes effect if `stripComments` is enabled.

### `json.read.sync()`

Synchronous version for `json.read()`.

### `json.stringify(value [, replacer] [, space])`
Outputs a JSON string from the given JavaScript object. This provides the same functionality and signature as native `JSON.stringify()`.

For some extra options you can prefer the following overload:

#### `json.stringify(value [, options])`

**`options`**:_`Object|Function`_  
Stringify options or replacer function. If an `Object`, it can have the following properties:

- `replacer`:_`Function|Array`_  
Determines how object values are stringified for objects. It can be a function or an array of strings.
- `space`:_`Number|String`_  
Specifies the indentation of nested structures.
- `safe`:_`Boolean|Function`_  
Whether to safely stringify the given object and return the string `"[Circular]"` for each circular reference. You can pass a custom decycler function instead, with the following signature: `function(k, v) { }`.

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

Convenience method for `stringify()` with `safe` option enabled. You can pass a `decycler` function either within the `options` object or as the fourth argument.

### `json.stripComments(string)`

Comments are not a part of the JSON standard. But developers tend to use comments in JSON files (such as configuration files, etc).

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

Uglifies the given JSON string.

### `json.write(filePath, data [, options])`

Asynchronously writes a JSON file from the given JavaScript object and returns a `Promise`.  

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

Synchronous version for `json.write()`.

## Change Log

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
