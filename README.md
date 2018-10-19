# json-more

:warning: **DEPRECATED**!  
Use [**`jsonc`**](https://github.com/onury/jsonc) instead. Better implementation, better API.

> © 2018, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

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

## Change Log

- **v0.7.0** (2017-12-03)
    + Dependency updates.

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
