(function () {
    'use strict';

    const json = require('../index');
    const fs = require('graceful-fs');
    const path = require('path');

    function _removeDirRecursiveSync(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                let curPath = path.join(dirPath, file);
                if (fs.statSync(curPath).isDirectory()) {
                    _removeDirRecursiveSync(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    }

    describe('json-more', function () {

        let validJsonWithComments = `
        // comments will be stripped...
        {
            "some": /* special */ "property",
            "value": 1 // don't change this!!!
        }
        `;

        let invalidJson = '[invalid JSON}';

        it('should throw on comments', function () {
            function throwOnComments() {
                return json.parse(validJsonWithComments);
            }
            expect(throwOnComments).toThrow();
        });

        it('should strip comments and parse', function () {
            let o = json.parse(validJsonWithComments, { stripComments: true });
            expect(typeof o).toEqual('object');
            expect(o.value).toEqual(1);
        });

        it('should parse safe', function () {
            expect(json.parse.safe).toEqual(json.parseSafe);

            let o = json.parse(validJsonWithComments, { safe: true });
            expect(typeof o).toEqual('object');
            expect(o.value).toEqual(1);

            o = json.parse.safe(invalidJson);
            expect(o instanceof Error).toEqual(true);

            function fn() { console.log(json.parse(invalidJson, { safe: false })); }
            expect(fn).toThrow();
        });

        it('should stringify', function () {
            expect(json.stringifySafe).toEqual(json.stringify.safe);

            let o = { a: 1, b: 'text' };
            expect(typeof json.stringify(o)).toEqual('string');
            let s = json.stringify(o, null, 2);
            expect(s.match(/^[ ]{2}.*$/gm).length).toEqual(Object.keys(o).length);

            let x = { a: 1, b: 'text'};
            x.y = x; // circular
            expect(function () { json.stringify(x); }).toThrow();
            expect(typeof json.stringifySafe(x)).toEqual('string');
            expect(typeof json.stringify.safe(x)).toEqual('string');
        });

        it('should normalize', function () {
            function MyClass() {
                this.a = 1;
                this.b = 'text';
            }
            let mc = new MyClass();
            let normalized = json.normalize(mc);
            expect(mc.constructor.name).toEqual('MyClass'); // for convinience
            expect(normalized.constructor.name).toEqual('Object');
        });

        it('should write/read file (async)', function (done) {
            let filePath = './test/tmp/test.json';
            let data = { test: 'file' };
            json.write(filePath, data)
                .then(() => {
                    return json.read(filePath);
                })
                .then(obj => {
                    expect(data.test).toEqual(obj.test);
                })
                .catch(err => {
                    expect(err).toBeUndefined();
                })
                .finally(() => {
                    _removeDirRecursiveSync(path.dirname(filePath));
                    done();
                });
        });

        it('should write/read file (sync)', function () {
            expect(json.read.sync).toEqual(json.readSync);
            expect(json.write.sync).toEqual(json.writeSync);

            let filePath = './test/tmp/test-sync.json';
            let data = { test: 'file' };
            json.write.sync(filePath, data);
            let obj = json.read.sync(filePath);
            expect(data.test).toEqual(obj.test);
            _removeDirRecursiveSync(path.dirname(filePath));
        });

    });

})();
