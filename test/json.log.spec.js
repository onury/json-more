(function () {
    'use strict';

    const json = require('../index');

    xdescribe('json-more logs', function () {

        it('should log', function () {
            json.log('This test does not assert. Check logs...');
            json.log.pretty({ log: 'log', pretty: true }, 'extra arg', null);
            json.info.pretty({ log: 'info', pretty: true });
            json.warn.pretty({ log: 'warn', pretty: true });
        });

    });

})();
