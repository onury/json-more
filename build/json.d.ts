declare class json {}
declare module json {
    interface Thenable <R> {
        then <U> (onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    }
    interface IParseOptions {
        reviver?:Function;
        stripComments?:boolean;
        whitespace?:boolean;
    }
    interface IStringifySafeOptions {
        replacer?:Function|Array<String>;
        space?:string|number;
        decycler?:Function;
    }
    interface IStringifyOptions extends IStringifySafeOptions {
        safe?:boolean|Function;
    }
    interface IWriteOptions {
        replacer?:Function|Array<String>;
        space?:string|number;
        mode?:number;
        autoPath?:boolean;
    }

    function parse(str:string, reviver?:Function):any;
    function parse(str:string, options?:IParseOptions):any;

    function stringify(value:any, replacer?:Function|Array<string>, space?:String|Number):string;
    function stringify(value:any, options?:IStringifyOptions):string;
    namespace stringify {
        function safe(value:any, replacer?:Function|Array<string>, space?:String|Number, decycler?:Function):string;
        function safe(value:any, options?:IStringifySafeOptions):string;
    }

    function uglify(str:string):string;

    function read(filePath:string, options?:IParseOptions):Thenable<any>;
    namespace read { function sync(filePath:string, options?:IParseOptions):any; }
    function readSync(filePath:string, options?:IParseOptions):any;

    function write(filePath:string, data:any, options?:IWriteOptions):Thenable<any>;
    namespace write { function sync(filePath:string, data:any, options?:IWriteOptions):any; }
    function writeSync(filePath:string, data:any, options?:IWriteOptions):any;

    function log(...args):void;
    namespace log { function pretty(...args):void; }
    function logPretty(...args):void;

    function info(...args):void;
    namespace info { function pretty(...args):void; }
    function infoPretty(...args):void;

    function warn(...args):void;
    namespace warn { function pretty(...args):void; }
    function warnPretty(...args):void;

    function error(...args):void;
    namespace error { function pretty(...args):void; }
    function errorPretty(...args):void;
}
export = json;
