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

        let strJSON = `
        // comments will be stripped...
        {
            "some": /* special */ "property",
            "value": 1 // don't change this!!!
        }
        `;

        it('should throw on comments', function () {
            function throwOnComments() {
                return json.parse(strJSON);
            }
            expect(throwOnComments).toThrow();
        });

        it('should strip comments and parse', function () {
            let o = json.parse(strJSON, { stripComments: true });
            expect(typeof o).toEqual('object');
            expect(o.value).toEqual(1);
        });

        it('should stringify', function () {
            let o = { a: 1, b: 'text' };
            expect(typeof json.stringify(o)).toEqual('string');

            let s = json.stringify(o, null, 2);
            expect(s.match(/^[ ]{2}.*$/gm).length).toEqual(Object.keys(o).length);
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
            let filePath = './test/tmp/test-sync.json';
            let data = { test: 'file' };
            json.write.sync(filePath, data);
            let obj = json.read.sync(filePath);
            expect(data.test).toEqual(obj.test);
            _removeDirRecursiveSync(path.dirname(filePath));
        });

    });

})();
