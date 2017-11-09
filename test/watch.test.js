const assert = require('assert');
const patterns = require('../src/patterns');
const whitelist = require('./whitelist');
const Watch = require('../src/main');

describe('test/pattern/watch.test.js', () => {

  Object.keys(patterns).forEach(key => {
    if (!whitelist || whitelist.length === 0 || whitelist.indexOf(key) > -1) {

      const pattern = patterns[key];

      it(`watch pattern: ${key}`, done => {
        const article = {
          url: pattern(null).meta.test,
          pattern: key,
        };

        const watch = new Watch();
        watch.run(article).then(data => {
          data.error && console.log('error: ', data.error.message);
          data.ctx && console.log(key, data.ctx);
          assert(!data.error);
          done();
        });

      });

    }
  });

});
